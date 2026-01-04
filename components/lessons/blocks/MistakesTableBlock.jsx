import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import PlayableText from '@/components/courses/blocks/PlayableText'

export default function MistakesTableBlock({ title, rows, audioUrls = {}, isDark }) {
	const t = useTranslations('lessons')

	return (
		<div className="mb-8">
			<h3 className={cn(
				"text-xl font-bold mb-4",
				isDark ? "text-slate-100" : "text-slate-800"
			)}>{title || t('commonMistakesTitle')}</h3>
			<div className="space-y-2">
				{rows?.map((row, i) => (
					<div key={i} className={cn(
						"py-3 px-4 rounded-none sm:rounded-lg border-y sm:border",
						"-mx-5 sm:mx-0",
						isDark ? "border-slate-700 bg-slate-800/30" : "border-slate-200 bg-slate-50"
					)}>
						<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
							<span className={cn(
								"line-through text-red-500",
								isDark && "text-red-400"
							)}>
								<PlayableText
									text={row.wrong}
									audioUrls={audioUrls}
								/>
							</span>
							<span className={cn(
								isDark ? "text-slate-500" : "text-slate-400"
							)}>→</span>
							<span className={cn(
								"font-semibold",
								isDark ? "text-green-400" : "text-green-600"
							)}>
								<PlayableText
									text={row.correct}
									audioUrls={audioUrls}
									allowSingleLetters={true}
								/>
							</span>
						</div>
						{row.explanation && (
							<p className={cn(
								"text-sm mt-1",
								isDark ? "text-slate-400" : "text-slate-500"
							)}>
								<PlayableText
									text={row.explanation}
									audioUrls={audioUrls}
								/>
							</p>
						)}
					</div>
				))}
			</div>
		</div>
	)
}
