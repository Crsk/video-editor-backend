import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import { user } from './user.schema'
import { User, UpdateUser } from '../domain/user.entity'

export class UserRepository {
  constructor(private db: D1Database) {}

  async findById(id: string): Promise<User | undefined> {
    const db = drizzle(this.db)
    return db.select().from(user).where(eq(user.id, id)).get()
  }

  async findAll(): Promise<User[]> {
    const db = drizzle(this.db)
    return db.select().from(user).all()
  }

  async updateUser(id: string, data: UpdateUser): Promise<User | undefined> {
    const db = drizzle(this.db)
    return db.update(user).set(data).where(eq(user.id, id)).returning().get()
  }
}
