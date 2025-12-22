'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Crown, ExternalLink } from 'lucide-react'
import { createPortalSession } from '@/app/actions/stripe'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const SubscriptionSection = ({ userProfile, locale, isDark, t }) => {
	const [isLoading, setIsLoading] = useState(false)

	// Format expiration date according to locale
	const expiresAt = userProfile?.subscription_expires_at
	const formattedDate = expiresAt
		? new Date(expiresAt).toLocaleDateString(locale, {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		})
		: null

	const handleManageSubscription = async () => {
		try {
			setIsLoading(true)
			const { url } = await createPortalSession(locale)
			window.location.href = url
		} catch (error) {
			console.error('Error opening Stripe portal:', error)
			setIsLoading(false)
		}
	}

	return (
		<div className={cn(
			'relative rounded-2xl overflow-hidden',
			'border-2',
			isDark
				? 'bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-violet-500/30'
				: 'bg-gradient-to-br from-white to-slate-50/50 border-violet-300/50',
			'shadow-lg'
		)}>
			{/* Header with gradient */}
			<div className="bg-gradient-to-r from-violet-500 to-purple-600 p-4">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
						<Crown className="w-5 h-5 text-white" />
					</div>
					<h3 className="text-lg font-bold text-white">
						{t('subscription')}
					</h3>
				</div>
			</div>

			{/* Content */}
			<div className="p-6 space-y-4">
				{/* Status badge */}
				<div>
					<p className={cn(
						'text-sm mb-1',
						isDark ? 'text-slate-400' : 'text-slate-500'
					)}>
						{t('subscriptionStatus')}
					</p>
					<Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
						{t('active')}
					</Badge>
				</div>

				{/* Subscription type badge */}
				<div>
					<p className={cn(
						'text-sm mb-1',
						isDark ? 'text-slate-400' : 'text-slate-500'
					)}>
						{t('subscriptionType')}
					</p>
					<Badge className="bg-violet-500/10 text-violet-600 border-violet-500/30">
						{userProfile?.subscription_type === 'monthly' ? t('monthly') : t('yearly')}
					</Badge>
				</div>

				{/* Renewal date */}
				{formattedDate && (
					<div>
						<p className={cn(
							'text-sm mb-1',
							isDark ? 'text-slate-400' : 'text-slate-500'
						)}>
							{t('renewsOn')}
						</p>
						<p className={cn(
							'font-semibold',
							isDark ? 'text-slate-200' : 'text-slate-900'
						)}>
							{formattedDate}
						</p>
					</div>
				)}

				{/* Description */}
				<p className={cn(
					'text-sm',
					isDark ? 'text-slate-400' : 'text-slate-500'
				)}>
					{t('subscriptionDesc')}
				</p>

				{/* Manage subscription button */}
				<Button
					onClick={handleManageSubscription}
					disabled={isLoading}
					className={cn(
						'w-full',
						'bg-gradient-to-r from-violet-500 to-purple-600',
						'hover:from-violet-600 hover:to-purple-700',
						'text-white font-semibold',
						'flex items-center justify-center gap-2',
						'transition-all duration-200',
						'disabled:opacity-50 disabled:cursor-not-allowed'
					)}
				>
					{isLoading ? (
						t('loadingPortal')
					) : (
						<>
							{t('manageSubscription')}
							<ExternalLink className="w-4 h-4" />
						</>
					)}
				</Button>
			</div>
		</div>
	)
}

export default SubscriptionSection
