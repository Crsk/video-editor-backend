import { type AIService } from '../../ai/ai.service'
import { Response } from '../../../utils/attempt/http'
import { attempt } from '../../../utils/attempt/http'
import { HttpError } from '../../../utils/attempt/http'
import { type TranscriptRepository } from '../infrastructure/transcript.repository'
import { CreateTranscript } from '../domain/transcript.entity'

export class TranscriptService {
  constructor(private aiService: AIService, private transcriptRepository: TranscriptRepository) {}

  async transcribeMedia({ mediaId, url }: { mediaId: string; url: string }): Promise<Response<boolean>> {
    const res = await fetch(url)
    const blob = await res.arrayBuffer()
    const input = { audio: [...new Uint8Array(blob)] }
    const [error, response] = await attempt(this.aiService.transcribeMedia(input))

    if (error) return [error, null]
    if (!response) return [new HttpError('INTERNAL_ERROR', 'Failed to transcribe media'), null]

    const data = response[1]
    if (!data) return [new HttpError('INTERNAL_ERROR', 'Failed to transcribe media'), null]

    const { text, word_count, vtt, words } = data

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
    const [error, success] = await attempt(this.transcriptRepository.upsertTranscript({ transcriptData }))

    if (error) return [error, null]
    if (!success) return [new HttpError('INTERNAL_ERROR', 'Failed to upsert transcript'), null]

    return [null, true]
  }
}
