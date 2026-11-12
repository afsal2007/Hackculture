import { Check, Globe2, LayoutDashboard, Monitor, Moon, Palette, Sun } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '../context/useTheme'
import { defaultGeneralSettings } from '../data/generalSettings'

const settingsStorageKey = 'arena-research-general-settings'

function loadSettings() {
  try {
    const saved = window.localStorage.getItem(settingsStorageKey)
    return saved ? { ...defaultGeneralSettings, ...JSON.parse(saved) } : defaultGeneralSettings
  } catch {
    return defaultGeneralSettings
  }
}

const themeOptions = [
  { value: 'system', label: 'System', description: 'Use your device preference', icon: Monitor },
  { value: 'light', label: 'Light', description: 'A bright, warm workspace', icon: Sun },
  { value: 'dark', label: 'Dark', description: 'A focused, low-light workspace', icon: Moon },
]

function PreferenceSelect({ id, label, value, onChange, children }) {
  return <div><label htmlFor={id} className="mb-2 block text-sm font-semibold text-[var(--ink)]">{label}</label><select id={id} value={value} onChange={onChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20">{children}</select></div>
}

export default function GeneralSettings() {
  const { themePreference, setThemePreference } = useTheme()
  const [initialThemePreference, setInitialThemePreference] = useState(themePreference)
  const [settings, setSettings] = useState(loadSettings)
  const [draft, setDraft] = useState(settings)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const updateField = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }))
    setFeedback({ type: '', message: '' })
  }

  const cancelChanges = () => {
    setDraft(settings)
    setThemePreference(initialThemePreference)
    setFeedback({ type: '', message: '' })
  }

  const saveSettings = (event) => {
    event.preventDefault()
    try {
      window.localStorage.setItem(settingsStorageKey, JSON.stringify(draft))
      setSettings(draft)
      setInitialThemePreference(themePreference)
      setFeedback({ type: 'success', message: 'General settings saved successfully.' })
    } catch {
      setFeedback({ type: 'error', message: 'Unable to save settings locally. Check your browser storage and try again.' })
    }
  }

  return <div className="mx-auto max-w-[920px]"><header className="mb-8"><p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--teal-dark)]">Settings</p><h1 className="editorial-heading text-4xl tracking-tight text-[var(--ink)] sm:text-[44px]">General settings</h1><p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">Set your appearance, language, and workspace preferences.</p></header>{feedback.message && <div role={feedback.type === 'error' ? 'alert' : 'status'} className={`mb-6 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${feedback.type === 'error' ? 'bg-[#fff1ed] text-[#a75e51] dark:bg-[#3b2623] dark:text-[#e6a398]' : 'bg-[var(--mint)] text-[var(--teal-dark)]'}`}><Check size={16} />{feedback.message}</div>}<form onSubmit={saveSettings} className="space-y-6"><section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8"><div className="mb-6 flex items-start gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--mint)] text-[var(--teal-dark)]"><Palette size={17} /></span><div><h2 className="text-lg font-semibold text-[var(--ink)]">Appearance</h2><p className="mt-1 text-sm text-[var(--muted)]">Choose how Arena Research looks for you.</p></div></div><div className="grid gap-3 sm:grid-cols-3">{themeOptions.map(({ value, label, description, icon: Icon }) => <button key={value} type="button" aria-pressed={themePreference === value} onClick={() => { setThemePreference(value); setFeedback({ type: '', message: '' }) }} className={`flex items-start gap-3 rounded-lg border p-4 text-left transition ${themePreference === value ? 'border-[var(--teal)] bg-[var(--mint)] shadow-sm' : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--teal)]/60 hover:bg-[var(--surface-hover)]'}`}><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${themePreference === value ? 'bg-[var(--teal)] text-white' : 'bg-[var(--cream)] text-[var(--muted)]'}`}><Icon size={16} /></span><span><span className="block text-sm font-semibold text-[var(--ink)]">{label}</span><span className="mt-1 block text-[11px] leading-4 text-[var(--muted)]">{description}</span></span></button>)}</div></section><section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8"><div className="mb-6 flex items-start gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--mint)] text-[var(--teal-dark)]"><Globe2 size={17} /></span><div><h2 className="text-lg font-semibold text-[var(--ink)]">Language and region</h2><p className="mt-1 text-sm text-[var(--muted)]">Control how dates, times, and regional information appear.</p></div></div><div className="grid gap-5 sm:grid-cols-2"><PreferenceSelect id="language" label="Language" value={draft.language} onChange={(event) => updateField('language', event.target.value)}><option>English (US)</option><option>English (UK)</option><option>French</option><option>Spanish</option></PreferenceSelect><PreferenceSelect id="timezone" label="Timezone" value={draft.timezone} onChange={(event) => updateField('timezone', event.target.value)}><option>Pacific Time (PT)</option><option>Mountain Time (MT)</option><option>Central Time (CT)</option><option>Eastern Time (ET)</option><option>UTC</option></PreferenceSelect><PreferenceSelect id="date-format" label="Date format" value={draft.dateFormat} onChange={(event) => updateField('dateFormat', event.target.value)}><option>MMM D, YYYY</option><option>MM/DD/YYYY</option><option>DD/MM/YYYY</option></PreferenceSelect><PreferenceSelect id="time-format" label="Time format" value={draft.timeFormat} onChange={(event) => updateField('timeFormat', event.target.value)}><option>12-hour</option><option>24-hour</option></PreferenceSelect></div></section><section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8"><div className="mb-6 flex items-start gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--mint)] text-[var(--teal-dark)]"><LayoutDashboard size={17} /></span><div><h2 className="text-lg font-semibold text-[var(--ink)]">Application preferences</h2><p className="mt-1 text-sm text-[var(--muted)]">Choose how you want to start and scan your workspace.</p></div></div><div className="space-y-5"><PreferenceSelect id="landing-page" label="Default landing page" value={draft.landingPage} onChange={(event) => updateField('landingPage', event.target.value)}><option>Dashboard</option><option>Research</option><option>Team members</option></PreferenceSelect><label className="flex items-start gap-3 rounded-lg border border-[var(--border)] p-4"><input type="checkbox" checked={draft.compactTables} onChange={(event) => updateField('compactTables', event.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--teal)]" /><span><span className="block text-sm font-semibold text-[var(--ink)]">Use compact tables</span><span className="mt-1 block text-xs leading-5 text-[var(--muted)]">Show more research items in table views.</span></span></label></div></section><div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={cancelChanges} className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-hover)]">Reset changes</button><button type="submit" className="rounded-lg bg-[var(--teal)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--teal-dark)]">Save changes</button></div></form></div>
}