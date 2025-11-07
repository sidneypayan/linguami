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
		dispatch(searchMaterial(search))
	}

	const handleSearchChange = e => {
		const value = e.target.value
		setSearch(value)
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
		{ label: t('beginner'), key: 'beginner', tooltip: `🌱 ${t('beginner')} - ${t('beginnerTooltip')}`, color: '#10b981' }, // Vert - Common (WoW)
		{ label: t('intermediate'), key: 'intermediate', tooltip: `🚀 ${t('intermediate')} - ${t('intermediateTooltip')}`, color: '#a855f7' }, // Violet - Epic (WoW)
		{ label: t('advanced'), key: 'advanced', tooltip: `⭐ ${t('advanced')} - ${t('advancedTooltip')}`, color: '#fbbf24' }, // Orange - Legendary (WoW)
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
											width: { xs: '36px', sm: '40px' },
											height: { xs: '36px', sm: '40px' },
											background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(6, 182, 212, 0.8) 100%)',
											color: 'white',
											border: '1px solid rgba(139, 92, 246, 0.4)',
											borderRadius: 2,
											transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
											position: 'relative',
											overflow: 'hidden',
											boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3), 0 0 12px rgba(6, 182, 212, 0.2)',
											'&::before': {
												content: '""',
												position: 'absolute',
												top: 0,
												left: '-100%',
												width: '100%',
												height: '100%',
												background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
												transition: 'left 0.5s ease',
											},
											'&:hover': {
												background: 'linear-gradient(135deg, rgba(139, 92, 246, 1) 0%, rgba(6, 182, 212, 0.9) 100%)',
												transform: 'scale(1.1)',
												boxShadow: '0 4px 16px rgba(139, 92, 246, 0.5), 0 0 20px rgba(6, 182, 212, 0.3)',
												'&::before': {
													left: '100%',
												},
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
								transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
								'& fieldset': {
									borderColor: 'rgba(139, 92, 246, 0.2)',
									borderWidth: 1,
								},
								'&:hover fieldset': {
									borderColor: 'rgba(139, 92, 246, 0.5)',
									boxShadow: '0 2px 8px rgba(139, 92, 246, 0.1)',
								},
								'&.Mui-focused fieldset': {
									borderColor: 'rgba(139, 92, 246, 0.8)',
									borderWidth: 2,
									boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15), 0 0 16px rgba(6, 182, 212, 0.1)',
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
						boxShadow: '0 2px 8px rgba(139, 92, 246, 0.08)',
						border: '1px solid rgba(139, 92, 246, 0.15)',
						flexShrink: 0,
					}}>
					<IconButton
						onClick={() => onViewChange('card')}
						sx={{
							width: { xs: '34px', sm: '36px' },
							height: { xs: '34px', sm: '36px' },
							background: currentView === 'card'
								? 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(6, 182, 212, 0.8) 100%)'
								: 'transparent',
							color: currentView === 'card' ? 'white' : '#667eea',
							borderRadius: 1.5,
							transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
							position: 'relative',
							overflow: 'hidden',
							boxShadow: currentView === 'card' ? '0 2px 8px rgba(139, 92, 246, 0.3), 0 0 12px rgba(6, 182, 212, 0.2)' : 'none',
							'&::before': {
								content: '""',
								position: 'absolute',
								top: 0,
								left: '-100%',
								width: '100%',
								height: '100%',
								background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
								transition: 'left 0.5s ease',
							},
							'&:hover': {
								background: currentView === 'card'
									? 'linear-gradient(135deg, rgba(139, 92, 246, 1) 0%, rgba(6, 182, 212, 0.9) 100%)'
									: 'rgba(139, 92, 246, 0.08)',
								transform: 'scale(1.05)',
								boxShadow: currentView === 'card' ? '0 4px 12px rgba(139, 92, 246, 0.4), 0 0 16px rgba(6, 182, 212, 0.3)' : 'none',
								'&::before': {
									left: '100%',
								},
							},
						}}>
						<GridView sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />
					</IconButton>
					<IconButton
						onClick={() => onViewChange('list')}
						sx={{
							width: { xs: '34px', sm: '36px' },
							height: { xs: '34px', sm: '36px' },
							background: currentView === 'list'
								? 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(6, 182, 212, 0.8) 100%)'
								: 'transparent',
							color: currentView === 'list' ? 'white' : '#667eea',
							borderRadius: 1.5,
							transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
							position: 'relative',
							overflow: 'hidden',
							boxShadow: currentView === 'list' ? '0 2px 8px rgba(139, 92, 246, 0.3), 0 0 12px rgba(6, 182, 212, 0.2)' : 'none',
							'&::before': {
								content: '""',
								position: 'absolute',
								top: 0,
								left: '-100%',
								width: '100%',
								height: '100%',
								background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
								transition: 'left 0.5s ease',
							},
							'&:hover': {
								background: currentView === 'list'
									? 'linear-gradient(135deg, rgba(139, 92, 246, 1) 0%, rgba(6, 182, 212, 0.9) 100%)'
									: 'rgba(139, 92, 246, 0.08)',
								transform: 'scale(1.05)',
								boxShadow: currentView === 'list' ? '0 4px 12px rgba(139, 92, 246, 0.4), 0 0 16px rgba(6, 182, 212, 0.3)' : 'none',
								'&::before': {
									left: '100%',
								},
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
								fontWeight: 700,
								fontSize: { xs: '0.75rem', sm: '0.95rem' },
								px: { xs: 0.5, sm: 1 },
								height: { xs: '32px', sm: '40px' },
								minWidth: { xs: '50px', sm: 'auto' },
								borderRadius: 2,
								cursor: 'pointer',
								border: '1px solid',
								borderColor: selectedLevel === level.label ? 'rgba(139, 92, 246, 0.6)' : 'rgba(139, 92, 246, 0.2)',
								background: selectedLevel === level.label
									? 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(6, 182, 212, 0.8) 100%)'
									: 'white',
								color: selectedLevel === level.label ? 'white' : '#666',
								boxShadow: selectedLevel === level.label
									? '0 4px 12px rgba(139, 92, 246, 0.4), 0 0 20px rgba(6, 182, 212, 0.2)'
									: '0 2px 6px rgba(139, 92, 246, 0.08)',
								transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
								position: 'relative',
								overflow: 'hidden',
								'& .MuiChip-label': {
									px: { xs: 0.5, sm: 1 },
									position: 'relative',
									zIndex: 1,
								},
								'&::before': {
									content: '""',
									position: 'absolute',
									top: 0,
									left: '-100%',
									width: '100%',
									height: '100%',
									background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
									transition: 'left 0.5s ease',
								},
								'&:hover': {
									transform: 'translateY(-2px) scale(1.05)',
									borderColor: selectedLevel === level.label ? 'rgba(139, 92, 246, 0.8)' : level.color,
									background: selectedLevel === level.label
										? 'linear-gradient(135deg, rgba(139, 92, 246, 1) 0%, rgba(6, 182, 212, 0.9) 100%)'
										: `linear-gradient(135deg, ${level.color}30, ${level.color}50)`,
									color: selectedLevel === level.label ? 'white' : level.color,
									boxShadow: selectedLevel === level.label
										? '0 6px 16px rgba(139, 92, 246, 0.5), 0 0 25px rgba(6, 182, 212, 0.3)'
										: `0 4px 16px ${level.color}60`,
									'&::before': {
										left: '100%',
									},
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
								fontWeight: 700,
								fontSize: { xs: '0.7rem', sm: '0.95rem' },
								px: { xs: 0.5, sm: 1 },
								height: { xs: '32px', sm: '40px' },
								borderRadius: 2,
								cursor: 'pointer',
								border: '1px solid',
								borderColor: selectedStatus === status.label ? 'rgba(139, 92, 246, 0.6)' : 'rgba(139, 92, 246, 0.2)',
								background: selectedStatus === status.label
									? 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(6, 182, 212, 0.8) 100%)'
									: 'white',
								color: selectedStatus === status.label ? 'white' : '#666',
								boxShadow: selectedStatus === status.label
									? '0 4px 12px rgba(139, 92, 246, 0.4), 0 0 20px rgba(6, 182, 212, 0.2)'
									: '0 2px 6px rgba(139, 92, 246, 0.08)',
								transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
								position: 'relative',
								overflow: 'hidden',
								'& .MuiChip-label': {
									px: { xs: 0.5, sm: 1 },
									position: 'relative',
									zIndex: 1,
								},
								'&::before': {
									content: '""',
									position: 'absolute',
									top: 0,
									left: '-100%',
									width: '100%',
									height: '100%',
									background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
									transition: 'left 0.5s ease',
								},
								'&:hover': {
									transform: 'translateY(-2px) scale(1.05)',
									borderColor: selectedStatus === status.label ? 'rgba(139, 92, 246, 0.8)' : status.color,
									background: selectedStatus === status.label
										? 'linear-gradient(135deg, rgba(139, 92, 246, 1) 0%, rgba(6, 182, 212, 0.9) 100%)'
										: `linear-gradient(135deg, ${status.color}30, ${status.color}50)`,
									color: selectedStatus === status.label ? 'white' : status.color,
									boxShadow: selectedStatus === status.label
										? '0 6px 16px rgba(139, 92, 246, 0.5), 0 0 25px rgba(6, 182, 212, 0.3)'
										: `0 4px 16px ${status.color}60`,
									'&::before': {
										left: '100%',
									},
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
							backgroundColor: 'white',
							boxShadow: '0 2px 8px rgba(139, 92, 246, 0.08)',
							border: '1px solid rgba(139, 92, 246, 0.2)',
							borderRadius: 2,
							color: '#667eea',
							transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
							position: 'relative',
							overflow: 'hidden',
							'&::before': {
								content: '""',
								position: 'absolute',
								top: 0,
								left: '-100%',
								width: '100%',
								height: '100%',
								background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
								transition: 'left 0.5s ease',
							},
							'&:hover': {
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(6, 182, 212, 0.8) 100%)',
								color: 'white',
								borderColor: 'rgba(139, 92, 246, 0.8)',
								transform: 'translateY(-2px) scale(1.05)',
								boxShadow: '0 4px 16px rgba(139, 92, 246, 0.5), 0 0 20px rgba(6, 182, 212, 0.3)',
								'&::before': {
									left: '100%',
								},
							},
							'&:active': {
								transform: 'scale(0.95)',
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
