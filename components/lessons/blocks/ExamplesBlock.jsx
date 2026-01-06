import { cn } from '@/lib/utils'

export default function ExamplesBlock({ items, isDark }) {
	return (
		<div
			className={cn(
				'relative mt-4 mb-6 p-4 sm:p-6 rounded-none sm:rounded-xl overflow-hidden',
				'-mx-5 sm:mx-0',
				'before:absolute before:left-0 before:top-0 before:w-1 before:h-full before:bg-gradient-to-b before:from-indigo-500 before:to-purple-600',
				isDark
					? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-y sm:border-2 border-indigo-500/20'
					: 'bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-y sm:border-2 border-indigo-500/15'
			)}>
			{items.map((example, exampleIndex) => (
				<p
					key={exampleIndex}
					className={cn(
						'italic text-sm sm:text-base leading-relaxed pl-4',
						isDark ? 'text-slate-300' : 'text-slate-600',
						exampleIndex < items.length - 1 && 'mb-4'
					)}
					dangerouslySetInnerHTML={{ __html: example }}
				/>
			))}
		</div>
	)
}
