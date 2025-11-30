import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	Play,
	Pause,
	Volume2,
	ChevronDown,
	ChevronUp,
	MessageSquare,
	Gauge,
	Check,
	Sparkles,
	Eye,
	EyeOff,
} from 'lucide-react'

/**
 * DialogueBlock - Parchemin de dialogue avec audio
 * Style gaming/fantasy inspire des RPG
 */
const DialogueBlock = ({ block }) => {
	const t = useTranslations('common')
	const { isDark } = useThemeMode()

	const [isPlaying, setIsPlaying] = useState(false)
	const [currentLineIndex, setCurrentLineIndex] = useState(null)
	const [showVocabulary, setShowVocabulary] = useState(false)
	const [showInlineVocab, setShowInlineVocab] = useState(false) // For mobile toggle
	const [playbackRate, setPlaybackRate] = useState(1)
	const [showSpeedMenu, setShowSpeedMenu] = useState(false)

	const audioRef = useRef(null)
	const lineAudioRefs = useRef({})

	const { title, audioUrl, lines, vocabulary } = block

	// Lecture du dialogue complet
	const handlePlayDialogue = () => {
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
			if (isPlaying) {
				if (lineAudioRefs.current[currentLineIndex]) {
					lineAudioRefs.current[currentLineIndex].pause()
				}
				setIsPlaying(false)
				setCurrentLineIndex(null)
			} else {
				setIsPlaying(true)
				playNextLine(0)
			}
		}
	}

	const playNextLine = (index) => {
		if (index >= lines.length) {
			setIsPlaying(false)
			setCurrentLineIndex(null)
			return
		}

		const line = lines[index]
		if (!line.audioUrl) {
			playNextLine(index + 1)
			return
		}

		setCurrentLineIndex(index)

		if (!lineAudioRefs.current[index]) {
			lineAudioRefs.current[index] = new Audio(line.audioUrl)
		}

		lineAudioRefs.current[index].playbackRate = playbackRate
		lineAudioRefs.current[index].onended = () => {
			setTimeout(() => playNextLine(index + 1), 300)
		}

		lineAudioRefs.current[index].play()
	}

	useEffect(() => {
		return () => {
			if (audioRef.current) {
				audioRef.current.pause()
			}
			Object.values(lineAudioRefs.current).forEach((audio) => {
				if (audio) audio.pause()
			})
		}
	}, [])

	const handlePlayLine = (index, url) => {
		if (!url) return

		if (isPlaying) {
			audioRef.current?.pause()
			setIsPlaying(false)
		}

		setCurrentLineIndex(index)

		if (!lineAudioRefs.current[index]) {
			lineAudioRefs.current[index] = new Audio(url)
		}

		lineAudioRefs.current[index].onended = () => {
			setCurrentLineIndex(null)
		}

		lineAudioRefs.current[index].playbackRate = playbackRate
		lineAudioRefs.current[index].play()
	}

	const handleSpeedChange = (speed) => {
		setPlaybackRate(speed)
		setShowSpeedMenu(false)

		if (audioRef.current && !audioRef.current.paused) {
			audioRef.current.playbackRate = speed
		}
		if (currentLineIndex !== null && lineAudioRefs.current[currentLineIndex]) {
			lineAudioRefs.current[currentLineIndex].playbackRate = speed
		}
	}

	const speedOptions = [
		{ value: 0.5, label: '0.5x' },
		{ value: 0.75, label: '0.75x' },
		{ value: 1, label: '1x' },
		{ value: 1.25, label: '1.25x' },
		{ value: 1.5, label: '1.5x' },
	]

	return (
		<div className={cn(
			'relative rounded-lg sm:rounded-2xl border sm:border-2 overflow-hidden',
			isDark
				? 'bg-gradient-to-br from-blue-950/50 via-slate-900 to-cyan-950/30 border-blue-500/30'
				: 'bg-gradient-to-br from-blue-50 via-white to-cyan-50 border-blue-200'
		)}>
			{/* Effet de brillance */}
			<div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />

			{/* Header */}
			<div className={cn(
				'relative p-4 sm:p-5 border-b',
				isDark ? 'border-blue-500/20' : 'border-blue-200'
			)}>
				<div className="flex items-center gap-3 sm:gap-4 flex-wrap">
					<div className={cn(
						'w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg',
						'bg-gradient-to-br from-blue-400 to-cyan-500'
					)}>
						<MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
					</div>

					<div className="flex-1 min-w-0">
						<h3 className={cn(
							'text-lg sm:text-xl font-bold truncate',
							isDark ? 'text-blue-300' : 'text-blue-700'
						)}>
							{title || 'Dialogue'}
						</h3>
						<p className={cn(
							'text-sm',
							isDark ? 'text-slate-400' : 'text-slate-500'
						)}>
							{lines?.length || 0} {t('methode_lines')}
						</p>
					</div>

					{/* Toggle vocabulaire - Mobile only */}
					{lines?.some((line) => line.vocab && line.vocab.length > 0) && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowInlineVocab(!showInlineVocab)}
							className={cn(
								'sm:hidden gap-1.5 border-2',
								isDark
									? 'border-blue-500/30 text-blue-300 hover:bg-blue-500/10'
									: 'border-blue-300 text-blue-700 hover:bg-blue-50'
							)}
						>
							{showInlineVocab ? (
								<EyeOff className="w-4 h-4" />
							) : (
								<Eye className="w-4 h-4" />
							)}
							{t('methode_show_vocab')}
						</Button>
					)}

					{/* Controles audio */}
					{(audioUrl || lines?.some((line) => line.audioUrl)) && (
						<div className="flex items-center gap-2">
							{/* Menu vitesse */}
							<div className="relative">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setShowSpeedMenu(!showSpeedMenu)}
									className={cn(
										'gap-1 border-2',
										isDark
											? 'border-blue-500/30 text-blue-300 hover:bg-blue-500/10'
											: 'border-blue-300 text-blue-700 hover:bg-blue-50'
									)}
								>
									<Gauge className="w-4 h-4" />
									{playbackRate}x
								</Button>

								{showSpeedMenu && (
									<div className={cn(
										'absolute right-0 top-full mt-1 py-1 rounded-lg border shadow-xl z-20 min-w-[100px]',
										isDark
											? 'bg-slate-800 border-slate-700'
											: 'bg-white border-slate-200'
									)}>
										{speedOptions.map((option) => (
											<button
												key={option.value}
												onClick={() => handleSpeedChange(option.value)}
												className={cn(
													'w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors',
													playbackRate === option.value
														? isDark
															? 'bg-blue-500/20 text-blue-300'
															: 'bg-blue-50 text-blue-700'
														: isDark
															? 'hover:bg-slate-700 text-slate-300'
															: 'hover:bg-slate-50 text-slate-700'
												)}
											>
												{playbackRate === option.value && (
													<Check className="w-4 h-4" />
												)}
												<span className={playbackRate === option.value ? '' : 'ml-6'}>
													{option.label}
												</span>
											</button>
										))}
									</div>
								)}
							</div>

							<Button
								onClick={handlePlayDialogue}
								className={cn(
									'gap-2 font-semibold shadow-lg',
									'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
								)}
							>
								{isPlaying ? (
									<>
										<Pause className="w-4 h-4" />
										{t('methode_pause')}
									</>
								) : (
									<>
										<Play className="w-4 h-4" />
										{t('methode_play_all')}
									</>
								)}
							</Button>
						</div>
					)}
				</div>
			</div>

			{/* Lignes du dialogue */}
			<div className="p-3 sm:p-5 space-y-2 sm:space-y-3">
				{lines?.map((line, index) => (
					<div
						key={index}
						className={cn(
							'p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300',
							currentLineIndex === index
								? isDark
									? 'bg-blue-500/20 ring-2 ring-blue-500/50'
									: 'bg-blue-100 ring-2 ring-blue-300'
								: isDark
									? 'bg-slate-800/50 hover:bg-slate-800'
									: 'bg-white hover:bg-slate-50 shadow-sm'
						)}
					>
						{/* Nom du personnage */}
						<div className="flex items-center gap-2 mb-1">
							<span className={cn(
								'font-bold text-sm',
								line.speakerGender === 'male'
									? 'text-blue-500'
									: 'text-pink-500'
							)}>
								{line.speaker}
							</span>
							{line.audioUrl && (
								<button
									onClick={() => handlePlayLine(index, line.audioUrl)}
									className={cn(
										'p-1 rounded-full transition-colors',
										isDark
											? 'hover:bg-blue-500/20 text-blue-400'
											: 'hover:bg-blue-100 text-blue-600'
									)}
								>
									<Volume2 className="w-4 h-4" />
								</button>
							)}
						</div>

						{/* Texte et vocabulaire */}
						<div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
							{/* Texte principal */}
							<p className={cn(
								'font-medium sm:flex-1 sm:min-w-0',
								isDark ? 'text-white' : 'text-slate-900'
							)}>
								{line.text}
							</p>

							{/* Vocabulaire - Desktop: toujours visible à droite */}
							{line.vocab && line.vocab.length > 0 && (
								<div className="hidden sm:flex sm:flex-wrap sm:gap-1.5 sm:flex-1 sm:justify-end">
									{line.vocab.map((item, idx) => (
										<Badge
											key={idx}
											variant="outline"
											className={cn(
												'text-xs sm:text-sm py-1 px-2 whitespace-nowrap',
												isDark
													? 'border-blue-500/30 bg-blue-500/10 text-blue-300'
													: 'border-blue-200 bg-blue-50 text-blue-700'
											)}
										>
											{item.word} = {item.translation}
										</Badge>
									))}
								</div>
							)}

							{/* Traduction simple si pas de vocab */}
							{line.translation && (!line.vocab || line.vocab.length === 0) && (
								<p className={cn(
									'text-sm sm:text-base italic sm:text-right sm:flex-1',
									isDark ? 'text-slate-400' : 'text-slate-500'
								)}>
									{line.translation}
								</p>
							)}
						</div>

						{/* Vocabulaire - Mobile: toggle */}
						{line.vocab && line.vocab.length > 0 && (
							<div className="sm:hidden mt-2">
								{showInlineVocab && (
									<div className="flex flex-wrap gap-1.5">
										{line.vocab.map((item, idx) => (
											<Badge
												key={idx}
												variant="outline"
												className={cn(
													'text-xs py-1 px-2',
													isDark
														? 'border-blue-500/30 bg-blue-500/10 text-blue-300'
														: 'border-blue-200 bg-blue-50 text-blue-700'
												)}
											>
												{item.word} = {item.translation}
											</Badge>
										))}
									</div>
								)}
							</div>
						)}
					</div>
				))}
			</div>

			{/* Section vocabulaire (collapsible) */}
			{vocabulary && vocabulary.length > 0 && (
				<div className={cn(
					'border-t',
					isDark ? 'border-blue-500/20' : 'border-blue-200'
				)}>
					<button
						onClick={() => setShowVocabulary(!showVocabulary)}
						className={cn(
							'w-full p-4 flex items-center justify-between transition-colors',
							isDark
								? 'hover:bg-blue-500/10'
								: 'hover:bg-blue-50'
						)}
					>
						<div className="flex items-center gap-2">
							<Sparkles className={cn(
								'w-5 h-5',
								isDark ? 'text-blue-400' : 'text-blue-600'
							)} />
							<span className={cn(
								'font-bold',
								isDark ? 'text-blue-300' : 'text-blue-700'
							)}>
								{t('methode_key_vocabulary')} ({vocabulary.length} {t('methode_words')})
							</span>
						</div>
						{showVocabulary ? (
							<ChevronUp className={cn('w-5 h-5', isDark ? 'text-blue-400' : 'text-blue-600')} />
						) : (
							<ChevronDown className={cn('w-5 h-5', isDark ? 'text-blue-400' : 'text-blue-600')} />
						)}
					</button>

					{showVocabulary && (
						<div className="px-4 pb-4 space-y-4">
							{['adjectives', 'verbs', 'expressions'].map((category) => {
								const categoryItems = vocabulary.filter((item) => item.category === category)
								if (categoryItems.length === 0) return null

								const categoryConfig = {
									adjectives: { icon: '🔷', label: t('methode_vocab_adjectives') },
									verbs: { icon: '⚡', label: t('methode_vocab_verbs') },
									expressions: { icon: null, label: t('methode_vocab_expressions') },
								}

								return (
									<div key={category}>
										<h4 className={cn(
											'font-bold mb-2 flex items-center gap-2',
											isDark ? 'text-blue-300' : 'text-blue-700'
										)}>
											{categoryConfig[category].icon && <span>{categoryConfig[category].icon}</span>}
											{categoryConfig[category].label}
										</h4>

										<div className="space-y-2 pl-2">
											{categoryItems.map((item, index) => (
												<div
													key={index}
													className={cn(
														'p-3 rounded-lg',
														isDark
															? 'bg-slate-800/50'
															: 'bg-slate-50'
													)}
												>
													<div className="flex items-baseline gap-2 flex-wrap">
														<span className={cn(
															'font-semibold',
															isDark ? 'text-blue-300' : 'text-blue-700'
														)}>
															{item.word}
														</span>
														<span className={cn(
															'text-sm sm:text-base',
															isDark ? 'text-slate-300' : 'text-slate-600'
														)}>
															→ {item.translation}
														</span>
													</div>
													{item.example && (
														<p className={cn(
															'text-xs sm:text-sm mt-1 italic',
															isDark ? 'text-slate-500' : 'text-slate-400'
														)}>
															Ex: {item.example}
														</p>
													)}
												</div>
											))}
										</div>
									</div>
								)
							})}
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default DialogueBlock
