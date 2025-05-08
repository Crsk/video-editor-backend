import { CreateNote } from './note.entity'

export const newNote = ({ userId, props }: { userId: string; props?: Partial<CreateNote> }): CreateNote => {
  return {
    id: props?.id || crypto.randomUUID(),
    userId,
    text: props?.text || '',
    audioUrls: props?.audioUrls || '',
    videoUrl: props?.videoUrl || ''
  }
}
