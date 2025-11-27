'use client'

import { useRouterCompat } from '@/hooks/shared/useRouterCompat'
import { useTranslations, useLocale } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
	Flame,
	Star,
	Sparkles,
	ChevronRight,
	Scroll,
	Gem,
	Trophy,
	// Progression icons
	Sprout,      // Débutant - une pousse qui commence
	Sword,       // Intermédiaire - une épée de guerrier
	Castle,      // Avancé - un château de champion
} from 'lucide-react'

const MethodPageClient = ({ levels, userAccess }) => {
	const router = useRouterCompat()
	const t = useTranslations('common')
	const locale = useLocale()
	const { isDark } = useThemeMode()

	// Check if user has access to a level
	const hasAccessToLevel = (levelId) => {
		const level = levels.find((l) => l.id === levelId)
		if (level?.is_free) return true
		return userAccess.some((access) => access.level_id === levelId)
	}

	// Gaming/Fantasy config by level - Progression visuelle claire
	// Slugs from DB: beginner, intermediate, advanced
	const levelConfig = {
		beginner: {
			icon: Sprout,        // 🌱 Pousse - Le début du voyage
			rank: '🌱 APPRENTI',
			gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
			glowColor: 'emerald',
			bgPattern: 'radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)',
			xpReward: '500 XP',
			questCount: 10,
			difficulty: 1,
		},
		intermediate: {
			icon: Sword,         // ⚔️ Épée - Le guerrier en formation
			rank: '⚔️ GUERRIER',
			gradient: 'from-amber-400 via-orange-500 to-red-500',
			glowColor: 'amber',
			bgPattern: 'radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.15) 0%, transparent 50%)',
			xpReward: '1000 XP',
			questCount: 15,
			difficulty: 2,
		},
		advanced: {
			icon: Castle,        // 🏰 Château - Le maître qui règne
			rank: '🏰 MAÎTRE',
			gradient: 'from-violet-400 via-purple-500 to-fuchsia-600',
			glowColor: 'violet',
			bgPattern: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
			xpReward: '2000 XP',
			questCount: 20,
			difficulty: 3,
		},
	}

	const handleLevelClick = (level) => {
		router.push(`/${locale}/method/${level.slug}`)
	}

	// Render difficulty stars
	const renderDifficulty = (level) => {
		return (
			<div className="flex items-center gap-1">
				{[1, 2, 3].map((star) => (
					<Star
						key={star}
						className={cn(
							'w-4 h-4 transition-all',
							star <= level
								? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]'
								: isDark
									? 'text-slate-700'
									: 'text-slate-300'
						)}
					/>
				))}
			</div>
		)
	}

	return (
		<div className={cn(
			'min-h-screen relative overflow-hidden',
			isDark ? 'bg-slate-950' : 'bg-gradient-to-b from-slate-50 to-white'
		)}>
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{/* Floating particles */}
				<div className={cn(
					'absolute top-20 left-10 w-2 h-2 rounded-full animate-pulse',
					isDark ? 'bg-violet-500/50' : 'bg-violet-400/30'
				)} style={{ animationDelay: '0s', animationDuration: '3s' }} />
				<div className={cn(
					'absolute top-40 right-20 w-3 h-3 rounded-full animate-pulse',
					isDark ? 'bg-cyan-500/50' : 'bg-cyan-400/30'
				)} style={{ animationDelay: '1s', animationDuration: '4s' }} />
				<div className={cn(
					'absolute top-60 left-1/4 w-2 h-2 rounded-full animate-pulse',
					isDark ? 'bg-amber-500/50' : 'bg-amber-400/30'
				)} style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
				<div className={cn(
					'absolute top-32 right-1/3 w-1.5 h-1.5 rounded-full animate-pulse',
					isDark ? 'bg-emerald-500/50' : 'bg-emerald-400/30'
				)} style={{ animationDelay: '0.5s', animationDuration: '2.5s' }} />

				{/* Large gradient orbs */}
				<div className={cn(
					'absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl',
					isDark ? 'bg-violet-600/20' : 'bg-violet-300/30'
				)} />
				<div className={cn(
					'absolute top-1/2 -left-40 w-80 h-80 rounded-full blur-3xl',
					isDark ? 'bg-cyan-600/15' : 'bg-cyan-300/20'
				)} />
				<div className={cn(
					'absolute -bottom-20 right-1/4 w-72 h-72 rounded-full blur-3xl',
					isDark ? 'bg-amber-600/10' : 'bg-amber-300/20'
				)} />
			</div>

			{/* Hero Section */}
			<section className="pt-24 md:pt-32 pb-8 md:pb-12 relative z-10">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						{/* Epic Badge */}
						<div className={cn(
							'inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8',
							'backdrop-blur-sm border',
							isDark
								? 'bg-violet-500/10 border-violet-500/30'
								: 'bg-violet-100/80 border-violet-200'
						)}>
							<Flame className={cn(
								'w-5 h-5 animate-pulse',
								isDark ? 'text-orange-400' : 'text-orange-500'
							)} />
							<span className={cn(
								'text-sm font-bold tracking-wide uppercase',
								isDark ? 'text-violet-300' : 'text-violet-700'
							)}>
								{t('methode_proven_method')}
							</span>
							<Sparkles className={cn(
								'w-4 h-4',
								isDark ? 'text-amber-400' : 'text-amber-500'
							)} />
						</div>

						{/* Epic Title */}
						<h1 className={cn(
							'text-5xl sm:text-6xl md:text-7xl font-black mb-6',
							'tracking-tight leading-none'
						)}>
							<span className={cn(
								'bg-clip-text text-transparent',
								'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500',
								'drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]'
							)}>
								{t('methode_title')}
							</span>
						</h1>

						{/* Subtitle with quest framing */}
						<p className={cn(
							'text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed mb-8',
							isDark ? 'text-slate-300' : 'text-slate-600'
						)}>
							{t('methode_subtitle')}
						</p>

						{/* Stats bar */}
						<div className={cn(
							'inline-flex items-center gap-6 sm:gap-10 px-6 py-4 rounded-2xl',
							'backdrop-blur-md border',
							isDark
								? 'bg-slate-900/60 border-slate-700/50'
								: 'bg-white/60 border-slate-200/50'
						)}>
							<div className="text-center">
								<div className={cn(
									'text-2xl sm:text-3xl font-black',
									'bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent'
								)}>
									3
								</div>
								<div className={cn(
									'text-xs sm:text-sm font-medium uppercase tracking-wide',
									isDark ? 'text-slate-400' : 'text-slate-500'
								)}>
									Royaumes
								</div>
							</div>
							<div className={cn(
								'w-px h-10',
								isDark ? 'bg-slate-700' : 'bg-slate-200'
							)} />
							<div className="text-center">
								<div className={cn(
									'text-2xl sm:text-3xl font-black',
									'bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent'
								)}>
									45+
								</div>
								<div className={cn(
									'text-xs sm:text-sm font-medium uppercase tracking-wide',
									isDark ? 'text-slate-400' : 'text-slate-500'
								)}>
									Quêtes
								</div>
							</div>
							<div className={cn(
								'w-px h-10',
								isDark ? 'bg-slate-700' : 'bg-slate-200'
							)} />
							<div className="text-center">
								<div className={cn(
									'text-2xl sm:text-3xl font-black',
									'bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent'
								)}>
									3500
								</div>
								<div className={cn(
									'text-xs sm:text-sm font-medium uppercase tracking-wide',
									isDark ? 'text-slate-400' : 'text-slate-500'
								)}>
									XP Total
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Quest Cards Section */}
			<section className="py-12 md:py-16 relative z-10">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Section Title */}
					<div className="text-center mb-12">
						<div className="inline-flex items-center gap-3 mb-4">
							<Scroll className={cn(
								'w-6 h-6',
								isDark ? 'text-amber-400' : 'text-amber-600'
							)} />
							<h2 className={cn(
								'text-3xl sm:text-4xl font-bold',
								isDark ? 'text-white' : 'text-slate-900'
							)}>
								{t('methode_cta')}
							</h2>
							<Scroll className={cn(
								'w-6 h-6',
								isDark ? 'text-amber-400' : 'text-amber-600'
							)} />
						</div>
						<p className={cn(
							'text-lg max-w-2xl mx-auto',
							isDark ? 'text-slate-400' : 'text-slate-600'
						)}>
							{t('methode_flexible_desc')}
						</p>
					</div>

					{/* Quest Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
						{levels.map((level, index) => {
							const config = levelConfig[level.slug] || levelConfig.beginner
							const LevelIcon = config.icon
							const nameKey = `name_${locale}`
							const descKey = `description_${locale}`
							const hasAccess = hasAccessToLevel(level.id)

							return (
								<div
									key={level.id}
									className="group relative"
									style={{ animationDelay: `${index * 150}ms` }}
								>
									{/* Glow effect */}
									<div className={cn(
										'absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl',
										`bg-gradient-to-r ${config.gradient}`
									)} />

									{/* Card */}
									<div
										onClick={() => handleLevelClick(level)}
										className={cn(
											'relative cursor-pointer rounded-2xl overflow-hidden',
											'border-2 transition-all duration-500',
											'hover:scale-[1.02] hover:-translate-y-2',
											isDark
												? 'bg-slate-900/90 border-slate-700/50 hover:border-slate-600'
												: 'bg-white/90 border-slate-200 hover:border-slate-300',
											'backdrop-blur-sm'
										)}
										style={{ background: isDark ? config.bgPattern : undefined }}
									>
										{/* Top gradient bar */}
										<div className={cn(
											'h-1.5 w-full bg-gradient-to-r',
											config.gradient
										)} />

										{/* Card content */}
										<div className="p-6 sm:p-8">
											{/* Header with icon and rank */}
											<div className="flex items-start justify-between mb-6">
												{/* Icon container with glow */}
												<div className="relative">
													<div className={cn(
														'absolute inset-0 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity',
														`bg-gradient-to-br ${config.gradient}`
													)} />
													<div className={cn(
														'relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center',
														'bg-gradient-to-br shadow-2xl',
														'transform group-hover:rotate-6 transition-transform duration-300',
														config.gradient
													)}>
														<LevelIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg" />
													</div>
												</div>

												{/* Rank badge */}
												<div className={cn(
													'px-3 py-1.5 rounded-full text-xs font-bold tracking-wider',
													'border backdrop-blur-sm',
													isDark
														? 'bg-slate-800/80 border-slate-600 text-slate-200'
														: 'bg-slate-100/80 border-slate-200 text-slate-700'
												)}>
													{config.rank}
												</div>
											</div>

											{/* Title */}
											<h3 className={cn(
												'text-2xl sm:text-3xl font-bold mb-3',
												isDark ? 'text-white' : 'text-slate-900'
											)}>
												{level[nameKey]}
											</h3>

											{/* Description */}
											<p className={cn(
												'text-sm sm:text-base leading-relaxed mb-6',
												isDark ? 'text-slate-400' : 'text-slate-600'
											)}>
												{level[descKey]}
											</p>

											{/* Stats row */}
											<div className={cn(
												'flex items-center justify-between py-4 px-4 rounded-xl mb-6',
												isDark ? 'bg-slate-800/50' : 'bg-slate-50'
											)}>
												{/* Difficulty */}
												<div className="flex flex-col items-center gap-1">
													<span className={cn(
														'text-xs font-medium uppercase tracking-wide',
														isDark ? 'text-slate-500' : 'text-slate-400'
													)}>
														Difficulté
													</span>
													{renderDifficulty(config.difficulty)}
												</div>

												{/* Divider */}
												<div className={cn(
													'w-px h-10',
													isDark ? 'bg-slate-700' : 'bg-slate-200'
												)} />

												{/* Quests count */}
												<div className="flex flex-col items-center gap-1">
													<span className={cn(
														'text-xs font-medium uppercase tracking-wide',
														isDark ? 'text-slate-500' : 'text-slate-400'
													)}>
														Quêtes
													</span>
													<span className={cn(
														'text-lg font-bold',
														isDark ? 'text-white' : 'text-slate-900'
													)}>
														{config.questCount}
													</span>
												</div>

												{/* Divider */}
												<div className={cn(
													'w-px h-10',
													isDark ? 'bg-slate-700' : 'bg-slate-200'
												)} />

												{/* XP Reward */}
												<div className="flex flex-col items-center gap-1">
													<span className={cn(
														'text-xs font-medium uppercase tracking-wide',
														isDark ? 'text-slate-500' : 'text-slate-400'
													)}>
														Récompense
													</span>
													<span className={cn(
														'text-lg font-bold',
														'bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent'
													)}>
														{config.xpReward}
													</span>
												</div>
											</div>

											{/* CTA Button */}
											<Button
												className={cn(
													'w-full py-6 text-base font-bold tracking-wide',
													'bg-gradient-to-r shadow-lg',
													'hover:shadow-2xl hover:scale-[1.02]',
													'transition-all duration-300',
													'group/btn',
													config.gradient
												)}
											>
												<span className="flex items-center gap-2">
													Commencer la quête
													<ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
												</span>
											</Button>
										</div>

										{/* Decorative corner element */}
										<div className={cn(
											'absolute top-0 right-0 w-20 h-20 opacity-10',
											'bg-gradient-to-bl',
											config.gradient
										)} style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</section>

			{/* Benefits Section - RPG Style */}
			<section className={cn(
				'py-16 md:py-24 relative z-10',
				isDark ? 'bg-slate-900/30' : 'bg-slate-50/50'
			)}>
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Section header */}
					<div className="text-center mb-16">
						<div className={cn(
							'inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6',
							'border backdrop-blur-sm',
							isDark
								? 'bg-amber-500/10 border-amber-500/30'
								: 'bg-amber-100/80 border-amber-200'
						)}>
							<Trophy className={cn(
								'w-5 h-5',
								isDark ? 'text-amber-400' : 'text-amber-600'
							)} />
							<span className={cn(
								'text-sm font-bold uppercase tracking-wide',
								isDark ? 'text-amber-300' : 'text-amber-700'
							)}>
								Avantages
							</span>
						</div>
						<h2 className={cn(
							'text-3xl sm:text-4xl md:text-5xl font-bold mb-4',
							isDark ? 'text-white' : 'text-slate-900'
						)}>
							{t('methode_why_title')}
						</h2>
					</div>

					{/* Benefits grid */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{/* Benefit 1 - Proven Method */}
						<div className="group text-center">
							<div className="relative inline-block mb-6">
								<div className={cn(
									'absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity',
									'bg-gradient-to-br from-violet-500 to-purple-600'
								)} />
								<div className={cn(
									'relative w-24 h-24 rounded-2xl flex items-center justify-center',
									'bg-gradient-to-br from-violet-500 to-purple-600',
									'shadow-2xl shadow-violet-500/30',
									'transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300'
								)}>
									<Scroll className="w-12 h-12 text-white" />
								</div>
							</div>
							<h3 className={cn(
								'text-xl font-bold mb-3',
								isDark ? 'text-white' : 'text-slate-900'
							)}>
								{t('methode_proven_method')}
							</h3>
							<p className={cn(
								'leading-relaxed',
								isDark ? 'text-slate-400' : 'text-slate-600'
							)}>
								{t('methode_proven_desc')}
							</p>
						</div>

						{/* Benefit 2 - Interactive */}
						<div className="group text-center">
							<div className="relative inline-block mb-6">
								<div className={cn(
									'absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity',
									'bg-gradient-to-br from-amber-500 to-orange-600'
								)} />
								<div className={cn(
									'relative w-24 h-24 rounded-2xl flex items-center justify-center',
									'bg-gradient-to-br from-amber-500 to-orange-600',
									'shadow-2xl shadow-amber-500/30',
									'transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300'
								)}>
									<Sword className="w-12 h-12 text-white" />
								</div>
							</div>
							<h3 className={cn(
								'text-xl font-bold mb-3',
								isDark ? 'text-white' : 'text-slate-900'
							)}>
								{t('methode_interactive')}
							</h3>
							<p className={cn(
								'leading-relaxed',
								isDark ? 'text-slate-400' : 'text-slate-600'
							)}>
								{t('methode_interactive_desc')}
							</p>
						</div>

						{/* Benefit 3 - Flexible */}
						<div className="group text-center">
							<div className="relative inline-block mb-6">
								<div className={cn(
									'absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity',
									'bg-gradient-to-br from-emerald-500 to-teal-600'
								)} />
								<div className={cn(
									'relative w-24 h-24 rounded-2xl flex items-center justify-center',
									'bg-gradient-to-br from-emerald-500 to-teal-600',
									'shadow-2xl shadow-emerald-500/30',
									'transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300'
								)}>
									<Gem className="w-12 h-12 text-white" />
								</div>
							</div>
							<h3 className={cn(
								'text-xl font-bold mb-3',
								isDark ? 'text-white' : 'text-slate-900'
							)}>
								{t('methode_flexible')}
							</h3>
							<p className={cn(
								'leading-relaxed',
								isDark ? 'text-slate-400' : 'text-slate-600'
							)}>
								{t('methode_flexible_desc')}
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}

export default MethodPageClient
