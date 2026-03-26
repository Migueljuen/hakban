import React, { useState } from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core'
import KanbanColumn from './KanbanColumn'
import KanbanCard from './KanbanCard'
import { COLUMNS } from '../data/jobs'

export default function KanbanBoard({ jobs, onStar, onAdd, onCardClick, onMoveJob }) {
    const [activeJob, setActiveJob] = useState(null)

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    )

    function handleDragStart({ active }) {
        setActiveJob(active.data.current?.job ?? null)
    }

    function handleDragEnd({ active, over }) {
        setActiveJob(null)
        if (!over || active.id === over.id) return
        const targetColumn = COLUMNS.find(c => c.id === over.id)
        if (!targetColumn) return
        const job = jobs.find(j => j.id === active.id)
        if (job && job.stage !== targetColumn.id) {
            onMoveJob?.(active.id, targetColumn.id)
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="px-6 flex gap-4 py-6 flex-1 overflow-auto">
                {COLUMNS.map(col => (
                    <KanbanColumn
                        key={col.id}
                        column={col}
                        jobs={jobs.filter(j => j.stage === col.id)}
                        onStar={onStar}
                        onAdd={onAdd}
                        onCardClick={onCardClick}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeJob ? (
                    <div className="rotate-1 opacity-95 shadow-2xl">
                        <KanbanCard
                            job={activeJob}
                            accent={COLUMNS.find(c => c.id === activeJob.stage)?.accent ?? '#ccc'}
                            isRejected={activeJob.stage === 'rejected'}
                            onStar={() => { }}
                            onClick={() => { }}
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}

