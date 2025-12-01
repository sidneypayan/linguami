'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useQueryClient } from '@tanstack/react-query'
import { useThemeMode } from '@/context/ThemeContext'
import { useUserContext } from '@/context/user'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { importLessonWordsAction } from '@/app/actions/words'
import toast from '@/utils/toast'
import {
	BookOpen,
	Check,
	CheckSquare,
	Square,
	Loader2,
	Sparkles,
	ArrowRight,
} from 'lucide-react'

/**
 * LessonVocabularyImport - Propose d'importer le vocabulaire de la leçon
 * Affiche la liste des mots avec possibilité de désélectionner
 */
const LessonVocabularyImport = ({ lesson, blocks, lessonLanguage, spokenLanguage, locale }) => {
	const t = useTranslations('common')
	const { isDark } = useThemeMode()
	const { isUserLoggedIn, userProfile } = useUserContext()
	const router = useRouter()
	const queryClient = useQueryClient()

	const [isImporting, setIsImporting] = useState(false)
	const [importDone, setImportDone] = useState(false)
	const [importResult, setImportResult] = useState(null)

	// Extraire tous les mots de vocabulaire des blocs
	const allWords = useMemo(() => {
		const words = []
		const seenWords = new Set()

		blocks?.forEach(block => {
			// Vocabulaire des blocs vocabulary
			if (block.type === 'vocabulary' && block.words) {
				block.words.forEach(w => {
					const key = w.word?.toLowerCase()
					if (key && !seenWords.has(key)) {
						seenWords.add(key)
						words.push({
							word: w.word,
							translation: w.translation,
							example: w.example || '',
						})
					}
				})
			}

			// Vocabulaire des dialogues
			if (block.type === 'dialogue' && block.lines) {
				block.lines.forEach(line => {
					line.vocab?.forEach(v => {
						const key = v.word?.toLowerCase()
						if (key && !seenWords.has(key)) {
							seenWords.add(key)
							words.push({
								word: v.word,
								translation: v.translation,
								example: line.text || '',
							})
						}
					})
				})
			}

			// Phrases clés du résumé
			if (block.type === 'summary' && block.keyPhrases) {
				block.keyPhrases.forEach(phrase => {
					const key = phrase.fr?.toLowerCase()
					if (key && !seenWords.has(key)) {
						seenWords.add(key)
						words.push({
							word: phrase.fr,
							translation: phrase.ru || phrase.context || '',
							example: phrase.context || '',
						})
					}
				})
			}
		})

		return words
	}, [blocks])

	// État des mots sélectionnés (tous sélectionnés par défaut)
	const [selectedWords, setSelectedWords] = useState(() =>
		new Set(allWords.map((_, index) => index))
	)

	const toggleWord = (index) => {
		setSelectedWords(prev => {
			const newSet = new Set(prev)
			if (newSet.has(index)) {
				newSet.delete(index)
			} else {
				newSet.add(index)
			}
			return newSet
		})
	}

	const toggleAll = () => {
		if (selectedWords.size === allWords.length) {
			setSelectedWords(new Set())
		} else {
			setSelectedWords(new Set(allWords.map((_, index) => index)))
		}
	}

	const handleImport = async () => {
		if (!isUserLoggedIn) {
			toast.error(t('methode_login_required'))
			router.push(`/${locale}/login`)
			return
		}

		const wordsToImport = allWords.filter((_, index) => selectedWords.has(index))

		if (wordsToImport.length === 0) {
			toast.error(t('methode_no_words_selected'))
			return
		}

		setIsImporting(true)

		try {
			const result = await importLessonWordsAction({
				words: wordsToImport,
				userLearningLanguage: lessonLanguage, // Langue de la leçon (ex: fr)
				locale: spokenLanguage, // Langue des traductions (ex: ru)
			})

			if (result.success) {
				setImportResult(result)
				setImportDone(true)
				if (result.importedCount > 0) {
					toast.success(t('methode_words_imported', { count: result.importedCount }))
					// Invalider le cache du dictionnaire pour que les mots apparaissent immédiatement
					queryClient.invalidateQueries({ queryKey: ['userWords'] })
				} else if (result.skippedCount > 0) {
					toast.info(t('methode_words_already_exist'))
				}
			} else {
				toast.error(result.error || t('methode_import_error'))
			}
		} catch (error) {
			toast.error(t('methode_import_error'))
		} finally {
			setIsImporting(false)
		}
	}

	if (allWords.length === 0) {
		return null
	}

	return (
		<div className={cn(
			'relative rounded-2xl border-2 overflow-hidden mt-6',
			isDark
				? 'bg-gradient-to-br from-emerald-950/50 via-slate-900 to-teal-950/30 border-emerald-500/30'
				: 'bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-emerald-200'
		)}>
			{/* Effet de brillance */}
			<div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />

			{/* Header */}
			<div className={cn(
				'relative p-4 sm:p-5 border-b',
				isDark ? 'border-emerald-500/20' : 'border-emerald-200'
			)}>
				<div className="flex items-center gap-3">
					<div className={cn(
						'w-12 h-12 rounded-xl flex items-center justify-center shadow-lg',
						'bg-gradient-to-br from-emerald-400 to-teal-500'
					)}>
						<BookOpen className="w-6 h-6 text-white" />
					</div>
					<div className="flex-1">
						<h3 className={cn(
							'text-lg font-bold',
							isDark ? 'text-emerald-300' : 'text-emerald-700'
						)}>
							{t('methode_import_vocabulary')}
						</h3>
						<p className={cn(
							'text-sm',
							isDark ? 'text-slate-400' : 'text-slate-600'
						)}>
							{t('methode_import_vocabulary_desc')}
						</p>
					</div>
					<Badge className={cn(
						'font-bold px-3 py-1',
						'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0'
					)}>
						{selectedWords.size} / {allWords.length}
					</Badge>
				</div>
			</div>

			{/* Content */}
			<div className="relative p-4 sm:p-5">
				{importDone ? (
					// Résultat de l'import
					<div className="text-center py-6">
						<div className={cn(
							'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4',
							'bg-gradient-to-br from-emerald-400 to-teal-500'
						)}>
							<Sparkles className="w-8 h-8 text-white" />
						</div>
						<h4 className={cn(
							'text-xl font-bold mb-2',
							isDark ? 'text-white' : 'text-slate-900'
						)}>
							{t('methode_import_complete')}
						</h4>
						<p className={cn(
							'text-sm mb-4',
							isDark ? 'text-slate-400' : 'text-slate-600'
						)}>
							{importResult?.importedCount > 0 && (
								<span className="text-emerald-500 font-semibold">
									{importResult.importedCount} {t('methode_words_added')}
								</span>
							)}
							{importResult?.skippedCount > 0 && (
								<span className={cn('ml-2', isDark ? 'text-slate-500' : 'text-slate-400')}>
									({importResult.skippedCount} {t('methode_already_in_deck')})
								</span>
							)}
						</p>
						<Button
							onClick={() => router.push(`/${locale}/dictionary`)}
							className={cn(
								'gap-2 font-bold',
								'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
							)}
						>
							{t('methode_go_to_dictionary')}
							<ArrowRight className="w-4 h-4" />
						</Button>
					</div>
				) : (
					<>
						{/* Toggle all */}
						<button
							onClick={toggleAll}
							className={cn(
								'flex items-center gap-2 mb-4 text-sm font-medium transition-colors',
								isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'
							)}
						>
							{selectedWords.size === allWords.length ? (
								<>
									<CheckSquare className="w-4 h-4" />
									{t('methode_deselect_all')}
								</>
							) : (
								<>
									<Square className="w-4 h-4" />
									{t('methode_select_all')}
								</>
							)}
						</button>

						{/* Liste des mots */}
						<div className="space-y-2">
							{allWords.map((word, index) => (
								<button
									key={index}
									onClick={() => toggleWord(index)}
									className={cn(
										'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all',
										selectedWords.has(index)
											? isDark
												? 'bg-emerald-500/20 ring-1 ring-emerald-500/30'
												: 'bg-emerald-50 ring-1 ring-emerald-200'
											: isDark
												? 'bg-slate-800/50 hover:bg-slate-800'
												: 'bg-white hover:bg-slate-50 shadow-sm'
									)}
								>
									<div className={cn(
										'w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors',
										selectedWords.has(index)
											? 'bg-emerald-500 text-white'
											: isDark
												? 'bg-slate-700 text-slate-500'
												: 'bg-slate-200 text-slate-400'
									)}>
										{selectedWords.has(index) && <Check className="w-3 h-3" />}
									</div>
									<div className="flex-1 min-w-0">
										<p className={cn(
											'font-semibold truncate',
											isDark ? 'text-white' : 'text-slate-900'
										)}>
											{word.word}
										</p>
										<p className={cn(
											'text-sm truncate',
											isDark ? 'text-slate-400' : 'text-slate-500'
										)}>
											{word.translation}
										</p>
									</div>
								</button>
							))}
						</div>

						{/* Bouton d'import */}
						<div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
							<Button
								onClick={handleImport}
								disabled={isImporting || selectedWords.size === 0}
								className={cn(
									'w-full gap-2 font-bold',
									selectedWords.size === 0
										? 'opacity-50 cursor-not-allowed'
										: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
								)}
							>
								{isImporting ? (
									<>
										<Loader2 className="w-4 h-4 animate-spin" />
										{t('methode_importing')}
									</>
								) : (
									<>
										<BookOpen className="w-4 h-4" />
										{t('methode_import_selected', { count: selectedWords.size })}
									</>
								)}
							</Button>
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default LessonVocabularyImport
