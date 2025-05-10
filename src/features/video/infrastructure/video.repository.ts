import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import { video } from './video.schema'
import { Video, CreateVideo, UpdateVideo } from '../domain/video.entity'
import { attempt, type Response } from '../../../utils/attempt/http'

export class VideoRepository {
  constructor(private db: D1Database) {}

  async findById(id: string): Promise<Response<Video | undefined>> {
    const db = drizzle(this.db)

    return attempt(db.select().from(video).where(eq(video.id, id)).get())
  }

  async findAll(): Promise<Response<Video[]>> {
    const db = drizzle(this.db)

    return attempt(db.select().from(video).all())
  }

  async create(videoData: CreateVideo): Promise<Response<Video>> {
    const db = drizzle(this.db)

    return await attempt(db.insert(video).values(videoData).returning().get())
  }

  async update(id: string, videoData: UpdateVideo): Promise<Response<Video | undefined>> {
    const db = drizzle(this.db)

    return attempt(db.update(video).set(videoData).where(eq(video.id, id)).returning().get())
  }

  async delete(id: string): Promise<Response<boolean>> {
    const db = drizzle(this.db)
    const [error] = await attempt(db.delete(video).where(eq(video.id, id)))

    if (error) return [error, false]

    return [null, true]
  }

  async findByUserId(userId: string): Promise<Response<Video[]>> {
    const db = drizzle(this.db)

    return attempt(db.select().from(video).where(eq(video.userId, userId)).all())
  }
}
