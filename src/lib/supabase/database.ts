/**
 * Supabase-backed data layer for projects and mission progress.
 * Falls back to localStorage when user is not authenticated.
 */
import { getClient } from './client'
import {
  saveProject as localSave,
  listProjects as localList,
  deleteProject as localDelete,
  duplicateProject as localDuplicate,
  type SavedProject,
} from '@/lib/projects/projects'
import type { PipelineNode, PipelineEdge } from '@/types'

// Row shape from the database (matches DB schema exactly)
interface ProjectRow {
  id: string
  user_id: string
  name: string
  mission_id: string
  nodes: unknown
  edges: unknown
  created_at: string
  updated_at: string
}

// ─── Auth helpers ──────────────────────────────────────────────────────────────

export async function getCurrentUser() {
  const supabase = getClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// ─── Projects — Supabase or localStorage fallback ─────────────────────────────

export async function listProjectsDb(): Promise<SavedProject[]> {
  const user = await getCurrentUser()
  if (!user) return localList()

  const supabase = getClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error || !data) return localList()
  const rows = data as unknown as ProjectRow[]
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    missionId: row.mission_id,
    nodes: row.nodes as PipelineNode[],
    edges: row.edges as PipelineEdge[],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))
}

export async function saveProjectDb(
  name: string,
  missionId: string,
  nodes: PipelineNode[],
  edges: PipelineEdge[],
  existingId?: string
): Promise<SavedProject> {
  const user = await getCurrentUser()
  if (!user) return localSave(name, missionId, nodes, edges, existingId)

  const supabase = getClient()
  const now = new Date().toISOString()

  const toRow = (r: unknown): SavedProject => {
    const row = r as ProjectRow
    return { id: row.id, name: row.name, missionId: row.mission_id, nodes: row.nodes as PipelineNode[], edges: row.edges as PipelineEdge[], createdAt: row.created_at, updatedAt: row.updated_at }
  }

  if (existingId) {
    const { data, error } = await supabase
      .from('projects')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update({ name, mission_id: missionId, nodes: nodes as any, edges: edges as any, updated_at: now } as any)
      .eq('id', existingId)
      .eq('user_id', user.id)
      .select()
      .single()
    if (!error && data) return toRow(data)
  }

  const { data, error } = await supabase
    .from('projects')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert({ user_id: user.id, name, mission_id: missionId, nodes: nodes as any, edges: edges as any } as any)
    .select()
    .single()

  if (error || !data) return localSave(name, missionId, nodes, edges, existingId)
  return toRow(data)
}

export async function deleteProjectDb(id: string): Promise<void> {
  const user = await getCurrentUser()
  if (!user) { localDelete(id); return }
  const supabase = getClient()
  await supabase.from('projects').delete().eq('id', id).eq('user_id', user.id)
}

export async function duplicateProjectDb(id: string): Promise<SavedProject | null> {
  const user = await getCurrentUser()
  if (!user) return localDuplicate(id)
  const supabase = getClient()
  const { data: source } = await supabase.from('projects').select('*').eq('id', id).single()
  if (!source) return null
  const s = source as unknown as ProjectRow
  return saveProjectDb(`${s.name} (copy)`, s.mission_id, s.nodes as PipelineNode[], s.edges as PipelineEdge[])
}

// ─── Mission progress ─────────────────────────────────────────────────────────

export async function syncMissionComplete(missionId: string): Promise<void> {
  const user = await getCurrentUser()
  if (!user) return
  const supabase = getClient()
  await supabase
    .from('mission_progress')
    .upsert({ user_id: user.id, mission_id: missionId }, { onConflict: 'user_id,mission_id' })
}

export async function loadCompletedMissionsDb(): Promise<Set<string>> {
  const user = await getCurrentUser()
  if (!user) {
    // Import lazily to avoid circular dependency
    const { loadCompletedMissions } = await import('@/lib/mission/missions')
    return loadCompletedMissions()
  }
  const supabase = getClient()
  const { data } = await supabase
    .from('mission_progress')
    .select('mission_id')
    .eq('user_id', user.id)
  return new Set((data ?? []).map(r => r.mission_id))
}
