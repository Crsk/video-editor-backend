import { Note, NewNote, UpdateNote } from './note.entity'
import { NoteRepository } from '../infrastructure/note.repository'

export class NoteService {
  constructor(private noteRepository: NoteRepository) {}

  async getNoteById(id: number): Promise<Note | undefined> {
    return this.noteRepository.findById(id)
  }

  async getAllNotes(): Promise<Note[]> {
    return this.noteRepository.findAll()
  }

  async createNote(userData: NewNote): Promise<Note> {
    return this.noteRepository.create(userData)
  }

  async updateNote(id: number, data: UpdateNote): Promise<Note | undefined> {
    return this.noteRepository.update(id, data)
  }

  async deleteNote(id: number): Promise<boolean> {
    return this.noteRepository.delete(id)
  }
}
