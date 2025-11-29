'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

const MultimediaCard = ({ 
	img, 
	title, 
	subtitle, 
	subtitleMobile, 
	link,
	className 
}) => {
	return (
		<Link href={link} className={cn("block w-full max-w-[220px] h-full", className)}>
			<Card className={cn(
				"group relative overflow-hidden h-full",
				"bg-gradient-to-br from-white/[0.98] to-violet-50/95 dark:from-slate-800/[0.98] dark:to-slate-900/95",
				"border-2 border-transparent",
				"shadow-[0_4px_20px_rgba(139,92,246,0.3)]",
				"hover:shadow-[0_12px_40px_rgba(139,92,246,0.45),0_0_20px_rgba(6,182,212,0.25)]",
				"lg:hover:-translate-y-0 lg:hover:scale-100",
				"hover:-translate-y-3 hover:scale-105",
				"transition-all duration-300 cursor-pointer rounded-2xl",
				// Gradient border effect
				"bg-clip-padding",
				"[background-image:linear-gradient(white,white),linear-gradient(135deg,rgba(139,92,246,0.4),rgba(6,182,212,0.4),rgba(139,92,246,0.4))]",
				"dark:[background-image:linear-gradient(rgba(30,41,59,1),rgba(30,41,59,1)),linear-gradient(135deg,rgba(139,92,246,0.5),rgba(6,182,212,0.5),rgba(139,92,246,0.5))]",
				"[background-origin:border-box]",
				"[background-clip:padding-box,border-box]"
			)}>
				{/* Shine effect on hover */}
				<div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-violet-500/10 to-transparent pointer-events-none" />

				<CardContent className="flex flex-col items-center gap-3 px-5 sm:px-6 py-4 sm:py-5 text-center h-full">
					{/* Image container */}
					<div className="relative w-[80px] sm:w-[95px] h-[80px] sm:h-[95px]">
						{/* Animated blur background */}
						<div 
							className="absolute w-[120%] h-[120%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl blur-[40px] animate-pulse-slow"
							style={{
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)',
							}}
						/>

						{/* Outer frame with glassmorphism */}
						<div 
							className="absolute w-full h-full rounded-xl transition-all duration-400 group-hover:-translate-x-[3px] group-hover:-translate-y-[3px] group-hover:-rotate-2"
							style={{
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)',
								border: '3px solid rgba(255, 255, 255, 0.2)',
								backdropFilter: 'blur(10px)',
								boxShadow: '0 0 30px rgba(139, 92, 246, 0.5), inset 0 0 30px rgba(6, 182, 212, 0.2), 0 6px 24px rgba(0, 0, 0, 0.2)',
							}}
						>
							{/* Gradient border */}
							<div 
								className="absolute -inset-[3px] rounded-xl p-[3px] opacity-60"
								style={{
									background: 'linear-gradient(135deg, #8b5cf6, #06b6d4, #8b5cf6)',
									WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
									WebkitMaskComposite: 'xor',
									maskComposite: 'exclude',
								}}
							/>
						</div>

						{/* Image container with icon */}
						<div className="relative w-[90%] h-[90%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg overflow-hidden z-10 transition-all duration-400 group-hover:-translate-x-[47%] group-hover:-translate-y-[47%] group-hover:rotate-2">
							<img
								src={img}
								alt={title}
								className="w-full h-full object-cover drop-shadow-[0_10px_30px_rgba(139,92,246,0.4)]"
							/>
							{/* Overlay for watermark */}
							<div 
								className="absolute bottom-0 right-0 w-[40%] h-[25%] z-10"
								style={{
									background: 'linear-gradient(135deg, transparent 0%, rgba(139, 92, 246, 0.15) 40%)',
								}}
							/>
						</div>
					</div>

					{/* Content */}
					<div className="w-full px-1 flex-1 flex flex-col">
						{/* Title - Heroic fantasy style */}
						<h6 
							className="text-[1.1rem] sm:text-[1.15rem] font-extrabold uppercase tracking-wide mb-2 relative"
							style={{
								background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 50%, #06b6d4 100%)',
								backgroundSize: '200% 200%',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
							}}
						>
							{title}
							{/* Underline decoration */}
							<span 
								className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/5 h-px"
								style={{
									background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent)',
								}}
							/>
						</h6>

						{/* Decorative separator */}
						<div className="flex items-center justify-center gap-2 my-2">
							<span 
								className="w-5 h-px"
								style={{ background: 'linear-gradient(to right, transparent, rgba(139, 92, 246, 0.6))' }}
							/>
							<span 
								className="w-1.5 h-1.5 rounded-full animate-glow"
								style={{
									background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
									boxShadow: '0 0 8px rgba(139, 92, 246, 0.6)',
								}}
							/>
							<span 
								className="w-5 h-px"
								style={{ background: 'linear-gradient(to left, transparent, rgba(6, 182, 212, 0.6))' }}
							/>
						</div>

						{/* Description - Parchment style with quotes */}
						<p className="relative text-slate-600 dark:text-slate-300 font-medium text-[0.8rem] sm:text-[0.85rem] leading-relaxed italic px-1 flex-1">
							{/* Opening quote */}
							<span 
								className="absolute -left-1 -top-2 text-2xl font-serif text-violet-500/30"
							>
								&ldquo;
							</span>
							{/* Mobile text */}
							<span className="block sm:hidden">{subtitleMobile}</span>
							{/* Desktop text */}
							<span className="hidden sm:block">{subtitle}</span>
							{/* Closing quote */}
							<span 
								className="absolute -right-1 -bottom-2 text-2xl font-serif text-cyan-500/30"
							>
								&rdquo;
							</span>
						</p>
					</div>
				</CardContent>
			</Card>
		</Link>
	)
}

export default MultimediaCard
