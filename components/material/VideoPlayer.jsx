import { useState } from 'react'
import {
	Box,
	IconButton,
	Paper,
	Tooltip,
	ToggleButtonGroup,
	ToggleButton,
} from '@mui/material'
import {
	MinimizeRounded,
	AspectRatioRounded,
	FitScreenRounded,
	CloseFullscreenRounded,
} from '@mui/icons-material'

const VideoPlayer = ({ videoUrl }) => {
	const [viewMode, setViewMode] = useState('normal') // 'minimized', 'normal', 'theater'

	const handleViewModeChange = (event, newMode) => {
		if (newMode !== null) {
			setViewMode(newMode)
		}
	}

	const getVideoContainerStyles = () => {
		const baseStyles = {
			transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
		}

		switch (viewMode) {
			case 'minimized':
				return {
					...baseStyles,
					zIndex: 1000,
					position: 'fixed',
					top: { xs: '5rem', md: '5.5rem' },
					right: { xs: '1rem', md: '2rem' },
					width: { xs: '160px', sm: '240px' },
					height: { xs: '90px', sm: '135px' },
					boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
					borderRadius: 3,
					overflow: 'hidden',
					border: '2px solid rgba(102, 126, 234, 0.3)',
				}
			case 'theater':
				return {
					...baseStyles,
					zIndex: 1001,
					position: 'fixed',
					top: { xs: '8.5rem', md: '9rem' },
					left: '50%',
					transform: 'translateX(-50%)',
					width: '100%',
					maxWidth: { xs: 'calc(100% - 2rem)', sm: '90%', md: '1400px' },
					height: { xs: '250px', sm: '400px', md: '600px' },
					boxShadow: '0 12px 48px rgba(102, 126, 234, 0.2)',
					borderRadius: 4,
					overflow: 'hidden',
					border: '3px solid rgba(102, 126, 234, 0.2)',
				}
			default: // normal
				return {
					...baseStyles,
					zIndex: 1001,
					position: 'fixed',
					top: { xs: '8.5rem', md: '9rem' },
					left: '50%',
					transform: 'translateX(-50%)',
					width: { xs: '100%', sm: '500px' },
					maxWidth: { xs: 'calc(100% - 2rem)', sm: '500px' },
					height: { xs: '220px', sm: '280px' },
					boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)',
					borderRadius: 3,
					overflow: 'hidden',
					border: '2px solid rgba(102, 126, 234, 0.2)',
				}
		}
	}

	const getControlsStyles = () => {
		if (viewMode === 'minimized') {
			return {
				position: 'absolute',
				bottom: '4px',
				right: '4px',
				zIndex: 102,
			}
		}
		return {
			position: 'absolute',
			top: { xs: '8px', sm: '12px' },
			right: { xs: '8px', sm: '12px' },
			zIndex: 102,
		}
	}

	return (
		<Paper
			elevation={0}
			sx={{
				...getVideoContainerStyles(),
				position: 'relative',
				'&:hover .video-controls': {
					opacity: 1,
				},
			}}>
			{/* Gradient overlay for better contrast */}
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: '80px',
					background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)',
					zIndex: 101,
					pointerEvents: 'none',
					opacity: viewMode === 'minimized' ? 0 : 1,
					transition: 'opacity 0.3s ease',
				}}
			/>

			{/* Video iframe */}
			<iframe
				style={{
					width: '100%',
					height: '100%',
					border: 'none',
					display: 'block',
					borderRadius: 'inherit',
				}}
				src={videoUrl}
				allow='accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen'
				allowFullScreen
			/>

			{/* Controls */}
			<Box
				className='video-controls'
				sx={{
					...getControlsStyles(),
					opacity: viewMode === 'minimized' ? 1 : 0.7,
					transition: 'opacity 0.3s ease',
				}}>
				<ToggleButtonGroup
					value={viewMode}
					exclusive
					onChange={handleViewModeChange}
					size='small'
					sx={{
						background: 'rgba(0, 0, 0, 0.7)',
						backdropFilter: 'blur(10px)',
						borderRadius: 2,
						border: '1px solid rgba(255, 255, 255, 0.1)',
						'& .MuiToggleButton-root': {
							color: 'white',
							border: 'none',
							padding: { xs: '4px', sm: '6px 8px' },
							transition: 'all 0.2s ease',
							'&:hover': {
								background: 'rgba(102, 126, 234, 0.3)',
							},
							'&.Mui-selected': {
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								color: 'white',
								'&:hover': {
									background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
								},
							},
						},
					}}>
					<Tooltip title='Minimiser' placement='bottom'>
						<ToggleButton value='minimized' aria-label='minimized'>
							<MinimizeRounded sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />
						</ToggleButton>
					</Tooltip>
					<Tooltip title='Normal' placement='bottom'>
						<ToggleButton value='normal' aria-label='normal'>
							<AspectRatioRounded sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />
						</ToggleButton>
					</Tooltip>
					<Tooltip title='Mode théâtre' placement='bottom'>
						<ToggleButton value='theater' aria-label='theater'>
							<FitScreenRounded sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />
						</ToggleButton>
					</Tooltip>
				</ToggleButtonGroup>
			</Box>

			{/* Badge indicator */}
			{viewMode !== 'minimized' && (
				<Box
					sx={{
						position: 'absolute',
						top: { xs: '8px', sm: '12px' },
						left: { xs: '8px', sm: '12px' },
						zIndex: 102,
						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						color: 'white',
						padding: '4px 12px',
						borderRadius: 2,
						fontSize: { xs: '0.7rem', sm: '0.8rem' },
						fontWeight: 600,
						boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
						textTransform: 'uppercase',
						letterSpacing: '0.5px',
						opacity: 0.9,
					}}>
					{viewMode === 'theater' ? '🎬 Théâtre' : '📺 Vidéo'}
				</Box>
			)}
		</Paper>
	)
}

export default VideoPlayer
