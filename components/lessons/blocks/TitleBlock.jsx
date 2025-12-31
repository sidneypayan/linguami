import { cn } from '@/lib/utils'

export default function TitleBlock({ text, isDark }) {
	return (
		<div className="mt-10 mb-5">
			<div className="space-y-2">
				<div className={cn(
					"h-1 w-12 rounded-full",
					"bg-gradient-to-r from-indigo-500 to-purple-600"
				)} />
				<h3 className={cn(
					"text-lg sm:text-xl font-bold",
					isDark
						? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300"
						: "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
				)}>
					{text}
				</h3>
			</div>
		</div>
	)
}
