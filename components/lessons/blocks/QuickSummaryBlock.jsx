import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

export default function QuickSummaryBlock({ title, keyForms, isDark }) {
	const t = useTranslations('lessons')

	return (
		<div
			className={cn(
				"mb-8 p-4 sm:p-6 rounded-none sm:rounded-xl border-y sm:border-2",
				"-mx-5 sm:mx-0",
				isDark
					? "bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30"
					: "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200"
			)}>
			<h4 className={cn(
				"text-lg font-bold mb-4 flex items-center gap-2",
				isDark ? "text-emerald-400" : "text-emerald-800"
			)}>
				<span className="text-2xl">⚡</span>
				{title || t('quickSummaryTitle')}
			</h4>
			<div className="grid gap-3">
				{keyForms?.map((form, i) => (
					<div key={i} className={cn(
						"flex items-center gap-3",
						isDark ? "text-slate-300" : "text-slate-700"
					)}>
						<span className={cn(
							"font-bold min-w-[80px]",
							isDark ? "text-indigo-400" : "text-indigo-600"
						)}>{form.form}</span>
						<span className="text-slate-400">→</span>
						<span>{form.translation}</span>
					</div>
				))}
			</div>
		</div>
	)
}
