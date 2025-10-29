import useTranslation from 'next-translate/useTranslation'
import { Search, Refresh } from '@mui/icons-material'
import {
	filterMaterials,
	showAllMaterials,
} from '../../features/materials/materialsSlice'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { searchMaterial } from '../../features/materials/materialsSlice'
import { Box, TextField, IconButton, Chip, Stack, Tooltip, InputAdornment } from '@mui/material'

const LevelBar = () => {
	const { t } = useTranslation('section')
	const dispatch = useDispatch()
	const router = useRouter()
	const { section } = router.query
	const [search, setSearch] = useState('')
	const [selectedLevel, setSelectedLevel] = useState(null)

	const handleSubmit = e => {
		e.preventDefault()
		dispatch(searchMaterial(search))
	}

	const handleClear = () => {
		dispatch(showAllMaterials())
		setSearch('')
		setSelectedLevel(null)
	}

	const handleLevelClick = (level, levelKey) => {
		dispatch(filterMaterials({ section, level: levelKey }))
		setSelectedLevel(level)
	}

	const levels = [
		{ label: 'A1/A2', key: 'débutant', tooltip: t('beginner'), color: '#43e97b' },
		{ label: 'B1/B2', key: 'intermédiaire', tooltip: t('intermediate'), color: '#4facfe' },
		{ label: 'C1/C2', key: 'avancé', tooltip: t('advanced'), color: '#f093fb' },
	]

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: { xs: 'column', md: 'row' },
				gap: 3,
				mb: 4,
				alignItems: { xs: 'stretch', md: 'center' },
				justifyContent: 'space-between',
			}}>
			{/* Search bar */}
			<Box
				component='form'
				onSubmit={handleSubmit}
				sx={{
					flex: 1,
					maxWidth: { xs: '100%', md: '400px' },
				}}>
				<TextField
					fullWidth
					size='small'
					placeholder={t('search')}
					value={search}
					onChange={e => setSearch(e.target.value)}
					InputProps={{
						endAdornment: (
							<InputAdornment position='end'>
								<IconButton
									type='submit'
									edge='end'
									sx={{
										color: '#667eea',
										transition: 'all 0.2s ease',
										'&:hover': {
											transform: 'scale(1.1)',
											color: '#764ba2',
										},
									}}>
									<Search />
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

			{/* Level filters */}
			<Stack
				direction='row'
				spacing={1.5}
				sx={{
					alignItems: 'center',
					justifyContent: { xs: 'center', md: 'flex-end' },
					flexWrap: 'wrap',
					gap: 1.5,
				}}>
				{levels.map(level => (
					<Tooltip key={level.label} title={level.tooltip} arrow placement='top'>
						<Chip
							label={level.label}
							onClick={() => handleLevelClick(level.label, level.key)}
							sx={{
								fontWeight: 600,
								fontSize: '0.95rem',
								px: 1,
								height: '40px',
								borderRadius: 3,
								cursor: 'pointer',
								border: '2px solid',
								borderColor: selectedLevel === level.label ? level.color : 'transparent',
								background:
									selectedLevel === level.label
										? `linear-gradient(135deg, ${level.color}20, ${level.color}40)`
										: 'rgba(255, 255, 255, 0.9)',
								color: selectedLevel === level.label ? level.color : '#666',
								boxShadow:
									selectedLevel === level.label
										? `0 4px 15px ${level.color}40`
										: '0 2px 8px rgba(0,0,0,0.08)',
								transition: 'all 0.3s ease',
								'&:hover': {
									transform: 'translateY(-3px)',
									boxShadow: `0 6px 20px ${level.color}60`,
									borderColor: level.color,
									background: `linear-gradient(135deg, ${level.color}30, ${level.color}50)`,
								},
							}}
						/>
					</Tooltip>
				))}

				{/* Reset button */}
				<Tooltip title={t('showall')} arrow placement='top'>
					<IconButton
						onClick={handleClear}
						sx={{
							backgroundColor: 'rgba(255, 255, 255, 0.9)',
							boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
							border: '2px solid transparent',
							transition: 'all 0.3s ease',
							'&:hover': {
								backgroundColor: '#667eea',
								color: 'white',
								transform: 'rotate(180deg) translateY(-3px)',
								boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
							},
						}}>
						<Refresh />
					</IconButton>
				</Tooltip>
			</Stack>
		</Box>
	)
}

export default LevelBar
