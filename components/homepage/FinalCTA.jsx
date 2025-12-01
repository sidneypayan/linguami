'use client'

import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useThemeMode } from '@/context/ThemeContext'
import { getUIImageUrl } from '@/utils/mediaUrls'

const FinalCTA = ({ translations }) => {
	const { isDark } = useThemeMode()

	return (
		<section className="relative py-16 md:py-24 overflow-hidden">
			{/* Background effects */}
			<div className="absolute inset-0 pointer-events-none">
				{/* Gradient orbs */}
				<div
					className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-30"
					style={{
						background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
					}}
				/>
				<div
					className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full blur-[80px] opacity-25"
					style={{
						background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)',
					}}
				/>
			</div>

			<div className="relative z-10 max-w-4xl mx-auto px-4">
				<div
					className={cn(
						"relative rounded-3xl p-8 md:p-12 text-center overflow-hidden",
						"border-2",
						isDark
							? "bg-gradient-to-br from-slate-800/90 to-slate-900/95 border-violet-500/30"
							: "bg-gradient-to-br from-white to-violet-50/50 border-violet-500/20",
						"shadow-2xl"
					)}
					style={{
						boxShadow: isDark
							? '0 20px 60px rgba(0, 0, 0, 0.4)'
							: '0 20px 60px rgba(139, 92, 246, 0.15)',
					}}
				>
					{/* Gaming corner decorations */}
					<div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-violet-500/50 rounded-tl-lg" />
					<div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-lg" />
					<div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-violet-500/50 rounded-bl-lg" />
					<div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50 rounded-br-lg" />

					{/* Hero banner */}
					<div className="relative w-full max-w-md mx-auto mb-6">
						<div className="relative rounded-2xl overflow-hidden h-32 md:h-40 shadow-lg">
							<div
								className="absolute inset-0"
								style={{
									backgroundImage: `url(${getUIImageUrl('statistics-rank-1.png')})`,
									backgroundSize: 'cover',
									backgroundPosition: 'center 60%',
								}}
							/>
							{/* Gradient overlay */}
							<div
								className="absolute inset-0"
								style={{
									background: isDark
										? 'linear-gradient(to top, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.2) 50%, transparent 100%)'
										: 'linear-gradient(to top, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
								}}
							/>
						</div>
					</div>

					{/* Title */}
					<h2
						className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4"
						style={{
							background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 50%, #06b6d4 100%)',
							backgroundSize: '200% 200%',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
						}}
					>
						{translations.final_cta_title}
					</h2>

					{/* Subtitle */}
					<p className={cn(
						"text-base md:text-lg mb-8 max-w-xl mx-auto",
						isDark ? "text-slate-400" : "text-slate-500"
					)}>
						{translations.final_cta_subtitle}
					</p>

					{/* CTA Button */}
					<Link href="/materials">
						<Button
							size="lg"
							className={cn(
								"group relative overflow-hidden",
								"px-8 py-6 md:px-10 md:py-7 text-base md:text-lg font-bold",
								"bg-gradient-to-r from-violet-600 to-cyan-500",
								"hover:from-violet-500 hover:to-cyan-400",
								"border border-violet-400/50 hover:border-violet-300/70",
								"shadow-[0_8px_30px_rgba(139,92,246,0.4)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]",
								"hover:shadow-[0_12px_40px_rgba(139,92,246,0.6)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]",
								"hover:-translate-y-1 hover:scale-[1.02]",
								"transition-all duration-300 ease-out",
								"rounded-xl"
							)}
						>
							{/* Shine effect */}
							<span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
							<span className="relative flex items-center gap-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
								{translations.final_cta_button}
								<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</span>
						</Button>
					</Link>
				</div>
			</div>
		</section>
	)
}

export default FinalCTA
