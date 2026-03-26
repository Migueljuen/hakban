import React from 'react'
import Button from './button'
import { PlusIcon } from '@heroicons/react/16/solid'

export default function Header({ onAddApplication }) {
    return (
        <header className=' py-4 bg-white border-b border-gray-200 sticky top-0 z-50'>
            <div className="px-6 flex justify-between  items-center ">
                <div className="logo">
                    <img className="w-24" src="/Logo.svg" alt="Hakban" />
                </div>
                <div className='flex gap-2'>
                    {/* <Button text="Filter" onClick={() => console.log('Filter')} />
                    <Button text="Sort" onClick={() => console.log('Sort')} /> */}
                    <Button text="Add application" onClick={onAddApplication} icon={<PlusIcon className='w-4 h-4' />} />
                </div>
            </div>
        </header>
    )
}
