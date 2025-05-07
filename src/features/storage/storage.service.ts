import { AppEnvironment } from '../../core/types/environment'

export class StorageService {
  constructor(private env: AppEnvironment['Bindings']) {}

  async upload(files: File[]) {
    const uploadKeys: string[] = []
    for (const file of files) {
      let fileName = file.name
      if (fileName === 'blob' || !fileName.includes('.')) {
        const timestamp = Date.now()
        const fileType = file.type.split('/')[1] || 'bin'
        fileName = `file_${timestamp}.${fileType}`
      }

      const obj = await this.env.R2.put(`recordings/${fileName}`, file)

      if (obj) uploadKeys.push(obj.key)
    }

    console.info('uploaded media', uploadKeys)
    return uploadKeys
  }
}
