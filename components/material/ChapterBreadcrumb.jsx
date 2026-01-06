'use client'

import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useBookChapters } from '@/lib/materials-client'
import { Home, BookOpen, ChevronDown, CheckCircle2, Circle, Clock } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/**
 * ChapterBreadcrumb component - Navigation breadcrumb for book chapters
 * Shows: Home > Book Title > Current Chapter (with dropdown to all chapters)
 */
const ChapterBreadcrumb = ({ book, currentChapter, userMaterialsStatus = [] }) => {
	const t = useTranslations('materials')
	const locale = useLocale()
	const { isDark } = useThemeMode()
	const router = useRouter()

	// Fetch all chapters for this book
	const { data: chapters = [] } = useBookChapters(book?.id)

	const handleChapterSelect = (chapterId) => {
		router.push(`/${locale}/materials/book-chapters/${chapterId}`)
	}

	// Get completion status for a chapter
	const getChapterStatus = (chapterId) => {
		return userMaterialsStatus.find(um => um.material_id === chapterId)
	}

	// Find current chapter index
	const currentIndex = chapters.findIndex(ch => ch.id === currentChapter?.id)

	return (
		<div
			className={cn(
				'pt-20 md:pt-[6.5rem] pb-6 px-4 sm:px-6 md:px-8',
				'border-b-2',
				isDark
					? 'border-violet-500/30 bg-gradient-to-br from-slate-950/95 to-purple-950/90'
					: 'border-violet-500/20 bg-gradient-to-br from-white/98 to-violet-50/95',
				isDark
					? 'shadow-[0_4px_20px_rgba(139,92,246,0.1)]'
					: 'shadow-[0_4px_20px_rgba(139,92,246,0.05)]'
			)}
		>
			<nav className="flex items-center flex-wrap gap-2">
				{/* Home */}
				<Link
					href="/materials"
					className={cn(
						'flex items-center gap-2 px-3 py-1.5 rounded-lg',
						'transition-all duration-200',
						isDark
							? 'text-violet-400/80 hover:text-violet-400 hover:bg-violet-500/10'
							: 'text-violet-500/70 hover:text-violet-600 hover:bg-violet-100/50',
						'hover:-translate-y-0.5'
					)}
				>
					<Home className="w-5 h-5" />
					<span className="hidden sm:inline font-bold text-sm">
						{t('allMaterials')}
					</span>
				</Link>

				<span className={cn(
					'text-xl font-bold mx-1',
					isDark ? 'text-violet-500/50' : 'text-violet-400/40'
				)}>
					›
				</span>

				{/* Book Title */}
				<Link
					href="/materials/books"
					className={cn(
						'flex items-center gap-2 px-3 py-1.5 rounded-lg',
						'transition-all duration-200',
						isDark
							? 'text-violet-400/90 hover:text-violet-400 hover:bg-violet-500/10'
							: 'text-violet-500/80 hover:text-violet-600 hover:bg-violet-100/50',
						'hover:-translate-y-0.5'
					)}
				>
					<BookOpen className="w-5 h-5" />
					<span className="font-bold text-sm max-w-[150px] sm:max-w-[300px] md:max-w-[400px] truncate">
						{book?.title || t('books')}
					</span>
				</Link>

				<span className={cn(
					'text-xl font-bold mx-1',
					isDark ? 'text-violet-500/50' : 'text-violet-400/40'
				)}>
					›
				</span>

				{/* Current Chapter with Dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className={cn(
								'flex items-center gap-2 px-4 py-2 h-auto rounded-xl',
								'font-bold text-sm',
								'border-2 transition-all duration-300',
								isDark
									? 'text-violet-300 bg-gradient-to-r from-violet-500/20 to-cyan-500/15 border-violet-500/40'
									: 'text-violet-600 bg-gradient-to-r from-violet-500/15 to-cyan-500/10 border-violet-500/30',
								isDark
									? 'shadow-[0_4px_12px_rgba(139,92,246,0.2)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.3)]'
									: 'shadow-[0_4px_12px_rgba(139,92,246,0.15)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.2)]',
								'hover:-translate-y-0.5 hover:border-violet-500',
								'hover:bg-transparent'
							)}
						>
							<span className={cn(
								'px-2 py-0.5 rounded text-xs font-extrabold',
								isDark
									? 'bg-violet-500/40 text-white border border-white/20'
									: 'bg-violet-500/30 text-violet-700 border border-violet-500/30'
							)}>
								{currentIndex + 1}/{chapters.length}
							</span>
							<span className="max-w-[150px] sm:max-w-[300px] md:max-w-[400px] truncate">
								{currentChapter?.title}
							</span>
							<ChevronDown className="w-5 h-5 transition-transform duration-200" />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						align="start"
						className={cn(
							'w-[90vw] sm:w-[450px] max-h-[500px] overflow-y-auto',
							'rounded-xl border p-2',
							isDark
								? 'bg-slate-950 border-violet-500/20 shadow-[0_8px_32px_rgba(139,92,246,0.3)]'
								: 'bg-white border-violet-500/10 shadow-[0_8px_32px_rgba(139,92,246,0.15)]'
						)}
					>
						{chapters.map((chapter, index) => {
							const status = getChapterStatus(chapter.id)
							const isCurrentChapter = chapter.id === currentChapter?.id
							const isCompleted = status?.is_studied
							const isBeingStudied = status?.is_being_studied

							return (
								<DropdownMenuItem
									key={chapter.id}
									onClick={() => handleChapterSelect(chapter.id)}
									className={cn(
										'py-3 px-4 rounded-xl mb-1 cursor-pointer',
										'flex items-center gap-3',
										'border-l-4 transition-all duration-200',
										isCurrentChapter
											? isDark
												? 'bg-violet-500/20 border-l-violet-500'
												: 'bg-violet-500/12 border-l-violet-500'
											: 'border-l-transparent',
										!isCurrentChapter && (isDark
											? 'hover:bg-violet-500/25 hover:border-l-violet-500'
											: 'hover:bg-violet-500/15 hover:border-l-violet-500'),
										'focus:bg-violet-500/20'
									)}
								>
									{/* Chapter number */}
									<div
										className={cn(
											'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
											'font-extrabold text-sm transition-all',
											isCurrentChapter
												? 'bg-violet-500 text-white shadow-[0_4px_12px_rgba(139,92,246,0.4)]'
												: isDark
													? 'bg-violet-500/30 text-violet-400 shadow-[0_2px_8px_rgba(139,92,246,0.2)]'
													: 'bg-violet-500/15 text-violet-600 shadow-[0_2px_8px_rgba(139,92,246,0.2)]'
										)}
									>
										{index + 1}
									</div>

									{/* Chapter title */}
									<span
										className={cn(
											'flex-1 text-left font-semibold text-sm leading-snug',
											isCurrentChapter
												? 'text-violet-500 font-bold'
												: isDark
													? 'text-slate-200'
													: 'text-slate-700'
										)}
									>
										{chapter.title}
									</span>

									{/* Status icon */}
									{isCompleted && (
										<CheckCircle2 className="w-5 h-5 text-emerald-500 drop-shadow-[0_2px_4px_rgba(16,185,129,0.3)] flex-shrink-0" />
									)}
									{!isCompleted && isBeingStudied && (
										<Clock className="w-5 h-5 text-purple-500 drop-shadow-[0_2px_4px_rgba(168,85,247,0.3)] flex-shrink-0" />
									)}
									{!isCompleted && !isBeingStudied && !isCurrentChapter && (
										<Circle className={cn(
											'w-5 h-5 flex-shrink-0',
											isDark ? 'text-violet-500/40' : 'text-violet-500/30'
										)} />
									)}
								</DropdownMenuItem>
							)
						})}
					</DropdownMenuContent>
				</DropdownMenu>
			</nav>
		</div>
	)
}

export default ChapterBreadcrumb
