import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import { usersTable } from './user-schema'
import { User } from './user-model'

export interface IUserRepository {
  findById(id: number): Promise<User | undefined>
  findAll(): Promise<User[]>
  create(userData: Omit<User, 'id'>): Promise<User>
  deleteAll(): Promise<void>
  createMany(users: Omit<User, 'id'>[]): Promise<void>
}

export class UserRepository implements IUserRepository {
  constructor(private db: D1Database) {}

  async findById(id: number): Promise<User | undefined> {
    const db = drizzle(this.db)
    return db.select().from(usersTable).where(eq(usersTable.id, id)).get()
  }

  async findAll(): Promise<User[]> {
    const db = drizzle(this.db)
    return db.select().from(usersTable).all()
  }

  async create(userData: Omit<User, 'id'>): Promise<User> {
    const db = drizzle(this.db)
    return db.insert(usersTable).values(userData).returning().get()
  }

  async deleteAll(): Promise<void> {
    const db = drizzle(this.db)
    await db.delete(usersTable)
  }

  async createMany(users: Omit<User, 'id'>[]): Promise<void> {
    const db = drizzle(this.db)
    await db.insert(usersTable).values(users)
  }
}
