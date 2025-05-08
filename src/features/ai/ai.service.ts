export class AIService {
  constructor(private ai: AI) {}

  async transcribeMedia(mediaData: number[]): Promise<string> {
    try {
      const response = await this.ai.run('@cf/openai/whisper', { audio: mediaData })

      return response.text
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw new Error('Failed to transcribe media')
    }
  }
}
