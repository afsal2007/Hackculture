/**
 * Application Constants and Enums
 * Research Agent Arena - Backend API
 */

const SESSION_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
};

const TASK_STATUS = {
  PENDING: 'pending',
  RESEARCHING: 'researching',
  GENERATING_BRIEFS: 'generating_briefs',
  EVALUATING: 'evaluating',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

const SUBJECT_TYPE = {
  COMPANY: 'company',
  PERSON: 'person',
  INDUSTRY: 'industry',
  OTHER: 'other'
};

const AGENT_STATUS = {
  IDLE: 'idle',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

const WINNER = {
  AGENT_A: 'agentA',
  AGENT_B: 'agentB',
  TIE: 'tie',
  UNDECIDED: 'undecided'
};

const BRIEFING_CHOICE = {
  AGENT_A: 'agentA',
  AGENT_B: 'agentB',
  MERGED: 'merged',
  CUSTOM: 'custom'
};

const HISTORY_ACTION = {
  SESSION_CREATED: 'SESSION_CREATED',
  SESSION_UPDATED: 'SESSION_UPDATED',
  TASK_CREATED: 'TASK_CREATED',
  TASK_STATUS_CHANGED: 'TASK_STATUS_CHANGED',
  TAVILY_SEARCH_SAVED: 'TAVILY_SEARCH_SAVED',
  AGENT_BRIEFING_SAVED: 'AGENT_BRIEFING_SAVED',
  EVALUATION_COMPLETED: 'EVALUATION_COMPLETED',
  BRIEFING_FINALIZED: 'BRIEFING_FINALIZED',
  NOTE_ADDED: 'NOTE_ADDED'
};

const SEARCH_DEPTH = {
  BASIC: 'basic',
  ADVANCED: 'advanced'
};

module.exports = {
  SESSION_STATUS,
  TASK_STATUS,
  SUBJECT_TYPE,
  AGENT_STATUS,
  WINNER,
  BRIEFING_CHOICE,
  HISTORY_ACTION,
  SEARCH_DEPTH
};

