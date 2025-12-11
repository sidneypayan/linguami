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
	Crown,
} from 'lucide-react'

// ============================================
// AVATAR TRIGGER BUTTON
// ============================================
const AvatarTrigger = ({ avatarUrl, username, isDark, isPremium }) => (
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
		{/* Crown for premium users */}
		{isPremium && (
			<div className={cn(
				'absolute -top-1 -right-1',
				'w-5 h-5 sm:w-6 sm:h-6',
				'rounded-full',
				'bg-gradient-to-br from-amber-400 to-yellow-500',
				'border-2 border-slate-900',
				'flex items-center justify-center',
				'shadow-lg shadow-amber-500/50'
			)}>
				<Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white fill-white" />
			</div>
		)}
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
						'inline-flex items-center gap-1.5 mt-2 px-3 py-1',
						'text-xs font-semibold text-amber-300',
						'bg-amber-500/20 border border-amber-500/30 rounded-full'
					)}>
						<Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
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
					size === 'large' ? 'w-28 h-28 sm:w-32 sm:h-32' : 'w-24 h-24'
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
							'bg-gradient-to-br from-amber-400 to-yellow-500',
							'border-2 border-slate-900',
							'flex items-center justify-center',
							'shadow-lg shadow-amber-500/50',
							size === 'large' ? 'w-7 h-7' : 'w-6 h-6'
						)}>
							<Crown className={cn(
								'text-white fill-white',
								size === 'large' ? 'w-4 h-4' : 'w-3.5 h-3.5'
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
			'relative flex items-center gap-3 rounded-xl cursor-pointer overflow-hidden',
			'font-[450] tracking-wide transition-all duration-300',
			isDark ? 'text-slate-300' : 'text-slate-600',
			'hover:bg-gradient-to-r',
			isDark
				? 'hover:from-violet-600/25 hover:via-purple-600/20 hover:to-cyan-600/15'
				: 'hover:from-violet-500/15 hover:via-purple-500/10 hover:to-cyan-500/10',
			'hover:translate-x-1.5',
			'border-l-[3px] border-transparent',
			'hover:border-l-[3px] hover:border-gradient-to-b hover:border-violet-400',
			'group',
			size === 'large' ? 'px-4 py-4 text-base' : 'px-3 py-3 text-[0.95rem]'
		)}>
			{/* Magical glow effect on hover */}
			<div className={cn(
				'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500',
				'bg-gradient-to-r from-violet-500/5 via-transparent to-cyan-500/5'
			)} />

			{/* Icon with enhanced glow */}
			<div className="relative">
				<Icon className={cn(
					'relative z-10 transition-all duration-300',
					isDark ? 'text-violet-400' : 'text-violet-500',
					'group-hover:text-cyan-400 group-hover:scale-110',
					'group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]',
					size === 'large' ? 'w-6 h-6' : 'w-5 h-5'
				)} />
				{/* Icon background glow */}
				<div className={cn(
					'absolute inset-0 rounded-full blur-md transition-opacity duration-300',
					'bg-violet-500/40 opacity-0 group-hover:opacity-100',
					size === 'large' ? '-m-1' : '-m-0.5'
				)} />
			</div>

			{/* Text with magical gradient on hover */}
			<span className={cn(
				'relative z-10 transition-all duration-300',
				'group-hover:text-transparent group-hover:bg-clip-text',
				isDark
					? 'group-hover:bg-gradient-to-r group-hover:from-violet-200 group-hover:via-cyan-300 group-hover:to-violet-200'
					: 'group-hover:bg-gradient-to-r group-hover:from-violet-500 group-hover:via-cyan-500 group-hover:to-violet-500'
			)}>
				{label}
			</span>
		</div>
	)

	// Button only (no href) - used for logout
	if (onClick && !href) {
		return <button onClick={onClick} className="w-full text-left">{content}</button>
	}

	// Link with optional onClick (for closing sheet after navigation)
	return <Link href={href} onClick={onClick}>{content}</Link>
}

// ============================================
// MAIN COMPONENT
// ============================================
const UserMenu = () => {
	const t = useTranslations('common')
	const { user, userProfile, logout, isUserAdmin } = useUserContext()
	const { isDark } = useThemeMode()
	const [mobileOpen, setMobileOpen] = useState(false)

	const avatarUrl = useMemo(
		() => getAvatarUrl(userProfile?.avatar_id),
		[userProfile?.avatar_id]
	)

	const username = userProfile?.name || user?.email?.split('@')[0] || 'User'

	const allMenuItems = [
		{ href: '/dictionary', icon: SpellCheck, label: t('mydictionary') },
		{ href: '/my-materials', icon: Bookmark, label: t('mymaterials') },
		{ href: '/statistics', icon: BarChart3, label: t('statistics') },
		{ href: '/leaderboard', icon: Trophy, label: t('leaderboard') },
		{ href: '/training', icon: Dumbbell, label: t('training'), requiresVipOrAdmin: true },
		{ href: '/settings', icon: Settings, label: t('settings') },
	]

	// Filter menu items based on user role
	const menuItems = allMenuItems.filter(item => {
		if (item.requiresVipOrAdmin) {
			const isVip = userProfile?.role === 'vip'
			return isUserAdmin || isVip
		}
		return true
	})

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
						<AvatarTrigger avatarUrl={avatarUrl} username={username} isDark={isDark} isPremium={userProfile?.is_premium} />
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

						{/* Ornate separator */}
						<div className="relative py-3 px-6">
							<div className={cn(
								'h-px',
								isDark ? 'bg-violet-500/30' : 'bg-violet-500/20'
							)} />
							{/* Center diamond ornament */}
							<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
								<div className={cn(
									'w-2.5 h-2.5 rotate-45',
									isDark ? 'bg-violet-500/50' : 'bg-violet-500/30',
									'shadow-[0_0_10px_rgba(139,92,246,0.4)]'
								)} />
							</div>
						</div>

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
						<AvatarTrigger avatarUrl={avatarUrl} username={username} isDark={isDark} isPremium={userProfile?.is_premium} />
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
					<div className="py-2 space-y-0.5">
						{menuItems.map((item) => {
							const Icon = item.icon
							return (
								<Link key={item.href} href={item.href}>
									<DropdownMenuItem className={cn(
										'relative mx-2 rounded-xl cursor-pointer overflow-hidden',
										'font-[450] tracking-wide text-[0.95rem]',
										'transition-all duration-300',
										isDark ? 'text-slate-300' : 'text-slate-600',
										'hover:bg-gradient-to-r',
										isDark
											? 'hover:from-violet-600/25 hover:via-purple-600/20 hover:to-cyan-600/15'
											: 'hover:from-violet-500/15 hover:via-purple-500/10 hover:to-cyan-500/10',
										'hover:translate-x-1.5',
										'border-l-[3px] border-transparent',
										'hover:border-violet-400',
										'group'
									)}>
										{/* Magical glow effect */}
										<div className={cn(
											'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500',
											'bg-gradient-to-r from-violet-500/5 via-transparent to-cyan-500/5'
										)} />

										{/* Icon with glow */}
										<div className="relative">
											<Icon className={cn(
												'relative z-10 w-5 h-5 transition-all duration-300',
												isDark ? 'text-violet-400' : 'text-violet-500',
												'group-hover:text-cyan-400 group-hover:scale-110',
												'group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]'
											)} />
											<div className={cn(
												'absolute inset-0 -m-0.5 rounded-full blur-md transition-opacity duration-300',
												'bg-violet-500/40 opacity-0 group-hover:opacity-100'
											)} />
										</div>

										{/* Text with magical gradient */}
										<span className={cn(
											'relative z-10 transition-all duration-300',
											'group-hover:text-transparent group-hover:bg-clip-text',
											isDark
												? 'group-hover:bg-gradient-to-r group-hover:from-violet-200 group-hover:via-cyan-300 group-hover:to-violet-200'
												: 'group-hover:bg-gradient-to-r group-hover:from-violet-500 group-hover:via-cyan-500 group-hover:to-violet-500'
										)}>
											{item.label}
										</span>
									</DropdownMenuItem>
								</Link>
							)
						})}
					</div>

					{/* Ornate separator */}
					<div className="relative py-2 px-4">
						<div className={cn(
							'h-px',
							isDark ? 'bg-violet-500/30' : 'bg-violet-500/20'
						)} />
						{/* Center diamond ornament */}
						<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
							<div className={cn(
								'w-2 h-2 rotate-45',
								isDark ? 'bg-violet-500/50' : 'bg-violet-500/30',
								'shadow-[0_0_8px_rgba(139,92,246,0.3)]'
							)} />
						</div>
					</div>

					{/* Logout */}
					<div className="py-2">
						<DropdownMenuItem
							onClick={logout}
							className={cn(
								'relative mx-2 rounded-xl cursor-pointer overflow-hidden',
								'font-[450] tracking-wide text-[0.95rem]',
								'transition-all duration-300',
								isDark ? 'text-slate-300' : 'text-slate-600',
								'hover:bg-gradient-to-r',
								isDark
									? 'hover:from-red-600/20 hover:via-orange-600/15 hover:to-amber-600/10'
									: 'hover:from-red-500/15 hover:via-orange-500/10 hover:to-amber-500/10',
								'hover:translate-x-1.5',
								'border-l-[3px] border-transparent',
								'hover:border-red-400',
								'group'
							)}
						>
							{/* Magical glow effect */}
							<div className={cn(
								'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500',
								'bg-gradient-to-r from-red-500/5 via-transparent to-orange-500/5'
							)} />

							{/* Icon with glow */}
							<div className="relative">
								<LogOut className={cn(
									'relative z-10 w-5 h-5 transition-all duration-300',
									isDark ? 'text-violet-400' : 'text-violet-500',
									'group-hover:text-red-400 group-hover:scale-110',
									'group-hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]'
								)} />
								<div className={cn(
									'absolute inset-0 -m-0.5 rounded-full blur-md transition-opacity duration-300',
									'bg-red-500/40 opacity-0 group-hover:opacity-100'
								)} />
							</div>

							{/* Text with magical gradient */}
							<span className={cn(
								'relative z-10 transition-all duration-300',
								'group-hover:text-transparent group-hover:bg-clip-text',
								isDark
									? 'group-hover:bg-gradient-to-r group-hover:from-red-300 group-hover:via-amber-300 group-hover:to-red-300'
									: 'group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:via-orange-400 group-hover:to-red-500'
							)}>
								{t('logout')}
							</span>
						</DropdownMenuItem>
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

export default UserMenu
