import { drizzle } from 'drizzle-orm/d1'
import { team } from './team.schema'
import { type CreateTeam, type Team } from '../domain/team.entity'
import { attempt, type Response } from '../../../utils/attempt/http'
import { eq, sum } from 'drizzle-orm'
import { credit } from '../../credit/infrastructure/credit.schema'

export class TeamRepository {
  constructor(private db: D1Database) {}

  async upsertTeam({ teamData }: { teamData: CreateTeam }): Promise<Response<Team | undefined>> {
    const db = drizzle(this.db)

    return attempt(
      db
        .insert(team)
        .values({ ...teamData, createdAt: new Date(), updatedAt: new Date() })
        .onConflictDoUpdate({ target: team.id, set: { ...teamData, updatedAt: new Date() } })
        .returning()
        .get()
    )
  }

  async deleteTeam({ teamId }: { teamId: string }): Promise<Response<Team | undefined>> {
    const db = drizzle(this.db)

    return attempt(db.delete(team).where(eq(team.id, teamId)).returning().get())
  }

  async getTeamCreditBalance({ teamId }: { teamId: string }): Promise<Response<number>> {
    const db = drizzle(this.db)

    return attempt(
      db
        .select({
          totalCredits: sum(credit.amount).mapWith(Number)
        })
        .from(credit)
        .where(eq(credit.teamId, teamId))
        .get()
        .then(result => result?.totalCredits || 0)
    )
  }
}
