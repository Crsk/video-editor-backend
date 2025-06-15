import { drizzle } from 'drizzle-orm/d1'
import { eq, sum } from 'drizzle-orm'
import { credit } from './credit.schema'
import { Credit } from '../domain/credit.entity'
import { attempt, Response } from '../../../utils/attempt/http'

export class CreditRepository {
  constructor(private db: D1Database) {}

  async getUserCreditBalance({ userId }: { userId: string }): Promise<Response<number>> {
    const db = drizzle(this.db)

    return attempt(
      db
        .select({
          totalCredits: sum(credit.amount).mapWith(Number)
        })
        .from(credit)
        .where(eq(credit.userId, userId))
        .get()
        .then(result => result?.totalCredits || 0)
    )
  }

  async createCredit({
    id,
    amount,
    userId
  }: {
    id: string
    amount: number
    userId: string
  }): Promise<Response<Credit | undefined>> {
    const db = drizzle(this.db)

    return attempt(db.insert(credit).values({ id, amount, userId, createdAt: new Date() }).returning().get())
  }
}
