'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { getUIImageUrl } from '@/utils/mediaUrls'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const Hero = () => {
	const t = useTranslations('home')

	return (
		<section
			className="relative overflow-hidden py-10 pb-[calc(1.5rem+40px)] md:py-22 md:pb-[calc(4rem+80px)] bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900"
			style={{
				clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 40px), 0 100%)',
			}}
		>
			{/* Animated background effects */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{/* Purple glow orb */}
				<div
					className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full opacity-40 blur-[80px] animate-pulse-slow"
					style={{
						background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
					}}
				/>
				{/* Cyan glow orb */}
				<div
					className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full opacity-30 blur-[60px] animate-pulse-slow"
					style={{
						background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)',
						animationDelay: '2s',
					}}
				/>
				{/* Gaming grid overlay */}
				<div
					className="absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)',
						backgroundSize: '50px 50px',
					}}
				/>
				{/* Radial gradients overlay */}
				<div
					className="absolute inset-0"
					style={{
						background: 'radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.25) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.2) 0%, transparent 50%)',
					}}
				/>
			</div>

			<div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-12">
				<div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-12 text-center lg:text-left">
					{/* Content */}
					<div className="max-w-[825px]">
						{/* Badge with shadcn */}
						<Badge
							variant="outline"
							className={cn(
								"mb-4 md:mb-6 px-4 py-1.5 md:px-5 md:py-2",
								"bg-violet-500/20 border-violet-500/30 backdrop-blur-sm",
								"text-white/95 font-semibold text-sm",
								"animate-fade-in-up rounded-full"
							)}
						>
							<Sparkles className="w-4 h-4 mr-2 text-violet-400 animate-pulse" />
							{t('platformTagline')}
						</Badge>

						{/* Title with gradient */}
						<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 md:mb-6 animate-fade-in-up [animation-delay:100ms]">
							<span className="block text-white/90 font-semibold mb-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl">
								{t('hero')}
							</span>
							<span
								className="bg-gradient-to-r from-white via-violet-300 to-cyan-300 bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_200%]"
							>
								{t('title')}
							</span>
						</h1>

						{/* Subtitle - Mobile */}
						<p className="block md:hidden text-white/80 text-base font-medium leading-relaxed mb-6 animate-fade-in-up [animation-delay:200ms]">
							{t('subtitleMobile')}
						</p>
						{/* Subtitle - Desktop */}
						<p className="hidden md:block text-white/85 text-xl lg:text-2xl font-medium leading-relaxed mb-8 animate-fade-in-up [animation-delay:200ms]">
							{t('subtitle')}
						</p>

						{/* CTA Button with shadcn */}
						<div className="animate-fade-in-up [animation-delay:400ms]">
							<Link href="/materials">
								<Button
									size="lg"
									className={cn(
										"group relative overflow-hidden",
										"px-8 py-6 md:px-10 md:py-7 text-base md:text-lg font-bold",
										"bg-gradient-to-r from-violet-600 to-cyan-500",
										"hover:from-violet-500 hover:to-cyan-400",
										"border border-violet-400/50 hover:border-violet-300/70",
										"shadow-[0_8px_30px_rgba(139,92,246,0.4),0_0_20px_rgba(6,182,212,0.3)]",
										"hover:shadow-[0_12px_40px_rgba(139,92,246,0.6),0_0_30px_rgba(6,182,212,0.4)]",
										"hover:-translate-y-1 hover:scale-[1.02]",
										"transition-all duration-300 ease-out",
										"rounded-xl mx-auto lg:mx-0"
									)}
								>
									{/* Shine effect */}
									<span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
									<span className="relative flex items-center gap-2">
										{t('start')}
										<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
									</span>
								</Button>
							</Link>
						</div>
					</div>

					{/* Hero Image - Desktop only */}
					<div className="hidden lg:flex relative w-80 h-80 items-center justify-center animate-float">
						{/* Animated glow background */}
						<div
							className="absolute w-[120%] h-[120%] rounded-full blur-[60px] animate-pulse-slow"
							style={{
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(6, 182, 212, 0.3) 100%)',
							}}
						/>

						{/* Rotating border frame */}
						<div
							className="absolute w-full h-full rounded-full animate-spin-slow"
							style={{
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)',
								border: '3px solid rgba(255, 255, 255, 0.2)',
								backdropFilter: 'blur(10px)',
								boxShadow: '0 0 40px rgba(139, 92, 246, 0.5), inset 0 0 40px rgba(6, 182, 212, 0.2), 0 8px 32px rgba(0, 0, 0, 0.2)',
							}}
						>
							{/* Gradient border ring */}
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
						<div className="relative w-[90%] h-[90%] rounded-full overflow-hidden z-10">
							<img
								src={getUIImageUrl('hero.webp')}
								alt="Linguami hero"
								className="w-full h-full object-cover drop-shadow-[0_10px_30px_rgba(139,92,246,0.4)]"
							/>
							{/* Corner overlay to hide watermark */}
							<div
								className="absolute bottom-0 right-0 w-[35%] h-[20%] z-20"
								style={{
									background: 'linear-gradient(135deg, transparent 0%, rgba(15, 23, 42, 0.95) 40%)',
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Hero
