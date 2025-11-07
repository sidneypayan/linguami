import { Box, Chip, Typography, useTheme } from '@mui/material'
import { OndemandVideo } from '@mui/icons-material'
import useTranslation from 'next-translate/useTranslation'

const MaterialsFilter = ({ selectedCategory, onCategoryChange }) => {
	const { t } = useTranslation('materials')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	const categories = ['all', 'text & audio', 'video', 'music']

	const getCategoryColor = (category) => {
		switch (category) {
			case 'text & audio':
				return { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', text: '#059669' }
			case 'video':
				return { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', text: '#dc2626' }
			case 'music':
				return { bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', text: '#d97706' }
			default:
				return { bg: 'rgba(139, 92, 246, 0.15)', border: '#8b5cf6', text: '#7c3aed' }
		}
	}

	return (
		<Box
			sx={{
				mb: { xs: 3, md: 4 },
				p: { xs: 1.25, sm: 3 },
				borderRadius: 3,
				background: isDark
					? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)'
					: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)',
				border: isDark
					? '1px solid rgba(139, 92, 246, 0.3)'
					: '1px solid rgba(139, 92, 246, 0.2)',
			}}>
			{/* Filtres par type de média */}
			<Box>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
					<OndemandVideo sx={{ fontSize: '1.25rem', color: isDark ? '#a78bfa' : '#8b5cf6' }} />
					<Typography
						variant="subtitle1"
						sx={{
							fontWeight: 700,
							fontSize: { xs: '0.85rem', sm: '1rem' },
							color: isDark ? '#e2e8f0' : '#1e1b4b',
						}}>
						{t('filterByCategory')}
					</Typography>
				</Box>
				<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
					{categories.map((category) => {
						const colors = getCategoryColor(category)
						const isSelected = selectedCategory === category
						const labelKey = category === 'text & audio' ? 'textAudio' : category
						return (
							<Chip
								key={category}
								label={t(labelKey)}
								onClick={() => onCategoryChange(category)}
								sx={{
									fontWeight: isSelected ? 700 : 600,
									fontSize: { xs: '0.85rem', sm: '0.95rem' },
									px: { xs: 1, sm: 1.5 },
									height: { xs: '32px', sm: '42px' },
									borderRadius: 3,
									cursor: 'pointer',
									border: isSelected ? '3px solid' : '2px solid',
									borderColor: isSelected ? colors.border : `${colors.border}60`,
									background: isSelected
										? `linear-gradient(135deg, ${colors.border} 0%, ${colors.border}dd 100%)`
										: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
									color: isSelected ? 'white' : isDark ? '#cbd5e1' : '#666',
									boxShadow: isSelected
										? `0 6px 24px ${colors.border}60, 0 0 0 4px ${colors.border}20`
										: `0 2px 8px ${colors.border}20`,
									transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
									'&:hover': {
										transform: 'translateY(-2px) scale(1.05)',
										boxShadow: `0 8px 28px ${colors.border}70`,
										borderColor: colors.border,
										background: isSelected
											? `linear-gradient(135deg, ${colors.border}dd 0%, ${colors.border} 100%)`
											: `linear-gradient(135deg, ${colors.border}30, ${colors.border}40)`,
										color: isSelected ? 'white' : colors.border,
									},
								}}
							/>
						)
					})}
				</Box>
			</Box>
		</Box>
	)
}

export default MaterialsFilter
