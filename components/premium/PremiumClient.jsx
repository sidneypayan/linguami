'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { useUserContext } from '@/context/user'
import { useRouter } from '@/i18n/navigation'
import {
	Crown,
	BookOpen,
	Sparkles,
	Check,
	X,
	Infinity,
	Dumbbell,
	Star,
	Zap,
	Shield,
	Gift,
	Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { createCheckoutSession } from '@/app/actions/stripe'
// import { Link } from '@/i18n/navigation' // Pour la section cours (masquée)

export default function PremiumClient({ jsonLd }) {
	const t = useTranslations('premium')
	const locale = useLocale()
	const router = useRouter()
	const { isDark } = useThemeMode()
	const { isUserLoggedIn } = useUserContext()
	const [loadingPlan, setLoadingPlan] = useState(null)

	// Pricing
	const subscriptionMonthly = 8
	const subscriptionYearly = 59
	const yearlyMonthlyEquivalent = (subscriptionYearly / 12).toFixed(0)
	const yearlySavingsPercent = Math.round(
		(1 - subscriptionYearly / (subscriptionMonthly * 12)) * 100
	)

	const subscriptionFeatures = [
		{ text: t('feature_unlimited_translations'), included: true, highlight: true },
		{ text: t('feature_unlimited_dictionary'), included: true, highlight: true },
		{ text: t('feature_exclusive_training'), included: true, highlight: true },
		{ text: t('feature_basic_materials'), included: true },
		{ text: t('feature_priority_support'), included: true },
	]

	const handleSubscribe = async (planId) => {
		if (!isUserLoggedIn) {
			router.push('/login')
			return
		}

		setLoadingPlan(planId)
		try {
			const result = await createCheckoutSession(planId, locale)
			if (result.error) {
				console.error('Checkout error:', result.error)
				// TODO: Show error toast
			} else if (result.url) {
				window.location.href = result.url
			}
		} catch (error) {
			console.error('Checkout error:', error)
		} finally {
			setLoadingPlan(null)
		}
	}

	const plans = [
		{
			id: 'monthly',
			name: t('plan_monthly'),
			description: t('plan_monthly_desc'),
			price: subscriptionMonthly,
			period: t('per_month'),
			icon: Zap,
			iconColor: 'text-cyan-500',
			bgGradient: isDark
				? 'from-slate-800/50 to-slate-900/50'
				: 'from-slate-50 to-slate-100',
			borderColor: isDark ? 'border-slate-700' : 'border-slate-200',
			features: subscriptionFeatures,
			cta: t('cta_subscribe'),
		},
		{
			id: 'yearly',
			name: t('plan_yearly'),
			description: t('plan_yearly_desc'),
			price: subscriptionYearly,
			period: t('per_year'),
			monthlyEquivalent: `${yearlyMonthlyEquivalent}€/${t('per_month')}`,
			savings: yearlySavingsPercent,
			icon: Crown,
			iconColor: 'text-amber-500',
			popular: true,
			bgGradient: isDark
				? 'from-violet-950/60 to-indigo-950/60'
				: 'from-violet-50 to-indigo-50',
			borderColor: 'border-violet-500/50',
			glowColor: 'shadow-[0_0_40px_rgba(139,92,246,0.3)]',
			features: subscriptionFeatures,
			cta: t('cta_subscribe'),
			ctaGradient: true,
		},
	]

	return (
		<>
			{jsonLd && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
			)}

			{/* Hero Section */}
			<section
				className={cn(
					'relative overflow-hidden pt-24 pb-16 md:pt-28 md:pb-20',
					'bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900'
				)}>
				{/* Background effects */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div
						className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full opacity-40 blur-[80px] animate-pulse-slow"
						style={{
							background:
								'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
						}}
					/>
					<div
						className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full opacity-30 blur-[60px] animate-pulse-slow"
						style={{
							background:
								'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)',
							animationDelay: '2s',
						}}
					/>
					<div
						className="absolute inset-0 opacity-[0.03]"
						style={{
							backgroundImage:
								'linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)',
							backgroundSize: '50px 50px',
						}}
					/>
				</div>

				<div className="relative z-10 max-w-[1200px] mx-auto px-5 text-center">
					<Badge
						variant="outline"
						className={cn(
							'mb-6 px-4 py-1.5',
							'bg-amber-500/20 border-amber-500/30 backdrop-blur-sm',
							'text-white/95 font-semibold text-sm rounded-full'
						)}>
						<Crown className="w-4 h-4 mr-2 text-amber-400" />
						{t('badge_unlock_potential')}
					</Badge>

					<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
						<span className="bg-gradient-to-r from-white via-violet-300 to-cyan-300 bg-clip-text text-transparent">
							{t('hero_title')}
						</span>
					</h1>

					<p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
						{t('hero_subtitle')}
					</p>
				</div>
			</section>

			{/* Pricing Cards */}
			<section
				className={cn(
					'relative -mt-8 pb-20 px-5',
					isDark ? 'bg-slate-950' : 'bg-slate-50'
				)}>
				<div className="max-w-[1200px] mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-3xl mx-auto">
						{plans.map((plan) => (
							<div
								key={plan.id}
								className={cn(
									'relative rounded-2xl border-2 p-6 flex flex-col',
									'bg-gradient-to-br',
									plan.bgGradient,
									plan.borderColor,
									plan.glowColor,
									plan.popular && 'md:-mt-4 md:mb-4'
								)}>
								{/* Popular badge */}
								{plan.popular && (
									<Badge
										className={cn(
											'absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1',
											'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0',
											'shadow-[0_4px_12px_rgba(245,158,11,0.4)]'
										)}>
										<Star className="w-3 h-3 mr-1 fill-current" />
										{t('most_popular')}
									</Badge>
								)}

								{/* Plan header */}
								<div className="text-center mb-6 pt-2">
									<div
										className={cn(
											'w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center',
											'bg-gradient-to-br',
											plan.popular
												? 'from-amber-500/20 to-orange-500/20'
												: plan.id === 'method'
													? 'from-cyan-500/20 to-blue-500/20'
													: isDark
														? 'from-slate-700 to-slate-800'
														: 'from-slate-200 to-slate-300'
										)}>
										<plan.icon className={cn('w-8 h-8', plan.iconColor)} />
									</div>
									<h3 className="text-xl font-bold mb-1">{plan.name}</h3>
									<p className="text-sm text-muted-foreground">{plan.description}</p>
								</div>

								{/* Price */}
								<div className="text-center mb-6">
									<div className="flex items-baseline justify-center gap-1">
										<span className="text-4xl font-extrabold">{plan.price}€</span>
										{plan.period && (
											<span className="text-muted-foreground">/{plan.period}</span>
										)}
									</div>
									{plan.monthlyEquivalent && (
										<p className="text-sm text-emerald-500 font-medium mt-1">
											{t('equivalent_to')} {plan.monthlyEquivalent}
										</p>
									)}
									{plan.savings && (
										<Badge className="mt-2 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
											<Gift className="w-3 h-3 mr-1" />
											{t('save_percent', { percent: plan.savings })}
										</Badge>
									)}
								</div>

								{/* Features */}
								<ul className="space-y-3 mb-6 flex-grow">
									{plan.features.map((feature, index) => (
										<li key={index} className="flex items-start gap-3">
											{feature.included ? (
												<Check
													className={cn(
														'w-5 h-5 flex-shrink-0 mt-0.5',
														feature.highlight
															? 'text-emerald-500'
															: 'text-muted-foreground'
													)}
												/>
											) : (
												<X className="w-5 h-5 flex-shrink-0 mt-0.5 text-muted-foreground/40" />
											)}
											<span
												className={cn(
													'text-sm',
													!feature.included && 'text-muted-foreground/60 line-through',
													feature.highlight && 'font-medium'
												)}>
												{feature.text}
											</span>
										</li>
									))}
								</ul>

								{/* CTA Button */}
								<Button
									size="lg"
									disabled={loadingPlan !== null}
									onClick={() => handleSubscribe(plan.id)}
									className={cn(
										'w-full py-6 font-bold rounded-xl transition-all',
										plan.ctaGradient
											? cn(
													'bg-gradient-to-r from-violet-500 to-indigo-600',
													'hover:from-violet-600 hover:to-indigo-700',
													'shadow-[0_8px_24px_rgba(139,92,246,0.4)]',
													'hover:shadow-[0_12px_32px_rgba(139,92,246,0.5)]',
													'hover:-translate-y-0.5 text-white'
												)
											: plan.id === 'method'
												? cn(
														'bg-gradient-to-r from-cyan-500 to-blue-600',
														'hover:from-cyan-600 hover:to-blue-700',
														'shadow-[0_8px_24px_rgba(6,182,212,0.3)]',
														'hover:shadow-[0_12px_32px_rgba(6,182,212,0.4)]',
														'hover:-translate-y-0.5 text-white'
													)
												: ''
									)}>
									{loadingPlan === plan.id ? (
										<Loader2 className="w-5 h-5 animate-spin" />
									) : (
										plan.cta
									)}
								</Button>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Courses Section - Masqué pour l'instant
			<section className={cn('py-16 px-5', isDark ? 'bg-slate-900' : 'bg-white')}>
				<div className="max-w-[900px] mx-auto text-center">
					<h2 className="text-2xl md:text-3xl font-bold mb-4">{t('courses_section_title')}</h2>
					<p className="text-muted-foreground mb-10">{t('courses_section_subtitle')}</p>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{[
							{
								name: t('course_beginner'),
								desc: t('course_beginner_desc'),
								level: 'A1-A2',
								color: 'emerald',
							},
							{
								name: t('course_intermediate'),
								desc: t('course_intermediate_desc'),
								level: 'B1-B2',
								color: 'amber',
							},
							{
								name: t('course_advanced'),
								desc: t('course_advanced_desc'),
								level: 'C1-C2',
								color: 'violet',
							},
						].map((course, index) => (
							<Link
								key={index}
								href="/method"
								className={cn(
									'p-6 rounded-xl border block transition-all hover:scale-[1.02] hover:shadow-lg',
									isDark ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
								)}>
								<Badge
									className={cn(
										'mb-3',
										course.color === 'emerald' && 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
										course.color === 'amber' && 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
										course.color === 'violet' && 'bg-violet-500/20 text-violet-600 dark:text-violet-400 border-violet-500/30'
									)}>
									{course.level}
								</Badge>
								<h3 className="font-bold text-lg mb-2">{course.name}</h3>
								<p className="text-sm text-muted-foreground mb-4">{course.desc}</p>
								<div className="space-y-1 mb-4">
									<p className="text-lg font-bold">{coursePriceRegular}€</p>
									<p className="text-sm text-muted-foreground">
										{t('course_price_monthly_sub', { price: coursePriceWithMonthly })}
									</p>
									<p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
										{t('course_price_yearly_sub', { price: coursePriceWithYearly })}
									</p>
								</div>
								<Button
									variant="outline"
									size="sm"
									className={cn(
										'w-full',
										course.color === 'emerald' && 'border-emerald-500/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10',
										course.color === 'amber' && 'border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10',
										course.color === 'violet' && 'border-violet-500/50 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10'
									)}>
									{t('course_cta')}
								</Button>
							</Link>
						))}
					</div>
				</div>
			</section>
			*/}

			{/* Trust Section */}
			<section className={cn('py-16 px-5', isDark ? 'bg-slate-950' : 'bg-slate-50')}>
				<div className="max-w-[900px] mx-auto text-center">
					<h2 className="text-2xl md:text-3xl font-bold mb-8">{t('trust_title')}</h2>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
						<div
							className={cn(
								'p-6 rounded-xl',
								isDark ? 'bg-slate-800/50' : 'bg-slate-50'
							)}>
							<Shield className="w-10 h-10 mx-auto mb-3 text-emerald-500" />
							<h3 className="font-semibold mb-2">{t('trust_secure')}</h3>
							<p className="text-sm text-muted-foreground">{t('trust_secure_desc')}</p>
						</div>

						<div
							className={cn(
								'p-6 rounded-xl',
								isDark ? 'bg-slate-800/50' : 'bg-slate-50'
							)}>
							<Zap className="w-10 h-10 mx-auto mb-3 text-amber-500" />
							<h3 className="font-semibold mb-2">{t('trust_instant')}</h3>
							<p className="text-sm text-muted-foreground">{t('trust_instant_desc')}</p>
						</div>

						<div
							className={cn(
								'p-6 rounded-xl',
								isDark ? 'bg-slate-800/50' : 'bg-slate-50'
							)}>
							<Gift className="w-10 h-10 mx-auto mb-3 text-violet-500" />
							<h3 className="font-semibold mb-2">{t('trust_cancel')}</h3>
							<p className="text-sm text-muted-foreground">{t('trust_cancel_desc')}</p>
						</div>
					</div>
				</div>
			</section>

			{/* Support Section */}
			<section className={cn('py-16 px-5', isDark ? 'bg-slate-900' : 'bg-white')}>
				<div className="max-w-[700px] mx-auto text-center">
					<h2 className="text-2xl md:text-3xl font-bold mb-4">{t('support_title')}</h2>
					<p className="text-muted-foreground mb-8">{t('support_subtitle')}</p>

					<div
						className={cn(
							'p-6 rounded-xl text-left',
							isDark ? 'bg-slate-800/50' : 'bg-white border border-slate-200'
						)}>
						<ul className="space-y-4">
							{[
								t('support_content'),
								t('support_activities'),
								t('support_hosting'),
								t('support_thanks'),
							].map((item, index) => (
								<li key={index} className="flex items-start gap-3">
									<Sparkles className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
									<span>{item}</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</section>
		</>
	)
}
