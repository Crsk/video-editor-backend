import { AppEnvironment } from '../../core/types/environment'
import { attempt, HttpError, Response } from '../../utils/attempt/http'
import { v7 as uuid } from 'uuid'

export class StorageService {
  constructor(private env: AppEnvironment['Bindings']) {}

  async upload(
    files: File[],
    bucketUrl: string,
    path: string
  ): Promise<Response<{ id: string; url: string; type: 'audio' | 'video' }[]>> {
    const uploadData: { id: string; url: string; type: 'audio' | 'video' }[] = []

    for (const file of files) {
      const id = uuid()
      const filePath = `${path}/${id}`
      const type = file.type.startsWith('video') ? 'video' : file.name.endsWith('.mp4') ? 'video' : 'audio' // TODO support more types
      console.log('type', type)
      const [error, data] = await attempt(this.env.R2.put(filePath, file))

      if (error || !data) return [error, null]

      const url = `${bucketUrl}/${filePath}`
      uploadData.push({ id, url, type })
    }

    if (uploadData.length > 0) return [null, uploadData]

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

  async deleteMedia({
    userId,
    workspaceId,
    mediaId
  }: {
    userId: string
    workspaceId: string
    mediaId: string
  }): Promise<Response<boolean>> {
    const prefix = `recordings/${userId}/${workspaceId}/${mediaId}`

    return attempt(this.env.R2.delete(prefix)).then(([error]) => [error, !error])
  }
}
