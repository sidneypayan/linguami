import React from 'react'
import { IconButton, Tooltip, Box } from '@mui/material'
import { LightMode, DarkMode } from '@mui/icons-material'
import { useThemeMode } from '@/context/ThemeContext'

const ThemeToggle = ({ variant = 'icon' }) => {
	const { mode, toggleTheme, isDark } = useThemeMode()

	if (variant === 'icon') {
		return (
			<Tooltip title={isDark ? 'Mode clair' : 'Mode sombre'}>
				<IconButton
					onClick={toggleTheme}
					sx={{
						width: { xs: 44, sm: 48 },
						height: { xs: 44, sm: 48 },
						borderRadius: 2,
						background: isDark
							? 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%)'
							: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%)',
						backdropFilter: 'blur(10px)',
						border: isDark
							? '1px solid rgba(251, 191, 36, 0.3)'
							: '1px solid rgba(59, 130, 246, 0.3)',
						boxShadow: isDark
							? '0 0 15px rgba(251, 191, 36, 0.2)'
							: '0 0 15px rgba(59, 130, 246, 0.2)',
						transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
						position: 'relative',
						overflow: 'hidden',
						'&::before': {
							content: '""',
							position: 'absolute',
							top: '-50%',
							left: '-50%',
							width: '200%',
							height: '200%',
							background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
							transform: 'translate(-100%, -100%)',
							transition: 'transform 0.5s ease',
						},
						'&:hover': {
							background: isDark
								? 'linear-gradient(135deg, rgba(251, 191, 36, 0.35) 0%, rgba(245, 158, 11, 0.35) 100%)'
								: 'linear-gradient(135deg, rgba(59, 130, 246, 0.35) 0%, rgba(37, 99, 235, 0.35) 100%)',
							transform: 'scale(1.1) rotate(-5deg)',
							boxShadow: isDark
								? '0 4px 20px rgba(251, 191, 36, 0.4), 0 0 25px rgba(245, 158, 11, 0.3)'
								: '0 4px 20px rgba(59, 130, 246, 0.4), 0 0 25px rgba(37, 99, 235, 0.3)',
							border: isDark
								? '1px solid rgba(251, 191, 36, 0.5)'
								: '1px solid rgba(59, 130, 246, 0.5)',
							'&::before': {
								transform: 'translate(0, 0)',
							},
						},
						'&:active': {
							transform: 'scale(0.95)',
						},
					}}>
					{isDark ? (
						<LightMode
							sx={{
								fontSize: '1.5rem',
								color: '#fbbf24',
								filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.8))',
								transition: 'all 0.3s ease',
							}}
						/>
					) : (
						<DarkMode
							sx={{
								fontSize: '1.5rem',
								color: '#3b82f6',
								filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.8))',
								transition: 'all 0.3s ease',
							}}
						/>
					)}
				</IconButton>
			</Tooltip>
		)
	}

	// Variant pour le drawer mobile
	return (
		<Box
			onClick={toggleTheme}
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				px: 2,
				py: 1.5,
				borderRadius: 3,
				background: isDark
					? 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)'
					: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)',
				border: isDark
					? '1px solid rgba(251, 191, 36, 0.3)'
					: '1px solid rgba(59, 130, 246, 0.3)',
				cursor: 'pointer',
				transition: 'all 0.3s ease',
				'&:hover': {
					background: isDark
						? 'linear-gradient(135deg, rgba(251, 191, 36, 0.25) 0%, rgba(245, 158, 11, 0.25) 100%)'
						: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(37, 99, 235, 0.25) 100%)',
					transform: 'translateX(5px)',
				},
			}}>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
				{isDark ? (
					<LightMode
						sx={{
							fontSize: '1.5rem',
							color: '#fbbf24',
							filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.8))',
						}}
					/>
				) : (
					<DarkMode
						sx={{
							fontSize: '1.5rem',
							color: '#3b82f6',
							filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.8))',
						}}
					/>
				)}
				<Box
					sx={{
						color: 'white',
						fontWeight: 600,
						fontSize: '1.0625rem',
					}}>
					{isDark ? 'Mode clair' : 'Mode sombre'}
				</Box>
			</Box>
		</Box>
	)
}

export default ThemeToggle
