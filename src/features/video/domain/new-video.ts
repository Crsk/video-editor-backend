import { CreateVideo } from './video.entity'

export const newVideo = ({ props }: { props?: Partial<CreateVideo> }): CreateVideo => {
  return {
    id: props?.id || crypto.randomUUID(),
    transcript: props?.transcript || '',
    audioUrls: props?.audioUrls || '',
    videoUrl: props?.videoUrl || '',
    createdAt: props?.createdAt || new Date(),
    updatedAt: props?.updatedAt || new Date()
  }
}
