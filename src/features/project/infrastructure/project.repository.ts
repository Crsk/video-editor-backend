import { drizzle } from 'drizzle-orm/d1'
import { eq, and } from 'drizzle-orm'
import { project } from './project.schema'
import { Project } from '../domain/project.entity'
import { attempt, type Response } from '../../../utils/attempt/http'
import { CreateVideo, Video } from '../../video/domain/video.entity'
import { videoToProject } from './video_to_project.schema'
import { video } from '../../video/infrastructure/video.schema'
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

  async getProjectVideos(id: string): Promise<Response<Video[]>> {
    const db = drizzle(this.db)

    return attempt(
      db
        .select()
        .from(videoToProject)
        .leftJoin(video, eq(videoToProject.videoId, video.id))
        .where(eq(videoToProject.projectId, id))
        .all()
        .then(results => results.map(({ video }) => video).filter(video => !!video))
    )
  }

  async getProjectVideo(projectId: string, videoId: string): Promise<Response<Video | undefined>> {
    const db = drizzle(this.db)

    return attempt(
      db
        .select()
        .from(videoToProject)
        .innerJoin(video, eq(videoToProject.videoId, video.id))
        .where(and(eq(videoToProject.projectId, projectId), eq(video.id, videoId)))
        .get()
        .then(result => result?.video)
    )
  }

  async upsertProject({
    projectId,
    userId,
    projectData
  }: {
    projectId: string
    userId: string
    projectData: any
  }): Promise<Response<boolean>> {
    const db = drizzle(this.db)

    return attempt(
      db.transaction(async tx => {
        const [projectError] = await attempt(
          tx
            .insert(project)
            .values({ id: projectId, ...projectData })
            .onConflictDoUpdate({
              target: project.id,
              set: projectData
            })
        )
        if (projectError) return false

        const [userToProjectError] = await attempt(
          tx.insert(userToProject).values({ userId, projectId }).onConflictDoNothing()
        )

        if (userToProjectError) return false

        return true
      })
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

  async addVideoToProject(projectId: string, videoData: CreateVideo): Promise<Response<boolean>> {
    const db = drizzle(this.db)

    return attempt(
      db.transaction(async tx => {
        const [err] = await attempt(tx.insert(video).values(videoData))
        const [err2] = await attempt(tx.insert(videoToProject).values({ projectId, videoId: videoData.id }))

        if (err || err2) return false
        return true
      })
    )
  }
}
