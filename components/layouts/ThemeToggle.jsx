'use client'

import React from 'react'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-react'

const ThemeToggle = ({ variant = 'auto' }) => {
	const { toggleTheme, isDark } = useThemeMode()

	// Version icon pour le navbar desktop/mobile
	if (variant === 'auto') {
		return (
			<Button
				variant="ghost"
				onClick={toggleTheme}
				className={cn(
					'w-11 h-11 sm:w-12 sm:h-12 rounded-full p-0',
					'bg-white/15 backdrop-blur-sm',
					'border border-white/20',
					'transition-all duration-300',
					'hover:bg-white/25 hover:shadow-lg hover:scale-105',
					'flex items-center justify-center'
				)}
			>
				{isDark ? (
					<Sun className="w-6 h-6 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
				) : (
					<Moon className="w-6 h-6 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
				)}
			</Button>
		)
	}

	// Version full pour le drawer mobile
	return (
		<Button
			variant="ghost"
			onClick={toggleTheme}
			className={cn(
				'w-full justify-start gap-3 px-4 py-3.5 h-auto rounded-xl',
				'bg-white/15 backdrop-blur-sm',
				'text-white font-semibold text-base',
				'border border-white/20',
				'transition-all duration-300',
				'hover:bg-white/25 hover:translate-x-2'
			)}
		>
			{isDark ? (
				<>
					<Sun className="w-6 h-6 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
					<span>Mode clair</span>
				</>
			) : (
				<>
					<Moon className="w-6 h-6 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
					<span>Mode sombre</span>
				</>
			)}
		</Button>
	)
}

export default ThemeToggle
