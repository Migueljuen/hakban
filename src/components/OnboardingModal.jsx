import React, { useState, useEffect, useRef } from 'react'

const STORAGE_KEY_DONE = 'hakban_onboarding_done'

/* ──────────────────────────── Illustration Components ──────────────────────────── */

function KanbanIllustration() {
    const cards = [
        { accent: '#3b82f6', lines: 2 },
        { accent: '#f59e0b', lines: 2 },
        { accent: '#009905', lines: 2 },
        { accent: '#8b5cf6', lines: 2 },
        { accent: '#ef4444', lines: 2 },
    ]
    return (
        <div className="flex items-center justify-center gap-3 py-6">
            {cards.map((c, i) => (
                <div key={i} className="relative">
                    <div
                        className="w-[72px] h-[52px] rounded-lg border border-gray-200 bg-gray-50 flex flex-col gap-1.5 justify-center px-2.5"
                        style={{ borderLeft: `3px solid ${c.accent}` }}
                    >
                        <div className="h-[5px] rounded-full bg-gray-300 w-[80%]" />
                        <div className="h-[5px] rounded-full bg-gray-200 w-[60%]" />
                    </div>

                </div>
            ))}
        </div>
    )
}

function PipelineIllustration() {
    const stages = [
        { label: 'WISHLIST', color: '#3b82f6', title: 'UX Designer', company: 'Google', badge: 'Remote', badgeBg: '#f3f4f6', badgeText: '#374151' },
        { label: 'APPLIED', color: '#f59e0b', title: 'UX Designer', company: 'Google', badge: 'Remote', badgeBg: '#f3f4f6', badgeText: '#374151' },
        { label: 'INTERVIEW', color: '#00C295', title: 'UX Designer', company: 'Google', badge: 'Remote', badgeBg: '#f3f4f6', badgeText: '#374151' },
        { label: 'OFFER', color: '#8b5cf6', title: 'UX Designer', company: 'Google', badge: 'Remote', badgeBg: '#f3f4f6', badgeText: '#374151' },
    ]
    return (
        <div className="flex items-start gap-2 overflow-x-hidden py-4 px-1">
            {stages.map((s, i) => (
                <div key={i} className="flex items-center gap-2 min-w-0">
                    <div className="flex flex-col gap-1.5 min-w-[120px] shrink-0">
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                            <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: s.color }}>{s.label}</span>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-2.5 flex flex-col gap-1.5"
                            style={{ borderLeft: `3px solid ${s.color}` }}>
                            <p className="text-xs font-semibold text-primary">{s.title}</p>
                            <p className="text-[10px] text-black/60">{s.company}</p>
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm w-fit"
                                style={{ background: s.badgeBg, color: s.badgeText }}>
                                {s.badge}
                            </span>
                        </div>
                    </div>

                </div>
            ))}
        </div>
    )
}

function AddJobIllustration() {
    const stageOptions = ['Wishlist', 'Applied', 'Interview', 'Offer']
    return (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-black/40">Stage</span>
                <div className="flex gap-1.5">
                    {stageOptions.map((s, i) => (
                        <span key={s}
                            className={`text-[10px] px-2.5 py-1 rounded-md border font-medium ${i === 0
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white text-black/60 border-gray-200'}`}>
                            {s}
                        </span>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-black/40">Company</span>
                    <div className="bg-white border border-gray-200 rounded-md px-2.5 py-1.5 text-xs text-primary">Anthropic</div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-black/40">Role</span>
                    <div className="bg-white border border-gray-200 rounded-md px-2.5 py-1.5 text-xs text-primary">UI Engineer</div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-black/40">Location</span>
                    <div className="bg-white border border-gray-200 rounded-md px-2.5 py-1.5 text-xs text-primary">Remote</div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-black/40">Work Type</span>
                    <div className="bg-white border border-gray-200 rounded-md px-2.5 py-1.5 text-xs text-primary">Hybrid</div>
                </div>
            </div>

        </div>
    )
}



function CheckmarkIllustration() {
    return (
        <div className="flex items-center justify-center py-8">
            <div className="relative">
                <div className="w-20 h-20 rounded-full border-[3px] border-[#009905] flex items-center justify-center ob-check-circle">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="ob-checkmark">
                        <path d="M8 16l6 6 10-12" stroke="#009905" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className="absolute inset-0 rounded-full border-[3px] border-[#009905]/20 ob-pulse-ring" />
            </div>
        </div>
    )
}

/* ──────────────────────────── Step Data ──────────────────────────── */

const STEPS = [
    {
        label: 'WELCOME TO HAKBAN',
        heading: "Your job search,\nfinally organised.",
        body: "Track every application from wishlist to offer — all in one board. Let's get you set up in under a minute.",
        illustration: 'kanban',
    },
    {
        label: 'STEP 1 OF 2',
        heading: 'Your board is your pipeline.',
        body: 'Jobs move across five stages — Wishlist, Applied, Interviewing, Offer, and Rejected. Drag cards to progress an application.',
        illustration: 'pipeline',
    },
    {
        label: 'STEP 2 OF 2',
        heading: 'Adding a job takes seconds.',
        body: "Hit + Add application any time to log a new application. Fill in the company, role, location, and the stage it's currently at.",
        illustration: 'addJob',
    },
    {
        label: "YOU'RE ALL SET",
        heading: 'Good luck out there.',
        body: "Your board is ready. Start by adding your first job — even if it's just a wishlist entry. Every great job search begins with one card.",
        illustration: 'checkmark',
    },
]

/* ──────────────────────────── Main Component ──────────────────────────── */

export default function OnboardingModal({ isOpen, onComplete }) {
    const [step, setStep] = useState(0)
    const [direction, setDirection] = useState(1) // 1 = forward, -1 = back
    const [animating, setAnimating] = useState(false)
    const total = STEPS.length


    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return
        const handler = (e) => { if (e.key === 'Escape') handleComplete() }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [isOpen])

    if (!isOpen) return null

    const goTo = (nextStep) => {
        if (animating) return
        setDirection(nextStep > step ? 1 : -1)
        setAnimating(true)
        setTimeout(() => {
            setStep(nextStep)
            setAnimating(false)
        }, 200)
    }

    const handleComplete = () => {
        localStorage.setItem(STORAGE_KEY_DONE, 'true')
        onComplete()
    }

    const current = STEPS[step]

    const renderIllustration = () => {
        switch (current.illustration) {
            case 'kanban': return <KanbanIllustration />
            case 'pipeline': return <PipelineIllustration />
            case 'addJob': return <AddJobIllustration />
            case 'checkmark': return <CheckmarkIllustration />
            default: return null
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 ">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

            {/* Panel */}
            <div
                className="relative bg-white rounded-xl shadow-2xl w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Illustration area */}
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-12">
                    <div
                        className={`transition-all duration-200 ease-in-out ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
                    >
                        {renderIllustration()}
                    </div>
                </div>

                {/* Content area */}
                <div className="px-6 pt-5 pb-4 flex flex-col gap-3 flex-1 overflow-y-auto">
                    <div
                        className={`flex flex-col gap-3 transition-all duration-200 ease-in-out ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
                    >
                        <p className="text-[10px] font-bold uppercase tracking-widest text-blue">
                            {current.label}
                        </p>
                        <h2 className="text-xl font-bold text-primary leading-snug whitespace-pre-line">
                            {current.heading}
                        </h2>
                        <p className="text-sm text-black/60 leading-relaxed">
                            {current.body}
                        </p>
                    </div>
                </div>

                {/* Footer: dots + buttons */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    {/* Step dots */}
                    <div className="flex items-center gap-1.5">
                        {STEPS.map((_, i) => (
                            <div
                                key={i}
                                className={`h-2 rounded-full transition-all duration-300 ${i === step
                                    ? 'w-5 bg-primary'
                                    : 'w-2 bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex items-center gap-2">
                        {step > 0 && (
                            <button
                                onClick={() => goTo(step - 1)}
                                className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-black/60 hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                            >
                                Back
                            </button>
                        )}
                        {step < total - 1 ? (
                            <button
                                onClick={() => goTo(step + 1)}
                                className="text-sm px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-medium cursor-pointer"
                            >
                                {step === 0 ? 'Get started →' : 'Next →'}
                            </button>
                        ) : (
                            <button
                                onClick={handleComplete}
                                className="text-sm px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-medium cursor-pointer"
                            >
                                Open my board →
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}
