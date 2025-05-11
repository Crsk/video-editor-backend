import { Project } from './project.entity'
import { ProjectRepository } from '../infrastructure/project.repository'
import { Response } from '../../../utils/attempt/http'
import { CreateMedia, Media } from '../../media/domain/media.entity'
import { UpdateProject } from '../domain/project.entity'
import { newProject } from './new-project'

export class ProjectService {
  constructor(private projectRepository: ProjectRepository) {}

  async getAllProjects(): Promise<Response<Project[]>> {
    return this.projectRepository.getAllProjects()
  }

  async getProjectById({ projectId }: { projectId: string }): Promise<Response<Project | undefined>> {
    return this.projectRepository.getProjectById(projectId)
  }

  async getProjectMedia({ projectId }: { projectId: string }): Promise<Response<Media[]>> {
    return this.projectRepository.getProjectMedia(projectId)
  }

  async getProjectSingleMedia({
    projectId,
    mediaId
  }: {
    projectId: string
    mediaId: string
  }): Promise<Response<Media | undefined>> {
    return this.projectRepository.getProjectSingleMedia(projectId, mediaId)
  }

  async upsertProject({
    projectId,
    userId,
    projectData
  }: {
    projectId: string
    userId: string
    projectData: UpdateProject
  }): Promise<Response<boolean>> {
    const validProject = newProject({ id: projectId, ...projectData })
    return this.projectRepository.upsertProject({ projectId, userId, projectData: validProject })
  }

  async deleteProject({ projectId }: { projectId: string }): Promise<Response<boolean>> {
    return this.projectRepository.deleteProject(projectId)
  }

  async addMediaToProject({
    projectId,
    mediaData
  }: {
    projectId: string
    mediaData: CreateMedia
  }): Promise<Response<boolean>> {
    return this.projectRepository.addMediaToProject(projectId, mediaData)
  }
}
