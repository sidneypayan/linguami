'use client'

import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useThemeMode } from '@/context/ThemeContext'

const BentoCard = ({ title, subtitle, imageSrc, imageAlt, href, buttonText, size = 'normal' }) => {
	const { isDark } = useThemeMode()
	const isLarge = size === 'large'

	return (
		<Link
			href={href}
			className={cn(
				"group relative block overflow-hidden rounded-3xl",
				"border transition-all duration-500",
				"hover:scale-[1.02] hover:-translate-y-1",
				isDark
					? "bg-gradient-to-br from-slate-800/90 to-slate-900/95 border-violet-500/30 hover:border-violet-500/50"
					: "bg-gradient-to-br from-white to-slate-50 border-slate-200 hover:border-violet-500/40",
				"shadow-lg hover:shadow-2xl",
				isDark
					? "hover:shadow-violet-500/20"
					: "hover:shadow-violet-500/15",
				isLarge ? "h-full" : "h-full"
			)}
		>
			{/* Gradient overlay on hover */}
			<div
				className={cn(
					"absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
					"bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5"
				)}
			/>

			{/* Shine effect on hover */}
			<div
				className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
				style={{
					background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)',
					transform: 'translateX(-100%)',
					animation: 'none',
				}}
			/>
			<div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
				<div
					className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
					style={{
						background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)',
					}}
				/>
			</div>

			{/* Content */}
			<div className={cn(
				"relative z-10 h-full flex",
				isLarge ? "flex-col p-6 md:p-8" : "flex-row items-center gap-4 p-4 md:p-5"
			)}>
				{/* Image */}
				<div className={cn(
					"relative flex-shrink-0",
					isLarge
						? "w-32 h-32 md:w-40 md:h-40 mx-auto mb-4"
						: "w-16 h-16 md:w-20 md:h-20"
				)}>
					{/* Glow behind image */}
					<div
						className={cn(
							"absolute inset-0 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500",
							"bg-gradient-to-br from-violet-500 to-cyan-500"
						)}
						style={{ transform: 'scale(1.2)' }}
					/>

					{/* Image container with border */}
					<div className={cn(
						"relative w-full h-full rounded-full p-[3px]",
						"bg-gradient-to-br from-violet-500 to-cyan-500",
						"group-hover:from-violet-400 group-hover:to-cyan-400 transition-all duration-500"
					)}>
						<div className={cn(
							"w-full h-full rounded-full overflow-hidden",
							isDark ? "bg-slate-900" : "bg-white"
						)}>
							<img
								src={imageSrc}
								alt={imageAlt}
								className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
							/>
						</div>
					</div>
				</div>

				{/* Text content */}
				<div className={cn(
					"flex-1 min-w-0",
					isLarge ? "text-center" : ""
				)}>
					<h3 className={cn(
						"font-bold leading-tight mb-1 md:mb-2",
						isLarge ? "text-xl md:text-2xl" : "text-base md:text-lg",
						"bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent"
					)}>
						{title}
					</h3>

					<p className={cn(
						"leading-relaxed mb-3 md:mb-4",
						isLarge
							? "text-sm md:text-base"
							: "text-xs md:text-sm line-clamp-2",
						isDark ? "text-slate-400" : "text-slate-500"
					)}>
						{subtitle}
					</p>

					{/* CTA */}
					<div className={cn(
						"inline-flex items-center gap-1.5 font-semibold",
						isLarge ? "text-sm md:text-base" : "text-xs md:text-sm",
						"text-violet-500 group-hover:text-cyan-500 transition-colors duration-300"
					)}>
						{buttonText}
						<ArrowRight className={cn(
							"transition-transform duration-300 group-hover:translate-x-1",
							isLarge ? "w-4 h-4 md:w-5 md:h-5" : "w-3.5 h-3.5 md:w-4 md:h-4"
						)} />
					</div>
				</div>
			</div>

			{/* Corner decorations for large card */}
			{isLarge && (
				<>
					<div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-violet-500/40 rounded-tl-lg" />
					<div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-cyan-500/40 rounded-tr-lg" />
					<div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-violet-500/40 rounded-bl-lg" />
					<div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-cyan-500/40 rounded-br-lg" />
				</>
			)}
		</Link>
	)
}

const BentoGrid = ({ items, translations }) => {
	const { isDark } = useThemeMode()

	// items[0] = large card, items[1-3] = small cards
	const [mainItem, ...sideItems] = items

	return (
		<div className="w-full max-w-6xl mx-auto px-4">
			{/* Desktop: Bento layout */}
			<div className="hidden md:grid md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
				{/* Large card - spans 2 columns on lg */}
				<div className="md:col-span-1 lg:col-span-2 lg:row-span-3">
					<BentoCard
						title={mainItem.title}
						subtitle={mainItem.subtitle}
						imageSrc={mainItem.imageSrc}
						imageAlt={mainItem.imageAlt}
						href={mainItem.href}
						buttonText={translations.tryNow}
						size="large"
					/>
				</div>

				{/* Side cards - each in its own row */}
				{sideItems.map((item, index) => (
					<div key={index} className="md:col-span-1 lg:col-span-3">
						<BentoCard
							title={item.title}
							subtitle={item.subtitle}
							imageSrc={item.imageSrc}
							imageAlt={item.imageAlt}
							href={item.href}
							buttonText={translations.tryNow}
							size="normal"
						/>
					</div>
				))}
			</div>

			{/* Mobile: Stack layout */}
			<div className="md:hidden space-y-4">
				{items.map((item, index) => (
					<BentoCard
						key={index}
						title={item.title}
						subtitle={item.subtitle}
						imageSrc={item.imageSrc}
						imageAlt={item.imageAlt}
						href={item.href}
						buttonText={translations.tryNow}
						size={index === 0 ? "large" : "normal"}
					/>
				))}
			</div>
		</div>
	)
}

export default BentoGrid
