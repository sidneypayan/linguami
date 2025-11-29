'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
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
	SpellCheck,
	User,
	Trophy,
	LogIn,
	UserPlus,
	X,
} from 'lucide-react'

// ============================================
// AVATAR TRIGGER BUTTON
// ============================================
const AvatarTrigger = ({ avatarUrl }) => (
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
			<AvatarImage src={avatarUrl} alt="Guest" className="object-cover" />
			<AvatarFallback className="bg-violet-500/50">
				<User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
			</AvatarFallback>
		</Avatar>
	</div>
)

// ============================================
// GUEST HEADER
// ============================================
const GuestHeader = ({ t, isDark, size = 'normal', onClose, avatarUrl }) => (
	<div className={cn(
		'relative overflow-hidden',
		'bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900',
		size === 'large' ? 'p-5 sm:p-6' : 'p-4'
	)}>
		{/* Background glow */}
		<div className="absolute inset-0 pointer-events-none">
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-violet-500/30 rounded-full blur-3xl" />
		</div>

		<div className="relative z-10">
			{/* Title */}
			<div className={cn(
				'text-center border-b border-violet-500/30',
				size === 'large' ? 'mb-3 pb-3' : 'mb-2 pb-2'
			)}>
				<h3 className={cn(
					'font-bold tracking-wide',
					'bg-gradient-to-r from-violet-300 via-cyan-300 to-violet-300',
					'bg-clip-text text-transparent',
					size === 'large' ? 'text-xl sm:text-2xl' : 'text-lg'
				)}>
					{t('guest_mode')}
				</h3>
			</div>

			{/* Avatar */}
			<div className={cn(
				'flex justify-center',
				size === 'large' ? 'mb-3' : 'mb-2'
			)}>
				<div className={cn(
					'relative rounded-full',
					'bg-gradient-to-br from-violet-500 to-cyan-500 p-1',
					'shadow-lg shadow-violet-500/50',
					size === 'large' ? 'w-28 h-28 sm:w-32 sm:h-32' : 'w-24 h-24'
				)}>
					<Avatar className="w-full h-full border-[3px] border-slate-900">
						<AvatarImage src={avatarUrl} alt="Guest" />
						<AvatarFallback className="bg-slate-800">
							<User className={cn(
								'text-violet-300',
								size === 'large' ? 'w-12 h-12' : 'w-9 h-9'
							)} />
						</AvatarFallback>
					</Avatar>
				</div>
			</div>

			{/* Subtitle */}
			<p className={cn(
				'text-center font-medium text-violet-200/80',
				size === 'large' ? 'text-base mb-6 max-w-xs mx-auto' : 'text-sm mb-5'
			)}>
				{t('guest_mode_description')}
			</p>

			{/* Button with shine effect */}
			<Link href="/signup" onClick={onClose}>
				<Button
					className={cn(
						'relative overflow-hidden group',
						'bg-gradient-to-r from-cyan-500 to-violet-500',
						'text-white font-bold tracking-wide',
						'shadow-lg shadow-cyan-500/40',
						'border border-white/20',
						'transition-all duration-300',
						'hover:shadow-xl hover:shadow-violet-500/50',
						'hover:scale-[1.02] hover:-translate-y-0.5',
						'active:scale-[0.98]',
						size === 'large' ? 'w-full py-2.5 text-base' : 'w-full py-2'
					)}
				>
					{/* Shine effect */}
					<span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
					<span className="relative z-10">{t('create_account')}</span>
				</Button>
			</Link>
		</div>
	</div>
)

// ============================================
// MENU ITEM COMPONENT
// ============================================
const MenuItem = ({ href, icon: Icon, label, isDark, size = 'normal', onClick }) => (
	<Link href={href} onClick={onClick}>
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
	</Link>
)

// ============================================
// MAIN COMPONENT
// ============================================
const GuestMenu = () => {
	const t = useTranslations('common')
	const { isDark } = useThemeMode()
	const [mobileOpen, setMobileOpen] = useState(false)

	// Avatar par défaut pour les guests (Human Male)
	const avatarUrl = useMemo(() => getAvatarUrl('avatar12'), [])

	const menuItems = [
		{ href: '/dictionary', icon: SpellCheck, label: t('mydictionary') },
		{ href: '/leaderboard', icon: Trophy, label: t('leaderboard') },
	]

	const authItems = [
		{ href: '/login', icon: LogIn, label: t('signin') },
		{ href: '/signup', icon: UserPlus, label: t('signup') },
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
						<AvatarTrigger avatarUrl={avatarUrl} />
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
					<SheetTitle className="sr-only">Menu invité</SheetTitle>

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
						{/* Guest Header */}
						<GuestHeader
							t={t}
							isDark={isDark}
							size="large"
							onClose={() => setMobileOpen(false)}
							avatarUrl={avatarUrl}
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

						{/* Auth Items */}
						<div className="p-4 space-y-1">
							{authItems.map((item) => (
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
						<AvatarTrigger avatarUrl={avatarUrl} />
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
					{/* Guest Header */}
					<GuestHeader t={t} isDark={isDark} avatarUrl={avatarUrl} />

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

					{/* Auth Items */}
					<div className="py-2 space-y-0.5">
						{authItems.map((item) => {
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
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

export default GuestMenu
