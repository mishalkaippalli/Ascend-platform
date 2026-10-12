
import {
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { ThemeContext, type ThemePreference } from './theme-context'
interface ThemeProviderProps {
  children: ReactNode
}

const STORAGE_KEY = 'ascend-theme'

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemePreference>(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY)

    if (
      savedTheme === 'light' ||
      savedTheme === 'dark' ||
      savedTheme === 'system'
    ) {
      return savedTheme
    }

    return 'system'
  })

  useEffect(() => {
    const root = document.documentElement
    const systemPreference = window.matchMedia(
      '(prefers-color-scheme: dark)',
    )

    // Follow the device preference only when system mode is selected.
    const applyTheme = () => {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && systemPreference.matches)

      root.classList.toggle('dark', isDark)
      root.style.colorScheme = isDark ? 'dark' : 'light'
    }

    applyTheme()

    if (theme === 'system') {
      systemPreference.addEventListener('change', applyTheme)

      return () => {
        systemPreference.removeEventListener('change', applyTheme)
      }
    }
  }, [theme])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
