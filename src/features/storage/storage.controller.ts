import { AppEnvironment } from '../../core/types/environment'
import { Context } from 'hono'
import { StorageService } from './storage.service'

export class StorageController {
  constructor(private storageService: StorageService) {}

  upload = async (c: Context<AppEnvironment>) => {
    try {
      const formData = await c.req.formData()
      const files = formData.getAll('files') as File[]

      if (!files || files.length === 0) return c.json({ error: 'Missing media files to upload' }, 400)

      const uploadKeys = await this.storageService.upload(files)
      const uploaded = uploadKeys && uploadKeys.length > 0

      uploaded
        ? c.json({ keys: uploadKeys })
        : c.json({ error: 'Failed to upload media. No files were uploaded.' }, 400)
    } catch (error) {
      console.error('Error uploading media:', error)
      return c.json({ error: 'Failed to upload media. Please try again.' }, 500)
    }
  }
}
