'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const FeatureCard = ({ 
	title, 
	subtitle, 
	imageSrc, 
	imageAlt, 
	onShowClick, 
	reverse, 
	marginTop, 
	badge, 
	offsetDirection = 'center',
	buttonText 
}) => {
	const getOffset = () => {
		if (!offsetDirection || offsetDirection === 'center') return ''
		if (offsetDirection === 'left') return 'lg:-translate-x-6'
		if (offsetDirection === 'right') return 'lg:translate-x-6'
		return ''
	}

	return (
		<div 
			className={cn(
				"w-full md:w-[850px] lg:w-[900px] max-w-full mx-auto relative transition-transform duration-400",
				marginTop ? "" : "mt-12 md:mt-20",
				getOffset()
			)}
			style={marginTop ? { marginTop: typeof marginTop === 'object' ? undefined : marginTop } : undefined}
		>
			{/* Decorative corners - Gaming style */}
			<div className="absolute top-0 left-0 w-[30px] md:w-[40px] h-[30px] md:h-[40px] border-t-[3px] border-l-[3px] border-violet-500/40 rounded-tl-[15px] md:rounded-tl-[20px] z-10 transition-all duration-400" />
			<div className="absolute top-0 right-0 w-[30px] md:w-[40px] h-[30px] md:h-[40px] border-t-[3px] border-r-[3px] border-cyan-500/40 rounded-tr-[15px] md:rounded-tr-[20px] z-10 transition-all duration-400" />
			<div className="absolute bottom-0 left-0 w-[30px] md:w-[40px] h-[30px] md:h-[40px] border-b-[3px] border-l-[3px] border-violet-500/40 rounded-bl-[15px] md:rounded-bl-[20px] z-10 transition-all duration-400" />
			<div className="absolute bottom-0 right-0 w-[30px] md:w-[40px] h-[30px] md:h-[40px] border-b-[3px] border-r-[3px] border-cyan-500/40 rounded-br-[15px] md:rounded-br-[20px] z-10 transition-all duration-400" />

			{/* Glow effect background */}
			<div 
				className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-[60px]"
				style={{
					background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
				}}
			/>

			<Card className={cn(
				"group relative overflow-hidden",
				"bg-gradient-to-br from-white/[0.98] to-white/95 dark:from-slate-800/[0.98] dark:to-slate-900/95",
				"backdrop-blur-xl border border-violet-500/15 dark:border-violet-500/30",
				"shadow-[0_8px_32px_rgba(139,92,246,0.12)] dark:shadow-[0_8px_32px_rgba(139,92,246,0.25)]",
				"hover:shadow-[0_12px_48px_rgba(139,92,246,0.2)] dark:hover:shadow-[0_12px_48px_rgba(139,92,246,0.35)]",
				"transition-all duration-400 rounded-[20px]"
			)}>
				<CardContent className={cn(
					"flex items-center gap-4 md:gap-8 lg:gap-9 p-5 sm:p-10 md:p-12 lg:p-14",
					reverse ? "flex-col md:flex-row-reverse" : "flex-col md:flex-row"
				)}>
					{/* Image Section */}
					<div className="w-full md:w-[42%] flex items-center justify-center relative z-10">
						<div className="relative w-40 md:w-[200px] lg:w-[220px] h-40 md:h-[200px] lg:h-[220px] animate-float">
							{/* Animated blur circle */}
							<div 
								className="absolute w-[120%] h-[120%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px] animate-pulse-slow"
								style={{
									background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)',
								}}
							/>

							{/* Glassmorphism frame */}
							<div 
								className="absolute w-full h-full rounded-full animate-spin-slow"
								style={{
									background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)',
									border: '3px solid rgba(255, 255, 255, 0.2)',
									backdropFilter: 'blur(10px)',
									boxShadow: '0 0 40px rgba(139, 92, 246, 0.5), inset 0 0 40px rgba(6, 182, 212, 0.2), 0 8px 32px rgba(0, 0, 0, 0.2)',
								}}
							>
								{/* Gradient border */}
								<div 
									className="absolute -inset-[3px] rounded-full p-[3px] opacity-60"
									style={{
										background: 'linear-gradient(135deg, #8b5cf6, #06b6d4, #8b5cf6)',
										WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
										WebkitMaskComposite: 'xor',
										maskComposite: 'exclude',
									}}
								/>
							</div>

							{/* Image container */}
							<div className="relative w-[90%] h-[90%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden z-10 transition-all duration-500 group-hover:scale-105">
								<img
									src={imageSrc}
									alt={imageAlt}
									className="w-full h-full object-cover drop-shadow-[0_10px_30px_rgba(139,92,246,0.4)]"
								/>
							</div>
						</div>
					</div>

					{/* Content Section */}
					<div className={cn(
						"w-full md:w-[58%] flex flex-col gap-4 md:gap-5 relative z-10",
						"text-center md:text-left"
					)}>
						{/* Badge */}
						{badge && (
							<Badge 
								className={cn(
									"self-center md:self-start w-fit",
									"bg-gradient-to-r from-violet-500/15 to-cyan-500/10",
									"border border-violet-500/30 backdrop-blur-sm",
									"text-violet-600 dark:text-violet-400 font-bold text-xs",
									"px-3 py-1 h-7"
								)}
							>
								<Sparkles className="w-4 h-4 mr-1.5 text-violet-500" />
								{badge}
							</Badge>
						)}

						{/* Title */}
						<h3 
							className="text-[1.875rem] md:text-[2rem] lg:text-[2.25rem] font-extrabold leading-tight"
							style={{
								background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 60%, #06b6d4 100%)',
								backgroundSize: '200% 200%',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
							}}
						>
							{title}
						</h3>

						{/* Subtitle */}
						<p className="text-slate-500 dark:text-slate-300 font-medium leading-relaxed text-[0.95rem] md:text-base lg:text-[1.05rem]">
							{subtitle}
						</p>

						{/* Button */}
						<Button
							onClick={onShowClick}
							size="lg"
							className={cn(
								"self-center md:self-start group/btn relative overflow-hidden",
								"min-w-[180px] md:min-w-[200px] lg:min-w-[210px]",
								"h-12 md:h-[52px] lg:h-[54px]",
								"text-[0.95rem] md:text-[0.98rem] lg:text-[1.02rem] font-bold",
								"bg-gradient-to-r from-violet-600 to-cyan-500",
								"hover:from-violet-500 hover:to-cyan-400",
								"border border-violet-500/50 hover:border-violet-500/70",
								"shadow-[0_4px_20px_rgba(139,92,246,0.4)]",
								"hover:shadow-[0_8px_40px_rgba(139,92,246,0.6)]",
								"hover:-translate-y-0.5 hover:scale-[1.02]",
								"transition-all duration-300 rounded-xl"
							)}
						>
							{/* Shine effect */}
							<span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
							<span className="relative flex items-center gap-2">
								<Play className="w-5 h-5 fill-current" />
								{buttonText}
							</span>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default FeatureCard
