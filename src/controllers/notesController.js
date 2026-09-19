import { Note } from '../models/note.js';
import createHttpError from 'http-errors';
export const getAllNotes = async (req, res) => {
  const {
    tag,
    search,
    page = 1,
    perPage = 10,
  } = req.query;

  const skip = (page - 1) * perPage;

  const myQuery = Note.find();

  if (tag) {
    myQuery.where('tag').equals(tag);
  }

  if (search) {
    myQuery.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ],
    });
  }

  const [totalNotes, notes] = await Promise.all([
    myQuery.clone().countDocuments(),
    myQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    notes,
    totalNotes,
    page,
    perPage,
    totalPages,
  });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);
  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
  });
  if (!note) {
    throw createHttpError(404, "Note not found");
  }
  res.status(200).json(note);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndUpdate(
    { _id: noteId },
    req.body,
    { returnDocument: 'after', runValidators: true },
  );
  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
};
