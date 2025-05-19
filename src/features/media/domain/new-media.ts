import { CreateMedia } from './media.entity'

export const newMedia = ({ id, ...props }: { id: string } & Partial<CreateMedia>): CreateMedia => {
  return {
    id,
    url: props?.url || '',
    type: props?.type || 'video',
    createdAt: props?.createdAt || new Date(),
    updatedAt: props?.updatedAt || new Date()
  }
}
