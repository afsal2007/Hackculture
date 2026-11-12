import { Bot, Check, ChevronDown, Download, FileText, Lightbulb, MessageCircle, Plus, Save, Send, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { reportSections, reportSources } from '../data/reportData'
import { getReportStorageKey, loadLatestResearch, loadSavedReport } from '../services/reportStorage'

function AssistantPanel({ onApply }) {
  const [message, setMessage] = useState('')
  const [reply, setReply] = useState('')
  const suggestions = ['Make the summary sharper', 'Suggest meeting questions', 'Highlight the main risk']

  const askAssistant = (prompt) => {
    const request = prompt || message
    if (!request.trim()) return
    setReply(`Mock assistant: I would ${request.toLowerCase()} using the evidence from both research agents.`)
    setMessage('')
  }

  return <aside className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"><div className="flex items-center gap-3 border-b border-[var(--border)] pb-4"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--mint)] text-[var(--teal-dark)]"><Bot size={18} /></span><div><h2 className="text-sm font-semibold text-[var(--ink)]">Research assistant</h2><p className="text-[11px] text-[var(--muted)]">Mock workspace assistant</p></div></div><div className="mt-5 rounded-lg bg-[var(--mint)] p-3"><p className="text-xs leading-5 text-[var(--ink)]">Ask me to refine a section or surface a useful angle. Suggestions are mock responses until agent APIs are connected.</p></div><div className="mt-5 space-y-2">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => askAssistant(suggestion)} className="flex w-full items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2.5 text-left text-xs text-[var(--muted)] transition hover:border-[var(--teal)]/70 hover:bg-[var(--surface-hover)] hover:text-[var(--ink)]"><Lightbulb size={14} className="text-[var(--champagne)]" />{suggestion}</button>)}</div>{reply && <div className="mt-5 rounded-lg border border-[var(--teal)]/30 bg-[var(--surface-hover)] p-3"><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--teal-dark)]">Assistant response</p><p className="mt-2 text-xs leading-5 text-[var(--ink)]">{reply}</p><button type="button" onClick={onApply} className="mt-3 text-xs font-semibold text-[var(--teal-dark)] hover:text-[var(--ink)]">Apply to selected section</button></div>}<div className="mt-5 flex gap-2"><input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && askAssistant()} placeholder="Ask a question..." className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-xs text-[var(--ink)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20" aria-label="Ask research assistant" /><button type="button" onClick={() => askAssistant()} aria-label="Send assistant message" className="rounded-lg bg-[var(--teal)] p-2.5 text-white hover:bg-[var(--teal-dark)]"><Send size={15} /></button></div></aside>
}

export default function CombinedReport() {
  const location = useLocation()
  const navigate = useNavigate()
  const research = location.state?.research || loadLatestResearch()
  const subject = research?.subject || 'Acme Technologies'
  const reportStorageKey = getReportStorageKey(subject)
  const savedReport = useMemo(() => loadSavedReport(subject), [subject])
  const [reportTitle, setReportTitle] = useState(() => savedReport?.title || `${subject} briefing`)
  const [reportContext] = useState(() => savedReport?.context || research?.context || '')
  const [sections, setSections] = useState(() => savedReport?.sections || reportSections)
  const [activeSection, setActiveSection] = useState(() => savedReport?.sections?.[0]?.id || reportSections[0].id)
  const [selectedSection, setSelectedSection] = useState(() => savedReport?.sections?.[0]?.id || reportSections[0].id)
  const [saveState, setSaveState] = useState(() => savedReport?.savedAt ? `Saved ${new Date(savedReport.savedAt).toLocaleString()}` : 'Not saved yet')
  const [saveError, setSaveError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [showSources, setShowSources] = useState(false)
  const sectionRefs = useRef({})

  useEffect(() => {
    const handleScroll = () => {
      const current = sections.map((section) => ({ id: section.id, top: sectionRefs.current[section.id]?.getBoundingClientRect().top || Infinity })).filter((section) => section.top < 220).sort((a, b) => b.top - a.top)[0]
      if (current) setActiveSection(current.id)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  const updateSection = (id, field, value) => {
    setSaveState('Unsaved changes')
    setSaveError('')
    setSections((current) => current.map((section) => section.id === id ? { ...section, [field]: value } : section))
  }
  const selected = useMemo(() => sections.find((section) => section.id === selectedSection) || sections[0], [sections, selectedSection])

  const jumpToSection = (id) => {
    setActiveSection(id)
    setSelectedSection(id)
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const addSection = () => {
    const id = `custom-${Date.now()}`
    setSaveState('Unsaved changes')
    setSaveError('')
    setSections((current) => [...current, { id, label: 'New section', title: 'New section', body: 'Add your notes here...', bullets: [] }])
    setSelectedSection(id)
    window.setTimeout(() => sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  const applyAssistant = () => updateSection(selected.id, 'body', `${selected.body} Further discussion should connect this point to measurable customer outcomes and the next phase of the platform roadmap.`)

  const saveReport = () => {
    setIsSaving(true)
    setSaveError('')
    setSaveState('Saving...')
    window.setTimeout(() => {
      try {
        const savedAt = new Date().toISOString()
        window.localStorage.setItem(reportStorageKey, JSON.stringify({
          title: reportTitle,
          subject,
          context: reportContext,
          sections,
          savedAt,
        }))
        setSaveState('Saved successfully')
      } catch {
        setSaveState('Save failed')
        setSaveError('Unable to save this report locally. Check your browser storage settings and try again.')
      } finally {
        setIsSaving(false)
      }
    }, 250)
  }

  const exportMarkdown = () => {
    const markdown = `# ${subject} research report\n\n${sections.map((section) => `## ${section.title}\n\n${section.body}\n\n${section.bullets.map((bullet) => `- ${bullet}`).join('\n')}`).join('\n\n')}\n\n## Sources\n\n${reportSources.map((source) => `- ${source.title} — ${source.source} (${source.status})`).join('\n')}`
    const url = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${subject.toLowerCase().replace(/\s+/g, '-')}-research-report.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  return <div className="mx-auto max-w-[1320px]"><header className="mb-7 flex flex-col justify-between gap-5 border-b border-[var(--border)] pb-6 lg:flex-row lg:items-end"><div><div className="mb-3 flex items-center gap-2 text-xs text-[var(--muted)]"><FileText size={14} />Combined research report <span>·</span><span className="inline-flex items-center gap-1 text-[var(--teal-dark)]"><Check size={12} />Ready to edit</span></div><input value={reportTitle} onChange={(event) => { setReportTitle(event.target.value); setSaveState('Unsaved changes'); setSaveError('') }} className="editorial-heading w-full bg-transparent text-3xl tracking-tight text-[var(--ink)] outline-none sm:text-4xl" aria-label="Report title" /><p className="mt-2 text-sm text-[var(--muted)]">Last saved locally · {saveState}</p>{saveError && <p role="alert" className="mt-1 text-xs text-[#b86b5e]">{saveError}</p>}</div><div className="flex flex-wrap gap-2"><button type="button" onClick={exportMarkdown} className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-hover)]"><Download size={16} />Export</button><button type="button" onClick={saveReport} disabled={isSaving} className="inline-flex items-center gap-2 rounded-lg bg-[var(--teal)] px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--teal-dark)] disabled:cursor-wait disabled:opacity-70"><Save size={16} />{isSaving ? 'Saving...' : 'Save report'}</button></div></header><div className="grid items-start gap-6 xl:grid-cols-[170px_minmax(0,1fr)_290px]"><aside className="order-2 xl:order-1 xl:sticky xl:top-6"><p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">In this report</p><nav className="space-y-1">{sections.map((section) => <button key={section.id} type="button" onClick={() => jumpToSection(section.id)} className={`flex w-full rounded-lg px-3 py-2 text-left text-xs leading-5 transition ${activeSection === section.id ? 'bg-[var(--mint)] font-semibold text-[var(--teal-dark)]' : 'text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--ink)]'}`}>{section.label}</button>)}<button type="button" onClick={addSection} className="mt-3 flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[var(--teal-dark)] hover:text-[var(--ink)]"><Plus size={14} />Add section</button></nav></aside><main className="order-1 min-w-0 xl:order-2"><div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8"><div className="mb-8 flex items-start justify-between gap-4 border-b border-[var(--border)] pb-6"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--teal-dark)]">Meeting preparation</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--ink)]">Research report</h2></div><button type="button" className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--ink)]" aria-label="Report options"><ChevronDown size={18} /></button></div>{sections.map((section) => <section key={section.id} id={section.id} ref={(node) => { sectionRefs.current[section.id] = node }} onClick={() => setSelectedSection(section.id)} className={`scroll-mt-6 border-b border-[var(--border)] py-7 first:pt-0 last:border-b-0 ${selectedSection === section.id ? 'rounded-lg ring-1 ring-[var(--teal)]/20' : ''}`}><input value={section.title} onChange={(event) => updateSection(section.id, 'title', event.target.value)} className="mb-3 w-full bg-transparent text-xl font-semibold text-[var(--ink)] outline-none placeholder:text-[var(--muted)] focus:ring-0" aria-label={`${section.label} title`} /><textarea value={section.body} onChange={(event) => updateSection(section.id, 'body', event.target.value)} rows={4} className="w-full resize-y bg-transparent text-sm leading-7 text-[var(--ink)] outline-none placeholder:text-[var(--muted)]" aria-label={`${section.label} content`} /><ul className="mt-4 space-y-2">{section.bullets.map((bullet, index) => <li key={`${section.id}-${index}`} className="flex items-start gap-2 text-sm leading-6 text-[var(--ink)]"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--teal)]" /><input value={bullet} onChange={(event) => updateSection(section.id, 'bullets', section.bullets.map((item, bulletIndex) => bulletIndex === index ? event.target.value : item))} className="min-w-0 flex-1 bg-transparent outline-none" aria-label={`${section.label} finding ${index + 1}`} /></li>)}</ul></section>)}<button type="button" onClick={() => setShowSources((current) => !current)} className="mt-5 flex items-center gap-2 text-sm font-semibold text-[var(--teal-dark)] hover:text-[var(--ink)]"><ChevronDown size={16} className={`transition-transform ${showSources ? 'rotate-180' : ''}`} />Source references</button>{showSources && <div className="mt-4 space-y-2 border-t border-[var(--border)] pt-4">{reportSources.map((source) => <div key={source.title} className="flex flex-wrap justify-between gap-2 rounded-lg bg-[var(--cream)] px-3 py-2.5 text-xs"><span className="text-[var(--ink)]">{source.title} <span className="text-[var(--muted)]">· {source.source}</span></span><span className={source.status === 'Verified' ? 'text-[var(--teal-dark)]' : 'text-[var(--muted)]'}>{source.status}</span></div>)}</div>}</div><div className="mt-5 flex items-center gap-2 text-xs text-[var(--muted)]"><MessageCircle size={14} />Click any section to focus it for assistant actions.</div></main><div className="order-3 space-y-4 xl:sticky xl:top-6"><AssistantPanel onApply={applyAssistant} /><button type="button" onClick={() => navigate('/reports/brief', { state: { research: location.state?.research } })} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--teal)] bg-[var(--mint)] px-4 py-3 text-sm font-semibold text-[var(--teal-dark)] transition hover:bg-[var(--teal)] hover:text-white">Open meeting-ready brief <Sparkles size={16} /></button></div></div></div>
}
