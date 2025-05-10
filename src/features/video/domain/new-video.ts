import { CreateVideo } from './video.entity'

export const newVideo = ({ id, ...props }: { id: string } & Partial<CreateVideo>): CreateVideo => {
  return {
    id,
    transcript: props?.transcript || '',
    audioUrls: props?.audioUrls || '',
    videoUrl: props?.videoUrl || '',
    createdAt: props?.createdAt || new Date(),
    updatedAt: props?.updatedAt || new Date()
  }
}
