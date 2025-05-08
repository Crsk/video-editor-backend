import { CreateVideo } from './video.entity'

export const newVideo = ({ userId, props }: { userId: string; props?: Partial<CreateVideo> }): CreateVideo => {
  return {
    id: props?.id || crypto.randomUUID(),
    userId,
    transcript: props?.transcript || '',
    audioUrls: props?.audioUrls || '',
    videoUrl: props?.videoUrl || ''
  }
}
