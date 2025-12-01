'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useThemeMode } from '@/context/ThemeContext'

const faqKeys = [
	{ q: 'faq1_q', a: 'faq1_a' },
	{ q: 'faq2_q', a: 'faq2_a' },
	{ q: 'faq3_q', a: 'faq3_a' },
	{ q: 'faq4_q', a: 'faq4_a' },
	{ q: 'faq5_q', a: 'faq5_a' },
]

const FAQItem = ({ question, answer, isOpen, onClick, isDark }) => {
	return (
		<div
			className={cn(
				"border rounded-xl overflow-hidden transition-all duration-300",
				isDark
					? "border-slate-700/50 hover:border-violet-500/30"
					: "border-slate-200 hover:border-violet-500/30",
				isOpen && (isDark ? "border-violet-500/50" : "border-violet-500/40")
			)}
		>
			<button
				onClick={onClick}
				className={cn(
					"w-full px-5 py-4 flex items-center justify-between gap-4 text-left transition-colors",
					isDark
						? "hover:bg-slate-800/50"
						: "hover:bg-slate-50",
					isOpen && (isDark ? "bg-slate-800/50" : "bg-violet-50/50")
				)}
			>
				<span className={cn(
					"font-semibold text-sm md:text-base",
					isDark ? "text-white" : "text-slate-800"
				)}>
					{question}
				</span>
				<ChevronDown
					className={cn(
						"w-5 h-5 flex-shrink-0 transition-transform duration-300",
						isDark ? "text-violet-400" : "text-violet-500",
						isOpen && "rotate-180"
					)}
				/>
			</button>
			<div
				className={cn(
					"grid transition-all duration-300",
					isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
				)}
			>
				<div className="overflow-hidden">
					<p className={cn(
						"px-5 pb-4 text-sm leading-relaxed",
						isDark ? "text-slate-400" : "text-slate-600"
					)}>
						{answer}
					</p>
				</div>
			</div>
		</div>
	)
}

const FAQ = ({ translations }) => {
	const { isDark } = useThemeMode()
	const [openIndex, setOpenIndex] = useState(0)

	return (
		<section className="relative py-16 md:py-24">
			{/* Background decoration */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden">
				<div
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-full blur-[120px] opacity-40"
					style={{
						background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
					}}
				/>
			</div>

			<div className="relative z-10 max-w-3xl mx-auto px-4">
				{/* Container with gaming style */}
				<div
					className={cn(
						"relative rounded-3xl p-6 md:p-10 overflow-hidden",
						"border-2",
						isDark
							? "bg-gradient-to-br from-slate-800/80 to-slate-900/90 border-violet-500/20"
							: "bg-gradient-to-br from-white/90 to-violet-50/50 border-violet-500/15",
					)}
					style={{
						boxShadow: isDark
							? '0 15px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
							: '0 15px 50px rgba(139, 92, 246, 0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
					}}
				>
					{/* Gaming corner decorations */}
					<div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-violet-500/40 rounded-tl-lg" />
					<div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-cyan-500/40 rounded-tr-lg" />
					<div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-violet-500/40 rounded-bl-lg" />
					<div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-cyan-500/40 rounded-br-lg" />

					{/* Section Header */}
					<div className="text-center mb-8 md:mb-10">
						<h2
							className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 tracking-tight leading-[1.3]"
							style={{
								background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 50%, #06b6d4 100%)',
								backgroundSize: '200% 200%',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
							}}
						>
							{translations.faq_title}
						</h2>
						{/* Decorative line under title */}
						<div className="flex items-center justify-center gap-2 mt-4">
							<span
								className="w-12 h-0.5"
								style={{ background: 'linear-gradient(to right, transparent, rgba(139, 92, 246, 0.5))' }}
							/>
							<span
								className="w-2 h-2 rounded-full"
								style={{
									background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
									boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
								}}
							/>
							<span
								className="w-12 h-0.5"
								style={{ background: 'linear-gradient(to left, transparent, rgba(6, 182, 212, 0.5))' }}
							/>
						</div>
					</div>

					{/* FAQ Items */}
					<div className="space-y-3">
						{faqKeys.map((faq, index) => (
							<FAQItem
								key={index}
								question={translations[faq.q]}
								answer={translations[faq.a]}
								isOpen={openIndex === index}
								onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
								isDark={isDark}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}

export default FAQ
