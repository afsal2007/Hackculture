export const progressAgents = [
  {
    id: 'agent-a',
    name: 'Atlas',
    label: 'Agent A',
    description: 'Company intelligence and market context',
    accent: 'teal',
    speed: 10,
  },
  {
    id: 'agent-b',
    name: 'Sage',
    label: 'Agent B',
    description: 'News, people, and competitive signals',
    accent: 'champagne',
    speed: 9,
  },
]

export const progressStages = [
  { label: 'Understanding your brief', detail: 'Context and objectives reviewed' },
  { label: 'Gathering sources', detail: 'Finding relevant public information' },
  { label: 'Comparing findings', detail: 'Cross-checking independent research' },
  { label: 'Preparing your briefing', detail: 'Organising insights for your meeting' },
]

export const progressActivities = [
  { id: 'brief', agent: 'System', text: 'Research brief received', time: 'Just now', threshold: 0 },
  { id: 'atlas-start', agent: 'Atlas', text: 'Started company overview research', time: 'A moment ago', threshold: 1 },
  { id: 'sage-start', agent: 'Sage', text: 'Started news and people research', time: 'A moment ago', threshold: 1 },
  { id: 'sources', agent: 'Atlas', text: 'Gathering source material', time: 'In progress', threshold: 24 },
  { id: 'signals', agent: 'Sage', text: 'Scanning competitive signals', time: 'In progress', threshold: 46 },
  { id: 'comparison', agent: 'System', text: 'Both agents will be compared when ready', time: 'Pending', threshold: 100 },
]