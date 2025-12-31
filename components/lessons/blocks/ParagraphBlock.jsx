import { cn } from '@/lib/utils'

export default function ParagraphBlock({ text, isDark }) {
	return (
		<p
			className={cn(
				"mt-4 mb-6 text-base sm:text-[1.0625rem] leading-relaxed",
				isDark ? "text-slate-300" : "text-slate-600"
			)}
			dangerouslySetInnerHTML={{ __html: text }}
		/>
	)
}
