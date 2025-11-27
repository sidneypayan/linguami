'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Headphones, Gauge } from 'lucide-react'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

const Player = ({ src }) => {
	const audioRef = useRef(null)
	const { isDark } = useThemeMode()
	const [isPlaying, setIsPlaying] = useState(false)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const [volume, setVolume] = useState(1)
	const [showVolumeSlider, setShowVolumeSlider] = useState(false)
	const [playbackRate, setPlaybackRate] = useState(1)
	const isSeekingRef = useRef(false)
	const shouldResumeRef = useRef(false)

	useEffect(() => {
		const audio = audioRef.current
		if (!audio) return

		// Enable pitch preservation (prevents voice from becoming deeper/higher)
		audio.preservesPitch = true
		audio.mozPreservesPitch = true
		audio.webkitPreservesPitch = true

		const updateTime = () => {
			if (!isSeekingRef.current) {
				setCurrentTime(audio.currentTime)
			}
		}
		const updateDuration = () => {
			if (!isNaN(audio.duration) && audio.duration > 0) {
				setDuration(audio.duration)
			}
		}
		const handleEnded = () => {
			// Don't do anything - leave audio at the end
		}

		audio.addEventListener('timeupdate', updateTime)
		audio.addEventListener('loadedmetadata', updateDuration)
		audio.addEventListener('durationchange', updateDuration)

		if (!isNaN(audio.duration) && audio.duration > 0) {
			setDuration(audio.duration)
		}
		audio.addEventListener('ended', handleEnded)
		const handlePlay = () => {
			setIsPlaying(true)
		}
		const handlePause = () => {
			setIsPlaying(false)
		}

		audio.addEventListener('play', handlePlay)
		audio.addEventListener('pause', handlePause)

		const handleSeeking = () => {
			shouldResumeRef.current = !audio.paused
		}

		const handleSeeked = () => {
			const timeRemaining = audio.duration - audio.currentTime

			if (shouldResumeRef.current && timeRemaining > 0.5) {
				audio.play().catch(() => { })
			}
			shouldResumeRef.current = false
		}

		const handleWaiting = () => { }
		const handleCanPlay = () => { }

		audio.addEventListener('seeking', handleSeeking)
		audio.addEventListener('seeked', handleSeeked)
		audio.addEventListener('waiting', handleWaiting)
		audio.addEventListener('canplay', handleCanPlay)

		return () => {
			audio.removeEventListener('timeupdate', updateTime)
			audio.removeEventListener('loadedmetadata', updateDuration)
			audio.removeEventListener('durationchange', updateDuration)
			audio.removeEventListener('ended', handleEnded)
			audio.removeEventListener('play', handlePlay)
			audio.removeEventListener('pause', handlePause)
			audio.removeEventListener('seeking', handleSeeking)
			audio.removeEventListener('seeked', handleSeeked)
			audio.removeEventListener('waiting', handleWaiting)
			audio.removeEventListener('canplay', handleCanPlay)
		}
	}, [])

	const togglePlay = () => {
		const audio = audioRef.current

		if (isNaN(audio.duration)) {
			if (audio.paused) {
				audio.play()
			} else {
				audio.pause()
			}
			return
		}

		const timeRemaining = audio.duration - audio.currentTime
		if (timeRemaining < 0.5) {
			audio.currentTime = 0
			setCurrentTime(0)
		}

		if (audio.paused) {
			audio.play()
		} else {
			audio.pause()
		}
	}

	const handleSeekStart = () => {
		isSeekingRef.current = true
	}

	const handleSeek = (e) => {
		const rect = e.currentTarget.getBoundingClientRect()
		const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
		const newTime = percent * (duration || 100)
		setCurrentTime(newTime)
	}

	const handleSeekEnd = (e) => {
		const audio = audioRef.current
		if (!audio || isNaN(audio.duration)) {
			isSeekingRef.current = false
			return
		}

		const rect = e.currentTarget.getBoundingClientRect()
		const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
		const newTime = percent * duration

		audio.currentTime = newTime
		setCurrentTime(newTime)
		isSeekingRef.current = false
	}

	const handleVolumeChange = (e) => {
		const audio = audioRef.current
		const rect = e.currentTarget.getBoundingClientRect()
		const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
		audio.volume = percent
		setVolume(percent)
	}

	const toggleMute = () => {
		const audio = audioRef.current
		if (volume > 0) {
			audio.volume = 0
			setVolume(0)
		} else {
			audio.volume = 1
			setVolume(1)
		}
	}

	const skip = (seconds) => {
		const audio = audioRef.current
		if (!audio || isNaN(audio.duration)) return

		const newTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds))
		audio.currentTime = newTime
		setCurrentTime(newTime)
	}

	const cyclePlaybackRate = () => {
		const audio = audioRef.current
		const rates = [1, 0.9, 0.8, 0.7, 0.6, 0.5]
		const currentIndex = rates.indexOf(playbackRate)
		const nextIndex = (currentIndex + 1) % rates.length
		const newRate = rates[nextIndex]
		audio.playbackRate = newRate
		setPlaybackRate(newRate)
	}

	const formatTime = (time) => {
		if (isNaN(time)) return '0:00'
		const minutes = Math.floor(time / 60)
		const seconds = Math.floor(time % 60)
		return `${minutes}:${seconds.toString().padStart(2, '0')}`
	}

	const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

	return (
		<div className="flex justify-center w-full my-6">
			<div
				className={cn(
					'max-w-full sm:max-w-[540px] md:max-w-[680px] w-full',
					'py-3.5 px-4 sm:py-4 sm:px-5',
					'rounded-2xl',
					'border-2 border-violet-500/20',
					'shadow-[0_8px_32px_rgba(139,92,246,0.15)]',
					'flex items-center gap-3 sm:gap-4',
					'transition-all duration-300',
					'hover:shadow-[0_12px_40px_rgba(139,92,246,0.25)]',
					'hover:border-violet-500/35',
					isDark
						? 'bg-gradient-to-br from-slate-800/98 to-slate-900/98 backdrop-blur-sm'
						: 'bg-gradient-to-br from-white/98 to-slate-50/98 backdrop-blur-sm'
				)}
			>
				<audio ref={audioRef} src={src} preload='metadata' />

				{/* Decorative icon */}
				<div
					className={cn(
						'hidden sm:flex items-center justify-center',
						'w-[42px] h-[42px] rounded-lg flex-shrink-0',
						'bg-gradient-to-br from-violet-500/12 to-cyan-500/8',
						'border border-violet-500/20'
					)}
				>
					<Headphones className="w-6 h-6 text-violet-500" />
				</div>

				{/* Playback Controls */}
				<div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
					<button
						onClick={() => skip(-10)}
						title="Reculer de 10s"
						className={cn(
							'w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] rounded-lg',
							'flex items-center justify-center',
							'bg-violet-500/6 border border-violet-500/15',
							'transition-all duration-200',
							'hover:bg-gradient-to-br hover:from-violet-500/12 hover:to-cyan-500/8',
							'hover:text-violet-500 hover:scale-105 hover:border-violet-500/30',
							isDark ? 'text-slate-400' : 'text-slate-500'
						)}
					>
						<SkipBack className="w-5 h-5" />
					</button>

					<button
						onClick={togglePlay}
						className={cn(
							'w-12 h-12 sm:w-14 sm:h-14 rounded-full',
							'flex items-center justify-center',
							'bg-gradient-to-br from-violet-500 to-cyan-500',
							'text-white',
							'shadow-[0_4px_20px_rgba(139,92,246,0.3)]',
							'transition-all duration-200',
							'hover:from-violet-600 hover:to-cyan-600',
							'hover:scale-105 hover:shadow-[0_6px_28px_rgba(139,92,246,0.4)]'
						)}
					>
						{isPlaying ? (
							<Pause className="w-6 h-6" />
						) : (
							<Play className="w-6 h-6 ml-0.5" />
						)}
					</button>

					<button
						onClick={() => skip(10)}
						title="Avancer de 10s"
						className={cn(
							'w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] rounded-lg',
							'flex items-center justify-center',
							'bg-violet-500/6 border border-violet-500/15',
							'transition-all duration-200',
							'hover:bg-gradient-to-br hover:from-violet-500/12 hover:to-cyan-500/8',
							'hover:text-violet-500 hover:scale-105 hover:border-violet-500/30',
							isDark ? 'text-slate-400' : 'text-slate-500'
						)}
					>
						<SkipForward className="w-5 h-5" />
					</button>
				</div>

				{/* Progress Bar with time */}
				<div className="flex-1 min-w-0">
					<div
						className="relative h-1 w-full cursor-pointer group"
						onMouseDown={handleSeekStart}
						onClick={handleSeekEnd}
					>
						{/* Rail */}
						<div className="absolute inset-0 rounded-full bg-violet-500/15" />
						{/* Track */}
						<div
							className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
							style={{ width: `${progressPercent}%` }}
						/>
						{/* Thumb */}
						<div
							className={cn(
								'absolute top-1/2 -translate-y-1/2 -translate-x-1/2',
								'w-3.5 h-3.5 rounded-full',
								'bg-violet-500 border-2 border-white',
								'shadow-[0_2px_8px_rgba(139,92,246,0.3)]',
								'transition-all duration-150',
								'group-hover:scale-110 group-hover:shadow-[0_0_0_6px_rgba(139,92,246,0.16)]'
							)}
							style={{ left: `${progressPercent}%` }}
						/>
					</div>
					<div className="flex justify-between mt-1.5">
						<span className={cn(
							'text-[0.7rem] font-semibold',
							isDark ? 'text-slate-400' : 'text-slate-500'
						)}>
							{formatTime(currentTime)}
						</span>
						<span className={cn(
							'text-[0.7rem] font-semibold',
							isDark ? 'text-slate-400' : 'text-slate-500'
						)}>
							{formatTime(duration)}
						</span>
					</div>
				</div>

				{/* Playback Speed Control */}
				<button
					onClick={cyclePlaybackRate}
					title="Vitesse de lecture"
					className={cn(
						'w-[52px] sm:w-[58px] h-[38px] sm:h-[42px] rounded-lg',
						'flex items-center justify-center gap-1 flex-shrink-0',
						'border transition-all duration-200',
						'hover:bg-gradient-to-br hover:from-violet-500/12 hover:to-cyan-500/8',
						'hover:text-violet-500 hover:scale-105 hover:border-violet-500/30',
						playbackRate === 1
							? cn(
								'bg-violet-500/6 border-violet-500/15',
								isDark ? 'text-slate-400' : 'text-slate-500'
							)
							: 'bg-gradient-to-br from-violet-500/12 to-cyan-500/8 border-violet-500/30 text-violet-500'
					)}
				>
					<Gauge className="w-4 h-4 sm:w-[1.1rem] sm:h-[1.1rem]" />
					<span className="text-[0.65rem] sm:text-[0.7rem] font-bold leading-none">
						{playbackRate}x
					</span>
				</button>

				{/* Volume Control */}
				<div
					className="flex items-center gap-1 flex-shrink-0"
					onMouseEnter={() => setShowVolumeSlider(true)}
					onMouseLeave={() => setShowVolumeSlider(false)}
				>
					{/* Volume Slider (desktop only) */}
					<div
						className={cn(
							'hidden sm:block overflow-visible transition-all duration-300',
							showVolumeSlider ? 'w-[100px] opacity-100 mr-3' : 'w-0 opacity-0'
						)}
					>
						<div
							className="relative h-1 w-full cursor-pointer group"
							onClick={handleVolumeChange}
						>
							<div className="absolute inset-0 rounded-full bg-violet-500/15" />
							<div
								className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
								style={{ width: `${volume * 100}%` }}
							/>
							<div
								className={cn(
									'absolute top-1/2 -translate-y-1/2 -translate-x-1/2',
									'w-3 h-3 rounded-full',
									'bg-violet-500 border-2 border-white',
									'shadow-[0_2px_6px_rgba(139,92,246,0.3)]',
									'group-hover:shadow-[0_0_0_6px_rgba(139,92,246,0.16)]'
								)}
								style={{ left: `${volume * 100}%` }}
							/>
						</div>
					</div>

					<button
						onClick={toggleMute}
						title={volume > 0 ? 'Muet' : 'Son'}
						className={cn(
							'w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] rounded-lg',
							'flex items-center justify-center',
							'bg-violet-500/6 border border-violet-500/15',
							'transition-all duration-200',
							'hover:bg-gradient-to-br hover:from-violet-500/12 hover:to-cyan-500/8',
							'hover:text-violet-500 hover:scale-105 hover:border-violet-500/30',
							isDark ? 'text-slate-400' : 'text-slate-500'
						)}
					>
						{volume > 0 ? (
							<Volume2 className="w-5 h-5" />
						) : (
							<VolumeX className="w-5 h-5" />
						)}
					</button>
				</div>
			</div>
		</div>
	)
}

export default Player
