import { Project } from './project.entity'
import { ProjectRepository } from '../infrastructure/project.repository'
import { Response } from '../../../utils/attempt/http'
import { CreateVideo, Video } from '../../video/domain/video.entity'
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

  async getProjectVideos({ projectId }: { projectId: string }): Promise<Response<Video[]>> {
    return this.projectRepository.getProjectVideos(projectId)
  }

  async getProjectVideo({
    projectId,
    videoId
  }: {
    projectId: string
    videoId: string
  }): Promise<Response<Video | undefined>> {
    return this.projectRepository.getProjectVideo(projectId, videoId)
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

  async addVideoToProject({
    projectId,
    videoData
  }: {
    projectId: string
    videoData: CreateVideo
  }): Promise<Response<boolean>> {
    return this.projectRepository.addVideoToProject(projectId, videoData)
  }
}
