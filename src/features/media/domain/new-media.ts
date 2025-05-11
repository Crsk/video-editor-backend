import { CreateMedia } from './media.entity'

export const newMedia = ({ id, ...props }: { id: string } & Partial<CreateMedia>): CreateMedia => {
  return {
    id,
    transcript: props?.transcript || '',
    audioUrls: props?.audioUrls || '',
    url: props?.url || '',
    createdAt: props?.createdAt || new Date(),
    updatedAt: props?.updatedAt || new Date()
  }
}
