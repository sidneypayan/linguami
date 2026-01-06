import { cn } from '@/lib/utils'

export default function ListBlock({ items, isDark }) {
	return (
		<ul
			className={cn(
				"mt-4 mb-6 pl-6 sm:pl-8 list-disc",
				isDark ? "marker:text-indigo-400" : "marker:text-indigo-500"
			)}>
			{items.map((item, itemIndex) => (
				<li
					key={itemIndex}
					className={cn(
						"mb-3 text-base sm:text-[1.0625rem] leading-relaxed",
						isDark ? "text-slate-300" : "text-slate-600"
					)}>
					<span dangerouslySetInnerHTML={{ __html: item }} />
				</li>
			))}
		</ul>
	)
}
