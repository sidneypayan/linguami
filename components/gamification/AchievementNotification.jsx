'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Star, Flame, Trophy } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
	Dialog,
	DialogContent,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const getAchievementConfig = (type, data, t) => {
	// Level up
	if (type === 'level_up') {
		return {
			icon: <TrendingUp className="h-16 w-16" />,
			color: '#8b5cf6',
			gradient: 'from-violet-500 to-cyan-500',
			title: t('achievement_level_up_title'),
			description: t('achievement_level_up_desc', { level: data.level }),
			emoji: '🎉',
		}
	}

	// Objectif quotidien
	if (type === 'daily_goal_achieved') {
		return {
			icon: <Star className="h-16 w-16" />,
			color: '#f59e0b',
			gradient: 'from-amber-500 to-amber-600',
			title: t('achievement_daily_goal_title'),
			description: t('achievement_daily_goal_desc', { gold: data.goldEarned }),
			emoji: '⭐',
		}
	}

	// Objectif hebdomadaire
	if (type === 'weekly_goal_achieved') {
		return {
			icon: <Trophy className="h-16 w-16" />,
			color: '#06b6d4',
			gradient: 'from-cyan-500 to-cyan-600',
			title: t('achievement_weekly_goal_title'),
			description: t('achievement_weekly_goal_desc', { gold: data.goldEarned }),
			emoji: '🏆',
		}
	}

	// Objectif mensuel
	if (type === 'monthly_goal_achieved') {
		return {
			icon: <Trophy className="h-16 w-16" />,
			color: '#ec4899',
			gradient: 'from-pink-500 to-pink-600',
			title: t('achievement_monthly_goal_title'),
			description: t('achievement_monthly_goal_desc', { gold: data.goldEarned }),
			emoji: '👑',
		}
	}

	// Streak milestones
	if (type.includes('streak')) {
		const days = data.streak
		return {
			icon: <Flame className="h-16 w-16" />,
			color: '#ef4444',
			gradient: 'from-red-500 to-red-600',
			title: t('achievement_streak_title'),
			description: t('achievement_streak_desc', { days }),
			emoji: '🔥',
		}
	}

	// Default
	return {
		icon: <Star className="h-16 w-16" />,
		color: '#8b5cf6',
		gradient: 'from-violet-500 to-cyan-500',
		title: t('achievement_title'),
		description: t('achievement_desc'),
		emoji: '✨',
	}
}

const AchievementNotification = ({ achievement, open, onClose }) => {
	const t = useTranslations('common')
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		if (open) {
			setIsVisible(true)
			// Auto-close after 4 seconds
			const timer = setTimeout(() => {
				handleClose()
			}, 4000)
			return () => clearTimeout(timer)
		}
	}, [open])

	const handleClose = () => {
		setIsVisible(false)
		setTimeout(() => {
			onClose && onClose()
		}, 300)
	}

	if (!achievement) return null

	const config = getAchievementConfig(achievement.type, achievement, t)

	return (
		<Dialog open={isVisible} onOpenChange={handleClose}>
			<DialogContent
				hideCloseButton
				className="sm:max-w-[400px] p-0 border-0 bg-transparent shadow-none"
				onClick={handleClose}>
				<div
					className={cn(
						'relative rounded-2xl p-8 text-center overflow-hidden',
						'bg-gradient-to-br from-indigo-950 to-slate-900',
						'border-[3px] animate-in zoom-in-95 duration-300'
					)}
					style={{
						borderColor: config.color,
						boxShadow: `0 0 40px ${config.color}80, 0 20px 60px rgba(0, 0, 0, 0.5)`,
					}}>
					{/* Shine effect */}
					<div className="absolute inset-0 overflow-hidden">
						<div className="absolute -left-full top-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shine_2s_infinite]" />
					</div>

					{/* Radial glow */}
					<div
						className="absolute inset-0 pointer-events-none"
						style={{
							background: `radial-gradient(circle at 50% 0%, ${config.color}30 0%, transparent 70%)`,
						}}
					/>

					{/* Emoji background */}
					<span className="absolute -top-5 -right-5 text-[10rem] opacity-10 animate-float">
						{config.emoji}
					</span>

					{/* Icon */}
					<div
						className={cn(
							'relative inline-flex items-center justify-center w-28 h-28 rounded-full mb-6',
							'bg-gradient-to-br',
							config.gradient,
							'animate-pulse-slow'
						)}
						style={{
							boxShadow: `0 8px 32px ${config.color}60`,
						}}>
						{/* Outer glow */}
						<div
							className="absolute -inset-2 rounded-full blur-lg opacity-30"
							style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color})` }}
						/>
						<div className="relative z-10 text-white">
							{config.icon}
						</div>
					</div>

					{/* Title */}
					<h2
						className={cn(
							'text-2xl sm:text-3xl font-extrabold mb-3 bg-clip-text text-transparent relative z-10',
							`bg-gradient-to-r ${config.gradient}`
						)}
						style={{
							textShadow: `0 0 30px ${config.color}50`,
						}}>
						{config.title}
					</h2>

					{/* Description */}
					<p className="text-slate-300 font-semibold text-lg relative z-10">
						{config.description}
					</p>

					{/* Tap to close hint */}
					<p className="mt-6 text-slate-500 text-xs relative z-10">
						{t('tap_to_close')}
					</p>

					{/* Particles effect */}
					{[...Array(6)].map((_, i) => (
						<div
							key={i}
							className="absolute w-1 h-1 rounded-full opacity-60 animate-float"
							style={{
								backgroundColor: config.color,
								top: `${20 + i * 10}%`,
								left: `${10 + i * 15}%`,
								animationDelay: `${i * 0.2}s`,
								animationDuration: `${2 + i * 0.3}s`,
							}}
						/>
					))}
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default AchievementNotification
