import { Bell, Building2, ChevronDown, ClipboardList, Home, Menu, Moon, Search, Settings, ShieldCheck, Sparkles, Sun, Users, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from '../../context/useTheme'
import { defaultWorkspaces } from '../../data/workspaces'

function getActiveWorkspace() {
  try {
    const activeId = JSON.parse(window.localStorage.getItem('arena-research-active-workspace')) || 'personal'
    const created = JSON.parse(window.localStorage.getItem('arena-research-created-workspaces')) || []
    return [...defaultWorkspaces, ...created].find((workspace) => workspace.id === activeId) || defaultWorkspaces[0]
  } catch {
    return defaultWorkspaces[0]
  }
}

const navigation = [
  { label: 'Dashboard', to: '/', icon: Home },
  { label: 'Research', to: '/research/new', icon: ClipboardList },
  { label: 'Agents', to: '/agents/analysis', icon: Users },
]

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  useLocation()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const activeWorkspace = getActiveWorkspace()

  return (
    <div className="app-surface flex bg-[var(--ivory)]">
      {sidebarOpen && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-[var(--ink)]/20 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[var(--border)] bg-[var(--cream)] px-5 py-6 transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-12 flex items-center justify-between px-2">
          <NavLink to="/" className="flex items-center gap-2 text-[var(--ink)]" onClick={() => setSidebarOpen(false)}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--teal)] text-white"><Sparkles size={16} /></span>
            <span className="text-[15px] font-bold tracking-tight">Arena Research</span>
          </NavLink>
          <button className="text-[var(--muted)] lg:hidden" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Workspace</p>
        <nav className="space-y-1">
          {navigation.map(({ label, to, icon: Icon }) => (
            <NavLink key={label} to={to} end={to === '/'} onClick={() => setSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-white text-[var(--teal-dark)] shadow-sm' : 'text-[var(--muted)] hover:bg-white/60 hover:text-[var(--ink)]'}`}>
              <Icon size={17} strokeWidth={1.8} />{label}
            </NavLink>
          ))}
          <NavLink to="/team" onClick={() => setSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-white text-[var(--teal-dark)] shadow-sm' : 'text-[var(--muted)] hover:bg-white/60 hover:text-[var(--ink)]'}`}><Users size={17} strokeWidth={1.8} />Team members</NavLink>
          <NavLink to="/organization-settings" onClick={() => setSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-white text-[var(--teal-dark)] shadow-sm' : 'text-[var(--muted)] hover:bg-white/60 hover:text-[var(--ink)]'}`}><Building2 size={17} strokeWidth={1.8} />Organization settings</NavLink>
          <NavLink to="/general-settings" onClick={() => setSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-white text-[var(--teal-dark)] shadow-sm' : 'text-[var(--muted)] hover:bg-white/60 hover:text-[var(--ink)]'}`}><Settings size={17} strokeWidth={1.8} />General settings</NavLink>
          <NavLink to="/notification-preferences" onClick={() => setSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-white text-[var(--teal-dark)] shadow-sm' : 'text-[var(--muted)] hover:bg-white/60 hover:text-[var(--ink)]'}`}><Bell size={17} strokeWidth={1.8} />Notification preferences</NavLink>
          <NavLink to="/security-settings" onClick={() => setSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-white text-[var(--teal-dark)] shadow-sm' : 'text-[var(--muted)] hover:bg-white/60 hover:text-[var(--ink)]'}`}><ShieldCheck size={17} strokeWidth={1.8} />Security settings</NavLink>
          <NavLink to="/invitations" onClick={() => setSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-white text-[var(--teal-dark)] shadow-sm' : 'text-[var(--muted)] hover:bg-white/60 hover:text-[var(--ink)]'}`}><Users size={17} strokeWidth={1.8} />Invitations</NavLink>
        </nav>
        <div className="mt-auto border-t border-[var(--border)] pt-4">
          <NavLink to="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--muted)] hover:bg-white/60 hover:text-[var(--ink)]"><Settings size={17} strokeWidth={1.8} />Settings</NavLink>
          <NavLink to="/workspace" className="mt-5 flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-white/60">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--champagne)] text-xs font-bold text-white">AS</div>
            <div className="min-w-0"><p className="truncate text-xs font-semibold text-[var(--ink)]">Alex Smith</p><p className="truncate text-[11px] text-[var(--muted)]">{activeWorkspace.name}</p></div>
            <ChevronDown size={14} className="ml-auto text-[var(--muted)]" />
          </NavLink>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex h-20 items-center justify-between border-b border-[var(--border)] bg-[var(--ivory)] px-5 sm:px-8 lg:px-12">
          <button aria-label="Open navigation" className="text-[var(--ink)] lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={21} /></button>
          <div className="relative hidden w-72 sm:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} /><input className="w-full rounded-lg border border-[var(--border)] bg-white/70 py-2 pl-9 pr-3 text-sm text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--muted)] hover:bg-white focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20 dark:bg-[var(--surface)] dark:hover:bg-[var(--surface-hover)] dark:focus:ring-[var(--teal)]/30" placeholder="Search research" aria-label="Search research" /></div>
          <div className="ml-auto flex items-center gap-4"><button type="button" title={isDark ? 'Enable light mode' : 'Enable dark mode'} aria-label={isDark ? 'Enable light mode' : 'Enable dark mode'} onClick={toggleTheme} className="rounded-lg p-2 text-[var(--muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]">{isDark ? <Sun size={18} /> : <Moon size={18} />}</button><NavLink to="/notifications" aria-label="Notifications" className="relative rounded-lg p-2 text-[var(--muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--ink)]"><Bell size={19} /><span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[var(--teal)]" /></NavLink><div className="hidden h-6 w-px bg-[var(--border)] sm:block" /><NavLink to="/settings" aria-label="Open my profile" className="flex items-center gap-2 text-sm font-medium text-[var(--ink)]"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--champagne)] text-xs font-bold text-white">AS</span><ChevronDown size={14} className="text-[var(--muted)]" /></NavLink></div>
        </header>
        <main className="mx-auto max-w-[1320px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">{children}</main>
      </div>
    </div>
  )
}