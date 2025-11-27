'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { getAvatarUrl, getAvatarBorderColor } from '@/utils/avatars'
import {
	Trophy,
	TrendingUp,
	CalendarDays,
	CalendarRange,
	Coins,
	Flame,
	ChevronLeft,
	ChevronRight,
	Crown,
	Medal,
	Award,
	Sparkles,
	Zap,
	Target,
	Shield,
	Swords,
} from 'lucide-react'

// Tab configuration
const TABS = [
	{ id: 'xp', icon: TrendingUp, color: 'blue', label: 'totalXPTab', labelMobile: 'totalXPTabMobile' },
	{ id: 'weekly', icon: CalendarDays, color: 'violet', label: 'weeklyTab', labelMobile: 'weeklyTabMobile' },
	{ id: 'monthly', icon: CalendarRange, color: 'pink', label: 'monthlyTab', labelMobile: 'monthlyTabMobile' },
	{ id: 'gold', icon: Coins, color: 'amber', label: 'goldTab', labelMobile: 'goldTab' },
	{ id: 'streak', icon: Flame, color: 'emerald', label: 'streakTab', labelMobile: 'streakTab' },
]

const TAB_COLORS = {
	blue: { active: 'text-blue-500', bg: 'bg-blue-500', border: 'border-blue-500', light: 'text-blue-400', dark: 'text-blue-300' },
	violet: { active: 'text-violet-500', bg: 'bg-violet-500', border: 'border-violet-500', light: 'text-violet-400', dark: 'text-violet-300' },
	pink: { active: 'text-pink-500', bg: 'bg-pink-500', border: 'border-pink-500', light: 'text-pink-400', dark: 'text-pink-300' },
	amber: { active: 'text-amber-500', bg: 'bg-amber-500', border: 'border-amber-500', light: 'text-amber-400', dark: 'text-amber-300' },
	emerald: { active: 'text-emerald-500', bg: 'bg-emerald-500', border: 'border-emerald-500', light: 'text-emerald-400', dark: 'text-emerald-300' },
}

// Rank styling for top 3
const getRankStyle = (rank, isDark) => {
	if (rank === 1) return {
		bg: isDark ? 'bg-gradient-to-r from-amber-900/40 via-amber-800/30 to-amber-900/40' : 'bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100',
		border: 'border-l-4 border-l-amber-500',
		icon: Crown,
		color: 'text-amber-500',
		glow: 'shadow-amber-500/20',
	}
	if (rank === 2) return {
		bg: isDark ? 'bg-gradient-to-r from-slate-700/40 via-slate-600/30 to-slate-700/40' : 'bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200',
		border: 'border-l-4 border-l-slate-400',
		icon: Medal,
		color: 'text-slate-400',
		glow: 'shadow-slate-400/20',
	}
	if (rank === 3) return {
		bg: isDark ? 'bg-gradient-to-r from-orange-900/40 via-orange-800/30 to-orange-900/40' : 'bg-gradient-to-r from-orange-100 via-orange-50 to-orange-100',
		border: 'border-l-4 border-l-orange-600',
		icon: Award,
		color: 'text-orange-600',
		glow: 'shadow-orange-500/20',
	}
	return null
}

// Stat Card for user stats
const StatCard = ({ label, value, icon: Icon, gradient, isDark }) => (
	<div className={cn(
		'flex flex-col items-center justify-center p-3 rounded-xl',
		isDark ? 'bg-slate-800/50' : 'bg-slate-50',
		'border',
		isDark ? 'border-slate-700/50' : 'border-slate-200'
	)}>
		<div className={cn(
			'w-8 h-8 rounded-lg flex items-center justify-center mb-1',
			'bg-gradient-to-br',
			gradient
		)}>
			<Icon className="w-4 h-4 text-white" />
		</div>
		<span className={cn(
			'text-lg font-bold',
			isDark ? 'text-white' : 'text-slate-800'
		)}>
			{value}
		</span>
		<span className={cn(
			'text-xs font-medium uppercase tracking-wide',
			isDark ? 'text-slate-400' : 'text-slate-500'
		)}>
			{label}
		</span>
	</div>
)

// Leaderboard Row Component
const LeaderboardRow = ({ entry, tabValue, isDark, isMobile, t }) => {
	const rankStyle = getRankStyle(entry.rank, isDark)
	const isTopThree = entry.rank <= 3
	const tabColor = TAB_COLORS[TABS[tabValue].color]

	const getValueLabel = () => {
		switch (tabValue) {
			case 0:
			case 1:
			case 2:
				return `${entry.value.toLocaleString()} XP`
			case 3:
				return `${entry.value.toLocaleString()}`
			case 4:
				return `${entry.value} ${t('days')}`
			default:
				return entry.value
		}
	}

	return (
		<div className={cn(
			'flex items-center gap-3 md:gap-4 p-3 md:p-4 transition-all duration-200',
			isTopThree && rankStyle?.bg,
			isTopThree && rankStyle?.border,
			!isTopThree && (isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'),
			entry.isCurrentUser && !isTopThree && (isDark ? 'bg-violet-900/20 border-r-4 border-r-violet-500' : 'bg-violet-50 border-r-4 border-r-violet-500'),
			entry.isCurrentUser && isTopThree && 'border-r-4 border-r-violet-500',
			'border-b',
			isDark ? 'border-slate-700/50' : 'border-slate-100'
		)}>
			{/* Rank */}
			<div className="w-12 md:w-16 flex-shrink-0">
				{isTopThree ? (
					<div className={cn(
						'w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center',
						'bg-gradient-to-br',
						entry.rank === 1 && 'from-amber-400 to-amber-600',
						entry.rank === 2 && 'from-slate-300 to-slate-500',
						entry.rank === 3 && 'from-orange-400 to-orange-600',
						'shadow-lg',
						rankStyle?.glow
					)}>
						{rankStyle?.icon && <rankStyle.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />}
					</div>
				) : (
					<span className={cn(
						'text-lg md:text-xl font-bold',
						isDark ? 'text-slate-400' : 'text-slate-500'
					)}>
						#{entry.rank}
					</span>
				)}
			</div>

			{/* Avatar & Username */}
			<div className="flex items-center gap-3 flex-1 min-w-0">
				<div className="relative flex-shrink-0">
					<Image
						src={getAvatarUrl(entry.avatarId || entry.avatar_id)}
						alt={entry.username}
						width={isMobile ? 48 : 56}
						height={isMobile ? 48 : 56}
						className={cn(
							'rounded-full',
							isTopThree && 'ring-2 ring-offset-2',
							entry.rank === 1 && 'ring-amber-500',
							entry.rank === 2 && 'ring-slate-400',
							entry.rank === 3 && 'ring-orange-500',
							isDark ? 'ring-offset-slate-900' : 'ring-offset-white'
						)}
						style={{
							borderWidth: '3px',
							borderStyle: 'solid',
							borderColor: getAvatarBorderColor(entry.avatarId || entry.avatar_id)
						}}
					/>
					{isTopThree && (
						<div className={cn(
							'absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
							entry.rank === 1 && 'bg-amber-500 text-white',
							entry.rank === 2 && 'bg-slate-400 text-white',
							entry.rank === 3 && 'bg-orange-500 text-white',
						)}>
							{entry.rank}
						</div>
					)}
				</div>
				<div className="min-w-0">
					<div className="flex items-center gap-2">
						<span className={cn(
							'font-bold truncate',
							isDark ? 'text-white' : 'text-slate-800'
						)}>
							{entry.username}
						</span>
						{entry.isCurrentUser && (
							<span className={cn(
								'px-2 py-0.5 text-xs font-bold rounded-full',
								'bg-gradient-to-r from-violet-500 to-cyan-500 text-white'
							)}>
								{t('youBadge')}
							</span>
						)}
					</div>
					{!isMobile && (
						<span className={cn(
							'text-sm',
							isDark ? 'text-slate-400' : 'text-slate-500'
						)}>
							{t('levelShort')} {entry.level || 1}
						</span>
					)}
				</div>
			</div>

			{/* Level badge - mobile only in compact form */}
			{isMobile && (
				<div className={cn(
					'px-2 py-1 rounded-lg text-xs font-bold',
					'bg-gradient-to-r from-violet-500 to-purple-600 text-white'
				)}>
					{entry.level || 1}
				</div>
			)}

			{/* Value */}
			<div className="text-right flex-shrink-0">
				<span className={cn(
					'text-lg md:text-xl font-black',
					isDark ? tabColor.dark : tabColor.active
				)}>
					{getValueLabel()}
				</span>
				{tabValue === 3 && (
					<Coins className={cn('inline-block ml-1 w-4 h-4', isDark ? 'text-amber-400' : 'text-amber-500')} />
				)}
				{tabValue === 4 && (
					<Flame className={cn('inline-block ml-1 w-4 h-4', isDark ? 'text-emerald-400' : 'text-emerald-500')} />
				)}
			</div>
		</div>
	)
}

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange, isDark }) => {
	if (totalPages <= 1) return null

	const getVisiblePages = () => {
		const pages = []
		const delta = 2
		const start = Math.max(1, currentPage - delta)
		const end = Math.min(totalPages, currentPage + delta)

		for (let i = start; i <= end; i++) {
			pages.push(i)
		}
		return pages
	}

	return (
		<div className="flex items-center justify-center gap-2 py-4">
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className={cn(
					'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
					'border-2',
					currentPage === 1
						? 'opacity-40 cursor-not-allowed'
						: 'hover:scale-105',
					isDark
						? 'border-violet-500/30 bg-slate-800 text-slate-300 hover:bg-violet-900/30'
						: 'border-violet-200 bg-white text-slate-600 hover:bg-violet-50'
				)}
			>
				<ChevronLeft className="w-5 h-5" />
			</button>

			{getVisiblePages().map(page => (
				<button
					key={page}
					onClick={() => onPageChange(page)}
					className={cn(
						'w-10 h-10 rounded-xl font-bold transition-all',
						'border-2',
						page === currentPage
							? 'bg-gradient-to-br from-violet-500 to-cyan-500 text-white border-transparent shadow-lg shadow-violet-500/30 scale-110'
							: isDark
								? 'border-violet-500/30 bg-slate-800 text-slate-300 hover:bg-violet-900/30'
								: 'border-violet-200 bg-white text-slate-600 hover:bg-violet-50'
					)}
				>
					{page}
				</button>
			))}

			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className={cn(
					'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
					'border-2',
					currentPage === totalPages
						? 'opacity-40 cursor-not-allowed'
						: 'hover:scale-105',
					isDark
						? 'border-violet-500/30 bg-slate-800 text-slate-300 hover:bg-violet-900/30'
						: 'border-violet-200 bg-white text-slate-600 hover:bg-violet-50'
				)}
			>
				<ChevronRight className="w-5 h-5" />
			</button>
		</div>
	)
}

export default function LeaderboardClient({ leaderboardData, isGuest = false }) {
	const t = useTranslations('common')
	const { isDark } = useThemeMode()
	const [tabValue, setTabValue] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)
	const [isMobile, setIsMobile] = useState(false)
	const usersPerPage = 10

	useEffect(() => {
		const mediaQuery = window.matchMedia('(max-width: 640px)')
		setIsMobile(mediaQuery.matches)

		const handler = e => setIsMobile(e.matches)
		mediaQuery.addEventListener('change', handler)
		return () => mediaQuery.removeEventListener('change', handler)
	}, [])

	const handleTabChange = (newValue) => {
		setTabValue(newValue)
		setCurrentPage(1)
	}

	const handlePageChange = (value) => {
		setCurrentPage(value)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const getTabData = () => {
		if (!leaderboardData) return []
		switch (tabValue) {
			case 0: return leaderboardData.topXp
			case 1: return leaderboardData.topWeekly || []
			case 2: return leaderboardData.topMonthly || []
			case 3: return leaderboardData.topGold
			case 4: return leaderboardData.topStreak
			default: return []
		}
	}

	const getUserRank = () => {
		if (!leaderboardData?.userRanks) return null
		switch (tabValue) {
			case 0: return leaderboardData.userRanks.xp
			case 1: return leaderboardData.userRanks.weekly
			case 2: return leaderboardData.userRanks.monthly
			case 3: return leaderboardData.userRanks.gold
			case 4: return leaderboardData.userRanks.streak
			default: return null
		}
	}

	const tabData = getTabData()
	const userRank = getUserRank()
	const currentUsers = tabData.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)
	const totalPages = Math.ceil(tabData.length / usersPerPage)
	const currentTab = TABS[tabValue]
	const tabColor = TAB_COLORS[currentTab.color]

	return (
		<div className={cn(
			'min-h-screen pt-20 md:pt-24 pb-24',
			isDark
				? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950'
				: 'bg-gradient-to-b from-slate-50 via-white to-slate-50'
		)}>
			{/* Header - Desktop only */}
			<div className={cn(
				'hidden lg:block pb-6 mb-6',
				'border-b',
				isDark ? 'border-violet-500/20' : 'border-violet-100'
			)}>
				<div className="max-w-4xl mx-auto px-4 text-center">
					<div className="flex items-center justify-center gap-3 mb-2">
						<div className={cn(
							'w-12 h-12 rounded-xl flex items-center justify-center',
							'bg-gradient-to-br from-amber-400 to-amber-600',
							'shadow-lg shadow-amber-500/30'
						)}>
							<Trophy className="w-6 h-6 text-white" />
						</div>
						<h1 className={cn(
							'text-3xl font-black',
							'bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent'
						)}>
							{t('leaderboard')}
						</h1>
					</div>
					<p className={cn(
						'text-sm',
						isDark ? 'text-slate-400' : 'text-slate-500'
					)}>
						{t('leaderboardDescription')}
					</p>
				</div>
			</div>

			<div className="max-w-4xl mx-auto px-0 sm:px-4">
				{/* Guest Banner */}
				{isGuest && (
					<div className={cn(
						'relative rounded-none sm:rounded-2xl p-4 sm:p-6 mb-4 overflow-hidden',
						'bg-gradient-to-br from-violet-900 via-purple-900 to-violet-900',
						'sm:border-2 sm:border-violet-500/50',
						'sm:shadow-xl sm:shadow-violet-500/20'
					)}>
						<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400" />
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 rounded-xl bg-violet-500/30 flex items-center justify-center">
								<Sparkles className="w-6 h-6 text-violet-300" />
							</div>
							<div>
								<h3 className="text-lg font-bold text-white">{t('guest_leaderboard_title')}</h3>
								<p className="text-sm text-violet-200/80">{t('guest_leaderboard_description')}</p>
							</div>
						</div>
					</div>
				)}

				{/* User Stats Card */}
				{leaderboardData?.userStats && (
					<div className={cn(
						'relative rounded-none sm:rounded-2xl p-4 mb-4 overflow-hidden',
						isDark
							? 'bg-gradient-to-br from-slate-800 to-slate-900'
							: 'bg-gradient-to-br from-violet-50 to-purple-50',
						'sm:border-2',
						isDark ? 'sm:border-violet-500/30' : 'sm:border-violet-200'
					)}>
						{/* Desktop version */}
						<div className="hidden sm:flex items-center justify-between gap-6">
							<div>
								<span className={cn(
									'inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-2',
									'bg-gradient-to-r from-violet-500 to-purple-600 text-white'
								)}>
									{t('yourRanking')}
								</span>
								{userRank ? (
									<p className={cn(
										'text-3xl font-black',
										'bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent'
									)}>
										#{userRank}
									</p>
								) : (
									<p className={cn(
										'text-lg font-medium italic',
										isDark ? 'text-slate-400' : 'text-slate-500'
									)}>
										{tabValue === 1 && t('noXPThisWeek')}
										{tabValue === 2 && t('noXPThisMonth')}
										{(tabValue === 0 || tabValue === 3 || tabValue === 4) && t('notRanked')}
									</p>
								)}
							</div>
							<div className="flex gap-4">
								<StatCard
									label={t('totalXP')}
									value={leaderboardData.userStats.total_xp.toLocaleString()}
									icon={Zap}
									gradient="from-blue-500 to-blue-600"
									isDark={isDark}
								/>
								<StatCard
									label={t('streak')}
									value={`${leaderboardData.userStats.daily_streak}`}
									icon={Flame}
									gradient="from-emerald-500 to-emerald-600"
									isDark={isDark}
								/>
								<StatCard
									label={t('gold')}
									value={(leaderboardData.userStats.total_gold || 0).toLocaleString()}
									icon={Coins}
									gradient="from-amber-500 to-amber-600"
									isDark={isDark}
								/>
							</div>
						</div>

						{/* Mobile version - 2x2 grid */}
						<div className="sm:hidden grid grid-cols-2 gap-2">
							<div className={cn(
								'flex flex-col items-center justify-center p-3 rounded-xl',
								isDark ? 'bg-violet-900/30' : 'bg-violet-100/50'
							)}>
								<span className={cn(
									'text-xs font-bold uppercase mb-1',
									isDark ? 'text-violet-300' : 'text-violet-600'
								)}>
									{t('yourRanking')}
								</span>
								<span className={cn(
									'text-xl font-black',
									isDark ? 'text-violet-300' : 'text-violet-600'
								)}>
									{userRank ? `#${userRank}` : '-'}
								</span>
							</div>
							<div className={cn(
								'flex flex-col items-center justify-center p-3 rounded-xl',
								isDark ? 'bg-blue-900/30' : 'bg-blue-100/50'
							)}>
								<span className={cn(
									'text-xs font-bold uppercase mb-1',
									isDark ? 'text-blue-300' : 'text-blue-600'
								)}>
									XP
								</span>
								<span className={cn(
									'text-xl font-black',
									isDark ? 'text-blue-300' : 'text-blue-600'
								)}>
									{leaderboardData.userStats.total_xp.toLocaleString()}
								</span>
							</div>
							<div className={cn(
								'flex flex-col items-center justify-center p-3 rounded-xl',
								isDark ? 'bg-emerald-900/30' : 'bg-emerald-100/50'
							)}>
								<span className={cn(
									'text-xs font-bold uppercase mb-1',
									isDark ? 'text-emerald-300' : 'text-emerald-600'
								)}>
									Streak
								</span>
								<span className={cn(
									'text-xl font-black',
									isDark ? 'text-emerald-300' : 'text-emerald-600'
								)}>
									{leaderboardData.userStats.daily_streak}
								</span>
							</div>
							<div className={cn(
								'flex flex-col items-center justify-center p-3 rounded-xl',
								isDark ? 'bg-amber-900/30' : 'bg-amber-100/50'
							)}>
								<span className={cn(
									'text-xs font-bold uppercase mb-1',
									isDark ? 'text-amber-300' : 'text-amber-600'
								)}>
									Gold
								</span>
								<span className={cn(
									'text-xl font-black',
									isDark ? 'text-amber-300' : 'text-amber-600'
								)}>
									{(leaderboardData.userStats.total_gold || 0).toLocaleString()}
								</span>
							</div>
						</div>
					</div>
				)}

				{/* Tabs & Table */}
				<div className={cn(
					'rounded-none sm:rounded-2xl overflow-hidden',
					isDark
						? 'bg-slate-900'
						: 'bg-white',
					'sm:border',
					isDark ? 'sm:border-slate-700' : 'sm:border-slate-200',
					'sm:shadow-xl'
				)}>
					{/* Tabs */}
					<div className={cn(
						'flex overflow-x-auto',
						'border-b',
						isDark ? 'border-slate-700' : 'border-slate-200',
						isDark ? 'bg-slate-800/50' : 'bg-slate-50',
						'[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
					)}>
						{TABS.map((tab, index) => {
							const TabIcon = tab.icon
							const color = TAB_COLORS[tab.color]
							const isActive = tabValue === index

							return (
								<button
									key={tab.id}
									onClick={() => handleTabChange(index)}
									className={cn(
										'flex items-center gap-2 px-4 py-3 font-bold text-sm whitespace-nowrap transition-all',
										'border-b-3 -mb-px',
										isActive
											? `${color.active} ${color.border}`
											: cn(
												'border-transparent',
												isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'
											)
									)}
								>
									<TabIcon className={cn(
										'w-5 h-5',
										isActive && color.active
									)} />
									<span className="hidden sm:inline">
										{t(tab.label)}
									</span>
									<span className="sm:hidden">
										{t(tab.labelMobile)}
									</span>
								</button>
							)
						})}
					</div>

					{/* Table Header */}
					<div className={cn(
						'hidden sm:flex items-center gap-4 px-4 py-3',
						'text-sm font-bold uppercase tracking-wider',
						isDark
							? 'bg-gradient-to-r from-violet-900/30 to-cyan-900/30 text-slate-300'
							: 'bg-gradient-to-r from-violet-50 to-cyan-50 text-slate-600'
					)}>
						<div className="w-16">{t('rankHeader')}</div>
						<div className="flex-1">{t('userHeader')}</div>
						<div className="w-24">{t('levelHeader')}</div>
						<div className={cn('w-32 text-right', isDark ? tabColor.dark : tabColor.active)}>
							{tabValue === 0 && t('xpHeader')}
							{tabValue === 1 && t('weeklyXPHeader')}
							{tabValue === 2 && t('monthlyXPHeader')}
							{tabValue === 3 && t('goldHeader')}
							{tabValue === 4 && t('daysHeader')}
						</div>
					</div>

					{/* Table Body */}
					<div className="divide-y divide-slate-100 dark:divide-slate-800">
						{currentUsers.map(entry => (
							<LeaderboardRow
								key={entry.userId}
								entry={entry}
								tabValue={tabValue}
								isDark={isDark}
								isMobile={isMobile}
								t={t}
							/>
						))}
					</div>

					{/* Pagination */}
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
						isDark={isDark}
					/>
				</div>

				{/* Footer Message */}
				<div className={cn(
					'text-center mt-6 py-6 px-4 rounded-none sm:rounded-2xl',
					isDark
						? 'bg-gradient-to-br from-violet-900/20 to-cyan-900/20'
						: 'bg-gradient-to-br from-violet-50 to-cyan-50'
				)}>
					<div className="flex items-center justify-center gap-2 mb-2">
						<Target className={cn('w-5 h-5', isDark ? 'text-violet-400' : 'text-violet-500')} />
						<span className={cn(
							'font-bold',
							isDark ? 'text-slate-300' : 'text-slate-600'
						)}>
							{t('keepLearning')}
						</span>
					</div>
					<p className={cn(
						'text-sm',
						isDark ? 'text-slate-400' : 'text-slate-500'
					)}>
						{t('realTimeUpdate')}
					</p>
				</div>
			</div>
		</div>
	)
}
