import { useEffect, useState } from 'react'
import { Box, useTheme } from '@mui/material'

/**
 * Barre de progression de lecture qui se remplit au scroll
 */
export default function ReadingProgress() {
	const [progress, setProgress] = useState(0)
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	useEffect(() => {
		const updateProgress = () => {
			const scrollTop = window.scrollY
			const docHeight = document.documentElement.scrollHeight - window.innerHeight
			const scrollPercent = (scrollTop / docHeight) * 100
			setProgress(scrollPercent)
		}

		window.addEventListener('scroll', updateProgress, { passive: true })
		updateProgress() // Initial call

		return () => window.removeEventListener('scroll', updateProgress)
	}, [])

	return (
		<Box
			sx={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				height: '2px',
				bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
				zIndex: 1300,
			}}>
			<Box
				sx={{
					height: '100%',
					width: `${progress}%`,
					bgcolor: isDark ? 'primary.light' : 'primary.main',
					transition: 'width 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
				}}
			/>
		</Box>
	)
}
