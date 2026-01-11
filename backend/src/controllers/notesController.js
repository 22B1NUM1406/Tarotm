import Note from '../models/Note.js';

export async function getAllNotes(_,res){
    try {
        const notes= await Note.find().sort({createAt:-1});
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error in getAllNotes controller", error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function getNoteById(req,res){
    try {
        const note= await Note.findById(req.params.id);
        if(!note) return res.status(404).json({message:"Note not found"});
        res.status(200).json(note);
    } catch (error) {
        console.error("Error in getNoteById controller", error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function createNote(req,res){
    try {
        const {title, content}= req.body;
        const newNote=new Note({title,content});
        const note=await newNote.save();
        res.status(201).json(note);
    } catch (error) {
        console.error("Error in createNotes controller", error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function updateNote(req,res){
    try {
        const {title, content} = req.body;
        const {id}= req.params
        const updatedNote= await Note.findByIdAndUpdate(id, {title, content}, {new: true});
        if (!updatedNote) return res.status(404).json({message:"Note not found"});
        res.status(200).json(updatedNote);
    } catch (error) {
        console.error("Error in updateNotes controller", error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function deleteNote(req,res){
    try {
        const deletedNote=await Note.findByIdAndDelete(req.params.id);
        if(!deletedNote) return res.status(404).json({message:"Note not found"});
        res.status(200).json({message: "You just deleted the notes"});
    } catch (error) {
        console.error("Error in deleteNotes controller", error);
        res.status(500).json({message:"Internal server error"});
    }
}