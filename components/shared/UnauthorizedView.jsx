'use client'

import { ShieldX, Home } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function UnauthorizedView() {
	const t = useTranslations('common')

	return (
		<div className="max-w-2xl mx-auto px-4">
			<div className={cn(
				'flex flex-col items-center justify-center',
				'min-h-[70vh] text-center gap-6'
			)}>
				<ShieldX className="w-28 h-28 text-red-500 opacity-80" />

				<h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">
					{t('accessDenied')}
				</h1>

				<p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg">
					{t('accessDeniedMessage')}
				</p>

				<Button
					asChild
					size="lg"
					className={cn(
						'mt-4 px-8 py-6 text-base',
						'bg-gradient-to-r from-violet-600 to-purple-600',
						'hover:from-violet-700 hover:to-purple-700'
					)}
				>
					<a href="/">
						<Home className="w-5 h-5 mr-2" />
						{t('backToHome')}
					</a>
				</Button>
			</div>
		</div>
	)
}
