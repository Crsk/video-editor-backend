import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import { users } from './user.schema'
import { User, NewUser, UpdateUser } from '../domain/user.entity'

export class UserRepository {
  constructor(private db: D1Database) {}

  async findById(id: number): Promise<User | undefined> {
    const db = drizzle(this.db)
    return db.select().from(users).where(eq(users.id, id)).get()
  }

  async findAll(): Promise<User[]> {
    const db = drizzle(this.db)
    return db.select().from(users).all()
  }

  async create(userData: NewUser): Promise<User> {
    const db = drizzle(this.db)
    return db.insert(users).values(userData).returning().get()
  }

  async updateUser(id: number, data: UpdateUser): Promise<User | undefined> {
    const db = drizzle(this.db)
    return db.update(users).set(data).where(eq(users.id, id)).returning().get()
  }

  async deleteUser(id: number): Promise<boolean> {
    const db = drizzle(this.db)
    const result = await db.delete(users).where(eq(users.id, id))
    return result.rowsAffected > 0
  }
}
