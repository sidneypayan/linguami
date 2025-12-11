'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useUserContext } from '@/context/user.js'
import { useParams } from 'next/navigation'
import { useHasLessonsForLanguage } from '@/lib/lessons-client'
import { useThemeMode } from '@/context/ThemeContext'
import UserMenu from './UserMenu'
import GuestMenu from './GuestMenu'
import ThemeToggle from './ThemeToggle'
import { Link, usePathname } from '@/i18n/navigation'
import LanguageMenu from './LanguageMenu.jsx'
import InterfaceLanguageMenu from './InterfaceLanguageMenu.jsx'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetTitle,
} from '@/components/ui/sheet'
import {
	Home,
	BookOpen,
	UserSearch,
	Library,
	Rss,
	Menu,
	ShieldCheck,
	GraduationCap,
	X,
	Sparkles,
} from 'lucide-react'

const drawerWidth = '75%'

const Navbar = props => {
	const t = useTranslations('common')
	const locale = useLocale()
	const { user, userProfile, isUserLoggedIn, isUserAdmin, isBootstrapping } = useUserContext()
	const { isDark } = useThemeMode()
	const pathname = usePathname()
	const params = useParams()
	const { data: hasLessons = false, isLoading: isCheckingLessons } = useHasLessonsForLanguage(locale)

	const allNavigationLinks = [
		{
			name: 'Linguami',
			icon: Home,
			href: '/',
		},
		{
			name: t('material'),
			icon: BookOpen,
			href: '/materials',
		},
		{
			name: t('methode'),
			icon: GraduationCap,
			href: '/method',
			hideIf: !isUserAdmin,
		},
		{
			name: t('teacher'),
			icon: UserSearch,
			href: '/teacher',
		},
		{
			name: t('lessons'),
			icon: Library,
			href: '/lessons',
			hideIf: process.env.NODE_ENV === 'production' && !isUserAdmin,
		},
		{
			name: t('blog'),
			icon: Rss,
			href: '/blog',
		},
	]

	const navigationLinks = allNavigationLinks.filter(link => !link.hideIf)

	const [mobileOpen, setMobileOpen] = useState(false)
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	const isActivePath = (href) => {
		if (href === '/') return pathname === '/'
		return pathname?.startsWith(href)
	}

	const isOnLessonPage = () => {
		if (!pathname) return false
		const pathSegments = pathname.split('/').filter(Boolean)
		return pathname.startsWith('/method/') && pathSegments.length === 3
	}

	const isOnMaterialSectionPage = () => {
		if (!pathname) return false
		const isMaterialsPath = pathname.includes('/materials/')
		const hasSection = params?.section && !params?.material
		return isMaterialsPath && hasSection
	}

	const isOnMethodPage = () => {
		if (!pathname) return false
		return pathname.includes('/method')
	}

	return (
		<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
			{/* Main Navbar */}
			<nav className={cn(
				'fixed top-0 left-0 right-0 z-50',
				'bg-gradient-to-r from-violet-900 via-purple-900 to-indigo-900',
				'backdrop-blur-xl',
				'shadow-[0_4px_30px_rgba(139,92,246,0.4)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)]',
				'border-b border-violet-500/30'
			)}>
				{/* Background effects */}
				<div className="absolute inset-0 pointer-events-none overflow-hidden">
					<div className="absolute top-0 left-1/4 w-64 h-32 bg-violet-500/20 rounded-full blur-3xl" />
					<div className="absolute top-0 right-1/4 w-64 h-32 bg-cyan-500/15 rounded-full blur-3xl" />
				</div>

				<div className={cn(
					'relative z-10 flex items-center justify-between',
					'min-h-[70px] sm:min-h-[80px]',
					'px-3 sm:px-4 md:px-6 py-2'
				)}>
					{/* Mobile menu button */}
					<SheetTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							suppressHydrationWarning
							className={cn(
								'2xl:hidden',
								'w-11 h-11 sm:w-12 sm:h-12 rounded-xl',
								'bg-gradient-to-br from-violet-500/30 to-cyan-500/20',
								'border border-violet-500/40',
								'backdrop-blur-sm',
								'shadow-lg shadow-violet-500/30 dark:shadow-lg dark:shadow-black/30',
								'transition-all duration-300',
								'hover:from-violet-500/50 hover:to-cyan-500/30',
								'hover:scale-110 hover:rotate-3',
								'hover:shadow-xl hover:shadow-violet-500/50 dark:hover:shadow-xl dark:hover:shadow-black/40',
								'active:scale-95 hover:bg-transparent'
							)}
						>
							<Menu className="w-6 h-6 text-white drop-shadow-[0_0_4px_rgba(139,92,246,0.8)]" />
						</Button>
					</SheetTrigger>

					{/* Logo - hidden on mobile */}
					<Link href="/" className="hidden sm:flex items-center gap-2 group mr-4 lg:mr-6">
						<div className={cn(
							'px-3 md:px-4 py-2 rounded-xl',
							'transition-all duration-300',
							'group-hover:scale-105 group-hover:-translate-y-0.5',
							'group-hover:bg-gradient-to-br group-hover:from-violet-500/30 group-hover:to-cyan-500/25',
							'group-hover:shadow-[0_4px_20px_rgba(139,92,246,0.4)] dark:group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
						)}>
							<span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
								Linguami
							</span>
						</div>
					</Link>

					{/* Desktop Navigation Links */}
					<div className="hidden 2xl:flex items-center gap-2 flex-1">
						{navigationLinks.slice(1).map((link) => {
							const isActive = isActivePath(link.href)
							const Icon = link.icon
							return (
								<Link key={link.name} href={link.href}>
									<Button
										variant="ghost"
										className={cn(
											'relative overflow-hidden group',
											'flex items-center gap-2.5 px-5 py-3 rounded-lg h-11',
											'font-semibold text-white text-sm',
											'transition-all duration-300',
											isActive
												? 'bg-white/20 backdrop-blur-sm'
												: 'bg-white/10 backdrop-blur-sm hover:bg-white/20',
											'hover:text-white hover:-translate-y-0.5'
										)}
									>
										{/* Shine effect */}
										<span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
										<Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 relative z-10" />
										<span className="relative z-10">{link.name}</span>
									</Button>
								</Link>
							)
						})}
					</div>

					{/* Right side */}
					<div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
						{/* Admin button - desktop only */}
						{isUserAdmin && (
							<Link href="/admin" className="hidden 2xl:block">
								<Button
									variant="ghost"
									className={cn(
										'relative overflow-hidden group',
										'flex items-center gap-2.5 px-5 py-3 rounded-lg h-11',
										'font-semibold text-white text-sm',
										'bg-amber-500/20 backdrop-blur-sm',
										'transition-all duration-300',
										'hover:bg-amber-500/30 hover:text-white hover:-translate-y-0.5'
									)}
								>
									{/* Shine effect */}
									<span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
									<ShieldCheck className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 relative z-10" />
									<span className="relative z-10">{t('admin')}</span>
								</Button>
							</Link>
						)}

						{/* Theme toggle - always visible */}
						{isMounted && <ThemeToggle />}

						{/* Language menus - hidden on lesson/material/method pages */}
						{isMounted && !params?.material && !params?.slug && !isOnLessonPage() && !isOnMaterialSectionPage() && !isOnMethodPage() && (
							<>
								<InterfaceLanguageMenu />
								<LanguageMenu />
							</>
						)}

						{/* User/Guest menu */}
						{isMounted && (
							<>
								{isBootstrapping ? (
									<div className="ml-1 sm:ml-2 lg:ml-4">
										<div className={cn(
											'w-11 h-11 sm:w-12 sm:h-12 lg:w-13 lg:h-13 rounded-full',
											'bg-gradient-to-br from-violet-500/20 to-cyan-500/15',
											'border-2 border-white/20',
											'animate-pulse'
										)} />
									</div>
								) : isUserLoggedIn ? (
									<UserMenu />
								) : (
									<GuestMenu />
								)}
							</>
						)}
					</div>
				</div>
			</nav>

			{/* Mobile Drawer */}
			<SheetContent
				side="left"
				className={cn(
					'w-[75%] max-w-[320px] p-0',
					'bg-gradient-to-b from-violet-900 via-purple-900 to-indigo-950',
					'border-r border-violet-500/40',
					'shadow-[4px_0_30px_rgba(139,92,246,0.4)] dark:shadow-[4px_0_30px_rgba(0,0,0,0.4)]',
					'2xl:hidden'
				)}
			>
				{/* Title for accessibility (hidden) */}
				<SheetTitle className="sr-only">Menu de navigation</SheetTitle>

				{/* Background effects */}
				<div className="absolute inset-0 pointer-events-none overflow-hidden">
					<div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />
					<div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl" />
				</div>

				<div className="relative z-10 flex flex-col h-full overflow-y-auto">
					{/* Navigation */}
					<nav className="flex-1 px-4 pt-16 pb-4">
						<ul className="space-y-2">
							{navigationLinks.map((link, index) => {
								const isActive = isActivePath(link.href)
								const Icon = link.icon
								return (
									<li
										key={link.name}
										style={{ animationDelay: `${index * 30}ms` }}
										className="animate-in slide-in-from-left-4 duration-300"
									>
										<Link href={link.href} onClick={() => setMobileOpen(false)}>
											<div className={cn(
												'flex items-center gap-3 px-4 py-3.5 rounded-xl',
												'text-white font-semibold',
												'transition-all duration-300',
												'border',
												isActive
													? 'bg-white/20 backdrop-blur-sm border-white/30 shadow-lg'
													: 'border-transparent hover:bg-white/15 hover:translate-x-2',
											)}>
												<Icon className={cn(
													'w-6 h-6',
													isActive && 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]'
												)} />
												<span>{link.name}</span>
												{isActive && (
													<div className="ml-auto w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
												)}
											</div>
										</Link>
									</li>
								)
							})}

							{/* Admin link for mobile */}
							{isUserAdmin && (
								<li
									style={{ animationDelay: `${navigationLinks.length * 30}ms` }}
									className="animate-in slide-in-from-left-4 duration-300"
								>
									<Link href="/admin" onClick={() => setMobileOpen(false)}>
										<div className={cn(
											'flex items-center gap-3 px-4 py-3.5 rounded-xl',
											'text-white font-semibold',
											'transition-all duration-300',
											'border',
											'bg-gradient-to-r from-amber-500/15 to-orange-500/15',
											'border-amber-500/30',
											isActivePath('/admin')
												? 'bg-white/20 backdrop-blur-sm border-white/30 shadow-lg'
												: 'hover:bg-amber-500/25 hover:translate-x-2',
										)}>
											<ShieldCheck className="w-6 h-6 drop-shadow-[0_2px_4px_rgba(255,215,0,0.3)]" />
											<span>{t('admin')}</span>
											{isActivePath('/admin') && (
												<div className="ml-auto w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
											)}
										</div>
									</Link>
								</li>
							)}
						</ul>
					</nav>

					{/* Sign in/Sign up buttons for mobile */}
					{isMounted && (
						<>
							{isBootstrapping ? (
								<div className="px-4 pb-6 mt-auto">
									<div className="h-10 rounded-xl bg-white/10 animate-pulse" />
								</div>
							) : !isUserLoggedIn ? (
								<div className="px-4 pb-6 mt-auto">
									<Link href="/login" onClick={() => setMobileOpen(false)}>
										<Button
											variant="ghost"
											className={cn(
												'w-full h-10 rounded-xl',
												'font-semibold text-white text-sm',
												'bg-white/10 backdrop-blur-sm',
												'border border-white/30',
												'transition-all duration-300',
												'hover:bg-white/20 hover:border-white/50',
												'hover:scale-105',
												'active:scale-95'
											)}
										>
											{t('signin')}
										</Button>
									</Link>
								</div>
							) : null}
						</>
					)}
				</div>
			</SheetContent>
		</Sheet>
	)
}

export default Navbar
