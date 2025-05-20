import { drizzle } from 'drizzle-orm/d1'
import { eq, and, inArray } from 'drizzle-orm'
import { workspace } from './workspace.schema'
import { CreateWorkspace, DeleteWorkspace, Workspace } from '../domain/workspace.entity'
import { attempt, type Response } from '../../../utils/attempt/http'
import { CreateMedia, Media } from '../../media/domain/media.entity'
import { mediaToWorkspace } from './media_to_workspace.schema'
import { media } from '../../media/infrastructure/media.schema'
import { userToWorkspace } from './user_to_workspace.schema'

export class WorkspaceRepository {
  constructor(private db: D1Database) {}

  async getAllWorkspaces(): Promise<Response<Workspace[]>> {
    const db = drizzle(this.db)

    return attempt(db.select().from(workspace).all())
  }

  async getWorkspaceById(id: string): Promise<Response<Workspace | undefined>> {
    const db = drizzle(this.db)

    return attempt(db.select().from(workspace).where(eq(workspace.id, id)).get())
  }

  async getWorkspaceMedia(id: string): Promise<Response<Media[]>> {
    const db = drizzle(this.db)

    return attempt(
      db
        .select()
        .from(mediaToWorkspace)
        .leftJoin(media, eq(mediaToWorkspace.mediaId, media.id))
        .where(eq(mediaToWorkspace.workspaceId, id))
        .all()
        .then(results => results.map(({ media }) => media).filter(media => !!media))
    )
  }

  async getWorkspaceSingleMedia(workspaceId: string, mediaId: string): Promise<Response<Media | undefined>> {
    const db = drizzle(this.db)

    return attempt(
      db
        .select()
        .from(mediaToWorkspace)
        .innerJoin(media, eq(mediaToWorkspace.mediaId, media.id))
        .where(and(eq(mediaToWorkspace.workspaceId, workspaceId), eq(media.id, mediaId)))
        .get()
        .then(result => result?.media)
    )
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
    const db = drizzle(this.db)

    return attempt(
      db
        .batch([
          db
            .insert(workspace)
            .values({ ...workspaceData, createdAt: new Date(), updatedAt: new Date() })
            .onConflictDoUpdate({
              target: workspace.id,
              set: { ...workspaceData, updatedAt: new Date() }
            }),
          db.insert(userToWorkspace).values({ userId, workspaceId }).onConflictDoNothing()
        ])
        .then(([result1, result2]) => result1.success && result2.success)
    )
  }

  async deleteWorkspace({ workspaceId }: DeleteWorkspace): Promise<Response<boolean>> {
    const db = drizzle(this.db)

    // Avoiding Transaction due to https://github.com/drizzle-team/drizzle-orm/issues/2463
    // Internally it cascade deletes user_to_workspace and media_to_workspace
    return attempt(
      db
        .batch([
          db
            .delete(media)
            .where(
              inArray(
                media.id,
                db
                  .select({ id: media.id })
                  .from(media)
                  .innerJoin(mediaToWorkspace, eq(media.id, mediaToWorkspace.mediaId))
                  .where(eq(mediaToWorkspace.workspaceId, workspaceId))
              )
            ),
          db.delete(workspace).where(eq(workspace.id, workspaceId))
        ])
        .then(([result1, result2]) => result1.success && result2.success)
    )
  }

  async addMediaToWorkspace({
    workspaceId,
    mediaData
  }: {
    workspaceId: string
    mediaData: CreateMedia
  }): Promise<Response<boolean>> {
    const db = drizzle(this.db)

    return attempt(
      db
        .batch([
          db.insert(media).values(mediaData),
          db.insert(mediaToWorkspace).values({ workspaceId, mediaId: mediaData.id })
        ])
        .then(([result1, result2]) => {
          if (result1.success && result2.success) return true
          return false
        })
    )
  }

  async deleteMedia({ workspaceId, mediaId }: { workspaceId: string; mediaId: string }): Promise<Response<boolean>> {
    const db = drizzle(this.db)

    return attempt(
      db
        .batch([
          db
            .delete(mediaToWorkspace)
            .where(and(eq(mediaToWorkspace.workspaceId, workspaceId), eq(mediaToWorkspace.mediaId, mediaId))),
          db.delete(media).where(eq(media.id, mediaId))
        ])
        .then(([result1, result2]) => result1.success && result2.success)
    )
  }
}
