'use client'

import { useState } from 'react'
import { Crown, ExternalLink } from 'lucide-react'
import { createPortalSession } from '@/app/actions/stripe'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const SubscriptionSection = ({ userProfile, locale, isDark, translations }) => {
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
			const response = await createPortalSession(locale)

			// Check if we got an error
			if (response.error) {
				console.error('Stripe portal error:', response.error)
				alert(`Error: ${response.error}`)
				setIsLoading(false)
				return
			}

			// Redirect to Stripe Customer Portal
			if (response.url) {
				window.location.href = response.url
			} else {
				console.error('No URL returned from createPortalSession')
				alert('Failed to open Stripe portal')
				setIsLoading(false)
			}
		} catch (error) {
			console.error('Error opening Stripe portal:', error)
			alert('An error occurred while opening the portal')
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
						{translations.subscription}
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
						{translations.subscriptionStatus}
					</p>
					<Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
						{translations.active}
					</Badge>
				</div>

				{/* Subscription type badge */}
				<div>
					<p className={cn(
						'text-sm mb-1',
						isDark ? 'text-slate-400' : 'text-slate-500'
					)}>
						{translations.subscriptionType}
					</p>
					<Badge className="bg-violet-500/10 text-violet-600 border-violet-500/30">
						{userProfile?.subscription_type === 'monthly' ? translations.monthly : translations.yearly}
					</Badge>
				</div>

				{/* Renewal date */}
				{formattedDate && (
					<div>
						<p className={cn(
							'text-sm mb-1',
							isDark ? 'text-slate-400' : 'text-slate-500'
						)}>
							{translations.renewsOn}
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
					{translations.subscriptionDesc}
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
						translations.loadingPortal
					) : (
						<>
							{translations.manageSubscription}
							<ExternalLink className="w-4 h-4" />
						</>
					)}
				</Button>
			</div>
		</div>
	)
}

export default SubscriptionSection
