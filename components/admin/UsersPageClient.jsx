'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useUserContext } from '@/context/user'
import { Search, User, Shield, ArrowUp, ArrowDown, ChevronsUpDown, Loader2 } from 'lucide-react'
import AdminNavbar from '@/components/admin/AdminNavbar'
import { logger } from '@/utils/logger'
import { cn } from '@/lib/utils'

const UsersPage = () => {
	const t = useTranslations('admin')
	const locale = useLocale()
	const router = useRouter()
	const { isUserLoggedIn, isUserAdmin } = useUserContext()

	const [users, setUsers] = useState([])
	const [loading, setLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [sortBy, setSortBy] = useState('created_at')
	const [sortOrder, setSortOrder] = useState('desc')

	// Authentication check
	useEffect(() => {
		if (!isUserLoggedIn) {
			router.push('/login')
			return
		}

		if (!isUserAdmin) {
			router.push('/')
			return
		}
	}, [isUserLoggedIn, isUserAdmin, router])

	// Fetch users data
	useEffect(() => {
		if (!isUserAdmin) return

		const fetchUsers = async () => {
			setLoading(true)
			try {
				// Call API route to fetch users (needs service role key)
				const response = await fetch('/api/admin/users')
				const data = await response.json()

				if (data.users) {
					setUsers(data.users)
				}
			} catch (error) {
				logger.error('Error fetching users:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchUsers()
	}, [isUserAdmin])

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
		return role === 'admin' ? 'red' : 'blue'
	}

	const getLanguageInfo = (lang) => {
		const info = {
			french: { name: 'Francais', flag: '🇫🇷', color: 'blue' },
			russian: { name: 'Russkiy', flag: '🇷🇺', color: 'red' },
			english: { name: 'English', flag: '🇬🇧', color: 'emerald' },
		}
		return info[lang] || { name: lang, flag: '🌐', color: 'slate' }
	}

	const getLevelInfo = (level) => {
		const info = {
			beginner: { name: t('beginner'), color: 'emerald' },
			intermediate: { name: t('intermediate'), color: 'amber' },
			advanced: { name: t('advanced'), color: 'red' },
		}
		return info[level] || { name: level, color: 'slate' }
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
			<th
				onClick={() => handleSort(column)}
				className="px-6 py-3 text-left text-xs font-bold text-indigo-600 uppercase tracking-wider cursor-pointer select-none group"
			>
				<span className="flex items-center gap-1">
					{children}
					<span className={cn(
						'transition-opacity',
						isActive ? 'opacity-100' : 'opacity-30 group-hover:opacity-100'
					)}>
						{isActive && sortOrder === 'asc' ? (
							<ArrowUp className="w-4 h-4 text-indigo-600" />
						) : isActive && sortOrder === 'desc' ? (
							<ArrowDown className="w-4 h-4 text-indigo-600" />
						) : (
							<ChevronsUpDown className="w-4 h-4 text-slate-400" />
						)}
					</span>
				</span>
			</th>
		)
	}

	// Don't render until auth check is complete
	if (!isUserLoggedIn || !isUserAdmin) {
		return null
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-slate-50 pt-[70px] sm:pt-[80px] flex items-center justify-center">
				<Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-slate-50 pt-[70px] sm:pt-[80px]">
			<AdminNavbar activePage="users" />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Page Header */}
				<div className="mb-6">
					<h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">
						{t('usersManagement')}
					</h1>
					<p className="text-slate-500">
						{users.length} {users.length > 1 ? t('registeredUsersPlural') : t('registeredUsers')}
					</p>
				</div>

				{/* Search Bar */}
				<div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
						<input
							type="text"
							placeholder={t('searchByNameOrEmail')}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
						/>
					</div>
				</div>

				{/* Mobile View - Cards */}
				<div className="md:hidden space-y-4">
					{filteredUsers.length === 0 ? (
						<div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
							<p className="text-slate-500">{t('noUserFound')}</p>
						</div>
					) : (
						filteredUsers.map((user) => (
							<div
								key={user.id}
								className="bg-white rounded-xl border border-slate-200 p-4"
							>
								<div className="flex items-center gap-3 mb-4">
									<div className="w-14 h-14 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xl">
										{user.avatar_id ? (
											<img src={`/avatars/${user.avatar_id}.png`} alt="" className="w-full h-full rounded-full object-cover" />
										) : (
											user.name?.[0]?.toUpperCase() || 'U'
										)}
									</div>
									<div className="flex-1">
										<h3 className="font-bold text-slate-800">{user.name || 'Sans nom'}</h3>
										<p className="text-sm text-slate-500">{user.email || 'N/A'}</p>
									</div>
								</div>

								<div className="border-t border-slate-200 pt-4 grid grid-cols-2 gap-3">
									<div>
										<p className="text-xs text-slate-500 mb-1">{t('role')}</p>
										<span className={cn(
											'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold',
											user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
										)}>
											{user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
											{user.role || 'user'}
										</span>
									</div>
									<div>
										<p className="text-xs text-slate-500 mb-1">{t('premium')}</p>
										<span className={cn(
											'inline-flex px-2 py-1 rounded-full text-xs font-semibold',
											user.is_premium ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-slate-100 text-slate-600'
										)}>
											{user.is_premium ? t('premium') : t('free')}
										</span>
									</div>
									<div>
										<p className="text-xs text-slate-500 mb-1">{t('learnedLanguage')}</p>
										{user.spoken_language ? (
											<span className={cn(
												'inline-flex px-2 py-1 rounded-full text-xs font-semibold',
												getLanguageInfo(user.spoken_language).color === 'blue' && 'bg-blue-100 text-blue-700',
												getLanguageInfo(user.spoken_language).color === 'red' && 'bg-red-100 text-red-700',
												getLanguageInfo(user.spoken_language).color === 'emerald' && 'bg-emerald-100 text-emerald-700'
											)}>
												{getLanguageInfo(user.spoken_language).flag} {getLanguageInfo(user.spoken_language).name}
											</span>
										) : (
											<span className="text-xs text-slate-400 italic">{t('notDefined')}</span>
										)}
									</div>
									<div>
										<p className="text-xs text-slate-500 mb-1">{t('level')}</p>
										{user.language_level ? (
											<span className={cn(
												'inline-flex px-2 py-1 rounded-full text-xs font-semibold',
												getLevelInfo(user.language_level).color === 'emerald' && 'bg-emerald-100 text-emerald-700',
												getLevelInfo(user.language_level).color === 'amber' && 'bg-amber-100 text-amber-700',
												getLevelInfo(user.language_level).color === 'red' && 'bg-red-100 text-red-700'
											)}>
												{getLevelInfo(user.language_level).name}
											</span>
										) : (
											<span className="text-xs text-slate-400 italic">{t('notDefined')}</span>
										)}
									</div>
									<div>
										<p className="text-xs text-slate-500 mb-1">{t('totalXP')}</p>
										<span className="inline-flex px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
											{user.total_xp?.toLocaleString() || '0'}
										</span>
									</div>
									<div>
										<p className="text-xs text-slate-500 mb-1">{t('xpLevel')}</p>
										<span className="inline-flex px-2 py-1 rounded-full text-xs font-bold bg-violet-100 text-violet-700">
											Niv. {user.current_level || 1}
										</span>
									</div>
									<div className="col-span-2">
										<p className="text-xs text-slate-500 mb-1">{t('creationDate')}</p>
										<p className="text-sm font-medium text-slate-700">{formatDate(user.created_at)}</p>
									</div>
								</div>
							</div>
						))
					)}
				</div>

				{/* Desktop View - Table */}
				<div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="bg-indigo-50 border-b-2 border-indigo-500">
									<SortableHeader column="name">{t('user')}</SortableHeader>
									<th className="px-6 py-3 text-left text-xs font-bold text-indigo-600 uppercase tracking-wider">{t('email')}</th>
									<SortableHeader column="role">{t('role')}</SortableHeader>
									<SortableHeader column="is_premium">{t('premium')}</SortableHeader>
									<th className="px-6 py-3 text-left text-xs font-bold text-indigo-600 uppercase tracking-wider">{t('learnedLanguage')}</th>
									<SortableHeader column="language_level">{t('level')}</SortableHeader>
									<SortableHeader column="created_at">{t('creationDate')}</SortableHeader>
									<SortableHeader column="total_xp">{t('totalXP')}</SortableHeader>
									<SortableHeader column="current_level">{t('xpLevel')}</SortableHeader>
								</tr>
							</thead>
							<tbody>
								{filteredUsers.length === 0 ? (
									<tr>
										<td colSpan={9} className="px-6 py-16 text-center text-slate-500">
											{t('noUserFound')}
										</td>
									</tr>
								) : (
									filteredUsers.map((user) => (
										<tr
											key={user.id}
											className="hover:bg-indigo-50/30 border-b border-slate-100 transition-colors"
										>
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
														{user.avatar_id ? (
															<img src={`/avatars/${user.avatar_id}.png`} alt="" className="w-full h-full rounded-full object-cover" />
														) : (
															user.name?.[0]?.toUpperCase() || 'U'
														)}
													</div>
													<span className="font-semibold text-slate-800">{user.name || 'Sans nom'}</span>
												</div>
											</td>
											<td className="px-6 py-4 text-sm text-slate-500">{user.email || 'N/A'}</td>
											<td className="px-6 py-4">
												<span className={cn(
													'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize',
													user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
												)}>
													{user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
													{user.role || 'user'}
												</span>
											</td>
											<td className="px-6 py-4">
												<span className={cn(
													'inline-flex px-2.5 py-1 rounded-full text-xs font-semibold',
													user.is_premium ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-slate-100 text-slate-600'
												)}>
													{user.is_premium ? t('premium') : t('free')}
												</span>
											</td>
											<td className="px-6 py-4">
												{user.spoken_language ? (
													<span className={cn(
														'inline-flex px-2.5 py-1 rounded-full text-xs font-semibold',
														getLanguageInfo(user.spoken_language).color === 'blue' && 'bg-blue-100 text-blue-700',
														getLanguageInfo(user.spoken_language).color === 'red' && 'bg-red-100 text-red-700',
														getLanguageInfo(user.spoken_language).color === 'emerald' && 'bg-emerald-100 text-emerald-700'
													)}>
														{getLanguageInfo(user.spoken_language).flag} {getLanguageInfo(user.spoken_language).name}
													</span>
												) : (
													<span className="text-xs text-slate-400 italic">{t('notDefined')}</span>
												)}
											</td>
											<td className="px-6 py-4">
												{user.language_level ? (
													<span className={cn(
														'inline-flex px-2.5 py-1 rounded-full text-xs font-semibold',
														getLevelInfo(user.language_level).color === 'emerald' && 'bg-emerald-100 text-emerald-700',
														getLevelInfo(user.language_level).color === 'amber' && 'bg-amber-100 text-amber-700',
														getLevelInfo(user.language_level).color === 'red' && 'bg-red-100 text-red-700'
													)}>
														{getLevelInfo(user.language_level).name}
													</span>
												) : (
													<span className="text-xs text-slate-400 italic">{t('notDefined')}</span>
												)}
											</td>
											<td className="px-6 py-4 text-sm text-slate-500">{formatDate(user.created_at)}</td>
											<td className="px-6 py-4">
												<span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
													{user.total_xp?.toLocaleString() || '0'}
												</span>
											</td>
											<td className="px-6 py-4">
												<span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-violet-100 text-violet-700">
													Niv. {user.current_level || 1}
												</span>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UsersPage
