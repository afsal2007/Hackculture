import { api, useMockApi } from './api'

const key = (researchId) => `arena-research-sharing:${researchId}`
const fallback = { recipients: [], permission: 'Viewer', organizationWide: false }

export async function getSharing(researchId) {
  if (!useMockApi) return api.get(`/research/${encodeURIComponent(researchId)}/access`)
  try { return JSON.parse(window.localStorage.getItem(key(researchId))) || fallback } catch { return fallback }
}

export async function saveSharing(researchId, access) {
  if (!useMockApi) return api.put(`/research/${encodeURIComponent(researchId)}/access`, access)
  window.localStorage.setItem(key(researchId), JSON.stringify(access))
  return access
}
