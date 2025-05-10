import { CreateProject } from './project.entity'

export const newProject = ({ id, ...props }: { id: string } & Partial<CreateProject>): CreateProject => {
  return {
    id,
    name: props?.name || '',
    description: props?.description || '',
    createdAt: props?.createdAt || new Date(),
    updatedAt: props?.updatedAt || new Date()
  }
}
