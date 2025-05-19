import { DeleteWorkspace, Workspace } from './workspace.entity'
import { type WorkspaceRepository } from '../infrastructure/workspace.repository'
import { Response } from '../../../utils/attempt/http'
import { CreateMedia, Media } from '../../media/domain/media.entity'
import { CreateWorkspace } from './workspace.entity'
import { type StorageService } from '../../storage/storage.service'

export class WorkspaceService {
  constructor(private workspaceRepository: WorkspaceRepository, private storageService: StorageService) {}

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

  async deleteWorkspace({ workspaceId, userId }: DeleteWorkspace & { userId?: string }): Promise<Response<boolean>> {
    if (this.storageService && userId) {
      const [storageError] = await this.storageService.deleteWorkspaceFiles(userId, workspaceId)

      if (storageError) console.error('Failed to delete workspace files:', storageError)
    }

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

  async deleteMedia({ workspaceId, mediaId }: { workspaceId: string; mediaId: string }): Promise<Response<boolean>> {
    return this.workspaceRepository.deleteMedia({ workspaceId, mediaId })
  }
}
