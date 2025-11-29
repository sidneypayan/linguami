'use client'

import { X, CheckCircle, Trophy, BookOpen, Zap } from 'lucide-react'
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

const UpsellModal = ({ open, onClose, levelName, isPremium = false, onPurchase }) => {
	const t = useTranslations('common')
	const { isDark } = useThemeMode()

	// Prix selon le statut premium
	const regularPrice = 20
	const premiumPrice = 15
	const price = isPremium ? premiumPrice : regularPrice

	const features = [
		{
			icon: <BookOpen className="h-8 w-8" />,
			title: t('methode_interactive'),
			desc: t('upsell_feature_complete_access'),
		},
		{
			icon: <Zap className="h-8 w-8" />,
			title: t('methode_flexible'),
			desc: t('upsell_feature_flexible_pace'),
		},
		{
			icon: <Trophy className="h-8 w-8" />,
			title: t('upsell_feature_xp_title'),
			desc: t('upsell_feature_xp_desc'),
		},
	]

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent
				className={cn(
					'sm:max-w-md rounded-2xl border',
					isDark
						? 'bg-gradient-to-br from-indigo-950 to-slate-900 border-violet-500/30'
						: 'bg-gradient-to-br from-white to-slate-50 border-violet-500/20',
					'shadow-[0_20px_60px_rgba(0,0,0,0.3)]'
				)}>
				{/* Close button */}
				<button
					onClick={onClose}
					className={cn(
						'absolute right-4 top-4 p-1 rounded-full transition-colors',
						isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'
					)}>
					<X className="h-5 w-5 text-muted-foreground" />
				</button>

				<DialogHeader className="pt-4 pb-2 text-center">
					<div className="mb-4">
						<Trophy
							className="h-16 w-16 mx-auto text-amber-500 drop-shadow-[0_4px_12px_rgba(245,158,11,0.4)]"
						/>
					</div>
					<DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
						{t('upsell_congratulations')}
					</DialogTitle>
					<p className="text-muted-foreground mt-2">
						{t('upsell_first_lesson_complete')}
					</p>
				</DialogHeader>

				<div className="px-2 pb-6">
					{/* Message d'encouragement */}
					<div
						className={cn(
							'text-center mb-6 p-4 rounded-xl border',
							isDark
								? 'bg-violet-500/10 border-violet-500/30'
								: 'bg-violet-500/5 border-violet-500/20'
						)}>
						<h3 className="font-semibold mb-2">
							{t('upsell_enjoyed_lesson')}
						</h3>
						<p className="text-sm text-muted-foreground">
							{t('upsell_unlock_message', { levelName })}
						</p>
					</div>

					{/* Features */}
					<div className="mb-6 space-y-4">
						{features.map((feature, index) => (
							<div key={index} className="flex gap-3 items-start">
								<div className="text-violet-500 flex-shrink-0">
									{feature.icon}
								</div>
								<div>
									<p className="font-semibold text-sm mb-0.5">
										{feature.title}
									</p>
									<p className="text-sm text-muted-foreground">
										{feature.desc}
									</p>
								</div>
							</div>
						))}
					</div>

					{/* Prix */}
					<div
						className={cn(
							'text-center p-6 rounded-xl mb-6 relative overflow-hidden',
							'bg-gradient-to-br from-violet-500 to-violet-600'
						)}>
						{/* Radial glow */}
						<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_70%)] pointer-events-none" />

						{isPremium && (
							<Badge
								variant="secondary"
								className="mb-2 bg-white/20 text-white border-0">
								{t('methode_premium_discount')}
							</Badge>
						)}

						<p className="text-5xl sm:text-6xl font-extrabold text-white relative z-10">
							{price}€
						</p>

						{isPremium && (
							<p className="text-white/70 line-through text-sm mb-2">
								{regularPrice}€
							</p>
						)}

						<p className="text-white/90 text-sm relative z-10">
							{t('upsell_full_access', { levelName })}
						</p>
					</div>

					{/* CTA Buttons */}
					<div className="flex flex-col gap-3">
						<Button
							size="lg"
							onClick={onPurchase}
							className={cn(
								'w-full py-6 text-lg font-bold rounded-xl',
								'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-green-600 hover:to-emerald-700',
								'shadow-[0_8px_24px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_32px_rgba(16,185,129,0.6)]',
								'transition-all hover:-translate-y-0.5'
							)}>
							{t('upsell_unlock_now')}
						</Button>

						<Button
							variant="outline"
							onClick={onClose}
							className={cn(
								'w-full py-5',
								isDark
									? 'border-white/20 hover:bg-white/5'
									: 'border-black/20 hover:bg-black/5'
							)}>
							{t('upsell_maybe_later')}
						</Button>
					</div>

					{/* Trust signals */}
					<p className="text-center text-xs text-muted-foreground mt-4">
						{t('upsell_trust_signals')}
					</p>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default UpsellModal
