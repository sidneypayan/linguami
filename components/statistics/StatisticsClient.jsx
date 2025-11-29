'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { getUIImageUrl } from '@/utils/mediaUrls'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import {
	Flame,
	Coins,
	Trophy,
	Target,
	Book,
	Map,
	CheckCircle,
	RefreshCw,
	Star,
	ChevronDown,
	ChevronUp,
	Sparkles,
	Zap,
	Crown,
	Shield,
	Sword,
	Swords,
	Scroll,
	Gem,
	Castle,
	Wand2,
	BookOpen,
	Lock,
	Unlock,
	Award,
	Medal,
	CircleDot,
	MessageSquareText,
	Type,
	FileText,
} from 'lucide-react'

// ============================================
// RANK SYSTEM - Character Classes
// ============================================
const getRankInfo = (level) => {
	if (level < 6) return {
		title: 'APPRENTI LINGUISTE',
		subtitle: 'Les premiers pas du voyage',
		icon: Sword,
		color: 'from-violet-600 to-purple-800',
		glow: 'shadow-violet-600/50',
		badge: 'bg-violet-700'
	}
	if (level < 11) return {
		title: 'GUERRIER DES MOTS',
		subtitle: 'La force du vocabulaire',
		icon: Shield,
		color: 'from-emerald-400 to-emerald-600',
		glow: 'shadow-emerald-400/50',
		badge: 'bg-emerald-500'
	}
	if (level < 21) return {
		title: 'CHEVALIER POLYGLOTTE',
		subtitle: 'Gardien des langues',
		icon: Swords,
		color: 'from-blue-400 to-blue-600',
		glow: 'shadow-blue-400/50',
		badge: 'bg-blue-500'
	}
	if (level < 31) return {
		title: 'ARCHIMAGE VERBAL',
		subtitle: 'Maitre des incantations',
		icon: Wand2,
		color: 'from-violet-400 to-violet-600',
		glow: 'shadow-violet-400/50',
		badge: 'bg-violet-500'
	}
	if (level < 51) return {
		title: 'DRAGON LEGENDAIRE',
		subtitle: 'Terreur des examens',
		icon: Crown,
		color: 'from-amber-400 to-amber-600',
		glow: 'shadow-amber-400/50',
		badge: 'bg-amber-500'
	}
	return {
		title: 'DIVINITE LINGUISTIQUE',
		subtitle: 'Au-dela de la maitrise',
		icon: Sparkles,
		color: 'from-rose-400 via-purple-500 to-cyan-400',
		glow: 'shadow-rose-400/50',
		badge: 'bg-gradient-to-r from-rose-500 to-cyan-500'
	}
}

// ============================================
// MAGICAL CRYSTAL ORB - Animated Power Source
// ============================================
const MagicCrystal = ({ value, maxValue, displayValue, label, type, icon: Icon, isDark }) => {
	const fillPercent = maxValue ? Math.min((value / maxValue) * 100, 100) : 100
	const shownValue = displayValue !== undefined ? displayValue : value

	const crystalConfig = {
		xp: {
			baseColor: 'from-blue-600 via-cyan-500 to-blue-400',
			glowColor: 'shadow-cyan-500/60',
			particleColor: 'bg-cyan-400',
			ringColor: 'ring-cyan-400/50',
			textColor: isDark ? 'text-white' : 'text-cyan-700',
			shadowColor: 'drop-shadow-[0_2px_8px_rgba(6,182,212,0.8)]',
		},
		streak: {
			baseColor: 'from-orange-600 via-amber-500 to-yellow-400',
			glowColor: 'shadow-orange-500/60',
			particleColor: 'bg-orange-400',
			ringColor: 'ring-orange-400/50',
			textColor: isDark ? 'text-white' : 'text-orange-700',
			shadowColor: 'drop-shadow-[0_2px_8px_rgba(249,115,22,0.8)]',
		},
		gold: {
			baseColor: 'from-yellow-600 via-amber-400 to-yellow-300',
			glowColor: 'shadow-amber-400/60',
			particleColor: 'bg-amber-300',
			ringColor: 'ring-amber-400/50',
			textColor: isDark ? 'text-white' : 'text-amber-700',
			shadowColor: 'drop-shadow-[0_2px_8px_rgba(245,158,11,0.8)]',
		},
	}

	const config = crystalConfig[type]

	return (
		<div className="flex flex-col items-center">
			{/* Crystal Container */}
			<div className="relative">
				{/* Crystal shape */}
				<div className={cn(
					'relative w-40 h-40 md:w-48 md:h-48',
					'rounded-full overflow-hidden',
					'ring-4',
					config.ringColor
				)}>
					{/* Inner glow background */}
					<div className={cn(
						'absolute inset-0',
						'bg-gradient-to-br',
						isDark ? 'from-slate-900 via-slate-800 to-slate-900' : 'from-slate-100 via-white to-slate-100'
					)} />

					{/* Magical liquid fill */}
					<div
						className={cn(
							'absolute bottom-0 left-0 right-0',
							'bg-gradient-to-t',
							config.baseColor,
							'transition-all duration-1000 ease-out'
						)}
						style={{ height: `${fillPercent}%` }}
					>
					</div>

					{/* Center content */}
					<div className="absolute inset-0 flex flex-col items-center justify-center z-10">
						<Icon className={cn(
							'w-8 h-8 md:w-10 md:h-10 mb-1',
							config.textColor
						)} />
						<span className={cn(
							'text-4xl md:text-5xl font-black',
							config.textColor
						)}>
							{typeof shownValue === 'number' ? shownValue.toLocaleString() : shownValue}
						</span>
						<span className={cn(
							'text-sm md:text-base font-extrabold uppercase tracking-widest mt-1',
							config.textColor
						)}>
							{label}
						</span>
					</div>

					{/* Glass reflection */}
					<div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
				</div>

			</div>

		</div>
	)
}

// ============================================
// QUEST SCROLL - Goals as Epic Quests
// ============================================
const QuestScroll = ({ goal, type, isDark, t }) => {
	if (!goal) return null

	const progress = Math.min((goal.current_xp / goal.target_xp) * 100, 100)
	const isComplete = progress >= 100

	const questConfig = {
		daily: {
			title: t('dailyGoal'),
			icon: CircleDot,
			rarity: 'COMMUNE',
			rarityColor: 'text-emerald-400',
			borderColor: isDark ? 'border-slate-700' : 'border-slate-200',
			progressColor: 'from-emerald-500 to-emerald-400',
			rewardBg: 'bg-emerald-100',
			rewardBorder: 'border-emerald-300',
			rewardText: isDark ? 'text-emerald-300' : 'text-emerald-600',
		},
		weekly: {
			title: t('weeklyGoal'),
			icon: Shield,
			rarity: 'RARE',
			rarityColor: 'text-blue-400',
			borderColor: isDark ? 'border-slate-700' : 'border-slate-200',
			progressColor: 'from-blue-500 to-cyan-400',
			rewardBg: 'bg-blue-100',
			rewardBorder: 'border-blue-300',
			rewardText: isDark ? 'text-blue-300' : 'text-blue-600',
		},
		monthly: {
			title: t('monthlyGoal'),
			icon: Crown,
			rarity: 'EPIQUE',
			rarityColor: 'text-violet-400',
			borderColor: isDark ? 'border-slate-700' : 'border-slate-200',
			progressColor: 'from-violet-500 to-purple-400',
			rewardBg: 'bg-violet-100',
			rewardBorder: 'border-violet-300',
			rewardText: isDark ? 'text-violet-300' : 'text-violet-600',
		},
	}

	const config = questConfig[type]
	const QuestIcon = config.icon

	return (
		<div className={cn(
			'relative rounded-xl overflow-hidden',
			'border',
			config.borderColor,
			isDark ? 'bg-slate-800/50' : 'bg-white',
			'shadow-md',
			'transition-all duration-300 hover:scale-[1.02]',
			isComplete && 'ring-2 ring-amber-400/50'
		)}>

			{/* Header with rarity */}
			<div className={cn(
				'px-4 py-2 border-b',
				isDark ? 'border-slate-700/50' : 'border-slate-200',
				'flex items-center justify-between'
			)}>
				<div className="flex items-center gap-2">
					<QuestIcon className={cn('w-5 h-5', config.rarityColor)} />
					<span className={cn('font-bold', isDark ? 'text-white' : 'text-slate-800')}>
						{config.title}
					</span>
				</div>
				<span className={cn('text-xs font-black uppercase tracking-wider', config.rarityColor)}>
					{config.rarity}
				</span>
			</div>

			{/* Quest content */}
			<div className="p-4">
				{/* Progress circle */}
				<div className="flex items-center justify-center mb-4">
					<div className="relative w-24 h-24">
						<svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
							<circle
								cx="50" cy="50" r="42"
								fill="none"
								stroke={isDark ? 'rgba(51,65,85,0.5)' : 'rgba(203,213,225,0.8)'}
								strokeWidth="8"
							/>
							<circle
								cx="50" cy="50" r="42"
								fill="none"
								stroke={`url(#quest-gradient-${type})`}
								strokeWidth="8"
								strokeLinecap="round"
								strokeDasharray={`${2 * Math.PI * 42}`}
								strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
								className="transition-all duration-1000"
							/>
							<defs>
								<linearGradient id={`quest-gradient-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
									{type === 'daily' && <><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#34d399" /></>}
									{type === 'weekly' && <><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#06b6d4" /></>}
									{type === 'monthly' && <><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#a855f7" /></>}
								</linearGradient>
							</defs>
						</svg>
						<div className="absolute inset-0 flex items-center justify-center">
							{isComplete ? (
								<Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
							) : (
								<span className={cn('text-2xl font-black', config.rarityColor)}>
									{Math.floor(progress)}%
								</span>
							)}
						</div>
					</div>
				</div>

				{/* XP info */}
				<div className="text-center">
					<p className={cn(
						'text-lg font-bold',
						isDark ? 'text-slate-200' : 'text-slate-700'
					)}>
						{goal.current_xp.toLocaleString()} / {goal.target_xp.toLocaleString()} XP
					</p>
					<p className={cn(
						'text-sm mt-1',
						isDark ? 'text-slate-400' : 'text-slate-500'
					)}>
						{isComplete
							? 'Quete accomplie !'
							: `Encore ${(goal.target_xp - goal.current_xp).toLocaleString()} XP`
						}
					</p>
				</div>

				{/* Reward preview */}
				<div className={cn(
					'mt-4 py-2 px-3 rounded-lg',
					config.rewardBg,
					'border',
					config.rewardBorder,
					'flex items-center justify-center gap-2'
				)}>
					<Gem className={cn('w-4 h-4', config.rarityColor)} />
					<span className={cn('text-sm font-medium', config.rewardText)}>
						Recompense: +{type === 'daily' ? '10' : type === 'weekly' ? '50' : '200'} Gold
					</span>
				</div>
			</div>
		</div>
	)
}

// ============================================
// TROPHY CABINET - Badges Display (Round badges)
// ============================================
const TrophyCabinet = ({ badge, category, index, isDark }) => {
	const isUnlocked = badge.isUnlocked

	return (
		<div className={cn(
			'relative group',
			'flex flex-col items-center gap-2'
		)}>
			{/* Round badge container */}
			<div className="relative">
				{/* Border wrapper */}
				<div className={cn(
					'rounded-full p-1',
					'transition-all duration-300',
					isUnlocked
						? 'bg-amber-500 group-hover:scale-110'
						: cn('opacity-70', isDark ? 'bg-slate-600' : 'bg-slate-300')
				)}>
					{/* Badge circle */}
					<div className={cn(
						'relative w-[4.5rem] h-[4.5rem] sm:w-[5.5rem] sm:h-[5.5rem]',
						'rounded-full overflow-hidden'
					)}>
						{/* Badge image - visible for both locked and unlocked */}
						<div className={cn(
							'relative w-full h-full flex items-center justify-center',
							!isUnlocked && 'grayscale-[50%] opacity-60'
						)}>
							{badge.icon}
						</div>

						{/* Subtle dark overlay for locked badges */}
						{!isUnlocked && (
							<div className={cn(
								'absolute inset-0 rounded-full',
								isDark ? 'bg-slate-900/30' : 'bg-slate-500/20'
							)} />
						)}

						{/* Shine effect for unlocked */}
						{isUnlocked && (
							<div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
						)}
					</div>
				</div>

				{/* Lock icon OUTSIDE the overflow-hidden container */}
				{!isUnlocked && (
					<div className={cn(
						'absolute -bottom-1 -right-1 w-7 h-7 rounded-full',
						'flex items-center justify-center',
						'bg-slate-600 border-2',
						isDark ? 'border-slate-500' : 'border-slate-300',
						'z-10'
					)}>
						<Lock className="w-3.5 h-3.5 text-white" />
					</div>
				)}
			</div>

			{/* Value plate */}
			<div className={cn(
				'px-3 py-1 rounded-full',
				'font-semibold text-sm tracking-wider',
				isUnlocked
					? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white'
					: cn(isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-300 text-slate-500')
			)}>
				{badge.value}
			</div>
		</div>
	)
}

// ============================================
// GRIMOIRE CARD - Vocabulary/Materials Stats
// ============================================
const GrimoireCard = ({ title, value, icon: Icon, type, isDark }) => {
	const typeConfig = {
		emerald: { gradient: 'from-emerald-600 to-emerald-500', glow: 'shadow-emerald-500/30', text: 'text-emerald-400' },
		blue: { gradient: 'from-blue-600 to-blue-500', glow: 'shadow-blue-500/30', text: 'text-blue-400' },
		amber: { gradient: 'from-amber-600 to-amber-500', glow: 'shadow-amber-500/30', text: 'text-amber-400' },
		violet: { gradient: 'from-violet-600 to-violet-500', glow: 'shadow-violet-500/30', text: 'text-violet-400' },
	}

	const config = typeConfig[type]

	return (
		<div className={cn(
			'relative rounded-xl overflow-hidden',
			'transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1',
			isDark
				? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90'
				: 'bg-gradient-to-br from-white to-slate-50',
			'border',
			isDark ? 'border-slate-700/50' : 'border-slate-200',
			'shadow-md'
		)}>
			{/* Top accent bar */}
			<div className={cn('h-1.5 bg-gradient-to-r', config.gradient)} />

			{/* Decorative corner runes */}
			<div className={cn('absolute top-2 right-2 text-lg opacity-20', config.text)}>✧</div>
			<div className={cn('absolute bottom-2 left-2 text-lg opacity-20 rotate-180', config.text)}>✧</div>

			<div className="p-5 text-center">
				{/* Icon in magical circle */}
				<div className="flex justify-center mb-4">
					<div className={cn(
						'w-16 h-16 rounded-full',
						'flex items-center justify-center',
						'bg-gradient-to-br',
						config.gradient,
						'ring-4 ring-white/10'
					)}>
						<Icon className="w-8 h-8 text-white" />
					</div>
				</div>

				{/* Value */}
				<p className={cn(
					'text-4xl font-black mb-2',
					isDark ? 'text-white' : 'text-slate-800'
				)}>
					{value}
				</p>

				{/* Title */}
				<p className={cn(
					'text-sm font-medium',
					isDark ? 'text-slate-400' : 'text-slate-500'
				)}>
					{title}
				</p>
			</div>
		</div>
	)
}

// ============================================
// MAIN COMPONENT
// ============================================
const StatisticsClient = ({ stats, xpProfile, goals, translations }) => {
	const { isDark } = useThemeMode()
	const [expandedBadges, setExpandedBadges] = useState({})

	const t = (key) => translations[key] || key

	const getNextStreakMilestone = (currentStreak) => {
		const milestones = [7, 30, 60, 90, 180, 365]
		return milestones.find(m => m > currentStreak) || 365
	}

	const streakMilestone = xpProfile ? getNextStreakMilestone(xpProfile.dailyStreak) : 7
	const rankInfo = xpProfile ? getRankInfo(xpProfile.currentLevel) : getRankInfo(0)
	const RankIcon = rankInfo.icon

	// Vocabulary cards config
	const vocabularyCards = [
		{ title: t('wordsReviewedToday'), value: stats?.wordsReviewedToday || 0, icon: MessageSquareText, type: 'emerald' },
		{ title: t('wordsReviewedThisWeek'), value: stats?.wordsReviewedThisWeek || 0, icon: Type, type: 'blue' },
		{ title: t('wordsReviewedThisMonth'), value: stats?.wordsReviewedThisMonth || 0, icon: FileText, type: 'amber' },
		{ title: t('totalWordsReviewed'), value: stats?.totalWordsReviewed || 0, icon: BookOpen, type: 'violet' },
	]

	const materialsCards = [
		{ title: t('materialsStarted'), value: stats?.materialsStarted || 0, icon: Map, type: 'blue' },
		{ title: t('materialsFinished'), value: stats?.materialsFinished || 0, icon: CheckCircle, type: 'emerald' },
	]

	// Badges configuration
	const badgesConfig = {
		levels: {
			title: t('levelBadges'),
			icon: Star,
			color: '#8b5cf6',
			badges: [5, 10, 15, 20, 30, 50, 60].map((level, index) => ({
				value: level,
				icon: (
					<Image
						src={getUIImageUrl(`xp_${index + 1}.webp`)}
						alt={`Level ${level}`}
						width={90}
						height={90}
						className="object-cover rounded-full"
					/>
				),
				isUnlocked: xpProfile ? xpProfile.currentLevel >= level : false,
			})),
		},
		reviewedWords: {
			title: t('wordsReviewedBadges'),
			icon: RefreshCw,
			color: '#3b82f6',
			badges: [50, 100, 250, 500, 1000, 5000, 10000].map((count, index) => ({
				value: count,
				icon: (
					<Image
						src={getUIImageUrl(`0${index + 1}_reviewed_words_badge.webp`)}
						alt={`${count} words`}
						width={90}
						height={90}
						className="object-cover rounded-full"
					/>
				),
				isUnlocked: stats ? (stats.totalWordsReviewed || 0) >= count : false,
			})),
		},
	}

	return (
		<div className={cn(
			'min-h-screen pt-20 md:pt-24 pb-24',
			isDark
				? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-950 via-slate-950 to-slate-950'
				: 'bg-gradient-to-b from-violet-50 via-white to-slate-50'
		)}>
			{/* Magical particles background */}
			<div className="fixed inset-0 pointer-events-none overflow-hidden">
				<div className={cn('absolute top-20 left-10 w-2 h-2 rounded-full animate-float-slow', isDark ? 'bg-violet-400/30' : 'bg-violet-300/50')} />
				<div className={cn('absolute top-40 right-20 w-1.5 h-1.5 rounded-full animate-float-medium', isDark ? 'bg-cyan-400/30' : 'bg-cyan-300/50')} />
				<div className={cn('absolute bottom-40 left-1/4 w-1 h-1 rounded-full animate-float-fast', isDark ? 'bg-amber-400/30' : 'bg-amber-300/50')} />
				<div className={cn('absolute top-1/3 right-1/3 w-2 h-2 rounded-full animate-float-slow', isDark ? 'bg-emerald-400/20' : 'bg-emerald-300/40')} />
			</div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

				{/* ============================================ */}
				{/* HERO - Character Card */}
				{/* ============================================ */}
				{xpProfile && (
					<div className={cn(
						'relative rounded-none md:rounded-3xl p-6 md:p-10 mb-8 overflow-hidden',
						isDark
							? 'bg-gradient-to-br from-slate-900/95 via-violet-950/50 to-slate-900/95'
							: 'bg-gradient-to-br from-white via-violet-50/50 to-white',
						'md:border-2',
						isDark ? 'md:border-violet-500/30' : 'md:border-violet-200',
						'md:shadow-lg'
					)}>
						{/* Decorative frame corners */}
						<div className="hidden md:block absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-violet-500/50 rounded-tl-lg" />
						<div className="hidden md:block absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-violet-500/50 rounded-tr-lg" />
						<div className="hidden md:block absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-violet-500/50 rounded-bl-lg" />
						<div className="hidden md:block absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-violet-500/50 rounded-br-lg" />

						{/* Top gradient bar */}
						<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

						{/* Character Rank Banner */}
						<div className="max-w-3xl mx-auto mb-10">
							{/* Image */}
							<div className="relative rounded-t-2xl overflow-hidden shadow-lg h-40 md:h-52">
								<div
									className="absolute inset-0"
									style={{
										backgroundImage: `url(${getUIImageUrl('statistics-rank-1.png')})`,
										backgroundSize: 'cover',
										backgroundPosition: 'center 70%',
									}}
								/>
							</div>
							{/* Text below image */}
							<div className={cn(
								'relative rounded-b-2xl py-5 px-6 text-center overflow-hidden',
								'border-x-2 border-b-2',
								isDark
									? 'bg-gradient-to-b from-slate-800 to-slate-900 border-violet-500/30'
									: 'bg-gradient-to-b from-white to-slate-50 border-violet-200'
							)}>
								{/* Decorative elements */}
								<div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
								<div className={cn(
									'absolute left-3 top-1/2 -translate-y-1/2 text-lg',
									isDark ? 'text-violet-500/30' : 'text-violet-400/40'
								)}>⚔</div>
								<div className={cn(
									'absolute right-3 top-1/2 -translate-y-1/2 text-lg',
									isDark ? 'text-violet-500/30' : 'text-violet-400/40'
								)}>⚔</div>

								<h1 className={cn(
									'text-xl md:text-2xl font-black tracking-widest uppercase',
									'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent',
									'drop-shadow-sm'
								)}
								style={{ fontFamily: 'system-ui' }}
								>
									{rankInfo.title}
								</h1>
								<p className={cn(
									'text-xs md:text-sm font-semibold mt-1 tracking-wider uppercase',
									isDark ? 'text-violet-400' : 'text-violet-500'
								)}>
									✦ {rankInfo.subtitle} ✦
								</p>
							</div>
						</div>

						{/* Power Crystals Grid */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 justify-items-center">
							{/* XP Crystal - progression vers le prochain niveau */}
							<MagicCrystal
								value={xpProfile.xpInCurrentLevel}
								maxValue={xpProfile.xpForNextLevel}
								displayValue={xpProfile.currentLevel}
								label={t('level')}
								type="xp"
								icon={Zap}
								isDark={isDark}
							/>

							{/* Streak Crystal - progression vers le prochain milestone */}
							<MagicCrystal
								value={xpProfile.dailyStreak}
								maxValue={streakMilestone}
								displayValue={xpProfile.dailyStreak}
								label={t('dayStreak')}
								type="streak"
								icon={Flame}
								isDark={isDark}
							/>

							{/* Gold Crystal - progression vers 1000 or par palier */}
							<MagicCrystal
								value={xpProfile.totalGold % 1000}
								maxValue={1000}
								displayValue={xpProfile.totalGold}
								label={t('gold')}
								type="gold"
								icon={Coins}
								isDark={isDark}
							/>
						</div>

						{/* XP Progress Bar */}
						<div className={cn(
							'mt-10 max-w-2xl mx-auto p-5 rounded-2xl',
							isDark ? 'bg-slate-800/70' : 'bg-slate-100',
							'border-2',
							isDark ? 'border-violet-500/30' : 'border-violet-200',
							'shadow-sm'
						)}>
							<div className="flex items-center justify-between mb-3">
								<span className={cn(
									'text-base font-bold',
									isDark ? 'text-slate-200' : 'text-slate-700'
								)}>
									Progression vers niveau {xpProfile.currentLevel + 1}
								</span>
								<span className={cn(
									'text-base font-black',
									isDark ? 'text-cyan-400' : 'text-cyan-600'
								)}>
									{xpProfile.xpInCurrentLevel} / {xpProfile.xpForNextLevel} XP
								</span>
							</div>
							<div className={cn(
								'h-5 rounded-full overflow-hidden',
								isDark ? 'bg-slate-700/50' : 'bg-slate-200'
							)}>
								<div
									className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 rounded-full transition-all duration-1000 relative"
									style={{ width: `${xpProfile.progressPercent}%` }}
								>
									<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
								</div>
							</div>
							<p className={cn(
								'text-center mt-3 text-base font-medium',
								isDark ? 'text-slate-300' : 'text-slate-600'
							)}>
								{xpProfile.progressPercent >= 75
									? `Plus que ${xpProfile.xpForNextLevel - xpProfile.xpInCurrentLevel} XP pour monter de niveau !`
									: xpProfile.progressPercent >= 50
									? `A mi-chemin du niveau suivant !`
									: `Continue ton aventure linguistique !`
								}
							</p>
						</div>

						{/* Record Streak */}
						{xpProfile.longestStreak > xpProfile.dailyStreak && (
							<div className={cn(
								'mt-6 text-center py-3 px-6 rounded-xl mx-auto max-w-xs',
								'bg-gradient-to-r from-amber-500/10 to-orange-500/10',
								'border border-amber-500/30'
							)}>
								<div className="flex items-center justify-center gap-2">
									<Trophy className="w-5 h-5 text-amber-400" />
									<span className={cn('font-bold', isDark ? 'text-amber-300' : 'text-amber-600')}>
										Record: {xpProfile.longestStreak} jours
									</span>
									<Trophy className="w-5 h-5 text-amber-400" />
								</div>
							</div>
						)}
					</div>
				)}

				{/* ============================================ */}
				{/* QUEST BOARD - Goals Section */}
				{/* ============================================ */}
				{goals && (
					<div className={cn(
						'relative rounded-none md:rounded-3xl p-6 md:p-8 mb-8 overflow-hidden',
						isDark
							? 'bg-gradient-to-br from-slate-900/90 to-slate-800/90'
							: 'bg-gradient-to-br from-white to-slate-50',
						'md:border-2',
						isDark ? 'md:border-amber-500/30' : 'md:border-amber-200',
						'md:shadow-lg'
					)}>
						{/* Parchment texture */}
						<div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj4KICA8ZmlsdGVyIGlkPSJub2lzZSI+CiAgICA8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBudW1PY3RhdmVzPSI0IiAvPgogIDwvZmlsdGVyPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjEiLz4KPC9zdmc+')]" />

						{/* Header */}
						<div className="flex items-center justify-center gap-4 mb-8">
							<div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-transparent to-amber-500/50" />
							<div className="flex items-center gap-3">
								<Scroll className={cn('w-8 h-8', isDark ? 'text-amber-400' : 'text-amber-600')} />
								<h2 className={cn(
									'text-2xl md:text-3xl font-black',
									'bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent'
								)}>
									Tableau des Quetes
								</h2>
								<Scroll className={cn('w-8 h-8', isDark ? 'text-amber-400' : 'text-amber-600')} />
							</div>
							<div className="hidden sm:block h-px flex-1 bg-gradient-to-l from-transparent to-amber-500/50" />
						</div>

						{/* Quest Scrolls Grid */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<QuestScroll goal={goals.daily} type="daily" isDark={isDark} t={t} />
							<QuestScroll goal={goals.weekly} type="weekly" isDark={isDark} t={t} />
							<QuestScroll goal={goals.monthly} type="monthly" isDark={isDark} t={t} />
						</div>
					</div>
				)}

				{/* ============================================ */}
				{/* TROPHY HALL - Badges Section */}
				{/* ============================================ */}
				<div className={cn(
					'relative rounded-none md:rounded-3xl p-6 md:p-8 mb-8 overflow-hidden',
					isDark
						? 'bg-gradient-to-br from-slate-900/90 to-slate-800/90'
						: 'bg-gradient-to-br from-white to-slate-50',
					'md:border-2',
					isDark ? 'md:border-violet-500/30' : 'md:border-violet-200',
					'md:shadow-lg'
				)}>
					{/* Header */}
					<div className="flex items-center justify-center gap-4 mb-8">
						<div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-transparent to-violet-500/50" />
						<div className="flex items-center gap-3">
							<Castle className={cn('w-8 h-8', isDark ? 'text-violet-400' : 'text-violet-600')} />
							<h2 className={cn(
								'text-2xl md:text-3xl font-black',
								'bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent'
							)}>
								Salle des Trophees
							</h2>
							<Castle className={cn('w-8 h-8', isDark ? 'text-violet-400' : 'text-violet-600')} />
						</div>
						<div className="hidden sm:block h-px flex-1 bg-gradient-to-l from-transparent to-violet-500/50" />
					</div>

					{/* Badge Categories */}
					<div className="space-y-8">
						{Object.entries(badgesConfig).map(([key, category]) => {
							const isExpanded = expandedBadges[key]
							const CategoryIcon = category.icon
							const unlockedCount = category.badges.filter(b => b.isUnlocked).length

							return (
								<div key={key} className={cn(
									'rounded-xl overflow-hidden',
									isDark ? 'bg-slate-800/50' : 'bg-slate-100/50',
									'border',
									isDark ? 'border-slate-700/50' : 'border-slate-200'
								)}>
									{/* Category Header */}
									<button
										onClick={() => setExpandedBadges(prev => ({ ...prev, [key]: !prev[key] }))}
										className={cn(
											'w-full flex items-center gap-4 p-4',
											'transition-colors',
											isDark ? 'hover:bg-slate-700/30' : 'hover:bg-slate-200/50'
										)}
									>
										<div
											className="w-12 h-12 rounded-xl flex items-center justify-center"
											style={{ backgroundColor: category.color }}
										>
											<CategoryIcon className="w-6 h-6 text-white" />
										</div>
										<div className="flex-1 text-left">
											<span className={cn(
												'text-lg font-bold',
												isDark ? 'text-white' : 'text-slate-800'
											)}>
												{category.title}
											</span>
											<div className="flex items-center gap-2 mt-1">
												<div className="flex gap-1">
													{category.badges.map((b, i) => (
														<div
															key={i}
															className={cn(
																'w-2 h-2 rounded-full',
																b.isUnlocked
																	? 'bg-amber-400'
																	: isDark ? 'bg-slate-600' : 'bg-slate-300'
															)}
														/>
													))}
												</div>
												<span className={cn(
													'text-sm',
													isDark ? 'text-slate-400' : 'text-slate-500'
												)}>
													{unlockedCount}/{category.badges.length}
												</span>
											</div>
										</div>
										<div className="md:hidden">
											{isExpanded ? (
												<ChevronUp className={cn('w-6 h-6', isDark ? 'text-slate-400' : 'text-slate-500')} />
											) : (
												<ChevronDown className={cn('w-6 h-6', isDark ? 'text-slate-400' : 'text-slate-500')} />
											)}
										</div>
									</button>

									{/* Badges Display */}
									<div className={cn(
										'px-4 pb-4',
										'md:block',
										isExpanded ? 'block' : 'hidden md:block'
									)}>
										<div className="flex flex-wrap gap-4 justify-center sm:justify-start pt-2">
											{category.badges.map((badge, index) => (
												<TrophyCabinet
													key={index}
													badge={badge}
													category={category}
													index={index}
													isDark={isDark}
												/>
											))}
										</div>
									</div>
								</div>
							)
						})}
					</div>
				</div>

				{/* ============================================ */}
				{/* GRIMOIRE - Vocabulary Stats */}
				{/* ============================================ */}
				<div className={cn(
					'relative rounded-none md:rounded-3xl p-6 md:p-8 mb-8 overflow-hidden',
					isDark
						? 'bg-gradient-to-br from-slate-900/90 to-slate-800/90'
						: 'bg-gradient-to-br from-white to-slate-50',
					'md:border-2',
					isDark ? 'md:border-emerald-500/30' : 'md:border-emerald-200',
					'md:shadow-lg'
				)}>
					{/* Header */}
					<div className="flex items-center justify-center gap-4 mb-8">
						<div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-transparent to-emerald-500/50" />
						<div className="flex items-center gap-3">
							<BookOpen className={cn('w-8 h-8', isDark ? 'text-emerald-400' : 'text-emerald-600')} />
							<h2 className={cn(
								'text-2xl md:text-3xl font-black',
								'bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent'
							)}>
								{t('vocabularySection')}
							</h2>
							<BookOpen className={cn('w-8 h-8', isDark ? 'text-emerald-400' : 'text-emerald-600')} />
						</div>
						<div className="hidden sm:block h-px flex-1 bg-gradient-to-l from-transparent to-emerald-500/50" />
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{vocabularyCards.map((card, index) => (
							<GrimoireCard
								key={index}
								title={card.title}
								value={card.value}
								icon={card.icon}
								type={card.type}
								isDark={isDark}
							/>
						))}
					</div>
				</div>

				{/* ============================================ */}
				{/* ADVENTURE LOG - Materials Stats */}
				{/* ============================================ */}
				<div className={cn(
					'relative rounded-none md:rounded-3xl p-6 md:p-8 overflow-hidden',
					isDark
						? 'bg-gradient-to-br from-slate-900/90 to-slate-800/90'
						: 'bg-gradient-to-br from-white to-slate-50',
					'md:border-2',
					isDark ? 'md:border-blue-500/30' : 'md:border-blue-200',
					'md:shadow-lg'
				)}>
					{/* Header */}
					<div className="flex items-center justify-center gap-4 mb-8">
						<div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-transparent to-blue-500/50" />
						<div className="flex items-center gap-3">
							<Map className={cn('w-8 h-8', isDark ? 'text-blue-400' : 'text-blue-600')} />
							<h2 className={cn(
								'text-2xl md:text-3xl font-black',
								'bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent'
							)}>
								{t('materialsSection')}
							</h2>
							<Map className={cn('w-8 h-8', isDark ? 'text-blue-400' : 'text-blue-600')} />
						</div>
						<div className="hidden sm:block h-px flex-1 bg-gradient-to-l from-transparent to-blue-500/50" />
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
						{materialsCards.map((card, index) => (
							<GrimoireCard
								key={index}
								title={card.title}
								value={card.value}
								icon={card.icon}
								type={card.type}
								isDark={isDark}
							/>
						))}
					</div>
				</div>
			</div>

			{/* Global Animations */}
			<style jsx global>{`
				@keyframes float-slow {
					0%, 100% { transform: translateY(0px) rotate(0deg); }
					50% { transform: translateY(-20px) rotate(5deg); }
				}
				@keyframes float-medium {
					0%, 100% { transform: translateY(0px) rotate(0deg); }
					50% { transform: translateY(-15px) rotate(-5deg); }
				}
				@keyframes float-fast {
					0%, 100% { transform: translateY(0px); }
					50% { transform: translateY(-10px); }
				}
				@keyframes wave-slow {
					0% { transform: translateX(0); }
					100% { transform: translateX(-50%); }
				}
				@keyframes bounce-slow {
					0%, 100% { transform: translateX(-50%) translateY(0); }
					50% { transform: translateX(-50%) translateY(-5px); }
				}
				@keyframes shimmer {
					0% { transform: translateX(-100%); }
					100% { transform: translateX(100%); }
				}
				.animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
				.animate-float-medium { animation: float-medium 4s ease-in-out infinite; }
				.animate-float-fast { animation: float-fast 3s ease-in-out infinite; }
				.animate-wave-slow { animation: wave-slow 4s linear infinite; }
				.animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
				.animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
			`}</style>
		</div>
	)
}

export default React.memo(StatisticsClient)
