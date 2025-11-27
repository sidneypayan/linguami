'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useUserContext } from '@/context/user.js'
import { useState, useMemo, useRef, useEffect } from 'react'
import { useThemeMode } from '@/context/ThemeContext'
import { getAvatarUrl } from '@/utils/avatars.js'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import {
	Bookmark,
	LogOut,
	SpellCheck,
	User,
	BarChart3,
	Trophy,
	Settings,
	BadgeCheck,
	Dumbbell,
	Sparkles,
} from 'lucide-react'

const UserMenu = () => {
	const t = useTranslations('common')
	const locale = useLocale()
	const { user, userProfile, logout } = useUserContext()
	const { isDark } = useThemeMode()

	const [isOpen, setIsOpen] = useState(false)
	const menuRef = useRef(null)
	const buttonRef = useRef(null)

	const avatarUrl = useMemo(
		() => getAvatarUrl(userProfile?.avatar_id),
		[userProfile?.avatar_id]
	)

	const username = userProfile?.name || user?.email?.split('@')[0] || 'User'

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target)
			) {
				setIsOpen(false)
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isOpen])

	const menuItems = [
		{ href: '/dictionary', icon: SpellCheck, label: t('mydictionary') },
		{ href: '/my-materials', icon: Bookmark, label: t('mymaterials') },
		{ href: '/statistics', icon: BarChart3, label: t('statistics') },
		{ href: '/leaderboard', icon: Trophy, label: t('leaderboard') },
		{ href: '/training', icon: Dumbbell, label: t('training') },
		{ href: '/settings', icon: Settings, label: t('settings') },
	]

	return (
		<div className="relative ml-1 sm:ml-2 lg:ml-4">
			{/* Avatar Button */}
			<button
				ref={buttonRef}
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					'p-0 rounded-full',
					'bg-gradient-to-br from-violet-500/30 to-cyan-500/20',
					'backdrop-blur-sm',
					'border-2 border-white/30',
					'transition-all duration-300',
					'hover:border-white/50 hover:scale-105',
					isOpen && 'border-white/50 bg-white/25'
				)}
			>
				<div className="w-11 h-11 sm:w-12 sm:h-12 lg:w-[52px] lg:h-[52px] rounded-full overflow-hidden">
					{avatarUrl ? (
						<img
							src={avatarUrl}
							alt={username}
							className="w-full h-full object-cover"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center bg-violet-500/50">
							<User className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
						</div>
					)}
				</div>
			</button>

			{/* Dropdown Menu */}
			{isOpen && (
				<div
					ref={menuRef}
					className={cn(
						'absolute top-full right-0 mt-2 z-50',
						'w-72 rounded-2xl overflow-hidden',
						'backdrop-blur-xl',
						'border',
						isDark
							? 'bg-gradient-to-b from-slate-800/95 to-slate-900/95 border-violet-500/40 shadow-[0_8px_32px_rgba(139,92,246,0.4)]'
							: 'bg-gradient-to-b from-white/95 to-slate-50/95 border-violet-500/20 shadow-[0_8px_32px_rgba(139,92,246,0.2)]',
						'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200'
					)}
				>
					{/* Character Card Header */}
					<div className={cn(
						'relative p-5 overflow-hidden',
						'bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900'
					)}>
						{/* Background glow */}
						<div className="absolute inset-0 pointer-events-none">
							<div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-violet-500/30 rounded-full blur-3xl" />
						</div>

						<div className="relative z-10">
							{/* Username */}
							<div className="text-center mb-3 pb-3 border-b border-violet-500/30">
								<h3 className={cn(
									'font-bold text-lg tracking-wide',
									'bg-gradient-to-r from-violet-300 via-cyan-300 to-violet-300',
									'bg-clip-text text-transparent'
								)}>
									{username}
								</h3>
								{userProfile?.is_premium && (
									<span className={cn(
										'inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5',
										'text-xs font-semibold text-amber-300',
										'bg-amber-500/20 border border-amber-500/30 rounded-full'
									)}>
										<Sparkles className="w-3 h-3" />
										Premium
									</span>
								)}
							</div>

							{/* Avatar */}
							<div className="flex justify-center mb-3">
								<div className={cn(
									'relative w-20 h-20 rounded-full',
									'bg-gradient-to-br from-violet-500 to-cyan-500 p-1',
									'shadow-lg shadow-violet-500/50'
								)}>
									<div className="w-full h-full rounded-full overflow-hidden border-[3px] border-slate-900">
										{avatarUrl ? (
											<img
												src={avatarUrl}
												alt={username}
												className="w-full h-full object-cover"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center bg-slate-800">
												<User className="w-9 h-9 text-violet-300" />
											</div>
										)}
									</div>
									{userProfile?.is_premium && (
										<div className={cn(
											'absolute bottom-0 right-0',
											'w-5 h-5 rounded-full',
											'bg-amber-400 border-2 border-slate-900',
											'flex items-center justify-center',
											'shadow-lg'
										)}>
											<BadgeCheck className="w-3 h-3 text-white" />
										</div>
									)}
								</div>
							</div>

							{/* Stats */}
							<div className="grid grid-cols-3 gap-2 pt-3 border-t border-violet-500/30">
								{/* XP */}
								<div className="text-center">
									<span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-cyan-400/80">
										XP
									</span>
									<span className={cn(
										'block text-base font-bold mt-0.5',
										'bg-gradient-to-r from-cyan-400 to-cyan-300',
										'bg-clip-text text-transparent'
									)}>
										{userProfile?.xp || 0}
									</span>
								</div>

								{/* Level */}
								<div className="text-center">
									<span className="block text-xs font-bold uppercase tracking-wider text-violet-300/80">
										Niveau
									</span>
									<span className={cn(
										'block text-2xl font-extrabold mt-0.5',
										'bg-gradient-to-r from-violet-300 to-purple-300',
										'bg-clip-text text-transparent',
										'drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]'
									)}>
										{userProfile?.level || 1}
									</span>
								</div>

								{/* Gold */}
								<div className="text-center">
									<span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-cyan-400/80">
										Or
									</span>
									<span className={cn(
										'block text-sm font-bold mt-0.5',
										'bg-gradient-to-r from-cyan-400 to-cyan-300',
										'bg-clip-text text-transparent'
									)}>
										{userProfile?.gold || 0}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Menu Items */}
					<div className="py-2">
						{menuItems.map((item) => {
							const Icon = item.icon
							return (
								<Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
									<div className={cn(
										'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl',
										'font-medium text-[0.95rem]',
										'transition-all duration-300',
										isDark ? 'text-slate-200' : 'text-slate-700',
										'hover:bg-gradient-to-r',
										isDark
											? 'hover:from-violet-500/20 hover:to-cyan-500/15'
											: 'hover:from-violet-500/10 hover:to-cyan-500/8',
										'hover:translate-x-1',
										'hover:border-l-2 hover:border-violet-500',
										'group'
									)}>
										<Icon className={cn(
											'w-5 h-5 transition-all duration-300',
											isDark ? 'text-violet-400' : 'text-violet-500',
											'group-hover:text-cyan-400 group-hover:scale-110'
										)} />
										<span>{item.label}</span>
									</div>
								</Link>
							)
						})}
					</div>

					{/* Divider */}
					<div className={cn(
						'mx-4 border-t',
						isDark ? 'border-violet-500/30' : 'border-violet-500/20'
					)} />

					{/* Logout */}
					<div className="py-2">
						<button
							onClick={() => {
								setIsOpen(false)
								logout()
							}}
							className={cn(
								'w-full flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl',
								'font-medium text-[0.95rem]',
								'transition-all duration-300',
								isDark ? 'text-slate-200' : 'text-slate-700',
								'hover:bg-gradient-to-r',
								isDark
									? 'hover:from-violet-500/20 hover:to-cyan-500/15'
									: 'hover:from-violet-500/10 hover:to-cyan-500/8',
								'hover:translate-x-1',
								'hover:border-l-2 hover:border-violet-500',
								'group'
							)}
							style={{ width: 'calc(100% - 1rem)' }}
						>
							<LogOut className={cn(
								'w-5 h-5 transition-all duration-300',
								isDark ? 'text-violet-400' : 'text-violet-500',
								'group-hover:text-cyan-400 group-hover:scale-110'
							)} />
							<span>{t('logout')}</span>
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default UserMenu
