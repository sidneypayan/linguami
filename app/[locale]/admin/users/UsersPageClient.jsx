'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Search, User, Shield, ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react'
import AdminNavbar from '@/components/admin/AdminNavbar'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const UsersPage = ({ initialUsers = [] }) => {
	const t = useTranslations('admin')

	const [users] = useState(initialUsers)
	const [searchQuery, setSearchQuery] = useState('')
	const [sortBy, setSortBy] = useState('created_at')
	const [sortOrder, setSortOrder] = useState('desc')

	const handleSort = (column) => {
		if (sortBy === column) {
			setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
		} else {
			setSortBy(column)
			if (column === 'name') {
				setSortOrder('asc')
			} else {
				setSortOrder('desc')
			}
		}
	}

	const filteredUsers = users
		.filter(user => {
			const searchLower = searchQuery.toLowerCase()
			return (
				user.name?.toLowerCase().includes(searchLower) ||
				user.email?.toLowerCase().includes(searchLower)
			)
		})
		.sort((a, b) => {
			let compareA, compareB

			switch (sortBy) {
				case 'name':
					compareA = (a.name || '').toLowerCase()
					compareB = (b.name || '').toLowerCase()
					break
				case 'role':
					compareA = a.role || 'user'
					compareB = b.role || 'user'
					break
				case 'is_premium':
					compareA = a.is_premium ? 1 : 0
					compareB = b.is_premium ? 1 : 0
					break
				case 'total_xp':
					compareA = a.total_xp || 0
					compareB = b.total_xp || 0
					break
				case 'current_level':
					compareA = a.current_level || 1
					compareB = b.current_level || 1
					break
				case 'language_level':
					const levelOrder = { beginner: 1, intermediate: 2, advanced: 3 }
					compareA = levelOrder[a.language_level] || 0
					compareB = levelOrder[b.language_level] || 0
					break
				case 'created_at':
				default:
					compareA = new Date(a.created_at || 0)
					compareB = new Date(b.created_at || 0)
					break
			}

			let result = 0
			if (compareA < compareB) result = -1
			else if (compareA > compareB) result = 1

			return sortOrder === 'asc' ? result : -result
		})

	const getRoleColor = (role) => {
		return role === 'admin' ? 'text-red-500 bg-red-500/10' : 'text-blue-500 bg-blue-500/10'
	}

	const getLanguageInfo = (lang) => {
		const info = {
			french: { name: 'Francais', flag: '🇫🇷', color: 'text-blue-500 bg-blue-500/10' },
			russian: { name: 'Russkij', flag: '🇷🇺', color: 'text-red-500 bg-red-500/10' },
			english: { name: 'English', flag: '🇬🇧', color: 'text-emerald-500 bg-emerald-500/10' },
		}
		return info[lang] || { name: lang, flag: '🌐', color: 'text-slate-500 bg-slate-500/10' }
	}

	const getLevelInfo = (level) => {
		const info = {
			beginner: { name: t('beginner'), color: 'text-emerald-500 bg-emerald-500/10' },
			intermediate: { name: t('intermediate'), color: 'text-amber-500 bg-amber-500/10' },
			advanced: { name: t('advanced'), color: 'text-red-500 bg-red-500/10' },
		}
		return info[level] || { name: level, color: 'text-slate-500 bg-slate-500/10' }
	}

	const getRoleLabel = (role) => {
		const roleLabels = {
			admin: t('admin'),
			user: t('user'),
		}
		return roleLabels[role] || role
	}

	const formatDate = (dateString) => {
		if (!dateString) return 'N/A'
		const date = new Date(dateString)
		return new Intl.DateTimeFormat('fr-FR', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		}).format(date)
	}

	const SortableHeader = ({ column, children }) => {
		const isActive = sortBy === column
		return (
			<TableHead>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								onClick={() => handleSort(column)}
								className="flex items-center gap-1.5 hover:text-indigo-500 transition-colors">
								{children}
								<span className={cn(
									'transition-opacity',
									isActive ? 'opacity-100 text-indigo-500' : 'opacity-30'
								)}>
									{isActive && sortOrder === 'asc' ? (
										<ArrowUp className="h-4 w-4" />
									) : isActive && sortOrder === 'desc' ? (
										<ArrowDown className="h-4 w-4" />
									) : (
										<ChevronsUpDown className="h-4 w-4" />
									)}
								</span>
							</button>
						</TooltipTrigger>
						<TooltipContent>
							{isActive && sortOrder === 'asc' ? t('sortDescending') : t('sortAscending')}
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</TableHead>
		)
	}

	return (
		<div className="min-h-screen bg-white pt-16">
			<AdminNavbar activePage="users" />

			<div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
				{/* Search Bar */}
				<Card className="mb-4 md:mb-6">
					<CardContent className="p-4 md:p-6">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
							<Input
								placeholder={t('searchByNameOrEmail')}
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10 rounded-lg"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Mobile View - Cards */}
				<div className="block md:hidden space-y-4">
					{filteredUsers.length === 0 ? (
						<Card className="p-8 text-center">
							<p className="text-slate-500">{t('noUserFound')}</p>
						</Card>
					) : (
						filteredUsers.map((user) => (
							<Card key={user.id} className="overflow-hidden">
								<CardContent className="p-4">
									<div className="flex items-center gap-3 mb-4">
										<Avatar className="h-14 w-14 bg-indigo-500">
											<AvatarImage src={user.avatar_id ? `/avatars/${user.avatar_id}.png` : null} />
											<AvatarFallback className="bg-indigo-500 text-white font-bold">
												{user.name?.[0]?.toUpperCase() || 'U'}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1 min-w-0">
											<h3 className="font-bold text-slate-800 truncate">
												{user.name || 'Sans nom'}
											</h3>
											<p className="text-sm text-slate-500 truncate">
												{user.email || 'N/A'}
											</p>
										</div>
									</div>

									<Separator className="my-3" />

									<div className="grid grid-cols-2 gap-3">
										<div>
											<p className="text-xs text-slate-500 mb-1">{t('role')}</p>
											<Badge className={cn('font-semibold', getRoleColor(user.role))}>
												{user.role === 'admin' ? <Shield className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
												{getRoleLabel(user.role || 'user')}
											</Badge>
										</div>

										<div>
											<p className="text-xs text-slate-500 mb-1">{t('premium')}</p>
											<Badge className={user.is_premium ? 'text-amber-500 bg-amber-500/10' : 'text-slate-500 bg-slate-500/10'}>
												{user.is_premium ? t('premium') : t('free')}
											</Badge>
										</div>

										<div>
											<p className="text-xs text-slate-500 mb-1">{t('learnedLanguage')}</p>
											{user.spoken_language ? (
												<Badge className={getLanguageInfo(user.spoken_language).color}>
													{getLanguageInfo(user.spoken_language).flag} {getLanguageInfo(user.spoken_language).name}
												</Badge>
											) : (
												<span className="text-xs text-slate-400 italic">{t('notDefined')}</span>
											)}
										</div>

										<div>
											<p className="text-xs text-slate-500 mb-1">{t('level')}</p>
											{user.language_level ? (
												<Badge className={getLevelInfo(user.language_level).color}>
													{getLevelInfo(user.language_level).name}
												</Badge>
											) : (
												<span className="text-xs text-slate-400 italic">{t('notDefined')}</span>
											)}
										</div>

										<div>
											<p className="text-xs text-slate-500 mb-1">{t('totalXP')}</p>
											<Badge className="text-amber-500 bg-amber-500/10 font-bold">
												{user.total_xp?.toLocaleString() || '0'}
											</Badge>
										</div>

										<div>
											<p className="text-xs text-slate-500 mb-1">{t('xpLevel')}</p>
											<Badge className="text-violet-500 bg-violet-500/10 font-bold">
												Niv. {user.current_level || 1}
											</Badge>
										</div>

										<div className="col-span-2">
											<p className="text-xs text-slate-500 mb-1">{t('creationDate')}</p>
											<p className="text-sm font-medium text-slate-700">
												{formatDate(user.created_at)}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</div>

				{/* Desktop View - Table */}
				<Card className="hidden md:block overflow-hidden">
					<Table>
						<TableHeader>
							<TableRow className="bg-indigo-500/5 border-b-2 border-indigo-500">
								<SortableHeader column="name">{t('user')}</SortableHeader>
								<TableHead>{t('email')}</TableHead>
								<SortableHeader column="role">{t('role')}</SortableHeader>
								<SortableHeader column="is_premium">{t('premium')}</SortableHeader>
								<TableHead>{t('learnedLanguage')}</TableHead>
								<SortableHeader column="language_level">{t('level')}</SortableHeader>
								<SortableHeader column="created_at">{t('creationDate')}</SortableHeader>
								<SortableHeader column="total_xp">{t('totalXP')}</SortableHeader>
								<SortableHeader column="current_level">{t('xpLevel')}</SortableHeader>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredUsers.length === 0 ? (
								<TableRow>
									<TableCell colSpan={9} className="text-center py-12 text-slate-500">
										{t('noUserFound')}
									</TableCell>
								</TableRow>
							) : (
								filteredUsers.map((user) => (
									<TableRow key={user.id} className="hover:bg-indigo-500/5 transition-colors">
										<TableCell>
											<div className="flex items-center gap-3">
												<Avatar className="h-10 w-10 bg-indigo-500">
													<AvatarImage src={user.avatar_id ? `/avatars/${user.avatar_id}.png` : null} />
													<AvatarFallback className="bg-indigo-500 text-white font-bold">
														{user.name?.[0]?.toUpperCase() || 'U'}
													</AvatarFallback>
												</Avatar>
												<span className="font-semibold text-slate-800">
													{user.name || 'Sans nom'}
												</span>
											</div>
										</TableCell>
										<TableCell className="text-slate-500">
											{user.email || 'N/A'}
										</TableCell>
										<TableCell>
											<Badge className={cn('font-semibold', getRoleColor(user.role))}>
												{user.role === 'admin' ? <Shield className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
												{getRoleLabel(user.role || 'user')}
											</Badge>
										</TableCell>
										<TableCell>
											<Badge className={user.is_premium ? 'text-amber-500 bg-amber-500/10 border border-amber-500/30' : 'text-slate-500 bg-slate-500/10'}>
												{user.is_premium ? t('premium') : t('free')}
											</Badge>
										</TableCell>
										<TableCell>
											{user.spoken_language ? (
												<Badge className={getLanguageInfo(user.spoken_language).color}>
													{getLanguageInfo(user.spoken_language).flag} {getLanguageInfo(user.spoken_language).name}
												</Badge>
											) : (
												<span className="text-sm text-slate-400 italic">{t('notDefined')}</span>
											)}
										</TableCell>
										<TableCell>
											{user.language_level ? (
												<Badge className={getLevelInfo(user.language_level).color}>
													{getLevelInfo(user.language_level).name}
												</Badge>
											) : (
												<span className="text-sm text-slate-400 italic">{t('notDefined')}</span>
											)}
										</TableCell>
										<TableCell className="text-slate-500">
											{formatDate(user.created_at)}
										</TableCell>
										<TableCell>
											<Badge className="text-amber-500 bg-amber-500/10 font-bold">
												{user.total_xp?.toLocaleString() || '0'}
											</Badge>
										</TableCell>
										<TableCell>
											<Badge className="text-violet-500 bg-violet-500/10 font-bold">
												Niv. {user.current_level || 1}
											</Badge>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</Card>
			</div>
		</div>
	)
}

export default UsersPage
