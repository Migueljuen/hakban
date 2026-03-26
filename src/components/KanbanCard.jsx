import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { StarIcon as StarIconSolid, ArrowRightIcon } from '@heroicons/react/16/solid'
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline'

const WORK_TYPE_STYLES = {
    Hybrid: { bg: '#dbeafe', text: '#1d4ed8' },
    Remote: { bg: '#f3f4f6', text: '#374151' },
    Onsite: { bg: '#dcfce7', text: '#15803d' },
}

function CompanyAvatar({ company }) {
    const letter = company?.[0]?.toUpperCase() ?? '?'
    const hue = [...(company ?? '')].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
    const bg = `hsl(${hue}, 90%, 95%)`
    const color = `hsl(${hue}, 40%, 35%)`
    return (
        <div
            style={{ background: bg, color }}
            className="w-7 h-7 rounded-sm text-xs font-bold flex items-center justify-center flex-shrink-0 font-primary"
        >
            {letter}
        </div>
    )
}

function StarIcon({ filled }) {
    if (filled) {
        return <StarIconSolid className='w-4 h-4 text-blue cursor-pointer' />
    }
    return <StarIconOutline className='w-4 h-4 text-gray-300 hover:text-blue cursor-pointer' />
}

export default function KanbanCard({ job, accent, isRejected, onStar, onClick }) {
    const workStyle = WORK_TYPE_STYLES[job.workType] ?? WORK_TYPE_STYLES.Remote

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: job.id,
        data: { job },
    })

    const style = {
        transform: CSS.Translate.toString(transform),
        borderLeftColor: isRejected ? '#bbbbbbff' : accent,
        opacity: isRejected ? '0.8' : '1',
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-white rounded-lg border border-l-[3.5px] ${job.starred ? 'border-blue/50 hover:border-blue' : 'border-gray-200 hover:border-gray-300'} p-3.5 flex flex-col gap-2 hover:shadow-sm transition-shadow cursor-grab active:cursor-grabbing group ${isDragging ? 'invisible' : ''}`}
            onClick={(e) => {
                // Only fire click if we didn't actually drag
                if (!isDragging) onClick?.(job)
            }}
        >
            {/* Top row: avatar + star */}
            <div className="flex items-start justify-between gap-2">
                <CompanyAvatar company={job.company} />
                <button
                    onClick={(e) => { e.stopPropagation(); onStar?.(job.id) }}
                    className={`transition-opacity ${job.starred ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                    aria-label={job.starred ? 'Unstar' : 'Star'}
                >
                    <StarIcon filled={job.starred} />
                </button>
            </div>

            {/* Title + company */}
            <div>
                <p
                    className="font-semibold text-sm leading-snug"
                    style={isRejected
                        ? { textDecoration: 'line-through', color: '#9ca3af' }
                        : { color: '#1D1D1D' }
                    }
                >
                    {job.title}
                </p>
                <p
                    className="text-xs mt-0.5"
                    style={{ color: isRejected ? '#d1d5db' : '#00000060' }}
                >
                    {job.company} · {job.location}
                </p>
            </div>

            {/* Work type badge */}
            <div>
                <span
                    style={{ background: workStyle.bg, color: workStyle.text }}
                    className="text-xs font-secondary px-2 py-0.5 rounded-sm"
                >
                    {job.workType}
                </span>
            </div>

            {/* Footer: date + arrow */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="text-xs text-black/60">{job.date}</span>
                <ArrowRightIcon className='w-4 h-4 text-black/60 group-hover:text-black/80 transition-colors text-sm' />
            </div>
        </div>
    )
}
