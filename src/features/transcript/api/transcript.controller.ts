/* import { Context } from 'hono' */
import { type TranscriptService } from '../domain/transcript.service'
/* import { AppEnvironment } from '../../../core/types/environment'
import { withLogging } from '../../../utils/with-logging' */

export class TranscriptController {
  constructor(private transcriptService: TranscriptService) {}

  /* getTranscriptByMediaId = async (c: Context<AppEnvironment>) => {
    const mediaId = c.req.param('mediaId')

    const [error, transcript] = await withLogging('Fetching transcript by media id', { mediaId }, () =>
      this.transcriptService.getTranscriptByMediaId(mediaId)
    )

    if (error) return c.json({ success: false, message: error.message }, error.code)
    if (!transcript) return c.json({ success: false, message: 'Transcript not found' }, 404)

    return c.json({ success: true, data: transcript })
  } */
}
