import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import PlayableWordsList from '@/components/courses/blocks/PlayableWordsList'
import { Volume2 } from 'lucide-react'
import { useState, useRef } from 'react'
import { convertToLocalProxy } from '@/utils/mediaUrls'

// Audio Button Component
function AudioButton({ audioUrl, isDark }) {
	const [isPlaying, setIsPlaying] = useState(false)
	const audioRef = useRef(null)

	const playAudio = () => {
		if (!audioUrl) return

		setIsPlaying(true)

		try {
			if (audioRef.current) {
				audioRef.current.pause()
				audioRef.current.currentTime = 0
			}

			const proxiedUrl = convertToLocalProxy(audioUrl)
			const audio = new Audio(proxiedUrl)
			audioRef.current = audio

			audio.onended = () => setIsPlaying(false)
			audio.onerror = () => setIsPlaying(false)

			audio.play().catch(() => setIsPlaying(false))
		} catch (error) {
			setIsPlaying(false)
		}
	}

	return (
		<button
			onClick={playAudio}
			className={cn(
				"p-1.5 rounded-lg transition-all hover:scale-110",
				isDark
					? "bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400"
					: "bg-indigo-100 hover:bg-indigo-200 text-indigo-600",
				isPlaying && "animate-pulse"
			)}
			aria-label="Play sound"
		>
			<Volume2 className="w-4 h-4" />
		</button>
	)
}

export default function ConjugationTableBlock({ title, rows, audioUrls = {}, isDark }) {
	const t = useTranslations('lessons')

	return (
		<div className="mb-8">
			<h3 className={cn(
				"text-xl font-bold mb-4",
				isDark ? "text-slate-100" : "text-slate-800"
			)}>{title || t('conjugationTitle')}</h3>
			<div className="overflow-x-auto -mx-5 sm:mx-0">
				<table className="w-full border-collapse">
					<tbody>
						{rows?.map((row, i) => (
							<tr key={i} className={cn(
								i % 2 === 0
									? (isDark ? 'bg-slate-700/50' : 'bg-slate-50')
									: (isDark ? 'bg-slate-800/50' : 'bg-white')
							)}>
								<td className={cn("p-3 font-semibold", isDark ? "text-indigo-400" : "text-indigo-600")}>
									{row.pronoun}
								</td>
								<td className={cn("p-3 font-bold", isDark ? "text-slate-100" : "text-slate-800")}>
									<div className="flex flex-col items-center justify-center gap-1">
										{row.audioUrl && <AudioButton audioUrl={row.audioUrl} isDark={isDark} />}
										{row.form}
									</div>
								</td>
								{row.translation && (
									<td className={cn("p-3", isDark ? "text-slate-300" : "text-slate-600")}>
										<PlayableWordsList
											text={row.translation}
											audioUrls={row.audioUrls || audioUrls}
										/>
									</td>
								)}
								{row.pronunciation && <td className={cn("p-3", isDark ? "text-slate-300" : "text-slate-600")}>{row.pronunciation}</td>}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{rows?.some(r => r.mnemonic) && (
				<div className={cn(
					"mt-4 p-4 border-l-4 border-amber-400 rounded-none sm:rounded",
					"-mx-5 sm:mx-0",
					isDark ? "bg-amber-500/10" : "bg-amber-50"
				)}>
					<p className={cn(
						"text-sm font-semibold mb-2",
						isDark ? "text-amber-400" : "text-amber-800"
					)}>💡 {t('mnemonics')}</p>
					{rows
						.filter(r => r.mnemonic)
						.map((row, i) => (
							<p key={i} className={cn(
								"text-sm mb-1",
								isDark ? "text-slate-300" : "text-slate-600"
							)}>
								<strong>{row.pronoun} {row.form}</strong> : {row.mnemonic}
							</p>
						))}
				</div>
			)}
		</div>
	)
}
