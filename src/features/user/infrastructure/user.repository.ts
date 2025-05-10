import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import { user } from './user.schema'
import { User, UpdateUser } from '../domain/user.entity'
import { attempt, Response } from '../../../utils/attempt/http'
import { userToProject } from '../../project/infrastructure/user_to_project.schema'
import { Project } from '../../project/domain/project.entity'
import { project } from '../../project/infrastructure/project.schema'

export class UserRepository {
  constructor(private db: D1Database) {}

  async findById(id: string): Promise<Response<User | undefined>> {
    const db = drizzle(this.db)

    return attempt(db.select().from(user).where(eq(user.id, id)).get())
  }

  async findAll(): Promise<Response<User[]>> {
    const db = drizzle(this.db)

    return attempt(db.select().from(user).all())
  }

  async updateUser(id: string, data: UpdateUser): Promise<Response<User | undefined>> {
    const db = drizzle(this.db)

    return attempt(db.update(user).set(data).where(eq(user.id, id)).returning().get())
  }

  async getUserProjects({ userId }: { userId: string }): Promise<Response<Project[]>> {
    const db = drizzle(this.db)

    return attempt(
      db
        .select()
        .from(userToProject)
        .innerJoin(project, eq(userToProject.projectId, project.id))
        .where(eq(userToProject.userId, userId))
        .all()
        .then(results => results.map(({ project }) => project))
    )
  }
}
