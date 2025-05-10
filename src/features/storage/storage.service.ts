import { AppEnvironment } from '../../core/types/environment'
import { dateId } from '../../utils/date-id'
import { attempt, HttpError, Response } from '../../utils/attempt/http'

export class StorageService {
  constructor(private env: AppEnvironment['Bindings']) {}

  async upload(files: File[], bucketUrl: string, path: string): Promise<Response<Record<string, string>>> {
    const keyUrlMap: Record<string, string> = {}

    for (const file of files) {
      const id = dateId()
      const fileName = `${id}_${file.name}`
      const filePath = `${path}/${fileName}`
      const [error, data] = await attempt(this.env.R2.put(filePath, file))

      if (error || !data) return [error, null]

      const url = `${bucketUrl}/${filePath}`

      keyUrlMap[data.key] = url
    }

    if (Object.keys(keyUrlMap).length > 0) return [null, keyUrlMap]

    return [new HttpError('BAD_REQUEST', 'No files uploaded'), null]
  }
}
