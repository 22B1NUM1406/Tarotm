import Navbar from '../components/Navbar'
import { useState } from 'react'
import { useEffect } from 'react'
import { Notebook } from "lucide-react";
import axios from 'axios'
import toast from 'react-hot-toast'
import {Link} from 'react-router-dom'
import api from '../lib/axios.js'
import NotePage from '../components/NotePage'
const HomePage = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const fetchNotes = async () => {
      try {
        const res=await api.get('/notes');
        setNotes(res.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
        toast.error("Failed to load notes");
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  },[]);
  return (
    <div className='min-h-screen'>
      <Navbar />
      <div className='max-w-7xl mx-auto p-4 mt-6'>
        {loading && <p className='text-primary text-center'>Loading notes...</p>}
        {notes.length === 0 && !loading && 
        <div className='flex flex-col gap-6 text-center items-center justify-center text-primary'>
          <Notebook className='size-10 opacity-70'/>
          <p className='text-2xl text-stone-200 font-bold'>No notes yet</p>
          <p className='text-stone-500'>Ready to organize your thoughts? Create your first note to get started on your journey.</p>
          <Link to='/create' className='btn btn-primary font-bold'>
            Create Your First Note
          </Link>
        </div>}
        {notes.length>0 &&(
          <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {notes.map((note)=>(
              <NotePage key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
