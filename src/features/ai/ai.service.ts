import { attempt, type Response } from '../../utils/attempt/http'

export class AIService {
  constructor(private ai: AI) {}

  async transcribeMedia(mediaData: number[]): Promise<Response<string>> {
    return attempt(this.ai.run('@cf/openai/whisper', { audio: mediaData }))
  }
}
