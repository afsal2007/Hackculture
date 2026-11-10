# 🚀 Research Agent Arena

### AI-Powered Pre-Meeting Research & Agent Benchmarking Platform

Research Agent Arena is an AI-powered platform that automates pre-meeting research and benchmarks multiple AI agents based on their research performance.

Using **Tavily** for real-time web research and **Bifrost** as an AI gateway, the platform enables two AI agents to independently research the same subject, generate meeting briefings, and compare their performance.

---

## 🎯 Problem Statement

Preparing for an important meeting requires researching companies, people, industries, recent developments, and potential discussion points.

Manual research is time-consuming, and different AI agents may produce different results.

Research Agent Arena aims to solve this by automating research, generating structured meeting briefings, and evaluating AI agent performance.

## 💡 Our Solution

Users enter a company or person's name along with their meeting purpose.

The platform then:

1. Collects the meeting details.
2. Uses Tavily to gather relevant web information.
3. Sends equivalent research tasks to two AI agents.
4. Generates independent research briefings.
5. Evaluates both agents using predefined metrics.
6. Displays a comparison dashboard with performance scores.
7. Identifies the better-performing agent.

## ⚙️ Technology Stack

| Technology | Purpose |
|---|---|
| React + Vite | Frontend |
| Tailwind CSS | UI Styling |
| Node.js | Backend Runtime |
| Express.js | REST API |
| MongoDB | Database |
| Bifrost | AI Gateway |
| Gemini | AI Research Agents |
| Tavily | Real-time Web Research |
| Git & GitHub | Version Control |

## 🏗️ System Workflow

```text
                 USER
                   |
                   v
            RESEARCH FORM
                   |
                   v
           REACT FRONTEND
                   |
                   v
          NODE.JS + EXPRESS
                   |
                   v
             TAVILY SEARCH
                   |
                   v
            RESEARCH DATA
                   |
             +-----+-----+
             |           |
             v           v
          AGENT A      AGENT B
             |           |
             +-----+-----+
                   |
                   v
             BIFROST GATEWAY
                   |
                   v
               GEMINI API
                   |
                   v
            EVALUATION ENGINE
                   |
                   v
          COMPARISON DASHBOARD
                   |
                   v
           MEETING BRIEFING
