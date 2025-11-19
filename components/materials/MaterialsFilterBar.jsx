import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import {
	Search, Refresh, GridView, ViewList,
	SignalCellular1Bar, SignalCellular2Bar, SignalCellular3Bar,
	Schedule, PlayCircle, CheckCircle,
	OndemandVideo, RecordVoiceOver, MusicNote, Mic,
	MenuBook, Movie, Theaters, SmartDisplay,
	AutoStories, Landscape, Category, Museum
} from '@mui/icons-material'
import { Box, TextField, IconButton, Chip, Tooltip, InputAdornment, Select, MenuItem, FormControl, useTheme, ListSubheader } from '@mui/material'

/**
 * Composant réutilisable pour la barre de recherche et filtres des matériaux
 * @param {Function} onSearchChange - Callback pour le changement de recherche
 * @param {Function} onSectionChange - Callback pour le changement de section
 * @param {Function} onLevelChange - Callback pour le changement de niveau
 * @param {Function} onStatusChange - Callback pour le changement de statut
 * @param {Function} onClear - Callback pour réinitialiser les filtres
 * @param {Function} onViewChange - Callback pour changer le mode de vue
 * @param {string} searchValue - Valeur actuelle de la recherche
 * @param {string|null} selectedSection - Section sélectionnée
 * @param {string|null} selectedLevel - Niveau sélectionné
 * @param {string|null} selectedStatus - Statut sélectionné
 * @param {string} currentView - Vue actuelle ('card' ou 'list')
 * @param {boolean} showNotStudiedFilter - Afficher le filtre "Non étudié" (true pour section, false pour my-materials)
 * @param {boolean} showStudiedFilter - Afficher le filtre "Étudiés" (true pour my-materials, false pour section)
 * @param {boolean} showSectionFilter - Afficher le filtre de section (true pour my-materials, false par défaut)
 * @param {string} translationNamespace - Namespace de traduction ('materials' ou 'section')
 */
const MaterialsFilterBar = ({
	onSearchChange,
	onSectionChange,
	onLevelChange,
	onStatusChange,
	onClear,
	onViewChange,
	searchValue = '',
	selectedSection = null,
	selectedLevel = null,
	selectedStatus = null,
	currentView = 'card',
	showNotStudiedFilter = false,
	showStudiedFilter = true,
	showSectionFilter = false,
	translationNamespace = 'materials'
}) => {
	const t = useTranslations(translationNamespace)
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	const handleSearchSubmit = (e) => {
		e.preventDefault()
	}

	const activeFiltersCount = (selectedSection ? 1 : 0) + (selectedLevel ? 1 : 0) + (selectedStatus ? 1 : 0)

	// Sections organisées par catégorie
	const sectionsByCategory = {
		'text & audio': [
			{ label: t('dialogues'), key: 'dialogues', tooltip: `💬 ${t('dialogues')}`, color: '#06b6d4', icon: RecordVoiceOver },
			{ label: t('slices-of-life'), key: 'slices-of-life', tooltip: `🌟 ${t('slices-of-life')}`, color: '#10b981', icon: AutoStories },
			{ label: t('beautiful-places'), key: 'beautiful-places', tooltip: `🏞️ ${t('beautiful-places')}`, color: '#10b981', icon: Landscape },
			{ label: t('legends'), key: 'legends', tooltip: `🏛️ ${t('legends')}`, color: '#8b5cf6', icon: AutoStories },
			{ label: t('culture'), key: 'culture', tooltip: `🎭 ${t('culture')}`, color: '#8b5cf6', icon: Museum },
			{ label: t('podcasts'), key: 'podcasts', tooltip: `🎙️ ${t('podcasts')}`, color: '#8b5cf6', icon: Mic },
			{ label: t('short-stories'), key: 'short-stories', tooltip: `📖 ${t('short-stories')}`, color: '#f59e0b', icon: MenuBook },
			{ label: t('books'), key: 'books', tooltip: `📚 ${t('books')}`, color: '#ec4899', icon: MenuBook },
		],
		'video': [
			{ label: t('movie-trailers'), key: 'movie-trailers', tooltip: `🎞️ ${t('movie-trailers')}`, color: '#ef4444', icon: Movie },
			{ label: t('movie-clips'), key: 'movie-clips', tooltip: `🎬 ${t('movie-clips')}`, color: '#ef4444', icon: Theaters },
			{ label: t('cartoons'), key: 'cartoons', tooltip: `🎨 ${t('cartoons')}`, color: '#06b6d4', icon: SmartDisplay },
			{ label: t('various-materials'), key: 'various-materials', tooltip: `📚 ${t('various-materials')}`, color: '#64748b', icon: Category },
		],
		'music': [
			{ label: t('rock'), key: 'rock', tooltip: `🎸 ${t('rock')}`, color: '#ec4899', icon: MusicNote },
			{ label: t('pop'), key: 'pop', tooltip: `🎤 ${t('pop')}`, color: '#ec4899', icon: MusicNote },
			{ label: t('folk'), key: 'folk', tooltip: `🎻 ${t('folk')}`, color: '#ec4899', icon: MusicNote },
			{ label: t('variety'), key: 'variety', tooltip: `🎵 ${t('variety')}`, color: '#ec4899', icon: MusicNote },
			{ label: t('kids'), key: 'kids', tooltip: `👶 ${t('kids')}`, color: '#ec4899', icon: MusicNote },
		]
	}

	const levels = [
		{ label: t('beginner'), key: 'beginner', tooltip: `🌱 ${t('beginner')} - ${t('beginnerTooltip')}`, color: '#10b981', icon: SignalCellular1Bar },
		{ label: t('intermediate'), key: 'intermediate', tooltip: `🚀 ${t('intermediate')} - ${t('intermediateTooltip')}`, color: '#a855f7', icon: SignalCellular2Bar },
		{ label: t('advanced'), key: 'advanced', tooltip: `⭐ ${t('advanced')} - ${t('advancedTooltip')}`, color: '#fbbf24', icon: SignalCellular3Bar },
	]

	const statuses = [
		...(showNotStudiedFilter ? [
			{ label: t('not_studied'), key: 'not_studied', tooltip: `▶️ ${t('not_studied')} - ${t('notStudiedTooltip')}`, color: '#8b5cf6', icon: PlayCircle }
		] : []),
		{ label: t('being_studied'), key: 'is_being_studied', tooltip: `⏰ ${t('being_studied')} - ${t('beingStudiedTooltip')}`, color: '#f59e0b', icon: Schedule },
		...(showStudiedFilter ? [
			{ label: t('studied'), key: 'is_studied', tooltip: `✅ ${t('studied')} - ${t('studiedTooltip')}`, color: '#10b981', icon: CheckCircle }
		] : []),
	]

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
				mb: 4,
				p: { xs: 2, md: 3 },
				borderRadius: { xs: 0, md: 4 },
				background: {
					xs: 'transparent',
					md: isDark
						? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)'
						: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)'
				},
				border: { xs: 'none', md: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.2)' },
				boxShadow: { xs: 'none', md: isDark ? '0 4px 20px rgba(139, 92, 246, 0.25)' : '0 4px 20px rgba(139, 92, 246, 0.15)' },
			}}>
			{/* Première ligne : Search bar et view toggle */}
			<Box
				sx={{
					display: 'flex',
					gap: 1.5,
					alignItems: 'center',
					justifyContent: 'space-between',
				}}>
				<Box
					component='form'
					onSubmit={handleSearchSubmit}
					sx={{
						flex: 1,
						maxWidth: { xs: '100%', md: 'calc(100% - 48px)' },
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
								backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'white',
								color: isDark ? '#f1f5f9' : 'inherit',
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
							'& .MuiInputBase-input::placeholder': {
								color: isDark ? '#94a3b8' : 'rgba(0, 0, 0, 0.6)',
								opacity: 1,
							},
						}}
					/>
				</Box>

				{/* View toggle */}
				<Box
					sx={{
						display: 'flex',
						gap: 0.5,
						background: isDark
							? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)'
							: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
						borderRadius: 2,
						padding: '3px',
						boxShadow: '0 2px 8px rgba(139, 92, 246, 0.15)',
						border: '2px solid rgba(139, 92, 246, 0.2)',
						flexShrink: 0,
					}}>
					<Tooltip
						title="Vue en grille"
						arrow
						placement='top'
						disableTouchListener>
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
					</Tooltip>
					<Tooltip
						title="Vue en liste"
						arrow
						placement='top'
						disableTouchListener>
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
					</Tooltip>
				</Box>
			</Box>

			{/* Deuxième ligne : Filtres de section, niveau et statut */}
			<Box
				sx={{
					display: 'flex',
					gap: { xs: 1, sm: 1.5 },
					alignItems: 'center',
					flexWrap: 'wrap',
				}}>
				{/* Section dropdown filter */}
				{showSectionFilter && (
					<FormControl size="small" sx={{ minWidth: { xs: 140, sm: 180 } }}>
						<Select
							value={selectedSection || ''}
							onChange={(e) => onSectionChange(e.target.value || null)}
							displayEmpty
							sx={{
								borderRadius: 3,
								height: { xs: '36px', sm: '42px' },
								fontWeight: 600,
								fontSize: { xs: '0.85rem', sm: '0.95rem' },
								backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'white',
								border: '2px solid',
								borderColor: selectedSection ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)',
								boxShadow: selectedSection
									? '0 4px 15px rgba(139, 92, 246, 0.4)'
									: '0 2px 8px rgba(139, 92, 246, 0.15)',
								transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
								'& .MuiOutlinedInput-notchedOutline': {
									border: 'none',
								},
								'&:hover': {
									borderColor: '#8b5cf6',
									boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
								},
								'&.Mui-focused': {
									borderColor: '#8b5cf6',
									boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
								},
								'& .MuiSelect-select': {
									display: 'flex',
									alignItems: 'center',
									gap: 1,
									color: selectedSection ? '#8b5cf6' : isDark ? '#cbd5e1' : '#666',
								},
								'& .MuiSelect-icon': {
									color: isDark ? '#cbd5e1' : 'inherit',
								},
							}}>
							<MenuItem value="">
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									<Category sx={{ fontSize: '1.1rem', color: '#8b5cf6' }} />
									<span>{t('allMaterials')}</span>
								</Box>
							</MenuItem>

						{/* Text & Audio category */}
						<ListSubheader
							sx={{
								backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.08)',
								color: isDark ? '#a78bfa' : '#8b5cf6',
								fontWeight: 700,
								fontSize: '0.85rem',
								lineHeight: '32px',
								px: 2,
								textTransform: 'uppercase',
								letterSpacing: '0.5px',
							}}>
							📚 {t('textAudio') || 'Text & Audio'}
						</ListSubheader>
						{sectionsByCategory['text & audio'].map(section => {
							const SectionIcon = section.icon
							return (
								<MenuItem
									key={section.key}
									value={section.key}
									sx={{ pl: 4 }}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<SectionIcon sx={{ fontSize: '1.1rem', color: section.color }} />
										<span>{section.label}</span>
									</Box>
								</MenuItem>
							)
						})}

						{/* Video category */}
						<ListSubheader
							sx={{
								backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)',
								color: isDark ? '#fca5a5' : '#ef4444',
								fontWeight: 700,
								fontSize: '0.85rem',
								lineHeight: '32px',
								px: 2,
								textTransform: 'uppercase',
								letterSpacing: '0.5px',
							}}>
							🎬 {t('video') || 'Vidéo'}
						</ListSubheader>
						{sectionsByCategory['video'].map(section => {
							const SectionIcon = section.icon
							return (
								<MenuItem
									key={section.key}
									value={section.key}
									sx={{ pl: 4 }}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<SectionIcon sx={{ fontSize: '1.1rem', color: section.color }} />
										<span>{section.label}</span>
									</Box>
								</MenuItem>
							)
						})}

						{/* Music category */}
						<ListSubheader
							sx={{
								backgroundColor: isDark ? 'rgba(236, 72, 153, 0.15)' : 'rgba(236, 72, 153, 0.08)',
								color: isDark ? '#f9a8d4' : '#ec4899',
								fontWeight: 700,
								fontSize: '0.85rem',
								lineHeight: '32px',
								px: 2,
								textTransform: 'uppercase',
								letterSpacing: '0.5px',
							}}>
							🎵 {t('music') || 'Musique'}
						</ListSubheader>
						{sectionsByCategory['music'].map(section => {
							const SectionIcon = section.icon
							return (
								<MenuItem
									key={section.key}
									value={section.key}
									sx={{ pl: 4 }}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<SectionIcon sx={{ fontSize: '1.1rem', color: section.color }} />
										<span>{section.label}</span>
									</Box>
								</MenuItem>
							)
						})}
						</Select>
					</FormControl>
				)}

				{/* Level filters */}
				{levels.map(level => {
					const LevelIcon = level.icon
					const isSelected = selectedLevel === level.key
					return (
						<Tooltip
							key={level.label}
							title={level.tooltip}
							arrow
							placement='top'
							disableTouchListener>
							<Chip
								icon={<LevelIcon sx={{
									fontSize: '1.1rem',
									color: isSelected ? 'white' : level.color,
									filter: isSelected ? 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' : 'none',
								}} />}
								label={level.label}
								onClick={() => onLevelChange(selectedLevel === level.key ? null : level.key)}
								sx={{
									fontWeight: isSelected ? 700 : 600,
									fontSize: { xs: '0.85rem', sm: '0.95rem' },
									px: { xs: 0.5, sm: 1.5 },
									height: { xs: '36px', sm: '42px' },
									borderRadius: 3,
									cursor: 'pointer',
									border: isSelected ? '3px solid' : '2px solid',
									borderColor: isSelected ? level.color : `${level.color}60`,
									background: isSelected
										? `linear-gradient(135deg, ${level.color} 0%, ${level.color}dd 100%)`
										: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
									color: isSelected ? 'white' : isDark ? '#cbd5e1' : '#666',
									boxShadow: isSelected
										? `0 6px 24px ${level.color}60, 0 0 0 4px ${level.color}20`
										: `0 2px 8px ${level.color}20`,
									transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
									animation: isSelected ? 'pulse 2s ease-in-out infinite' : 'none',
									'@keyframes pulse': {
										'0%, 100%': {
											boxShadow: `0 6px 24px ${level.color}60, 0 0 0 4px ${level.color}20`,
										},
										'50%': {
											boxShadow: `0 6px 28px ${level.color}80, 0 0 0 6px ${level.color}30`,
										},
									},
									'& .MuiChip-icon': {
										marginLeft: '8px',
										marginRight: '-4px',
									},
									'& .MuiChip-label': {
										display: { xs: 'none', sm: 'block' },
										px: 1,
									},
									// Mobile : icône seulement
									minWidth: { xs: '40px', sm: 'auto' },
									'@media (max-width: 600px)': {
										'& .MuiChip-icon': {
											margin: 0,
										},
									},
									'&:hover': {
										transform: 'translateY(-2px) scale(1.05)',
										boxShadow: `0 8px 28px ${level.color}70`,
										borderColor: level.color,
										background: isSelected
											? `linear-gradient(135deg, ${level.color}dd 0%, ${level.color} 100%)`
											: `linear-gradient(135deg, ${level.color}30, ${level.color}40)`,
										color: isSelected ? 'white' : level.color,
									},
								}}
							/>
						</Tooltip>
					)
				})}

				{/* Status filters */}
				{statuses.map((status, index) => {
					const StatusIcon = status.icon
					const isSelected = selectedStatus === status.key
					return (
						<Tooltip
							key={status.label}
							title={status.tooltip}
							arrow
							placement='top'
							disableTouchListener>
							<Chip
								icon={<StatusIcon sx={{
									fontSize: '1.1rem',
									color: isSelected ? 'white' : status.color,
									filter: isSelected ? 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' : 'none',
								}} />}
								label={status.label}
								onClick={() => onStatusChange(selectedStatus === status.key ? null : status.key)}
								sx={{
									fontWeight: isSelected ? 700 : 600,
									fontSize: { xs: '0.85rem', sm: '0.95rem' },
									px: { xs: 0.5, sm: 1.5 },
									height: { xs: '36px', sm: '42px' },
									ml: index === 0 ? { xs: 1.5, sm: 0 } : 0,
									borderRadius: 3,
									cursor: 'pointer',
									border: isSelected ? '3px solid' : '2px solid',
									borderColor: isSelected ? status.color : `${status.color}60`,
									background: isSelected
										? `linear-gradient(135deg, ${status.color} 0%, ${status.color}dd 100%)`
										: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
									color: isSelected ? 'white' : isDark ? '#cbd5e1' : '#666',
									boxShadow: isSelected
										? `0 6px 24px ${status.color}60, 0 0 0 4px ${status.color}20`
										: `0 2px 8px ${status.color}20`,
									transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
									animation: isSelected ? 'pulse 2s ease-in-out infinite' : 'none',
									'@keyframes pulse': {
										'0%, 100%': {
											boxShadow: `0 6px 24px ${status.color}60, 0 0 0 4px ${status.color}20`,
										},
										'50%': {
											boxShadow: `0 6px 28px ${status.color}80, 0 0 0 6px ${status.color}30`,
										},
									},
									'& .MuiChip-icon': {
										marginLeft: '8px',
										marginRight: '-4px',
										color: isSelected ? 'white' : status.color,
										filter: isSelected ? 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' : 'none',
									},
									'& .MuiChip-label': {
										display: { xs: 'none', sm: 'block' },
										px: 1,
									},
									// Mobile : icône seulement
									minWidth: { xs: '40px', sm: 'auto' },
									'@media (max-width: 600px)': {
										'& .MuiChip-icon': {
											margin: 0,
										},
									},
									'&:hover': {
										transform: 'translateY(-2px) scale(1.05)',
										boxShadow: `0 6px 20px ${status.color}50`,
										borderColor: status.color,
										background: `linear-gradient(135deg, ${status.color}30, ${status.color}40)`,
										color: status.color,
										'& .MuiChip-icon': {
											color: status.color,
										},
									},
								}}
							/>
						</Tooltip>
					)
				})}

				{/* Reset button */}
				<Tooltip
					title={`🔄 ${t('showall')} - ${t('showallTooltip')}`}
					arrow
					placement='top'
					disableTouchListener>
					<IconButton
						onClick={onClear}
						sx={{
							width: { xs: '36px', sm: '42px' },
							height: { xs: '36px', sm: '42px' },
							background: isDark
								? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)'
								: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
							border: '2px solid rgba(139, 92, 246, 0.2)',
							boxShadow: '0 2px 8px rgba(139, 92, 246, 0.15)',
							color: '#8b5cf6',
							transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
							'&:hover': {
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								color: 'white',
								transform: 'rotate(180deg) scale(1.1)',
								boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
								borderColor: 'transparent',
							},
						}}>
						<Refresh sx={{ fontSize: { xs: '1.2rem', sm: '1.4rem' } }} />
					</IconButton>
				</Tooltip>
			</Box>
		</Box>
	)
}

export default MaterialsFilterBar
