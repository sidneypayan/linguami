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
			'relative rounded-2xl border-2 overflow-hidden',
			isDark
				? 'bg-gradient-to-br from-emerald-950/50 via-slate-900 to-teal-950/30 border-emerald-500/30'
				: 'bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-emerald-200'
		)}>
			{/* Effet de brillance */}
			<div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />

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
						{/* Toggle all + compteur */}
						<div className="flex items-center justify-between mb-3">
							<button
								onClick={toggleAll}
								className={cn(
									'flex items-center gap-2 text-sm font-medium transition-colors',
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
							<Badge className={cn(
								'font-bold px-2.5 py-0.5 text-xs',
								'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0'
							)}>
								{selectedWords.size} / {allWords.length}
							</Badge>
						</div>

						{/* Liste des mots - design moderne en chips */}
						<div className="flex flex-wrap gap-2">
							{allWords.map((word, index) => (
								<button
									key={index}
									onClick={() => toggleWord(index)}
									className={cn(
										'group relative flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full text-left transition-all duration-200',
										'border',
										selectedWords.has(index)
											? isDark
												? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
												: 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300 shadow-sm'
											: isDark
												? 'bg-slate-800/60 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
												: 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
									)}
								>
									{/* Checkbox animée */}
									<div className={cn(
										'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200',
										selectedWords.has(index)
											? 'bg-gradient-to-br from-emerald-400 to-teal-500 scale-100'
											: isDark
												? 'bg-slate-700 group-hover:bg-slate-600'
												: 'bg-slate-100 group-hover:bg-slate-200'
									)}>
										<Check className={cn(
											'w-3 h-3 transition-all duration-200',
											selectedWords.has(index)
												? 'text-white scale-100 opacity-100'
												: 'text-slate-400 scale-75 opacity-0'
										)} />
									</div>
									{/* Contenu */}
									<div className="flex flex-col leading-tight">
										<span className={cn(
											'font-semibold text-sm',
											selectedWords.has(index)
												? isDark ? 'text-emerald-300' : 'text-emerald-700'
												: isDark ? 'text-white' : 'text-slate-800'
										)}>
											{word.word}
										</span>
										<span className={cn(
											'text-xs',
											isDark ? 'text-slate-500' : 'text-slate-400'
										)}>
											{word.translation}
										</span>
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
