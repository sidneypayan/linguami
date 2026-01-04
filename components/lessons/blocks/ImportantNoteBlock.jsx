import { cn } from '@/lib/utils'
import PlayableText from '@/components/courses/blocks/PlayableText'
import PlayableHTML from '@/components/courses/blocks/PlayableHTML'

export default function ImportantNoteBlock({ title, content, examples, note, audioUrls = {}, isDark }) {
	return (
		<div
			className={cn(
				"mb-8 p-4 sm:p-6 rounded-none sm:rounded-xl border-y sm:border-2",
				"-mx-5 sm:mx-0",
				isDark
					? "bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/30"
					: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
			)}>
			<h4 className={cn(
				"text-lg font-bold mb-4 flex items-center gap-2",
				isDark ? "text-blue-400" : "text-blue-800"
			)}>
				<span className="text-2xl">💡</span>
				{title}
			</h4>
			<div className={cn(
				"mb-4 leading-relaxed",
				isDark ? "text-slate-300" : "text-slate-700"
			)}>
				<PlayableHTML
					html={content}
					audioUrls={audioUrls}
				/>
			</div>
			{examples && examples.length > 0 && (
				<div className="space-y-2 mb-4">
					{examples.map((example, i) => (
						<div
							key={i}
							className={cn(
								"p-3 rounded-lg",
								isDark ? "bg-slate-800/50" : "bg-white/70"
							)}
						>
							<PlayableText
								text={example}
								audioUrls={audioUrls}
							/>
						</div>
					))}
				</div>
			)}
			{note && (
				<div className={cn(
					"p-3 rounded-lg border-l-4",
					isDark
						? "bg-amber-500/10 border-amber-500/50 text-amber-300"
						: "bg-amber-50 border-amber-400 text-amber-800"
				)}>
					<PlayableText
						text={note}
						audioUrls={audioUrls}
					/>
				</div>
			)}
		</div>
	)
}
