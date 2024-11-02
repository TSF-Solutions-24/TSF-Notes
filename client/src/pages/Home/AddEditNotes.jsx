import React, { useState } from 'react'
import TagInput from '../../components/input/TagInput'
import { MdClose } from 'react-icons/md'
import axiosInstance from '../../utils/axiosInstance'

const AddEditNotes = ({ onClose, noteData, type, getAllNotes, showToastMessage }) => {
    const [title, setTitle] = useState(noteData?.title || '')
    const [content, setContent] = useState(noteData?.content || '')
    const [tags, setTags] = useState(noteData?.tags || [])
    const [error, setError] = useState(null)

    const addNewNote = async () => {
        try {
            const response = await axiosInstance.post('/add-note', {
                title,
                content,
                tags
            })
            if (response.data && response.data.note) {
                showToastMessage('Note Added Successfully')
                getAllNotes()
                onClose()
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message)
            }
        }
    }
    const editNote = async () => {
        const noteId = noteData._id
        try {
            const response = await axiosInstance.put('/edit-note/' + noteId, {
                title,
                content,
                tags
            })
            if (response.data && response.data.note) {
                showToastMessage('Note Updated Successfully')
                getAllNotes()
                onClose()
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message)
            }
        }
    }

    const handleAddNote = () => {
        if (!title) {
            setError("Please enter the title")
            return
        }
        if (!content) {
            setError("Please enter the content")
            return
        }
        setError('')
        if (type === "edit") {
            editNote();
        }
        else {
            addNewNote()
        }

    }
    return (
        <div className='relative'>
            <button onClick={onClose} className='w-10 h-10 rounded-full flex items-center justify-center absolute -right-3 -top-3 hover:bg-slate-50'>
                <MdClose className='text-xl text-slate-400' />
            </button>
            <div className='flex flex-col gap-2'>
                <label className='font-semibold'>TITLE</label>
                <input
                    value={title}
                    onChange={(e) => { setTitle(e.target.value) }}
                    type="text"
                    className='text-lg text-slate-950 outline-none'
                    placeholder='Title for the notes' />
            </div>
            <div className="flex flex-col gap-2 mt-4">
                <label className="font-semibold">CONTENT</label>
                <textarea
                    value={content}
                    onChange={(e) => { setContent(e.target.value) }}
                    type="text"
                    className="text-sm Otext-slate-950 outline-none bg-slate-50 p-2 rounded"
                    placeholder='Content'
                    rows={10} />
            </div>
            <div className="mt-3">
                <label htmlFor="" className='font-semibold'>TAGS</label>
                <TagInput tags={tags} setTags={setTags} />
            </div>
            {
                error && <p className='text-red-500 text-md mt-3 mx-1'>{error}</p>
            }
            <button className='bg-blue-700 w-full text-white font-medium mt-5 p-3' onClick={handleAddNote}>{type === 'edit' ? 'UPDATE' : 'ADD'}</button>
        </div>
    )
}

export default AddEditNotes
