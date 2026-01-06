import { cn } from '@/lib/utils'

export default function SubtitleBlock({ text, isDark }) {
	return (
		<div className="mt-6 mb-4">
			<div className={cn(
				"flex items-center gap-2.5 px-3 py-2",
				"border-l-4 rounded-r-lg",
				isDark
					? "border-cyan-500 bg-cyan-950/30"
					: "border-cyan-500 bg-cyan-50/70"
			)}>
				<svg className={cn(
					"w-4 h-4 flex-shrink-0",
					isDark ? "text-cyan-400" : "text-cyan-600"
				)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
				</svg>
				<h2 className={cn(
					"text-base sm:text-lg font-semibold",
					isDark ? "text-cyan-300" : "text-cyan-700"
				)}>
					{text}
				</h2>
			</div>
		</div>
	)
}
