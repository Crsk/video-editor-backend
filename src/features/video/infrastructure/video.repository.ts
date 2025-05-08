import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import { video } from './video.schema'
import { Video, CreateVideo, UpdateVideo } from '../domain/video.entity'

export class VideoRepository {
  constructor(private db: D1Database) {}

  async findById(id: string): Promise<Video | undefined> {
    const db = drizzle(this.db)

    return db.select().from(video).where(eq(video.id, id)).get()
  }

  async findAll(): Promise<Video[]> {
    const db = drizzle(this.db)

    return db.select().from(video).all()
  }

  async create(videoData: CreateVideo): Promise<Video> {
    const db = drizzle(this.db)

    return db.insert(video).values(videoData).returning().get()
  }

  async update(id: string, videoData: UpdateVideo): Promise<Video | undefined> {
    const db = drizzle(this.db)

    return db.update(video).set(videoData).where(eq(video.id, id)).returning().get()
  }

  async delete(id: string): Promise<boolean> {
    const db = drizzle(this.db)
    const result = await db.delete(video).where(eq(video.id, id))

    return result.success
  }
}
