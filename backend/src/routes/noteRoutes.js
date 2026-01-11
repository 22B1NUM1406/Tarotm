import express from 'express';
import { createNote, deleteNote, getAllNotes, getNoteById, updateNote } from '../controllers/notesController.js';

const router=express.Router();

router.get("/",getAllNotes);
router.post("/",createNote);
router.put("/:id",updateNote);
router.get("/:id",getNoteById);
router.delete("/:id",deleteNote);

export default router;