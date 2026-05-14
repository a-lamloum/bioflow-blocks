'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import {
  listProjectsDb,
  saveProjectDb,
  deleteProjectDb,
  duplicateProjectDb,
  getCurrentUser,
} from '@/lib/supabase/database'
import { loadProject, type SavedProject } from '@/lib/projects/projects'
import type { PipelineNode, PipelineEdge, Mission } from '@/types'

interface ProjectsPanelProps {
  currentNodes: PipelineNode[]
  currentEdges: PipelineEdge[]
  activeMission: Mission
  onLoad: (nodes: PipelineNode[], edges: PipelineEdge[]) => void
  onClose: () => void
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function ProjectsPanel({
  currentNodes,
  currentEdges,
  activeMission,
  onLoad,
  onClose,
}: ProjectsPanelProps) {
  const [projects, setProjects] = useState<SavedProject[]>([])
  const [saveName, setSaveName] = useState('')
  const [savedId, setSavedId] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const refresh = useCallback(async () => {
    const list = await listProjectsDb()
    setProjects(list)
  }, [])

  useEffect(() => {
    refresh()
    getCurrentUser().then(u => setIsLoggedIn(!!u))
  }, [refresh])

  const handleSave = async () => {
    if (!saveName.trim() && currentNodes.length === 0) return
    const project = await saveProjectDb(
      saveName || 'My Pipeline',
      activeMission.id,
      currentNodes,
      currentEdges,
      savedId ?? undefined
    )
    setSavedId(project.id)
    setSaveName(project.name)
    refresh()
  }

  const handleLoad = (id: string) => {
    const p = loadProject(id) ?? projects.find(pr => pr.id === id)
    if (!p) return
    onLoad(p.nodes, p.edges)
    setSavedId(id)
    setSaveName(p.name)
    onClose()
  }

  const handleDelete = async (id: string) => {
    await deleteProjectDb(id)
    if (savedId === id) { setSavedId(null); setSaveName('') }
    refresh()
  }

  const handleDuplicate = async (id: string) => {
    await duplicateProjectDb(id)
    refresh()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-[oklch(0%_0_0_/_0.5)]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label="My Projects"
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col w-80 border-l border-border bg-surface shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="text-lg font-bold text-fg-primary">My Projects</h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="text-fg-muted hover:text-fg-primary transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* Save current */}
        <div className="px-5 py-4 border-b border-border shrink-0 flex flex-col gap-2">
          <label className="text-xs font-semibold text-fg-muted uppercase tracking-wide">
            Save current pipeline
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="Pipeline name…"
              className="flex-1 px-3 py-2 rounded-lg text-sm bg-surface-2 border border-border text-fg-primary placeholder:text-fg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            />
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={currentNodes.length === 0}
              className="shrink-0 px-3 h-9 text-sm"
            >
              Save
            </Button>
          </div>
          {currentNodes.length === 0 && (
            <p className="text-xs text-fg-muted">Add blocks to the canvas first.</p>
          )}
        </div>

        {/* Saved projects list */}
        <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-2">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-3xl mb-3">📂</span>
              <p className="text-sm text-fg-muted">No saved projects yet.</p>
              <p className="text-xs text-fg-muted mt-1">Build a pipeline and save it above.</p>
            </div>
          ) : (
            projects.map(p => (
              <div
                key={p.id}
                className={[
                  'flex flex-col gap-1 p-3 rounded-xl border transition-colors',
                  savedId === p.id
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-border bg-surface-2 hover:border-border-strong',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-fg-primary truncate">{p.name}</p>
                    <p className="text-xs text-fg-muted">{p.nodes.length} blocks · {formatDate(p.updatedAt)}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      aria-label={`Load ${p.name}`}
                      onClick={() => handleLoad(p.id)}
                      className="px-2 py-1 rounded text-xs font-semibold text-teal-600 hover:bg-teal-100 transition-colors"
                    >
                      Load
                    </button>
                    <button
                      aria-label={`Duplicate ${p.name}`}
                      onClick={() => handleDuplicate(p.id)}
                      className="px-2 py-1 rounded text-xs text-fg-muted hover:text-fg-secondary hover:bg-surface transition-colors"
                    >
                      Copy
                    </button>
                    <button
                      aria-label={`Delete ${p.name}`}
                      onClick={() => handleDelete(p.id)}
                      className="px-2 py-1 rounded text-xs text-error hover:bg-surface transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-5 py-3 border-t border-border shrink-0">
          {isLoggedIn
            ? <p className="text-xs text-fg-muted">Projects synced to your account.</p>
            : <p className="text-xs text-fg-muted">
                Projects saved locally.{' '}
                <span className="text-teal-500">Sign in</span> to sync across devices.
              </p>
          }
        </div>
      </aside>
    </>
  )
}
