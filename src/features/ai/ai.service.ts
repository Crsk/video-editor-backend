import { attempt, type Response } from '../../utils/attempt/http'

export type TranscribeResponse = {
  text: string
  word_count: number
  vtt: string
  words: { word: string; start: number; end: number }[]
}

export class AIService {
  constructor(private ai: AI) {}

  async transcribeMedia(input: { audio: number[] }): Promise<Response<TranscribeResponse>> {
    return attempt(this.ai.run('@cf/openai/whisper', input)).then(([error, response]) => [error, response])
  }
}
