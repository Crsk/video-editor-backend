import { AppEnvironment } from '../../core/types/environment'
import { dateId } from '../../utils/date-id'
import { attempt, HttpError, Response } from '../../utils/attempt/http'

export class StorageService {
  constructor(private env: AppEnvironment['Bindings']) {}

  async upload(files: File[], bucketUrl: string, path: string): Promise<Response<{ urls: string[] }>> {
    const urls: string[] = []

    for (const file of files) {
      const id = dateId()
      const fileName = `${id}_${file.name}`
      const filePath = `${path}/${fileName}`
      const [error, data] = await attempt(this.env.R2.put(filePath, file))

      if (error || !data) return [error, null]

      const url = `${bucketUrl}/${filePath}`
      urls.push(url)
    }

    if (urls.length > 0) return [null, { urls }]

    return [new HttpError('BAD_REQUEST', 'No files uploaded'), null]
  }

  async deleteWorkspaceFiles(userId: string, workspaceId: string): Promise<Response<boolean>> {
    const prefix = `recordings/${userId}/${workspaceId}/`

    const objects = await this.env.R2.list({ prefix })

    if (objects.objects.length === 0) return [null, true]

    const deletePromises = objects.objects.map(obj => attempt(this.env.R2.delete(obj.key)))
    const results = await Promise.all(deletePromises)
    const hasErrors = results.some(([error]) => error !== null)

    if (hasErrors) return [new HttpError('INTERNAL_ERROR', 'Failed to delete some workspace files'), null]

    return [null, true]
  }
}
