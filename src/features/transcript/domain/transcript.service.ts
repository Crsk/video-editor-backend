import { AIService } from '../../ai/ai.service'
import { Response } from '../../../utils/attempt/http'

export class TranscriptService {
  constructor(private aiService: AIService) {}

  async transcribeMedia(mediaData: number[]): Promise<Response<string>> {
    return this.aiService.transcribeMedia(mediaData)
  }
}
