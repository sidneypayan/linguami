'use client'

import { Target, Compass, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useThemeMode } from '@/context/ThemeContext'

const steps = [
	{
		icon: Target,
		titleKey: 'step1_title',
		descKey: 'step1_desc',
		gradient: 'from-violet-500 to-purple-600',
		glowColor: 'rgba(139, 92, 246, 0.4)',
		number: '01',
	},
	{
		icon: Compass,
		titleKey: 'step2_title',
		descKey: 'step2_desc',
		gradient: 'from-cyan-500 to-blue-600',
		glowColor: 'rgba(6, 182, 212, 0.4)',
		number: '02',
	},
	{
		icon: TrendingUp,
		titleKey: 'step3_title',
		descKey: 'step3_desc',
		gradient: 'from-emerald-500 to-teal-600',
		glowColor: 'rgba(16, 185, 129, 0.4)',
		number: '03',
	},
]

const HowItWorks = ({ translations }) => {
	const { isDark } = useThemeMode()

	return (
		<section className="relative py-8 md:py-16">
			{/* Background decoration */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden">
				<div
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full blur-[100px] opacity-30"
					style={{
						background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
					}}
				/>
			</div>

			<div className="relative z-10 max-w-6xl mx-auto px-4">
				{/* Section Header */}
				<div className="text-center mb-12 md:mb-16">
					<h2
						className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 tracking-tight pb-1"
						style={{
							background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 50%, #06b6d4 100%)',
							backgroundSize: '200% 200%',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
						}}
					>
						{translations.how_it_works_title}
					</h2>
					<p className={cn(
						"text-base md:text-lg max-w-2xl mx-auto",
						isDark ? "text-slate-400" : "text-slate-500"
					)}>
						{translations.how_it_works_subtitle}
					</p>
				</div>

				{/* Steps */}
				<div className="grid md:grid-cols-3 gap-6 md:gap-8">
					{steps.map((step, index) => {
						const Icon = step.icon
						return (
							<div
								key={index}
								className={cn(
									"group relative p-6 md:p-8 rounded-2xl transition-all duration-500",
									"hover:-translate-y-2",
									isDark
										? "bg-slate-800/50 hover:bg-slate-800/80"
										: "bg-white hover:bg-slate-50",
									"border",
									isDark ? "border-slate-700/50" : "border-slate-200",
									"hover:border-violet-500/30"
								)}
								style={{
									boxShadow: isDark
										? '0 4px 20px rgba(0,0,0,0.2)'
										: '0 4px 20px rgba(0,0,0,0.05)',
								}}
							>
								{/* Step number - gaming style */}
								<div className={cn(
									"absolute -top-3 -right-3 w-10 h-10 rounded-xl flex items-center justify-center",
									"font-black text-sm",
									"bg-gradient-to-br",
									step.gradient,
									"text-white shadow-lg",
									"border-2",
									isDark ? "border-slate-900" : "border-white"
								)}>
									{step.number}
								</div>

								{/* Icon */}
								<div
									className={cn(
										"w-16 h-16 rounded-2xl flex items-center justify-center mb-5",
										"bg-gradient-to-br",
										step.gradient,
										"shadow-lg transition-transform duration-500 group-hover:scale-110"
									)}
									style={{
										boxShadow: isDark ? 'none' : `0 8px 24px ${step.glowColor}`,
									}}
								>
									<Icon className="w-8 h-8 text-white" />
								</div>

								{/* Content */}
								<h3 className={cn(
									"text-xl font-bold mb-3",
									isDark ? "text-white" : "text-slate-800"
								)}>
									{translations[step.titleKey]}
								</h3>
								<p className={cn(
									"text-sm leading-relaxed",
									isDark ? "text-slate-400" : "text-slate-500"
								)}>
									{translations[step.descKey]}
								</p>

								{/* Connector line (desktop only) */}
								{index < steps.length - 1 && (
									<div className="hidden md:block absolute top-1/2 -right-4 md:-right-5 w-8 md:w-10 h-0.5 bg-gradient-to-r from-violet-500/50 to-transparent" />
								)}
							</div>
						)
					})}
				</div>
			</div>
		</section>
	)
}

export default HowItWorks
