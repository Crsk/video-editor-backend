import { Context } from 'hono'
import { TranscribeService } from '../domain/transcribe.service'
import { AppEnvironment } from '../../../core/types/environment'

export class TranscribeController {
  constructor(private transcribeService: TranscribeService) {}

  transcribeMedia = async (c: Context<AppEnvironment>) => {
    try {
      const formData = await c.req.formData()
      const mediaFile = formData.get('media')

      if (!mediaFile || !(mediaFile instanceof Blob)) return c.json({ error: 'Missing media blob to transcribe' }, 400)

      const mediaBuffer = await mediaFile.arrayBuffer()
      const mediaArray = [...new Uint8Array(mediaBuffer)]

      const text = await this.transcribeService.transcribeMedia(mediaArray)
      return c.json({ text })
    } catch (error) {
      console.error('Error transcribing media:', error)
      return c.json({ error: 'Failed to transcribe media. Please try again.' }, 500)
    }
  }
}
