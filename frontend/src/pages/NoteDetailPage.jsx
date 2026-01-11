import React from 'react'
import { useState,useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import toast from 'react-hot-toast'
import { LoaderIcon,ArrowLeftIcon,Trash2Icon } from 'lucide-react';
import api from '../lib/axios.js'
const NoteDetailPage = () => {
  const [saving,setSaving]=useState(false);
  const [loading,setLoading]=useState(true);
  const [note, setNote] = useState({ title: "", content: "" });
  
  const navigate=useNavigate();
  const {id} =useParams();

  useEffect(()=> {
    const fetchNote= async ()=>{
      try {
        const res= await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        console.error("Error in detail page", error);
        toast.error("Failed to load note");
      } finally {
        setLoading(false)
      }
    } 
    fetchNote();
  },[id]);

   const handleDelete= async ()=>{
    if(!window.confirm("Are you sure to delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      navigate("/");
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("error on delete", error);
      toast.error("Failed to delete note");
    }
  }
  const handleSave=async()=>{
    if (saving) return;
    if(!note.title.trim()|| !note.content.trim()){
      toast.error("Please add title or content");
      return;
    }
    setSaving(true);
    try {
      await api.put(`/notes/${id}`,note);
      navigate("/");
      toast.success("Note updated successfully");
    } catch (error) {
      toast.error("Failed to update note");
      console.error("Error in saving note",error);
    } finally{
      setSaving(false);
    }
  }

  if(loading){
    return(
      <div className='min-h-screen bg-base-200 flex items-center justify-center'>
        <LoaderIcon className='animate-spin size-10'></LoaderIcon>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-base-200'>
      <div className='container  mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto '>
          <div className='flex justify-between items-center mb-6'>
            <Link to={"/"} className='btn btn-ghost mb-6'>
              <ArrowLeftIcon className='size-5'/>
              Back to Notes
            </Link>
            <button className='btn btn-outline text-error' onClick={handleDelete}>
              <Trash2Icon className='size-5'/>
            </button>
            
          </div>
          <div className='card bg-base-100'>
            <div className='card-body'>
              <h2 className='card-title text-2xl mb-4'>
                 Edit Note
              </h2>
                <div className='form-control mb-4'>
                  <label className="label">
                    <span className='label-text'>Title</span>
                  </label>
                  <input type="text"
                         className='input input-bordered' 
                         placeholder='enter the title...'
                         value={note.title}
                         onChange={(e)=>setNote({...note,title: e.target.value })}
                  />
                </div>
                <div className='form-control'>
                   <label className='label'>
                    <span className='label-text'>Content</span>
                  </label>
                  <textarea
                  className='textarea textarea-bordered h-32'
                  placeholder='enter the content...'
                  value={note.content}
                  onChange={(e)=>setNote({...note,content: e.target.value})}
                  />
                </div>
                <div className='card-actions justify-end'>
                  <button className='btn btn-primary mt-4' disabled={saving} onClick={handleSave}>
                    {saving ? "Saving...": "Save Note"}
                  </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteDetailPage
