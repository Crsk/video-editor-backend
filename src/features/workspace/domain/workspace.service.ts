import { DeleteWorkspace, Workspace } from './workspace.entity'
import { WorkspaceRepository } from '../infrastructure/workspace.repository'
import { Response } from '../../../utils/attempt/http'
import { CreateMedia, Media } from '../../media/domain/media.entity'
import { CreateWorkspace } from './workspace.entity'

export class WorkspaceService {
  constructor(private workspaceRepository: WorkspaceRepository) {}

  async getAllWorkspaces(): Promise<Response<Workspace[]>> {
    return this.workspaceRepository.getAllWorkspaces()
  }

  async getWorkspaceById({ workspaceId }: { workspaceId: string }): Promise<Response<Workspace | undefined>> {
    return this.workspaceRepository.getWorkspaceById(workspaceId)
  }

  async getWorkspaceMedia({ workspaceId }: { workspaceId: string }): Promise<Response<Media[]>> {
    return this.workspaceRepository.getWorkspaceMedia(workspaceId)
  }

  async getWorkspaceSingleMedia({
    workspaceId,
    mediaId
  }: {
    workspaceId: string
    mediaId: string
  }): Promise<Response<Media | undefined>> {
    return this.workspaceRepository.getWorkspaceSingleMedia(workspaceId, mediaId)
  }

  async upsertWorkspace({
    workspaceId,
    userId,
    workspaceData
  }: {
    workspaceId: string
    userId: string
    workspaceData: CreateWorkspace
  }): Promise<Response<boolean>> {
    return this.workspaceRepository.upsertWorkspace({ workspaceId, userId, workspaceData })
  }

  async deleteWorkspace({ workspaceId }: DeleteWorkspace): Promise<Response<boolean>> {
    return this.workspaceRepository.deleteWorkspace({ workspaceId })
  }

  async addMediaToWorkspace({
    workspaceId,
    mediaData
  }: {
    workspaceId: string
    mediaData: CreateMedia
  }): Promise<Response<boolean>> {
    return this.workspaceRepository.addMediaToWorkspace({ workspaceId, mediaData })
  }
}
