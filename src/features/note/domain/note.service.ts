import { Note, CreateNote, UpdateNote } from './note.entity'
import { NoteRepository } from '../infrastructure/note.repository'

export class NoteService {
  constructor(private noteRepository: NoteRepository) {}

  async getNoteById(id: string): Promise<Note | undefined> {
    return this.noteRepository.findById(id)
  }

  async getAllNotes(): Promise<Note[]> {
    return this.noteRepository.findAll()
  }

  async createNote(userData: CreateNote): Promise<Note> {
    return this.noteRepository.create(userData)
  }

  async updateNote(id: string, data: UpdateNote): Promise<Note | undefined> {
    return this.noteRepository.update(id, data)
  }

  async deleteNote(id: string): Promise<boolean> {
    return this.noteRepository.delete(id)
  }
}
