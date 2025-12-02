'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Plus, Users, GraduationCap, FileText, Flag, Dumbbell, Languages } from 'lucide-react'
import { cn } from '@/lib/utils'

const AdminNavbar = ({ activePage = 'dashboard' }) => {
	const t = useTranslations('admin')

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
		<nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center py-4">
					{/* Navigation Buttons */}
					<div className="flex gap-2 md:gap-3">
						{navButtons.map(btn => {
							const Icon = btn.icon
							const isActive = activePage === btn.id
							return (
								<Link
									key={btn.id}
									href={btn.href}
									className={cn(
										'flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200',
										isActive
											? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
											: 'bg-indigo-500 text-white hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20'
									)}
								>
									<Icon className="w-5 h-5" />
									<span className="hidden md:inline">{btn.label}</span>
								</Link>
							)
						})}
					</div>
				</div>
			</div>
		</nav>
	)
}

export default AdminNavbar
