import { Bell, Check, Clock3, Mail, RefreshCcw, Users } from 'lucide-react'
import { useState } from 'react'
import { defaultNotificationPreferences } from '../data/notificationPreferences'

const storageKey = 'arena-research-notification-preferences'

function loadPreferences() {
  try {
    const saved = window.localStorage.getItem(storageKey)
    return saved ? { ...defaultNotificationPreferences, ...JSON.parse(saved) } : defaultNotificationPreferences
  } catch {
    return defaultNotificationPreferences
  }
}

function Toggle({ id, label, description, checked, onChange, disabled = false }) {
  return <label htmlFor={id} className={`flex items-center justify-between gap-4 rounded-lg border border-[var(--border)] p-4 transition ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-[var(--surface-hover)]'}`}><span className="min-w-0"><span className="block text-sm font-semibold text-[var(--ink)]">{label}</span>{description && <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">{description}</span>}</span><span className="relative h-6 w-11 shrink-0"><input id={id} type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} disabled={disabled} className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed" /><span className="pointer-events-none block h-6 w-11 rounded-full bg-[var(--border)] transition peer-checked:bg-[var(--teal)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--teal)]/40 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" /></span></label>
}

function PreferenceSection({ icon: Icon, title, description, children }) {
  return <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8"><div className="mb-6 flex items-start gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--mint)] text-[var(--teal-dark)]"><Icon size={17} /></span><div><h2 className="text-lg font-semibold text-[var(--ink)]">{title}</h2><p className="mt-1 text-sm text-[var(--muted)]">{description}</p></div></div>{children}</section>
}

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState(loadPreferences)
  const [draft, setDraft] = useState(preferences)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const updatePreference = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }))
    setFeedback({ type: '', message: '' })
  }

  const savePreferences = (event) => {
    event.preventDefault()
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(draft))
      setPreferences(draft)
      setFeedback({ type: 'success', message: 'Notification preferences saved successfully.' })
    } catch {
      setFeedback({ type: 'error', message: 'Unable to save preferences locally. Check your browser storage and try again.' })
    }
  }

  const resetPreferences = () => {
    setDraft(preferences)
    setFeedback({ type: '', message: '' })
  }

  const resetDefaults = () => {
    setDraft(defaultNotificationPreferences)
    setFeedback({ type: '', message: '' })
  }

  return <div className="mx-auto max-w-[920px]"><header className="mb-8"><p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--teal-dark)]">Settings</p><h1 className="editorial-heading text-4xl tracking-tight text-[var(--ink)] sm:text-[44px]">Notification preferences</h1><p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">Choose which updates reach you and how often Arena Research checks in.</p></header>{feedback.message && <div role={feedback.type === 'error' ? 'alert' : 'status'} className={`mb-6 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${feedback.type === 'error' ? 'bg-[#fff1ed] text-[#a75e51] dark:bg-[#3b2623] dark:text-[#e6a398]' : 'bg-[var(--mint)] text-[var(--teal-dark)]'}`}><Check size={16} />{feedback.message}</div>}<form onSubmit={savePreferences} className="space-y-6"><PreferenceSection icon={Bell} title="Delivery channels" description="Choose where Arena Research can send updates."><div className="space-y-3"><Toggle id="in-app-notifications" label="In-app notifications" description="See updates in your Arena Research workspace." checked={draft.inApp} onChange={(value) => updatePreference('inApp', value)} /><Toggle id="email-notifications" label="Email notifications" description="Receive important updates in your inbox." checked={draft.email} onChange={(value) => updatePreference('email', value)} /></div></PreferenceSection><PreferenceSection icon={RefreshCcw} title="Research activity" description="Stay informed about the research tasks you start."><div className="space-y-3"><Toggle id="research-completed" label="Research completed" description="When an agent finishes a research task." checked={draft.researchCompleted} onChange={(value) => updatePreference('researchCompleted', value)} disabled={!draft.inApp && !draft.email} /><Toggle id="research-attention" label="Research needs attention" description="When a task fails or needs your review." checked={draft.researchAttention} onChange={(value) => updatePreference('researchAttention', value)} disabled={!draft.inApp && !draft.email} /><Toggle id="research-progress" label="Research progress updates" description="Periodic updates while agents are working." checked={draft.researchProgress} onChange={(value) => updatePreference('researchProgress', value)} disabled={!draft.inApp && !draft.email} /></div><p className="mt-4 text-xs text-[var(--muted)]">Turn on at least one delivery channel to manage research alerts.</p></PreferenceSection><PreferenceSection icon={Users} title="Team and collaboration" description="Choose how you hear about activity in your workspaces."><div className="space-y-3"><Toggle id="workspace-invitations" label="Workspace invitations" description="When someone invites you to a workspace." checked={draft.workspaceInvitations} onChange={(value) => updatePreference('workspaceInvitations', value)} disabled={!draft.inApp && !draft.email} /><Toggle id="member-changes" label="Member joined or left" description="When membership changes in your workspace." checked={draft.memberChanges} onChange={(value) => updatePreference('memberChanges', value)} disabled={!draft.inApp && !draft.email} /><Toggle id="research-shared" label="Research shared with you" description="When a teammate shares a report or briefing." checked={draft.researchShared} onChange={(value) => updatePreference('researchShared', value)} disabled={!draft.inApp && !draft.email} /><Toggle id="collaboration" label="Comments and collaboration" description="When someone comments or responds to your work." checked={draft.collaboration} onChange={(value) => updatePreference('collaboration', value)} disabled={!draft.inApp && !draft.email} /></div></PreferenceSection><PreferenceSection icon={Mail} title="Digest preferences" description="Control the rhythm of non-urgent updates."><div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="notification-frequency" className="mb-2 block text-sm font-semibold text-[var(--ink)]">Notification frequency</label><select id="notification-frequency" value={draft.frequency} onChange={(event) => updatePreference('frequency', event.target.value)} disabled={!draft.email} className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--teal)] disabled:cursor-not-allowed disabled:bg-[var(--cream)] disabled:text-[var(--muted)]"><option>Instant</option><option>Daily digest</option><option>Weekly digest</option></select></div><div className="flex items-end"><Toggle id="quiet-hours" label="Quiet hours" description="Pause email delivery during set hours." checked={draft.quietHours} onChange={(value) => updatePreference('quietHours', value)} disabled={!draft.email} /></div></div>{draft.quietHours && <div className="mt-5 grid gap-5 rounded-lg bg-[var(--cream)] p-4 sm:grid-cols-2"><div><label htmlFor="quiet-start" className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">From</label><input id="quiet-start" type="time" value={draft.quietStart} onChange={(event) => updatePreference('quietStart', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--teal)]" /></div><div><label htmlFor="quiet-end" className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">Until</label><input id="quiet-end" type="time" value={draft.quietEnd} onChange={(event) => updatePreference('quietEnd', event.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--teal)]" /></div></div>}</PreferenceSection><div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><button type="button" onClick={resetDefaults} className="inline-flex items-center gap-2 self-start rounded-lg px-1 py-2.5 text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]"><Clock3 size={15} />Reset to defaults</button><div className="flex flex-col-reverse gap-3 sm:flex-row"><button type="button" onClick={resetPreferences} className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--surface-hover)]">Cancel</button><button type="submit" className="rounded-lg bg-[var(--teal)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--teal-dark)]">Save changes</button></div></div></form></div>
}