import { AppEnvironment } from '../../core/types/environment'
import { Context } from 'hono'
import { StorageService } from './storage.service'
import { NoteService } from '../note/domain/note.service'
import { env } from 'hono/adapter'
import { newNote } from '../note/domain/new-note'

export class StorageController {
  constructor(private storageService: StorageService, private noteService: NoteService) {}

  upload = async (c: Context<AppEnvironment>) => {
    try {
      const formData = await c.req.formData()
      const files = formData.getAll('files') as File[]

      if (!files || files.length === 0) return c.json({ error: 'Missing media files to upload' }, 400)

      const result = await this.storageService.upload(files)
      const uploaded = result && result.urls && result.urls.length > 0

      if (uploaded) {
        const { BUCKET_PUBLIC_URL } = env<{ BUCKET_PUBLIC_URL: string }>(c)
        const videoUrl = `${BUCKET_PUBLIC_URL}/${result.keys[0]}`
        const userId = formData.get('userId') as string
        const note = newNote({ userId: userId, props: { videoUrl } })

        await this.noteService.createNote(note)

        return c.json({ urls: result.urls })
      } else return c.json({ error: 'Failed to upload media. No files were uploaded.' }, 400)
    } catch (error) {
      console.error('Error uploading media:', error)
      return c.json({ error: 'Failed to upload media. Please try again.' }, 500)
    }
  }
}
