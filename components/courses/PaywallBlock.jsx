'use client'

import { Lock, Star, CheckCircle } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * PaywallBlock - Encourage users to sign up or purchase the method
 */
const PaywallBlock = ({ isLoggedIn }) => {
	const { isDark } = useThemeMode()
	const t = useTranslations('common')

	const benefits = [
		t('paywall_benefit_1'),
		t('paywall_benefit_2'),
		t('paywall_benefit_3'),
		t('paywall_benefit_4'),
	]

	return (
		<Card
			className={cn(
				'p-6 sm:p-10 my-8 rounded-xl border-[3px] border-amber-500 text-center',
				isDark
					? 'bg-gradient-to-br from-amber-500/10 to-slate-800/95'
					: 'bg-gradient-to-br from-amber-100/60 to-white/95'
			)}>
			{/* Icon */}
			<div className="inline-flex p-4 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 mb-6">
				<Lock className="h-10 w-10 text-white" />
			</div>

			{/* Title */}
			<h2 className="text-2xl sm:text-3xl font-extrabold mb-4 bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
				{isLoggedIn
					? t('paywall_title_logged_in')
					: t('paywall_title_guest')}
			</h2>

			{/* Subtitle */}
			<p className={cn(
				'text-lg mb-8 font-medium',
				isDark ? 'text-slate-300' : 'text-slate-600'
			)}>
				{isLoggedIn
					? t('paywall_subtitle_logged_in')
					: t('paywall_subtitle_guest')}
			</p>

			{/* Benefits */}
			<div className="mb-8 text-left max-w-md mx-auto">
				{benefits.map((benefit, index) => (
					<div
						key={index}
						className={cn(
							'flex items-center gap-3 mb-3 p-3 rounded-lg',
							isDark ? 'bg-white/5' : 'bg-black/5'
						)}>
						<CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
						<span className="font-medium">{benefit}</span>
					</div>
				))}
			</div>

			{/* CTA Buttons */}
			<div className="flex gap-4 justify-center flex-wrap">
				{!isLoggedIn && (
					<Link href="/signup">
						<Button
							size="lg"
							className="px-8 py-6 text-lg font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white">
							<Star className="h-5 w-5 mr-2" />
							{t('paywall_cta_register')}
						</Button>
					</Link>
				)}

				{isLoggedIn && (
					<Link href="/pricing">
						<Button
							size="lg"
							className="px-8 py-6 text-lg font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white">
							<Star className="h-5 w-5 mr-2" />
							{t('paywall_cta_purchase')}
						</Button>
					</Link>
				)}

				{!isLoggedIn && (
					<Link href="/login">
						<Button
							variant="outline"
							size="lg"
							className="px-8 py-6 text-lg font-semibold border-amber-500 text-amber-500 hover:bg-amber-500/10 hover:border-amber-600">
							{t('paywall_cta_login')}
						</Button>
					</Link>
				)}
			</div>

			{/* Small print */}
			<p className={cn(
				'mt-6 text-sm italic',
				isDark ? 'text-slate-400' : 'text-slate-500'
			)}>
				{isLoggedIn
					? t('paywall_note_logged_in')
					: t('paywall_note_guest')}
			</p>
		</Card>
	)
}

export default PaywallBlock
