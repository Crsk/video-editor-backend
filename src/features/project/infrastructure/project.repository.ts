import { drizzle } from 'drizzle-orm/d1'
import { eq, and } from 'drizzle-orm'
import { project } from './project.schema'
import { CreateProject, Project } from '../domain/project.entity'
import { attempt, type Response } from '../../../utils/attempt/http'
import { CreateMedia, Media } from '../../media/domain/media.entity'
import { mediaToProject } from './media_to_project.schema'
import { media } from '../../media/infrastructure/media.schema'
import { userToProject } from './user_to_project.schema'

export class ProjectRepository {
  constructor(private db: D1Database) {}

  async getAllProjects(): Promise<Response<Project[]>> {
    const db = drizzle(this.db)

    return attempt(db.select().from(project).all())
  }

  async getProjectById(id: string): Promise<Response<Project | undefined>> {
    const db = drizzle(this.db)

    return attempt(db.select().from(project).where(eq(project.id, id)).get())
  }

  async getProjectMedia(id: string): Promise<Response<Media[]>> {
    const db = drizzle(this.db)

    return attempt(
      db
        .select()
        .from(mediaToProject)
        .leftJoin(media, eq(mediaToProject.mediaId, media.id))
        .where(eq(mediaToProject.projectId, id))
        .all()
        .then(results => results.map(({ media }) => media).filter(media => !!media))
    )
  }

  async getProjectSingleMedia(projectId: string, mediaId: string): Promise<Response<Media | undefined>> {
    const db = drizzle(this.db)

    return attempt(
      db
        .select()
        .from(mediaToProject)
        .innerJoin(media, eq(mediaToProject.mediaId, media.id))
        .where(and(eq(mediaToProject.projectId, projectId), eq(media.id, mediaId)))
        .get()
        .then(result => result?.media)
    )
  }

  async upsertProject({
    projectId,
    userId,
    projectData
  }: {
    projectId: string
    userId: string
    projectData: CreateProject
  }): Promise<Response<boolean>> {
    const db = drizzle(this.db)

    return attempt(
      db
        .batch([
          db
            .insert(project)
            .values({ ...projectData, createdAt: new Date(), updatedAt: new Date() })
            .onConflictDoUpdate({
              target: project.id,
              set: { ...projectData, updatedAt: new Date() }
            }),
          db.insert(userToProject).values({ userId, projectId }).onConflictDoNothing()
        ])
        .then(([result1, result2]) => result1.success && result2.success)
    )
  }

  async deleteProject(id: string): Promise<Response<boolean>> {
    const db = drizzle(this.db)

    return attempt(
      db
        .delete(project)
        .where(eq(project.id, id))
        .returning()
        .get()
        .then(data => !!data)
    )
  }

  async addMediaToProject(projectId: string, mediaData: CreateMedia): Promise<Response<boolean>> {
    const db = drizzle(this.db)

    return attempt(
      db
        .batch([
          db.insert(media).values(mediaData),
          db.insert(mediaToProject).values({ projectId, mediaId: mediaData.id })
        ])
        .then(([result1, result2]) => {
          if (result1.success && result2.success) return true
          return false
        })
    )
  }
}
