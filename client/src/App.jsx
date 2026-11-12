import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import AppShell from './components/layout/AppShell'
import Dashboard from './components/dashboard/Dashboard'
import { ThemeProvider } from './context/ThemeContext'
import NewResearch from './pages/NewResearch'
import ResearchProgress from './pages/ResearchProgress'
import AgentAnalysis from './pages/AgentAnalysis'
import CombinedReport from './pages/CombinedReport'
import MeetingBrief from './pages/MeetingBrief'
import Profile from './pages/Profile'
import WorkspaceManagement from './pages/WorkspaceManagement'
import TeamMembers from './pages/TeamMembers'
import OrganizationSettings from './pages/OrganizationSettings'
import GeneralSettings from './pages/GeneralSettings'
import NotificationPreferences from './pages/NotificationPreferences'
import NotificationCenter from './pages/NotificationCenter'
import SecuritySettings from './pages/SecuritySettings'
import Invitations from './pages/Invitations'
import ShareResearch from './pages/ShareResearch'
import Auth, { ChooseAccount } from './pages/Auth'

function App() {
  return <ThemeProvider><BrowserRouter><Routes>
    <Route path="/auth/sign-in" element={<Auth mode="sign-in" />} /><Route path="/auth/choose-account" element={<ChooseAccount />} /><Route path="/auth/individual" element={<Auth mode="individual" />} /><Route path="/auth/organization" element={<Auth mode="organization" />} /><Route path="/auth/invite" element={<Auth mode="invite" />} /><Route path="/auth/forgot-password" element={<Auth mode="forgot" />} /><Route path="/auth/reset-password" element={<Auth mode="reset" />} /><Route path="/auth/verify-email" element={<Auth mode="verify" />} />
    <Route path="*" element={<AppShell><Routes><Route path="/" element={<Dashboard />} /><Route path="/research" element={<NewResearch />} /><Route path="/research/new" element={<NewResearch />} /><Route path="/research/progress" element={<ResearchProgress />} /><Route path="/reports/combined" element={<CombinedReport />} /><Route path="/reports/brief" element={<MeetingBrief />} /><Route path="/research/report" element={<Navigate to="/reports/combined" replace />} /><Route path="/research/share" element={<ShareResearch />} /><Route path="/research/access" element={<ShareResearch />} /><Route path="/agents/analysis" element={<AgentAnalysis />} /><Route path="/agents" element={<AgentAnalysis />} /><Route path="/settings" element={<Profile />} /><Route path="/workspace" element={<WorkspaceManagement />} /><Route path="/team" element={<TeamMembers />} /><Route path="/organization-settings" element={<OrganizationSettings />} /><Route path="/general-settings" element={<GeneralSettings />} /><Route path="/notification-preferences" element={<NotificationPreferences />} /><Route path="/notifications" element={<NotificationCenter />} /><Route path="/security-settings" element={<SecuritySettings />} /><Route path="/invitations" element={<Invitations />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></AppShell>} />
  </Routes></BrowserRouter></ThemeProvider>
}

export default App
