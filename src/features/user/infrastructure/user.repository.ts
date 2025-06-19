import { drizzle } from 'drizzle-orm/d1'
import { eq, and } from 'drizzle-orm'
import { user } from './user.schema'
import type { User, UpdateUser } from '../domain/user.entity'
import { attempt, type Response } from '../../../utils/attempt/http'
import { userToWorkspace } from '../../workspace/infrastructure/user_to_workspace.schema'
import type { Workspace } from '../../workspace/domain/workspace.entity'
import { workspace } from '../../workspace/infrastructure/workspace.schema'
import { userToTeam } from '../../team/infrastructure/user_to_team.schema'
import type { Team } from '../../team/domain/team.entity'
import { team } from '../../team/infrastructure/team.schema'

export class UserRepository {
  constructor(private db: D1Database) {}

  async findById({ userId }: { userId: string }): Promise<Response<User | undefined>> {
    const db = drizzle(this.db)

    return attempt(db.select().from(user).where(eq(user.id, userId)).get())
  }

  async findAll(): Promise<Response<User[]>> {
    const db = drizzle(this.db)

    return attempt(db.select().from(user).all())
  }

  async updateUser(id: string, data: UpdateUser): Promise<Response<User | undefined>> {
    const db = drizzle(this.db)

    return attempt(db.update(user).set(data).where(eq(user.id, id)).returning().get())
  }

  async getUserWorkspaces({ userId }: { userId: string }): Promise<Response<Workspace[]>> {
    const db = drizzle(this.db)

    return attempt(
      db
        .select()
        .from(userToWorkspace)
        .innerJoin(workspace, eq(userToWorkspace.workspaceId, workspace.id))
        .where(eq(userToWorkspace.userId, userId))
        .all()
        .then(results => results.map(({ workspace }) => workspace))
    )
  }

  async getUserTeams({ userId }: { userId: string }): Promise<Response<Team[]>> {
    const db = drizzle(this.db)

    return attempt(
      db
        .select()
        .from(userToTeam)
        .innerJoin(team, eq(userToTeam.teamId, team.id))
        .where(eq(userToTeam.userId, userId))
        .all()
        .then(results => results.map(({ team }) => team))
    )
  }

  async getUserTeam({ userId, teamId }: { userId: string; teamId: string }): Promise<Response<Team | undefined>> {
    const db = drizzle(this.db)

    return attempt(
      db
        .select()
        .from(userToTeam)
        .innerJoin(team, eq(userToTeam.teamId, team.id))
        .where(and(eq(userToTeam.userId, userId), eq(userToTeam.teamId, teamId)))
        .get()
        .then(result => result?.team)
    )
  }
}
