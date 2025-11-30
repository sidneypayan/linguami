'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUserContext } from '@/context/user'
import { useRouter } from 'next/navigation'
import { getUserWordsAction, deleteWordAction } from '@/app/actions/words'
import { useFlashcards } from '@/context/flashcards'
import { getGuestWordsByLanguage, deleteGuestWord } from '@/utils/guestDictionary'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import toast from '@/utils/toast'
import AddWordModal from '@/components/dictionary/AddWordModal'
import EditWordModal from '@/components/dictionary/EditWordModal'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { SessionConfigModal } from '@/components/flashcards/SessionConfigModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
	Search,
	Plus,
	Zap,
	Settings2,
	Trash2,
	Pencil,
	ChevronLeft,
	ChevronRight,
	BookOpen,
	Bookmark,
	ScrollText,
	Library,
	Scroll,
	Quote,
	ArrowRight,
	BookMarked,
	GraduationCap,
} from 'lucide-react'

// ============================================
// WORD CARD - Individual word display
// ============================================
const WordCard = ({ word, sourceWord, translation, onEdit, onDelete, isDark }) => {
	return (
		<Card className={cn(
			'group relative overflow-hidden',
			'transition-all duration-300',
			'hover:scale-[1.01] hover:-translate-y-1',
			isDark
				? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-violet-500/20'
				: 'bg-gradient-to-br from-white to-slate-50 border-violet-200/50',
			'shadow-lg hover:shadow-xl',
			isDark ? 'hover:shadow-violet-500/20' : 'hover:shadow-violet-300/30',
			'hover:border-violet-500/40'
		)}>
			{/* Left accent bar */}
			<div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 to-cyan-500" />

			<CardContent className="p-4 pl-5">
				{/* Word row */}
				<div className="flex items-center justify-between gap-3">
					<div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">
						{/* Source word badge */}
						<Badge variant="outline" className={cn(
							'px-3 py-1.5 rounded-lg font-bold text-sm sm:text-base',
							'bg-gradient-to-r from-violet-500/20 to-cyan-500/20',
							'border-violet-500/30 backdrop-blur-sm',
							isDark ? 'text-violet-300' : 'text-violet-600'
						)}>
							{sourceWord || '—'}
						</Badge>

						{/* Arrow */}
						<ArrowRight className={cn(
							'w-4 h-4 flex-shrink-0',
							isDark ? 'text-slate-500' : 'text-slate-400'
						)} />

						{/* Translation */}
						<span className={cn(
							'font-semibold text-sm sm:text-base',
							isDark ? 'text-slate-200' : 'text-slate-700'
						)}>
							{translation || '—'}
						</span>
					</div>

					{/* Action buttons */}
					<div className="flex gap-1 flex-shrink-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
						<Button
							variant="ghost"
							size="icon"
							onClick={onEdit}
							className={cn(
								'h-9 w-9 rounded-lg',
								'hover:bg-blue-500/20 hover:scale-110',
								isDark ? 'text-blue-400' : 'text-blue-500'
							)}
						>
							<Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={onDelete}
							className={cn(
								'h-9 w-9 rounded-lg',
								'hover:bg-red-500/20 hover:scale-110',
								isDark ? 'text-red-400' : 'text-red-500'
							)}
						>
							<Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
						</Button>
					</div>
				</div>

				{/* Context sentence */}
				{word.word_sentence && (
					<div className={cn(
						'mt-3 pl-3 py-2 rounded-r-lg',
						'border-l-2 border-violet-500/40',
						isDark ? 'bg-violet-500/5' : 'bg-violet-50/50'
					)}>
						<div className="flex items-start gap-2">
							<Quote className={cn(
								'w-4 h-4 flex-shrink-0 mt-0.5',
								isDark ? 'text-violet-400/60' : 'text-violet-400'
							)} />
							<p className={cn(
								'text-sm',
								isDark ? 'text-slate-400' : 'text-slate-500'
							)}>
								{word.word_sentence}
							</p>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

// ============================================
// PAGINATION
// ============================================
const Pagination = ({ currentPage, totalPages, onPageChange, isDark }) => {
	if (totalPages <= 1) return null

	const getVisiblePages = () => {
		const pages = []
		const delta = 2
		const start = Math.max(1, currentPage - delta)
		const end = Math.min(totalPages, currentPage + delta)

		if (start > 1) {
			pages.push(1)
			if (start > 2) pages.push('...')
		}

		for (let i = start; i <= end; i++) {
			pages.push(i)
		}

		if (end < totalPages) {
			if (end < totalPages - 1) pages.push('...')
			pages.push(totalPages)
		}

		return pages
	}

	return (
		<div className="flex items-center justify-center gap-2 py-8 mt-6">
			{/* Previous button */}
			<Button
				variant="outline"
				size="icon"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className={cn(
					'w-11 h-11 rounded-xl border-2',
					currentPage === 1
						? 'opacity-40 cursor-not-allowed'
						: 'hover:scale-110 hover:-translate-x-0.5',
					isDark
						? 'border-violet-500/30 bg-slate-800/80 text-violet-300'
						: 'border-violet-200 bg-white text-violet-600',
					currentPage !== 1 && (isDark
						? 'hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/20'
						: 'hover:border-violet-400 hover:shadow-lg hover:shadow-violet-300/30')
				)}
			>
				<ChevronLeft className="w-5 h-5" />
			</Button>

			{/* Page numbers */}
			<div className={cn(
				'flex items-center gap-1.5 px-3 py-1.5 rounded-xl',
				isDark ? 'bg-slate-800/50' : 'bg-slate-100/80',
				'border',
				isDark ? 'border-violet-500/20' : 'border-violet-200/50'
			)}>
				{getVisiblePages().map((page, index) => (
					page === '...' ? (
						<span
							key={`ellipsis-${index}`}
							className={cn(
								'w-8 text-center font-bold',
								isDark ? 'text-slate-500' : 'text-slate-400'
							)}
						>
							···
						</span>
					) : (
						<Button
							key={page}
							variant="ghost"
							size="sm"
							onClick={() => onPageChange(page)}
							className={cn(
								'w-10 h-10 rounded-lg font-bold p-0',
								page === currentPage
									? [
										'bg-gradient-to-br from-violet-500 to-cyan-500 text-white',
										'shadow-lg shadow-violet-500/40',
										'scale-110',
										'hover:from-violet-500 hover:to-cyan-500'
									]
									: [
										isDark ? 'text-slate-300' : 'text-slate-600',
										'hover:scale-105',
										isDark
											? 'hover:bg-violet-500/20 hover:text-violet-300'
											: 'hover:bg-violet-100 hover:text-violet-600'
									]
							)}
						>
							{page}
						</Button>
					)
				))}
			</div>

			{/* Next button */}
			<Button
				variant="outline"
				size="icon"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className={cn(
					'w-11 h-11 rounded-xl border-2',
					currentPage === totalPages
						? 'opacity-40 cursor-not-allowed'
						: 'hover:scale-110 hover:translate-x-0.5',
					isDark
						? 'border-violet-500/30 bg-slate-800/80 text-violet-300'
						: 'border-violet-200 bg-white text-violet-600',
					currentPage !== totalPages && (isDark
						? 'hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/20'
						: 'hover:border-violet-400 hover:shadow-lg hover:shadow-violet-300/30')
				)}
			>
				<ChevronRight className="w-5 h-5" />
			</Button>
		</div>
	)
}

// ============================================
// EMPTY STATE - Grimoire with no spells
// ============================================
const EmptyState = ({ translations, t, isDark, onAddWord }) => {
	const features = [
		{ icon: BookOpen, text: translations.feature_translate_materials },
		{ icon: Bookmark, text: translations.feature_save_words },
		{ icon: Zap, text: translations.feature_flashcards },
		{ icon: Plus, text: translations.feature_add_manually },
	]

	return (
		<div className={cn(
			'min-h-screen pt-24 md:pt-28 pb-24 px-4',
			isDark
				? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-950 via-slate-950 to-slate-950'
				: 'bg-gradient-to-b from-violet-50 via-white to-slate-50'
		)}>
			<div className="max-w-2xl mx-auto">
				{/* Empty grimoire card */}
				<Card className={cn(
					'relative overflow-hidden border-2',
					isDark
						? 'bg-gradient-to-br from-slate-900/95 via-violet-950/30 to-slate-900/95 border-violet-500/30'
						: 'bg-gradient-to-br from-white via-violet-50/30 to-white border-violet-200',
					'shadow-2xl',
					isDark ? 'shadow-violet-500/20' : 'shadow-violet-300/30'
				)}>
					<CardContent className="p-8 md:p-10">
						{/* Decorative corners */}
						<div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-violet-500/50 rounded-tl-lg" />
						<div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-violet-500/50 rounded-tr-lg" />
						<div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-violet-500/50 rounded-bl-lg" />
						<div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-violet-500/50 rounded-br-lg" />

						{/* Icon */}
						<div className="flex justify-center mb-6">
							<div className={cn(
								'w-20 h-20 rounded-2xl',
								'bg-gradient-to-br from-violet-500 to-cyan-500',
								'flex items-center justify-center',
								'shadow-xl shadow-violet-500/30'
							)}>
								<ScrollText className="w-10 h-10 text-white" />
							</div>
						</div>

						{/* Title */}
						<h1 className={cn(
							'text-2xl md:text-3xl font-black text-center mb-2',
							'bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent'
						)}>
							{translations.dictionary_empty_title}
						</h1>

						<p className={cn(
							'text-center text-base mb-8',
							isDark ? 'text-slate-400' : 'text-slate-500'
						)}>
							{t('nowords')}
						</p>

						{/* Features list */}
						<div className="space-y-3 mb-8">
							{features.map((feature, index) => (
								<div
									key={index}
									className={cn(
										'flex items-center gap-4 p-4 rounded-xl',
										'transition-all duration-300',
										'hover:translate-x-2',
										isDark
											? 'bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20'
											: 'bg-violet-50 hover:bg-violet-100 border border-violet-200/50'
									)}
								>
									<div className={cn(
										'w-11 h-11 rounded-xl flex items-center justify-center',
										'bg-gradient-to-br from-violet-500 to-cyan-500',
										'shadow-lg shadow-violet-500/30'
									)}>
										<feature.icon className="w-5 h-5 text-white" />
									</div>
									<span className={cn(
										'font-semibold text-base',
										isDark ? 'text-slate-200' : 'text-slate-700'
									)}>
										{feature.text}
									</span>
								</div>
							))}
						</div>

						{/* Action buttons */}
						<div className="flex flex-col sm:flex-row gap-3">
							<Link href="/materials" className="flex-1">
								<Button className={cn(
									'w-full px-5 py-6 rounded-xl font-bold text-white',
									'bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500',
									'shadow-lg shadow-violet-500/30 hover:shadow-xl',
									'transition-all duration-300 hover:-translate-y-0.5'
								)}>
									<GraduationCap className="w-5 h-5 mr-2" />
									{translations.start}
								</Button>
							</Link>
							<Button
								onClick={onAddWord}
								className={cn(
									'flex-1 px-5 py-6 rounded-xl font-bold text-white',
									'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500',
									'shadow-lg shadow-emerald-500/30 hover:shadow-xl',
									'transition-all duration-300 hover:-translate-y-0.5'
								)}
							>
								<Plus className="w-5 h-5 mr-2" />
								{translations.add_word_btn}
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

// ============================================
// MAIN COMPONENT
// ============================================
const DictionaryClient = ({ translations }) => {
	const t = useTranslations('words')
	const locale = useLocale()
	const { openFlashcards } = useFlashcards()
	const router = useRouter()
	const { isDark } = useThemeMode()
	const { user, isUserLoggedIn, isBootstrapping, userLearningLanguage } = useUserContext()
	const userId = user?.id
	const queryClient = useQueryClient()

	const [isAddWordModalOpen, setIsAddWordModalOpen] = useState(false)
	const [isEditWordModalOpen, setIsEditWordModalOpen] = useState(false)
	const [isSessionConfigOpen, setIsSessionConfigOpen] = useState(false)
	const [wordToEdit, setWordToEdit] = useState(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [wordsPerPage, setWordsPerPage] = useState(20)
	const [guestWords, setGuestWords] = useState([])
	const [searchQuery, setSearchQuery] = useState('')
	const [isMounted, setIsMounted] = useState(false)

	// React Query: Fetch user words
	const { data: user_words = [], isLoading: user_words_loading, isFetching: user_words_fetching } = useQuery({
		queryKey: ['userWords', userId, userLearningLanguage],
		queryFn: async () => {
			const result = await getUserWordsAction({ userId, userLearningLanguage })
			return result.success ? result.data : []
		},
		enabled: !!userId && !!userLearningLanguage && isUserLoggedIn && !isBootstrapping,
		staleTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	})

	// React Query: Delete word mutation
	const deleteWordMutation = useMutation({
		mutationFn: deleteWordAction,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['userWords', userId, userLearningLanguage] })
			toast.success(t('word_deleted') || 'Mot supprime')
		},
		onError: () => {
			toast.error(t('delete_error') || 'Erreur lors de la suppression')
		}
	})

	const handlePageChange = (value) => {
		setCurrentPage(value)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const handleWordsPerPageChange = (newValue) => {
		setWordsPerPage(newValue === 'all' ? filteredUserWords.length : newValue)
		setCurrentPage(1)
	}

	const handleDeleteWord = useCallback((wordId) => {
		if (isUserLoggedIn) {
			deleteWordMutation.mutate(wordId)
		} else {
			const success = deleteGuestWord(wordId)
			if (success) {
				const updatedWords = getGuestWordsByLanguage(userLearningLanguage)
				setGuestWords(updatedWords)
				toast.success('Mot supprime')
			} else {
				toast.error('Erreur lors de la suppression')
			}
		}
	}, [isUserLoggedIn, deleteWordMutation, userLearningLanguage])

	// Filter words
	const filteredUserWords = useMemo(() => {
		const wordsSource = isUserLoggedIn ? user_words : guestWords
		if (!wordsSource || !userLearningLanguage || !locale) return []
		if (userLearningLanguage === locale) return []

		const filtered = wordsSource.filter(word => {
			const sourceWord = word[`word_${userLearningLanguage}`]
			const translation = word[`word_${locale}`]
			if (!sourceWord || !translation) return false

			if (searchQuery.trim()) {
				const query = searchQuery.toLowerCase()
				return sourceWord.toLowerCase().includes(query) || translation.toLowerCase().includes(query)
			}
			return true
		})

		return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
	}, [user_words, guestWords, userLearningLanguage, locale, isUserLoggedIn, searchQuery])

	const getWordDisplay = (word) => ({
		sourceWord: word[`word_${userLearningLanguage}`],
		translation: word[`word_${locale}`]
	})

	// Pagination
	const indexOfLastWord = currentPage * wordsPerPage
	const indexOfFirstWord = indexOfLastWord - wordsPerPage
	const currentWords = wordsPerPage === filteredUserWords.length
		? filteredUserWords
		: filteredUserWords.slice(indexOfFirstWord, indexOfLastWord)
	const totalPages = Math.ceil(filteredUserWords.length / wordsPerPage)

	// Effects
	useEffect(() => {
		setIsMounted(true)
	}, [])

	useEffect(() => {
		if (isBootstrapping) return
		if (!isUserLoggedIn && userLearningLanguage) {
			const words = getGuestWordsByLanguage(userLearningLanguage)
			setGuestWords(words)
		}
	}, [isUserLoggedIn, isBootstrapping, userLearningLanguage])

	useEffect(() => {
		if (isUserLoggedIn || isBootstrapping) return
		const handleGuestDictionaryUpdate = () => {
			if (userLearningLanguage) {
				const words = getGuestWordsByLanguage(userLearningLanguage)
				setGuestWords(words)
			}
		}
		window.addEventListener('guestDictionaryUpdated', handleGuestDictionaryUpdate)
		return () => window.removeEventListener('guestDictionaryUpdated', handleGuestDictionaryUpdate)
	}, [isUserLoggedIn, isBootstrapping, userLearningLanguage])

	// Loading state
	if (!isMounted || isBootstrapping || (isUserLoggedIn && !userId) || user_words_loading || user_words_fetching) {
		return <LoadingSpinner />
	}

	// Empty state
	if (filteredUserWords.length === 0) {
		return (
			<>
				<EmptyState
					translations={translations}
					t={t}
					isDark={isDark}
					onAddWord={() => setIsAddWordModalOpen(true)}
				/>
				<AddWordModal
					open={isAddWordModalOpen}
					onClose={() => setIsAddWordModalOpen(false)}
				/>
			</>
		)
	}

	return (
		<div className={cn(
			'min-h-screen pt-24 md:pt-28 pb-24',
			isDark
				? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-950 via-slate-950 to-slate-950'
				: 'bg-gradient-to-b from-violet-50 via-white to-slate-50'
		)}>
			{/* Floating particles */}
			<div className="fixed inset-0 pointer-events-none overflow-hidden">
				<div className={cn('absolute top-32 left-10 w-2 h-2 rounded-full animate-pulse', isDark ? 'bg-violet-400/20' : 'bg-violet-300/40')} />
				<div className={cn('absolute top-48 right-20 w-1.5 h-1.5 rounded-full animate-pulse', isDark ? 'bg-cyan-400/20' : 'bg-cyan-300/40')} />
				<div className={cn('absolute bottom-48 left-1/4 w-1 h-1 rounded-full animate-pulse', isDark ? 'bg-amber-400/20' : 'bg-amber-300/40')} />
			</div>

			<div className="relative max-w-5xl mx-auto px-4">
				{/* Header Section */}
				<div className="flex items-center justify-center gap-5 mb-8">
					{/* Icon with magical glow */}
					<div className="relative">
						<div className={cn(
							'absolute inset-0 rounded-2xl blur-xl opacity-60',
							'bg-gradient-to-br from-violet-500 to-cyan-500'
						)} />
						<div className={cn(
							'relative w-14 h-14 rounded-2xl flex items-center justify-center',
							'bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-600',
							'shadow-lg shadow-violet-500/40',
							'border border-white/20'
						)}>
							<Scroll className="w-7 h-7 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
						</div>
					</div>
					{/* Title and subtitle */}
					<div>
						<h1 className={cn(
							'text-2xl md:text-3xl font-black tracking-wide',
							'bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent',
							'drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]'
						)}>
							Grimoire
						</h1>
						<p className={cn(
							'text-sm font-medium tracking-wide',
							isDark ? 'text-violet-300/70' : 'text-violet-500/70'
						)}>
							Ta collection de mots magiques
						</p>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="space-y-3 mb-8">
					<div className="flex gap-3">
						<Button
							onClick={() => openFlashcards()}
							className={cn(
								'flex-1 px-5 py-6 rounded-xl font-bold text-base text-white',
								'bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500',
								'shadow-lg shadow-violet-500/30 hover:shadow-xl',
								'transition-all duration-300 hover:-translate-y-0.5'
							)}
						>
							<Zap className="w-5 h-5 mr-2" />
							<span className="hidden sm:inline">{translations.repeatwords}</span>
							<span className="sm:hidden">{t('srs_review_short')}</span>
						</Button>
						<Button
							onClick={() => setIsSessionConfigOpen(true)}
							className={cn(
								'flex-1 px-5 py-6 rounded-xl font-bold text-base text-white',
								'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500',
								'shadow-lg shadow-amber-500/30 hover:shadow-xl',
								'transition-all duration-300 hover:-translate-y-0.5'
							)}
						>
							<Settings2 className="w-5 h-5 mr-2" />
							<span className="hidden sm:inline">{t('custom_session')}</span>
							<span className="sm:hidden">{t('custom_session_short')}</span>
						</Button>
					</div>
					<Button
						onClick={() => setIsAddWordModalOpen(true)}
						className={cn(
							'w-full px-5 py-6 rounded-xl font-bold text-base text-white',
							'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500',
							'shadow-lg shadow-emerald-500/30 hover:shadow-xl',
							'transition-all duration-300 hover:-translate-y-0.5'
						)}
					>
						<Plus className="w-5 h-5 mr-2" />
						{translations.add_word_btn}
					</Button>
				</div>

				{/* Controls Panel */}
				<Card className={cn(
					'relative overflow-hidden mb-6',
					isDark
						? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-violet-500/20'
						: 'bg-white border-violet-200/50',
					'shadow-xl',
					isDark ? 'shadow-violet-500/10' : 'shadow-violet-200/30'
				)}>
					{/* Top accent */}
					<div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 via-cyan-500 to-violet-500" />

					<CardContent className="p-4">
						<div className="flex flex-col gap-4">
							{/* Row 1: Search */}
							<div className="relative w-full">
								<Search className={cn(
									'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
									isDark ? 'text-violet-400' : 'text-violet-500'
								)} />
								<Input
									type="text"
									placeholder={translations.search_words}
									value={searchQuery}
									onChange={(e) => {
										setSearchQuery(e.target.value)
										setCurrentPage(1)
									}}
									className={cn(
										'pl-10 pr-4 py-2.5 rounded-xl h-11 text-sm',
										'border transition-all',
										isDark
											? 'bg-slate-900/50 border-violet-500/20 text-white placeholder:text-slate-500'
											: 'bg-slate-50 border-violet-200 text-slate-800 placeholder:text-slate-400',
										'focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500'
									)}
								/>
							</div>

							{/* Row 2: Words per page + Word count */}
							<div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
								{/* Words per page */}
								<div className={cn(
									'flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 sm:p-2 rounded-xl',
									isDark ? 'bg-slate-900/50' : 'bg-slate-50',
									'border',
									isDark ? 'border-violet-500/20' : 'border-violet-200/50'
								)}>
									<span className={cn(
										'text-xs sm:text-sm font-semibold uppercase tracking-wide',
										isDark ? 'text-violet-400' : 'text-violet-600'
									)}>
										{translations.words_per_page}
									</span>
									<div className="flex gap-1.5 p-1 rounded-lg bg-gradient-to-r from-violet-500/10 to-cyan-500/10">
										{[20, 50, 100, 'all'].map((value) => {
											const isActive = wordsPerPage === value || (value === 'all' && wordsPerPage === filteredUserWords.length)
											return (
												<Button
													key={value}
													variant="ghost"
													size="sm"
													onClick={() => handleWordsPerPageChange(value)}
													className={cn(
														'flex-1 sm:flex-none px-3 py-2 sm:py-1.5 rounded-md text-sm font-bold h-auto min-w-[44px]',
														isActive
															? [
																'bg-gradient-to-br from-violet-500 to-cyan-500 text-white',
																'shadow-md shadow-violet-500/40',
																'scale-105',
																'hover:from-violet-500 hover:to-cyan-500'
															]
															: [
																isDark ? 'text-slate-400' : 'text-slate-500',
																'hover:scale-105',
																isDark
																	? 'hover:text-violet-300 hover:bg-violet-500/20'
																	: 'hover:text-violet-600 hover:bg-violet-100'
															]
													)}
												>
													{value === 'all' ? translations.all : value}
												</Button>
											)
										})}
									</div>
								</div>

								{/* Word count badge */}
								<Badge className={cn(
									'px-4 py-2.5 rounded-xl text-sm self-center sm:self-auto',
									'bg-gradient-to-br from-violet-600 via-violet-500 to-cyan-500',
									'shadow-lg shadow-violet-500/40',
									'border border-white/20 text-white font-semibold'
								)}>
									<BookMarked className="w-4 h-4 mr-2 text-white/80" />
									{filteredUserWords.length} {filteredUserWords.length > 1 ? translations.words_total_plural : translations.words_total}
								</Badge>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Words List */}
				<div className="space-y-3">
					{currentWords.map((word, index) => {
						const { sourceWord, translation } = getWordDisplay(word)
						return (
							<WordCard
								key={word.id || index}
								word={word}
								sourceWord={sourceWord}
								translation={translation}
								onEdit={() => {
									setWordToEdit(word)
									setIsEditWordModalOpen(true)
								}}
								onDelete={() => handleDeleteWord(word.id)}
								isDark={isDark}
							/>
						)
					})}
				</div>

				{/* Pagination */}
				{wordsPerPage < filteredUserWords.length && (
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
						isDark={isDark}
					/>
				)}
			</div>

			{/* Modals */}
			<AddWordModal
				open={isAddWordModalOpen}
				onClose={() => setIsAddWordModalOpen(false)}
			/>
			<EditWordModal
				open={isEditWordModalOpen}
				onClose={() => {
					setIsEditWordModalOpen(false)
					setWordToEdit(null)
				}}
				word={wordToEdit}
			/>
			<SessionConfigModal
				open={isSessionConfigOpen}
				onClose={() => setIsSessionConfigOpen(false)}
				onStart={(options) => openFlashcards(options)}
				totalWords={filteredUserWords.length}
			/>
		</div>
	)
}

export default React.memo(DictionaryClient)
