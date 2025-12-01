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
	Eye,
	EyeOff,
	MessageCircle,
	Gauge,
	Check,
	MapPin,
	HelpCircle,
} from 'lucide-react'

/**
 * ConversationBlock - Scene de conversation interactive
 * Style gaming/fantasy avec mini-jeu de questions
 */
const ConversationBlock = ({ block }) => {
	const t = useTranslations('common')
	const { isDark } = useThemeMode()
	const [revealedAnswers, setRevealedAnswers] = useState({})
	const [revealedDialogueLines, setRevealedDialogueLines] = useState({})
	const [isPlaying, setIsPlaying] = useState(false)
	const [currentLineIndex, setCurrentLineIndex] = useState(null)
	const [playbackRate, setPlaybackRate] = useState(1)
	const [showSpeedMenu, setShowSpeedMenu] = useState(false)

	const lineAudioRefs = useRef({})

	const { title, context, dialogue, questions } = block

	// Associer chaque ligne "..." avec sa question/réponse correspondante
	const getAnswerForLineIndex = (lineIndex) => {
		if (!dialogue || !questions) return null
		// Compter combien de lignes "..." il y a avant cette ligne
		let blankCount = 0
		for (let i = 0; i <= lineIndex; i++) {
			if (dialogue[i]?.text === '...') {
				if (i === lineIndex) {
					return questions[blankCount] || null
				}
				blankCount++
			}
		}
		return null
	}

	const toggleDialogueLine = (index) => {
		setRevealedDialogueLines((prev) => ({
			...prev,
			[index]: !prev[index],
		}))
	}

	const toggleAnswer = (index) => {
		setRevealedAnswers((prev) => ({
			...prev,
			[index]: !prev[index],
		}))
	}

	const handlePlayAll = () => {
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

	const playNextLine = (index) => {
		if (!dialogue || index >= dialogue.length) {
			setIsPlaying(false)
			setCurrentLineIndex(null)
			return
		}

		const line = dialogue[index]
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

	const handlePlayLine = (index, url) => {
		if (!url) return

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

		lineAudioRefs.current[index].onended = () => {
			setCurrentLineIndex(null)
		}

		lineAudioRefs.current[index].playbackRate = playbackRate
		lineAudioRefs.current[index].play()
	}

	const handleSpeedChange = (speed) => {
		setPlaybackRate(speed)
		setShowSpeedMenu(false)

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

	useEffect(() => {
		return () => {
			Object.values(lineAudioRefs.current).forEach((audio) => {
				if (audio) audio.pause()
			})
		}
	}, [])

	const hasAudio = dialogue?.some((line) => line.audioUrl)

	return (
		<div className={cn(
			'relative rounded-lg sm:rounded-2xl border sm:border-2 overflow-hidden',
			isDark
				? 'bg-gradient-to-br from-orange-950/50 via-slate-900 to-red-950/30 border-orange-500/30'
				: 'bg-gradient-to-br from-orange-50 via-white to-amber-50 border-orange-200'
		)}>
			{/* Effet de brillance */}
			<div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />

			{/* Header - contrôles audio uniquement */}
			{hasAudio && (
				<div className={cn(
					'relative p-4 sm:p-5 border-b flex items-center gap-2',
					isDark ? 'border-orange-500/20' : 'border-orange-200'
				)}>
					{/* Menu vitesse */}
					<div className="relative">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowSpeedMenu(!showSpeedMenu)}
							className={cn(
								'gap-1 border-2',
								isDark
									? 'border-orange-500/30 text-orange-300 hover:bg-orange-500/10'
									: 'border-orange-300 text-orange-700 hover:bg-orange-50'
							)}
						>
							<Gauge className="w-4 h-4" />
							{playbackRate}x
						</Button>

						{showSpeedMenu && (
							<div className={cn(
								'absolute left-0 top-full mt-1 py-1 rounded-lg border shadow-xl z-20 min-w-[100px]',
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
													? 'bg-orange-500/20 text-orange-300'
													: 'bg-orange-50 text-orange-700'
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
						onClick={handlePlayAll}
						className={cn(
							'gap-2 font-semibold shadow-lg',
							'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
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

			<div className="relative p-4 sm:p-5 space-y-4">
				{/* Contexte */}
				{context && (
					<div className={cn(
						'p-3 rounded-xl flex items-start gap-2',
						isDark
							? 'bg-orange-500/10 text-orange-200'
							: 'bg-orange-100 text-orange-800'
					)}>
						<MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
						<p className="text-sm sm:text-base italic">{context}</p>
					</div>
				)}

				{/* Dialogue */}
				{dialogue && dialogue.length > 0 && (
					<div className="space-y-2">
						{dialogue.map((line, index) => {
							const isBlankLine = line.text === '...'
							const answer = isBlankLine ? getAnswerForLineIndex(index) : null
							const isRevealed = revealedDialogueLines[index]

							return (
								<div
									key={index}
									onClick={isBlankLine ? () => toggleDialogueLine(index) : undefined}
									className={cn(
										'p-3 rounded-xl transition-all duration-300',
										isBlankLine && 'cursor-pointer',
										currentLineIndex === index
											? isDark
												? 'bg-orange-500/20 ring-2 ring-orange-500/50'
												: 'bg-orange-100 ring-2 ring-orange-300'
											: isBlankLine
												? isRevealed
													? isDark
														? 'bg-emerald-500/20 ring-2 ring-emerald-500/30'
														: 'bg-emerald-50 ring-2 ring-emerald-200'
													: isDark
														? 'bg-orange-500/10 hover:bg-orange-500/20 border-2 border-dashed border-orange-500/30'
														: 'bg-orange-50 hover:bg-orange-100 border-2 border-dashed border-orange-300'
												: isDark
													? 'bg-slate-800/50'
													: 'bg-white shadow-sm'
									)}
								>
									<div className="flex items-center gap-2 mb-1">
										<span className={cn(
											'font-bold text-sm',
											isDark ? 'text-orange-400' : 'text-orange-600'
										)}>
											{line.speaker}
										</span>
										{line.audioUrl && (
											<button
												onClick={(e) => {
													e.stopPropagation()
													handlePlayLine(index, line.audioUrl)
												}}
												className={cn(
													'p-1 rounded-full transition-colors',
													isDark
														? 'hover:bg-orange-500/20 text-orange-400'
														: 'hover:bg-orange-100 text-orange-600'
												)}
											>
												<Volume2 className="w-4 h-4" />
											</button>
										)}
										{isBlankLine && (
											<span className={cn(
												'ml-auto text-xs flex items-center gap-1',
												isDark ? 'text-orange-400' : 'text-orange-600'
											)}>
												{isRevealed ? (
													<>
														<EyeOff className="w-3 h-3" />
														{t('methode_hide')}
													</>
												) : (
													<>
														<Eye className="w-3 h-3" />
														{t('methode_reveal')}
													</>
												)}
											</span>
										)}
									</div>
									{isBlankLine && isRevealed && answer ? (
										<p className={cn(
											'text-sm font-medium',
											isDark ? 'text-emerald-400' : 'text-emerald-600'
										)}>
											{answer.answer}
										</p>
									) : (
										<p className={cn(
											'text-sm',
											isDark ? 'text-slate-300' : 'text-slate-700',
											isBlankLine && 'italic'
										)}>
											{line.text}
										</p>
									)}
								</div>
							)
						})}
					</div>
				)}

				{/* Questions */}
				{questions && questions.length > 0 && (
					<div className={cn(
						'p-4 rounded-xl border-l-4',
						isDark
							? 'bg-orange-500/10 border-orange-500'
							: 'bg-orange-50 border-orange-400'
					)}>
						<div className="flex items-center gap-2 mb-3">
							<HelpCircle className={cn(
								'w-5 h-5',
								isDark ? 'text-orange-400' : 'text-orange-600'
							)} />
							<h4 className={cn(
								'font-bold',
								isDark ? 'text-orange-300' : 'text-orange-700'
							)}>
								{questions.length > 1 ? t('methode_questions') : t('methode_question')}
							</h4>
						</div>

						<div className="space-y-3">
							{questions.map((q, index) => (
								<div key={index} className="space-y-1">
									<div className="flex items-start gap-2 flex-wrap">
										<p className={cn(
											'font-medium flex-1',
											isDark ? 'text-slate-200' : 'text-slate-800'
										)}>
											{q.question}
										</p>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => toggleAnswer(index)}
											className={cn(
												'gap-1 flex-shrink-0',
												isDark
													? 'text-orange-400 hover:bg-orange-500/20'
													: 'text-orange-600 hover:bg-orange-100'
											)}
										>
											{revealedAnswers[index] ? (
												<>
													<EyeOff className="w-4 h-4" />
													{t('methode_hide')}
												</>
											) : (
												<>
													<Eye className="w-4 h-4" />
													{t('methode_see')}
												</>
											)}
										</Button>
									</div>
									{revealedAnswers[index] && (
										<Badge className={cn(
											'font-medium',
											'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
										)}>
											→ {q.answer}
										</Badge>
									)}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default ConversationBlock
