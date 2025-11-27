'use client'

import React from 'react'
import { useTranslations, useLocale } from 'next-intl'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useState, use, useMemo, useRef } from 'react'
import { useRouterCompat } from '@/hooks/shared/useRouterCompat'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
	addBeingStudiedMaterial,
	removeBeingStudiedMaterial,
	addMaterialToStudied,
	saveReadingProgress,
	markPageAsCompleted,
} from '@/app/actions/materials'
import { useTranslation } from '@/context/translation'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import ChapterBreadcrumb from '@/components/material/ChapterBreadcrumb'
import ChapterNavigation from '@/components/material/ChapterNavigation'
import Translation from '@/components/material/Translation'
import Words from '@/components/material/Words'
import WordsContainer from '@/components/material/WordsContainer'
import VideoPlayer from '@/components/material/VideoPlayer'
import EditMaterialModal from '@/components/admin/EditMaterialModal'
import ExerciseSection from '@/components/exercises/ExerciseSection'
import ReportButton from '@/components/material/ReportButton'
import { useUserContext } from '@/context/user'
import { sections } from '@/data/sections'

import Player from '@/components/shared/Player'
import CelebrationOverlay, { triggerCelebration } from '@/components/shared/CelebrationOverlay'
import ContentPagination from '@/components/material/ContentPagination'
import { usePaginatedContent } from '@/hooks/materials/usePaginatedContent'
import { getAudioUrl, getMaterialImageUrl } from '@/utils/mediaUrls'

import {
	ArrowLeft,
	Play,
	Pause,
	Eye,
	EyeOff,
	Edit3,
	CheckCircle2,
	BookOpen,
	X,
	Sparkles,
	Star,
	Sword,
	Shield,
	Crown,
	Gem,
	Flame,
	Trophy,
	Scroll,
	Wand2,
} from 'lucide-react'

// ============================================
// DECORATIVE CORNER ORNAMENT
// ============================================
const CornerOrnament = ({ position, isDark }) => {
	const positionClasses = {
		'top-left': 'top-0 left-0 rotate-0',
		'top-right': 'top-0 right-0 rotate-90',
		'bottom-left': 'bottom-0 left-0 -rotate-90',
		'bottom-right': 'bottom-0 right-0 rotate-180',
	}

	return (
		<div className={cn('absolute w-6 h-6 pointer-events-none', positionClasses[position])}>
			<svg viewBox="0 0 32 32" className={cn('w-full h-full', isDark ? 'text-amber-500/30' : 'text-amber-600/20')}>
				<path d="M0 0 L12 0 L12 2 L2 2 L2 12 L0 12 Z" fill="currentColor" />
				<path d="M6 0 L8 0 L8 6 L6 6 Z M0 6 L6 6 L6 8 L0 8 Z" fill="currentColor" opacity="0.5" />
			</svg>
		</div>
	)
}

// ============================================
// ORNATE FRAME
// ============================================
const OrnateFrame = ({ children, className, isDark, glowColor = 'violet' }) => {
	const glowColors = {
		violet: isDark ? 'shadow-violet-500/20' : 'shadow-violet-300/30',
		amber: isDark ? 'shadow-amber-500/20' : 'shadow-amber-300/30',
		cyan: isDark ? 'shadow-cyan-500/20' : 'shadow-cyan-300/30',
		emerald: isDark ? 'shadow-emerald-500/20' : 'shadow-emerald-300/30',
	}

	const borderColors = {
		violet: isDark ? 'border-violet-500/30' : 'border-violet-300/50',
		amber: isDark ? 'border-amber-500/30' : 'border-amber-300/50',
		cyan: isDark ? 'border-cyan-500/30' : 'border-cyan-300/50',
		emerald: isDark ? 'border-emerald-500/30' : 'border-emerald-300/50',
	}

	return (
		<div className={cn(
			'relative rounded-2xl overflow-hidden',
			'border-2',
			borderColors[glowColor],
			'shadow-xl',
			glowColors[glowColor],
			className
		)}>
			{/* Corner ornaments */}
			<CornerOrnament position="top-left" isDark={isDark} />
			<CornerOrnament position="top-right" isDark={isDark} />
			<CornerOrnament position="bottom-left" isDark={isDark} />
			<CornerOrnament position="bottom-right" isDark={isDark} />

			{/* Top decorative bar */}
			<div className="absolute top-0 left-6 right-6 h-0.5">
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
			</div>

			{/* Bottom decorative bar */}
			<div className="absolute bottom-0 left-6 right-6 h-0.5">
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
			</div>

			{/* Inner glow border */}
			<div className={cn(
				'absolute inset-[2px] rounded-xl pointer-events-none',
				'border',
				isDark ? 'border-white/5' : 'border-white/50'
			)} />

			{children}
		</div>
	)
}

// ============================================
// MAGICAL PARTICLES BACKGROUND
// ============================================
const MagicalParticles = ({ isDark }) => (
	<div className="fixed inset-0 pointer-events-none overflow-hidden">
		{/* Floating orbs */}
		<div className={cn(
			'absolute top-32 left-10 w-3 h-3 rounded-full animate-pulse',
			isDark ? 'bg-violet-400/20' : 'bg-violet-300/40'
		)} style={{ animationDuration: '3s' }} />
		<div className={cn(
			'absolute top-48 right-20 w-2 h-2 rounded-full animate-pulse',
			isDark ? 'bg-cyan-400/20' : 'bg-cyan-300/40'
		)} style={{ animationDuration: '4s' }} />
		<div className={cn(
			'absolute top-64 left-1/4 w-2.5 h-2.5 rounded-full animate-pulse',
			isDark ? 'bg-amber-400/20' : 'bg-amber-300/40'
		)} style={{ animationDuration: '2.5s' }} />
		<div className={cn(
			'absolute bottom-48 right-1/4 w-2 h-2 rounded-full animate-pulse',
			isDark ? 'bg-emerald-400/20' : 'bg-emerald-300/40'
		)} style={{ animationDuration: '3.5s' }} />

		{/* Sparkle effects */}
		<div className={cn(
			'absolute top-40 right-1/3 w-1 h-1 rounded-full animate-ping',
			isDark ? 'bg-white/10' : 'bg-violet-400/30'
		)} style={{ animationDuration: '2s' }} />

		{/* Ambient glows */}
		<div className={cn(
			'absolute -top-20 -left-20 w-96 h-96 rounded-full blur-3xl',
			isDark ? 'bg-violet-900/20' : 'bg-violet-200/30'
		)} />
		<div className={cn(
			'absolute -bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl',
			isDark ? 'bg-cyan-900/20' : 'bg-cyan-200/30'
		)} />
	</div>
)

// ============================================
// EPIC HEADER FOR REGULAR MATERIALS
// ============================================
const EpicHeader = ({ isDark, title, onBack }) => {
	return (
		<div className={cn(
			'pt-8 md:pt-24 pb-4 md:pb-6',
			'border-b',
			isDark ? 'border-violet-500/20 bg-slate-950' : 'border-violet-200/50 bg-white'
		)}>
			<div className="max-w-6xl mx-auto px-4">
				<div className="flex items-center gap-4 md:gap-6">
					{/* Back button with shield style */}
					<button
						onClick={onBack}
						className={cn(
							'group relative w-12 h-12 md:w-14 md:h-14',
							'flex items-center justify-center',
							'transition-all duration-300',
							'hover:scale-110'
						)}
					>
						{/* Shield background */}
						<div className={cn(
							'absolute inset-0 rounded-xl rotate-45',
							'bg-gradient-to-br',
							isDark
								? 'from-slate-700 to-slate-800 border-2 border-violet-500/30'
								: 'from-white to-slate-100 border-2 border-violet-300/50',
							'shadow-lg',
							isDark ? 'shadow-violet-500/20' : 'shadow-violet-300/30',
							'group-hover:border-violet-400 transition-colors'
						)} />
						<ArrowLeft className={cn(
							'relative z-10 w-5 h-5 md:w-6 md:h-6',
							isDark ? 'text-violet-400' : 'text-violet-600',
							'group-hover:text-violet-500 transition-colors',
							'group-hover:-translate-x-1 transition-transform'
						)} />
						{/* Glow on hover */}
						<div className={cn(
							'absolute inset-0 rounded-xl rotate-45',
							'bg-gradient-to-br from-violet-500/0 to-cyan-500/0',
							'group-hover:from-violet-500/20 group-hover:to-cyan-500/20',
							'transition-all duration-300'
						)} />
					</button>

					{/* Title with decorations */}
					<div className="relative flex-1">
						{/* Crown decoration */}
						<div className="absolute -top-2 left-0 flex items-center gap-1">
							<Scroll className={cn('w-4 h-4', isDark ? 'text-amber-400/60' : 'text-amber-500/50')} />
							<div className={cn('w-12 h-0.5 bg-gradient-to-r from-amber-500/50 to-transparent')} />
						</div>

						<h1 className={cn(
							'text-xl sm:text-2xl md:text-3xl font-black',
							'bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent',
							'[text-shadow:0_4px_12px_rgba(139,92,246,0.3)]'
						)}>
							{title}
						</h1>

						{/* Decorative underline */}
						<div className="mt-1 flex items-center gap-2">
							<div className={cn('flex-1 h-0.5 bg-gradient-to-r from-violet-500 to-transparent max-w-32')} />
							<Gem className={cn('w-3 h-3', isDark ? 'text-cyan-400' : 'text-cyan-500')} />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

// ============================================
// ACTION BUTTON COMPONENT - Gaming Style
// ============================================
const ActionButton = ({ onClick, variant = 'primary', icon: Icon, children, className }) => {
	const { isDark } = useThemeMode()

	const variants = {
		primary: {
			base: cn(
				'bg-gradient-to-br from-violet-500 to-cyan-500 text-white',
				'border-2 border-violet-400/30',
				'shadow-lg shadow-violet-500/30',
				'hover:shadow-xl hover:shadow-violet-500/40 hover:-translate-y-0.5'
			),
			icon: Wand2,
		},
		warning: {
			base: cn(
				'bg-gradient-to-br from-amber-500 to-orange-600 text-white',
				'border-2 border-amber-400/30',
				'shadow-lg shadow-amber-500/30',
				'hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5'
			),
			icon: Flame,
		},
		outline: {
			base: cn(
				isDark
					? 'bg-slate-800/50 border-2 border-violet-500/30 text-violet-400'
					: 'bg-white border-2 border-violet-200 text-violet-600',
				'hover:bg-violet-500/10 hover:-translate-y-0.5'
			),
			icon: Shield,
		},
		success: {
			base: cn(
				'bg-gradient-to-br from-emerald-500 to-teal-600 text-white',
				'border-2 border-emerald-400/30',
				'shadow-lg shadow-emerald-500/30',
				'hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5'
			),
			icon: Trophy,
		},
	}

	return (
		<button
			onClick={onClick}
			className={cn(
				'relative group px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl',
				'font-semibold text-sm sm:text-base',
				'flex items-center gap-2',
				'transition-all duration-300',
				'overflow-hidden',
				variants[variant].base,
				className
			)}
		>
			{/* Shine effect on hover */}
			<div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

			{Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />}
			<span className="relative z-10">{children}</span>
		</button>
	)
}

// ============================================
// FINISH BUTTON COMPONENT - Gaming Style
// ============================================
const FinishButton = ({ isCompleted, onClick, disabled, children, isDark }) => {
	return (
		<OrnateFrame
			isDark={isDark}
			glowColor={isCompleted ? 'emerald' : 'violet'}
			className={cn(
				'inline-block',
				disabled && !isCompleted && 'opacity-50'
			)}
		>
			<button
				onClick={onClick}
				disabled={disabled}
				className={cn(
					'relative group px-8 sm:px-12 py-4 sm:py-5',
					'font-bold text-base sm:text-lg',
					'flex items-center justify-center gap-3',
					'transition-all duration-500',
					disabled && !isCompleted && 'cursor-not-allowed',
					isCompleted
						? [
							'bg-gradient-to-br from-emerald-500 to-teal-600 text-white',
							'cursor-default'
						]
						: [
							isDark
								? 'bg-slate-800/80 text-emerald-400'
								: 'bg-white text-emerald-600',
							!disabled && 'hover:bg-emerald-500/10'
						]
				)}
			>
				{/* Magical particles when completed */}
				{isCompleted && (
					<>
						<Star className="absolute -top-2 -left-2 w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
						<Star className="absolute -top-2 -right-2 w-3 h-3 text-amber-300 fill-amber-300 animate-pulse" style={{ animationDelay: '0.3s' }} />
						<Star className="absolute -bottom-1 left-1/4 w-3 h-3 text-amber-300 fill-amber-300 animate-pulse" style={{ animationDelay: '0.6s' }} />
					</>
				)}

				{/* Trophy icon when completed */}
				{isCompleted ? (
					<Trophy className="w-6 h-6 sm:w-7 sm:h-7" />
				) : (
					<CheckCircle2 className={cn(
						'w-5 h-5 sm:w-6 sm:h-6',
						isDark ? 'text-emerald-400/50' : 'text-emerald-500/50'
					)} />
				)}

				<span>{children}</span>

				{/* Shine effect */}
				{!isCompleted && !disabled && (
					<div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
				)}
			</button>
		</OrnateFrame>
	)
}

// ============================================
// FLOATING ACTION BUTTON - Gaming Style
// ============================================
const FloatingActionButton = ({ onClick, icon: Icon, variant = 'primary', position, isVideoDisplayed }) => {
	const { isDark } = useThemeMode()

	const variants = {
		primary: cn(
			'bg-gradient-to-br from-violet-500 to-cyan-500',
			'shadow-lg shadow-violet-500/40',
			'hover:shadow-xl hover:shadow-violet-500/50'
		),
		danger: cn(
			'bg-gradient-to-br from-rose-500 to-pink-600',
			'shadow-lg shadow-rose-500/40',
			'hover:shadow-xl hover:shadow-rose-500/50'
		),
	}

	return (
		<button
			className={cn(
				'lg:hidden fixed z-50',
				'right-4',
				isVideoDisplayed ? 'bottom-24' : 'bottom-52',
				'group relative w-14 h-14',
				'flex items-center justify-center',
				'transition-all duration-300',
				'hover:scale-110',
				variant === 'danger' && 'hover:rotate-90'
			)}
			onClick={onClick}
		>
			{/* Rotated background */}
			<div className={cn(
				'absolute inset-0 rounded-xl rotate-45',
				variants[variant],
				'transition-all duration-300'
			)} />

			{/* Decorative ring */}
			<div className={cn(
				'absolute inset-[-3px] rounded-xl rotate-45',
				'border-2',
				variant === 'primary'
					? 'border-cyan-400/30'
					: 'border-rose-400/30'
			)} />

			{/* Icon */}
			<Icon className="w-6 h-6 text-white relative z-10" />

			{/* Sparkle */}
			<Sparkles className={cn(
				'absolute -top-1 -right-1 w-4 h-4 text-amber-300 animate-pulse',
				'opacity-0 group-hover:opacity-100 transition-opacity'
			)} />
		</button>
	)
}

// ============================================
// MAIN COMPONENT
// ============================================
const Material = ({
	params: paramsPromise,
	initialMaterial,
	initialUserMaterialStatus,
	initialUserMaterialsStatus = [],
	book = null,
	previousChapter = null,
	nextChapter = null,
}) => {
	const params = use(paramsPromise)
	const t = useTranslations('materials')
	const locale = useLocale()
	const { closeTranslation, cleanTranslation } = useTranslation()
	const router = useRouterCompat()
	const { isDark } = useThemeMode()
	const { user, isUserAdmin, userLearningLanguage, isUserLoggedIn } = useUserContext()
	const queryClient = useQueryClient()

	// Local UI state
	const [showAccents, setShowAccents] = useState(false)
	const [showWordsContainer, setShowWordsContainer] = useState(false)
	const [editModalOpen, setEditModalOpen] = useState(false)

	// Check if this is a book chapter
	const isBookChapter = initialMaterial?.book_id != null

	// Helper function to decode base64 UTF-8
	const decodeBase64UTF8 = (base64String) => {
		if (!base64String) return null
		const binaryString = atob(base64String)
		const bytes = new Uint8Array(binaryString.length)
		for (let i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i)
		}
		return new TextDecoder('utf-8').decode(bytes)
	}

	// Decode base64-encoded text fields
	const decodedMaterial = initialMaterial && initialMaterial._encoded ? {
		...initialMaterial,
		content: decodeBase64UTF8(initialMaterial.content),
		content_accented: decodeBase64UTF8(initialMaterial.content_accented),
	} : initialMaterial

	// React Query: Hydrate material data
	const { data: currentMaterial } = useQuery({
		queryKey: ['material', params?.material],
		queryFn: () => decodedMaterial,
		initialData: decodedMaterial,
		staleTime: Infinity,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		enabled: false,
	})

	// Local state for material status
	const [localMaterialStatus, setLocalMaterialStatus] = useState(initialUserMaterialStatus)

	// Reset local state when navigating to a different material
	useEffect(() => {
		setLocalMaterialStatus(initialUserMaterialStatus)
	}, [params?.material, initialUserMaterialStatus])

	const { is_being_studied, is_studied, reading_page, completed_pages = [] } = localMaterialStatus || { is_being_studied: false, is_studied: false, reading_page: 1, completed_pages: [] }

	// Pagination
	const contentForPagination = showAccents
		? currentMaterial?.content_accented
		: currentMaterial?.content

	const savedPage = initialUserMaterialStatus?.reading_page || 1

	const {
		paginatedContent,
		currentPage,
		totalPages,
		isPaginated,
		nextPage,
		prevPage,
		goToFirst,
		goToLast,
		hasNextPage,
		hasPrevPage,
	} = usePaginatedContent(
		contentForPagination,
		2000,
		savedPage
	)

	// Auto-save reading progress
	useEffect(() => {
		if (!isPaginated || !isUserLoggedIn || !currentMaterial?.id) return
		if (currentPage === savedPage) return

		const timeoutId = setTimeout(() => {
			saveReadingProgress(currentMaterial.id, currentPage)
		}, 500)

		return () => clearTimeout(timeoutId)
	}, [currentPage, isPaginated, isUserLoggedIn, currentMaterial?.id, savedPage])

	// Get finish button text
	const getFinishButtonText = () => {
		if (!isBookChapter) {
			return t('finish_material')
		}
		const isLastPageOfContent = !isPaginated || !hasNextPage
		if (isLastPageOfContent) {
			if (!nextChapter) {
				return t('finish_book')
			}
			return t('finish_chapter')
		}
		return t('finish_page')
	}

	// Get completed badge text
	const getCompletedBadgeText = () => {
		if (!isBookChapter) {
			return t('material_completed')
		}
		const isLastPageOfContent = !isPaginated || !hasNextPage
		if (!nextChapter && isLastPageOfContent) {
			return t('book_completed')
		}
		return t('page_read')
	}

	// Mutations
	const addToStudyingMutation = useMutation({
		mutationFn: addBeingStudiedMaterial,
		onSuccess: () => {
			setLocalMaterialStatus(prev => ({
				...prev,
				is_being_studied: true,
				is_studied: false,
			}))
			queryClient.invalidateQueries({ queryKey: ['userMaterials'] })
		},
	})

	const removeFromStudyingMutation = useMutation({
		mutationFn: removeBeingStudiedMaterial,
		onSuccess: () => {
			setLocalMaterialStatus(prev => ({
				...prev,
				is_being_studied: false,
				is_studied: false,
			}))
			queryClient.invalidateQueries({ queryKey: ['userMaterials'] })
		},
	})

	const markPageCompletedMutation = useMutation({
		mutationFn: ({ materialId, pageNumber, totalPagesCount, isLastChapter }) =>
			markPageAsCompleted(materialId, pageNumber, totalPagesCount, isLastChapter),
		onSuccess: (result) => {
			if (result.success) {
				setLocalMaterialStatus(prev => ({
					...prev,
					completed_pages: result.completedPages,
					is_studied: result.allPagesCompleted,
					is_being_studied: !result.allPagesCompleted,
				}))
				queryClient.invalidateQueries({ queryKey: ['userMaterials'] })
				let celebrationType = 'page'
				if (result.allPagesCompleted) {
					celebrationType = isBookChapter ? (!nextChapter ? 'book' : 'page') : 'material'
				}
				triggerCelebration({ type: celebrationType, xpGained: result.xpGained || 0, goldGained: result.goldGained || 0 })
			}
		},
	})

	const markAsStudiedMutation = useMutation({
		mutationFn: addMaterialToStudied,
		onSuccess: (result) => {
			setLocalMaterialStatus(prev => ({
				...prev,
				is_being_studied: false,
				is_studied: true,
			}))
			queryClient.invalidateQueries({ queryKey: ['userMaterials'] })
			let celebrationType = 'material'
			if (isBookChapter) {
				celebrationType = !nextChapter ? 'book' : 'page'
			}
			triggerCelebration({ type: celebrationType, xpGained: result?.xpGained || 0, goldGained: result?.goldGained || 0 })
		},
	})

	const handleEditContent = () => {
		setEditModalOpen(true)
	}

	const handleEditSuccess = () => {
		queryClient.invalidateQueries(['material', params?.material])
	}

	const getImageRegardingSection = section => {
		if (section === 'place') {
			return (
				<div className="max-w-xl mx-auto mb-12">
					<OrnateFrame isDark={isDark} glowColor="amber" className="overflow-hidden">
						<div className="relative w-full h-56">
							<Image
								src={getMaterialImageUrl(currentMaterial)}
								alt={currentMaterial.title}
								fill
								sizes="(max-width: 600px) 100vw, 600px"
								style={{ objectFit: 'cover' }}
								quality={85}
								priority={false}
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
						</div>
					</OrnateFrame>
				</div>
			)
		}
	}

	const displayAudioPlayer = (section) => {
		if (sections?.audio?.includes(section)) {
			return <Player src={getAudioUrl(currentMaterial)} />
		}
	}

	const displayVideo = section => {
		if (sections?.music?.includes(section) || sections?.video?.includes(section)) {
			return (
				<div className="sticky top-0 sm:top-24 z-50 mt-4 sm:mt-0 mb-2">
					<VideoPlayer videoUrl={currentMaterial.video_url} />
				</div>
			)
		}
	}

	const isVideoDisplayed =
		sections?.music?.includes(params?.section) || sections?.video?.includes(params?.section)

	if (!currentMaterial) {
		return (
			<div className={cn(
				'min-h-screen flex items-center justify-center',
				isDark ? 'bg-slate-950' : 'bg-slate-50'
			)}>
				<div className="flex flex-col items-center gap-4">
					<div className={cn(
						'w-16 h-16 rounded-2xl rotate-45',
						'bg-gradient-to-br from-violet-500/20 to-cyan-500/20',
						'flex items-center justify-center',
						'animate-pulse'
					)}>
						<Scroll className={cn('w-8 h-8 -rotate-45', isDark ? 'text-violet-400' : 'text-violet-500')} />
					</div>
					<div className="text-lg font-semibold text-violet-500">
						Loading...
					</div>
				</div>
			</div>
		)
	}

	return (
		<>
			{/* Chapter Breadcrumb Navigation (for book chapters) */}
			{currentMaterial.book_id && book ? (
				<ChapterBreadcrumb
					book={book}
					currentChapter={currentMaterial}
					userMaterialsStatus={initialUserMaterialsStatus}
				/>
			) : (
				/* Epic Header for regular materials */
				<EpicHeader
					isDark={isDark}
					title={currentMaterial.title}
					onBack={() => typeof window !== 'undefined' && window.history.back()}
				/>
			)}

			<div className={cn(
				'min-h-screen pb-24',
				isDark
					? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-violet-950/30 to-slate-950'
					: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-100 via-amber-50/30 to-slate-50'
			)}>
				{/* Magical particles background */}
				<MagicalParticles isDark={isDark} />

				<div className="flex flex-col lg:flex-row justify-center items-start gap-0 lg:gap-8 px-0 lg:px-6 max-w-[1600px] mx-auto w-full">
					{/* Main content */}
					<div className="py-0 lg:py-8 px-4 lg:px-6 flex-1 min-w-0 max-w-full">
						{getImageRegardingSection(params?.section)}
						{displayVideo(params?.section)}

						<div className="mt-0 sm:mt-6 px-0 sm:px-2">
							<Translation
								materialId={currentMaterial.id}
								userId={user && user.id}
							/>

							{/* Action buttons */}
							<div className="relative z-50 flex flex-wrap items-center gap-3 mb-8 mt-6">
								{!is_being_studied && !is_studied && isUserLoggedIn && (
									<ActionButton
										variant="primary"
										icon={Play}
										onClick={() => addToStudyingMutation.mutate(currentMaterial.id)}
									>
										<span className="hidden sm:inline">{t('startstudying')}</span>
										<span className="sm:hidden">
											{locale === 'fr' ? 'Commencer' : locale === 'ru' ? 'Начать' : 'Start'}
										</span>
									</ActionButton>
								)}

								{is_being_studied && isUserLoggedIn && (
									<ActionButton
										variant="warning"
										icon={Pause}
										onClick={() => removeFromStudyingMutation.mutate(currentMaterial.id)}
									>
										<span className="hidden sm:inline">{t('stopstudying')}</span>
										<span className="sm:hidden">
											{locale === 'fr' ? 'Arrêter' : locale === 'ru' ? 'Остановить' : 'Stop'}
										</span>
									</ActionButton>
								)}

								{currentMaterial.content_accented && (
									<ActionButton
										variant="outline"
										icon={showAccents ? EyeOff : Eye}
										onClick={() => setShowAccents(!showAccents)}
									>
										<span className="hidden sm:inline">
											{showAccents ? t('hideaccents') : t('showaccents')}
										</span>
										<span className="sm:hidden">
											{showAccents
												? (locale === 'fr' ? 'Masquer' : locale === 'ru' ? 'Скрыть' : 'Hide')
												: (locale === 'fr' ? 'Montrer' : locale === 'ru' ? 'Показать' : 'Show')}
										</span>
									</ActionButton>
								)}

								{isUserAdmin && (
									<ActionButton
										variant="outline"
										icon={Edit3}
										onClick={handleEditContent}
									>
										<span className="hidden sm:inline">Edit material</span>
									</ActionButton>
								)}
							</div>

							{/* Content Paper - Ornate Frame */}
							<OrnateFrame
								isDark={isDark}
								glowColor="violet"
								className={cn(
									'p-4 lg:p-8 mb-8',
									isDark
										? 'bg-slate-800/50'
										: 'bg-white/80'
								)}
							>
								{/* Scroll label */}
								<div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-xs font-bold uppercase tracking-wider">
									<Scroll className="w-3 h-3" />
									<span>Texte</span>
								</div>

								{/* Pagination controls - Top */}
								{isPaginated && (
									<div className="mb-6 pt-2">
										<ContentPagination
											currentPage={currentPage}
											totalPages={totalPages}
											onPrevPage={prevPage}
											onNextPage={nextPage}
											onGoToFirst={goToFirst}
											onGoToLast={goToLast}
											hasPrevPage={hasPrevPage}
											hasNextPage={hasNextPage}
										/>
									</div>
								)}

								{/* Content */}
								<div className={cn(
									'text-base sm:text-lg md:text-xl leading-relaxed cursor-pointer',
									isDark ? 'text-slate-200' : 'text-slate-800',
									'[&_p]:mb-6',
									!isPaginated && 'pt-2'
								)}>
									<Words
										content={
											isPaginated
												? paginatedContent
												: (showAccents ? currentMaterial.content_accented : currentMaterial.content)
										}
										materialId={currentMaterial.id}
										locale={locale}
									/>
								</div>

								{/* Pagination controls - Bottom */}
								{isPaginated && (
									<div className="mt-6">
										<ContentPagination
											currentPage={currentPage}
											totalPages={totalPages}
											onPrevPage={prevPage}
											onNextPage={nextPage}
											onGoToFirst={goToFirst}
											onGoToLast={goToLast}
											hasPrevPage={hasPrevPage}
											hasNextPage={hasNextPage}
										/>
									</div>
								)}
							</OrnateFrame>

							{/* Exercise Section */}
							{isUserAdmin && <ExerciseSection materialId={currentMaterial.id} />}

							{/* Finish button */}
							{isUserLoggedIn && (() => {
								const isCurrentPageCompleted = isPaginated
									? completed_pages.includes(currentPage)
									: (isBookChapter ? (completed_pages.includes(1) || is_studied) : is_studied)

								const isLastPageOfChapter = isBookChapter && (!isPaginated || !hasNextPage)
								const allPreviousPagesCompleted = !isPaginated ||
									Array.from({ length: currentPage - 1 }, (_, i) => i + 1)
										.every(page => completed_pages.includes(page))

								const canFinishChapter = !isLastPageOfChapter || allPreviousPagesCompleted

								const handleFinishClick = () => {
									if (isCurrentPageCompleted || !canFinishChapter) return

									if (isBookChapter) {
										const isLastChapter = !nextChapter
										markPageCompletedMutation.mutate({
											materialId: currentMaterial.id,
											pageNumber: currentPage,
											totalPagesCount: totalPages || 1,
											isLastChapter
										})
									} else if (isPaginated) {
										markPageCompletedMutation.mutate({
											materialId: currentMaterial.id,
											pageNumber: currentPage,
											totalPagesCount: totalPages,
											isLastChapter: false
										})
									} else {
										markAsStudiedMutation.mutate(currentMaterial.id)
									}
								}

								const isButtonDisabled = isCurrentPageCompleted || !canFinishChapter

								return (
									<div className="relative z-50 flex flex-col items-center justify-center mt-12 mb-8 gap-2">
										{isLastPageOfChapter && !allPreviousPagesCompleted && !isCurrentPageCompleted && (
											<p className={cn(
												'text-sm text-center mb-2 px-4 py-2 rounded-lg',
												'bg-amber-500/10 border border-amber-500/30',
												'text-amber-500'
											)}>
												{t('complete_previous_pages_first')}
											</p>
										)}
										<FinishButton
											isCompleted={isCurrentPageCompleted}
											onClick={handleFinishClick}
											disabled={isButtonDisabled}
											isDark={isDark}
										>
											{isCurrentPageCompleted ? getCompletedBadgeText() : getFinishButtonText()}
										</FinishButton>
									</div>
								)
							})()}

							{/* Audio Player */}
							<div className={cn(
								'sticky z-50 mt-8 mb-8',
								'bottom-24 md:bottom-6'
							)}>
								{displayAudioPlayer(params?.section)}
							</div>

							{/* Chapter Navigation */}
							{currentMaterial.book_id && (
								<ChapterNavigation
									previousChapter={previousChapter}
									nextChapter={nextChapter}
									userMaterialsStatus={initialUserMaterialsStatus}
								/>
							)}
						</div>
					</div>

					{/* Floating button for mobile - Gaming style */}
					<FloatingActionButton
						onClick={() => setShowWordsContainer(true)}
						icon={BookOpen}
						variant="primary"
						isVideoDisplayed={isVideoDisplayed}
					/>

					{/* Desktop WordsContainer */}
					<div className={cn(
						'hidden lg:block',
						'w-[500px] xl:w-[550px] flex-shrink-0',
						isDark ? 'bg-slate-950' : 'bg-gradient-to-b from-slate-50 to-white',
						'sticky top-[120px] self-start',
						'max-h-[calc(100vh-130px)] overflow-y-auto',
						'pt-8 px-6',
						'[&::-webkit-scrollbar]:w-3',
						'[&::-webkit-scrollbar-track]:bg-violet-500/5 [&::-webkit-scrollbar-track]:rounded-md',
						'[&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-violet-500 [&::-webkit-scrollbar-thumb]:to-cyan-500',
						'[&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-white/30'
					)}>
						<WordsContainer />
					</div>

					{/* Mobile fullscreen WordsContainer */}
					{showWordsContainer && (
						<div className={cn(
							'lg:hidden fixed inset-0 z-[1100]',
							isDark ? 'bg-slate-950' : 'bg-white',
							'flex flex-col overflow-y-auto',
							'pt-24 sm:pt-28 px-4'
						)}>
							<FloatingActionButton
								onClick={() => setShowWordsContainer(false)}
								icon={X}
								variant="danger"
								isVideoDisplayed={isVideoDisplayed}
							/>
							<WordsContainer />
						</div>
					)}
				</div>
			</div>

			{/* Edit modal for admins */}
			{isUserAdmin && (
				<EditMaterialModal
					open={editModalOpen}
					onClose={() => setEditModalOpen(false)}
					material={currentMaterial}
					onSuccess={handleEditSuccess}
				/>
			)}

			{/* Report Button */}
			<div className={cn(
				'fixed z-50',
				'bottom-72 sm:bottom-6',
				'right-4 sm:right-6'
			)}>
				<ReportButton materialId={currentMaterial.id} />
			</div>

			{/* Celebration overlay */}
			<CelebrationOverlay />
		</>
	)
}

export default React.memo(Material)
