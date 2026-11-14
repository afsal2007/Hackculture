const { ResearchTask } = require('../models/ResearchTask');
const { ResearchSession } = require('../models/ResearchSession');
const { historyService } = require('./history.service');
const { ApiError } = require('../utils/apiError');
const { TASK_STATUS, HISTORY_ACTION, WINNER, BRIEFING_CHOICE } = require('../utils/constants');

const taskService = {
  async createTask(data) {
    const session = await ResearchSession.findById(data.sessionId);
    if (!session) {
      throw ApiError.notFound(`Research session with ID ${data.sessionId} does not exist`);
    }

    const task = await ResearchTask.create(data);

    await historyService.logEvent({
      sessionId: task.sessionId,
      taskId: task._id,
      action: HISTORY_ACTION.TASK_CREATED,
      title: `Research Task Created: ${task.subjectName}`,
      description: `Target: ${task.subjectName} (${task.subjectType}). Purpose: ${task.meetingPurpose}`,
      payload: {
        taskId: task._id,
        subjectName: task.subjectName,
        meetingPurpose: task.meetingPurpose,
        status: task.status
      },
      actor: 'User'
    });

    return task;
  },

  async getAllTasks({ page = 1, limit = 10, sessionId, status, subjectName, sortBy = 'createdAt', sortOrder = 'desc' }) {
    const filter = {};

    if (sessionId) filter.sessionId = sessionId;
    if (status) filter.status = status;
    if (subjectName) filter.subjectName = { $regex: subjectName, $options: 'i' };

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [items, total] = await Promise.all([
      ResearchTask.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      ResearchTask.countDocuments(filter)
    ]);

    return { items, total, page, limit };
  },

  async getTaskById(id) {
    const task = await ResearchTask.findById(id).populate('session').lean();
    if (!task) {
      throw ApiError.notFound(`Research task with ID ${id} not found`);
    }
    return task;
  },

  async updateTask(id, updateData) {
    const task = await ResearchTask.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
    if (!task) {
      throw ApiError.notFound(`Research task with ID ${id} not found`);
    }
    return task;
  },

  async deleteTask(id) {
    const task = await ResearchTask.findByIdAndDelete(id);
    if (!task) {
      throw ApiError.notFound(`Research task with ID ${id} not found`);
    }
    return task;
  },

  async updateTaskStatus(id, { status, errorMessage = null }) {
    const updatePayload = { status };
    if (errorMessage !== undefined) {
      updatePayload.errorMessage = errorMessage;
    }

    const task = await ResearchTask.findByIdAndUpdate(id, { $set: updatePayload }, { new: true, runValidators: true });
    if (!task) {
      throw ApiError.notFound(`Research task with ID ${id} not found`);
    }

    await historyService.logEvent({
      sessionId: task.sessionId,
      taskId: task._id,
      action: HISTORY_ACTION.TASK_STATUS_CHANGED,
      title: `Task Status Changed: ${status.toUpperCase()}`,
      description: `Task status updated to ${status}${errorMessage ? ` with error: ${errorMessage}` : ''}`,
      payload: { status, errorMessage },
      actor: 'System'
    });

    return task;
  },

  async saveTavilyData(id, { query, searchDepth = 'basic', results }) {
    const task = await ResearchTask.findById(id);
    if (!task) {
      throw ApiError.notFound(`Research task with ID ${id} not found`);
    }

    task.tavilyData = {
      query,
      searchDepth,
      results,
      searchedAt: new Date()
    };

    if (task.status === TASK_STATUS.PENDING || task.status === TASK_STATUS.RESEARCHING) {
      task.status = TASK_STATUS.GENERATING_BRIEFS;
    }

    await task.save();

    await historyService.logEvent({
      sessionId: task.sessionId,
      taskId: task._id,
      action: HISTORY_ACTION.TAVILY_SEARCH_SAVED,
      title: `Tavily Web Research Stored: ${results.length} sources`,
      description: `Query: "${query}". Gathered ${results.length} sources via ${searchDepth} search.`,
      payload: {
        query,
        searchDepth,
        sourceCount: results.length,
        sources: results.map((r) => ({ title: r.title, url: r.url }))
      },
      actor: 'Tavily Search Service'
    });

    return task;
  },

  async saveAgentResults(id, { agentKey, name, model, status, briefing, executionTimeMs, tokenUsage, errorMessage, rawResponse }) {
    const task = await ResearchTask.findById(id);
    if (!task) {
      throw ApiError.notFound(`Research task with ID ${id} not found`);
    }

    const currentAgent = task.agents[agentKey] || {};
    task.agents[agentKey] = {
      name: name || currentAgent.name || (agentKey === 'agentA' ? 'Agent A (Gemini 1.5 Pro)' : 'Agent B (Gemini 1.5 Flash)'),
      model: model || currentAgent.model || 'gemini-1.5',
      status: status || 'completed',
      briefing: briefing || currentAgent.briefing,
      executionTimeMs: executionTimeMs !== undefined ? executionTimeMs : currentAgent.executionTimeMs,
      tokenUsage: tokenUsage || currentAgent.tokenUsage,
      completedAt: new Date(),
      errorMessage: errorMessage || null,
      rawResponse: rawResponse || null
    };

    const otherAgentKey = agentKey === 'agentA' ? 'agentB' : 'agentA';
    if (task.agents[otherAgentKey]?.status === 'completed') {
      task.status = TASK_STATUS.EVALUATING;
    }

    await task.save();

    await historyService.logEvent({
      sessionId: task.sessionId,
      taskId: task._id,
      action: HISTORY_ACTION.AGENT_BRIEFING_SAVED,
      title: `${agentKey.toUpperCase()} Briefing Saved`,
      description: `Briefing generated by ${task.agents[agentKey].name} in ${executionTimeMs || 0}ms`,
      payload: {
        agentKey,
        name: task.agents[agentKey].name,
        model: task.agents[agentKey].model,
        summarySnippet: briefing?.summary ? briefing.summary.substring(0, 150) + '...' : ''
      },
      actor: 'Bifrost AI Gateway'
    });

    return task;
  },

  async saveEvaluation(id, { metrics, winner, benchmarkSummary = '', strengthsA = [], strengthsB = [] }) {
    const task = await ResearchTask.findById(id);
    if (!task) {
      throw ApiError.notFound(`Research task with ID ${id} not found`);
    }

    const scoreA = metrics.agentA.totalScore !== undefined
      ? metrics.agentA.totalScore
      : (metrics.agentA.relevanceScore || 0) + (metrics.agentA.depthScore || 0) + (metrics.agentA.accuracyScore || 0) + (metrics.agentA.actionabilityScore || 0) + (metrics.agentA.clarityScore || 0);

    const scoreB = metrics.agentB.totalScore !== undefined
      ? metrics.agentB.totalScore
      : (metrics.agentB.relevanceScore || 0) + (metrics.agentB.depthScore || 0) + (metrics.agentB.accuracyScore || 0) + (metrics.agentB.actionabilityScore || 0) + (metrics.agentB.clarityScore || 0);

    metrics.agentA.totalScore = scoreA;
    metrics.agentB.totalScore = scoreB;

    let determinedWinner = winner;
    if (!determinedWinner || determinedWinner === WINNER.UNDECIDED) {
      if (scoreA > scoreB) determinedWinner = WINNER.AGENT_A;
      else if (scoreB > scoreA) determinedWinner = WINNER.AGENT_B;
      else determinedWinner = WINNER.TIE;
    }

    task.evaluation = {
      evaluated: true,
      evaluatedAt: new Date(),
      metrics,
      winner: determinedWinner,
      benchmarkSummary,
      strengthsA,
      strengthsB
    };

    task.status = TASK_STATUS.COMPLETED;

    await task.save();

    await historyService.logEvent({
      sessionId: task.sessionId,
      taskId: task._id,
      action: HISTORY_ACTION.EVALUATION_COMPLETED,
      title: `Arena Evaluation Completed - Winner: ${determinedWinner.toUpperCase()}`,
      description: `Agent A Score: ${scoreA}/50, Agent B Score: ${scoreB}/50. Winner: ${determinedWinner}`,
      payload: {
        scoreA,
        scoreB,
        winner: determinedWinner,
        benchmarkSummary
      },
      actor: 'Evaluation Engine'
    });

    return task;
  },

  async saveFinalBriefing(id, { chosenAgent = 'agentA', title = '', content }) {
    const task = await ResearchTask.findById(id);
    if (!task) {
      throw ApiError.notFound(`Research task with ID ${id} not found`);
    }

    task.finalBriefing = {
      chosenAgent,
      title: title || `Meeting Briefing: ${task.subjectName}`,
      content,
      savedAt: new Date()
    };

    await task.save();

    await historyService.logEvent({
      sessionId: task.sessionId,
      taskId: task._id,
      action: HISTORY_ACTION.BRIEFING_FINALIZED,
      title: `Meeting Briefing Finalized`,
      description: `Final briefing chosen from ${chosenAgent} for subject "${task.subjectName}"`,
      payload: {
        chosenAgent,
        title: task.finalBriefing.title,
        contentLength: content.length
      },
      actor: 'User'
    });

    return task;
  },

  async getArenaStats() {
    const tasks = await ResearchTask.find({ 'evaluation.evaluated': true }).lean();

    const stats = {
      totalEvaluated: tasks.length,
      wins: {
        agentA: 0,
        agentB: 0,
        tie: 0
      },
      averageScores: {
        agentA: 0,
        agentB: 0
      },
      averageExecutionTimeMs: {
        agentA: 0,
        agentB: 0
      }
    };

    if (tasks.length === 0) {
      return stats;
    }

    let totalScoreA = 0;
    let totalScoreB = 0;
    let totalTimeA = 0;
    let totalTimeB = 0;

    tasks.forEach((t) => {
      const winner = t.evaluation?.winner;
      if (winner === WINNER.AGENT_A) stats.wins.agentA += 1;
      else if (winner === WINNER.AGENT_B) stats.wins.agentB += 1;
      else stats.wins.tie += 1;

      totalScoreA += t.evaluation?.metrics?.agentA?.totalScore || 0;
      totalScoreB += t.evaluation?.metrics?.agentB?.totalScore || 0;
      totalTimeA += t.agents?.agentA?.executionTimeMs || 0;
      totalTimeB += t.agents?.agentB?.executionTimeMs || 0;
    });

    stats.averageScores.agentA = parseFloat((totalScoreA / tasks.length).toFixed(2));
    stats.averageScores.agentB = parseFloat((totalScoreB / tasks.length).toFixed(2));
    stats.averageExecutionTimeMs.agentA = Math.round(totalTimeA / tasks.length);
    stats.averageExecutionTimeMs.agentB = Math.round(totalTimeB / tasks.length);

    return stats;
  },

  async exportBriefing(id) {
    const task = await ResearchTask.findById(id).populate('session').lean();
    if (!task) {
      throw ApiError.notFound(`Research task with ID ${id} not found`);
    }

    const title = task.finalBriefing?.title || `Pre-Meeting Briefing: ${task.subjectName}`;
    const agent = task.finalBriefing?.chosenAgent === 'agentB' ? task.agents?.agentB : task.agents?.agentA;
    const briefing = agent?.briefing || {};

    const md = `# ${title}
**Subject:** ${task.subjectName} (${task.subjectType})  
**Meeting Purpose:** ${task.meetingPurpose}  
**Scheduled Date:** ${task.targetDate ? new Date(task.targetDate).toLocaleDateString() : 'N/A'}  
**Generated At:** ${new Date().toISOString()}  
**Winning Benchmark Agent:** ${task.evaluation?.winner?.toUpperCase() || 'AGENT A'} (Score: ${task.evaluation?.metrics?.agentA?.totalScore || 'N/A'}/50)

---

## 📋 Executive Summary
${briefing.summary || 'Summary pending generation.'}

## 🏢 Company & Context Overview
${briefing.companyOverview || 'Overview not available.'}

## 👥 Key Decision Makers & Personnel
${briefing.keyPersonnel && briefing.keyPersonnel.length > 0 ? briefing.keyPersonnel.map((p) => `- ${p}`).join('\n') : '- Not specified'}

## 🚀 Recent Developments & Market Signals
${briefing.recentDevelopments && briefing.recentDevelopments.length > 0 ? briefing.recentDevelopments.map((d) => `- ${d}`).join('\n') : '- Not specified'}

## 🎯 Recommended Meeting Discussion Points
${briefing.discussionPoints && briefing.discussionPoints.length > 0 ? briefing.discussionPoints.map((dp, i) => `${i + 1}. ${dp}`).join('\n') : '- Not specified'}

## ⚠️ Strategic Risks & Objections
${briefing.risksAndChallenges && briefing.risksAndChallenges.length > 0 ? briefing.risksAndChallenges.map((r) => `- ${r}`).join('\n') : '- Not specified'}

---
*Generated automatically by Research Agent Arena*
`;

    return { title, markdown: md };
  },

  async simulateArenaRun(id) {
    const task = await ResearchTask.findById(id);
    if (!task) {
      throw ApiError.notFound(`Research task with ID ${id} not found`);
    }

    await this.saveTavilyData(id, {
      query: `${task.subjectName} recent corporate news leadership strategy 2026`,
      searchDepth: 'advanced',
      results: [
        {
          title: `${task.subjectName} Accelerates AI Platform Expansion`,
          url: `https://techcrunch.com/${encodeURIComponent(task.subjectName.toLowerCase())}-strategy`,
          content: `${task.subjectName} expanded their core enterprise offerings with high-performance automated interfaces and new security capabilities.`,
          score: 0.94,
          publishedDate: '2026-10-18'
        },
        {
          title: `Executive Leadership Insights: Future of ${task.subjectName}`,
          url: `https://forbes.com/leadership/${encodeURIComponent(task.subjectName.toLowerCase())}`,
          content: `Discussion on market share, strategic partnerships, and new roadmap developments for ${task.subjectName}.`,
          score: 0.89,
          publishedDate: '2026-11-04'
        }
      ]
    });

    await this.saveAgentResults(id, {
      agentKey: 'agentA',
      name: 'Agent A (Gemini 1.5 Pro)',
      model: 'gemini-1.5-pro',
      status: 'completed',
      executionTimeMs: 2950,
      tokenUsage: { promptTokens: 2800, completionTokens: 1050, totalTokens: 3850 },
      briefing: {
        summary: `Strategic research on ${task.subjectName}. High alignment with enterprise workflows; target discussion around scalability, technical roadmap, and high-value integration terms.`,
        companyOverview: `Key enterprise player in the ${task.subjectType} domain with rapidly growing AI adoption and market capitalization.`,
        keyPersonnel: [`Executive Leadership of ${task.subjectName}`, 'VP of Product Partnerships'],
        recentDevelopments: [`Announced major quarterly enterprise capabilities`, 'Expanded international footprint'],
        discussionPoints: [
          `How our application logic seamlessly interfaces with ${task.subjectName}`,
          'Tiered volume discounts and commercial alignment',
          'Co-marketing and public launch milestones'
        ],
        risksAndChallenges: ['Internal build vs partner deliberations', 'Procurement and infosec approval cycles']
      }
    });

    await this.saveAgentResults(id, {
      agentKey: 'agentB',
      name: 'Agent B (Gemini 1.5 Flash)',
      model: 'gemini-1.5-flash',
      status: 'completed',
      executionTimeMs: 1120,
      tokenUsage: { promptTokens: 2800, completionTokens: 580, totalTokens: 3380 },
      briefing: {
        summary: `${task.subjectName} overview prepared for ${task.meetingPurpose}.`,
        companyOverview: `Prominent entity in modern software ecosystem.`,
        keyPersonnel: [`Key executives at ${task.subjectName}`],
        recentDevelopments: ['Platform stability and performance updates'],
        discussionPoints: ['Timeline for partnership', 'Technical requirements'],
        risksAndChallenges: ['Market competitor offerings']
      }
    });

    await this.saveEvaluation(id, {
      metrics: {
        agentA: { relevanceScore: 9.4, depthScore: 9.3, accuracyScore: 9.4, actionabilityScore: 9.5, clarityScore: 9.1 },
        agentB: { relevanceScore: 8.1, depthScore: 7.2, accuracyScore: 8.4, actionabilityScore: 7.6, clarityScore: 8.5 }
      },
      winner: 'agentA',
      benchmarkSummary: `Agent A (Gemini Pro) provided significantly deeper commercial context, actionable talking points, and specific risk identification. Agent B (Gemini Flash) was 62% faster but produced more generic bullets.`,
      strengthsA: ['Strategic talking points customized for enterprise pitch', 'Concrete risk factor identification'],
      strengthsB: ['Ultra-fast generation (1120ms)', 'Concise presentation']
    });

    const updated = await this.saveFinalBriefing(id, {
      chosenAgent: 'agentA',
      title: `Executive Meeting Briefing: ${task.subjectName}`,
      content: `# Meeting Briefing: ${task.subjectName}\n\n**Purpose:** ${task.meetingPurpose}\n\n## Winning Agent: Gemini 1.5 Pro (Score 46.7/50)\n\nPrepared for executive discussion. Key talking points and objections have been synthesized.`
    });

    return updated;
  }
};

module.exports = { taskService };
