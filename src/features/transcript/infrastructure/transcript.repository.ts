import { drizzle } from 'drizzle-orm/d1'
import { attempt, type Response } from '../../../utils/attempt/http'
import { CreateTranscript } from '../domain/transcript.entity'
import { transcript } from './transcript.schema'

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
        .then(([result1]) => result1.success)
    )
  }
}
