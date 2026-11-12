import { ArrowLeft, Check, CheckCircle2, Clipboard, Download, FileText, Flag, Lightbulb, MessageCircle, Sparkles, Target } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { briefActions, briefHighlights, briefQuestions } from '../data/briefData'
import { reportSections, reportSources } from '../data/reportData'
import { loadLatestResearch, loadSavedReport } from '../services/reportStorage'

function BriefCard({ icon: Icon, eyebrow, title, children, className = '' }) {
  return <section className={`rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 ${className}`}><div className="mb-5 flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--mint)] text-[var(--teal-dark)]"><Icon size={17} /></span><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--teal-dark)]">{eyebrow}</p><h2 className="mt-1 text-lg font-semibold text-[var(--ink)]">{title}</h2></div></div>{children}</section>
}

export default function MeetingBrief() {
  const location = useLocation()
  const navigate = useNavigate()
  const research = location.state?.research || loadLatestResearch()
  const subject = research?.subject || 'Acme Technologies'
  const savedReport = useMemo(() => loadSavedReport(subject), [subject])
  const sections = savedReport?.sections || reportSections
  const reportTitle = savedReport?.title || `${subject} briefing`
  const context = savedReport?.context || research?.context || ''
  const [checkedActions, setCheckedActions] = useState([])
  const [copied, setCopied] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [expandedSource, setExpandedSource] = useState(false)

  const summary = sections.find((section) => section.id === 'executive-summary') || sections[0]
  const recommendations = sections.find((section) => section.id === 'recommendations') || sections[sections.length - 1]
  const risks = sections.find((section) => section.id === 'opportunities-risks')
  const questions = briefQuestions

  const briefText = `# Meeting-ready brief: ${subject}\n\n## In one sentence\n${summary.body}\n\n## Key talking points\n${briefHighlights.map((item) => `- ${item.label}: ${item.text}`).join('\n')}\n\n## Questions to ask\n${questions.map((question) => `- ${question}`).join('\n')}\n\n## Recommendations\n${recommendations.bullets.map((bullet) => `- ${bullet}`).join('\n')}`

  const toggleAction = (index) => setCheckedActions((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index])

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(briefText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const exportBrief = () => {
    const url = URL.createObjectURL(new Blob([briefText], { type: 'text/markdown' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${subject.toLowerCase().replace(/\s+/g, '-')}-meeting-brief.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  return <div className="mx-auto max-w-[1120px]"><header className="mb-8 flex flex-col justify-between gap-5 border-b border-[var(--border)] pb-7 lg:flex-row lg:items-end"><div><button type="button" onClick={() => navigate('/reports/combined', { state: { research: location.state?.research } })} className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted)] transition hover:text-[var(--ink)]"><ArrowLeft size={14} />Back to report</button><div className="mb-3 flex items-center gap-2 text-xs text-[var(--teal-dark)]"><Sparkles size={14} />Meeting preparation <span className="text-[var(--muted)]">·</span><span className="inline-flex items-center gap-1"><CheckCircle2 size={13} />Ready to use</span></div><h1 className="editorial-heading text-4xl tracking-tight text-[var(--ink)] sm:text-[48px]">Meeting-ready brief</h1><p className="mt-3 text-sm text-[var(--muted)]">A focused conversation guide for <span className="font-semibold text-[var(--ink)]">{subject}</span>.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={copyBrief} className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-hover)]">{copied ? <Check size={16} /> : <Clipboard size={16} />}{copied ? 'Copied' : 'Copy brief'}</button><button type="button" onClick={exportBrief} className="inline-flex items-center gap-2 rounded-lg bg-[var(--teal)] px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--teal-dark)]"><Download size={16} />Export brief</button></div></header><div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_290px]"><main className="min-w-0 space-y-6"><section className="rounded-xl border border-[var(--teal)]/20 bg-[var(--mint)] p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--teal-dark)]">The conversation in one sentence</p><p className="editorial-heading mt-4 text-2xl leading-9 text-[var(--ink)] sm:text-3xl">{summary.body.split('. ').slice(0, 2).join('. ')}.</p><div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]"><span className="inline-flex items-center gap-1.5"><FileText size={14} />Based on {sections.length} report sections</span>{context && <span className="inline-flex items-center gap-1.5"><MessageCircle size={14} />Meeting context included</span>}</div></section><BriefCard icon={Target} eyebrow="Keep in mind" title="Three things to remember"><div className="grid gap-3">{briefHighlights.map((highlight) => <div key={highlight.label} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--teal-dark)]">{highlight.label}</p><p className="mt-2 text-sm leading-6 text-[var(--ink)]">{highlight.text}</p></div>)}</div></BriefCard><BriefCard icon={MessageCircle} eyebrow="Your conversation" title="Questions worth asking"><ol className="space-y-3">{questions.map((question, index) => <li key={question} className="flex gap-3 rounded-lg bg-[var(--cream)] px-4 py-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--teal)] text-xs font-semibold text-white">{index + 1}</span><p className="pt-0.5 text-sm leading-5 text-[var(--ink)]">{question}</p></li>)}</ol></BriefCard><BriefCard icon={Lightbulb} eyebrow="Suggested direction" title="Recommendations"><p className="mb-4 text-sm leading-6 text-[var(--muted)]">Use these points to move from discovery into a more useful strategic conversation.</p><ul className="space-y-3">{recommendations.bullets.map((bullet) => <li key={bullet} className="flex gap-3 text-sm leading-6 text-[var(--ink)]"><Check size={16} className="mt-1 shrink-0 text-[var(--teal)]" />{bullet}</li>)}</ul></BriefCard>{risks && <BriefCard icon={Flag} eyebrow="Be thoughtful about" title="Opportunities and risks"><p className="text-sm leading-6 text-[var(--muted)]">{risks.body}</p></BriefCard>}</main><aside className="space-y-4 lg:sticky lg:top-6"><section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"><div className="mb-5 flex items-center justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Before you go in</p><h2 className="mt-1 text-lg font-semibold text-[var(--ink)]">Meeting checklist</h2></div><CheckCircle2 size={19} className={isReady ? 'text-[var(--teal)]' : 'text-[var(--champagne)]'} /></div><div className="space-y-2">{briefActions.map((action, index) => <button key={action} type="button" onClick={() => toggleAction(index)} className="flex w-full items-start gap-3 rounded-lg p-2 text-left transition hover:bg-[var(--surface-hover)]"><span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${checkedActions.includes(index) ? 'border-[var(--teal)] bg-[var(--teal)] text-white' : 'border-[var(--border)] text-transparent'}`}><Check size={13} /></span><span className={`text-xs leading-5 ${checkedActions.includes(index) ? 'text-[var(--muted)] line-through' : 'text-[var(--ink)]'}`}>{action}</span></button>)}</div><button type="button" onClick={() => setIsReady((current) => !current)} className={`mt-5 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition ${isReady ? 'bg-[var(--mint)] text-[var(--teal-dark)]' : 'bg-[var(--teal)] text-white hover:bg-[var(--teal-dark)]'}`}>{isReady ? 'Brief marked ready' : 'Mark as ready'}</button></section><section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"><button type="button" onClick={() => setExpandedSource((current) => !current)} className="flex w-full items-center justify-between text-left"><span className="flex items-center gap-2"><FileText size={16} className="text-[var(--teal)]" /><span><span className="block text-sm font-semibold text-[var(--ink)]">Source integrity</span><span className="mt-1 block text-xs text-[var(--muted)]">{reportSources.filter((source) => source.status === 'Verified').length} verified · 1 sample</span></span></span><span className="text-xs font-semibold text-[var(--teal-dark)]">{expandedSource ? 'Hide' : 'View'}</span></button>{expandedSource && <div className="mt-4 space-y-2 border-t border-[var(--border)] pt-4">{reportSources.map((source) => <div key={source.title} className="flex items-start justify-between gap-3 text-xs"><span className="leading-5 text-[var(--ink)]">{source.title}<span className="block text-[var(--muted)]">{source.source}</span></span><span className={source.status === 'Verified' ? 'text-[var(--teal-dark)]' : 'text-[var(--muted)]'}>{source.status}</span></div>)}</div>}</section><div className="rounded-xl border border-[var(--teal)]/20 bg-[var(--mint)] p-5"><p className="text-xs leading-5 text-[var(--muted)]"><span className="font-semibold text-[var(--ink)]">Research note:</span> This brief is based on mock agent findings and locally saved report content. Verify important details before the meeting.</p></div><p className="px-1 text-[11px] leading-5 text-[var(--muted)]">Report: {reportTitle}</p></aside></div></div>
}