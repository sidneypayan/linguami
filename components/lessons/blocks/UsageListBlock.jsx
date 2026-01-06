import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import PlayableText from '@/components/courses/blocks/PlayableText'

export default function UsageListBlock({ title, items, audioUrls = {}, isDark }) {
	const t = useTranslations('lessons')

	return (
		<div className="mb-8">
			<h3 className={cn(
				"text-xl font-bold mb-4",
				isDark ? "text-slate-100" : "text-slate-800"
			)}>{title || t('usageTitle')}</h3>
			{items?.map((item, i) => (
				<div key={i} className={cn(
					"mb-2 p-4 sm:p-5 rounded-none sm:rounded-xl border-y sm:border-2 transition-colors",
					"-mx-5 sm:mx-0",
					isDark
						? "border-slate-700 bg-slate-800/50 hover:border-indigo-500/50"
						: "border-slate-200 bg-white hover:border-indigo-300"
				)}>
					<div className="flex items-center gap-2 mb-3">
						<div className={cn(
							"w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold",
							"bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md",
							isDark ? "shadow-indigo-500/20" : "shadow-indigo-500/30"
						)}>
							{i + 1}
						</div>
						<h4 className={cn(
							"font-bold text-base sm:text-lg",
							isDark
								? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300"
								: "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
						)}>{item.usage}</h4>
					</div>
					<div>
						{item.examples?.map((ex, j) => (
							<p key={j} className={cn(
								"pl-4 border-l-2 !mb-0",
								j > 0 && "mt-1",
								isDark ? "text-slate-300 border-indigo-500/50" : "text-slate-600 border-indigo-200"
							)}>
								<PlayableText
									text={ex}
									audioUrls={item.audioUrls || audioUrls}
								/>
							</p>
						))}
					</div>
					{item.commonMistake && (
						<div className={cn(
							"mt-3 p-3 border-l-4 border-red-400 rounded-none sm:rounded",
							isDark ? "bg-red-500/10" : "bg-red-50"
						)}>
							<p className={cn(
								"text-sm font-semibold mb-1",
								isDark ? "text-red-400" : "text-red-800"
							)}>{t('commonMistakeLabel')}</p>
							<p className={cn(
								"text-sm",
								isDark ? "text-slate-300" : "text-slate-600"
							)}>
								<span className="line-through text-red-600">
									<PlayableText
										text={item.commonMistake.wrong}
										audioUrls={item.audioUrls || audioUrls}
									/>
								</span>
								{' → '}
								<span className="text-green-600 font-semibold">
									<PlayableText
										text={item.commonMistake.correct}
										audioUrls={item.audioUrls || audioUrls}
									/>
								</span>
							</p>
						</div>
					)}
				</div>
			))}
		</div>
	)
}
