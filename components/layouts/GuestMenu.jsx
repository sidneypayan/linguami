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
		size === 'large' ? 'p-6 sm:p-8' : 'p-5'
	)}>
		{/* Background glow */}
		<div className="absolute inset-0 pointer-events-none">
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-violet-500/30 rounded-full blur-3xl" />
			{size === 'large' && (
				<div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl" />
			)}
		</div>

		<div className="relative z-10 text-center">
			{/* Avatar */}
			{size === 'large' && (
				<div className="flex justify-center mb-4">
					<div className={cn(
						'w-24 h-24 sm:w-28 sm:h-28 rounded-full',
						'bg-gradient-to-br from-violet-500 to-cyan-500 p-1',
						'shadow-lg shadow-violet-500/50'
					)}>
						<Avatar className="w-full h-full border-[3px] border-slate-900">
							<AvatarImage src={avatarUrl} alt="Guest" />
							<AvatarFallback className="bg-slate-800">
								<User className="w-12 h-12 text-violet-300" />
							</AvatarFallback>
						</Avatar>
					</div>
				</div>
			)}

			<h3 className={cn(
				'font-bold text-white',
				size === 'large' ? 'text-xl sm:text-2xl mb-3' : 'text-lg mb-2'
			)}>
				{t('guest_mode')}
			</h3>
			<p className={cn(
				'text-white/80',
				size === 'large' ? 'text-base mb-6 max-w-xs mx-auto' : 'text-sm mb-4'
			)}>
				{t('guest_mode_description')}
			</p>
			<Link href="/signup" onClick={onClose}>
				<Button
					className={cn(
						'bg-gradient-to-r from-cyan-500 to-violet-500',
						'text-white font-bold',
						'shadow-lg shadow-cyan-500/30',
						'hover:from-cyan-600 hover:to-violet-600',
						'hover:shadow-xl hover:shadow-cyan-500/40',
						size === 'large' ? 'w-full py-3 text-base' : 'w-full py-2.5'
					)}
				>
					{t('create_account')}
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

						{/* Separator */}
						<div className={cn(
							'mx-6 h-px',
							isDark ? 'bg-violet-500/30' : 'bg-violet-500/20'
						)} />

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
					<GuestHeader t={t} isDark={isDark} />

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

					{/* Auth Items */}
					<div className="py-2">
						{authItems.map((item) => {
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
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

export default GuestMenu
