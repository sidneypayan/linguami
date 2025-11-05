import { useState, useRef, useEffect } from 'react'
import {
	Box,
	IconButton,
	Slider,
	Typography,
	Paper,
	Tooltip,
	useTheme,
} from '@mui/material'
import {
	PlayArrowRounded,
	PauseRounded,
	VolumeUpRounded,
	VolumeOffRounded,
	Forward10Rounded,
	Replay10Rounded,
	HeadphonesRounded,
	SpeedRounded,
} from '@mui/icons-material'

const Player = ({ src }) => {
	const audioRef = useRef(null)
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const [isPlaying, setIsPlaying] = useState(false)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const [volume, setVolume] = useState(1)
	const [showVolumeSlider, setShowVolumeSlider] = useState(false)
	const [playbackRate, setPlaybackRate] = useState(1)

	useEffect(() => {
		const audio = audioRef.current
		if (!audio) return

		// Activer la préservation du pitch (empêche la voix de devenir grave/aiguë)
		// Supporté nativement dans les navigateurs modernes
		audio.preservesPitch = true
		// Fallback pour Firefox plus ancien
		audio.mozPreservesPitch = true
		// Fallback pour WebKit plus ancien
		audio.webkitPreservesPitch = true

		const updateTime = () => setCurrentTime(audio.currentTime)
		const updateDuration = () => setDuration(audio.duration)
		const handleEnded = () => setIsPlaying(false)

		audio.addEventListener('timeupdate', updateTime)
		audio.addEventListener('loadedmetadata', updateDuration)
		audio.addEventListener('ended', handleEnded)

		return () => {
			audio.removeEventListener('timeupdate', updateTime)
			audio.removeEventListener('loadedmetadata', updateDuration)
			audio.removeEventListener('ended', handleEnded)
		}
	}, [])

	const togglePlay = () => {
		const audio = audioRef.current
		if (isPlaying) {
			audio.pause()
		} else {
			audio.play()
		}
		setIsPlaying(!isPlaying)
	}

	const handleSeek = (event, newValue) => {
		const audio = audioRef.current
		audio.currentTime = newValue
		setCurrentTime(newValue)
	}

	const handleVolumeChange = (event, newValue) => {
		const audio = audioRef.current
		audio.volume = newValue
		setVolume(newValue)
	}

	const toggleMute = () => {
		const audio = audioRef.current
		if (volume > 0) {
			audio.volume = 0
			setVolume(0)
		} else {
			audio.volume = 1
			setVolume(1)
		}
	}

	const skip = (seconds) => {
		const audio = audioRef.current
		audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds))
	}

	const cyclePlaybackRate = () => {
		const audio = audioRef.current
		// Vitesses de réduction uniquement (pour l'apprentissage)
		const rates = [1, 0.9, 0.8, 0.7, 0.6, 0.5]
		const currentIndex = rates.indexOf(playbackRate)
		const nextIndex = (currentIndex + 1) % rates.length
		const newRate = rates[nextIndex]
		audio.playbackRate = newRate
		setPlaybackRate(newRate)
	}

	const formatTime = (time) => {
		if (isNaN(time)) return '0:00'
		const minutes = Math.floor(time / 60)
		const seconds = Math.floor(time % 60)
		return `${minutes}:${seconds.toString().padStart(2, '0')}`
	}

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				width: '100%',
				my: 3,
			}}>
			<Paper
				elevation={0}
				sx={{
					maxWidth: { xs: '100%', sm: '540px', md: '680px' },
					width: '100%',
					background: isDark
						? 'linear-gradient(145deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)'
						: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
					backdropFilter: 'blur(10px)',
					padding: { xs: '14px 16px', sm: '16px 20px' },
					borderRadius: 4,
					border: '2px solid rgba(139, 92, 246, 0.2)',
					boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15)',
					display: 'flex',
					alignItems: 'center',
					gap: { xs: 1.5, sm: 2 },
					position: 'relative',
					transition: 'all 0.3s ease',
					'&:hover': {
						boxShadow: '0 12px 40px rgba(139, 92, 246, 0.25)',
						borderColor: 'rgba(139, 92, 246, 0.35)',
					},
				}}>
				<audio ref={audioRef} src={src} preload='metadata' />

				{/* Icône décorative */}
				<Box
					sx={{
						display: { xs: 'none', sm: 'flex' },
						alignItems: 'center',
						justifyContent: 'center',
						width: 42,
						height: 42,
						borderRadius: 2,
						background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
						border: '1px solid rgba(139, 92, 246, 0.2)',
						flexShrink: 0,
					}}>
					<HeadphonesRounded sx={{ fontSize: '1.4rem', color: '#8b5cf6' }} />
				</Box>

				{/* Playback Controls */}
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: { xs: 0.5, sm: 1 },
						flexShrink: 0,
					}}>
					<Tooltip title='Reculer de 10s' placement='top'>
						<IconButton
							onClick={() => skip(-10)}
							size='small'
							sx={{
								color: isDark ? '#94a3b8' : '#64748b',
								width: { xs: 38, sm: 42 },
								height: { xs: 38, sm: 42 },
								background: 'rgba(139, 92, 246, 0.06)',
								border: '1px solid rgba(139, 92, 246, 0.15)',
								'&:hover': {
									background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
									color: '#8b5cf6',
									transform: 'scale(1.05)',
									borderColor: 'rgba(139, 92, 246, 0.3)',
								},
								transition: 'all 0.2s ease',
							}}>
							<Replay10Rounded sx={{ fontSize: { xs: '1.2rem', sm: '1.3rem' } }} />
						</IconButton>
					</Tooltip>

					<IconButton
						onClick={togglePlay}
						sx={{
							background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
							color: 'white',
							width: { xs: 48, sm: 54 },
							height: { xs: 48, sm: 54 },
							boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
							'&:hover': {
								background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
								transform: 'scale(1.05)',
								boxShadow: '0 6px 28px rgba(139, 92, 246, 0.4)',
							},
							transition: 'all 0.2s ease',
							...(isPlaying && {
								animation: 'pulse 2s ease-in-out infinite',
								'@keyframes pulse': {
									'0%, 100%': {
										boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
									},
									'50%': {
										boxShadow: '0 6px 32px rgba(139, 92, 246, 0.5)',
									},
								},
							}),
						}}>
						{isPlaying ? (
							<PauseRounded sx={{ fontSize: { xs: '1.5rem', sm: '1.6rem' } }} />
						) : (
							<PlayArrowRounded sx={{ fontSize: { xs: '1.5rem', sm: '1.6rem' } }} />
						)}
					</IconButton>

					<Tooltip title='Avancer de 10s' placement='top'>
						<IconButton
							onClick={() => skip(10)}
							size='small'
							sx={{
								color: isDark ? '#94a3b8' : '#64748b',
								width: { xs: 38, sm: 42 },
								height: { xs: 38, sm: 42 },
								background: 'rgba(139, 92, 246, 0.06)',
								border: '1px solid rgba(139, 92, 246, 0.15)',
								'&:hover': {
									background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
									color: '#8b5cf6',
									transform: 'scale(1.05)',
									borderColor: 'rgba(139, 92, 246, 0.3)',
								},
								transition: 'all 0.2s ease',
							}}>
							<Forward10Rounded sx={{ fontSize: { xs: '1.2rem', sm: '1.3rem' } }} />
						</IconButton>
					</Tooltip>
				</Box>

				{/* Progress Bar with time */}
				<Box sx={{ flex: 1, minWidth: 0 }}>
					<Slider
						value={currentTime}
						max={duration || 100}
						onChange={handleSeek}
						sx={{
							color: '#8b5cf6',
							height: 4,
							padding: 0,
							'& .MuiSlider-track': {
								border: 'none',
								background: 'linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%)',
							},
							'& .MuiSlider-thumb': {
								height: 14,
								width: 14,
								backgroundColor: '#8b5cf6',
								border: '2px solid white',
								boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
								'&:hover, &.Mui-focusVisible': {
									boxShadow: '0 0 0 6px rgba(139, 92, 246, 0.16)',
								},
								'&:active': {
									height: 16,
									width: 16,
								},
							},
							'& .MuiSlider-rail': {
								backgroundColor: 'rgba(139, 92, 246, 0.15)',
								height: 4,
							},
						}}
					/>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							color: isDark ? '#94a3b8' : '#64748b',
							fontSize: '0.7rem',
							fontWeight: 600,
							mt: 0.5,
						}}>
						<Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
							{formatTime(currentTime)}
						</Typography>
						<Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
							{formatTime(duration)}
						</Typography>
					</Box>
				</Box>

				{/* Playback Speed Control */}
				<Tooltip title='Vitesse de lecture' placement='top'>
					<IconButton
						onClick={cyclePlaybackRate}
						size='small'
						sx={{
							color: playbackRate === 1 ? (isDark ? '#94a3b8' : '#64748b') : '#8b5cf6',
							width: { xs: 52, sm: 58 },
							height: { xs: 38, sm: 42 },
							background: playbackRate === 1
								? 'rgba(139, 92, 246, 0.06)'
								: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
							border: `1px solid ${playbackRate === 1 ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.3)'}`,
							display: 'flex',
							alignItems: 'center',
							gap: 0.5,
							flexShrink: 0,
							'&:hover': {
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
								color: '#8b5cf6',
								transform: 'scale(1.05)',
								borderColor: 'rgba(139, 92, 246, 0.3)',
							},
							transition: 'all 0.2s ease',
						}}>
						<SpeedRounded sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />
						<Typography
							sx={{
								fontSize: { xs: '0.65rem', sm: '0.7rem' },
								fontWeight: 700,
								lineHeight: 1,
							}}>
							{playbackRate}x
						</Typography>
					</IconButton>
				</Tooltip>

				{/* Volume Control */}
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 0.5,
						flexShrink: 0,
					}}
					onMouseEnter={() => setShowVolumeSlider(true)}
					onMouseLeave={() => setShowVolumeSlider(false)}>
					<Box
						sx={{
							width: showVolumeSlider ? { xs: 0, sm: 80 } : 0,
							opacity: showVolumeSlider ? 1 : 0,
							transition: 'all 0.3s ease',
							overflow: 'hidden',
							display: { xs: 'none', sm: 'block' },
						}}>
						<Slider
							value={volume}
							onChange={handleVolumeChange}
							min={0}
							max={1}
							step={0.01}
							sx={{
								color: '#8b5cf6',
								'& .MuiSlider-track': {
									border: 'none',
									background: 'linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%)',
								},
								'& .MuiSlider-thumb': {
									width: 12,
									height: 12,
									backgroundColor: '#8b5cf6',
									border: '2px solid white',
									boxShadow: '0 2px 6px rgba(139, 92, 246, 0.3)',
									'&:hover, &.Mui-focusVisible': {
										boxShadow: '0 0 0 6px rgba(139, 92, 246, 0.16)',
									},
								},
								'& .MuiSlider-rail': {
									backgroundColor: 'rgba(139, 92, 246, 0.15)',
								},
							}}
						/>
					</Box>
					<Tooltip title={volume > 0 ? 'Muet' : 'Son'} placement='top'>
						<IconButton
							onClick={toggleMute}
							size='small'
							sx={{
								color: isDark ? '#94a3b8' : '#64748b',
								width: { xs: 38, sm: 42 },
								height: { xs: 38, sm: 42 },
								background: 'rgba(139, 92, 246, 0.06)',
								border: '1px solid rgba(139, 92, 246, 0.15)',
								'&:hover': {
									background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
									color: '#8b5cf6',
									transform: 'scale(1.05)',
									borderColor: 'rgba(139, 92, 246, 0.3)',
								},
								transition: 'all 0.2s ease',
							}}>
							{volume > 0 ? (
								<VolumeUpRounded sx={{ fontSize: { xs: '1.2rem', sm: '1.3rem' } }} />
							) : (
								<VolumeOffRounded sx={{ fontSize: { xs: '1.2rem', sm: '1.3rem' } }} />
							)}
						</IconButton>
					</Tooltip>
				</Box>
			</Paper>
		</Box>
	)
}

export default Player
