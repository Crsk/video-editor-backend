import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import { users } from './user-schema'
import { User, NewUser } from './user-models'
import { UpdateUserInput } from './user-validation'

export interface IUserRepository {
  findById(id: number): Promise<User | undefined>
  findAll(): Promise<User[]>
  create(userData: NewUser): Promise<User>
  deleteAll(): Promise<void>
  createMany(usersData: NewUser[]): Promise<void>
  updateUser(id: number, data: UpdateUserInput): Promise<User | undefined>
  deleteUser(id: number): Promise<boolean>
}

export class UserRepository implements IUserRepository {
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

  async deleteAll(): Promise<void> {
    const db = drizzle(this.db)
    await db.delete(users)
  }

  async createMany(usersData: NewUser[]): Promise<void> {
    const db = drizzle(this.db)
    await db.insert(users).values(usersData)
  }

  async updateUser(id: number, data: UpdateUserInput): Promise<User | undefined> {
    const db = drizzle(this.db)
    return db.update(users).set(data).where(eq(users.id, id)).returning().get()
  }

  async deleteUser(id: number): Promise<boolean> {
    const db = drizzle(this.db)
    const result = await db.delete(users).where(eq(users.id, id))
    return result.rowsAffected > 0
  }
}
