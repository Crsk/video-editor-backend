import { type AIService } from '../../ai/ai.service'
import { Response, attempt, HttpError } from '../../../utils/attempt/http'
import { type TranscriptRepository } from '../infrastructure/transcript.repository'
import { CreateTranscript, Transcript } from '../domain/transcript.entity'

export class TranscriptService {
  constructor(private aiService: AIService, private transcriptRepository: TranscriptRepository) {}

  async transcribeMedia({ mediaId, url }: { mediaId: string; url: string }): Promise<Response<boolean>> {
    const [fetchError, res] = await attempt(fetch(url))
    if (fetchError) return [fetchError, null]
    if (!res) return [new HttpError('NOT_FOUND', 'Media file not found'), null]

    const [blobError, blob] = await attempt(res.arrayBuffer())
    if (blobError) return [blobError, null]
    if (!blob) return [new HttpError('INTERNAL_ERROR', 'Failed to read media file'), null]

    const input = { audio: [...new Uint8Array(blob)] }
    const [aiError, aiResponse] = await attempt(this.aiService.transcribeMedia(input))
    if (aiError) return [aiError, null]
    if (!aiResponse || !aiResponse[1]) return [new HttpError('INTERNAL_ERROR', 'Failed to transcribe media'), null]

    const { text, word_count, vtt, words } = aiResponse[1]

    const transcriptData: CreateTranscript = {
      mediaId,
      text,
      wordCount: word_count,
      vtt,
      words,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return this.upsertTranscript(transcriptData)
  }

  async upsertTranscript(transcriptData: CreateTranscript): Promise<Response<boolean>> {
    const [error, success] = await this.transcriptRepository.upsertTranscript({ transcriptData })

    if (error) return [error, null]
    if (!success) return [new HttpError('INTERNAL_ERROR', 'Failed to upsert transcript'), null]

    return [null, true]
  }

  async getTranscriptByMediaId(mediaId: string): Promise<Response<Transcript | undefined>> {
    return this.transcriptRepository.getTranscriptByMediaId(mediaId)
  }
}
