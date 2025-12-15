'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useUserContext } from '@/context/user'
import { Plus, Users, GraduationCap, FileText, Flag, Dumbbell, Languages, Home, LogOut, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getAvatarUrl } from '@/utils/avatars'
import InterfaceLanguageMenu from '@/components/layouts/InterfaceLanguageMenu'

const AdminNavbar = ({ activePage = 'dashboard' }) => {
	const t = useTranslations('admin')
	const tCommon = useTranslations('common')
	const { user, userProfile, logout } = useUserContext()

	const avatarUrl = getAvatarUrl(userProfile?.avatar_id)
	const username = userProfile?.name || user?.email?.split('@')[0] || 'Admin'

	const navButtons = [
		{
			id: 'create',
			label: t('newContent'),
			href: '/admin/create',
			icon: Plus,
		},
		{
			id: 'blog',
			label: 'Blog',
			href: '/admin/blog',
			icon: FileText,
		},
		{
			id: 'exercises',
			label: t('exercises'),
			href: '/admin/exercises',
			icon: GraduationCap,
		},
		{
			id: 'courses',
			label: 'Courses',
			href: '/admin/courses',
			icon: BookOpen,
		},
		{
			id: 'training',
			label: t('training') || 'Training',
			href: '/admin/training',
			icon: Dumbbell,
		},
		{
			id: 'reports',
			label: t('materialReports'),
			href: '/admin/reports',
			icon: Flag,
		},
		{
			id: 'translations',
			label: t('translationsCache') || 'Traductions',
			href: '/admin/translations-cache',
			icon: Languages,
		},
		{
			id: 'users',
			label: t('users'),
			href: '/admin/users',
			icon: Users,
		},
	]

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200/60 backdrop-blur-sm">
			<div className="max-w-7xl mx-auto px-6">
				<div className="flex items-center justify-between h-16">
					{/* Left: Admin Badge */}
					<Link href="/admin" className="flex items-center group">
						<span className="px-2.5 py-1 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-md shadow-sm">
							ADMIN
						</span>
					</Link>

					{/* Center: Navigation */}
					<div className="hidden lg:flex items-center gap-1">
						{navButtons.map(btn => {
							const Icon = btn.icon
							const isActive = activePage === btn.id
							return (
								<Link
									key={btn.id}
									href={btn.href}
									className={cn(
										'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap',
										isActive
											? 'text-slate-900 bg-slate-100'
											: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
									)}
								>
									<Icon className="w-4 h-4" />
									<span className="hidden xl:inline">{btn.label}</span>
								</Link>
							)
						})}
					</div>

					{/* Mobile: Compact buttons */}
					<div className="flex lg:hidden items-center gap-1 flex-1 justify-center overflow-x-auto">
						{navButtons.map(btn => {
							const Icon = btn.icon
							const isActive = activePage === btn.id
							return (
								<Link
									key={btn.id}
									href={btn.href}
									className={cn(
										'flex items-center justify-center w-9 h-9 rounded-md transition-colors',
										isActive
											? 'text-slate-900 bg-slate-100'
											: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
									)}
								>
									<Icon className="w-4 h-4" />
								</Link>
							)
						})}
					</div>

					{/* Right: Language + User */}
					<div className="flex items-center gap-2">
						<InterfaceLanguageMenu variant="compact" />

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-50 transition-colors">
									<Avatar className="w-7 h-7">
										<AvatarImage src={avatarUrl} alt={username} />
										<AvatarFallback className="bg-slate-900 text-white text-xs font-medium">
											{username[0]?.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<span className="hidden lg:inline text-sm font-medium text-slate-700">
										{username}
									</span>
								</button>
							</DropdownMenuTrigger>

							<DropdownMenuContent align="end" className="w-56">
								<div className="px-3 py-2 border-b border-slate-100">
									<p className="text-sm font-medium text-slate-900">{username}</p>
									<p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
								</div>
								<Link href="/">
									<DropdownMenuItem className="cursor-pointer">
										<Home className="w-4 h-4 mr-2" />
										{tCommon('backToSite') || 'Retour au site'}
									</DropdownMenuItem>
								</Link>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600">
									<LogOut className="w-4 h-4 mr-2" />
									{tCommon('logout')}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</nav>
	)
}

export default AdminNavbar
