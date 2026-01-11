import React from 'react'
import { Link } from 'react-router-dom'
import { PlusIcon } from 'lucide-react'

const Navbar = () => {
  return (
    <header className='bg-base-300 border-b-2 border-base-content/10 '>
        <div className='mx-auto max-w-6xl p-4' >
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-mono tracking-tighter text-primary font-bold'>Thinkboard</h1>
                <div className='flex'>
                    <Link to={"/create"} className='btn btn-primary' >
                    <PlusIcon className='size-5'/>
                    <span>New Note</span>
                </Link>
                </div>
            </div>
        </div>
    </header>
  )
}

export default Navbar
