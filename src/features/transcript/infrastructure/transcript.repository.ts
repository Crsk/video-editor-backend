import { drizzle } from 'drizzle-orm/d1'
import { attempt, type Response, HttpError } from '../../../utils/attempt/http'
import { CreateTranscript, Transcript } from '../domain/transcript.entity'
import { transcript } from './transcript.schema'
import { eq } from 'drizzle-orm'

export class TranscriptRepository {
  constructor(private db: D1Database) {}

  async upsertTranscript({ transcriptData }: { transcriptData: CreateTranscript }): Promise<Response<boolean>> {
    const db = drizzle(this.db)

    return attempt(
      db
        .batch([
          db
            .insert(transcript)
            .values({ ...transcriptData, createdAt: new Date(), updatedAt: new Date() })
            .onConflictDoUpdate({
              target: transcript.mediaId,
              set: { ...transcriptData, updatedAt: new Date() }
            })
        ])
        .then(([result]) => result.success)
    )
  }

  async getTranscriptByMediaId(mediaId: string): Promise<Response<Transcript | undefined>> {
    const db = drizzle(this.db)

    return attempt(db.select().from(transcript).where(eq(transcript.mediaId, mediaId)).get())
  }
}
