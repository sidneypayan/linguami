'use client'

import { useThemeMode } from '@/context/ThemeContext'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const AuthLayout = ({ children }) => {
	const { isDark } = useThemeMode()

	return (
		<>
			<style dangerouslySetInnerHTML={{ __html: `
				@keyframes authPulse {
					0%, 100% { opacity: 0.5; transform: scale(1); }
					50% { opacity: 0.8; transform: scale(1.1); }
				}
			` }} />
			<div
				className={cn(
					'flex-1 flex items-center justify-center',
					'relative overflow-hidden',
					'pt-20 sm:pt-24 pb-0 px-0 md:px-8 md:pb-[calc(80px+2rem)]',
					'mb-0 md:-mb-20',
					isDark
						? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900'
						: 'bg-gradient-to-br from-slate-50 via-indigo-100 to-violet-100'
				)}
				style={{
					clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 40px), 0 100%)',
				}}
			>
				{/* Background decorative elements */}
				<div
					className={cn(
						'absolute inset-0 pointer-events-none',
						isDark
							? 'bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.25)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(6,182,212,0.2)_0%,transparent_50%)]'
							: 'bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.15)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(6,182,212,0.12)_0%,transparent_50%)]'
					)}
				/>
				<div
					className={cn(
						'absolute top-[20%] left-[10%] w-[500px] h-[500px] pointer-events-none',
						'blur-[80px]',
						isDark
							? 'bg-[radial-gradient(circle,rgba(139,92,246,0.15)_0%,transparent_70%)]'
							: 'bg-[radial-gradient(circle,rgba(139,92,246,0.08)_0%,transparent_70%)]'
					)}
					style={{ animation: 'authPulse 4s ease-in-out infinite' }}
				/>

				{/* Main container */}
				<div className="relative z-10 w-full max-w-lg px-0 sm:px-4 py-4 sm:py-6">
					<Card
						className={cn(
							'p-0 overflow-hidden',
							'rounded-none sm:rounded-3xl',
							'border-0 sm:border',
							isDark
								? 'bg-slate-800/90 bg-gradient-to-br from-slate-800 to-indigo-950/80 sm:border-violet-500/30 sm:shadow-[0_24px_60px_rgba(0,0,0,0.5)]'
								: 'bg-white sm:border-slate-200 sm:shadow-[0_24px_60px_rgba(0,0,0,0.12)]'
						)}
					>
						{/* Main content */}
						<div className={cn(
							'p-6 sm:p-12 pb-10 sm:pb-14',
							isDark ? 'bg-transparent' : 'bg-white'
						)}>
							{children}
						</div>
					</Card>
				</div>
			</div>
		</>
	)
}

export default AuthLayout
