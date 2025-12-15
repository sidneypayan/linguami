'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { PlayCircle, ImageOff } from 'lucide-react'
import { getMaterialImageUrl } from '@/utils/mediaUrls'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

const MaterialsCard = ({ material }) => {
	const t = useTranslations('materials')
	const locale = useLocale()
	const { isDark } = useThemeMode()
	const [imageError, setImageError] = useState(false)

	const getDifficultyColor = (level) => {
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

	const difficultyColors = getDifficultyColor(material.level)

	const getTranslatedTitle = () => {
		if (locale === 'fr' && material.title_fr) return material.title_fr
		if (locale === 'en' && material.title_en) return material.title_en
		if (locale === 'ru' && material.title_ru) return material.title_ru
		return material.title_fr || material.title_en || material.title_ru || material.title
	}

	return (
		<Link href={`/materials/${material.section}`}>
			<div className="w-full flex flex-col h-full">
				<div
					className={cn(
						'group relative cursor-pointer w-full',
						'h-40 sm:h-[170px] md:h-[180px]',
						'rounded-2xl overflow-hidden',
						'border transition-all duration-400',
						isDark
							? 'bg-gradient-to-br from-slate-800/95 to-slate-900/90 border-violet-500/20'
							: 'bg-gradient-to-br from-white/95 to-white/90 border-violet-500/20',
						'shadow-[0_4px_20px_rgba(139,92,246,0.15)]',
						'hover:-translate-y-2',
						'hover:shadow-[0_12px_40px_rgba(139,92,246,0.3)]',
						'hover:border-violet-500/40',
						'active:-translate-y-1'
					)}
				>
					{/* Gradient overlay on hover */}
					<div
						className={cn(
							'absolute inset-0 z-[1] opacity-0 transition-opacity duration-300',
							'bg-gradient-to-br from-violet-500/5 to-cyan-500/5',
							'group-hover:opacity-100'
						)}
					/>

					{/* Image */}
					<div className="relative w-full h-full transition-transform duration-500 group-hover:scale-[1.08]">
						{!imageError ? (
							<img
								src={getMaterialImageUrl(material)}
								alt={material.title}
								className="w-full h-full object-cover"
								onError={() => setImageError(true)}
							/>
						) : (
							<div className={cn(
								'w-full h-full flex flex-col items-center justify-center gap-3',
								isDark ? 'bg-slate-700' : 'bg-slate-200'
							)}>
								<ImageOff className={cn(
									'w-12 h-12',
									isDark ? 'text-slate-500' : 'text-slate-400'
								)} />
								<span className={cn(
									'text-xs font-medium',
									isDark ? 'text-slate-500' : 'text-slate-400'
								)}>
									{t('image_not_available')}
								</span>
							</div>
						)}
					</div>

					{/* Play overlay on hover */}
					<div
						className={cn(
							'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
							'z-[3] pointer-events-none',
							'opacity-0 scale-75 transition-all duration-300',
							'group-hover:opacity-100 group-hover:scale-100'
						)}
					>
						<div
							className={cn(
								'w-16 h-16 rounded-full flex items-center justify-center',
								'bg-gradient-to-br from-violet-500/95 to-cyan-500/95',
								'shadow-[0_8px_32px_rgba(139,92,246,0.5)]',
								'border-2 border-white/50'
							)}
						>
							<PlayCircle className="w-10 h-10 text-white" />
						</div>
					</div>
				</div>

				{/* Title and difficulty badge */}
				<div className="mt-4 flex items-center gap-3 justify-between">
					<span
						className={cn(
							'font-bold text-[0.95rem] sm:text-[1.05rem] leading-tight',
							'line-clamp-2 flex-1',
							'bg-clip-text text-transparent',
							isDark
								? 'bg-gradient-to-r from-violet-300 via-violet-400 to-cyan-400'
								: 'bg-gradient-to-r from-indigo-950 via-violet-500 to-cyan-500'
						)}
					>
						{getTranslatedTitle()}
					</span>

					{material.level && (
						<span
							className={cn(
								'px-2.5 py-1 rounded-md text-[0.7rem] font-bold flex-shrink-0',
								'border-[1.5px]',
								difficultyColors.bg,
								difficultyColors.border,
								difficultyColors.text
							)}
						>
							{t(material.level)}
						</span>
					)}
				</div>
			</div>
		</Link>
	)
}

export default MaterialsCard
