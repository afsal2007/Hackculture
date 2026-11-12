import { Building2, Check, ChevronRight, CircleUserRound, KeyRound, Plus, Users, X } from 'lucide-react'
import { useState } from 'react'
import { defaultWorkspaces } from '../data/workspaces'

const activeWorkspaceKey = 'arena-research-active-workspace'
const createdWorkspacesKey = 'arena-research-created-workspaces'

function readStorage(key, fallback) {
  try {
    const saved = window.localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

function WorkspaceModal({ mode, onClose, onSubmit }) {
  const isCreate = mode === 'create'
  const [name, setName] = useState('')
  const [details, setDetails] = useState('')
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    if (!name.trim()) {
      setError(isCreate ? 'Enter an organization name.' : 'Enter an invitation code.')
      return
    }
    onSubmit({ name: name.trim(), details: details.trim() })
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--ink)]/30 p-5" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div role="dialog" aria-modal="true" aria-labelledby="workspace-modal-title" className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl"><div className="mb-6 flex items-start justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--teal-dark)]">Workspace</p><h2 id="workspace-modal-title" className="mt-1 text-xl font-semibold text-[var(--ink)]">{isCreate ? 'Create organization' : 'Join a workspace'}</h2><p className="mt-2 text-sm leading-5 text-[var(--muted)]">{isCreate ? 'Set up a shared space for your research team.' : 'Enter the invitation code shared by your workspace owner.'}</p></div><button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--ink)]"><X size={18} /></button></div><form onSubmit={submit} className="space-y-5"><div><label htmlFor="workspace-name" className="mb-2 block text-sm font-semibold text-[var(--ink)]">{isCreate ? 'Organization name' : 'Invitation code'}</label><input id="workspace-name" autoFocus value={name} onChange={(event) => { setName(event.target.value); setError('') }} placeholder={isCreate ? 'e.g. Northstar Research' : 'e.g. ARENA-8F2K'} className={`w-full rounded-lg border bg-[var(--surface)] px-3.5 py-3 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20 ${error ? 'border-[#b86b5e]' : 'border-[var(--border)]'}`} />{error && <p role="alert" className="mt-1.5 text-xs text-[#b86b5e]">{error}</p>}</div>{isCreate && <div><label htmlFor="workspace-details" className="mb-2 block text-sm font-semibold text-[var(--ink)]">Description <span className="font-normal text-[var(--muted)]">(optional)</span></label><textarea id="workspace-details" value={details} onChange={(event) => setDetails(event.target.value)} rows="3" placeholder="What will this workspace be used for?" className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-sm leading-5 text-[var(--ink)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20" /></div>}{!isCreate && <p className="rounded-lg bg-[var(--mint)] p-3 text-xs leading-5 text-[var(--muted)]">This is a mock join flow. No invitation will be sent or accepted by a server.</p>}<div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--surface-hover)]">Cancel</button><button type="submit" className="rounded-lg bg-[var(--teal)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--teal-dark)]">{isCreate ? 'Create organization' : 'Join workspace'}</button></div></form></div></div>
}

function WorkspaceCard({ workspace, active, onSelect }) {
  const isPersonal = workspace.id === 'personal'
  return <button type="button" aria-pressed={active} onClick={() => onSelect(workspace.id)} className={`group flex w-full items-center gap-4 rounded-xl border p-5 text-left transition ${active ? 'border-[var(--teal)] bg-[var(--mint)] shadow-sm' : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--teal)]/60 hover:bg-[var(--surface-hover)]'}`}><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${workspace.tone === 'champagne' ? 'bg-[var(--champagne)] text-white' : workspace.tone === 'teal' ? 'bg-[var(--teal)] text-white' : 'bg-[var(--ink)] text-[var(--ivory)]'}`}>{workspace.initials}</span><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2"><span className="truncate text-sm font-semibold text-[var(--ink)]">{workspace.name}</span>{active && <span className="inline-flex items-center gap-1 rounded-full bg-[var(--teal)] px-2 py-0.5 text-[10px] font-semibold text-white"><Check size={10} />Active</span>}</span><span className="mt-1 block text-xs text-[var(--muted)]">{workspace.type} · {workspace.role}</span></span><ChevronRight size={17} className={`shrink-0 transition ${active ? 'text-[var(--teal-dark)]' : 'text-[var(--muted)] group-hover:text-[var(--ink)]'}`} />{isPersonal && <span className="sr-only">Personal workspace</span>}</button>
}

export default function WorkspaceManagement() {
  const [createdWorkspaces, setCreatedWorkspaces] = useState(() => readStorage(createdWorkspacesKey, []))
  const [activeWorkspace, setActiveWorkspace] = useState(() => readStorage(activeWorkspaceKey, 'personal'))
  const [modal, setModal] = useState('')
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const workspaces = [...defaultWorkspaces, ...createdWorkspaces]

  const selectWorkspace = (id, selectedWorkspace = workspaces.find((item) => item.id === id)) => {
    setActiveWorkspace(id)
    window.localStorage.setItem(activeWorkspaceKey, JSON.stringify(id))
    setFeedback({ type: 'success', message: `${selectedWorkspace.name} is now your active workspace.` })
  }

  const createOrganization = ({ name, details }) => {
    const workspace = { id: `organization-${Date.now()}`, name, details, type: 'Organization', role: 'Owner', initials: name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(), tone: 'teal' }
    const next = [...createdWorkspaces, workspace]
    setCreatedWorkspaces(next)
    window.localStorage.setItem(createdWorkspacesKey, JSON.stringify(next))
    selectWorkspace(workspace.id, workspace)
    setModal('')
  }

  const joinWorkspace = ({ name }) => {
    if (name.toUpperCase() !== 'ARENA-8F2K') {
      setFeedback({ type: 'error', message: 'That invitation code is not recognized in this mock workspace.' })
      setModal('')
      return
    }
    setFeedback({ type: 'success', message: 'Invitation accepted. Northstar Research is now active.' })
    selectWorkspace('northstar')
    setModal('')
  }

  return <div className="mx-auto max-w-[980px]"><header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--teal-dark)]">Account</p><h1 className="editorial-heading text-4xl tracking-tight text-[var(--ink)] sm:text-[44px]">Workspace management</h1><p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">Switch between your research spaces or create one for your team.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => { setFeedback({ type: '', message: '' }); setModal('join') }} className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-hover)]"><KeyRound size={16} />Join workspace</button><button type="button" onClick={() => { setFeedback({ type: '', message: '' }); setModal('create') }} className="inline-flex items-center gap-2 rounded-lg bg-[var(--teal)] px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--teal-dark)]"><Plus size={16} />Create organization</button></div></header>{feedback.message && <div role={feedback.type === 'error' ? 'alert' : 'status'} className={`mb-6 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${feedback.type === 'error' ? 'bg-[#fff1ed] text-[#a75e51] dark:bg-[#3b2623] dark:text-[#e6a398]' : 'bg-[var(--mint)] text-[var(--teal-dark)]'}`}><Check size={16} />{feedback.message}</div>}<div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]"><main><section className="mb-7"><div className="mb-4 flex items-center gap-2"><CircleUserRound size={17} className="text-[var(--teal)]" /><div><h2 className="text-lg font-semibold text-[var(--ink)]">Your workspaces</h2><p className="mt-1 text-sm text-[var(--muted)]">You can access these spaces with your current account.</p></div></div><div className="space-y-3">{workspaces.map((workspace) => <WorkspaceCard key={workspace.id} workspace={workspace} active={workspace.id === activeWorkspace} onSelect={selectWorkspace} />)}</div></section><section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"><div className="flex items-start gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--mint)] text-[var(--teal-dark)]"><Users size={17} /></span><div><h2 className="text-base font-semibold text-[var(--ink)]">Workspace roles</h2><p className="mt-1 text-xs leading-5 text-[var(--muted)]">Owners can manage workspace settings. Researchers can run investigations and prepare reports.</p></div></div></section></main><aside className="space-y-4 lg:sticky lg:top-6"><div className="rounded-xl border border-[var(--border)] bg-[var(--mint)] p-5"><div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--surface)] text-[var(--teal)]"><Building2 size={17} /></div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--teal-dark)]">Current workspace</p><h2 className="mt-2 text-lg font-semibold text-[var(--ink)]">{workspaces.find((item) => item.id === activeWorkspace)?.name || 'Personal workspace'}</h2><p className="mt-2 text-xs leading-5 text-[var(--muted)]">New research and reports will be associated with this workspace.</p></div><button type="button" onClick={() => setModal('join')} className="flex w-full items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-left transition hover:border-[var(--teal)]/60 hover:bg-[var(--surface-hover)]"><span><span className="block text-sm font-semibold text-[var(--ink)]">Have an invitation?</span><span className="mt-1 block text-xs text-[var(--muted)]">Join with a workspace code</span></span><KeyRound size={17} className="text-[var(--teal)]" /></button></aside></div>{modal && <WorkspaceModal mode={modal} onClose={() => setModal('')} onSubmit={modal === 'create' ? createOrganization : joinWorkspace} />}</div>
}