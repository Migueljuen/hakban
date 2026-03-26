import React from 'react'

export default function Button({ text, onClick, icon }) {
    return (
        <button className='bg-white text-sm border border-gray-300 text-primary px-3 py-1.5 rounded-md font-medium flex items-center gap-2 hover:bg-gray-50 cursor-pointer' onClick={onClick}>{icon} {text}</button>
    )
}