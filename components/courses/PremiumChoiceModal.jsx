'use client'

import { Trophy, BookOpen, Zap, Crown, Check, Infinity, Dumbbell, Percent } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/**
 * Modal displayed after completing a free lesson
 * Offers two choices:
 * 1. Subscription (monthly/yearly) - full access + unlimited features + method discount
 * 2. Method only (one-time purchase) - just the method lessons
 */
const PremiumChoiceModal = ({
	open,
	onClose,
	onChooseSubscription,
	onChooseMethodOnly,
}) => {
	const t = useTranslations('common')
	const { isDark } = useThemeMode()

	// Pricing
	const subscriptionMonthly = 8
	const subscriptionYearly = 59
	const methodPriceRegular = 29
	const methodPriceWithSub = 19
	const yearlyMonthlyEquivalent = (subscriptionYearly / 12).toFixed(2)
	const yearlySavingsPercent = Math.round((1 - subscriptionYearly / (subscriptionMonthly * 12)) * 100)

	// Subscription features
	const subscriptionFeatures = [
		{ icon: Infinity, text: t('premium_feature_unlimited_translations') },
		{ icon: Infinity, text: t('premium_feature_unlimited_dictionary') },
		{ icon: Dumbbell, text: t('premium_feature_exclusive_training') },
		{ icon: Percent, text: t('premium_feature_method_discount', { price: methodPriceWithSub }) },
	]

	// Method only features
	const methodFeatures = [
		{ icon: BookOpen, text: t('premium_feature_all_lessons') },
		{ icon: Check, text: t('premium_feature_lifetime_access') },
	]

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent
				isDark={isDark}
				className={cn(
					'sm:max-w-2xl rounded-2xl border p-0 overflow-hidden',
					isDark
						? 'bg-gradient-to-br from-slate-900 to-slate-950 border-slate-700'
						: 'bg-gradient-to-br from-white to-slate-50 border-slate-200',
					'shadow-[0_20px_60px_rgba(0,0,0,0.3)]'
				)}>

				<DialogHeader className="pt-6 pb-4 px-6 text-center">
					<div className="mb-3">
						<Trophy
							className="h-14 w-14 mx-auto text-amber-500 drop-shadow-[0_4px_12px_rgba(245,158,11,0.4)]"
						/>
					</div>
					<DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
						{t('premium_choice_title')}
					</DialogTitle>
					<p className="text-muted-foreground mt-2">
						{t('premium_choice_subtitle')}
					</p>
				</DialogHeader>

				<div className="px-6 pb-6">
					{/* Two columns for choices */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

						{/* Option 1: Subscription */}
						<div
							className={cn(
								'relative rounded-xl border-2 p-5 flex flex-col',
								isDark
									? 'bg-gradient-to-br from-violet-950/50 to-indigo-950/50 border-violet-500/50'
									: 'bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-500/30',
							)}>
							{/* Best value badge */}
							<Badge
								className={cn(
									'absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1',
									'bg-gradient-to-r from-violet-500 to-indigo-500 text-white border-0'
								)}>
								{t('premium_best_value')}
							</Badge>

							<div className="flex items-center gap-2 mb-3 mt-2">
								<Crown className="h-6 w-6 text-violet-500" />
								<h3 className="font-bold text-lg">{t('premium_subscription_title')}</h3>
							</div>

							{/* Pricing */}
							<div className="mb-4">
								<div className="flex items-baseline gap-2">
									<span className="text-3xl font-extrabold">{subscriptionMonthly}€</span>
									<span className="text-muted-foreground">/{t('premium_per_month')}</span>
								</div>
								<div
									className={cn(
										'mt-2 p-2 rounded-lg text-sm',
										isDark ? 'bg-emerald-500/20' : 'bg-emerald-500/10'
									)}>
									<span className="font-semibold text-emerald-600 dark:text-emerald-400">
										{t('premium_yearly_option', {
											price: subscriptionYearly,
											monthly: yearlyMonthlyEquivalent,
											savings: yearlySavingsPercent,
										})}
									</span>
								</div>
							</div>

							{/* Features */}
							<ul className="space-y-2 mb-4 flex-grow">
								{subscriptionFeatures.map((feature, index) => (
									<li key={index} className="flex items-center gap-2 text-sm">
										<feature.icon className="h-4 w-4 text-violet-500 flex-shrink-0" />
										<span>{feature.text}</span>
									</li>
								))}
							</ul>

							{/* CTA */}
							<Button
								size="lg"
								onClick={onChooseSubscription}
								className={cn(
									'w-full py-5 font-bold rounded-xl',
									'bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700',
									'shadow-[0_8px_24px_rgba(139,92,246,0.4)] hover:shadow-[0_12px_32px_rgba(139,92,246,0.5)]',
									'transition-all hover:-translate-y-0.5'
								)}>
								{t('premium_choose_subscription')}
							</Button>
						</div>

						{/* Option 2: Method Only */}
						<div
							className={cn(
								'rounded-xl border p-5 flex flex-col',
								isDark
									? 'bg-slate-800/50 border-slate-700'
									: 'bg-slate-50 border-slate-200',
							)}>
							<div className="flex items-center gap-2 mb-3">
								<BookOpen className="h-6 w-6 text-slate-500" />
								<h3 className="font-bold text-lg">{t('premium_method_only_title')}</h3>
							</div>

							{/* Pricing */}
							<div className="mb-4">
								<div className="flex items-baseline gap-2">
									<span className="text-3xl font-extrabold">{methodPriceRegular}€</span>
									<span className="text-muted-foreground">{t('premium_one_time')}</span>
								</div>
								<p className="text-sm text-muted-foreground mt-1">
									{t('premium_method_only_desc')}
								</p>
							</div>

							{/* Features */}
							<ul className="space-y-2 mb-4 flex-grow">
								{methodFeatures.map((feature, index) => (
									<li key={index} className="flex items-center gap-2 text-sm">
										<feature.icon className="h-4 w-4 text-slate-500 flex-shrink-0" />
										<span>{feature.text}</span>
									</li>
								))}
							</ul>

							{/* What's not included */}
							<div
								className={cn(
									'p-3 rounded-lg mb-4 text-sm',
									isDark ? 'bg-slate-700/50' : 'bg-slate-100'
								)}>
								<p className="text-muted-foreground">
									{t('premium_method_only_limits')}
								</p>
							</div>

							{/* CTA */}
							<Button
								size="lg"
								variant="outline"
								onClick={onChooseMethodOnly}
								className={cn(
									'w-full py-5 font-bold rounded-xl',
									isDark
										? 'border-slate-600 hover:bg-slate-700'
										: 'border-slate-300 hover:bg-slate-100'
								)}>
								{t('premium_choose_method')}
							</Button>
						</div>
					</div>

					{/* Maybe later link */}
					<div className="text-center mt-4">
						<button
							onClick={onClose}
							className="text-sm text-muted-foreground hover:underline">
							{t('upsell_maybe_later')}
						</button>
					</div>

					{/* Trust signals */}
					<p className="text-center text-xs text-muted-foreground mt-3">
						{t('upsell_trust_signals')}
					</p>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default PremiumChoiceModal
