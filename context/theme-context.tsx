'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = 'lumi_theme'
const SETTINGS_STORAGE_KEY = 'lumi_settings'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  // Initialize theme from storage
  useEffect(() => {
    try {
      let savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
      if (!savedTheme) {
        const settings = localStorage.getItem(SETTINGS_STORAGE_KEY)
        if (settings) {
          const parsed = JSON.parse(settings)
          if (parsed?.theme) {
            savedTheme = parsed.theme
          }
        }
      }
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
        setThemeState(savedTheme)
      }
    } catch (e) {
      console.error('Failed to read theme from localStorage', e)
    }
    setMounted(true)
  }, [])

  // Apply theme class to document
  useEffect(() => {
    if (!mounted) return

    const applyTheme = () => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const isDark = theme === 'dark' || (theme === 'system' && prefersDark)
      const currentResolved = isDark ? 'dark' : 'light'

      setResolvedTheme(currentResolved)

      const root = document.documentElement
      if (isDark) {
        root.classList.add('dark')
        root.classList.remove('light')
        root.style.colorScheme = 'dark'
      } else {
        root.classList.add('light')
        root.classList.remove('dark')
        root.style.colorScheme = 'light'
      }
    }

    applyTheme()

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const listener = () => applyTheme()
      mediaQuery.addEventListener('change', listener)
      return () => mediaQuery.removeEventListener('change', listener)
    }
  }, [theme, mounted])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
      // Sync with lumi_settings if it exists
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY)
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        parsed.theme = newTheme
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(parsed))
      }
    } catch (e) {
      console.error('Failed to save theme to localStorage', e)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
