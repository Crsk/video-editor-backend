import { Context } from 'hono'
import { TranscriptService } from '../domain/transcript.service'
import { AppEnvironment } from '../../../core/types/environment'
import { withLogging } from '../../../utils/with-logging'

export class TranscriptController {
  constructor(private transcriptService: TranscriptService) {}

  transcribeMedia = async (c: Context<AppEnvironment>) => {
    const formData = await c.req.formData()
    const mediaFile = formData.get('media')

    if (!mediaFile || !(mediaFile instanceof Blob))
      return c.json({ success: false, message: 'Missing media blob to transcribe' }, 400)

    const mediaBuffer = await mediaFile.arrayBuffer()
    const mediaArray = [...new Uint8Array(mediaBuffer)]

    const [error, text] = await withLogging('Transcribing media', { mediaFile, mediaArray }, () =>
      this.transcriptService.transcribeMedia(mediaArray)
    )

    if (error) return c.json({ success: false, message: error.message }, error.code)

    return c.json({ success: true, data: { text } })
  }
}
