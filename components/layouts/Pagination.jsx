'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useThemeMode } from '@/context/ThemeContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const Pagination = ({
	numOfPages: numOfPagesProp,
	currentPage: currentPageProp,
	onPageChange,
}) => {
	const { isDark } = useThemeMode()
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const mediaQuery = window.matchMedia('(max-width: 600px)')
		setIsMobile(mediaQuery.matches)

		const handler = e => setIsMobile(e.matches)
		mediaQuery.addEventListener('change', handler)
		return () => mediaQuery.removeEventListener('change', handler)
	}, [])

	const numOfPages = numOfPagesProp
	const page = currentPageProp || 1

	const handlePageChange = (newPage) => {
		if (onPageChange) {
			onPageChange(newPage)
		}
	}

	const nextPage = () => {
		let newPage = page + 1
		if (newPage > numOfPages) {
			newPage = 1
		}
		handlePageChange(newPage)
	}

	const prevPage = () => {
		let newPage = page - 1
		if (newPage < 1) {
			newPage = numOfPages
		}
		handlePageChange(newPage)
	}

	const getPageNumbers = () => {
		const pages = []
		const maxVisible = isMobile ? 3 : 5

		if (numOfPages <= maxVisible) {
			for (let i = 1; i <= numOfPages; i++) {
				pages.push(i)
			}
		} else {
			pages.push(1)

			let start = Math.max(2, page - 1)
			let end = Math.min(numOfPages - 1, page + 1)

			if (page <= 3) {
				end = isMobile ? 2 : 4
			}

			if (page >= numOfPages - 2) {
				start = isMobile ? numOfPages - 1 : numOfPages - 3
			}

			if (start > 2) {
				pages.push('...')
			}

			for (let i = start; i <= end; i++) {
				pages.push(i)
			}

			if (end < numOfPages - 1) {
				pages.push('...')
			}

			pages.push(numOfPages)
		}

		return pages
	}

	const pageNumbers = getPageNumbers()

	return (
		<div className="flex justify-center items-center mt-10 mb-6 px-1 sm:px-0">
			<div className="flex flex-row items-center gap-1.5 sm:gap-2">
				{/* Bouton precedent */}
				<Button
					variant="outline"
					size="icon"
					onClick={prevPage}
					disabled={page === 1}
					className={cn(
						'w-10 h-10 sm:w-11 sm:h-11 rounded-lg',
						'transition-all duration-300',
						'relative overflow-hidden group',
						isDark
							? 'bg-slate-800/80 border-violet-500/30 text-slate-300 shadow-[0_2px_6px_rgba(139,92,246,0.15)]'
							: 'bg-white border-violet-500/20 text-slate-700 shadow-[0_2px_6px_rgba(139,92,246,0.08)]',
						'hover:bg-gradient-to-br hover:from-violet-500/90 hover:to-cyan-500/80',
						'hover:border-violet-500/80 hover:text-white',
						'hover:-translate-x-0.5 hover:scale-105',
						'hover:shadow-[0_6px_16px_rgba(139,92,246,0.5),0_0_25px_rgba(6,182,212,0.3)]',
						'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none'
					)}
				>
					<ChevronLeft className="w-5 h-5" />
				</Button>

				{/* Numeros de page */}
				{pageNumbers.map((pageNumber, index) => {
					if (pageNumber === '...') {
						return (
							<span
								key={`dots-${index}`}
								className={cn(
									'px-2 font-semibold',
									isDark ? 'text-slate-300' : 'text-slate-500'
								)}
							>
								...
							</span>
						)
					}

					const isActive = page === pageNumber

					return (
						<Button
							key={pageNumber}
							variant={isActive ? 'default' : 'outline'}
							onClick={() => handlePageChange(pageNumber)}
							className={cn(
								'min-w-[40px] h-10 sm:min-w-[44px] sm:h-11 rounded-lg',
								'font-bold text-base sm:text-base',
								'transition-all duration-300',
								'relative overflow-hidden',
								isActive
									? 'bg-gradient-to-br from-violet-500/90 to-cyan-500/80 border-violet-500/60 text-white shadow-[0_4px_12px_rgba(139,92,246,0.4),0_0_20px_rgba(6,182,212,0.2)]'
									: isDark
										? 'bg-slate-800/80 border-violet-500/30 text-slate-300'
										: 'bg-white border-violet-500/20 text-slate-600',
								!isActive && 'hover:border-violet-500/80 hover:bg-violet-500/10',
								'hover:-translate-y-0.5 hover:scale-105',
								isActive
									? 'hover:from-violet-500 hover:to-cyan-500/90 hover:shadow-[0_6px_16px_rgba(139,92,246,0.5),0_0_25px_rgba(6,182,212,0.3)]'
									: 'hover:shadow-[0_4px_12px_rgba(139,92,246,0.25)]'
							)}
						>
							{pageNumber}
						</Button>
					)
				})}

				{/* Bouton suivant */}
				<Button
					variant="outline"
					size="icon"
					onClick={nextPage}
					disabled={page === numOfPages}
					className={cn(
						'w-10 h-10 sm:w-11 sm:h-11 rounded-lg',
						'transition-all duration-300',
						'relative overflow-hidden group',
						isDark
							? 'bg-slate-800/80 border-violet-500/30 text-slate-300 shadow-[0_2px_6px_rgba(139,92,246,0.15)]'
							: 'bg-white border-violet-500/20 text-slate-700 shadow-[0_2px_6px_rgba(139,92,246,0.08)]',
						'hover:bg-gradient-to-br hover:from-violet-500/90 hover:to-cyan-500/80',
						'hover:border-violet-500/80 hover:text-white',
						'hover:translate-x-0.5 hover:scale-105',
						'hover:shadow-[0_6px_16px_rgba(139,92,246,0.5),0_0_25px_rgba(6,182,212,0.3)]',
						'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none'
					)}
				>
					<ChevronRight className="w-5 h-5" />
				</Button>
			</div>
		</div>
	)
}

export default Pagination
