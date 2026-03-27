import React, { useState, useEffect, useRef } from 'react'
import { XMarkIcon } from '@heroicons/react/16/solid'
import { COLUMNS } from '../data/jobs'

const STAGE_OPTIONS = COLUMNS.map(c => ({ id: c.id, label: c.label }))
const WORK_TYPES = ['Hybrid', 'Remote', 'Onsite']

function formatDateLabel(isoDate) {
    if (!isoDate) return ''
    const d = new Date(isoDate + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function shortDate(isoDate) {
    if (!isoDate) return ''
    const d = new Date(isoDate + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const EMPTY = {
    stage: 'wishlist',
    company: '',
    title: '',
    location: '',
    workType: '',
    url: '',
    date: '',
    notes: '',
}

export default function AddApplicationModal({ isOpen, initialStage, onClose, onSave }) {
    const [form, setForm] = useState({ ...EMPTY, stage: initialStage ?? 'wishlist' })
    const [errors, setErrors] = useState({})
    const firstInput = useRef(null)

    // Reset form whenever modal opens
    useEffect(() => {
        if (isOpen) {
            setForm({ ...EMPTY, stage: initialStage ?? 'wishlist' })
            setErrors({})
            setTimeout(() => firstInput.current?.focus(), 50)
        }
    }, [isOpen, initialStage])

    // Close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose() }
        if (isOpen) document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [isOpen, onClose])

    // Lock body scroll 
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    if (!isOpen) return null

    const set = (field, value) => {
        setForm(f => ({ ...f, [field]: value }))
        if (errors[field]) setErrors(e => ({ ...e, [field]: false }))
    }

    const validate = () => {
        const required = ['company', 'title', 'location', 'workType', 'date']
        const next = {}
        required.forEach(f => { if (!form[f]) next[f] = true })
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSave = () => {
        if (!validate()) return
        onSave({
            id: crypto.randomUUID(),
            stage: form.stage,
            company: form.company.trim(),
            title: form.title.trim(),
            location: form.location.trim(),
            workType: form.workType,
            date: shortDate(form.date),
            isoDate: form.date,
            url: form.url.trim(),
            notes: form.notes.trim(),
            starred: false,
        })
        onClose()
    }

    const field = (label, key, input) => (
        <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-black/60">
                {label} <span className="text-red-400">*</span>
            </label>
            {input}
            {errors[key] && <p className="text-[10px] text-red-400">Required</p>}
        </div>
    )

    const inputCls = (key) =>
        `w-full border rounded-md px-3 py-2 text-sm outline-none transition-colors placeholder:text-black/40 ${errors[key]
            ? 'border-red-300 focus:border-red-400'
            : 'border-gray-200 focus:border-blue/60 bg-gray-50 focus:bg-white'
        }`

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))', paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

            {/* Panel */}
            <div
                className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                    <h2 className="text-sm font-semibold text-primary">Add application</h2>
                    <button
                        onClick={onClose}
                        className="w-6 h-6 flex items-center justify-center rounded-md text-black/40 hover:text-black/60 hover:bg-gray-100 transition-colors"
                    >
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto px-5 py-4 flex flex-col gap-4">
                    {/* Stage */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-black/60">
                            Stage <span className="text-red-400">*</span>
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {STAGE_OPTIONS.map(s => (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => set('stage', s.id)}
                                    className={`text-xs px-3 cursor-pointer py-1.5 rounded-md border font-medium transition-colors ${form.stage === s.id
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-white text-black/60 border-gray-200 hover:border-gray-400'
                                        }`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Company + Role */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {field('Company', 'company',
                            <input
                                ref={firstInput}
                                value={form.company}
                                onChange={e => set('company', e.target.value)}
                                placeholder="e.g. Apple"
                                className={inputCls('company')}
                            />
                        )}
                        {field('Role', 'title',
                            <input
                                value={form.title}
                                onChange={e => set('title', e.target.value)}
                                placeholder="e.g. Software Developer"
                                className={inputCls('title')}
                            />
                        )}
                    </div>

                    {/* Location + Work Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {field('Location', 'location',
                            <input
                                value={form.location}
                                onChange={e => set('location', e.target.value)}
                                placeholder="e.g. Miami, FL"
                                className={inputCls('location')}
                            />
                        )}
                        {field('Work Type', 'workType',
                            <select
                                value={form.workType}
                                onChange={e => set('workType', e.target.value)}
                                className={inputCls('workType') + ' cursor-pointer h-[38px]'}
                            >
                                <option value="">Select...</option>
                                {WORK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        )}
                    </div>

                    {/* URL */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-black/60">
                            Job Posting URL
                        </label>
                        <input
                            value={form.url}
                            onChange={e => set('url', e.target.value)}
                            placeholder="https://..."
                            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none bg-gray-50 focus:bg-white focus:border-blue/60 transition-colors placeholder:text-black/40"
                        />
                    </div>

                    {/* Date */}
                    {field('Applied Date', 'date',
                        <input
                            type="date"
                            value={form.date}
                            onChange={e => set('date', e.target.value)}
                            className={inputCls('date') + ' appearance-none'}

                        />
                    )}

                    {/* Notes */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-black/60">Notes</label>
                        <textarea
                            value={form.notes}
                            onChange={e => set('notes', e.target.value)}
                            placeholder="Referral contact, key requirements, interview tips..."
                            rows={3}
                            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none bg-gray-50 focus:bg-white focus:border-blue/60 transition-colors placeholder:text-black/40 resize-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="text-sm cursor-pointer px-4 py-1.5 rounded-md border border-gray-200 text-black/60 hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="text-sm cursor-pointer px-4 py-1.5 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors font-medium"
                    >
                        Save application
                    </button>
                </div>
            </div>
        </div>
    )
}
