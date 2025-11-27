'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useFirstChapterOfBook } from '@/lib/materials-client'
import { useUserContext } from '@/context/user'
import { useTranslations } from 'next-intl'
import { getMaterialImageUrl } from '@/utils/mediaUrls'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { CheckCircle2, Clock, BookOpen } from 'lucide-react'

/**
 * BookCard component - Displays a book cover in the books section
 * Clicking the card navigates to the first chapter of the book
 *
 * @param {Object} book - Book object from the books table
 * @param {Object} checkIfUserMaterialIsInMaterials - Status of the first chapter (is_being_studied, is_studied)
 */
const BookCard = ({ book, checkIfUserMaterialIsInMaterials }) => {
	const t = useTranslations('materials')
	const { isDark } = useThemeMode()
	const router = useRouter()
	const { userLearningLanguage } = useUserContext()

	// Fetch first chapter for this book
	const { data: firstChapter } = useFirstChapterOfBook(
		userLearningLanguage,
		book.id
	)

	const handleClick = () => {
		if (firstChapter) {
			router.push(`/materials/book-chapters/${firstChapter.id}`)
		}
	}

	// Determine rarity based on level
	const getRarity = () => {
		if (book.level === 'advanced') return 'legendary'
		if (book.level === 'intermediate') return 'epic'
		return 'common'
	}
	const rarity = getRarity()

	// Get difficulty colors based on level
	const getDifficultyColors = (level) => {
		switch (level) {
			case 'beginner':
				return { bg: 'bg-emerald-500/15', border: 'border-emerald-500', text: 'text-emerald-600' }
			case 'intermediate':
				return { bg: 'bg-violet-500/15', border: 'border-violet-500', text: 'text-violet-600' }
			case 'advanced':
				return { bg: 'bg-amber-500/15', border: 'border-amber-500', text: 'text-amber-600' }
			default:
				return { bg: 'bg-violet-500/15', border: 'border-violet-500', text: 'text-violet-600' }
		}
	}

	const difficultyColors = getDifficultyColors(book.level)

	// Rarity-based gradient styles
	const getRarityGradient = () => {
		if (rarity === 'legendary') {
			return isDark
				? 'from-amber-500/20 via-yellow-500/10 to-amber-500/20'
				: 'from-amber-100/80 via-yellow-50/60 to-amber-100/80'
		}
		if (rarity === 'epic') {
			return isDark
				? 'from-violet-500/20 via-purple-500/10 to-violet-500/20'
				: 'from-violet-100/80 via-purple-50/60 to-violet-100/80'
		}
		return isDark
			? 'from-emerald-500/15 via-green-500/10 to-emerald-500/15'
			: 'from-emerald-100/70 via-green-50/50 to-emerald-100/70'
	}

	// Rarity-based border color
	const getRarityBorder = () => {
		if (rarity === 'legendary') return 'border-amber-500/60'
		if (rarity === 'epic') return 'border-violet-500/50'
		return 'border-emerald-500/40'
	}

	// Rarity-based shadow
	const getRarityShadow = () => {
		if (rarity === 'legendary') {
			return isDark
				? 'shadow-[0_8px_36px_rgba(251,191,36,0.4),0_0_60px_rgba(251,191,36,0.2)]'
				: 'shadow-[0_8px_30px_rgba(251,191,36,0.3),0_4px_15px_rgba(251,191,36,0.2)]'
		}
		if (rarity === 'epic') {
			return isDark
				? 'shadow-[0_8px_32px_rgba(168,85,247,0.35),0_0_50px_rgba(168,85,247,0.15)]'
				: 'shadow-[0_8px_28px_rgba(168,85,247,0.25),0_4px_12px_rgba(168,85,247,0.15)]'
		}
		return isDark
			? 'shadow-[0_8px_28px_rgba(16,185,129,0.25),0_0_40px_rgba(16,185,129,0.1)]'
			: 'shadow-[0_8px_24px_rgba(16,185,129,0.2),0_4px_10px_rgba(16,185,129,0.1)]'
	}

	// Rarity-based hover shadow
	const getRarityHoverShadow = () => {
		if (rarity === 'legendary') {
			return isDark
				? 'hover:shadow-[0_16px_48px_rgba(251,191,36,0.6),0_0_100px_rgba(251,191,36,0.3)]'
				: 'hover:shadow-[0_16px_40px_rgba(251,191,36,0.45),0_8px_25px_rgba(251,191,36,0.3)]'
		}
		if (rarity === 'epic') {
			return isDark
				? 'hover:shadow-[0_14px_42px_rgba(168,85,247,0.5),0_0_80px_rgba(168,85,247,0.25)]'
				: 'hover:shadow-[0_14px_36px_rgba(168,85,247,0.4),0_7px_20px_rgba(168,85,247,0.25)]'
		}
		return isDark
			? 'hover:shadow-[0_12px_36px_rgba(16,185,129,0.4),0_0_60px_rgba(16,185,129,0.2)]'
			: 'hover:shadow-[0_12px_30px_rgba(16,185,129,0.35),0_6px_15px_rgba(16,185,129,0.2)]'
	}

	// Rarity-based title gradient
	const getTitleGradient = () => {
		if (isDark) {
			if (rarity === 'legendary') return 'from-amber-400 via-yellow-300 to-amber-400'
			if (rarity === 'epic') return 'from-violet-400 via-purple-300 to-violet-400'
			return 'from-emerald-400 via-green-300 to-emerald-400'
		}
		return 'from-violet-600 via-purple-500 to-violet-600'
	}

	// Rarity-based divider color
	const getDividerColor = () => {
		if (rarity === 'legendary') return 'bg-amber-500'
		if (rarity === 'epic') return 'bg-violet-500'
		return 'bg-emerald-500'
	}

	return (
		<button
			type="button"
			onClick={handleClick}
			className="block w-full max-w-[220px] mx-auto"
		>
			<div
				className={cn(
					'group relative flex flex-col cursor-pointer',
					'h-[280px] sm:h-[300px]',
					'rounded-2xl overflow-hidden',
					'border-[3px] transition-all duration-500',
					getRarityBorder(),
					'bg-gradient-to-b',
					getRarityGradient(),
					getRarityShadow(),
					getRarityHoverShadow(),
					'hover:-translate-y-2 hover:scale-[1.02]',
					'active:scale-[0.97]'
				)}
			>
				{/* Holographic effect overlay */}
				<div
					className={cn(
						'absolute inset-0 z-[1] pointer-events-none',
						'opacity-0 group-hover:opacity-30 transition-opacity duration-500',
						'bg-gradient-to-r from-transparent via-pink-500/10 to-transparent',
						'animate-[holographicShine_3s_ease-in-out_infinite]'
					)}
					style={{
						backgroundSize: '200% 200%',
					}}
				/>

				{/* Status badges for first chapter */}
				{typeof checkIfUserMaterialIsInMaterials !== 'undefined' &&
					checkIfUserMaterialIsInMaterials.is_being_studied && (
						<div
							className={cn(
								'absolute top-2.5 right-2.5 z-[4]',
								'p-1.5 rounded-full',
								'border-2 border-violet-500/60',
								isDark
									? 'bg-gradient-to-br from-slate-900/98 to-purple-950/95'
									: 'bg-gradient-to-br from-white/98 to-violet-50/95',
								'shadow-[0_3px_15px_rgba(168,85,247,0.5),0_0_20px_rgba(168,85,247,0.3)]',
								'animate-pulse'
							)}
						>
							<Clock className="w-4 h-4 text-violet-500" />
						</div>
					)}
				{typeof checkIfUserMaterialIsInMaterials !== 'undefined' &&
					checkIfUserMaterialIsInMaterials.is_studied && (
						<div
							className={cn(
								'absolute top-2.5 right-2.5 z-[4]',
								'p-1.5 rounded-full',
								'border-2 border-emerald-500/60',
								isDark
									? 'bg-gradient-to-br from-slate-900/98 to-emerald-950/95'
									: 'bg-gradient-to-br from-white/98 to-emerald-50/95',
								'shadow-[0_3px_15px_rgba(34,197,94,0.5),0_0_20px_rgba(34,197,94,0.3)]'
							)}
						>
							<CheckCircle2 className="w-4 h-4 text-emerald-500" />
						</div>
					)}

				{/* Level badge */}
				{book.level && (
					<span
						className={cn(
							'absolute top-2.5 left-2.5 z-[3]',
							'px-2.5 py-1 rounded-md',
							'text-[0.6rem] font-extrabold uppercase tracking-wider',
							'border-[1.5px]',
							difficultyColors.bg,
							difficultyColors.border,
							difficultyColors.text,
							isDark
								? 'bg-gradient-to-br from-slate-900/98 to-slate-800/95 backdrop-blur-xl'
								: 'bg-gradient-to-br from-white/98 to-slate-50/95 backdrop-blur-xl',
							isDark
								? 'shadow-[0_3px_12px_rgba(0,0,0,0.3)]'
								: 'shadow-[0_3px_10px_rgba(0,0,0,0.1)]'
						)}
					>
						{t(book.level)}
					</span>
				)}

				{/* Book cover image */}
				<div className="relative w-full h-[160px] sm:h-[180px] overflow-hidden">
					{/* Vignette overlay */}
					<div
						className={cn(
							'absolute inset-0 z-[1] pointer-events-none',
							isDark
								? 'bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.4)_100%)]'
								: 'bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.2)_100%)]'
						)}
					/>
					<img
						src={getMaterialImageUrl(book)}
						alt={book.title}
						className={cn(
							'w-full h-full object-cover',
							'transition-transform duration-500 ease-out',
							'group-hover:scale-[1.15]'
						)}
					/>
				</div>

				{/* Card content */}
				<div
					className={cn(
						'flex-1 flex flex-col justify-between',
						'py-2.5 sm:py-3 px-3 sm:px-4',
						'relative z-[2]'
					)}
				>
					{/* Title and category */}
					<div className="text-center mb-1">
						<h3
							className={cn(
								'text-[0.9rem] sm:text-[0.95rem] font-extrabold',
								'leading-tight mb-1.5',
								'uppercase tracking-wide',
								'bg-gradient-to-r bg-clip-text text-transparent',
								getTitleGradient(),
								'transition-all duration-300',
								'group-hover:drop-shadow-lg'
							)}
						>
							{book.title}
						</h3>

						<div className="flex items-center justify-center gap-1.5">
							<span
								className={cn(
									'text-[0.7rem] sm:text-[0.75rem] font-semibold capitalize tracking-wide',
									isDark ? 'text-slate-400' : 'text-slate-500'
								)}
							>
								{t('books')}
							</span>
							<BookOpen
								className={cn(
									'w-4 h-4',
									isDark ? 'text-violet-400' : 'text-violet-500',
									isDark
										? 'drop-shadow-[0_0_6px_rgba(139,92,246,0.5)]'
										: 'drop-shadow-[0_2px_3px_rgba(139,92,246,0.25)]'
								)}
							/>
						</div>
					</div>

					{/* Decorative divider */}
					<div className="flex items-center justify-center gap-2 my-1.5 opacity-80">
						<div
							className={cn(
								'flex-1 h-[1.5px]',
								'bg-gradient-to-r from-transparent',
								rarity === 'legendary'
									? 'to-amber-500/60'
									: rarity === 'epic'
									? 'to-violet-500/50'
									: 'to-emerald-500/40'
							)}
						/>
						<div
							className={cn(
								'w-1 h-1 rotate-45',
								getDividerColor(),
								rarity === 'legendary'
									? 'shadow-[0_0_6px_#fbbf24]'
									: rarity === 'epic'
									? 'shadow-[0_0_6px_#a855f7]'
									: 'shadow-[0_0_6px_#10b981]'
							)}
						/>
						<div
							className={cn(
								'w-0.5 h-0.5 rounded-full opacity-60',
								getDividerColor()
							)}
						/>
						<div
							className={cn(
								'w-1 h-1 rotate-45',
								getDividerColor(),
								rarity === 'legendary'
									? 'shadow-[0_0_6px_#fbbf24]'
									: rarity === 'epic'
									? 'shadow-[0_0_6px_#a855f7]'
									: 'shadow-[0_0_6px_#10b981]'
							)}
						/>
						<div
							className={cn(
								'flex-1 h-[1.5px]',
								'bg-gradient-to-l from-transparent',
								rarity === 'legendary'
									? 'to-amber-500/60'
									: rarity === 'epic'
									? 'to-violet-500/50'
									: 'to-emerald-500/40'
							)}
						/>
					</div>
				</div>
			</div>
		</button>
	)
}

// Memoize the component to avoid re-renders in lists
export default React.memo(BookCard)
