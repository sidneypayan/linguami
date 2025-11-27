'use client'

import { useState, useEffect, useRef } from 'react'
import { BookOpen, CheckCircle2, Clock, X, Library } from 'lucide-react'
import { useBookChapters, useUserMaterialsStatus } from '@/lib/materials-client'
import { useUserContext } from '@/context/user'
import { useParams } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

const BookMenu = ({ bookId }) => {
	const { isDark } = useThemeMode()
	const { isUserLoggedIn } = useUserContext()
	const { data: chapters = [] } = useBookChapters(bookId)
	const { data: userMaterialsStatus = [] } = useUserMaterialsStatus(isUserLoggedIn)

	const params = useParams()
	const { material } = params

	const [drawerOpen, setDrawerOpen] = useState(false)
	const drawerRef = useRef(null)

	const checkIfUserMaterialIsInMaterials = id => {
		if (!userMaterialsStatus) return null
		return userMaterialsStatus.find(userMaterial => userMaterial.material_id === id)
	}

	// Close on escape
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === 'Escape') setDrawerOpen(false)
		}
		if (drawerOpen) {
			document.addEventListener('keydown', handleEscape)
			document.body.style.overflow = 'hidden'
		}
		return () => {
			document.removeEventListener('keydown', handleEscape)
			document.body.style.overflow = ''
		}
	}, [drawerOpen])

	return (
		<>
			{/* Trigger Button */}
			<button
				onClick={() => setDrawerOpen(true)}
				className={cn(
					'flex items-center gap-2 px-5 py-3 rounded-xl',
					'bg-gradient-to-r from-violet-500 to-purple-600',
					'text-white font-semibold text-sm sm:text-base',
					'shadow-[0_4px_15px_rgba(139,92,246,0.3)]',
					'transition-all duration-300',
					'hover:from-purple-600 hover:to-violet-500',
					'hover:-translate-y-0.5',
					'hover:shadow-[0_6px_20px_rgba(139,92,246,0.4)]',
					'active:scale-[0.98]'
				)}
			>
				<Library className="w-5 h-5" />
				Chapitres du livre
			</button>

			{/* Backdrop */}
			{drawerOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-[1200] transition-opacity duration-300"
					onClick={() => setDrawerOpen(false)}
				/>
			)}

			{/* Drawer */}
			<div
				ref={drawerRef}
				className={cn(
					'fixed top-0 left-0 h-full z-[1300]',
					'w-full sm:w-[400px]',
					'transform transition-transform duration-300 ease-out',
					drawerOpen ? 'translate-x-0' : '-translate-x-full',
					isDark ? 'bg-slate-900' : 'bg-slate-50',
					'shadow-[8px_0_32px_rgba(0,0,0,0.2)]'
				)}
			>
				{/* Header */}
				<div
					className={cn(
						'bg-gradient-to-r from-violet-500 to-purple-600',
						'text-white p-5',
						'flex items-center justify-between',
						'shadow-[0_4px_12px_rgba(139,92,246,0.3)]'
					)}
				>
					<div className="flex items-center gap-3">
						<BookOpen className="w-8 h-8" />
						<div>
							<h2 className="text-xl font-bold">Chapitres</h2>
							<p className="text-sm opacity-90">
								{chapters.length} chapitre{chapters.length > 1 ? 's' : ''}
							</p>
						</div>
					</div>
					<button
						onClick={() => setDrawerOpen(false)}
						className={cn(
							'p-2 rounded-lg transition-all duration-300',
							'hover:bg-white/10 hover:rotate-90'
						)}
					>
						<X className="w-6 h-6" />
					</button>
				</div>

				{/* Divider */}
				<div className={cn('h-px', isDark ? 'bg-slate-700' : 'bg-slate-200')} />

				{/* Chapters List */}
				<div className="flex-1 overflow-y-auto p-4 h-[calc(100%-100px)]">
					{chapters.map((chapter, index) => {
						const status = checkIfUserMaterialIsInMaterials(chapter.id)
						const isBeingStudied = status?.is_being_studied
						const isStudied = status?.is_studied
						const isCurrentChapter = material == chapter.id

						return (
							<Link
								key={chapter.id}
								href={`/materials/book-chapters/${chapter.id}`}
								onClick={() => setDrawerOpen(false)}
								className={cn(
									'flex items-center gap-3 p-4 mb-2 rounded-xl',
									'transition-all duration-200',
									'border',
									isCurrentChapter
										? isDark
											? 'bg-violet-500/20 border-violet-500'
											: 'bg-violet-100 border-violet-500'
										: isDark
											? 'bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-violet-500/50'
											: 'bg-white border-slate-200 hover:bg-violet-50 hover:border-violet-300',
									'hover:translate-x-1',
									'active:scale-[0.98]'
								)}
							>
								{/* Chapter Number */}
								<div
									className={cn(
										'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
										'font-bold text-sm',
										isCurrentChapter
											? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
											: isDark
												? 'bg-violet-500/20 text-violet-400'
												: 'bg-violet-100 text-violet-600'
									)}
								>
									{index + 1}
								</div>

								{/* Title */}
								<span
									className={cn(
										'flex-1 font-semibold text-sm leading-snug',
										isCurrentChapter
											? 'text-violet-500'
											: isDark
												? 'text-slate-200'
												: 'text-slate-700'
									)}
								>
									{chapter.title}
								</span>

								{/* Status Badges */}
								<div className="flex gap-1">
									{isBeingStudied && (
										<span className={cn(
											'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold',
											'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
										)}>
											<Clock className="w-3 h-3" />
											En cours
										</span>
									)}
									{isStudied && (
										<span className={cn(
											'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold',
											'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
										)}>
											<CheckCircle2 className="w-3 h-3" />
											Terminé
										</span>
									)}
								</div>
							</Link>
						)
					})}
				</div>
			</div>
		</>
	)
}

export default BookMenu
