const path = require('path');
const dotenv = require('dotenv');

// Load environment configuration from server/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const { ResearchSession } = require('../models/ResearchSession');
const { ResearchTask } = require('../models/ResearchTask');
const { ResearchHistory } = require('../models/ResearchHistory');
const { SESSION_STATUS, TASK_STATUS, SUBJECT_TYPE, AGENT_STATUS, WINNER, BRIEFING_CHOICE, HISTORY_ACTION } = require('../utils/constants');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/research_agent_arena';

const seedData = async () => {
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected! Cleaning old collections...');

    await Promise.all([
      ResearchSession.deleteMany({}),
      ResearchTask.deleteMany({}),
      ResearchHistory.deleteMany({})
    ]);

    console.log('Old collections cleared. Seeding sample session & task...');

    const session = await ResearchSession.create({
      title: 'Stripe Enterprise Partnership & AI Commerce Meeting',
      description: 'Strategic preparation for upcoming meeting with Stripe product & partnership leads.',
      targetSubject: 'Stripe',
      meetingPurpose: 'Enterprise AI Agent Payment Gateway Integration & Co-Marketing',
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: SESSION_STATUS.ACTIVE,
      tags: ['fintech', 'payments', 'bifrost', 'gemini'],
      metadata: {
        attendees: ['Patrick Collison', 'Will Gaybrick', 'Arun'],
        meetingFormat: 'Virtual Zoom'
      }
    });

    const task = await ResearchTask.create({
      sessionId: session._id,
      subjectName: 'Stripe',
      subjectType: SUBJECT_TYPE.COMPANY,
      meetingPurpose: 'Enterprise AI Agent Payment Gateway Integration & Co-Marketing',
      targetDate: session.targetDate,
      additionalContext: 'Focus on recent announcements regarding AI agent payment SDKs, transaction fee reductions, and API latencies.',
      status: TASK_STATUS.COMPLETED,
      tavilyData: {
        query: 'Stripe AI agent commerce APIs enterprise payments 2026',
        searchDepth: 'advanced',
        results: [
          {
            title: 'Stripe Launches Agentic Commerce Suite for Autonomous AI Systems',
            url: 'https://stripe.com/newsroom/agentic-commerce',
            content: 'Stripe announced new machine-readable APIs allowing autonomous AI agents to manage checkout flows, issue zero-trust tokens, and execute micro-settlements securely.',
            score: 0.97,
            publishedDate: '2026-10-15'
          },
          {
            title: 'Inside Stripe Enterprise Payment Orchestration',
            url: 'https://techcrunch.com/stripe-enterprise-orchestration',
            content: 'How Fortune 500 enterprises are adopting Stripe to handle global routing, reducing transaction failures by 22% across multi-region clusters.',
            score: 0.88,
            publishedDate: '2026-11-01'
          }
        ],
        searchedAt: new Date(Date.now() - 3600000)
      },
      agents: {
        agentA: {
          name: 'Agent A (Gemini 1.5 Pro)',
          model: 'gemini-1.5-pro',
          status: AGENT_STATUS.COMPLETED,
          briefing: {
            summary: 'Stripe is prioritizing Autonomous Agent Commerce and enterprise high-volume routing. An effective pitch should focus on native compatibility with agentic protocols and shared developer trust.',
            companyOverview: 'Pioneer of internet payment rails, handling over $1T annually with enterprise customers including OpenAI, Amazon, and Anthropic.',
            keyPersonnel: [
              'Patrick Collison - Chief Executive Officer',
              'John Collison - President',
              'Will Gaybrick - President of Product & Business'
            ],
            recentDevelopments: [
              'Launched Agentic Commerce SDK for AI-driven purchase authorization',
              'Rolled out cross-border unified billing in 45 countries'
            ],
            discussionPoints: [
              'How our AI platform can become a launch partner for Stripe Agentic Suite',
              'Volume-based fee discount thresholds for 10M+ agent transactions',
              'Security audits for automated agent payment credentials'
            ],
            risksAndChallenges: [
              'Stripe building similar proprietary tooling in-house',
              'High chargeback liabilities on autonomous transactions'
            ]
          },
          executionTimeMs: 3150,
          tokenUsage: { promptTokens: 3100, completionTokens: 1120, totalTokens: 4220 },
          completedAt: new Date(Date.now() - 3000000)
        },
        agentB: {
          name: 'Agent B (Gemini 1.5 Flash)',
          model: 'gemini-1.5-flash',
          status: AGENT_STATUS.COMPLETED,
          briefing: {
            summary: 'Stripe is an online payment infrastructure provider. Key areas to touch upon are agentic APIs, pricing tiers, and international support.',
            companyOverview: 'Developer-first payment processing platform with widespread SaaS adoption.',
            keyPersonnel: [
              'Patrick Collison - CEO',
              'John Collison - President'
            ],
            recentDevelopments: [
              'Added autonomous agent payment capabilities',
              'Expanded global presence'
            ],
            discussionPoints: [
              'Integration timeline with our app',
              'Standard platform pricing'
            ],
            risksAndChallenges: [
              'Market competition from Adyen and PayPal',
              'Interchange regulations'
            ]
          },
          executionTimeMs: 1180,
          tokenUsage: { promptTokens: 3100, completionTokens: 640, totalTokens: 3740 },
          completedAt: new Date(Date.now() - 2900000)
        }
      },
      evaluation: {
        evaluated: true,
        evaluatedAt: new Date(Date.now() - 2500000),
        metrics: {
          agentA: {
            relevanceScore: 9.5,
            depthScore: 9.3,
            accuracyScore: 9.5,
            actionabilityScore: 9.6,
            clarityScore: 9.2,
            totalScore: 47.1
          },
          agentB: {
            relevanceScore: 8.2,
            depthScore: 7.0,
            accuracyScore: 8.6,
            actionabilityScore: 7.5,
            clarityScore: 8.8,
            totalScore: 40.1
          }
        },
        winner: WINNER.AGENT_A,
        benchmarkSummary: 'Agent A demonstrated superior strategic depth, identifying specific agentic protocols and actionable negotiation hooks. Agent B had 62% faster turnaround but missed strategic nuances.',
        strengthsA: [
          'Detailed executive personnel and titles',
          'Actionable partnership discussion points with specific metrics',
          'Identified specific risks related to autonomous chargeback liabilities'
        ],
        strengthsB: [
          'Fast execution time (1.18s vs 3.15s)',
          'Crisp, concise bullet structure'
        ]
      },
      finalBriefing: {
        chosenAgent: BRIEFING_CHOICE.AGENT_A,
        title: 'Executive Meeting Briefing: Stripe Partnership',
        content: '# Pre-Meeting Briefing: Stripe Partnership\n\n## Meeting Purpose\nEnterprise AI Agent Payment Gateway Integration & Co-Marketing\n\n## Winning Agent\nAgent A (Gemini 1.5 Pro) - Benchmark Score: 47.1/50\n\n## Summary\nStripe is betting heavily on agentic commerce. The optimal angle for Arun\'s team is proposing a joint integration showcasing autonomous agents utilizing Stripe credentials.\n\n## High-Priority Talking Points\n1. Launch partnership for Agentic Suite.\n2. Tiered settlement discounts.\n3. Zero-trust security tokens.',
        savedAt: new Date(Date.now() - 1800000)
      }
    });

    await ResearchHistory.create([
      {
        sessionId: session._id,
        action: HISTORY_ACTION.SESSION_CREATED,
        title: `Research Session Created: "${session.title}"`,
        description: `Session initiated for subject "${session.targetSubject}"`,
        payload: { sessionId: session._id, targetSubject: session.targetSubject },
        actor: 'Arun',
        timestamp: new Date(Date.now() - 4000000)
      },
      {
        sessionId: session._id,
        taskId: task._id,
        action: HISTORY_ACTION.TASK_CREATED,
        title: `Research Task Created: ${task.subjectName}`,
        description: `Target: ${task.subjectName} (${task.subjectType})`,
        payload: { taskId: task._id },
        actor: 'Arun',
        timestamp: new Date(Date.now() - 3900000)
      },
      {
        sessionId: session._id,
        taskId: task._id,
        action: HISTORY_ACTION.TAVILY_SEARCH_SAVED,
        title: 'Tavily Web Research Stored: 2 sources',
        description: 'Query: "Stripe AI agent commerce APIs enterprise payments 2026"',
        payload: { sourceCount: 2 },
        actor: 'Tavily Search Engine',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        sessionId: session._id,
        taskId: task._id,
        action: HISTORY_ACTION.AGENT_BRIEFING_SAVED,
        title: 'AGENTA Briefing Saved',
        description: 'Briefing generated by Agent A (Gemini 1.5 Pro) in 3150ms',
        payload: { agent: 'agentA', executionTimeMs: 3150 },
        actor: 'Bifrost AI Gateway',
        timestamp: new Date(Date.now() - 3000000)
      },
      {
        sessionId: session._id,
        taskId: task._id,
        action: HISTORY_ACTION.AGENT_BRIEFING_SAVED,
        title: 'AGENTB Briefing Saved',
        description: 'Briefing generated by Agent B (Gemini 1.5 Flash) in 1180ms',
        payload: { agent: 'agentB', executionTimeMs: 1180 },
        actor: 'Bifrost AI Gateway',
        timestamp: new Date(Date.now() - 2900000)
      },
      {
        sessionId: session._id,
        taskId: task._id,
        action: HISTORY_ACTION.EVALUATION_COMPLETED,
        title: 'Arena Evaluation Completed - Winner: AGENTA',
        description: 'Agent A Score: 47.1/50, Agent B Score: 40.1/50',
        payload: { scoreA: 47.1, scoreB: 40.1, winner: 'agentA' },
        actor: 'Evaluation Engine',
        timestamp: new Date(Date.now() - 2500000)
      },
      {
        sessionId: session._id,
        taskId: task._id,
        action: HISTORY_ACTION.BRIEFING_FINALIZED,
        title: 'Meeting Briefing Finalized',
        description: 'Executive briefing finalized using Agent A briefing output',
        payload: { chosenAgent: 'agentA' },
        actor: 'Arun',
        timestamp: new Date(Date.now() - 1800000)
      }
    ]);

    console.log(`Database seeding completed successfully!`);
    console.log(`- Created Session ID: ${session._id}`);
    console.log(`- Created Task ID:    ${task._id}`);
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed:`, error);
    process.exit(1);
  }
};

seedData();
