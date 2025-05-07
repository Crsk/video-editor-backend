import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import { notes } from './note.schema'
import { Note, NewNote, UpdateNote } from '../domain/note.entity'

export class NoteRepository {
  constructor(private db: D1Database) {}

  async findById(id: number): Promise<Note | undefined> {
    const db = drizzle(this.db)
    return db.select().from(notes).where(eq(notes.id, id)).get()
  }

  async findAll(): Promise<Note[]> {
    const db = drizzle(this.db)
    return db.select().from(notes).all()
  }

  async create(noteData: NewNote): Promise<Note> {
    const db = drizzle(this.db)
    return db.insert(notes).values(noteData).returning().get()
  }

  async update(id: number, noteData: UpdateNote): Promise<Note | undefined> {
    const db = drizzle(this.db)
    return db.update(notes).set(noteData).where(eq(notes.id, id)).returning().get()
  }

  async delete(id: number): Promise<boolean> {
    const db = drizzle(this.db)
    const result = await db.delete(notes).where(eq(notes.id, id))
    return result.success
  }
}
