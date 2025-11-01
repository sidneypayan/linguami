import useTranslation from 'next-translate/useTranslation'
import { Search, Refresh, GridView, ViewList } from '@mui/icons-material'
import { Box, TextField, IconButton, Chip, Stack, Tooltip, InputAdornment } from '@mui/material'

/**
 * Composant réutilisable pour la barre de recherche et filtres des matériaux
 * @param {Function} onSearchChange - Callback pour le changement de recherche
 * @param {Function} onLevelChange - Callback pour le changement de niveau
 * @param {Function} onStatusChange - Callback pour le changement de statut
 * @param {Function} onClear - Callback pour réinitialiser les filtres
 * @param {Function} onViewChange - Callback pour changer le mode de vue
 * @param {string} searchValue - Valeur actuelle de la recherche
 * @param {string|null} selectedLevel - Niveau sélectionné
 * @param {string|null} selectedStatus - Statut sélectionné
 * @param {string} currentView - Vue actuelle ('card' ou 'list')
 * @param {boolean} showNotStudiedFilter - Afficher le filtre "Non étudié" (true pour section, false pour my-materials)
 * @param {string} translationNamespace - Namespace de traduction ('materials' ou 'section')
 */
const MaterialsFilterBar = ({
	onSearchChange,
	onLevelChange,
	onStatusChange,
	onClear,
	onViewChange,
	searchValue = '',
	selectedLevel = null,
	selectedStatus = null,
	currentView = 'card',
	showNotStudiedFilter = false,
	translationNamespace = 'materials'
}) => {
	const { t } = useTranslation(translationNamespace)

	const handleSearchSubmit = (e) => {
		e.preventDefault()
	}

	const levels = [
		{ label: 'Débutant', key: 'débutant', tooltip: `🌱 ${t('beginner')} - ${t('beginnerTooltip')}`, color: '#10b981' },
		{ label: 'Intermédiaire', key: 'intermédiaire', tooltip: `🚀 ${t('intermediate')} - ${t('intermediateTooltip')}`, color: '#f59e0b' },
		{ label: 'Avancé', key: 'avancé', tooltip: `⭐ ${t('advanced')} - ${t('advancedTooltip')}`, color: '#ef4444' },
	]

	const statuses = [
		{ label: t('being_studied'), key: 'is_being_studied', tooltip: `📚 ${t('being_studied')} - ${t('beingStudiedTooltip')}`, color: '#3b82f6' },
		{ label: t('studied'), key: 'is_studied', tooltip: `✨ ${t('studied')} - ${t('studiedTooltip')}`, color: '#8b5cf6' },
		...(showNotStudiedFilter ? [
			{ label: t('not_studied'), key: 'not_studied', tooltip: `📖 ${t('not_studied')} - ${t('notStudiedTooltip')}`, color: '#64748b' }
		] : [])
	]

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
				mb: 4,
				p: 3,
				borderRadius: 4,
				background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
				border: '1px solid rgba(139, 92, 246, 0.2)',
				boxShadow: '0 4px 20px rgba(139, 92, 246, 0.15)',
			}}>
			{/* Search bar and view toggle */}
			<Box
				sx={{
					display: 'flex',
					gap: 1.5,
					alignItems: 'center',
				}}>
				<Box
					component='form'
					onSubmit={handleSearchSubmit}
					sx={{
						flex: 1,
					}}>
					<TextField
						fullWidth
						size='small'
						placeholder={t('search')}
						value={searchValue}
						onChange={(e) => onSearchChange(e.target.value)}
						InputProps={{
							endAdornment: (
								<InputAdornment position='end'>
									<IconButton
										type='submit'
										edge='end'
										sx={{
											color: '#8b5cf6',
											width: { xs: '36px', sm: '40px' },
											height: { xs: '36px', sm: '40px' },
											'&:hover': {
												transform: 'scale(1.1)',
												color: '#06b6d4',
											},
										}}>
										<Search sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
									</IconButton>
								</InputAdornment>
							),
						}}
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: 3,
								backgroundColor: 'white',
								'& fieldset': {
									borderColor: 'rgba(139, 92, 246, 0.2)',
									borderWidth: 2,
								},
								'&:hover fieldset': {
									borderColor: '#8b5cf6',
								},
								'&.Mui-focused fieldset': {
									borderColor: '#8b5cf6',
									borderWidth: 2,
								},
							},
						}}
					/>
				</Box>

				{/* View toggle */}
				<Box
					sx={{
						display: 'flex',
						gap: 0.5,
						background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
						borderRadius: 2,
						padding: '3px',
						boxShadow: '0 2px 8px rgba(139, 92, 246, 0.15)',
						border: '2px solid rgba(139, 92, 246, 0.2)',
						flexShrink: 0,
					}}>
					<IconButton
						onClick={() => onViewChange('card')}
						sx={{
							width: { xs: '34px', sm: '36px' },
							height: { xs: '34px', sm: '36px' },
							background: currentView === 'card' ? 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)' : 'transparent',
							color: currentView === 'card' ? 'white' : '#8b5cf6',
							transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
							'&:hover': {
								background: currentView === 'card' ? 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)' : 'rgba(139, 92, 246, 0.1)',
							},
						}}>
						<GridView sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />
					</IconButton>
					<IconButton
						onClick={() => onViewChange('list')}
						sx={{
							width: { xs: '34px', sm: '36px' },
							height: { xs: '34px', sm: '36px' },
							background: currentView === 'list' ? 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)' : 'transparent',
							color: currentView === 'list' ? 'white' : '#8b5cf6',
							transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
							'&:hover': {
								background: currentView === 'list' ? 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)' : 'rgba(139, 92, 246, 0.1)',
							},
						}}>
						<ViewList sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />
					</IconButton>
				</Box>
			</Box>

			{/* Filters */}
			<Stack
				direction='row'
				spacing={{ xs: 0.75, sm: 1.5 }}
				sx={{
					alignItems: 'center',
					justifyContent: { xs: 'flex-start', md: 'flex-end' },
					flexWrap: 'wrap',
					gap: { xs: 0.75, sm: 1.5 },
				}}>
				{/* Level filters */}
				{levels.map(level => (
					<Tooltip key={level.label} title={level.tooltip} arrow placement='top'>
						<Chip
							label={level.label}
							onClick={() => onLevelChange(selectedLevel === level.key ? null : level.key)}
							sx={{
								fontWeight: 600,
								fontSize: { xs: '0.75rem', sm: '0.95rem' },
								px: { xs: 0.5, sm: 1 },
								height: { xs: '32px', sm: '40px' },
								minWidth: { xs: '50px', sm: 'auto' },
								borderRadius: 2,
								cursor: 'pointer',
								border: '2px solid',
								borderColor: selectedLevel === level.key ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)',
								background: selectedLevel === level.key ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)' : 'rgba(255, 255, 255, 0.9)',
								color: selectedLevel === level.key ? '#8b5cf6' : '#666',
								boxShadow: selectedLevel === level.key ? '0 4px 15px rgba(139, 92, 246, 0.2)' : '0 2px 8px rgba(139, 92, 246, 0.08)',
								transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
								'& .MuiChip-label': {
									px: { xs: 0.5, sm: 1 },
								},
								'&:hover': {
									transform: 'translateY(-2px)',
									boxShadow: `0 4px 16px ${level.color}60`,
									borderColor: level.color,
									background: `linear-gradient(135deg, ${level.color}30, ${level.color}50)`,
									color: level.color,
								},
							}}
						/>
					</Tooltip>
				))}

				{/* Status filters */}
				{statuses.map(status => (
					<Tooltip key={status.label} title={status.tooltip} arrow placement='top'>
						<Chip
							label={status.label}
							onClick={() => onStatusChange(selectedStatus === status.key ? null : status.key)}
							sx={{
								fontWeight: 600,
								fontSize: { xs: '0.7rem', sm: '0.95rem' },
								px: { xs: 0.5, sm: 1 },
								height: { xs: '32px', sm: '40px' },
								borderRadius: 2,
								cursor: 'pointer',
								border: '2px solid',
								borderColor: selectedStatus === status.key ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)',
								background: selectedStatus === status.key ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)' : 'rgba(255, 255, 255, 0.9)',
								color: selectedStatus === status.key ? '#8b5cf6' : '#666',
								boxShadow: selectedStatus === status.key ? '0 4px 15px rgba(139, 92, 246, 0.2)' : '0 2px 8px rgba(139, 92, 246, 0.08)',
								transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
								'& .MuiChip-label': {
									px: { xs: 0.5, sm: 1 },
								},
								'&:hover': {
									transform: 'translateY(-2px)',
									boxShadow: `0 4px 16px ${status.color}60`,
									borderColor: status.color,
									background: `linear-gradient(135deg, ${status.color}30, ${status.color}50)`,
									color: status.color,
								},
							}}
						/>
					</Tooltip>
				))}

				{/* Reset button */}
				<Tooltip title={`🔄 ${t('showall')} - ${t('showallTooltip')}`} arrow placement='top'>
					<IconButton
						onClick={onClear}
						sx={{
							width: { xs: '32px', sm: '40px' },
							height: { xs: '32px', sm: '40px' },
							background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
							border: '1px solid rgba(139, 92, 246, 0.2)',
							boxShadow: '0 2px 8px rgba(139, 92, 246, 0.15)',
							color: '#8b5cf6',
							transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
							'&:hover': {
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								color: 'white',
								transform: 'rotate(180deg) translateY(-2px)',
								boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
							},
						}}>
						<Refresh sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }} />
					</IconButton>
				</Tooltip>
			</Stack>
		</Box>
	)
}

export default MaterialsFilterBar
