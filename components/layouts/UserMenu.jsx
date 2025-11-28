'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useUserContext } from '@/context/user.js'
import { useThemeMode } from '@/context/ThemeContext'
import { getAvatarUrl } from '@/utils/avatars.js'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
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
	X,
} from 'lucide-react'

// ============================================
// AVATAR TRIGGER BUTTON
// ============================================
const AvatarTrigger = ({ avatarUrl, username, isDark }) => (
	<div className={cn(
		'relative',
		'w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14',
		'rounded-full',
		'p-[2px] sm:p-[3px]',
		'bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500',
		'transition-all duration-300',
		'hover:from-violet-400 hover:via-purple-400 hover:to-pink-400',
		'hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]',
		'shadow-lg shadow-violet-500/40'
	)}>
		<Avatar className="w-full h-full border-2 border-slate-900/50">
			<AvatarImage src={avatarUrl} alt={username} className="object-cover" />
			<AvatarFallback className="bg-violet-500/50">
				<User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
			</AvatarFallback>
		</Avatar>
	</div>
)

// ============================================
// USER PROFILE HEADER
// ============================================
const UserProfileHeader = ({ username, avatarUrl, userProfile, isDark, size = 'normal' }) => (
	<div className={cn(
		'relative overflow-hidden',
		'bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900',
		size === 'large' ? 'p-6 sm:p-8' : 'p-5'
	)}>
		{/* Background glow */}
		<div className="absolute inset-0 pointer-events-none">
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-violet-500/30 rounded-full blur-3xl" />
		</div>

		<div className="relative z-10">
			{/* Username */}
			<div className={cn(
				'text-center border-b border-violet-500/30',
				size === 'large' ? 'mb-4 pb-4' : 'mb-3 pb-3'
			)}>
				<h3 className={cn(
					'font-bold tracking-wide',
					'bg-gradient-to-r from-violet-300 via-cyan-300 to-violet-300',
					'bg-clip-text text-transparent',
					size === 'large' ? 'text-xl sm:text-2xl' : 'text-lg'
				)}>
					{username}
				</h3>
				{userProfile?.is_premium && (
					<span className={cn(
						'inline-flex items-center gap-1 mt-2 px-3 py-1',
						'text-xs font-semibold text-amber-300',
						'bg-amber-500/20 border border-amber-500/30 rounded-full'
					)}>
						<Sparkles className="w-3 h-3" />
						Premium
					</span>
				)}
			</div>

			{/* Avatar */}
			<div className={cn(
				'flex justify-center',
				size === 'large' ? 'mb-4' : 'mb-3'
			)}>
				<div className={cn(
					'relative rounded-full',
					'bg-gradient-to-br from-violet-500 to-cyan-500 p-1',
					'shadow-lg shadow-violet-500/50',
					size === 'large' ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-20 h-20'
				)}>
					<Avatar className="w-full h-full border-[3px] border-slate-900">
						<AvatarImage src={avatarUrl} alt={username} />
						<AvatarFallback className="bg-slate-800">
							<User className={cn(
								'text-violet-300',
								size === 'large' ? 'w-12 h-12' : 'w-9 h-9'
							)} />
						</AvatarFallback>
					</Avatar>
					{userProfile?.is_premium && (
						<div className={cn(
							'absolute bottom-0 right-0',
							'rounded-full',
							'bg-amber-400 border-2 border-slate-900',
							'flex items-center justify-center',
							'shadow-lg',
							size === 'large' ? 'w-6 h-6' : 'w-5 h-5'
						)}>
							<BadgeCheck className={cn(
								'text-white',
								size === 'large' ? 'w-4 h-4' : 'w-3 h-3'
							)} />
						</div>
					)}
				</div>
			</div>

			{/* Stats */}
			<div className={cn(
				'grid grid-cols-3 gap-2 border-t border-violet-500/30',
				size === 'large' ? 'pt-4' : 'pt-3'
			)}>
				{/* XP */}
				<div className="text-center">
					<span className={cn(
						'block font-semibold uppercase tracking-wider text-cyan-400/80',
						size === 'large' ? 'text-xs' : 'text-[0.65rem]'
					)}>
						XP
					</span>
					<span className={cn(
						'block font-bold mt-0.5',
						'bg-gradient-to-r from-cyan-400 to-cyan-300',
						'bg-clip-text text-transparent',
						size === 'large' ? 'text-lg' : 'text-base'
					)}>
						{userProfile?.xp || 0}
					</span>
				</div>

				{/* Level */}
				<div className="text-center">
					<span className={cn(
						'block font-bold uppercase tracking-wider text-violet-300/80',
						size === 'large' ? 'text-sm' : 'text-xs'
					)}>
						Niveau
					</span>
					<span className={cn(
						'block font-extrabold mt-0.5',
						'bg-gradient-to-r from-violet-300 to-purple-300',
						'bg-clip-text text-transparent',
						'drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]',
						size === 'large' ? 'text-3xl' : 'text-2xl'
					)}>
						{userProfile?.level || 1}
					</span>
				</div>

				{/* Gold */}
				<div className="text-center">
					<span className={cn(
						'block font-semibold uppercase tracking-wider text-cyan-400/80',
						size === 'large' ? 'text-xs' : 'text-[0.65rem]'
					)}>
						Or
					</span>
					<span className={cn(
						'block font-bold mt-0.5',
						'bg-gradient-to-r from-cyan-400 to-cyan-300',
						'bg-clip-text text-transparent',
						size === 'large' ? 'text-lg' : 'text-sm'
					)}>
						{userProfile?.gold || 0}
					</span>
				</div>
			</div>
		</div>
	</div>
)

// ============================================
// MENU ITEM COMPONENT
// ============================================
const MenuItem = ({ href, icon: Icon, label, isDark, size = 'normal', onClick }) => {
	const content = (
		<div className={cn(
			'flex items-center gap-3 rounded-xl cursor-pointer',
			'font-medium transition-all duration-300',
			isDark ? 'text-slate-200' : 'text-slate-700',
			'hover:bg-gradient-to-r',
			isDark
				? 'hover:from-violet-500/20 hover:to-cyan-500/15'
				: 'hover:from-violet-500/10 hover:to-cyan-500/8',
			'hover:translate-x-1',
			'border-l-2 border-transparent hover:border-violet-500',
			'group',
			size === 'large' ? 'px-4 py-4 text-base' : 'px-3 py-2.5 text-[0.95rem]'
		)}>
			<Icon className={cn(
				'transition-all duration-300',
				isDark ? 'text-violet-400' : 'text-violet-500',
				'group-hover:text-cyan-400 group-hover:scale-110',
				size === 'large' ? 'w-6 h-6' : 'w-5 h-5'
			)} />
			<span>{label}</span>
		</div>
	)

	if (onClick) {
		return <button onClick={onClick} className="w-full text-left">{content}</button>
	}

	return <Link href={href} onClick={onClick}>{content}</Link>
}

// ============================================
// MAIN COMPONENT
// ============================================
const UserMenu = () => {
	const t = useTranslations('common')
	const { user, userProfile, logout } = useUserContext()
	const { isDark } = useThemeMode()
	const [mobileOpen, setMobileOpen] = useState(false)

	const avatarUrl = useMemo(
		() => getAvatarUrl(userProfile?.avatar_id),
		[userProfile?.avatar_id]
	)

	const username = userProfile?.name || user?.email?.split('@')[0] || 'User'

	const menuItems = [
		{ href: '/dictionary', icon: SpellCheck, label: t('mydictionary') },
		{ href: '/my-materials', icon: Bookmark, label: t('mymaterials') },
		{ href: '/statistics', icon: BarChart3, label: t('statistics') },
		{ href: '/leaderboard', icon: Trophy, label: t('leaderboard') },
		{ href: '/training', icon: Dumbbell, label: t('training') },
		{ href: '/settings', icon: Settings, label: t('settings') },
	]

	return (
		<div className="relative flex items-center ml-1 sm:ml-2 lg:ml-4">
			{/* Mobile: Sheet fullscreen */}
			<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
				<SheetTrigger asChild>
					<Button
						variant="ghost"
						className={cn(
							'lg:hidden p-0 h-auto rounded-full',
							'transition-all duration-300',
							'hover:scale-105 hover:bg-transparent'
						)}
					>
						<AvatarTrigger avatarUrl={avatarUrl} username={username} isDark={isDark} />
					</Button>
				</SheetTrigger>

				<SheetContent
					side="bottom"
					className={cn(
						'h-[100dvh] p-0 border-0',
						'bg-gradient-to-b',
						isDark
							? 'from-slate-900 via-slate-900 to-slate-950'
							: 'from-white via-slate-50 to-slate-100'
					)}
				>
					<SheetTitle className="sr-only">Menu utilisateur</SheetTitle>

					{/* Close button */}
					<button
						onClick={() => setMobileOpen(false)}
						className={cn(
							'absolute top-4 right-4 z-50',
							'w-10 h-10 rounded-full',
							'flex items-center justify-center',
							'transition-all duration-300',
							isDark
								? 'bg-slate-800 text-white hover:bg-slate-700'
								: 'bg-white text-slate-900 hover:bg-slate-100',
							'shadow-lg'
						)}
					>
						<X className="w-5 h-5" />
					</button>

					<div className="h-full overflow-y-auto">
						{/* Profile Header */}
						<UserProfileHeader
							username={username}
							avatarUrl={avatarUrl}
							userProfile={userProfile}
							isDark={isDark}
							size="large"
						/>

						{/* Menu Items */}
						<div className="p-4 space-y-1">
							{menuItems.map((item) => (
								<MenuItem
									key={item.href}
									href={item.href}
									icon={item.icon}
									label={item.label}
									isDark={isDark}
									size="large"
									onClick={() => setMobileOpen(false)}
								/>
							))}
						</div>

						{/* Separator */}
						<div className={cn(
							'mx-6 h-px',
							isDark ? 'bg-violet-500/30' : 'bg-violet-500/20'
						)} />

						{/* Logout */}
						<div className="p-4">
							<MenuItem
								icon={LogOut}
								label={t('logout')}
								isDark={isDark}
								size="large"
								onClick={() => {
									setMobileOpen(false)
									logout()
								}}
							/>
						</div>
					</div>
				</SheetContent>
			</Sheet>

			{/* Desktop: Dropdown */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className={cn(
							'hidden lg:flex p-0 h-auto rounded-full',
							'transition-all duration-300',
							'hover:scale-105 hover:bg-transparent'
						)}
					>
						<AvatarTrigger avatarUrl={avatarUrl} username={username} isDark={isDark} />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent
					align="end"
					className={cn(
						'w-72 rounded-2xl overflow-hidden',
						'backdrop-blur-xl',
						'border p-0',
						isDark
							? 'bg-gradient-to-b from-slate-800/95 to-slate-900/95 border-violet-500/40 shadow-[0_8px_32px_rgba(139,92,246,0.4)]'
							: 'bg-gradient-to-b from-white/95 to-slate-50/95 border-violet-500/20 shadow-[0_8px_32px_rgba(139,92,246,0.2)]'
					)}
				>
					{/* Profile Header */}
					<UserProfileHeader
						username={username}
						avatarUrl={avatarUrl}
						userProfile={userProfile}
						isDark={isDark}
					/>

					{/* Menu Items */}
					<div className="py-2">
						{menuItems.map((item) => {
							const Icon = item.icon
							return (
								<Link key={item.href} href={item.href}>
									<DropdownMenuItem className={cn(
										'mx-2 rounded-xl cursor-pointer',
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
									</DropdownMenuItem>
								</Link>
							)
						})}
					</div>

					<DropdownMenuSeparator className={cn(
						'mx-4',
						isDark ? 'bg-violet-500/30' : 'bg-violet-500/20'
					)} />

					{/* Logout */}
					<div className="py-2">
						<DropdownMenuItem
							onClick={logout}
							className={cn(
								'mx-2 rounded-xl cursor-pointer',
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
						>
							<LogOut className={cn(
								'w-5 h-5 transition-all duration-300',
								isDark ? 'text-violet-400' : 'text-violet-500',
								'group-hover:text-cyan-400 group-hover:scale-110'
							)} />
							<span>{t('logout')}</span>
						</DropdownMenuItem>
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

export default UserMenu
