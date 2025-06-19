import { drizzle } from 'drizzle-orm/d1'
import { credit } from './credit.schema'
import { Credit } from '../domain/credit.entity'
import { attempt, Response } from '../../../utils/attempt/http'

export class CreditRepository {
  constructor(private db: D1Database) {}

  async createCredit({
    id,
    amount,
    teamId
  }: {
    id: string
    amount: number
    teamId: string
  }): Promise<Response<Credit | undefined>> {
    const db = drizzle(this.db)

    return attempt(db.insert(credit).values({ id, amount, teamId, createdAt: new Date() }).returning().get())
  }
}
