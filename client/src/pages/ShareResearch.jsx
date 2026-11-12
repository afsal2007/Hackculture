import { Check, Search, Share2, UserMinus, UserPlus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getSharing, saveSharing } from '../services/sharingService'
import { loadLatestResearch } from '../services/reportStorage'

const members = ['Maya Chen', 'Jordan Lee', 'Riley Patel', 'Sam Rivera']

export default function ShareResearch() {
  const research = useLocation().state?.research || loadLatestResearch()
  const subject = research?.subject || 'Acme Technologies'
  const [selected, setSelected] = useState([])
  const [permission, setPermission] = useState('Viewer')
  const [organizationWide, setOrganizationWide] = useState(false)
  const [query, setQuery] = useState('')
  const [feedback, setFeedback] = useState('')
  const [saving, setSaving] = useState(false)
  useEffect(() => { getSharing(subject).then((access) => { setSelected(access.recipients || access.selected || []); setPermission(access.permission || 'Viewer'); setOrganizationWide(Boolean(access.organizationWide)) }) }, [subject])
  const visibleMembers = useMemo(() => members.filter((member) => member.toLowerCase().includes(query.toLowerCase())), [query])
  const save = async () => { setSaving(true); setFeedback(''); try { await saveSharing(subject, { recipients: selected, permission, organizationWide }); setFeedback('Access changes saved locally. They will sync when mock mode is disabled.') } finally { setSaving(false) } }

  return <div className="mx-auto max-w-[700px]"><header className="mb-8"><p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--teal-dark)]">Research access</p><h1 className="editorial-heading text-4xl tracking-tight text-[var(--ink)]">Manage access</h1><p className="mt-3 text-sm text-[var(--muted)]">Private by default. Control access to the {subject} report.</p></header><section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">{feedback && <div role="status" className="mb-5 flex gap-2 rounded-lg bg-[var(--mint)] p-3 text-sm text-[var(--teal-dark)]"><Check size={16} />{feedback}</div>}<label className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-4 text-sm text-[var(--ink)]"><input type="checkbox" checked={organizationWide} onChange={(event) => setOrganizationWide(event.target.checked)} className="accent-[var(--teal)]" />Share with the entire organization</label><div className="mt-6"><label htmlFor="member-search" className="mb-3 block text-sm font-semibold text-[var(--ink)]">Select members</label><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" /><input id="member-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search members" className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[var(--teal)]" /></div>{visibleMembers.map((member) => <label key={member} className="flex items-center gap-3 py-2 text-sm text-[var(--ink)]"><input type="checkbox" checked={selected.includes(member)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, member] : current.filter((item) => item !== member))} className="accent-[var(--teal)]" />{member}</label>)}</div>{selected.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{selected.map((member) => <button key={member} type="button" onClick={() => setSelected((current) => current.filter((item) => item !== member))} className="inline-flex items-center gap-1 rounded-full bg-[var(--mint)] px-3 py-1.5 text-xs text-[var(--teal-dark)]"><UserMinus size={13} />{member}</button>)}</div>}<label className="mt-6 block text-sm font-semibold text-[var(--ink)]">Permission<select value={permission} onChange={(event) => setPermission(event.target.value)} className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-3 text-sm font-normal text-[var(--ink)]"><option>Viewer</option><option>Editor</option></select></label><div className="mt-7 flex justify-end"><button type="button" disabled={saving} onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-[var(--teal)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-70"><Share2 size={16} />{saving ? 'Saving…' : 'Save access'}</button></div></section><p className="mt-4 text-xs text-[var(--muted)]"><UserPlus size={14} className="mr-1 inline" />Mock permissions only. No invitations or backend access changes are sent.</p></div>
}
