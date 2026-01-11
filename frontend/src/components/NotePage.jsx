import React from 'react'
import { Link } from 'react-router-dom'
import { PenSquareIcon,Trash2Icon } from 'lucide-react'
import { formatDate } from '../lib/utils'
import api from '../lib/axios.js'
import toast from 'react-hot-toast'

const NotePage = ({note,setNotes}) => {
  const handleDelete= async (e,id)=>{
    e.preventDefault();
    if(!window.confirm("Are you sure to delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev)=>prev.filter(note=> note._id!==id));
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("error on delete", error);
      toast.error("Failed to delete note");
    }
  }

  return (
    <Link to={`/note/${note._id}`} className='card bg-base-200 border-t-4 border-solid border-[#00FF9D] hover:shadow-lg transition-all duration-200'>
      <div className='card-body'>
        <h3 className='card-title text-base-content'>{note.title}</h3>
        <p className='text-base-content/70 line-clamp-5'>{note.content}</p>
        <div className='card-actions justify-between mt-4 '>
          <span className=' text-base-content/50 text-sm'>{formatDate(new Date(note.createdAt))}</span>
          <div className='flex items-center gap-1'>
            <PenSquareIcon className='size-4'/>
            <button className='btn btn-ghost btn-xs text-error' onClick={(e)=>handleDelete(e,note._id)}>
              <Trash2Icon className='size-4'/>
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default NotePage
