import { useState, useRef, useEffect } from 'react'
import useTranslation from 'next-translate/useTranslation'
import {
	Box,
	Paper,
	Typography,
	IconButton,
	Table,
	TableBody,
	TableRow,
	TableCell,
	Chip,
	Collapse,
	List,
	ListItem,
	ListItemText,
	useTheme,
	Button,
	Menu,
	MenuItem,
	ListItemIcon,
} from '@mui/material'
import {
	PlayArrow,
	Pause,
	VolumeUp,
	ExpandMore,
	ExpandLess,
	RecordVoiceOver,
	Speed,
	Check,
} from '@mui/icons-material'

/**
 * DialogueBlock - Affiche un dialogue avec audio et traduction
 * Inspiré du format Harrap's
 */
const DialogueBlock = ({ block }) => {
	const { t } = useTranslation('common')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	const [isPlaying, setIsPlaying] = useState(false)
	const [currentLineIndex, setCurrentLineIndex] = useState(null)
	const [showVocabulary, setShowVocabulary] = useState(false)
	const [playbackRate, setPlaybackRate] = useState(1)
	const [speedMenuAnchor, setSpeedMenuAnchor] = useState(null)

	const audioRef = useRef(null)
	const lineAudioRefs = useRef({})

	const { title, audioUrl, lines, vocabulary } = block

	// Lecture du dialogue complet
	const handlePlayDialogue = () => {
		// Si audio global existe, l'utiliser
		if (audioUrl) {
			if (isPlaying) {
				audioRef.current?.pause()
				setIsPlaying(false)
			} else {
				if (!audioRef.current) {
					audioRef.current = new Audio(audioUrl)
					audioRef.current.addEventListener('ended', () => {
						setIsPlaying(false)
						setCurrentLineIndex(null)
					})
				}
				audioRef.current.playbackRate = playbackRate
				audioRef.current.play()
				setIsPlaying(true)
			}
		} else {
			// Sinon, jouer toutes les lignes en séquence
			if (isPlaying) {
				// Arrêter la lecture
				if (lineAudioRefs.current[currentLineIndex]) {
					lineAudioRefs.current[currentLineIndex].pause()
				}
				setIsPlaying(false)
				setCurrentLineIndex(null)
			} else {
				// Commencer à jouer toutes les lignes
				setIsPlaying(true)
				playNextLine(0)
			}
		}
	}

	// Jouer les lignes en séquence
	const playNextLine = (index) => {
		if (index >= lines.length) {
			// Fin du dialogue
			setIsPlaying(false)
			setCurrentLineIndex(null)
			return
		}

		const line = lines[index]
		if (!line.audioUrl) {
			// Si pas d'audio pour cette ligne, passer à la suivante
			playNextLine(index + 1)
			return
		}

		setCurrentLineIndex(index)

		if (!lineAudioRefs.current[index]) {
			lineAudioRefs.current[index] = new Audio(line.audioUrl)
		}

		// Appliquer la vitesse de lecture
		lineAudioRefs.current[index].playbackRate = playbackRate

		// Jouer la ligne suivante quand celle-ci se termine
		lineAudioRefs.current[index].onended = () => {
			setTimeout(() => playNextLine(index + 1), 300) // 300ms de pause entre les lignes
		}

		lineAudioRefs.current[index].play()
	}

	// Cleanup: arrêter tous les audios quand le composant se démonte
	useEffect(() => {
		return () => {
			// Arrêter l'audio global
			if (audioRef.current) {
				audioRef.current.pause()
			}
			// Arrêter tous les audios de lignes
			Object.values(lineAudioRefs.current).forEach((audio) => {
				if (audio) {
					audio.pause()
				}
			})
		}
	}, [])

	// Lecture d'une ligne spécifique
	const handlePlayLine = (index, url) => {
		if (!url) return

		// Arrêter le dialogue complet si en cours
		if (isPlaying) {
			audioRef.current?.pause()
			setIsPlaying(false)
		}

		setCurrentLineIndex(index)

		if (!lineAudioRefs.current[index]) {
			lineAudioRefs.current[index] = new Audio(url)
		}

		// Supprimer tout ancien événement onended et en créer un nouveau qui ne joue que cette ligne
		lineAudioRefs.current[index].onended = () => {
			setCurrentLineIndex(null)
		}

		// Appliquer la vitesse de lecture
		lineAudioRefs.current[index].playbackRate = playbackRate
		lineAudioRefs.current[index].play()
	}

	// Gérer le changement de vitesse
	const handleSpeedChange = (speed) => {
		setPlaybackRate(speed)
		setSpeedMenuAnchor(null)

		// Appliquer immédiatement si un audio est en cours de lecture
		if (audioRef.current && !audioRef.current.paused) {
			audioRef.current.playbackRate = speed
		}
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

	return (
		<Paper
			elevation={0}
			sx={{
				p: { xs: 2, sm: 3 },
				mb: 3,
				borderRadius: 3,
				border: '2px solid',
				borderColor: isDark ? 'rgba(96, 165, 250, 0.3)' : 'rgba(59, 130, 246, 0.3)',
				background: isDark
					? 'linear-gradient(135deg, rgba(30, 58, 138, 0.2) 0%, rgba(30, 41, 59, 0.8) 100%)'
					: 'linear-gradient(135deg, rgba(219, 234, 254, 0.5) 0%, rgba(255, 255, 255, 0.9) 100%)',
			}}>
			{/* Header avec icône et bouton play */}
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
				<RecordVoiceOver sx={{ fontSize: 32, color: '#60a5fa' }} />
				<Typography
					variant="h5"
					sx={{
						fontWeight: 700,
						flex: 1,
						color: isDark ? '#60a5fa' : '#1e40af',
					}}>
					{title || 'Dialogue'}
				</Typography>

				{(audioUrl || lines?.some((line) => line.audioUrl)) && (
					<Box sx={{ display: 'flex', gap: 1 }}>
						<Button
							variant="outlined"
							size="small"
							startIcon={<Speed />}
							onClick={(e) => setSpeedMenuAnchor(e.currentTarget)}
							sx={{
								borderColor: isDark ? 'rgba(96, 165, 250, 0.5)' : '#3b82f6',
								color: isDark ? '#60a5fa' : '#1e40af',
								'&:hover': {
									borderColor: '#3b82f6',
									background: isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)',
								},
							}}>
							{playbackRate}x
						</Button>
						<Button
							variant="contained"
							startIcon={isPlaying ? <Pause /> : <PlayArrow />}
							onClick={handlePlayDialogue}
							sx={{
								background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
								px: 3,
							}}>
							{isPlaying ? t('methode_pause') : t('methode_play_all')}
						</Button>
					</Box>
				)}

				{/* Menu de vitesse */}
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

			{/* Tableau du dialogue */}
			<Table
				sx={{
					mb: 2,
					'& .MuiTableCell-root': {
						borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
						py: 2,
					},
				}}>
				<TableBody>
					{lines?.map((line, index) => (
						<TableRow
							key={index}
							hover
							sx={{
								transition: 'all 0.3s ease',
								background:
									currentLineIndex === index
										? isDark
											? 'rgba(96, 165, 250, 0.2)'
											: 'rgba(219, 234, 254, 0.5)'
										: 'transparent',
							}}>
							{/* Personnage */}
							<TableCell sx={{ width: '25%', verticalAlign: 'top' }}>
								<Chip
									label={line.speaker}
									size="small"
									sx={{
										fontWeight: 600,
										background:
											line.speakerGender === 'male'
												? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
												: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
										color: 'white',
									}}
								/>
							</TableCell>

							{/* Texte français */}
							<TableCell sx={{ width: '35%' }}>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									{line.audioUrl && (
										<IconButton
											size="small"
											onClick={() => handlePlayLine(index, line.audioUrl)}
											sx={{ color: '#60a5fa' }}>
											<VolumeUp fontSize="small" />
										</IconButton>
									)}
									<Typography sx={{ fontWeight: 500, fontSize: '1rem' }}>
										{line.text}
									</Typography>
								</Box>
							</TableCell>

							{/* Aide au vocabulaire */}
							<TableCell sx={{ width: '40%' }}>
								{line.vocab && line.vocab.length > 0 ? (
									<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
										{line.vocab.map((item, idx) => (
											<Chip
												key={idx}
												label={`${item.word} = ${item.translation}`}
												size="small"
												sx={{
													fontSize: '0.75rem',
													height: 'auto',
													py: 0.5,
													background: isDark ? 'rgba(96, 165, 250, 0.15)' : 'rgba(219, 234, 254, 0.6)',
													border: `1px solid ${isDark ? 'rgba(96, 165, 250, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
													'& .MuiChip-label': {
														whiteSpace: 'normal',
														padding: '4px 8px',
													},
												}}
											/>
										))}
									</Box>
								) : line.translation ? (
									<Typography
										sx={{
											color: isDark ? '#94a3b8' : '#64748b',
											fontStyle: 'italic',
											fontSize: '0.95rem',
										}}>
										{line.translation}
									</Typography>
								) : null}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{/* Section vocabulaire (collapsible) */}
			{vocabulary && vocabulary.length > 0 && (
				<Box>
					<Button
						fullWidth
						variant="text"
						onClick={() => setShowVocabulary(!showVocabulary)}
						endIcon={showVocabulary ? <ExpandLess /> : <ExpandMore />}
						sx={{
							justifyContent: 'space-between',
							textTransform: 'none',
							color: isDark ? '#60a5fa' : '#1e40af',
							fontWeight: 600,
						}}>
						{t('methode_key_vocabulary')} ({vocabulary.length} {t('methode_words')})
					</Button>

					<Collapse in={showVocabulary}>
						<Box sx={{ mt: 2 }}>
							{/* Group vocabulary by category */}
							{['adjectives', 'verbs', 'expressions'].map((category) => {
								const categoryItems = vocabulary.filter((item) => item.category === category)
								if (categoryItems.length === 0) return null

								const categoryLabels = {
									adjectives: { icon: '🔹', label: t('methode_vocab_adjectives') },
									verbs: { icon: '🔹', label: t('methode_vocab_verbs') },
									expressions: { icon: '🔹', label: t('methode_vocab_expressions') },
								}

								return (
									<Box key={category} sx={{ mb: 3 }}>
										<Typography
											variant="subtitle2"
											sx={{
												fontWeight: 700,
												color: isDark ? '#60a5fa' : '#1e40af',
												mb: 1.5,
												display: 'flex',
												alignItems: 'center',
												gap: 1,
											}}>
											<span>{categoryLabels[category].icon}</span>
											{categoryLabels[category].label}
										</Typography>

										<List sx={{ pl: 2 }}>
											{categoryItems.map((item, index) => (
												<ListItem
													key={index}
													sx={{
														py: 1,
														px: 2,
														borderRadius: 2,
														background: isDark
															? 'rgba(255, 255, 255, 0.03)'
															: 'rgba(0, 0, 0, 0.02)',
														mb: 1,
													}}>
													<ListItemText
														primary={
															<Box sx={{ display: 'flex', gap: 2, alignItems: 'baseline' }}>
																<Typography
																	component="span"
																	sx={{
																		fontWeight: 600,
																		color: isDark ? '#60a5fa' : '#1e40af',
																		fontSize: '0.95rem',
																	}}>
																	{item.word}
																</Typography>
																<Typography
																	component="span"
																	sx={{
																		color: isDark ? '#cbd5e1' : '#475569',
																		fontSize: '0.9rem',
																	}}>
																	→ {item.translation}
																</Typography>
															</Box>
														}
														secondary={
															item.example && (
																<Typography
																	variant="body2"
																	sx={{
																		color: isDark ? '#94a3b8' : '#64748b',
																		fontStyle: 'italic',
																		mt: 0.5,
																		fontSize: '0.85rem',
																	}}>
																	Ex: {item.example}
																</Typography>
															)
														}
													/>
												</ListItem>
											))}
										</List>
									</Box>
								)
							})}
						</Box>
					</Collapse>
				</Box>
			)}
		</Paper>
	)
}

export default DialogueBlock
