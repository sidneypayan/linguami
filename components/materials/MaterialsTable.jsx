'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useUserContext } from '@/context/user'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import {
	Film,
	Music,
	Headphones,
	BookOpen,
	CheckCircle2,
	Clock,
} from 'lucide-react'
import { sections } from '@/data/sections'
import { getMaterialImageUrl } from '@/utils/mediaUrls'

const MaterialsTable = ({ materials, checkIfUserMaterialIsInMaterials }) => {
	const t = useTranslations('materials')
	const router = useRouter()
	const params = useParams()
	const { isDark } = useThemeMode()
	const { section } = params
	const { userProfile } = useUserContext()
	const locale = useLocale()

	// Handle responsive display
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const mediaQuery = window.matchMedia('(max-width: 640px)')
		setIsMobile(mediaQuery.matches)

		const handler = e => setIsMobile(e.matches)
		mediaQuery.addEventListener('change', handler)
		return () => mediaQuery.removeEventListener('change', handler)
	}, [])

	// Get translated title based on user's spoken language
	const getTranslatedTitle = (material) => {
		const spokenLanguage = userProfile?.spoken_language || locale || 'fr'

		if (spokenLanguage === 'fr') return material.title_fr
		if (spokenLanguage === 'en') return material.title_en
		if (spokenLanguage === 'ru') return material.title_ru

		// Fallback
		return material.title_fr || material.title_en || material.title
	}

	const handleRowClick = material => {
		router.push(`/materials/${material.section}/${material.id}`)
	}

	const getIcon = (sectionName) => {
		if (sections.audio.includes(sectionName)) {
			return <Headphones className="w-5 h-5 text-violet-500" />
		}
		if (sections.music.includes(sectionName)) {
			return <Music className="w-5 h-5 text-violet-500" />
		}
		if (sections.video.includes(sectionName)) {
			return <Film className="w-5 h-5 text-violet-500" />
		}
		return <BookOpen className="w-5 h-5 text-violet-500" />
	}

	const getLevelColors = level => {
		switch (level) {
			case 'beginner':
				return { bg: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-emerald-600', color: '#10b981' }
			case 'intermediate':
				return { bg: 'bg-violet-500', border: 'border-violet-500', text: 'text-violet-600', color: '#a855f7' }
			case 'advanced':
				return { bg: 'bg-amber-500', border: 'border-amber-500', text: 'text-amber-600', color: '#fbbf24' }
			default:
				return { bg: 'bg-violet-500', border: 'border-violet-500', text: 'text-violet-600', color: '#8b5cf6' }
		}
	}

	const getRarity = level => {
		if (level === 'advanced') return 'legendary'
		if (level === 'intermediate') return 'epic'
		return 'common'
	}

	const getStatusIcon = materialId => {
		const status = checkIfUserMaterialIsInMaterials(materialId)
		if (!status) return null

		if (status.is_studied) {
			return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
		}
		if (status.is_being_studied) {
			return <Clock className="w-5 h-5 text-violet-500" />
		}
		return null
	}

	// Rarity-based gradient styles for mobile cards
	const getRarityGradient = (rarity) => {
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

	const getRarityBorder = (rarity) => {
		if (rarity === 'legendary') return 'border-amber-500/60'
		if (rarity === 'epic') return 'border-violet-500/50'
		return 'border-emerald-500/40'
	}

	const getRarityShadow = (rarity) => {
		if (rarity === 'legendary') {
			return isDark
				? 'shadow-[0_6px_24px_rgba(251,191,36,0.4),0_0_40px_rgba(251,191,36,0.15)]'
				: 'shadow-[0_6px_20px_rgba(251,191,36,0.25),0_2px_10px_rgba(251,191,36,0.15)]'
		}
		if (rarity === 'epic') {
			return isDark
				? 'shadow-[0_6px_24px_rgba(168,85,247,0.35),0_0_40px_rgba(168,85,247,0.12)]'
				: 'shadow-[0_6px_20px_rgba(168,85,247,0.2),0_2px_10px_rgba(168,85,247,0.12)]'
		}
		return isDark
			? 'shadow-[0_6px_24px_rgba(16,185,129,0.2),0_0_40px_rgba(16,185,129,0.08)]'
			: 'shadow-[0_6px_20px_rgba(16,185,129,0.15),0_2px_10px_rgba(16,185,129,0.08)]'
	}

	const getTitleGradient = (rarity) => {
		if (isDark) {
			if (rarity === 'legendary') return 'from-amber-400 via-yellow-300 to-amber-400'
			if (rarity === 'epic') return 'from-violet-400 via-purple-300 to-violet-400'
			return 'from-emerald-400 via-green-300 to-emerald-400'
		}
		return 'from-violet-600 via-purple-500 to-violet-600'
	}

	// Mobile version - compact card list
	if (isMobile) {
		return (
			<div className="flex flex-col gap-3">
				{materials.map((material) => {
					const rarity = getRarity(material.level)
					const levelColors = getLevelColors(material.level)
					const status = checkIfUserMaterialIsInMaterials(material.id)
					const translatedTitle = getTranslatedTitle(material)

					return (
						<button
							key={material.id}
							onClick={() => handleRowClick(material)}
							className={cn(
								'relative p-0 rounded-2xl cursor-pointer overflow-hidden text-left',
								'border-2 transition-all duration-400',
								getRarityBorder(rarity),
								'bg-gradient-to-br',
								getRarityGradient(rarity),
								getRarityShadow(rarity),
								'hover:-translate-y-1 hover:scale-[1.01]',
								'active:scale-[0.98]'
							)}
						>
							{/* Status badge */}
							{status?.is_being_studied && (
								<div
									className={cn(
										'absolute top-2 right-2 z-[10]',
										'p-1.5 rounded-full',
										'border-2 border-violet-500/60',
										isDark
											? 'bg-gradient-to-br from-slate-900/98 to-purple-950/95'
											: 'bg-gradient-to-br from-white/98 to-violet-50/95',
										'shadow-[0_3px_15px_rgba(168,85,247,0.5),0_0_20px_rgba(168,85,247,0.3)]'
									)}
								>
									<Clock className="w-4 h-4 text-violet-500" />
								</div>
							)}
							{status?.is_studied && (
								<div
									className={cn(
										'absolute top-2 right-2 z-[10]',
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

							<div className="flex gap-3 items-center p-3 relative z-[1]">
								{/* Image */}
								<div
									className={cn(
										'w-[90px] h-[90px] flex-shrink-0 rounded-lg overflow-hidden',
										'border-2',
										levelColors.border,
										isDark
											? 'shadow-[0_4px_16px_rgba(0,0,0,0.3)]'
											: 'shadow-[0_4px_16px_rgba(0,0,0,0.15)]'
									)}
								>
									<img
										src={getMaterialImageUrl(material)}
										alt={material.title}
										className="w-full h-full object-cover"
									/>
								</div>

								{/* Content */}
								<div className="flex-1 min-w-0 flex flex-col justify-between">
									{/* Original title */}
									<h3
										className={cn(
											'text-[0.95rem] font-extrabold leading-tight',
											'uppercase tracking-wide',
											'bg-gradient-to-r bg-clip-text text-transparent',
											getTitleGradient(rarity),
											'pr-6',
											translatedTitle && translatedTitle !== material.title ? 'mb-0.5' : 'mb-2'
										)}
									>
										{material.title}
									</h3>

									{/* Translated title */}
									{translatedTitle && translatedTitle !== material.title && (
										<p
											className={cn(
												'text-[0.75rem] font-medium leading-tight mb-2 pr-6',
												isDark ? 'text-slate-400/60' : 'text-slate-500/70'
											)}
										>
											{translatedTitle}
										</p>
									)}

									<div>
										<div className="flex items-center gap-2 justify-between mb-1">
											<span
												className={cn(
													'text-[0.75rem] font-semibold capitalize',
													isDark ? 'text-slate-400' : 'text-slate-500'
												)}
											>
												{material.section}
											</span>
											<span
												className={cn(
													'px-2 py-0.5 rounded-md',
													'text-[0.65rem] font-extrabold uppercase tracking-wider',
													'border-[1.5px]',
													levelColors.bg + '/15',
													levelColors.border,
													levelColors.text,
													isDark
														? 'bg-gradient-to-br from-slate-900/98 to-slate-800/95 backdrop-blur-xl'
														: 'bg-gradient-to-br from-white/98 to-slate-50/95 backdrop-blur-xl'
												)}
											>
												{t(material.level)}
											</span>
										</div>

										{/* Decorative divider */}
										<div className="flex items-center justify-center gap-1 opacity-80 mt-3 -mb-1">
											<div
												className={cn(
													'flex-1 h-px',
													'bg-gradient-to-r from-transparent',
													rarity === 'legendary'
														? 'to-amber-500/50'
														: rarity === 'epic'
														? 'to-violet-500/40'
														: 'to-emerald-500/30'
												)}
											/>
											<div
												className={cn(
													'w-[3px] h-[3px] rotate-45',
													levelColors.bg
												)}
												style={{ boxShadow: `0 0 4px ${levelColors.color}` }}
											/>
											<div
												className={cn(
													'w-0.5 h-0.5 rounded-full opacity-60',
													levelColors.bg
												)}
											/>
											<div
												className={cn(
													'w-[3px] h-[3px] rotate-45',
													levelColors.bg
												)}
												style={{ boxShadow: `0 0 4px ${levelColors.color}` }}
											/>
											<div
												className={cn(
													'flex-1 h-px',
													'bg-gradient-to-l from-transparent',
													rarity === 'legendary'
														? 'to-amber-500/50'
														: rarity === 'epic'
														? 'to-violet-500/40'
														: 'to-emerald-500/30'
												)}
											/>
										</div>
									</div>
								</div>
							</div>
						</button>
					)
				})}
			</div>
		)
	}

	// Desktop version - table
	return (
		<div
			className={cn(
				'rounded-2xl overflow-hidden',
				'border',
				isDark
					? 'border-violet-500/30 shadow-[0_4px_20px_rgba(139,92,246,0.2)]'
					: 'border-violet-500/20 shadow-[0_4px_20px_rgba(139,92,246,0.1)]',
				isDark
					? 'bg-gradient-to-br from-slate-800/95 to-slate-900/90'
					: 'bg-white'
			)}
		>
			<table className="w-full">
				<thead>
					<tr className="bg-gradient-to-r from-violet-500 to-cyan-500">
						<th className="text-left text-white font-bold text-[0.95rem] py-3 px-4 w-[60px]">
							{/* Empty for icon */}
						</th>
						<th className="text-left text-white font-bold text-[0.95rem] py-3 px-4">
							Title
						</th>
						<th className="text-left text-white font-bold text-[0.95rem] py-3 px-4 w-[150px]">
							Section
						</th>
						<th className="text-center text-white font-bold text-[0.95rem] py-3 px-4 w-[120px]">
							Level
						</th>
						<th className="text-center text-white font-bold text-[0.95rem] py-3 px-4 w-[80px]">
							Status
						</th>
					</tr>
				</thead>
				<tbody>
					{materials.map((material, index) => {
						const levelColors = getLevelColors(material.level)
						const translatedTitle = getTranslatedTitle(material)

						return (
							<tr
								key={material.id}
								onClick={() => handleRowClick(material)}
								className={cn(
									'cursor-pointer transition-all duration-300',
									index % 2 === 0
										? 'bg-violet-500/[0.03]'
										: isDark
										? 'bg-slate-900/50'
										: 'bg-white',
									'hover:bg-violet-500/[0.08] hover:scale-[1.005]',
									'hover:shadow-[0_4px_12px_rgba(139,92,246,0.15)]',
									'active:scale-[0.99]'
								)}
							>
								{/* Image Column */}
								<td className="py-3 px-4">
									<div className="w-[50px] h-[50px] rounded-lg overflow-hidden shadow-md">
										<img
											src={getMaterialImageUrl(material)}
											alt={material.title}
											className="w-full h-full object-cover"
										/>
									</div>
								</td>

								{/* Title Column */}
								<td className="py-3 px-4">
									<div className="flex items-center gap-3">
										{getIcon(material.section)}
										<div>
											<h4
												className={cn(
													'text-base font-bold',
													'bg-gradient-to-r from-indigo-950 via-violet-500 to-cyan-500',
													'bg-clip-text text-transparent',
													translatedTitle && translatedTitle !== material.title ? 'mb-0.5' : ''
												)}
											>
												{material.title}
											</h4>
											{translatedTitle && translatedTitle !== material.title && (
												<p
													className={cn(
														'text-[0.75rem] font-medium leading-tight',
														isDark ? 'text-slate-400/60' : 'text-slate-500/70'
													)}
												>
													{translatedTitle}
												</p>
											)}
										</div>
									</div>
								</td>

								{/* Section Column */}
								<td className="py-3 px-4">
									<span
										className={cn(
											'text-[0.9rem] font-semibold',
											isDark ? 'text-slate-400' : 'text-slate-500'
										)}
									>
										{material.section}
									</span>
								</td>

								{/* Level Column */}
								<td className="py-3 px-4 text-center">
									<span
										className={cn(
											'inline-block px-3 py-1 rounded-full',
											'text-white font-semibold text-[0.85rem]',
											levelColors.bg,
											'shadow-md'
										)}
									>
										{t(material.level)}
									</span>
								</td>

								{/* Status Column */}
								<td className="py-3 px-4 text-center">
									{getStatusIcon(material.id)}
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}

export default React.memo(MaterialsTable)
