'use client'

import { Shield } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

export default function PrivacyClient({ translations, formattedDate, sections }) {
	const { isDark } = useTheme()

	return (
		<div
			className={cn(
				'min-h-screen pt-20 md:pt-24 pb-16',
				isDark
					? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900'
					: 'bg-gradient-to-br from-white via-slate-50 to-indigo-100'
			)}>
			<div className="max-w-3xl mx-auto px-4">
				{/* Header */}
				<div className="text-center mb-12">
					<div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-500/15 mb-6">
						<Shield className="h-12 w-12 text-indigo-500" />
					</div>

					<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
						{translations.title}
					</h1>

					<p className={cn(
						'text-lg max-w-xl mx-auto',
						isDark ? 'text-slate-400' : 'text-slate-600'
					)}>
						{translations.subtitle}
					</p>

					<p className={cn(
						'mt-4 text-sm',
						isDark ? 'text-slate-500' : 'text-slate-500'
					)}>
						{translations.last_updated} {formattedDate}
					</p>
				</div>

				{/* Introduction */}
				<div
					className={cn(
						'mb-12 p-6 rounded-xl border',
						isDark
							? 'bg-violet-500/10 border-violet-500/30'
							: 'bg-indigo-500/5 border-indigo-500/20'
					)}>
					<div
						className="leading-relaxed"
						dangerouslySetInnerHTML={{ __html: translations.intro }}
					/>
				</div>

				{/* Sections */}
				{sections.map((section, index) => (
					<div
						key={index}
						className={cn(
							'mb-8 p-6 rounded-xl border transition-all duration-300',
							'hover:-translate-y-0.5',
							isDark
								? 'bg-slate-800/60 border-white/10 hover:shadow-[0_8px_24px_rgba(139,92,246,0.2)]'
								: 'bg-white border-black/10 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]'
						)}>
						<h2 className="text-xl sm:text-2xl font-bold mb-4 text-indigo-500">
							{section.title}
						</h2>
						<p className={cn(
							'leading-relaxed whitespace-pre-line',
							isDark ? 'text-slate-300' : 'text-slate-700'
						)}>
							{section.content}
						</p>
					</div>
				))}

				{/* Footer CTA */}
				<div className="mt-16 p-6 rounded-xl text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
					<h3 className="text-xl font-bold mb-3">
						{translations.cta_title}
					</h3>
					<p className="mb-4 opacity-90">
						{translations.cta_subtitle}
					</p>
					<Link
						href="mailto:contact@linguami.com"
						className="text-lg font-semibold underline hover:opacity-80 transition-opacity">
						contact@linguami.com
					</Link>
				</div>

				{/* Link to Terms */}
				<div className="mt-8 text-center">
					<Link
						href="/terms"
						className="text-indigo-500 font-semibold hover:underline">
						{translations.footer_link}
					</Link>
				</div>
			</div>
		</div>
	)
}
