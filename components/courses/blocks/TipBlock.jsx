import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { Lightbulb, Zap, AlertCircle } from 'lucide-react'

/**
 * TipBlock - Parchemin de conseil magique
 * Style gaming/fantasy avec effet de glow
 */
const TipBlock = ({ block }) => {
	const { isDark } = useThemeMode()

	const { title, content, color = 'info' } = block

	const colorConfig = {
		info: {
			icon: Lightbulb,
			gradient: 'from-cyan-400 to-blue-500',
			bgGradient: isDark
				? 'from-cyan-950/50 via-slate-900 to-blue-950/30'
				: 'from-cyan-50 via-white to-blue-50',
			border: isDark ? 'border-cyan-500/30' : 'border-cyan-200',
			text: isDark ? 'text-cyan-300' : 'text-cyan-700',
			glow: 'bg-cyan-500/10',
		},
		success: {
			icon: Zap,
			gradient: 'from-emerald-400 to-green-500',
			bgGradient: isDark
				? 'from-emerald-950/50 via-slate-900 to-green-950/30'
				: 'from-emerald-50 via-white to-green-50',
			border: isDark ? 'border-emerald-500/30' : 'border-emerald-200',
			text: isDark ? 'text-emerald-300' : 'text-emerald-700',
			glow: 'bg-emerald-500/10',
		},
		warning: {
			icon: AlertCircle,
			gradient: 'from-amber-400 to-orange-500',
			bgGradient: isDark
				? 'from-amber-950/50 via-slate-900 to-orange-950/30'
				: 'from-amber-50 via-white to-orange-50',
			border: isDark ? 'border-amber-500/30' : 'border-amber-200',
			text: isDark ? 'text-amber-300' : 'text-amber-700',
			glow: 'bg-amber-500/10',
		},
	}

	const config = colorConfig[color] || colorConfig.info
	const Icon = config.icon

	return (
		<div className={cn(
			'relative rounded-lg sm:rounded-2xl border sm:border-2 overflow-hidden',
			`bg-gradient-to-br ${config.bgGradient}`,
			config.border
		)}>
			{/* Effet de brillance */}
			<div className={cn(
				'absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl',
				config.glow
			)} />

			<div className="relative p-4 sm:p-5">
				<div
					className={cn(
						'prose prose-sm max-w-none',
						isDark
							? 'prose-invert text-slate-300'
							: 'text-slate-600'
					)}
					dangerouslySetInnerHTML={{ __html: content }}
				/>
			</div>
		</div>
	)
}

export default TipBlock
