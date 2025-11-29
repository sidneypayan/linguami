import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeModeContext = createContext()

export const useThemeMode = () => {
	const context = useContext(ThemeModeContext)
	if (!context) {
		throw new Error('useThemeMode must be used within ThemeModeProvider')
	}
	return context
}

export const ThemeModeProvider = ({ children }) => {
	const [mode, setMode] = useState('light')
	const [isLoading, setIsLoading] = useState(true)

	// Initialiser le thème au chargement
	useEffect(() => {
		// 1. Vérifier le localStorage en premier (instantané)
		const savedMode = localStorage.getItem('themeMode')

		if (savedMode) {
			setMode(savedMode)
			// Appliquer la classe dark au document
			if (savedMode === 'dark') {
				document.documentElement.classList.add('dark')
			} else {
				document.documentElement.classList.remove('dark')
			}
		} else {
			// 2. Sinon, vérifier la préférence système
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
			const newMode = prefersDark ? 'dark' : 'light'
			setMode(newMode)
			if (prefersDark) {
				document.documentElement.classList.add('dark')
			}
		}

		setIsLoading(false)
	}, [])

	// Fonction pour changer le mode
	const toggleTheme = () => {
		const newMode = mode === 'light' ? 'dark' : 'light'
		setMode(newMode)
		localStorage.setItem('themeMode', newMode)

		// Appliquer/retirer la classe dark au document
		if (newMode === 'dark') {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}

		// TODO: Sauvegarder dans la base de données pour les utilisateurs connectés
		// Nous le ferons via une API route pour éviter les instances multiples de Supabase
	}

	const value = {
		mode,
		toggleTheme,
		isDark: mode === 'dark',
		isLoading,
	}

	return (
		<ThemeModeContext.Provider value={value}>
			{children}
		</ThemeModeContext.Provider>
	)
}
