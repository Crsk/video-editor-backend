import { DeleteWorkspace, Workspace } from './workspace.entity'
import { type WorkspaceRepository } from '../infrastructure/workspace.repository'
import { Response } from '../../../utils/attempt/http'
import { CreateMedia, Media } from '../../media/domain/media.entity'
import { CreateWorkspace } from './workspace.entity'
import { type StorageService } from '../../storage/storage.service'
import { type TranscriptService } from '../../transcript/domain/transcript.service'
import { Transcript } from '../../transcript/domain/transcript.entity'

export class WorkspaceService {
  constructor(
    private workspaceRepository: WorkspaceRepository,
    private storageService: StorageService,
    private transcriptService: TranscriptService
  ) {}

  async getAllWorkspaces(): Promise<Response<Workspace[]>> {
    return this.workspaceRepository.getAllWorkspaces()
  }

  async getWorkspaceById({ workspaceId }: { workspaceId: string }): Promise<Response<Workspace | undefined>> {
    return this.workspaceRepository.getWorkspaceById(workspaceId)
  }

  async getWorkspaceMedia({
    workspaceId,
    includeTranscript
  }: {
    workspaceId: string
    includeTranscript?: boolean
  }): Promise<Response<(Media & { transcript?: Transcript })[]>> {
    const [error, mediaItems] = await this.workspaceRepository.getWorkspaceMedia(workspaceId)

    if (error || !mediaItems || !includeTranscript || !this.transcriptService) {
      return [error, mediaItems as (Media & { transcript?: Transcript })[]]
    }

    const mediaWithTranscripts = await Promise.all(
      mediaItems.map(async mediaItem => {
        const [transcriptError, transcript] = await this.transcriptService!.getTranscriptByMediaId(mediaItem.id)
        return {
          ...mediaItem,
          transcript: transcriptError || transcript === null ? undefined : transcript
        }
      })
    )

    return [null, mediaWithTranscripts]
  }

  async getWorkspaceSingleMedia({
    workspaceId,
    mediaId,
    includeTranscript
  }: {
    workspaceId: string
    mediaId: string
    includeTranscript?: boolean
  }): Promise<Response<(Media & { transcript?: Transcript }) | undefined>> {
    const [error, mediaItem] = await this.workspaceRepository.getWorkspaceSingleMedia(workspaceId, mediaId)

    if (error || !mediaItem || !includeTranscript || !this.transcriptService) {
      return [error, mediaItem as Media & { transcript?: Transcript }]
    }

    const [transcriptError, transcript] = await this.transcriptService.getTranscriptByMediaId(mediaId)

    return [
      null,
      {
        ...mediaItem,
        transcript: transcriptError || transcript === null ? undefined : transcript
      }
    ]
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
