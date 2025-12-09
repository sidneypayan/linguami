'use client'

import { Compass, GraduationCap, Sparkles, BookOpen, Target } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { useRouterCompat } from '@/hooks/shared/useRouterCompat'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Onboarding modal displayed to new users
 * - After signup
 * - On first visit to materials page
 *
 * Offers two choices:
 * 1. "I'm a beginner" → Redirects to Method (free lesson)
 * 2. "I want to explore" → Closes modal, lets user browse freely
 */
const OnboardingModal = ({
	open,
	onClose,
	onChooseBeginner,
	onChooseExplore,
}) => {
	const t = useTranslations('common')
	const { isDark } = useThemeMode()
	const router = useRouterCompat()

	const handleBeginner = () => {
		if (onChooseBeginner) {
			onChooseBeginner()
		} else {
			// Default: redirect to method beginner level
			router.push('/method/beginner')
		}
		onClose()
	}

	const handleExplore = () => {
		if (onChooseExplore) {
			onChooseExplore()
		}
		onClose()
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent
				isDark={isDark}
				className={cn(
					'sm:max-w-lg rounded-2xl border p-0 overflow-hidden',
					isDark
						? 'bg-gradient-to-br from-slate-900 to-slate-950 border-slate-700'
						: 'bg-gradient-to-br from-white to-slate-50 border-slate-200',
					'shadow-[0_20px_60px_rgba(0,0,0,0.3)]'
				)}>

				<DialogHeader className="pt-8 pb-4 px-6 text-center">
					{/* Welcome icon */}
					<div className="mb-4 relative">
						<div
							className={cn(
								'w-20 h-20 mx-auto rounded-full flex items-center justify-center',
								'bg-gradient-to-br from-violet-500 to-cyan-500',
								'shadow-[0_8px_32px_rgba(139,92,246,0.4)]'
							)}>
							<Sparkles className="h-10 w-10 text-white" />
						</div>
						{/* Decorative rings */}
						<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
							<div className="w-24 h-24 rounded-full border-2 border-violet-500/20 animate-ping" style={{ animationDuration: '2s' }} />
						</div>
					</div>

					<DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
						{t('onboarding_welcome_title')}
					</DialogTitle>
					<p className="text-muted-foreground mt-3 text-base">
						{t('onboarding_welcome_subtitle')}
					</p>
				</DialogHeader>

				<div className="px-6 pb-8">
					{/* Two choice cards */}
					<div className="space-y-4">

						{/* Option 1: I'm a beginner */}
						<button
							onClick={handleBeginner}
							className={cn(
								'w-full p-5 rounded-xl border-2 text-left transition-all duration-300',
								'hover:scale-[1.02] hover:shadow-lg',
								isDark
									? 'bg-gradient-to-br from-emerald-950/50 to-teal-950/50 border-emerald-500/30 hover:border-emerald-500/60'
									: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-500/30 hover:border-emerald-500/60',
							)}>
							<div className="flex items-start gap-4">
								<div
									className={cn(
										'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
										'bg-gradient-to-br from-emerald-500 to-teal-500',
										'shadow-[0_4px_16px_rgba(16,185,129,0.3)]'
									)}>
									<GraduationCap className="h-6 w-6 text-white" />
								</div>
								<div className="flex-1">
									<h3 className="font-bold text-lg mb-1">
										{t('onboarding_beginner_title')}
									</h3>
									<p className="text-sm text-muted-foreground">
										{t('onboarding_beginner_desc')}
									</p>
									<div className="flex items-center gap-2 mt-3">
										<Target className="h-4 w-4 text-emerald-500" />
										<span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
											{t('onboarding_beginner_cta')}
										</span>
									</div>
								</div>
							</div>
						</button>

						{/* Option 2: I want to explore */}
						<button
							onClick={handleExplore}
							className={cn(
								'w-full p-5 rounded-xl border-2 text-left transition-all duration-300',
								'hover:scale-[1.02] hover:shadow-lg',
								isDark
									? 'bg-slate-800/50 border-slate-600 hover:border-slate-500'
									: 'bg-slate-50 border-slate-200 hover:border-slate-300',
							)}>
							<div className="flex items-start gap-4">
								<div
									className={cn(
										'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
										isDark
											? 'bg-slate-700'
											: 'bg-slate-200',
									)}>
									<Compass className="h-6 w-6 text-slate-500" />
								</div>
								<div className="flex-1">
									<h3 className="font-bold text-lg mb-1">
										{t('onboarding_explore_title')}
									</h3>
									<p className="text-sm text-muted-foreground">
										{t('onboarding_explore_desc')}
									</p>
									<div className="flex items-center gap-2 mt-3">
										<BookOpen className="h-4 w-4 text-slate-500" />
										<span className="text-xs font-medium text-slate-500">
											{t('onboarding_explore_cta')}
										</span>
									</div>
								</div>
							</div>
						</button>
					</div>

					{/* Note */}
					<p className="text-center text-xs text-muted-foreground mt-6">
						{t('onboarding_note')}
					</p>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default OnboardingModal
