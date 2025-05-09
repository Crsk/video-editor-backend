import { AppEnvironment } from '../../core/types/environment'
import { dateId } from '../../utils/date-id'
import { httpTry, HttpError, Response } from '../../utils/attempt/http'

export class StorageService {
  constructor(private env: AppEnvironment['Bindings']) {}

  async upload(files: File[], bucketUrl: string, path: string): Promise<Response<{ urls: string[] }>> {
    const uploadKeys: string[] = []
    const urls: string[] = []

    for (const file of files) {
      const id = dateId()
      const fileName = `${id}_${file.name}`
      const filePath = `${path}/${fileName}`
      const [error, data] = await httpTry(this.env.R2.put(filePath, file))

      if (error || !data) return [error, null]

      uploadKeys.push(data.key)
      const url = `${bucketUrl}/${filePath}`
      urls.push(url)
    }

    if (urls.length > 0) return [null, { urls }]

    return [new HttpError('BAD_REQUEST', 'No files uploaded'), null]
  }
}
