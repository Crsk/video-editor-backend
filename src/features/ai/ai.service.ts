import { attempt, type Response } from '../../utils/attempt/http'

export type TranscribeResponse = {
  text: string
  word_count: number
  vtt: string
  words: { word: string; start: number; end: number }[]
}

export type TranscribeLargeResponse = {
  text: string
  word_count: number
  vtt: string
  transcription_info: {
    language: string
    language_probability: number
    duration: number
    duration_after_vad: number
  }
  segments: {
    start: number
    end: number
    text: string
    temperature: number
    avg_logprob: number
    compression_ratio: number
    no_speech_prob: number
    words: { word: string; start: number; end: number }[]
  }[]
  words: { word: string; start: number; end: number }[]
}

export type WhisperLargeInput = {
  audio: string
  task?: 'translate' | 'transcribe'
  language?: string
  vad_filter?: boolean
  initial_prompt?: string
  prefix?: string
}

export class AIService {
  constructor(private ai: AI) {}

  async transcribeMedia(input: { audio: number[] }): Promise<Response<TranscribeResponse>> {
    return attempt(this.ai.run('@cf/openai/whisper', input)).then(([error, response]) => [error, response])
  }

  async transcribeMediaV3({ input }: { input: WhisperLargeInput }): Promise<Response<TranscribeLargeResponse>> {
    return attempt<TranscribeLargeResponse>(
      this.ai.run('@cf/openai/whisper-large-v3-turbo', input).catch(reason => console.log(reason))
    ).then(([error, response]) => [error, response])
  }
}
