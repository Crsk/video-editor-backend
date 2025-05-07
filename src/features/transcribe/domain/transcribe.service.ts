import { AIService } from '../../ai/ai.service'

export class TranscribeService {
  constructor(private aiService: AIService) {}

  async transcribeMedia(mediaData: number[]): Promise<string> {
    return this.aiService.transcribeMedia(mediaData)
  }
}
