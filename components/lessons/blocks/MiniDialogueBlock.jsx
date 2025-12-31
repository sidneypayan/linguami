import { cn } from '@/lib/utils'
import PlayableText from '@/components/courses/blocks/PlayableText'

export default function MiniDialogueBlock({ title, lines, translation, audioUrls = {}, isDark }) {
	return (
		<div className={cn(
			"mb-8 p-4 sm:p-6 rounded-none sm:rounded-xl border-y sm:border-2",
			"-mx-5 sm:mx-0",
			isDark
				? "bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/30"
				: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
		)}>
			<h4 className={cn(
				"text-lg font-bold mb-4",
				isDark ? "text-blue-400" : "text-blue-800"
			)}>{title || 'Exemple en contexte'}</h4>
			<div className="space-y-3">
				{lines?.map((line, i) => (
					<div key={i} className="flex gap-3">
						<span className={cn(
							"font-bold min-w-[80px]",
							isDark ? "text-indigo-400" : "text-indigo-600"
						)}>{line.speaker}</span>
						<span className={cn(isDark ? "text-slate-300" : "text-slate-700")}>
							<PlayableText
								text={line.text}
								audioUrls={audioUrls}
							/>
						</span>
					</div>
				))}
			</div>
			{translation && (
				<p className={cn(
					"mt-4 pt-4 border-t text-sm italic",
					isDark ? "border-blue-500/30 text-slate-400" : "border-blue-300 text-slate-600"
				)}>
					{translation}
				</p>
			)}
		</div>
	)
}
