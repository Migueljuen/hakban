import React, { useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/16/solid'
import { COLUMNS } from '../data/jobs'

// Stepper stages (Rejected is handled separately, Hired is a virtual final step)
const STEPS = [
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'applied', label: 'Applied' },
    { id: 'interview', label: 'Interview' },
    { id: 'offer', label: 'Offer' },
    { id: 'hired', label: 'Hired' },
]

const STAGE_ACCENT = Object.fromEntries(COLUMNS.map(c => [c.id, c.accent]))

function CompanyAvatar({ company }) {
    const letter = company?.[0]?.toUpperCase() ?? '?'
    const hue = [...(company ?? '')].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
    return (
        <div
            style={{ background: `hsl(${hue},90%,95%)`, color: `hsl(${hue},40%,35%)` }}
            className="w-10 h-10 rounded-lg text-sm font-bold flex items-center justify-center flex-shrink-0 font-primary"
        >
            {letter}
        </div>
    )
}

function daysElapsed(isoDate, shortDateStr) {
    let d
    if (isoDate) {
        d = new Date(isoDate + 'T00:00:00')
    } else if (shortDateStr) {
        // Best-effort parse "Mar 5" → assume current year
        d = new Date(`${shortDateStr}, ${new Date().getFullYear()}`)
    }
    if (!d || isNaN(d)) return null
    const diff = Math.floor((Date.now() - d.getTime()) / 86400000)
    return diff >= 0 ? diff : null
}

function Stepper({ stage }) {
    const currentIdx = STEPS.findIndex(s => s.id === stage)
    const isRejected = stage === 'rejected'

    return (
        <div className="flex items-start gap-0 w-full">
            {STEPS.map((step, i) => {
                const isPast = !isRejected && i < currentIdx
                const isCurrent = !isRejected && i === currentIdx
                const isFuture = isRejected || i > currentIdx

                const dotColor = isCurrent ? '#3b82f6' : isPast ? '#009905' : '#d1d5db'
                const lineColor = (isPast || (isCurrent && i < STEPS.length - 1)) && !isRejected
                    ? '#009905' : '#e5e7eb'
                const labelColor = isCurrent ? '#3b82f6' : isPast ? '#009905' : '#00000080'

                return (
                    <div key={step.id} className="flex flex-col items-center flex-1 min-w-0">
                        <div className="flex items-center w-full">
                            {/* Left line - always present to center the dot */}
                            <div
                                className="flex-1 h-[1px]"
                                style={{
                                    background: i === 0 ? 'transparent' : (!isRejected && i <= currentIdx ? '#009905' : '#e5e7eb')
                                }}
                            />
                            {/* Dot */}
                            <div
                                style={{ borderColor: dotColor, background: isPast ? '#fff' : isCurrent ? 'white' : 'white' }}
                                className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10"
                            >
                                {isPast && (
                                    <div className="w-2 h-2 rounded-full bg-[#009905]" />
                                )}
                                {isCurrent && (
                                    <div className="w-2 h-2 rounded-full" style={{ background: '#3b82f6' }} />
                                )}
                            </div>
                            {/* Right line - always present to center the dot */}
                            <div
                                className="flex-1 h-[1px]"
                                style={{
                                    background: i === STEPS.length - 1 ? 'transparent' : (isPast ? '#009905' : '#e5e7eb')
                                }}
                            />
                        </div>
                        <span className="text-[10px] font-semibold mt-1.5 text-center" style={{ color: labelColor }}>
                            {step.label}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}

function InfoCell({ label, children }) {
    return (
        <div className="bg-gray-100 rounded-lg p-3 flex flex-col gap-1 border border-gray-300">
            <p className="text-xs font-bold uppercase tracking-wider text-black/50">{label}</p>
            <div className="text-sm">{children}</div>
        </div>
    )
}

export default function JobDetailModal({ job, onClose, onArchive }) {
    useEffect(() => {
        if (!job) return
        document.body.style.overflow = 'hidden'
        const handler = (e) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', handler)
        return () => {
            document.body.style.overflow = ''
            document.removeEventListener('keydown', handler)
        }
    }, [job, onClose])

    if (!job) return null

    const accent = STAGE_ACCENT[job.stage] ?? '#9ca3af'
    const days = daysElapsed(job.isoDate, job.date)
    const stageLabel = COLUMNS.find(c => c.id === job.stage)?.label ?? job.stage

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

            <div
                className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start gap-3 px-5 py-4 border-b border-gray-100">
                    <CompanyAvatar company={job.company} />
                    <div className="flex-1 min-w-0">
                        <h2 className="text-base font-semibold text-primary leading-snug">{job.title}</h2>
                        <p className="text-xs text-black/60 mt-0.5">{job.company} · {job.location}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-6 h-6 flex items-center justify-center rounded-md text-black/40 hover:text-black/60 hover:bg-gray-100 transition-colors flex-shrink-0"
                    >
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto px-5 py-4 flex flex-col gap-4">
                    {/* Stepper */}
                    {job.stage !== 'rejected' && <Stepper stage={job.stage} />}

                    {/* Info grid */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <InfoCell label="Stage">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md"
                                style={{ background: accent + '22', color: accent }}>
                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />
                                {stageLabel}
                            </span>
                        </InfoCell>
                        <InfoCell label="Work Type">
                            {job.workType || '—'}
                        </InfoCell>
                        <InfoCell label="Applied Date">
                            {job.date || '—'}
                        </InfoCell>
                        <InfoCell label="Days Elapsed">
                            {days !== null ? `${days} Day${days !== 1 ? 's' : ''}` : '—'}
                        </InfoCell>
                    </div>

                    {/* Job Posting */}
                    {job.url && (
                        <InfoCell label="Job Posting">
                            <a
                                href={job.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue text-sm break-all hover:underline"
                            >
                                {job.url}
                            </a>
                        </InfoCell>
                    )}

                    {/* Notes */}
                    <div className="flex flex-col gap-1.5">
                        <p className="text-xs font-bold uppercase tracking-wider text-black/50">Notes</p>
                        <div className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-black/60 min-h-[80px] whitespace-pre-wrap bg-white">
                            {job.notes || <span className="text-black/40 italic">No notes yet.</span>}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-gray-100">
                    <button
                        onClick={() => { onArchive?.(job.id); onClose() }}
                        className="text-sm px-4 py-1.5 rounded-md border border-gray-200 text-primary hover:bg-gray-50 transition-colors font-medium"
                    >
                        Archive
                    </button>
                </div>
            </div>
        </div>
    )
}
