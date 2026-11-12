export const analysisAgents = [
  {
    id: 'atlas',
    label: 'Agent A',
    name: 'Atlas',
    focus: 'Company intelligence',
    completion: '12 sources reviewed',
    summary: 'Atlas found a mature health-tech company expanding from clinical workflow tools into an integrated care platform.',
    strengths: ['Clear company and product context', 'Strong coverage of public company sources'],
    weakness: 'Limited recent commentary from customers',
    color: 'teal',
  },
  {
    id: 'sage',
    label: 'Agent B',
    name: 'Sage',
    focus: 'Market and competitive signals',
    completion: '15 sources reviewed',
    summary: 'Sage surfaced a competitive market with meaningful momentum around interoperability and preventative care.',
    strengths: ['Broad market and news coverage', 'Useful competitor comparisons'],
    weakness: 'Less detail on internal company structure',
    color: 'champagne',
  },
]

export const findings = [
  { id: 'position', type: 'agreement', title: 'Northstar is moving beyond a single-product model', summary: 'Both agents identify the shift from point solutions toward a broader care platform as the company\'s defining strategic move.', atlas: 'The 2024 product update describes a unified workflow across care teams.', sage: 'Recent market coverage frames the platform expansion as a response to buyer consolidation.', evidence: '2 independent sources', confidence: 'High' },
  { id: 'growth', type: 'agreement', title: 'Interoperability is a central growth lever', summary: 'The agents agree that easier integration with existing health systems is central to Northstar\'s next phase of growth.', atlas: 'Product documentation highlights integrations with major EHR systems.', sage: 'Industry reporting names interoperability as a purchase criterion for target customers.', evidence: '4 independent sources', confidence: 'High' },
  { id: 'market', type: 'conflict', title: 'The competitive pressure is not equally immediate', summary: 'Atlas describes a defensible position in clinical workflows, while Sage sees faster-moving competition in preventative care.', atlas: 'Northstar maintains a strong foothold with enterprise clinical teams.', sage: 'New entrants are differentiating quickly through patient-facing experiences.', evidence: '3 independent sources', confidence: 'Medium' },
  { id: 'opportunity', type: 'unique', agent: 'atlas', title: 'Implementation speed may be a differentiator', summary: 'Atlas found repeated emphasis on deployment time, suggesting implementation could be a useful meeting angle.', atlas: 'Customer materials cite a six-week average rollout for existing systems.', evidence: '1 company source', confidence: 'Medium' },
  { id: 'signal', type: 'unique', agent: 'sage', title: 'Partnership activity signals ecosystem ambition', summary: 'Sage identified a cluster of recent partner announcements that points to a broader ecosystem strategy.', sage: 'Three partner announcements appeared in the last two quarters.', evidence: '3 news sources', confidence: 'Medium' },
]

export const sources = [
  { name: 'Northstar Health', title: 'Product and platform overview', url: 'https://example.com/northstar', verified: true, agent: 'Atlas' },
  { name: 'Healthcare IT Today', title: 'Interoperability trends in modern care', url: 'https://example.com/healthcare-it', verified: true, agent: 'Sage' },
  { name: 'Northstar Health newsroom', title: 'Partner ecosystem announcements', url: 'https://example.com/newsroom', verified: true, agent: 'Sage' },
  { name: 'Arena Research sample', title: 'Illustrative competitive context', url: '#', verified: false, agent: 'Both agents' },
]