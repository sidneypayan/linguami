'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import {
	Plus,
	Edit,
	Trash2,
	Eye,
	Search,
	SlidersHorizontal,
	ArrowUp,
	ArrowDown,
	X,
} from 'lucide-react'
import { useUserContext } from '@/context/user'
import { createBrowserClient } from '@/lib/supabase'
import toast from '@/utils/toast'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import AdminNavbar from '@/components/admin/AdminNavbar'
import { logger } from '@/utils/logger'

// Sortable table header component
const SortableHeader = ({ label, sortKey, currentSort, currentOrder, onSort }) => {
	const isActive = currentSort === sortKey
	return (
		<button
			onClick={() => onSort(sortKey)}
			className="flex items-center gap-1 font-bold text-slate-700 hover:text-indigo-600 transition-colors"
		>
			{label}
			{isActive && (
				currentOrder === 'asc' ? (
					<ArrowUp className="w-4 h-4" />
				) : (
					<ArrowDown className="w-4 h-4" />
				)
			)}
		</button>
	)
}

// Badge component
const Badge = ({ children, variant = 'default', size = 'sm' }) => {
	const variants = {
		default: 'bg-slate-100 text-slate-700',
		primary: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
		success: 'bg-emerald-100 text-emerald-700',
		warning: 'bg-amber-100 text-amber-700',
		error: 'bg-red-100 text-red-700',
		secondary: 'bg-purple-100 text-purple-700',
	}

	const sizes = {
		sm: 'px-2 py-0.5 text-xs',
		md: 'px-3 py-1 text-sm',
	}

	return (
		<span className={cn('rounded-full font-medium', variants[variant], sizes[size])}>
			{children}
		</span>
	)
}

const ExercisesAdmin = () => {
	const router = useRouter()
	const locale = useLocale()
	const t = useTranslations('exercises')
	const { isUserAdmin, isBootstrapping } = useUserContext()
	const supabase = createBrowserClient()

	const [exercises, setExercises] = useState([])
	const [loading, setLoading] = useState(true)

	// Filters and sorting
	const [searchQuery, setSearchQuery] = useState('')
	const [typeFilter, setTypeFilter] = useState('all')
	const [levelFilter, setLevelFilter] = useState('all')
	const [langFilter, setLangFilter] = useState('all')
	const [materialFilter, setMaterialFilter] = useState('all')
	const [sectionFilter, setSectionFilter] = useState('all')
	const [orderBy, setOrderBy] = useState('created_at')
	const [order, setOrder] = useState('desc')

	// Load exercises
	useEffect(() => {
		const loadExercises = async () => {
			setLoading(true)
			const { data, error } = await supabase
				.from('exercises')
				.select(`
					*,
					materials (
						id,
						title,
						section
					)
				`)
				.order('created_at', { ascending: false })

			if (error) {
				logger.error('Error loading exercises:', error)
				toast.error(t('loadError'))
			} else {
				setExercises(data || [])
			}
			setLoading(false)
		}

		if (isUserAdmin) {
			loadExercises()
		}
	}, [isUserAdmin])

	// Redirect if not admin
	useEffect(() => {
		if (!isBootstrapping && !isUserAdmin) {
			router.push(`/${locale}`)
		}
	}, [isUserAdmin, isBootstrapping, router, locale])

	// Delete exercise
	const handleDelete = async (id) => {
		if (!confirm(t('deleteConfirm'))) return

		const { error } = await supabase
			.from('exercises')
			.delete()
			.eq('id', id)

		if (error) {
			logger.error('Error deleting exercise:', error)
			toast.error(t('deleteError'))
		} else {
			toast.success(t('deleteSuccess'))
			setExercises(exercises.filter(e => e.id !== id))
		}
	}

	// Get level badge variant
	const getLevelVariant = (level) => {
		switch (level) {
			case 'beginner': return 'success'
			case 'intermediate': return 'warning'
			case 'advanced': return 'error'
			default: return 'default'
		}
	}

	// Get unique sections from exercises
	const uniqueSections = useMemo(() => {
		const sections = exercises
			.filter(ex => ex.materials?.section)
			.map(ex => ex.materials.section)
		return [...new Set(sections)].sort()
	}, [exercises])

	// Filter and sort exercises
	const filteredAndSortedExercises = useMemo(() => {
		let filtered = exercises.filter(exercise => {
			// Search filter - searches in material title and IDs
			if (searchQuery) {
				const query = searchQuery.toLowerCase()
				const materialTitle = exercise.materials?.title?.toLowerCase() || ''
				const exerciseId = exercise.id.toString()
				const materialId = exercise.materials?.id?.toString() || ''

				const matchesSearch =
					materialTitle.includes(query) ||
					exerciseId.includes(query) ||
					materialId.includes(query)

				if (!matchesSearch) {
					return false
				}
			}

			// Type filter
			if (typeFilter !== 'all' && exercise.type !== typeFilter) {
				return false
			}

			// Level filter
			if (levelFilter !== 'all' && exercise.level !== levelFilter) {
				return false
			}

			// Language filter
			if (langFilter !== 'all' && exercise.lang !== langFilter) {
				return false
			}

			// Material filter
			if (materialFilter === 'linked' && !exercise.materials) {
				return false
			}
			if (materialFilter === 'unlinked' && exercise.materials) {
				return false
			}

			// Section filter
			if (sectionFilter !== 'all' && exercise.materials?.section !== sectionFilter) {
				return false
			}

			return true
		})

		// Sort
		filtered.sort((a, b) => {
			let aValue, bValue

			switch (orderBy) {
				case 'id':
					aValue = a.id
					bValue = b.id
					break
				case 'title':
					aValue = a.title.toLowerCase()
					bValue = b.title.toLowerCase()
					break
				case 'type':
					aValue = a.type
					bValue = b.type
					break
				case 'level':
					const levelOrder = { beginner: 1, intermediate: 2, advanced: 3 }
					aValue = levelOrder[a.level] || 0
					bValue = levelOrder[b.level] || 0
					break
				case 'lang':
					aValue = a.lang
					bValue = b.lang
					break
				case 'questions':
					aValue = a.data?.questions?.length || 0
					bValue = b.data?.questions?.length || 0
					break
				case 'xp':
					aValue = a.xp_reward
					bValue = b.xp_reward
					break
				case 'created_at':
				default:
					aValue = new Date(a.created_at)
					bValue = new Date(b.created_at)
					break
			}

			if (aValue < bValue) return order === 'asc' ? -1 : 1
			if (aValue > bValue) return order === 'asc' ? 1 : -1
			return 0
		})

		return filtered
	}, [exercises, searchQuery, typeFilter, levelFilter, langFilter, materialFilter, sectionFilter, orderBy, order])

	// Handle sort request
	const handleRequestSort = (property) => {
		const isAsc = orderBy === property && order === 'asc'
		setOrder(isAsc ? 'desc' : 'asc')
		setOrderBy(property)
	}

	// Reset all filters
	const handleResetFilters = () => {
		setSearchQuery('')
		setTypeFilter('all')
		setLevelFilter('all')
		setLangFilter('all')
		setMaterialFilter('all')
		setSectionFilter('all')
		setOrderBy('created_at')
		setOrder('desc')
	}

	// Show nothing while bootstrapping
	if (isBootstrapping) {
		return null
	}

	// Redirect happened or not admin
	if (!isUserAdmin) {
		return null
	}

	if (loading) {
		return <LoadingSpinner />
	}

	return (
		<>
			<AdminNavbar activePage="exercises" />

			<div className="max-w-7xl mx-auto px-4 pt-8 md:pt-16 pb-8">
				{/* Header */}
				<div className="flex flex-wrap justify-between items-center gap-4 mb-6">
					<h1 className="text-2xl font-bold text-slate-800">
						{t('title')} ({filteredAndSortedExercises.length})
					</h1>
					<div className="flex flex-wrap gap-2">
						<button
							onClick={() => router.push(`/${locale}/admin/exercises/create-fitb`)}
							className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
						>
							<Plus className="w-4 h-4" />
							{t('createFillInBlank')}
						</button>
						<button
							onClick={() => router.push(`/${locale}/admin/exercises/create-mcq`)}
							className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
						>
							<Plus className="w-4 h-4" />
							{t('createMCQ')}
						</button>
						<button
							onClick={() => router.push(`/${locale}/admin/exercises/create-drag-drop`)}
							className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-red-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
						>
							<Plus className="w-4 h-4" />
							Drag & Drop
						</button>
					</div>
				</div>

				{/* Filters Section */}
				<div className="bg-white rounded-xl border border-indigo-100 p-4 mb-6">
					<div className="flex items-center gap-2 mb-4">
						<SlidersHorizontal className="w-5 h-5 text-indigo-500" />
						<h2 className="font-semibold text-slate-700">Filtres et recherche</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
						{/* Search */}
						<div className="lg:col-span-2">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
								<input
									type="text"
									placeholder="Rechercher par titre ou ID..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
								/>
							</div>
						</div>

						{/* Type Filter */}
						<select
							value={typeFilter}
							onChange={(e) => setTypeFilter(e.target.value)}
							className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
						>
							<option value="all">Tous types</option>
							<option value="mcq">QCM</option>
							<option value="fill_in_blank">Texte à trous</option>
							<option value="drag_and_drop">Glisser-déposer</option>
						</select>

						{/* Level Filter */}
						<select
							value={levelFilter}
							onChange={(e) => setLevelFilter(e.target.value)}
							className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
						>
							<option value="all">Tous niveaux</option>
							<option value="beginner">Débutant</option>
							<option value="intermediate">Intermédiaire</option>
							<option value="advanced">Avancé</option>
						</select>

						{/* Language Filter */}
						<select
							value={langFilter}
							onChange={(e) => setLangFilter(e.target.value)}
							className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
						>
							<option value="all">Toutes langues</option>
							<option value="fr">FR</option>
							<option value="ru">RU</option>
							<option value="en">EN</option>
						</select>

						{/* Material Filter */}
						<select
							value={materialFilter}
							onChange={(e) => setMaterialFilter(e.target.value)}
							className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
						>
							<option value="all">Tous matériaux</option>
							<option value="linked">Liés</option>
							<option value="unlinked">Non liés</option>
						</select>
					</div>

					{/* Section Filter + Reset */}
					<div className="flex flex-wrap items-center gap-3 mt-3">
						<select
							value={sectionFilter}
							onChange={(e) => setSectionFilter(e.target.value)}
							className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
						>
							<option value="all">Toutes sections</option>
							{uniqueSections.map(section => (
								<option key={section} value={section}>{section}</option>
							))}
						</select>

						<button
							onClick={handleResetFilters}
							className="flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
						>
							<X className="w-4 h-4" />
							Réinitialiser
						</button>
					</div>
				</div>

				{/* Table */}
				{exercises.length === 0 ? (
					<div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-700">
						{t('noExercises')}
					</div>
				) : (
					<div className="bg-white rounded-xl border border-indigo-100 overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="bg-indigo-50/50 border-b border-indigo-100">
										<th className="px-4 py-3 text-left">
											<SortableHeader
												label={t('id')}
												sortKey="id"
												currentSort={orderBy}
												currentOrder={order}
												onSort={handleRequestSort}
											/>
										</th>
										<th className="px-4 py-3 text-left">
											<SortableHeader
												label={t('exerciseTitle')}
												sortKey="title"
												currentSort={orderBy}
												currentOrder={order}
												onSort={handleRequestSort}
											/>
										</th>
										<th className="px-4 py-3 text-left">
											<SortableHeader
												label={t('type')}
												sortKey="type"
												currentSort={orderBy}
												currentOrder={order}
												onSort={handleRequestSort}
											/>
										</th>
										<th className="px-4 py-3 text-left">
											<SortableHeader
												label={t('level')}
												sortKey="level"
												currentSort={orderBy}
												currentOrder={order}
												onSort={handleRequestSort}
											/>
										</th>
										<th className="px-4 py-3 text-left">
											<SortableHeader
												label={t('language')}
												sortKey="lang"
												currentSort={orderBy}
												currentOrder={order}
												onSort={handleRequestSort}
											/>
										</th>
										<th className="px-4 py-3 text-left font-bold text-slate-700">
											{t('material')}
										</th>
										<th className="px-4 py-3 text-left">
											<SortableHeader
												label={t('questions')}
												sortKey="questions"
												currentSort={orderBy}
												currentOrder={order}
												onSort={handleRequestSort}
											/>
										</th>
										<th className="px-4 py-3 text-left">
											<SortableHeader
												label={t('xp')}
												sortKey="xp"
												currentSort={orderBy}
												currentOrder={order}
												onSort={handleRequestSort}
											/>
										</th>
										<th className="px-4 py-3 text-right font-bold text-slate-700">
											{t('actions')}
										</th>
									</tr>
								</thead>
								<tbody>
									{filteredAndSortedExercises.map((exercise) => (
										<tr key={exercise.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
											<td className="px-4 py-3 text-slate-600">#{exercise.id}</td>
											<td className="px-4 py-3">
												<span className="font-semibold text-slate-800">
													{exercise.title}
												</span>
											</td>
											<td className="px-4 py-3">
												<Badge variant="primary">
													{exercise.type === 'fill_in_blank' ? t('fillInBlankType') :
													exercise.type === 'mcq' ? t('mcqType') :
													exercise.type === 'drag_and_drop' ? t('dragDropType') :
													exercise.type}
												</Badge>
											</td>
											<td className="px-4 py-3">
												<Badge variant={getLevelVariant(exercise.level)}>
													{t(exercise.level)}
												</Badge>
											</td>
											<td className="px-4 py-3">
												<Badge>{exercise.lang.toUpperCase()}</Badge>
											</td>
											<td className="px-4 py-3">
												{exercise.materials ? (
													<span className="text-sm text-slate-600">
														#{exercise.materials.id} - {exercise.materials.title}
													</span>
												) : (
													<span className="text-sm text-slate-400 italic">
														{t('notLinked')}
													</span>
												)}
											</td>
											<td className="px-4 py-3 text-slate-600">
												{exercise.data?.questions?.length || 0}
											</td>
											<td className="px-4 py-3">
												<Badge variant="secondary">
													+{exercise.xp_reward} XP
												</Badge>
											</td>
											<td className="px-4 py-3">
												<div className="flex justify-end gap-1">
													<button
														onClick={() => router.push(`/${locale}/admin/exercises/preview/${exercise.id}`)}
														className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
														title={t('preview')}
													>
														<Eye className="w-4 h-4" />
													</button>
													<button
														onClick={() => router.push(`/${locale}/admin/exercises/edit/${exercise.id}`)}
														className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
														title={t('edit')}
													>
														<Edit className="w-4 h-4" />
													</button>
													<button
														onClick={() => handleDelete(exercise.id)}
														className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
														title={t('delete')}
													>
														<Trash2 className="w-4 h-4" />
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</>
	)
}

export default ExercisesAdmin
