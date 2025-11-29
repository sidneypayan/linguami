'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function NotFound() {
	return (
		<div className="max-w-3xl mx-auto px-4">
			<div className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-6">
				<Search className="h-28 w-28 text-slate-500 opacity-60" />

				<h1 className="text-6xl font-bold text-indigo-500">
					404
				</h1>

				<h2 className="text-2xl sm:text-3xl font-semibold">
					Oups ! Page introuvable
				</h2>

				<p className="text-lg text-slate-500 max-w-xl">
					La page que vous recherchez est introuvable
				</p>

				<Button
					size="lg"
					asChild
					className={cn(
						'mt-4 bg-gradient-to-r from-indigo-500 to-purple-600',
						'px-8 py-3 text-white'
					)}>
					<Link href="/">
						&larr; Retour a l&apos;accueil
					</Link>
				</Button>
			</div>
		</div>
	)
}
