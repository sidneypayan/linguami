import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material'
import { grey } from '@mui/material/colors'

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
		} else {
			// 2. Sinon, vérifier la préférence système
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
			setMode(prefersDark ? 'dark' : 'light')
		}

		setIsLoading(false)
	}, [])

	// Fonction pour changer le mode
	const toggleTheme = () => {
		const newMode = mode === 'light' ? 'dark' : 'light'
		setMode(newMode)
		localStorage.setItem('themeMode', newMode)

		// TODO: Sauvegarder dans la base de données pour les utilisateurs connectés
		// Nous le ferons via une API route pour éviter les instances multiples de Supabase
	}

	// Créer le thème dynamiquement en fonction du mode
	const theme = useMemo(() => {
		const isDark = mode === 'dark'

		const baseTheme = createTheme({
			palette: {
				mode,
				// Couleurs personnalisées
				clrPrimary1: isDark ? '#7c3aed' : '#432874',
				clrPrimary2: isDark ? '#8b5cf6' : '#432879',
				clrPrimary3: isDark ? '#a78bfa' : '#4f2a93',
				clrPrimary4: isDark ? '#c084fc' : '#992F7B',
				clrBtn1: isDark ? '#8b5cf6' : '#4f2a93',
				clrBtn2: isDark ? '#0891b2' : '#0056BB',
				clrGrey1: isDark ? grey[300] : grey[800],
				clrGrey2: isDark ? grey[400] : grey[700],
				clrGrey3: isDark ? grey[500] : grey[600],
				clrGrey4: isDark ? grey[600] : grey[500],
				clrCardBg: isDark ? '#1e293b' : '#f5f5f5',
				primary: {
					main: isDark ? '#8b5cf6' : '#667eea',
					dark: isDark ? '#7c3aed' : '#764ba2',
					light: isDark ? '#a78bfa' : '#8b9ff5',
				},
				secondary: {
					main: isDark ? '#f5576c' : '#f093fb',
					dark: isDark ? '#dc2626' : '#f5576c',
				},
				background: {
					default: isDark ? '#0f172a' : '#ffffff',
					paper: isDark ? '#1e293b' : '#ffffff',
				},
				text: {
					primary: isDark ? '#f1f5f9' : '#1e293b',
					secondary: isDark ? '#cbd5e1' : '#64748b',
				},
			},
			typography: {
				fontFamily: ['Poppins', 'Open Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'].join(','),
				h1: {
					fontWeight: 800,
					color: isDark ? '#f1f5f9' : '#2d3748',
					letterSpacing: '-1px',
				},
				h2: {
					fontWeight: 700,
					color: isDark ? '#f1f5f9' : '#2d3748',
					letterSpacing: '-0.8px',
				},
				h3: {
					fontWeight: 700,
					color: isDark ? '#e2e8f0' : '#4a5568',
					letterSpacing: '-0.5px',
				},
				h4: {
					fontWeight: 600,
					color: isDark ? '#e2e8f0' : '#4a5568',
					letterSpacing: '-0.3px',
				},
				h5: {
					fontWeight: 600,
					color: isDark ? '#a78bfa' : '#667eea',
				},
				h6: {
					fontWeight: 600,
					color: isDark ? '#94a3b8' : '#718096',
				},
				subtitle1: {
					color: isDark ? '#cbd5e1' : '#4a5568',
					fontWeight: 500,
				},
				subtitle2: {
					color: isDark ? '#94a3b8' : '#718096',
					fontWeight: 500,
				},
				body1: {
					fontWeight: 400,
					color: isDark ? '#e2e8f0' : 'inherit',
				},
				body2: {
					fontWeight: 400,
					color: isDark ? '#cbd5e1' : 'inherit',
				},
				button: {
					fontWeight: 600,
					letterSpacing: '0.3px',
				},
			},
			components: {
				MuiTypography: {
					styleOverrides: {
						h1: {
							background: isDark
								? 'linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)'
								: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
						},
						h2: {
							background: isDark
								? 'linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)'
								: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
						},
					},
				},
				MuiPaper: {
					styleOverrides: {
						root: {
							backgroundImage: 'none',
						},
					},
				},
				MuiAppBar: {
					styleOverrides: {
						root: {
							backgroundImage: 'none',
						},
					},
				},
			},
		})

		return responsiveFontSizes(baseTheme)
	}, [mode])

	const value = {
		mode,
		toggleTheme,
		isDark: mode === 'dark',
		isLoading,
	}

	return (
		<ThemeModeContext.Provider value={value}>
			<ThemeProvider theme={theme}>
				{children}
			</ThemeProvider>
		</ThemeModeContext.Provider>
	)
}
