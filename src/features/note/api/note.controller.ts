import { Context } from 'hono'
import { NoteService } from '../domain/note.service'
import { createNoteSchema, updateNoteSchema } from './note.validation'
import { AppEnvironment } from '../../../core/types/environment'

export class NoteController {
  constructor(private noteService: NoteService) {}

  getNoteById = async (c: Context<AppEnvironment>) => {
    try {
      const noteId = c.req.param('id')
      const note = await this.noteService.getNoteById(Number(noteId))

      if (!note) return c.json({ error: 'Note not found' }, 404)

      return c.json(note)
    } catch (error) {
      console.error('Error fetching note:', error)
      return c.json({ error: 'Internal Server Error' }, 500)
    }
  }

  getAllNotes = async (c: Context<AppEnvironment>) => {
    try {
      const allNotes = await this.noteService.getAllNotes()
      return c.json(allNotes)
    } catch (error) {
      console.error('Error fetching notes:', error)
      return c.json({ error: 'Internal Server Error' }, 500)
    }
  }

  createNote = async (c: Context<AppEnvironment>) => {
    try {
      const noteData = await c.req.json()
      const validNote = createNoteSchema.parse(noteData)
      const newNote = await this.noteService.createNote(validNote)

      return c.json(newNote, 201)
    } catch (error) {
      console.error('Error creating note:', error)
      return c.json({ error: 'Internal Server Error' }, 500)
    }
  }

  updateNote = async (c: Context<AppEnvironment>) => {
    try {
      const noteId = c.req.param('id')
      const noteData = await c.req.json()
      const validData = updateNoteSchema.parse(noteData)

      const updatedNote = await this.noteService.updateNote(Number(noteId), validData)
      if (!updatedNote) return c.json({ error: 'Note not found' }, 404)

      return c.json(updatedNote)
    } catch (error) {
      console.error('Error updating note:', error)
      return c.json({ error: 'Internal Server Error' }, 500)
    }
  }

  deleteNote = async (c: Context<AppEnvironment>) => {
    try {
      const noteId = c.req.param('id')
      const success = await this.noteService.deleteNote(Number(noteId))

      if (!success) return c.json({ error: 'Note not found' }, 404)
      return c.json({ success: true })
    } catch (error) {
      console.error('Error deleting note:', error)
      return c.json({ error: 'Internal Server Error' }, 500)
    }
  }
}
