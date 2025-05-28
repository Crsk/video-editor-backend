import { type AIService } from '../../ai/ai.service'
import { Response, attempt, HttpError } from '../../../utils/attempt/http'
import { type TranscriptRepository } from '../infrastructure/transcript.repository'
import { CreateTranscript, Transcript } from '../domain/transcript.entity'
import { WhisperLargeInput } from '../../ai/ai.service'

export class TranscriptService {
  constructor(private aiService: AIService, private transcriptRepository: TranscriptRepository) {}

  async transcribeMedia({ mediaId, url }: { mediaId: string; url: string }): Promise<Response<boolean>> {
    return this.transcribeMedia({ mediaId, url })
  }

  async transcribeMediaV3({ mediaId, url }: { mediaId: string; url: string }): Promise<Response<boolean>> {
    console.log('Media ID:', mediaId)
    console.log('Media URL:', url)

    const [fetchError, res] = await attempt(fetch(url))
    if (fetchError) {
      console.log('Failed to fetch media file:', fetchError)

      return [fetchError, null]
    }
    if (!res) return [new HttpError('NOT_FOUND', 'Media file not found'), null]

    const blob = await res.arrayBuffer()
    if (!blob) {
      console.log('Failed to read media file:', 'Media file not found')

      return [new HttpError('INTERNAL_ERROR', 'Failed to read media file'), null]
    }

    const base64Audio = this.arrayBufferToBase64(blob)

    const input: WhisperLargeInput = {
      audio: base64Audio,
      task: 'transcribe',
      language: 'en',
      initial_prompt: 'You are a transcriptionist about a product called Sovran.'
    }

    const transcribeResponse = await this.aiService.transcribeMediaV3({ input })
    if (!transcribeResponse[1]) {
      console.log('Failed to transcribe media:', 'Media file not found')

      return [new HttpError('INTERNAL_ERROR', 'Failed to transcribe media'), null]
    }

    const { text, word_count, vtt, segments } = transcribeResponse[1]

    const transcriptData: CreateTranscript = {
      mediaId,
      text,
      wordCount: word_count,
      vtt,
      words: segments.map(segment => segment.words.map(word => word)).flat(),
      segments,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    console.log('Transcript data:', transcriptData)

    return this.upsertTranscript(transcriptData)
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])

    return btoa(binary)
  }

  async upsertTranscript(transcriptData: CreateTranscript): Promise<Response<boolean>> {
    const [error, success] = await this.transcriptRepository.upsertTranscript({ transcriptData })

    if (error) {
      console.log('Failed to upsert transcript:', error)

      return [error, null]
    }
    if (!success) return [new HttpError('INTERNAL_ERROR', 'Failed to upsert transcript'), null]

    return [null, true]
  }

  async getTranscriptByMediaId(mediaId: string): Promise<Response<Transcript | undefined>> {
    return this.transcriptRepository.getTranscriptByMediaId(mediaId)
  }
}
