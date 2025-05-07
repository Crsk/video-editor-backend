import { AppEnvironment } from '../../core/types/environment'

export class StorageService {
  constructor(private env: AppEnvironment['Bindings']) {}

  async upload(files: File[]) {
    const uploadKeys: string[] = []
    const urls: string[] = []

    for (const file of files) {
      let fileName = file.name
      if (fileName === 'blob' || !fileName.includes('.')) {
        const timestamp = Date.now()
        const fileType = file.type.split('/')[1] || 'bin'
        fileName = `file_${timestamp}.${fileType}`
      }

      const obj = await this.env.R2.put(`recordings/${fileName}`, file)

      if (obj) {
        uploadKeys.push(obj.key)
        const bucketUrl = this.env.R2_PUBLIC_URL || 'no-public-url'
        const url = `${bucketUrl}/${obj.key}`
        urls.push(url)
      }
    }

    return { keys: uploadKeys, urls }
  }
}
