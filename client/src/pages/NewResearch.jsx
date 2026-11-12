import { Building2, ChevronDown, Factory, Globe2, Info, Lightbulb, Plus, Search, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveResearchContext } from '../services/reportStorage'

const researchTypes = [
  { value: 'company', label: 'Company', description: 'Understand a business', icon: Building2 },
  { value: 'person', label: 'Person', description: 'Prepare for a person', icon: UserRound },
  { value: 'industry', label: 'Industry', description: 'Explore a market', icon: Factory },
]

const objectives = ['Company overview', 'Recent news', 'Key people', 'Competitors', 'Market trends', 'Financials']

const initialForm = {
  type: 'company',
  subject: '',
  website: '',
  purpose: '',
  context: '',
  objectives: ['Company overview', 'Recent news'],
  depth: 'Comprehensive',
}

function FieldLabel({ children, optional = false, htmlFor }) {
  return <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-[var(--ink)]">{children}{optional && <span className="ml-1 font-normal text-[var(--muted)]">(optional)</span>}</label>
}

function TextInput({ id, value, onChange, placeholder, type = 'text', error }) {
  return <div><input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full rounded-lg border bg-[var(--surface)] px-3.5 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] hover:border-[var(--teal)]/60 focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20 ${error ? 'border-[#b86b5e]' : 'border-[var(--border)]'}`} />{error && <p className="mt-1.5 text-xs text-[#b86b5e]">{error}</p>}</div>
}

export default function NewResearch() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [errors, setErrors] = useState({})

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: '' }))
  }

  const selectType = (type) => {
    setForm((current) => ({ ...current, type, website: '' }))
    setErrors({})
  }

  const toggleObjective = (objective) => {
    setForm((current) => ({
      ...current,
      objectives: current.objectives.includes(objective)
        ? current.objectives.filter((item) => item !== objective)
        : [...current.objectives, objective],
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!form.subject.trim()) nextErrors.subject = `Enter a ${form.type} to research.`
    if (!form.purpose.trim()) nextErrors.purpose = 'Tell us what you want to accomplish in the meeting.'
    if (form.objectives.length === 0) nextErrors.objectives = 'Select at least one research objective.'
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    saveResearchContext(form)
    navigate('/research/progress', { state: { research: form } })
  }

  const subjectLabel = form.type === 'company' ? 'Company name' : form.type === 'person' ? 'Person name' : 'Industry'
  const subjectPlaceholder = form.type === 'company' ? 'e.g. Northstar Health' : form.type === 'person' ? 'e.g. Maya Chen' : 'e.g. Climate technology'

  return <div className="mx-auto max-w-[1120px]">
    <div className="mb-8"><p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--teal-dark)]">Start a new investigation</p><h1 className="editorial-heading text-4xl tracking-tight text-[var(--ink)] sm:text-[44px]">New research</h1><p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">Give your agents the context they need to build a briefing you can trust.</p></div>
    <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
      <form onSubmit={handleSubmit} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8">
        <section><div className="mb-5"><h2 className="text-lg font-semibold text-[var(--ink)]">What are you researching?</h2><p className="mt-1 text-sm text-[var(--muted)]">Choose a focus for your research agents.</p></div><div className="grid gap-3 sm:grid-cols-3">{researchTypes.map(({ value, label, description, icon: Icon }) => <button key={value} type="button" aria-pressed={form.type === value} onClick={() => selectType(value)} className={`flex items-start gap-3 rounded-lg border p-3.5 text-left transition ${form.type === value ? 'border-[var(--teal)] bg-[var(--mint)] shadow-sm' : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--teal)]/60 hover:bg-[var(--surface-hover)]'}`}><span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${form.type === value ? 'bg-[var(--teal)] text-white' : 'bg-[var(--cream)] text-[var(--muted)]'}`}><Icon size={16} /></span><span><span className="block text-sm font-semibold text-[var(--ink)]">{label}</span><span className="mt-0.5 block text-[11px] leading-4 text-[var(--muted)]">{description}</span></span></button>)}</div></section>
        <div className="my-8 h-px bg-[var(--border)]" />
        <section className="space-y-5"><div><FieldLabel htmlFor="subject">{subjectLabel}</FieldLabel><TextInput id="subject" value={form.subject} onChange={(event) => updateForm('subject', event.target.value)} placeholder={subjectPlaceholder} error={errors.subject} /></div>{form.type !== 'industry' && <div><FieldLabel htmlFor="website" optional>Website URL</FieldLabel><div className="relative"><Globe2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} /><input id="website" type="url" value={form.website} onChange={(event) => updateForm('website', event.target.value)} placeholder="https://" className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-3 pl-10 pr-3.5 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] hover:border-[var(--teal)]/60 focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20" /></div></div>}<div><FieldLabel htmlFor="purpose">What is the purpose of your meeting?</FieldLabel><TextInput id="purpose" value={form.purpose} onChange={(event) => updateForm('purpose', event.target.value)} placeholder="e.g. Explore a potential partnership" error={errors.purpose} /></div><div><FieldLabel htmlFor="context" optional>Meeting context</FieldLabel><textarea id="context" value={form.context} onChange={(event) => updateForm('context', event.target.value)} rows="4" placeholder="Share anything that will help the agents understand your conversation..." className="w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-sm leading-6 text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] hover:border-[var(--teal)]/60 focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20" /></div></section>
        <div className="my-8 h-px bg-[var(--border)]" />
        <section><div className="mb-4"><h2 className="text-lg font-semibold text-[var(--ink)]">What should we focus on?</h2><p className="mt-1 text-sm text-[var(--muted)]">Select all the topics you want covered.</p></div><div className="flex flex-wrap gap-2">{objectives.map((objective) => { const selected = form.objectives.includes(objective); return <button key={objective} type="button" aria-pressed={selected} onClick={() => toggleObjective(objective)} className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition ${selected ? 'border-[var(--teal)] bg-[var(--mint)] text-[var(--teal-dark)]' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--teal)]/60 hover:text-[var(--ink)]'}`}>{selected ? <X size={13} /> : <Plus size={13} />}{objective}</button> })}</div>{errors.objectives && <p className="mt-2 text-xs text-[#b86b5e]">{errors.objectives}</p>}</section>
        <div className="my-8 h-px bg-[var(--border)]" />
        <section><button type="button" aria-expanded={showAdvanced} onClick={() => setShowAdvanced((current) => !current)} className="flex w-full items-center justify-between text-left"><span><span className="block text-sm font-semibold text-[var(--ink)]">Advanced research options</span><span className="mt-1 block text-xs text-[var(--muted)]">Tune the depth and focus of your research</span></span><ChevronDown size={18} className={`text-[var(--muted)] transition-transform ${showAdvanced ? 'rotate-180' : ''}`} /></button>{showAdvanced && <div className="mt-5 grid gap-3 rounded-lg bg-[var(--cream)] p-4 sm:grid-cols-2"><label className="text-xs font-semibold text-[var(--ink)]" htmlFor="depth">Research depth<select id="depth" value={form.depth} onChange={(event) => updateForm('depth', event.target.value)} className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm font-normal text-[var(--ink)] outline-none focus:border-[var(--teal)]"><option>Focused</option><option>Comprehensive</option><option>Deep dive</option></select></label><div className="flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-xs leading-5 text-[var(--muted)]"><Info size={15} className="mt-0.5 shrink-0 text-[var(--teal)]" />A deeper search may take longer but gives agents more sources to compare.</div></div>}</section>
        <div className="mt-8 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center"><p className="text-xs leading-5 text-[var(--muted)]">Your research will be investigated by two independent AI agents.</p><button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--teal)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--teal-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)] focus:ring-offset-2"><Search size={16} />Start research</button></div>
      </form>
      <aside className="rounded-xl border border-[var(--border)] bg-[var(--mint)] p-6"><div className="mb-6 flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--surface)] text-[var(--teal)]"><Lightbulb size={17} /></div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--teal-dark)]">Your research journey</p><h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--ink)]">From question to confidence.</h2><div className="mt-7 space-y-5">{['Tell us what you need to know', 'Two agents research independently', 'Review your meeting-ready briefing'].map((step, index) => <div key={step} className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--teal)] text-xs font-bold text-white">{index + 1}</span><p className="pt-1 text-sm leading-5 text-[var(--ink)]">{step}</p></div>)}</div><div className="mt-7 border-t border-[var(--teal)]/20 pt-5"><p className="text-xs leading-5 text-[var(--muted)]">Tip: The more context you share, the more useful your briefing becomes.</p></div></aside>
    </div>
  </div>
}