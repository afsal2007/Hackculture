import { AlertCircle, CalendarDays, Check, Mail, Pencil, ShieldCheck, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { defaultProfile } from '../data/profileData'

const profileStorageKey = 'arena-research-profile'

function loadProfile() {
  try {
    const saved = window.localStorage.getItem(profileStorageKey)
    return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile
  } catch {
    return defaultProfile
  }
}

function ProfileField({ id, label, value, onChange, type = 'text', error, disabled = false }) {
  return <div><label htmlFor={id} className="mb-2 block text-sm font-semibold text-[var(--ink)]">{label}</label><input id={id} type={type} value={value} onChange={onChange} disabled={disabled} className={`w-full rounded-lg border bg-[var(--surface)] px-3.5 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20 disabled:cursor-not-allowed disabled:bg-[var(--cream)] disabled:text-[var(--muted)] ${error ? 'border-[#b86b5e]' : 'border-[var(--border)]'}`} />{error && <p className="mt-1.5 flex items-center gap-1 text-xs text-[#b86b5e]"><AlertCircle size={13} />{error}</p>}</div>
}

export default function Profile() {
  const [profile, setProfile] = useState(loadProfile)
  const [draft, setDraft] = useState(profile)
  const [isEditing, setIsEditing] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const [errors, setErrors] = useState({})

  const beginEditing = () => {
    setDraft(profile)
    setErrors({})
    setFeedback({ type: '', message: '' })
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setDraft(profile)
    setErrors({})
    setFeedback({ type: '', message: '' })
    setIsEditing(false)
  }

  const updateField = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
    setFeedback({ type: '', message: '' })
  }

  const saveProfile = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!draft.fullName.trim()) nextErrors.fullName = 'Enter your full name.'
    if (!draft.email.trim()) nextErrors.email = 'Enter your email address.'
    else if (!/^\S+@\S+\.\S+$/.test(draft.email)) nextErrors.email = 'Enter a valid email address.'
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setFeedback({ type: 'error', message: 'Please correct the highlighted fields.' })
      return
    }
    try {
      const nextProfile = { ...draft, initials: draft.fullName.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() }
      window.localStorage.setItem(profileStorageKey, JSON.stringify(nextProfile))
      setProfile(nextProfile)
      setDraft(nextProfile)
      setIsEditing(false)
      setFeedback({ type: 'success', message: 'Profile changes saved successfully.' })
    } catch {
      setFeedback({ type: 'error', message: 'We could not save your changes locally. Try again.' })
    }
  }

  return <div className="mx-auto max-w-[920px]"><header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--teal-dark)]">Account</p><h1 className="editorial-heading text-4xl tracking-tight text-[var(--ink)] sm:text-[44px]">My profile</h1><p className="mt-3 text-sm leading-6 text-[var(--muted)]">Manage your personal information and workspace identity.</p></div>{!isEditing && <button type="button" onClick={beginEditing} className="inline-flex w-fit items-center gap-2 rounded-lg bg-[var(--teal)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--teal-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)] focus:ring-offset-2"><Pencil size={16} />Edit profile</button>}</header><div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]"><main className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8"><div className="mb-8 flex flex-col gap-5 border-b border-[var(--border)] pb-7 sm:flex-row sm:items-center"><div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--champagne)] text-xl font-bold text-white ring-4 ring-[var(--cream)]">{(isEditing ? draft : profile).initials}</div><div><h2 className="text-xl font-semibold text-[var(--ink)]">{(isEditing ? draft : profile).fullName}</h2><p className="mt-1 text-sm text-[var(--muted)]">{profile.accountType}</p>{isEditing && <p className="mt-2 text-xs text-[var(--muted)]">Profile photo updates will be available when accounts are connected.</p>}</div></div>{feedback.message && <div role={feedback.type === 'error' ? 'alert' : 'status'} className={`mb-6 flex items-center gap-2 rounded-lg px-3.5 py-3 text-sm ${feedback.type === 'error' ? 'bg-[#fff1ed] text-[#a75e51] dark:bg-[#3b2623] dark:text-[#e6a398]' : 'bg-[var(--mint)] text-[var(--teal-dark)]'}`}>{feedback.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}{feedback.message}</div>}{isEditing ? <form onSubmit={saveProfile} className="space-y-5"><ProfileField id="profile-full-name" label="Full name" value={draft.fullName} onChange={(event) => updateField('fullName', event.target.value)} error={errors.fullName} /><ProfileField id="profile-email" label="Email address" type="email" value={draft.email} onChange={(event) => updateField('email', event.target.value)} error={errors.email} /><div className="grid gap-5 sm:grid-cols-2"><ProfileField id="profile-account-type" label="Account type" value={draft.accountType} onChange={(event) => updateField('accountType', event.target.value)} /><ProfileField id="profile-member-since" label="Member since" value={draft.memberSince} onChange={(event) => updateField('memberSince', event.target.value)} /></div><div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-6 sm:flex-row sm:justify-end"><button type="button" onClick={cancelEditing} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"><X size={16} />Cancel</button><button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--teal)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--teal-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)] focus:ring-offset-2"><Check size={16} />Save changes</button></div></form> : <div className="grid gap-6 sm:grid-cols-2"><div className="flex items-start gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--mint)] text-[var(--teal-dark)]"><UserRound size={16} /></span><div><p className="text-xs text-[var(--muted)]">Full name</p><p className="mt-1 text-sm font-semibold text-[var(--ink)]">{profile.fullName}</p></div></div><div className="flex items-start gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--mint)] text-[var(--teal-dark)]"><Mail size={16} /></span><div><p className="text-xs text-[var(--muted)]">Email address</p><p className="mt-1 break-all text-sm font-semibold text-[var(--ink)]">{profile.email}</p></div></div><div className="flex items-start gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--cream)] text-[var(--champagne)]"><ShieldCheck size={16} /></span><div><p className="text-xs text-[var(--muted)]">Account type</p><p className="mt-1 text-sm font-semibold text-[var(--ink)]">{profile.accountType}</p></div></div><div className="flex items-start gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--cream)] text-[var(--champagne)]"><CalendarDays size={16} /></span><div><p className="text-xs text-[var(--muted)]">Member since</p><p className="mt-1 text-sm font-semibold text-[var(--ink)]">{profile.memberSince}</p></div></div></div>}</main><aside className="space-y-4"><div className="rounded-xl border border-[var(--border)] bg-[var(--mint)] p-5"><div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--surface)] text-[var(--teal)]"><ShieldCheck size={17} /></div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--teal-dark)]">Your account</p><h2 className="mt-2 text-lg font-semibold text-[var(--ink)]">Private by design.</h2><p className="mt-3 text-xs leading-5 text-[var(--muted)]">Your profile details are stored locally for this prototype and are not sent to a server.</p></div><div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Workspace</p><p className="mt-2 text-sm font-semibold text-[var(--ink)]">{profile.accountType}</p><p className="mt-1 text-xs leading-5 text-[var(--muted)]">Your research, reports, and briefings live here.</p></div></aside></div></div>
}