import React, { useState, useEffect } from 'react'
import Header from './components/header'
import KanbanBoard from './components/list'
import AddApplicationModal from './components/AddApplicationModal'
import JobDetailModal from './components/JobDetailModal'
// import { SAMPLE_JOBS } from './data/jobs'
import './App.css'
import Footer from './components/footer'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
const STORAGE_KEY = 'hakban_jobs'

function loadJobs() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    // return saved ? JSON.parse(saved) : SAMPLE_JOBS
    return saved ? JSON.parse(saved) : []
  } catch {
    // return SAMPLE_JOBS
    return []
  }
}

export default function App() {
  const [jobs, setJobs] = useState(loadJobs)
  const [addModal, setAddModal] = useState({ open: false, stage: 'wishlist' })
  const [selectedJob, setSelectedJob] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
  }, [jobs])

  const openAddModal = (stage = 'wishlist') => setAddModal({ open: true, stage })
  const closeAddModal = () => setAddModal(m => ({ ...m, open: false }))

  const handleAddJob = (job) => setJobs(prev => [job, ...prev])

  const handleStar = (id) =>
    setJobs(prev => prev.map(j => j.id === id ? { ...j, starred: !j.starred } : j))

  const handleMoveJob = (id, newStage) =>
    setJobs(prev => prev.map(j => j.id === id ? { ...j, stage: newStage } : j))

  const handleArchive = (id) =>
    setJobs(prev => prev.map(j => j.id === id ? { ...j, stage: 'rejected' } : j))

  const handleEditJob = (job) => {
    // Open the add modal pre-filled — extend later
    openAddModal(job.stage)
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
      <div className="h-full flex flex-col bg-secondary">
        <Header onAddApplication={() => openAddModal()} />
        <main className="flex-1 overflow-auto flex flex-col">
          <KanbanBoard
            jobs={jobs}
            onStar={handleStar}
            onAdd={openAddModal}
            onCardClick={setSelectedJob}
            onMoveJob={handleMoveJob}
          />
          <div className="mt-auto min-w-max">
            <Footer />
          </div>
        </main>
        <AddApplicationModal
          isOpen={addModal.open}
          initialStage={addModal.stage}
          onClose={closeAddModal}
          onSave={handleAddJob}
        />
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onArchive={handleArchive}
          onEdit={handleEditJob}
        />
      </div>

    </>
  )
}
