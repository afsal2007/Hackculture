import { useEffect, useState } from 'react'
import { ThemeContext } from './themeContextValue'
const storageKey = 'arena-research-theme'

function getSystemTheme() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [themePreference, setThemePreference] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    return window.localStorage.getItem(storageKey) || 'light'
  })
  const [systemTheme, setSystemTheme] = useState(getSystemTheme)
  const theme = themePreference === 'system' ? systemTheme : themePreference

  useEffect(() => {
    if (themePreference !== 'system') return undefined
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event) => setSystemTheme(event.matches ? 'dark' : 'light')
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themePreference])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
    window.localStorage.setItem(storageKey, themePreference)
  }, [theme, themePreference])

  const toggleTheme = () => setThemePreference(theme === 'dark' ? 'light' : 'dark')

  return <ThemeContext.Provider value={{ theme, themePreference, setThemePreference, toggleTheme }}>{children}</ThemeContext.Provider>
}

