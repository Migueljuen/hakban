import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import KanbanCard from './KanbanCard'
import { PlusIcon } from '@heroicons/react/16/solid'

export default function KanbanColumn({ column, jobs, onStar, onAdd, onCardClick }) {
    const isRejected = column.id === 'rejected'

    const { setNodeRef, isOver } = useDroppable({ id: column.id })

    return (
        <div className="flex flex-col min-w-[280px] w-[280px] flex-shrink-0">
            {/* Column header */}
            <div className="flex items-center gap-2 mb-3 px-0.5">
                <span
                    style={{ background: column.accent }}
                    className="w-2 h-2 rounded-full flex-shrink-0"
                />
                <span className="text-xs font-semibold uppercase tracking-wide text-black/60 flex-1 truncate">
                    {column.label}
                </span>
                <span className="text-xs text-black/40 font-secondary bg-gray-200 px-1.5 py-0.5 rounded-md font-medium">
                    {jobs.length}
                </span>
                <button
                    onClick={() => onAdd?.(column.id)}
                    className="w-5 h-5 flex items-center justify-center cursor-pointer text-black/40 hover:text-black/60 hover:bg-gray-200 rounded transition-colors"
                    aria-label={`Add to ${column.label}`}
                >
                    <PlusIcon className='w-4 h-4' />
                </button>
            </div>

            {/* Cards drop zone */}
            <div
                ref={setNodeRef}
                className={`flex flex-col gap-2 pb-2 flex-1 min-h-[80px] rounded-lg transition-colors ${isOver ? 'bg-blue-50/60 ring-2 ring-blue-200 ring-dashed' : ''}`}
            >
                {jobs.map(job => (
                    <KanbanCard
                        key={job.id}
                        job={job}
                        accent={column.accent}
                        isRejected={isRejected}
                        onStar={onStar}
                        onClick={onCardClick}
                    />
                ))}
                {jobs.length === 0 && (
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isOver ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
                        <p className="text-xs text-black/60">No applications yet</p>
                    </div>
                )}
            </div>
        </div>
    )
}
