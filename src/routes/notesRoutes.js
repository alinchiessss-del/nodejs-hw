import { Router } from 'express';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';

import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';

const router = Router();

router.use(authenticate);

router.get('/notes', celebrate(getAllNotesSchema), getAllNotes);

router.get('/notes/:noteId', celebrate(noteIdSchema), getNoteById);

router.post('/notes', celebrate(createNoteSchema), createNote);

router.delete('/notes/:noteId', celebrate(noteIdSchema), deleteNote);

router.patch(
  '/notes/:noteId',
  celebrate(updateNoteSchema),
  updateNote,
);

export default router;
