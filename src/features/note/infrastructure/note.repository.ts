import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import { note } from './note.schema'
import { Note, CreateNote, UpdateNote } from '../domain/note.entity'

export class NoteRepository {
  constructor(private db: D1Database) {}

  async findById(id: string): Promise<Note | undefined> {
    const db = drizzle(this.db)
    return db.select().from(note).where(eq(note.id, id)).get()
  }

  async findAll(): Promise<Note[]> {
    const db = drizzle(this.db)
    return db.select().from(note).all()
  }

  async create(noteData: CreateNote): Promise<Note> {
    const db = drizzle(this.db)
    return db.insert(note).values(noteData).returning().get()
  }

  async update(id: string, noteData: UpdateNote): Promise<Note | undefined> {
    const db = drizzle(this.db)
    return db.update(note).set(noteData).where(eq(note.id, id)).returning().get()
  }

  async delete(id: string): Promise<boolean> {
    const db = drizzle(this.db)
    const result = await db.delete(note).where(eq(note.id, id))
    return result.success
  }
}
