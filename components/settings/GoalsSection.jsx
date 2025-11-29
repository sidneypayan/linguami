'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { logger } from '@/utils/logger'
import { cn } from '@/lib/utils'

/**
 * Goals & Motivation Section
 * Displays daily XP goal selector
 */
export const GoalsSection = ({
	isDark,
	translations,
	formData,
	setFormData,
	loading,
	setLoading,
	updateUserProfile,
}) => {
	const goals = [
		{ value: 50, emoji: '🌱', label: translations.goalRelaxed, time: translations.goal5to10min, color: '#10b981' },
		{ value: 100, emoji: '⭐', label: translations.goalRegular, time: translations.goal15to20min, color: '#f59e0b', recommended: true },
		{ value: 200, emoji: '🔥', label: translations.goalMotivated, time: translations.goal30min, color: '#f97316' },
		{ value: 300, emoji: '💪', label: translations.goalIntensive, time: translations.goal45minPlus, color: '#ef4444' },
		{ value: 0, emoji: '🎯', label: translations.goalNone, time: translations.goalAtMyPace, color: '#8b5cf6' },
	]

	const handleGoalClick = async (goalValue) => {
		setFormData({ ...formData, dailyXpGoal: goalValue })
		setLoading(true)
		try {
			await updateUserProfile({ daily_xp_goal: goalValue })
			toast.success(translations.updateSuccess)
		} catch (error) {
			logger.error('Error updating goal:', error)
			toast.error(error.message || translations.updateError)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Card
			className={cn(
				'h-full overflow-hidden border-2 border-pink-500/20 transition-all duration-400',
				'hover:-translate-y-1 hover:border-pink-500/40',
				'shadow-[0_8px_32px_rgba(245,87,108,0.15),0_0_0_1px_rgba(245,87,108,0.05)_inset]',
				'hover:shadow-[0_12px_48px_rgba(245,87,108,0.25),0_0_0_1px_rgba(245,87,108,0.3)_inset]',
				isDark
					? 'bg-gradient-to-br from-slate-800/95 to-slate-900/98'
					: 'bg-gradient-to-br from-white/95 to-slate-50/98',
				'backdrop-blur-xl'
			)}>
			{/* Header */}
			<CardHeader
				className={cn(
					'px-4 py-3 border-b border-pink-500/30 relative',
					'bg-gradient-to-r from-rose-600/85 to-pink-600/85'
				)}>
				{/* Glow line */}
				<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-0.5 bg-gradient-to-r from-transparent via-pink-500 to-transparent shadow-[0_0_10px_rgba(245,87,108,0.6)]" />
				<CardTitle className="text-center text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-white to-pink-300 bg-clip-text text-transparent">
					{translations.goalsAndMotivation}
				</CardTitle>
			</CardHeader>

			<CardContent className="p-4">
				<p className={cn(
					'text-xs font-semibold uppercase tracking-wider mb-4 text-center',
					isDark ? 'text-pink-300' : 'text-rose-600'
				)}>
					{translations.dailyXpGoal}
				</p>

				{/* Goal Cards */}
				<div className="flex flex-col gap-3">
					{goals.map(goal => {
						const isSelected = formData.dailyXpGoal === goal.value
						return (
							<div
								key={goal.value}
								onClick={() => !loading && handleGoalClick(goal.value)}
								className={cn(
									'relative cursor-pointer p-3 rounded-xl transition-all duration-300',
									'border-2',
									loading && 'opacity-60 cursor-not-allowed',
									isSelected
										? 'border-current'
										: 'border-opacity-40 hover:translate-x-1'
								)}
								style={{
									borderColor: isSelected ? goal.color : `${goal.color}66`,
									background: isSelected
										? `linear-gradient(135deg, ${goal.color}15 0%, ${goal.color}25 100%)`
										: isDark
										? 'linear-gradient(135deg, rgba(30, 27, 75, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%)'
										: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(248, 250, 252, 0.6) 100%)',
									boxShadow: isSelected
										? `0 4px 16px ${goal.color}40, 0 0 24px ${goal.color}20`
										: '0 2px 8px rgba(0, 0, 0, 0.1)',
								}}>
								{/* Left accent bar when selected */}
								{isSelected && (
									<div
										className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
										style={{
											background: `linear-gradient(180deg, ${goal.color} 0%, ${goal.color}dd 100%)`,
											boxShadow: `0 0 12px ${goal.color}80`,
										}}
									/>
								)}

								{/* Recommended Badge */}
								{goal.recommended && (
									<div
										className="absolute -top-2 right-2 px-2 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wide text-white"
										style={{
											backgroundColor: goal.color,
											boxShadow: `0 4px 12px ${goal.color}60`,
										}}>
										{translations.recommended}
									</div>
								)}

								<div className="flex items-center gap-3">
									{/* Emoji Icon */}
									<div
										className={cn(
											'text-2xl flex items-center justify-center w-12 h-12 rounded-full border-2 flex-shrink-0 transition-transform duration-300',
											isSelected && 'scale-110'
										)}
										style={{
											background: `linear-gradient(135deg, ${goal.color}20 0%, ${goal.color}30 100%)`,
											borderColor: `${goal.color}50`,
										}}>
										{goal.emoji}
									</div>

									{/* Content */}
									<div className="flex-1 min-w-0">
										<div className="flex items-baseline gap-2 mb-0.5">
											<span
												className="font-bold text-sm transition-colors"
												style={{ color: isSelected ? goal.color : isDark ? '#f1f5f9' : '#2d3748' }}>
												{goal.label}
											</span>
											{goal.value > 0 && (
												<span
													className="text-xs font-semibold opacity-80"
													style={{ color: goal.color }}>
													{goal.value} XP
												</span>
											)}
										</div>
										<span className={cn(
											'text-[0.7rem]',
											isDark ? 'text-white/50' : 'text-black/50'
										)}>
											{goal.time}
										</span>
									</div>

									{/* Check Icon */}
									{isSelected && (
										<div
											className="flex items-center justify-center w-7 h-7 rounded-full text-white flex-shrink-0"
											style={{
												backgroundColor: goal.color,
												boxShadow: `0 4px 12px ${goal.color}60`,
											}}>
											<Check className="h-4 w-4" />
										</div>
									)}
								</div>
							</div>
						)
					})}
				</div>
			</CardContent>
		</Card>
	)
}

export default GoalsSection
