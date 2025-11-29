'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function Error({ error, reset }) {
	const t = useTranslations('common')

	return (
		<div className="max-w-3xl mx-auto px-4">
			<div className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-6">
				<AlertCircle className="h-28 w-28 text-red-500 opacity-80" />

				<h1 className="text-3xl sm:text-4xl font-semibold">
					{t('genericError')}
				</h1>

				<p className="text-lg text-muted-foreground max-w-xl">
					{error?.message || t('errorMessage')}
				</p>

				<div className="flex gap-4 mt-4">
					<Button
						size="lg"
						onClick={reset}
						className={cn(
							'bg-gradient-to-r from-indigo-500 to-purple-600',
							'px-8 py-3'
						)}>
						<RefreshCw className="h-5 w-5 mr-2" />
						{t('tryAgain')}
					</Button>

					<Button
						variant="outline"
						size="lg"
						asChild
						className="px-8 py-3 border-indigo-500 text-indigo-500">
						<Link href="/">
							{t('backToHome')}
						</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}
