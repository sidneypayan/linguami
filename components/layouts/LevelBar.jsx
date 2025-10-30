import useTranslation from 'next-translate/useTranslation'
import { Search, Refresh, GridView, ViewList } from '@mui/icons-material'
import {
	filterMaterials,
	showAllMaterials,
	filterMaterialsByStatus,
} from '../../features/materials/materialsSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { searchMaterial } from '../../features/materials/materialsSlice'
import { Box, TextField, IconButton, Chip, Stack, Tooltip, InputAdornment } from '@mui/material'

const LevelBar = ({ onViewChange, currentView = 'card', isMyMaterialsPage = false }) => {
	const { t } = useTranslation('section')
	const dispatch = useDispatch()
	const router = useRouter()
	const { section } = router.query
	const [search, setSearch] = useState('')
	const [selectedLevel, setSelectedLevel] = useState(null)
	const [selectedStatus, setSelectedStatus] = useState(null)
	const { user_materials_status } = useSelector(store => store.materials)

	const handleSubmit = e => {
		e.preventDefault()
		console.log('🔍 LevelBar handleSubmit - search term:', search)
		console.log('🔍 LevelBar handleSubmit - current section:', section)
		dispatch(searchMaterial(search))
	}

	const handleSearchChange = e => {
		const value = e.target.value
		setSearch(value)
		console.log('🔍 LevelBar handleSearchChange - search term:', value)
		// Recherche dynamique au fur et à mesure de la saisie
		dispatch(searchMaterial(value))
	}

	const handleClear = () => {
		dispatch(showAllMaterials())
		setSearch('')
		setSelectedLevel(null)
		setSelectedStatus(null)
	}

	const handleLevelClick = (level, levelKey) => {
		dispatch(filterMaterials({ section, level: levelKey }))
		setSelectedLevel(level)
		setSelectedStatus(null)
	}

	const handleStatusClick = (status, statusKey) => {
		dispatch(filterMaterialsByStatus({ section, status: statusKey, userMaterialsStatus: user_materials_status }))
		setSelectedStatus(status)
		setSelectedLevel(null)
	}

	const levels = [
		{ label: 'A1/A2', key: 'débutant', tooltip: `🌱 ${t('beginner')} - ${t('beginnerTooltip')}`, color: '#10b981' }, // Vert émeraude - Facile
		{ label: 'B1/B2', key: 'intermédiaire', tooltip: `🚀 ${t('intermediate')} - ${t('intermediateTooltip')}`, color: '#f59e0b' }, // Orange ambré - Moyen
		{ label: 'C1/C2', key: 'avancé', tooltip: `⭐ ${t('advanced')} - ${t('advancedTooltip')}`, color: '#ef4444' }, // Rouge - Difficile
	]

	const statuses = [
		{ label: t('being_studied'), key: 'is_being_studied', tooltip: `📚 ${t('being_studied')} - ${t('beingStudiedTooltip')}`, color: '#3b82f6' }, // Bleu - En cours
		{ label: t('studied'), key: 'is_studied', tooltip: `✨ ${t('studied')} - ${t('studiedTooltip')}`, color: '#8b5cf6' }, // Violet - Terminé
		{ label: t('not_studied'), key: 'not_studied', tooltip: `📖 ${t('not_studied')} - ${t('notStudiedTooltip')}`, color: '#64748b' }, // Gris - Non étudié
	]

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
				mb: 4,
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
					onSubmit={handleSubmit}
					sx={{
						flex: 1,
					}}>
					<TextField
						fullWidth
						size='small'
						placeholder={t('search')}
						value={search}
						onChange={handleSearchChange}
						InputProps={{
							endAdornment: (
								<InputAdornment position='end'>
									<IconButton
										type='submit'
										edge='end'
										sx={{
											color: '#667eea',
											width: { xs: '36px', sm: '40px' },
											height: { xs: '36px', sm: '40px' },
											transition: 'all 0.2s ease',
											'&:hover': {
												transform: 'scale(1.1)',
												color: '#764ba2',
											},
											'&:active': {
												transform: 'scale(0.95)',
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
								transition: 'all 0.2s ease',
								'& fieldset': {
									borderColor: '#e0e0e0',
									borderWidth: 2,
								},
								'&:hover fieldset': {
									borderColor: '#667eea',
								},
								'&.Mui-focused fieldset': {
									borderColor: '#667eea',
									borderWidth: 2,
								},
							},
						}}
					/>
				</Box>

				{/* View toggle buttons - always visible */}
				<Box
					sx={{
						display: 'flex',
						gap: 0.5,
						backgroundColor: 'rgba(255, 255, 255, 0.9)',
						borderRadius: 2,
						padding: '3px',
						boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
						border: '2px solid rgba(102, 126, 234, 0.1)',
						flexShrink: 0,
					}}>
					<IconButton
						onClick={() => onViewChange('card')}
						sx={{
							width: { xs: '34px', sm: '36px' },
							height: { xs: '34px', sm: '36px' },
							backgroundColor: currentView === 'card' ? '#667eea' : 'transparent',
							color: currentView === 'card' ? 'white' : '#667eea',
							transition: 'all 0.2s ease',
							'&:hover': {
								backgroundColor: currentView === 'card' ? '#764ba2' : 'rgba(102, 126, 234, 0.1)',
							},
						}}>
						<GridView sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />
					</IconButton>
					<IconButton
						onClick={() => onViewChange('list')}
						sx={{
							width: { xs: '34px', sm: '36px' },
							height: { xs: '34px', sm: '36px' },
							backgroundColor: currentView === 'list' ? '#667eea' : 'transparent',
							color: currentView === 'list' ? 'white' : '#667eea',
							transition: 'all 0.2s ease',
							'&:hover': {
								backgroundColor: currentView === 'list' ? '#764ba2' : 'rgba(102, 126, 234, 0.1)',
							},
						}}>
						<ViewList sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />
					</IconButton>
				</Box>
			</Box>

			{/* Level filters and Status filters */}
			<Stack
				direction='row'
				spacing={{ xs: 0.75, sm: 1.5 }}
				sx={{
					alignItems: 'center',
					justifyContent: { xs: 'flex-start', md: 'flex-end' },
					flexWrap: 'wrap',
					gap: { xs: 0.75, sm: 1.5 },
				}}>
				{levels.map(level => (
					<Tooltip
						key={level.label}
						title={level.tooltip}
						arrow
						placement='top'
						componentsProps={{
							tooltip: {
								sx: {
									bgcolor: level.color,
									color: 'white',
									fontSize: '0.875rem',
									fontWeight: 600,
									padding: '8px 16px',
									borderRadius: 2,
									boxShadow: `0 4px 20px ${level.color}60`,
									'& .MuiTooltip-arrow': {
										color: level.color,
									},
								},
							},
						}}>
						<Chip
							label={level.label}
							onClick={() => handleLevelClick(level.label, level.key)}
							sx={{
								fontWeight: 600,
								fontSize: { xs: '0.75rem', sm: '0.95rem' },
								px: { xs: 0.5, sm: 1 },
								height: { xs: '32px', sm: '40px' },
								minWidth: { xs: '50px', sm: 'auto' },
								borderRadius: 2,
								cursor: 'pointer',
								border: '2px solid',
								borderColor: selectedLevel === level.label ? '#667eea' : 'transparent',
								background:
									selectedLevel === level.label
										? 'rgba(102, 126, 234, 0.1)'
										: 'rgba(255, 255, 255, 0.9)',
								color: selectedLevel === level.label ? '#667eea' : '#666',
								boxShadow:
									selectedLevel === level.label
										? '0 4px 15px rgba(102, 126, 234, 0.2)'
										: '0 2px 8px rgba(0,0,0,0.08)',
								transition: 'all 0.3s ease',
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
								'&:active': {
									transform: 'scale(0.97)',
								},
							}}
						/>
					</Tooltip>
				))}

				{statuses.map(status => (
					<Tooltip
						key={status.label}
						title={status.tooltip}
						arrow
						placement='top'
						componentsProps={{
							tooltip: {
								sx: {
									bgcolor: status.color,
									color: 'white',
									fontSize: '0.875rem',
									fontWeight: 600,
									padding: '8px 16px',
									borderRadius: 2,
									boxShadow: `0 4px 20px ${status.color}60`,
									'& .MuiTooltip-arrow': {
										color: status.color,
									},
								},
							},
						}}>
						<Chip
							label={status.label}
							onClick={() => handleStatusClick(status.label, status.key)}
							sx={{
								fontWeight: 600,
								fontSize: { xs: '0.7rem', sm: '0.95rem' },
								px: { xs: 0.5, sm: 1 },
								height: { xs: '32px', sm: '40px' },
								borderRadius: 2,
								cursor: 'pointer',
								border: '2px solid',
								borderColor: selectedStatus === status.label ? '#667eea' : 'transparent',
								background:
									selectedStatus === status.label
										? 'rgba(102, 126, 234, 0.1)'
										: 'rgba(255, 255, 255, 0.9)',
								color: selectedStatus === status.label ? '#667eea' : '#666',
								boxShadow:
									selectedStatus === status.label
										? '0 4px 15px rgba(102, 126, 234, 0.2)'
										: '0 2px 8px rgba(0,0,0,0.08)',
								transition: 'all 0.3s ease',
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
								'&:active': {
									transform: 'scale(0.97)',
								},
							}}
						/>
					</Tooltip>
				))}

				{/* Reset button */}
				<Tooltip
					title={`🔄 ${t('showall')} - ${t('showallTooltip')}`}
					arrow
					placement='top'
					componentsProps={{
						tooltip: {
							sx: {
								bgcolor: '#667eea',
								color: 'white',
								fontSize: '0.875rem',
								fontWeight: 600,
								padding: '8px 16px',
								borderRadius: 2,
								boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
								'& .MuiTooltip-arrow': {
									color: '#667eea',
								},
							},
						},
					}}>
					<IconButton
						onClick={handleClear}
						sx={{
							width: { xs: '32px', sm: '40px' },
							height: { xs: '32px', sm: '40px' },
							backgroundColor: 'rgba(255, 255, 255, 0.9)',
							boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
							border: '2px solid transparent',
							transition: 'all 0.3s ease',
							'&:hover': {
								backgroundColor: '#667eea',
								color: 'white',
								transform: 'rotate(180deg) translateY(-2px)',
								boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
							},
							'&:active': {
								transform: 'rotate(180deg) scale(0.95)',
							},
						}}>
						<Refresh sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }} />
					</IconButton>
				</Tooltip>
			</Stack>
		</Box>
	)
}

export default LevelBar
