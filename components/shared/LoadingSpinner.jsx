'use client'

import { Loader2, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

const LoadingSpinner = ({ message = '' }) => {
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
			{/* Spinner avec icône centrale */}
			<div className="relative inline-flex">
				{/* Cercle spinner */}
				<Loader2 className="w-20 h-20 text-violet-500 animate-spin" />

				{/* Icône centrale animée */}
				<div className="absolute inset-0 flex items-center justify-center">
					<BookOpen className="w-8 h-8 text-violet-600 animate-pulse" />
				</div>
			</div>

			{/* Message */}
			{message && (
				<p className={cn(
					'text-lg font-semibold text-violet-500 text-center',
					'animate-in fade-in slide-in-from-bottom-2 duration-500'
				)}>
					{message}
				</p>
			)}

			{/* Dots animés */}
			<div className="flex gap-2">
				{[0, 1, 2].map((idx) => (
					<div
						key={idx}
						className={cn(
							'w-2.5 h-2.5 rounded-full bg-violet-500',
							'animate-bounce'
						)}
						style={{
							animationDelay: idx * 0.15 + 's',
							animationDuration: '1s'
						}}
					/>
				))}
			</div>
		</div>
	)
}

export default LoadingSpinner
