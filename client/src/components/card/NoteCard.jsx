import React from 'react';
import { MdOutlinePushPin, MdCreate, MdDelete } from 'react-icons/md';

const NoteCard = ({ title, date, content, tags, isPinned, onEdit, onDelete, onPinNote }) => {
    return (
        <div className={`border flex flex-col gap-1 p-3 ${isPinned ? 'border-yellow-400' : 'border-slate-200'} hover:shadow-xl cursor-pointer`}>
            <div className="flex items-center justify-between">
                <div>
                    <h6 className="text-sm font-bold">{title}</h6>
                    <span className="text-xs font-semibold text-slate-500">{date || "No date provided"}</span>
                </div>
                <MdOutlinePushPin className="text-xl text-blue-500 cursor-pointer" onClick={onPinNote} />
            </div>
            <p className="text-md font-medium">{content?.slice(0, 60)}</p>
            <div className='flex items-center justify-between'>
                <div className='text-xs text-slate-500'>
                    {tags.map((item)=> `#${item} `)}
                </div>
                <div className='flex items-center justify-center gap-2 text-gray-400 text-lg'>
                    <MdCreate
                        className='hover:text-green-600'
                        onClick={onEdit}
                    />
                    <MdDelete
                        className='hover:text-red-500'
                        onClick={onDelete}
                    />
                </div>
            </div>
        </div>
    );
}

export default NoteCard;
