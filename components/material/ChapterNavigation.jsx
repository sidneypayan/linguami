'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock } from 'lucide-react'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

/**
 * ChapterNavigation component - Previous/Next navigation buttons for book chapters
 * Displays at the bottom of chapter content with chapter titles
 */
const ChapterNavigation = ({ previousChapter, nextChapter, userMaterialsStatus = [] }) => {
	const t = useTranslations('materials')
	const { isDark } = useThemeMode()
	const router = useRouter()

	// Get completion status for a chapter
	const getChapterStatus = (chapterId) => {
		return userMaterialsStatus.find(um => um.material_id === chapterId)
	}

	const handleNavigate = (chapterId) => {
		router.push(`/materials/book-chapters/${chapterId}`)
	}

	if (!previousChapter && !nextChapter) {
		return null
	}

	return (
		<div className="mt-12 mb-8 px-4 sm:px-6">
			<div
				className={cn(
					'grid gap-4 sm:gap-6 max-w-[1200px] mx-auto',
					previousChapter && nextChapter
						? 'grid-cols-1 sm:grid-cols-2'
						: 'grid-cols-1'
				)}
			>
				{/* Previous Chapter Button */}
				{previousChapter && (
					<button
						onClick={() => handleNavigate(previousChapter.id)}
						className={cn(
							'group p-5 rounded-2xl text-left',
							'border-2 transition-all duration-300',
							'relative overflow-hidden',
							isDark
								? 'border-violet-500/30 bg-gradient-to-br from-slate-900/90 to-purple-950/85'
								: 'border-violet-500/20 bg-gradient-to-br from-white/95 to-violet-50/90',
							'hover:-translate-x-1 hover:-translate-y-0.5',
							isDark
								? 'hover:shadow-[0_12px_32px_rgba(139,92,246,0.3)] hover:border-violet-500'
								: 'hover:shadow-[0_12px_32px_rgba(139,92,246,0.2)] hover:border-violet-500',
							'active:-translate-x-0.5 active:-translate-y-0'
						)}
					>
						<div className="flex flex-col gap-3">
							{/* Header */}
							<div className="flex items-center gap-2">
								<ArrowLeft className="w-6 h-6 text-violet-500 group-hover:-translate-x-1 transition-transform" />
								<span className={cn(
									'text-sm font-bold uppercase tracking-wider',
									isDark ? 'text-violet-400/85' : 'text-violet-500/75'
								)}>
									{t('previous') || 'Chapitre précédent'}
								</span>
							</div>

							{/* Chapter Title */}
							<h3 className={cn(
								'text-base sm:text-lg font-bold leading-snug line-clamp-2',
								isDark ? 'text-slate-200' : 'text-slate-800'
							)}>
								{previousChapter.title}
							</h3>

							{/* Status Badge */}
							{getChapterStatus(previousChapter.id)?.is_studied && (
								<div className="flex items-center gap-2">
									<CheckCircle2 className="w-5 h-5 text-emerald-500 drop-shadow-[0_2px_4px_rgba(16,185,129,0.3)]" />
									<span className="text-sm font-bold text-emerald-500">
										{t('completed_badge')}
									</span>
								</div>
							)}
							{!getChapterStatus(previousChapter.id)?.is_studied && getChapterStatus(previousChapter.id)?.is_being_studied && (
								<div className="flex items-center gap-2">
									<Clock className="w-5 h-5 text-purple-500 drop-shadow-[0_2px_4px_rgba(168,85,247,0.3)]" />
									<span className="text-sm font-bold text-purple-500">
										{t('being_studied') || 'En cours'}
									</span>
								</div>
							)}
						</div>
					</button>
				)}

				{/* Spacer for grid when only next */}
				{!previousChapter && nextChapter && (
					<div className="hidden sm:block" />
				)}

				{/* Next Chapter Button */}
				{nextChapter && (
					<button
						onClick={() => handleNavigate(nextChapter.id)}
						className={cn(
							'group p-5 rounded-2xl text-left sm:text-right',
							'border-2 transition-all duration-300',
							'relative overflow-hidden',
							isDark
								? 'border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-cyan-950/85'
								: 'border-cyan-500/20 bg-gradient-to-br from-white/95 to-cyan-50/90',
							'hover:translate-x-1 hover:-translate-y-0.5',
							isDark
								? 'hover:shadow-[0_12px_32px_rgba(6,182,212,0.3)] hover:border-cyan-500'
								: 'hover:shadow-[0_12px_32px_rgba(6,182,212,0.2)] hover:border-cyan-500',
							'active:translate-x-0.5 active:-translate-y-0'
						)}
					>
						<div className="flex flex-col gap-3">
							{/* Header */}
							<div className="flex items-center gap-2 justify-start sm:justify-end">
								<span className={cn(
									'text-sm font-bold uppercase tracking-wider',
									isDark ? 'text-cyan-400/85' : 'text-cyan-600/75'
								)}>
									{t('next') || 'Chapitre suivant'}
								</span>
								<ArrowRight className="w-6 h-6 text-cyan-500 group-hover:translate-x-1 transition-transform" />
							</div>

							{/* Chapter Title */}
							<h3 className={cn(
								'text-base sm:text-lg font-bold leading-snug line-clamp-2',
								isDark ? 'text-slate-200' : 'text-slate-800'
							)}>
								{nextChapter.title}
							</h3>

							{/* Status Badge */}
							{getChapterStatus(nextChapter.id)?.is_studied && (
								<div className="flex items-center gap-2 justify-start sm:justify-end">
									<CheckCircle2 className="w-5 h-5 text-emerald-500 drop-shadow-[0_2px_4px_rgba(16,185,129,0.3)]" />
									<span className="text-sm font-bold text-emerald-500">
										{t('completed_badge')}
									</span>
								</div>
							)}
							{!getChapterStatus(nextChapter.id)?.is_studied && getChapterStatus(nextChapter.id)?.is_being_studied && (
								<div className="flex items-center gap-2 justify-start sm:justify-end">
									<Clock className="w-5 h-5 text-purple-500 drop-shadow-[0_2px_4px_rgba(168,85,247,0.3)]" />
									<span className="text-sm font-bold text-purple-500">
										{t('being_studied') || 'En cours'}
									</span>
								</div>
							)}
						</div>
					</button>
				)}
			</div>
		</div>
	)
}

export default ChapterNavigation
