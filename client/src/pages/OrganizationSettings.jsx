import { AlertCircle, Building2, CalendarDays, Check, Globe2, Mail, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { defaultWorkspaces } from '../data/workspaces'
import { defaultOrganizationSettings } from '../data/organizationSettings'
import { defaultTeamMembers } from '../data/teamMembers'

const activeWorkspaceKey = 'arena-research-active-workspace'
const createdWorkspacesKey = 'arena-research-created-workspaces'
const settingsStoragePrefix = 'arena-research-organization-settings:'

function readJson(key, fallback) {
  try {
    const saved = window.localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

function getActiveWorkspace() {
  const activeId = readJson(activeWorkspaceKey, 'personal')
  const workspaces = [...defaultWorkspaces, ...readJson(createdWorkspacesKey, [])]
  return workspaces.find((workspace) => workspace.id === activeId) || defaultWorkspaces[0]
}

function getStorageKey(id) {
  return `${settingsStoragePrefix}${id}`
}

function getMemberCount() {
  return readJson('arena-research-team-members', defaultTeamMembers).length
}

function isValidWebsite(value) {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

function SettingsField({ id, label, value, onChange, disabled, error, type = 'text', placeholder }) {
  return <div><label htmlFor={id} className="mb-2 block text-sm font-semibold text-[var(--ink)]">{label}</label><input id={id} type={type} value={value} onChange={onChange} disabled={disabled} placeholder={placeholder} className={`w-full rounded-lg border bg-[var(--surface)] px-3.5 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20 disabled:cursor-not-allowed disabled:bg-[var(--cream)] disabled:text-[var(--muted)] ${error ? 'border-[#b86b5e]' : 'border-[var(--border)]'}`} />{error && <p role="alert" className="mt-1.5 flex items-center gap-1 text-xs text-[#b86b5e]"><AlertCircle size={13} />{error}</p>}</div>
}

export default function OrganizationSettings() {
  const workspace = useMemo(() => getActiveWorkspace(), [])
  const isOrganization = workspace.type === 'Organization'
  const defaultSettings = defaultOrganizationSettings[workspace.id] || { name: workspace.name, website: '', description: '', contactEmail: '', visibility: 'Members only', sharing: 'Workspace members', timezone: 'Pacific Time (PT)', createdAt: 'November 2026' }
  const savedSettings = readJson(getStorageKey(workspace.id), defaultSettings)
  const [settings, setSettings] = useState(savedSettings)
  const [draft, setDraft] = useState(savedSettings)
  const [isEditing, setIsEditing] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const [errors, setErrors] = useState({})
  const canEdit = workspace.role === 'Owner' || workspace.role === 'Admin'
  const memberCount = getMemberCount()

  const updateField = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
    setFeedback({ type: '', message: '' })
  }

  const startEditing = () => {
    setDraft(settings)
    setErrors({})
    setFeedback({ type: '', message: '' })
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setDraft(settings)
    setErrors({})
    setFeedback({ type: '', message: '' })
    setIsEditing(false)
  }

  const saveSettings = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!draft.name.trim()) nextErrors.name = 'Organization name is required.'
    if (!draft.contactEmail.trim()) nextErrors.contactEmail = 'Contact email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(draft.contactEmail)) nextErrors.contactEmail = 'Enter a valid contact email.'
    if (draft.website && !isValidWebsite(draft.website)) nextErrors.website = 'Enter a valid website URL, including https://.'
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setFeedback({ type: 'error', message: 'Please correct the highlighted fields.' })
      return
    }
    try {
      window.localStorage.setItem(getStorageKey(workspace.id), JSON.stringify(draft))
      setSettings(draft)
      setDraft(draft)
      setIsEditing(false)
      setFeedback({ type: 'success', message: 'Organization settings saved successfully.' })
    } catch {
      setFeedback({ type: 'error', message: 'Unable to save settings locally. Check your browser storage and try again.' })
    }
  }

  if (!isOrganization) return <div className="mx-auto max-w-[760px]"><div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center sm:p-10"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--cream)] text-[var(--muted)]"><Building2 size={22} /></div><p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--teal-dark)]">Organization settings</p><h1 className="editorial-heading mt-2 text-3xl tracking-tight text-[var(--ink)]">Select an organization workspace</h1><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">Organization settings are available after you select an organization workspace. Personal workspace details are managed from My Profile.</p><Link to="/workspace" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--teal)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--teal-dark)]">Choose workspace</Link></div></div>

  return <div className="mx-auto max-w-[1040px]"><header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--teal-dark)]">{settings.name}</p><h1 className="editorial-heading text-4xl tracking-tight text-[var(--ink)] sm:text-[44px]">Organization settings</h1><p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">Manage organization details and workspace preferences.</p></div>{canEdit && !isEditing && <button type="button" onClick={startEditing} className="inline-flex w-fit items-center gap-2 rounded-lg bg-[var(--teal)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--teal-dark)]">Edit settings</button>}</header>{feedback.message && <div role={feedback.type === 'error' ? 'alert' : 'status'} className={`mb-6 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${feedback.type === 'error' ? 'bg-[#fff1ed] text-[#a75e51] dark:bg-[#3b2623] dark:text-[#e6a398]' : 'bg-[var(--mint)] text-[var(--teal-dark)]'}`}><Check size={16} />{feedback.message}</div>}<div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_290px]"><main className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8"><div className="mb-8 flex flex-col gap-5 border-b border-[var(--border)] pb-7 sm:flex-row sm:items-center"><div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--teal)] text-xl font-bold text-white ring-4 ring-[var(--mint)]">{settings.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</div><div><h2 className="text-xl font-semibold text-[var(--ink)]">{settings.name}</h2><p className="mt-1 text-sm text-[var(--muted)]">Organization workspace · {workspace.role}</p><p className="mt-2 text-xs text-[var(--muted)]">Logo uploads will be available when organization storage is connected.</p></div></div>{isEditing ? <form onSubmit={saveSettings} className="space-y-5"><SettingsField id="organization-name" label="Organization name" value={draft.name} onChange={(event) => updateField('name', event.target.value)} disabled={!canEdit} error={errors.name} /><SettingsField id="organization-website" label="Organization website" value={draft.website} onChange={(event) => updateField('website', event.target.value)} disabled={!canEdit} error={errors.website} placeholder="https://" /><div><label htmlFor="organization-description" className="mb-2 block text-sm font-semibold text-[var(--ink)]">Description</label><textarea id="organization-description" value={draft.description} onChange={(event) => updateField('description', event.target.value)} disabled={!canEdit} rows="4" className="w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-sm leading-6 text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20 disabled:cursor-not-allowed disabled:bg-[var(--cream)] disabled:text-[var(--muted)]" /></div><SettingsField id="organization-contact" label="Organization contact email" type="email" value={draft.contactEmail} onChange={(event) => updateField('contactEmail', event.target.value)} disabled={!canEdit} error={errors.contactEmail} /><div className="grid gap-5 border-t border-[var(--border)] pt-5 sm:grid-cols-3"><div><label htmlFor="organization-visibility" className="mb-2 block text-sm font-semibold text-[var(--ink)]">Workspace visibility</label><select id="organization-visibility" value={draft.visibility} onChange={(event) => updateField('visibility', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--teal)]"><option>Members only</option><option>Invite only</option><option>Public link</option></select></div><div><label htmlFor="organization-sharing" className="mb-2 block text-sm font-semibold text-[var(--ink)]">Research sharing</label><select id="organization-sharing" value={draft.sharing} onChange={(event) => updateField('sharing', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--teal)]"><option>Workspace members</option><option>Only me</option><option>Organization-wide</option></select></div><div><label htmlFor="organization-timezone" className="mb-2 block text-sm font-semibold text-[var(--ink)]">Timezone</label><select id="organization-timezone" value={draft.timezone} onChange={(event) => updateField('timezone', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--teal)]"><option>Pacific Time (PT)</option><option>Mountain Time (MT)</option><option>Central Time (CT)</option><option>Eastern Time (ET)</option><option>UTC</option></select></div></div><div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-6 sm:flex-row sm:justify-end"><button type="button" onClick={cancelEditing} className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--surface-hover)]">Cancel</button><button type="submit" className="rounded-lg bg-[var(--teal)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--teal-dark)]">Save changes</button></div></form> : <div className="space-y-7"><div className="grid gap-6 sm:grid-cols-2"><div className="flex items-start gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--mint)] text-[var(--teal-dark)]"><Building2 size={16} /></span><div><p className="text-xs text-[var(--muted)]">Organization name</p><p className="mt-1 text-sm font-semibold text-[var(--ink)]">{settings.name}</p></div></div><div className="flex items-start gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--mint)] text-[var(--teal-dark)]"><Globe2 size={16} /></span><div><p className="text-xs text-[var(--muted)]">Website</p><p className="mt-1 break-all text-sm font-semibold text-[var(--ink)]">{settings.website || 'Not added'}</p></div></div><div className="flex items-start gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--mint)] text-[var(--teal-dark)]"><Mail size={16} /></span><div><p className="text-xs text-[var(--muted)]">Contact email</p><p className="mt-1 break-all text-sm font-semibold text-[var(--ink)]">{settings.contactEmail || 'Not added'}</p></div></div></div><div><p className="text-xs text-[var(--muted)]">Description</p><p className="mt-2 text-sm leading-6 text-[var(--ink)]">{settings.description || 'No description added.'}</p></div><div className="grid gap-6 border-t border-[var(--border)] pt-6 sm:grid-cols-3"><div><p className="text-xs text-[var(--muted)]">Workspace visibility</p><p className="mt-1 text-sm font-semibold text-[var(--ink)]">{settings.visibility}</p></div><div><p className="text-xs text-[var(--muted)]">Research sharing</p><p className="mt-1 text-sm font-semibold text-[var(--ink)]">{settings.sharing}</p></div><div><p className="text-xs text-[var(--muted)]">Timezone</p><p className="mt-1 text-sm font-semibold text-[var(--ink)]">{settings.timezone}</p></div></div></div>}</main><aside className="space-y-4"><div className="rounded-xl border border-[var(--border)] bg-[var(--mint)] p-5"><div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--surface)] text-[var(--teal)]"><ShieldCheck size={17} /></div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--teal-dark)]">Administrative information</p><div className="mt-5 space-y-4"><div><p className="text-xs text-[var(--muted)]">Organization owner</p><p className="mt-1 text-sm font-semibold text-[var(--ink)]">Alex Smith</p></div><div><p className="text-xs text-[var(--muted)]">Member count</p><p className="mt-1 text-sm font-semibold text-[var(--ink)]">{memberCount} members</p></div><div className="flex items-start gap-2"><CalendarDays size={15} className="mt-0.5 text-[var(--teal)]" /><div><p className="text-xs text-[var(--muted)]">Created</p><p className="mt-1 text-sm font-semibold text-[var(--ink)]">{settings.createdAt}</p></div></div><div><p className="text-xs text-[var(--muted)]">Your role</p><p className="mt-1 text-sm font-semibold text-[var(--ink)]">{workspace.role}</p></div></div></div><div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"><p className="text-xs leading-5 text-[var(--muted)]">Only Owners and Admins can update organization details and workspace preferences.</p></div></aside></div></div>
}