import type { PipelineNode, PipelineEdge } from '@/types'

const STORAGE_KEY = 'bioflow_projects'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SavedProject {
  id: string
  name: string
  missionId: string
  nodes: PipelineNode[]
  edges: PipelineEdge[]
  createdAt: string
  updatedAt: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function load(): Record<string, SavedProject> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, SavedProject>) : {}
  } catch {
    return {}
  }
}

function persist(projects: Record<string, SavedProject>): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  } catch { /* storage full — silently ignore */ }
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export function listProjects(): SavedProject[] {
  return Object.values(load()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

export function saveProject(
  name: string,
  missionId: string,
  nodes: PipelineNode[],
  edges: PipelineEdge[],
  existingId?: string
): SavedProject {
  const projects = load()
  const now = new Date().toISOString()
  const id = existingId ?? `proj_${Date.now()}`

  const project: SavedProject = {
    id,
    name: name.trim() || 'Untitled Pipeline',
    missionId,
    nodes,
    edges,
    createdAt: projects[id]?.createdAt ?? now,
    updatedAt: now,
  }

  projects[id] = project
  persist(projects)
  return project
}

export function loadProject(id: string): SavedProject | null {
  return load()[id] ?? null
}

export function deleteProject(id: string): void {
  const projects = load()
  delete projects[id]
  persist(projects)
}

export function duplicateProject(id: string): SavedProject | null {
  const source = load()[id]
  if (!source) return null
  return saveProject(
    `${source.name} (copy)`,
    source.missionId,
    source.nodes,
    source.edges
  )
}
