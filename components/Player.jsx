import { useState, useRef, useEffect } from 'react'
import {
	Box,
	IconButton,
	Slider,
	Typography,
	Paper,
	Tooltip,
} from '@mui/material'
import {
	PlayArrowRounded,
	PauseRounded,
	VolumeUpRounded,
	VolumeOffRounded,
	Forward10Rounded,
	Replay10Rounded,
	HeadphonesRounded,
} from '@mui/icons-material'

const Player = ({ src }) => {
	const audioRef = useRef(null)
	const [isPlaying, setIsPlaying] = useState(false)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const [volume, setVolume] = useState(1)
	const [showVolumeSlider, setShowVolumeSlider] = useState(false)

	useEffect(() => {
		const audio = audioRef.current
		if (!audio) return

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
			}}>
			<Paper
				elevation={3}
				sx={{
					maxWidth: { xs: '100%', sm: '500px', md: '600px' },
					width: '100%',
					background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%)',
					backdropFilter: 'blur(15px)',
					padding: { xs: '8px 12px', sm: '8px 16px' },
					borderRadius: 3,
					boxShadow: '0 8px 32px rgba(102, 126, 234, 0.25)',
					display: 'flex',
					alignItems: 'center',
					gap: { xs: 1, sm: 2 },
				}}>
				<audio ref={audioRef} src={src} preload='metadata' />

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
								color: 'white',
								width: { xs: 36, sm: 40 },
								height: { xs: 36, sm: 40 },
								'&:hover': {
									backgroundColor: 'rgba(255, 255, 255, 0.15)',
									transform: 'scale(1.1)',
								},
								transition: 'all 0.2s ease',
							}}>
							<Replay10Rounded sx={{ fontSize: { xs: '1.3rem', sm: '1.4rem' } }} />
						</IconButton>
					</Tooltip>

					<IconButton
						onClick={togglePlay}
						sx={{
							backgroundColor: 'white',
							color: '#667eea',
							width: { xs: 42, sm: 48 },
							height: { xs: 42, sm: 48 },
							'&:hover': {
								backgroundColor: 'rgba(255, 255, 255, 0.95)',
								transform: 'scale(1.08)',
							},
							transition: 'all 0.2s ease',
							boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
						}}>
						{isPlaying ? (
							<PauseRounded sx={{ fontSize: { xs: '1.4rem', sm: '1.5rem' } }} />
						) : (
							<PlayArrowRounded sx={{ fontSize: { xs: '1.4rem', sm: '1.5rem' } }} />
						)}
					</IconButton>

					<Tooltip title='Avancer de 10s' placement='top'>
						<IconButton
							onClick={() => skip(10)}
							size='small'
							sx={{
								color: 'white',
								width: { xs: 36, sm: 40 },
								height: { xs: 36, sm: 40 },
								'&:hover': {
									backgroundColor: 'rgba(255, 255, 255, 0.15)',
									transform: 'scale(1.1)',
								},
								transition: 'all 0.2s ease',
							}}>
							<Forward10Rounded sx={{ fontSize: { xs: '1.3rem', sm: '1.4rem' } }} />
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
							color: 'white',
							height: 3,
							padding: 0,
							'& .MuiSlider-track': {
								border: 'none',
								backgroundColor: 'white',
							},
							'& .MuiSlider-thumb': {
								height: 10,
								width: 10,
								backgroundColor: 'white',
								'&:hover, &.Mui-focusVisible': {
									boxShadow: '0 0 0 5px rgba(255, 255, 255, 0.16)',
								},
								'&:active': {
									height: 12,
									width: 12,
								},
							},
							'& .MuiSlider-rail': {
								backgroundColor: 'rgba(255, 255, 255, 0.3)',
							},
						}}
					/>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							color: 'white',
							fontSize: '0.65rem',
							fontWeight: 500,
							mt: 0.25,
							opacity: 0.85,
						}}>
						<Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
							{formatTime(currentTime)}
						</Typography>
						<Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
							{formatTime(duration)}
						</Typography>
					</Box>
				</Box>

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
							width: showVolumeSlider ? { xs: 0, sm: 70 } : 0,
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
								color: 'white',
								'& .MuiSlider-track': {
									border: 'none',
								},
								'& .MuiSlider-thumb': {
									width: 10,
									height: 10,
									backgroundColor: 'white',
									'&:hover, &.Mui-focusVisible': {
										boxShadow: '0 0 0 6px rgba(255, 255, 255, 0.16)',
									},
								},
								'& .MuiSlider-rail': {
									backgroundColor: 'rgba(255, 255, 255, 0.3)',
								},
							}}
						/>
					</Box>
					<Tooltip title={volume > 0 ? 'Muet' : 'Son'} placement='top'>
						<IconButton
							onClick={toggleMute}
							size='small'
							sx={{
								color: 'white',
								width: { xs: 36, sm: 40 },
								height: { xs: 36, sm: 40 },
								'&:hover': {
									backgroundColor: 'rgba(255, 255, 255, 0.15)',
									transform: 'scale(1.1)',
								},
								transition: 'all 0.2s ease',
							}}>
							{volume > 0 ? (
								<VolumeUpRounded sx={{ fontSize: { xs: '1.3rem', sm: '1.4rem' } }} />
							) : (
								<VolumeOffRounded sx={{ fontSize: { xs: '1.3rem', sm: '1.4rem' } }} />
							)}
						</IconButton>
					</Tooltip>
				</Box>
			</Paper>
		</Box>
	)
}

export default Player
