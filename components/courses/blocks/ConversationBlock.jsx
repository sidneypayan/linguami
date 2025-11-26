import { useState, useRef, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Box, Paper, Typography, useTheme, Button, IconButton, Menu, MenuItem, ListItemIcon } from '@mui/material'
import { Forum, Visibility, VisibilityOff, PlayArrow, Pause, VolumeUp, Speed, Check } from '@mui/icons-material'

const ConversationBlock = ({ block }) => {
	const t = useTranslations('common')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const [revealedAnswers, setRevealedAnswers] = useState({})
	const [isPlaying, setIsPlaying] = useState(false)
	const [currentLineIndex, setCurrentLineIndex] = useState(null)
	const [playbackRate, setPlaybackRate] = useState(1)
	const [speedMenuAnchor, setSpeedMenuAnchor] = useState(null)

	const lineAudioRefs = useRef({})

	const { title, context, dialogue, questions } = block

	const toggleAnswer = (index) => {
		setRevealedAnswers((prev) => ({
			...prev,
			[index]: !prev[index],
		}))
	}

	// Play all dialogue lines in sequence
	const handlePlayAll = () => {
		if (isPlaying) {
			// Stop playing
			if (lineAudioRefs.current[currentLineIndex]) {
				lineAudioRefs.current[currentLineIndex].pause()
			}
			setIsPlaying(false)
			setCurrentLineIndex(null)
		} else {
			// Start playing
			setIsPlaying(true)
			playNextLine(0)
		}
	}

	// Play lines in sequence
	const playNextLine = (index) => {
		if (!dialogue || index >= dialogue.length) {
			// End of dialogue
			setIsPlaying(false)
			setCurrentLineIndex(null)
			return
		}

		const line = dialogue[index]
		if (!line.audioUrl) {
			// No audio for this line, skip to next
			playNextLine(index + 1)
			return
		}

		setCurrentLineIndex(index)

		if (!lineAudioRefs.current[index]) {
			lineAudioRefs.current[index] = new Audio(line.audioUrl)
		}

		// Apply playback speed
		lineAudioRefs.current[index].playbackRate = playbackRate

		// Play next line when this one ends
		lineAudioRefs.current[index].onended = () => {
			setTimeout(() => playNextLine(index + 1), 300)
		}

		lineAudioRefs.current[index].play()
	}

	// Play a specific line
	const handlePlayLine = (index, url) => {
		if (!url) return

		// Stop full dialogue if playing
		if (isPlaying) {
			if (lineAudioRefs.current[currentLineIndex]) {
				lineAudioRefs.current[currentLineIndex].pause()
			}
			setIsPlaying(false)
		}

		setCurrentLineIndex(index)

		if (!lineAudioRefs.current[index]) {
			lineAudioRefs.current[index] = new Audio(url)
		}

		// Remove any old onended event and create a new one that only plays this line
		lineAudioRefs.current[index].onended = () => {
			setCurrentLineIndex(null)
		}

		// Apply playback speed
		lineAudioRefs.current[index].playbackRate = playbackRate
		lineAudioRefs.current[index].play()
	}

	// Handle speed change
	const handleSpeedChange = (speed) => {
		setPlaybackRate(speed)
		setSpeedMenuAnchor(null)

		// Apply immediately if audio is playing
		if (currentLineIndex !== null && lineAudioRefs.current[currentLineIndex]) {
			lineAudioRefs.current[currentLineIndex].playbackRate = speed
		}
	}

	const speedOptions = [
		{ value: 0.5, label: `0.5x (${t('methode_speed_very_slow')})` },
		{ value: 0.75, label: `0.75x (${t('methode_speed_slow')})` },
		{ value: 1, label: `1x (${t('methode_speed_normal')})` },
		{ value: 1.25, label: `1.25x (${t('methode_speed_fast')})` },
		{ value: 1.5, label: `1.5x (${t('methode_speed_very_fast')})` },
	]

	// Cleanup audio on unmount
	useEffect(() => {
		return () => {
			Object.values(lineAudioRefs.current).forEach((audio) => {
				if (audio) {
					audio.pause()
				}
			})
		}
	}, [])

	const hasAudio = dialogue?.some((line) => line.audioUrl)

	return (
		<Paper
			elevation={0}
			sx={{
				p: { xs: 2, sm: 3 },
				mb: 3,
				borderRadius: 3,
				border: '2px solid',
				borderColor: isDark ? 'rgba(251, 146, 60, 0.3)' : 'rgba(251, 146, 60, 0.3)',
				background: isDark
					? 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(30, 41, 59, 0.8) 100%)'
					: 'linear-gradient(135deg, rgba(254, 243, 199, 0.5) 0%, rgba(255, 255, 255, 0.9) 100%)',
			}}>
			{/* Header */}
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
				<Forum sx={{ fontSize: 32, color: '#fb923c' }} />
				<Typography
					variant="h5"
					sx={{
						fontWeight: 700,
						flex: 1,
						color: isDark ? '#fdba74' : '#f97316',
					}}>
					{title}
				</Typography>

				{hasAudio && (
					<Box sx={{ display: 'flex', gap: 1 }}>
						<Button
							variant="outlined"
							size="small"
							startIcon={<Speed />}
							onClick={(e) => setSpeedMenuAnchor(e.currentTarget)}
							sx={{
								borderColor: isDark ? 'rgba(251, 146, 60, 0.5)' : '#f97316',
								color: isDark ? '#fdba74' : '#f97316',
								'&:hover': {
									borderColor: '#f97316',
									background: isDark ? 'rgba(251, 146, 60, 0.1)' : 'rgba(251, 146, 60, 0.1)',
								},
							}}>
							{playbackRate}x
						</Button>
						<Button
							variant="contained"
							size="small"
							startIcon={isPlaying ? <Pause /> : <PlayArrow />}
							onClick={handlePlayAll}
							sx={{
								background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
							}}>
							{isPlaying ? t('methode_pause') : t('methode_play_all')}
						</Button>
					</Box>
				)}

				{/* Speed menu */}
				<Menu
					anchorEl={speedMenuAnchor}
					open={Boolean(speedMenuAnchor)}
					onClose={() => setSpeedMenuAnchor(null)}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}>
					{speedOptions.map((option) => (
						<MenuItem
							key={option.value}
							onClick={() => handleSpeedChange(option.value)}
							selected={playbackRate === option.value}>
							{playbackRate === option.value && (
								<ListItemIcon>
									<Check fontSize="small" />
								</ListItemIcon>
							)}
							<Typography sx={{ pl: playbackRate === option.value ? 0 : 4 }}>
								{option.label}
							</Typography>
						</MenuItem>
					))}
				</Menu>
			</Box>

			{/* Context */}
			{context && (
				<Typography
					sx={{
						mb: 2,
						p: 1.5,
						borderRadius: 2,
						background: isDark ? 'rgba(251, 146, 60, 0.1)' : 'rgba(251, 146, 60, 0.05)',
						fontStyle: 'italic',
						color: isDark ? '#cbd5e1' : '#475569',
					}}>
					📍 {context}
				</Typography>
			)}

			{/* Dialogue */}
			{dialogue && dialogue.length > 0 && (
				<Box sx={{ mb: 3 }}>
					{dialogue.map((line, index) => (
						<Box
							key={index}
							sx={{
								mb: 1.5,
								p: 1.5,
								borderRadius: 2,
								background: currentLineIndex === index
									? isDark
										? 'rgba(251, 146, 60, 0.2)'
										: 'rgba(254, 243, 199, 0.5)'
									: isDark
									? 'rgba(255, 255, 255, 0.05)'
									: 'rgba(0, 0, 0, 0.02)',
								transition: 'all 0.3s ease',
							}}>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
								<Typography
									sx={{
										fontWeight: 700,
										color: '#fb923c',
										fontSize: '0.875rem',
										flex: 1,
									}}>
									{line.speaker}
								</Typography>
								{line.audioUrl && (
									<IconButton
										size="small"
										onClick={() => handlePlayLine(index, line.audioUrl)}
										sx={{ color: '#fb923c' }}>
										<VolumeUp fontSize="small" />
									</IconButton>
								)}
							</Box>
							<Typography sx={{ color: 'text.primary' }}>{line.text}</Typography>
						</Box>
					))}
				</Box>
			)}

			{/* Questions */}
			{questions && questions.length > 0 && (
				<Box
					sx={{
						p: 2,
						borderRadius: 2,
						background: isDark ? 'rgba(251, 146, 60, 0.1)' : 'rgba(254, 243, 199, 0.5)',
						borderLeft: '4px solid #fb923c',
					}}>
					<Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#fb923c' }}>
						{questions.length > 1 ? t('methode_questions') : t('methode_question')} :
					</Typography>
					{questions.map((q, index) => (
						<Box key={index} sx={{ mb: 2 }}>
							<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flexWrap: 'wrap' }}>
								<Typography sx={{ color: 'text.primary', fontWeight: 500 }}>
									{q.question}
								</Typography>
								<IconButton
									size="small"
									onClick={() => toggleAnswer(index)}
									sx={{
										color: '#fb923c',
										p: 0.5,
										'&:hover': {
											background: isDark ? 'rgba(251, 146, 60, 0.1)' : 'rgba(251, 146, 60, 0.1)',
										},
									}}>
									{revealedAnswers[index] ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
								</IconButton>
								{revealedAnswers[index] && (
									<Typography
										sx={{
											color: isDark ? '#34d399' : '#059669',
											fontWeight: 600,
										}}>
										→ {q.answer}
									</Typography>
								)}
							</Box>
						</Box>
					))}
				</Box>
			)}
		</Paper>
	)
}

export default ConversationBlock
