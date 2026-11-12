import { Check, MoreHorizontal, Search, ShieldCheck, UserPlus, Users, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { defaultTeamMembers, memberRoles } from '../data/teamMembers'

const membersStorageKey = 'arena-research-team-members'
const activeWorkspaceKey = 'arena-research-active-workspace'
const currentUserRole = 'Owner'

function readMembers() {
  try {
    const saved = window.localStorage.getItem(membersStorageKey)
    return saved ? JSON.parse(saved) : defaultTeamMembers
  } catch {
    return defaultTeamMembers
  }
}

function getWorkspaceName() {
  try {
    const active = JSON.parse(window.localStorage.getItem(activeWorkspaceKey))
    return active && active !== 'personal' ? 'Northstar Research' : 'Personal workspace'
  } catch {
    return 'Personal workspace'
  }
}

function InviteModal({ onClose, onInvite }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Researcher')
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }
    onInvite({ email: email.trim().toLowerCase(), role })
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--ink)]/30 p-5" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div role="dialog" aria-modal="true" aria-labelledby="invite-member-title" className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl"><div className="mb-6 flex items-start justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--teal-dark)]">Team members</p><h2 id="invite-member-title" className="mt-1 text-xl font-semibold text-[var(--ink)]">Invite a member</h2><p className="mt-2 text-sm leading-5 text-[var(--muted)]">Send a mock invitation to join this workspace.</p></div><button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--ink)]"><X size={18} /></button></div><form onSubmit={submit} className="space-y-5"><div><label htmlFor="member-email" className="mb-2 block text-sm font-semibold text-[var(--ink)]">Email address</label><input id="member-email" type="email" autoFocus value={email} onChange={(event) => { setEmail(event.target.value); setError('') }} placeholder="colleague@company.com" className={`w-full rounded-lg border bg-[var(--surface)] px-3.5 py-3 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20 ${error ? 'border-[#b86b5e]' : 'border-[var(--border)]'}`} />{error && <p role="alert" className="mt-1.5 text-xs text-[#b86b5e]">{error}</p>}</div><div><label htmlFor="member-role" className="mb-2 block text-sm font-semibold text-[var(--ink)]">Role</label><select id="member-role" value={role} onChange={(event) => setRole(event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--teal)]"><option>Admin</option><option>Researcher</option><option>Viewer</option></select></div><p className="rounded-lg bg-[var(--mint)] p-3 text-xs leading-5 text-[var(--muted)]">This is a local mock invitation. No email will be sent.</p><div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--surface-hover)]">Cancel</button><button type="submit" className="rounded-lg bg-[var(--teal)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--teal-dark)]">Invite member</button></div></form></div></div>
}

function MemberAvatar({ member }) {
  const avatarClass = member.tone === 'champagne' ? 'bg-[var(--champagne)]' : member.tone === 'teal' ? 'bg-[var(--teal)]' : 'bg-[var(--ink)]'
  return <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarClass} text-white`}>{member.initials}</span>
}

export default function TeamMembers() {
  const [members, setMembers] = useState(readMembers)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All roles')
  const [modalOpen, setModalOpen] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const [pendingRemoval, setPendingRemoval] = useState(null)

  const canManage = currentUserRole === 'Owner' || currentUserRole === 'Admin'
  const filteredMembers = useMemo(() => members.filter((member) => {
    const matchesSearch = `${member.name} ${member.email}`.toLowerCase().includes(search.toLowerCase())
    return matchesSearch && (roleFilter === 'All roles' || member.role === roleFilter)
  }), [members, roleFilter, search])

  const persistMembers = (nextMembers) => {
    setMembers(nextMembers)
    window.localStorage.setItem(membersStorageKey, JSON.stringify(nextMembers))
  }

  const inviteMember = ({ email, role }) => {
    if (members.some((member) => member.email === email)) {
      setFeedback({ type: 'error', message: 'This person is already a member of the workspace.' })
      return
    }
    const name = email.split('@')[0].split(/[._-]/).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
    const nextMember = { id: `invited-${Date.now()}`, name, email, role, status: 'Invited', initials: name.split(' ').map((part) => part[0]).join('').slice(0, 2), tone: 'teal' }
    persistMembers([...members, nextMember])
    setFeedback({ type: 'success', message: `Invitation created for ${email}.` })
    setModalOpen(false)
  }

  const changeRole = (member, role) => {
    if (member.role === 'Owner' && role !== 'Owner' && members.filter((item) => item.role === 'Owner').length === 1) {
      setFeedback({ type: 'error', message: 'The workspace must always have one Owner.' })
      return
    }
    if (currentUserRole === 'Admin' && !['Researcher', 'Viewer'].includes(role)) {
      setFeedback({ type: 'error', message: 'Admins can only manage Researchers and Viewers.' })
      return
    }
    persistMembers(members.map((item) => item.id === member.id ? { ...item, role } : item))
    setFeedback({ type: 'success', message: `${member.name}'s role was updated to ${role}.` })
  }

  const removeMember = () => {
    if (!pendingRemoval) return
    if (pendingRemoval.role === 'Owner' && members.filter((member) => member.role === 'Owner').length === 1) {
      setFeedback({ type: 'error', message: 'The only workspace Owner cannot be removed.' })
      setPendingRemoval(null)
      return
    }
    persistMembers(members.filter((member) => member.id !== pendingRemoval.id))
    setFeedback({ type: 'success', message: `${pendingRemoval.name} was removed from the workspace.` })
    setPendingRemoval(null)
  }

  return <div className="mx-auto max-w-[1080px]"><header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--teal-dark)]">{getWorkspaceName()}</p><h1 className="editorial-heading text-4xl tracking-tight text-[var(--ink)] sm:text-[44px]">Team members</h1><p className="mt-3 text-sm leading-6 text-[var(--muted)]">Manage who can access this workspace and what they can do.</p></div>{canManage && <button type="button" onClick={() => { setFeedback({ type: '', message: '' }); setModalOpen(true) }} className="inline-flex w-fit items-center gap-2 rounded-lg bg-[var(--teal)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--teal-dark)]"><UserPlus size={16} />Invite member</button>}</header>{feedback.message && <div role={feedback.type === 'error' ? 'alert' : 'status'} className={`mb-6 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${feedback.type === 'error' ? 'bg-[#fff1ed] text-[#a75e51] dark:bg-[#3b2623] dark:text-[#e6a398]' : 'bg-[var(--mint)] text-[var(--teal-dark)]'}`}><Check size={16} />{feedback.message}</div>}<section className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-center"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--mint)] text-[var(--teal-dark)]"><Users size={18} /></span><div><h2 className="text-lg font-semibold text-[var(--ink)]">{members.length} members</h2><p className="mt-1 text-sm text-[var(--muted)]">{members.filter((member) => member.status === 'Active').length} active · {members.filter((member) => member.status === 'Invited').length} invited</p></div></div><div className="flex flex-col gap-3 sm:flex-row"><label className="relative"><span className="sr-only">Search members</span><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search members" aria-label="Search members" className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-9 pr-3 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--teal)] sm:w-56" /></label><label><span className="sr-only">Filter by role</span><select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} aria-label="Filter by role" className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--teal)] sm:w-36">{memberRoles.map((role) => <option key={role}>{role}</option>)}</select></label></div></div></section><section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]"><div className="hidden grid-cols-[minmax(0,1.5fr)_minmax(110px,0.7fr)_minmax(100px,0.6fr)_minmax(130px,0.7fr)_44px] gap-4 border-b border-[var(--border)] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)] md:grid"><span>Member</span><span>Role</span><span>Status</span><span>Joined</span><span /></div>{filteredMembers.map((member) => <div key={member.id} className="grid gap-4 border-b border-[var(--border)] px-5 py-4 last:border-b-0 md:grid-cols-[minmax(0,1.5fr)_minmax(110px,0.7fr)_minmax(100px,0.6fr)_minmax(130px,0.7fr)_44px] md:items-center"><div className="flex min-w-0 items-center gap-3"><MemberAvatar member={member} /><div className="min-w-0"><p className="truncate text-sm font-semibold text-[var(--ink)]">{member.name}</p><p className="truncate text-xs text-[var(--muted)]">{member.email}</p></div></div><div className="flex items-center gap-2 md:block"> <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)] md:hidden">Role</span>{canManage && member.role !== 'Owner' ? <select aria-label={`Role for ${member.name}`} value={member.role} onChange={(event) => changeRole(member, event.target.value)} className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-xs font-semibold text-[var(--ink)] outline-none focus:border-[var(--teal)]"><option>Admin</option><option>Researcher</option><option>Viewer</option></select> : <span className="text-xs font-semibold text-[var(--ink)]">{member.role}</span>}</div><div className="flex items-center gap-2"><span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)] md:hidden">Status</span><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${member.status === 'Active' ? 'bg-[var(--mint)] text-[var(--teal-dark)]' : 'bg-[var(--cream)] text-[var(--muted)]'}`}>{member.status}</span></div><div className="flex items-center gap-2 text-xs text-[var(--muted)]"><span className="md:hidden">Joined</span>Nov 2026</div><div className="text-right">{canManage && member.role !== 'Owner' && <button type="button" onClick={() => setPendingRemoval(member)} aria-label={`More actions for ${member.name}`} className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--ink)]"><MoreHorizontal size={17} /></button>}</div></div>)}{filteredMembers.length === 0 && <div className="px-5 py-14 text-center"><Search className="mx-auto text-[var(--muted)]" size={24} /><h2 className="mt-3 text-base font-semibold text-[var(--ink)]">No members found</h2><p className="mt-1 text-sm text-[var(--muted)]">Try a different name, email, or role filter.</p></div>}</section><div className="mt-5 flex items-start gap-2 text-xs leading-5 text-[var(--muted)]"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-[var(--teal)]" />You are an Owner in this mock workspace. Owners can manage all member roles and remove members.</div>{modalOpen && <InviteModal onClose={() => setModalOpen(false)} onInvite={inviteMember} />}{pendingRemoval && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--ink)]/30 p-5"><div role="dialog" aria-modal="true" aria-labelledby="remove-member-title" className="w-full max-w-sm rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl"><h2 id="remove-member-title" className="text-lg font-semibold text-[var(--ink)]">Remove {pendingRemoval.name}?</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">They will lose access to this workspace in the mock data.</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setPendingRemoval(null)} className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--surface-hover)]">Cancel</button><button type="button" onClick={removeMember} className="rounded-lg bg-[#a75e51] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#8f4b40]">Remove member</button></div></div></div>}</div>
}