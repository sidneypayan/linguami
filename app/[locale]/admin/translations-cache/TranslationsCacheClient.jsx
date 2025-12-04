'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import {
	Search,
	Trash2,
	Edit2,
	Plus,
	ChevronLeft,
	ChevronRight,
	X,
	Loader2,
	Database,
	TrendingUp,
	Languages,
	ArrowUpDown,
	Check,
	Filter
} from 'lucide-react'
import AdminNavbar from '@/components/admin/AdminNavbar'
import { cn } from '@/lib/utils'
import {
	getTranslationsCacheAction,
	getTranslationsCacheStatsAction,
	updateTranslationCacheAction,
	deleteTranslationCacheAction,
	deleteMultipleTranslationCacheAction,
	addTranslationCacheAction
} from '@/app/actions/translations-cache'

const LANGUAGES = [
	{ code: 'ru', name: 'Russe', flag: '🇷🇺' },
	{ code: 'fr', name: 'Francais', flag: '🇫🇷' },
	{ code: 'en', name: 'Anglais', flag: '🇬🇧' },
	{ code: 'it', name: 'Italien', flag: '🇮🇹' },
]

const TranslationsCacheClient = () => {
	const t = useTranslations('admin')

	// Data state
	const [translations, setTranslations] = useState([])
	const [stats, setStats] = useState(null)
	const [loading, setLoading] = useState(true)
	const [statsLoading, setStatsLoading] = useState(true)

	// Pagination
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [totalCount, setTotalCount] = useState(0)

	// Filters
	const [search, setSearch] = useState('')
	const [searchInput, setSearchInput] = useState('')
	const [sourceLang, setSourceLang] = useState('')
	const [targetLang, setTargetLang] = useState('')
	const [sortBy, setSortBy] = useState('usage_count')
	const [sortOrder, setSortOrder] = useState('desc')

	// Selection
	const [selectedIds, setSelectedIds] = useState([])

	// Modals
	const [editModal, setEditModal] = useState({ open: false, translation: null })
	const [addModal, setAddModal] = useState(false)
	const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null, multiple: false })

	// Form state for add/edit
	const [formData, setFormData] = useState({
		searched_form: '',
		lemma: '',
		source_lang: 'ru',
		target_lang: 'fr',
		part_of_speech: '',
		translations: ''
	})
	const [saving, setSaving] = useState(false)

	// Fetch translations
	const fetchTranslations = useCallback(async () => {
		setLoading(true)
		const result = await getTranslationsCacheAction({
			page,
			limit: 50,
			search,
			sourceLang,
			targetLang,
			sortBy,
			sortOrder
		})

		if (result.success) {
			setTranslations(result.data)
			setTotalPages(result.totalPages)
			setTotalCount(result.totalCount)
		}
		setLoading(false)
	}, [page, search, sourceLang, targetLang, sortBy, sortOrder])

	// Fetch stats
	const fetchStats = async () => {
		setStatsLoading(true)
		const result = await getTranslationsCacheStatsAction()
		if (result.success) {
			setStats(result.stats)
		}
		setStatsLoading(false)
	}

	useEffect(() => {
		fetchTranslations()
	}, [fetchTranslations])

	useEffect(() => {
		fetchStats()
	}, [])

	// Search handler with debounce
	const handleSearch = () => {
		setSearch(searchInput)
		setPage(1)
	}

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleSearch()
		}
	}

	// Sort handler
	const handleSort = (field) => {
		if (sortBy === field) {
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
		} else {
			setSortBy(field)
			setSortOrder('desc')
		}
		setPage(1)
	}

	// Selection handlers
	const toggleSelectAll = () => {
		if (selectedIds.length === translations.length) {
			setSelectedIds([])
		} else {
			setSelectedIds(translations.map(t => t.id))
		}
	}

	const toggleSelect = (id) => {
		setSelectedIds(prev =>
			prev.includes(id)
				? prev.filter(i => i !== id)
				: [...prev, id]
		)
	}

	// Delete handlers
	const handleDelete = async () => {
		setSaving(true)
		let result
		if (deleteConfirm.multiple) {
			result = await deleteMultipleTranslationCacheAction(selectedIds)
		} else {
			result = await deleteTranslationCacheAction(deleteConfirm.id)
		}

		if (result.success) {
			setDeleteConfirm({ open: false, id: null, multiple: false })
			setSelectedIds([])
			fetchTranslations()
			fetchStats()
		}
		setSaving(false)
	}

	// Edit handlers
	const openEditModal = (translation) => {
		setFormData({
			searched_form: translation.searched_form,
			lemma: translation.lemma,
			source_lang: translation.source_lang,
			target_lang: translation.target_lang,
			part_of_speech: translation.part_of_speech || '',
			translations: Array.isArray(translation.translations)
				? translation.translations.join(', ')
				: ''
		})
		setEditModal({ open: true, translation })
	}

	const handleUpdate = async () => {
		setSaving(true)
		const result = await updateTranslationCacheAction(editModal.translation.id, {
			searched_form: formData.searched_form.toLowerCase().trim(),
			lemma: formData.lemma.toLowerCase().trim(),
			part_of_speech: formData.part_of_speech || null,
			translations: formData.translations.split(',').map(t => t.trim()).filter(Boolean)
		})

		if (result.success) {
			setEditModal({ open: false, translation: null })
			fetchTranslations()
		}
		setSaving(false)
	}

	// Add handlers
	const openAddModal = () => {
		setFormData({
			searched_form: '',
			lemma: '',
			source_lang: 'ru',
			target_lang: 'fr',
			part_of_speech: '',
			translations: ''
		})
		setAddModal(true)
	}

	const handleAdd = async () => {
		setSaving(true)
		const result = await addTranslationCacheAction({
			searchedForm: formData.searched_form,
			lemma: formData.lemma,
			sourceLang: formData.source_lang,
			targetLang: formData.target_lang,
			partOfSpeech: formData.part_of_speech,
			translations: formData.translations.split(',').map(t => t.trim()).filter(Boolean)
		})

		if (result.success) {
			setAddModal(false)
			fetchTranslations()
			fetchStats()
		}
		setSaving(false)
	}

	const getLangInfo = (code) => LANGUAGES.find(l => l.code === code) || { code, name: code, flag: '' }

	return (
		<div className="min-h-screen bg-slate-50 pt-16">
			<AdminNavbar activePage="translations" />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Stats Cards */}
				{!statsLoading && stats && (
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
						<div className="bg-white rounded-xl border border-slate-200 p-4">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
									<Database className="w-5 h-5 text-indigo-600" />
								</div>
								<div>
									<p className="text-2xl font-bold text-slate-800">{stats.totalCount}</p>
									<p className="text-xs text-slate-500">Entrees en cache</p>
								</div>
							</div>
						</div>
						<div className="bg-white rounded-xl border border-slate-200 p-4">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
									<TrendingUp className="w-5 h-5 text-emerald-600" />
								</div>
								<div>
									<p className="text-2xl font-bold text-slate-800">{stats.totalUsage}</p>
									<p className="text-xs text-slate-500">Utilisations totales</p>
								</div>
							</div>
						</div>
						<div className="bg-white rounded-xl border border-slate-200 p-4">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
									<Languages className="w-5 h-5 text-blue-600" />
								</div>
								<div>
									<p className="text-sm font-bold text-slate-800">
										{Object.entries(stats.bySourceLang).map(([lang, count]) => (
											<span key={lang} className="mr-2">{getLangInfo(lang).flag} {count}</span>
										))}
									</p>
									<p className="text-xs text-slate-500">Par langue source</p>
								</div>
							</div>
						</div>
						<div className="bg-white rounded-xl border border-slate-200 p-4">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
									<Languages className="w-5 h-5 text-amber-600" />
								</div>
								<div>
									<p className="text-sm font-bold text-slate-800">
										{Object.entries(stats.byTargetLang).map(([lang, count]) => (
											<span key={lang} className="mr-2">{getLangInfo(lang).flag} {count}</span>
										))}
									</p>
									<p className="text-xs text-slate-500">Par langue cible</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Filters */}
				<div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
					<div className="flex flex-wrap gap-4 items-center">
						{/* Search */}
						<div className="flex-1 min-w-[200px]">
							<div className="relative">
								<input
									type="text"
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
									onKeyPress={handleKeyPress}
									placeholder="Rechercher un mot..."
									className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
								/>
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
							</div>
						</div>

						{/* Source language filter */}
						<select
							value={sourceLang}
							onChange={(e) => { setSourceLang(e.target.value); setPage(1) }}
							className="px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
						>
							<option value="">Toutes sources</option>
							{LANGUAGES.map(lang => (
								<option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
							))}
						</select>

						{/* Target language filter */}
						<select
							value={targetLang}
							onChange={(e) => { setTargetLang(e.target.value); setPage(1) }}
							className="px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
						>
							<option value="">Toutes cibles</option>
							{LANGUAGES.map(lang => (
								<option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
							))}
						</select>

						{/* Search button */}
						<button
							onClick={handleSearch}
							className="px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
						>
							<Search className="w-4 h-4" />
						</button>

						{/* Clear filters */}
						{(search || sourceLang || targetLang) && (
							<button
								onClick={() => {
									setSearch('')
									setSearchInput('')
									setSourceLang('')
									setTargetLang('')
									setPage(1)
								}}
								className="px-3 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
							>
								<X className="w-4 h-4" />
							</button>
						)}

						{/* Add button */}
						<button
							onClick={openAddModal}
							className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors ml-auto"
						>
							<Plus className="w-4 h-4" />
							<span className="hidden sm:inline">Ajouter</span>
						</button>
					</div>

					{/* Bulk actions */}
					{selectedIds.length > 0 && (
						<div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-4">
							<span className="text-sm text-slate-600">
								{selectedIds.length} selectionne(s)
							</span>
							<button
								onClick={() => setDeleteConfirm({ open: true, id: null, multiple: true })}
								className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
							>
								<Trash2 className="w-4 h-4" />
								Supprimer
							</button>
						</div>
					)}
				</div>

				{/* Table */}
				<div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-slate-200 bg-slate-50">
									<th className="px-4 py-3 text-left">
										<input
											type="checkbox"
											checked={selectedIds.length === translations.length && translations.length > 0}
											onChange={toggleSelectAll}
											className="rounded border-slate-300"
										/>
									</th>
									<th
										className="px-4 py-3 text-left font-semibold text-slate-600 cursor-pointer hover:text-indigo-600"
										onClick={() => handleSort('searched_form')}
									>
										<div className="flex items-center gap-1">
											Forme recherchee
											<ArrowUpDown className="w-3 h-3" />
										</div>
									</th>
									<th
										className="px-4 py-3 text-left font-semibold text-slate-600 cursor-pointer hover:text-indigo-600"
										onClick={() => handleSort('lemma')}
									>
										<div className="flex items-center gap-1">
											Lemme
											<ArrowUpDown className="w-3 h-3" />
										</div>
									</th>
									<th className="px-4 py-3 text-left font-semibold text-slate-600">Langues</th>
									<th className="px-4 py-3 text-left font-semibold text-slate-600">Traductions</th>
									<th
										className="px-4 py-3 text-center font-semibold text-slate-600 cursor-pointer hover:text-indigo-600"
										onClick={() => handleSort('usage_count')}
									>
										<div className="flex items-center justify-center gap-1">
											Usages
											<ArrowUpDown className="w-3 h-3" />
										</div>
									</th>
									<th className="px-4 py-3 text-right font-semibold text-slate-600">Actions</th>
								</tr>
							</thead>
							<tbody>
								{loading ? (
									<tr>
										<td colSpan={7} className="px-4 py-12 text-center">
											<Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
										</td>
									</tr>
								) : translations.length === 0 ? (
									<tr>
										<td colSpan={7} className="px-4 py-12 text-center text-slate-500">
											Aucune traduction trouvee
										</td>
									</tr>
								) : (
									translations.map(translation => (
										<tr key={translation.id} className="border-b border-slate-100 hover:bg-slate-50">
											<td className="px-4 py-3">
												<input
													type="checkbox"
													checked={selectedIds.includes(translation.id)}
													onChange={() => toggleSelect(translation.id)}
													className="rounded border-slate-300"
												/>
											</td>
											<td className="px-4 py-3 font-medium text-slate-800">
												{translation.searched_form}
											</td>
											<td className="px-4 py-3 text-slate-600">
												{translation.lemma}
												{translation.part_of_speech && (
													<span className="ml-2 px-1.5 py-0.5 text-xs bg-slate-100 text-slate-500 rounded">
														{translation.part_of_speech}
													</span>
												)}
											</td>
											<td className="px-4 py-3">
												<span className="text-lg">{getLangInfo(translation.source_lang).flag}</span>
												<span className="mx-1 text-slate-400">→</span>
												<span className="text-lg">{getLangInfo(translation.target_lang).flag}</span>
											</td>
											<td className="px-4 py-3 text-slate-600 max-w-[200px] truncate">
												{Array.isArray(translation.translations)
													? translation.translations.slice(0, 3).join(', ')
													: '-'}
												{Array.isArray(translation.translations) && translation.translations.length > 3 && (
													<span className="text-slate-400"> +{translation.translations.length - 3}</span>
												)}
											</td>
											<td className="px-4 py-3 text-center">
												<span className={cn(
													'px-2 py-1 rounded-full text-xs font-semibold',
													translation.usage_count > 10
														? 'bg-emerald-100 text-emerald-700'
														: translation.usage_count > 0
															? 'bg-blue-100 text-blue-700'
															: 'bg-slate-100 text-slate-500'
												)}>
													{translation.usage_count}
												</span>
											</td>
											<td className="px-4 py-3 text-right">
												<div className="flex items-center justify-end gap-1">
													<button
														onClick={() => openEditModal(translation)}
														className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
													>
														<Edit2 className="w-4 h-4" />
													</button>
													<button
														onClick={() => setDeleteConfirm({ open: true, id: translation.id, multiple: false })}
														className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
													>
														<Trash2 className="w-4 h-4" />
													</button>
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
							<span className="text-sm text-slate-500">
								{totalCount} entree(s) au total
							</span>
							<div className="flex items-center gap-2">
								<button
									onClick={() => setPage(p => Math.max(1, p - 1))}
									disabled={page === 1}
									className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									<ChevronLeft className="w-4 h-4" />
								</button>
								<span className="text-sm text-slate-600">
									Page {page} / {totalPages}
								</span>
								<button
									onClick={() => setPage(p => Math.min(totalPages, p + 1))}
									disabled={page === totalPages}
									className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									<ChevronRight className="w-4 h-4" />
								</button>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Edit Modal */}
			{editModal.open && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl max-w-lg w-full">
						<div className="p-6 border-b border-slate-200 flex items-center justify-between">
							<h3 className="text-lg font-bold text-slate-800">Modifier la traduction</h3>
							<button onClick={() => setEditModal({ open: false, translation: null })} className="p-2 hover:bg-slate-100 rounded-lg">
								<X className="w-5 h-5 text-slate-500" />
							</button>
						</div>
						<div className="p-6 space-y-4">
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1">Forme recherchee</label>
								<input
									type="text"
									value={formData.searched_form}
									onChange={(e) => setFormData(prev => ({ ...prev, searched_form: e.target.value }))}
									className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1">Lemme</label>
								<input
									type="text"
									value={formData.lemma}
									onChange={(e) => setFormData(prev => ({ ...prev, lemma: e.target.value }))}
									className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1">Type de mot</label>
								<input
									type="text"
									value={formData.part_of_speech}
									onChange={(e) => setFormData(prev => ({ ...prev, part_of_speech: e.target.value }))}
									placeholder="verb, noun, adjective..."
									className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1">Traductions (separees par des virgules)</label>
								<input
									type="text"
									value={formData.translations}
									onChange={(e) => setFormData(prev => ({ ...prev, translations: e.target.value }))}
									placeholder="parler, dire, raconter"
									className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
								/>
							</div>
						</div>
						<div className="p-6 border-t border-slate-200 flex justify-end gap-3">
							<button
								onClick={() => setEditModal({ open: false, translation: null })}
								className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition-colors"
							>
								Annuler
							</button>
							<button
								onClick={handleUpdate}
								disabled={saving}
								className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 transition-colors"
							>
								{saving && <Loader2 className="w-4 h-4 animate-spin" />}
								Enregistrer
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Add Modal */}
			{addModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl max-w-lg w-full">
						<div className="p-6 border-b border-slate-200 flex items-center justify-between">
							<h3 className="text-lg font-bold text-slate-800">Ajouter une traduction</h3>
							<button onClick={() => setAddModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
								<X className="w-5 h-5 text-slate-500" />
							</button>
						</div>
						<div className="p-6 space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-slate-700 mb-1">Langue source</label>
									<select
										value={formData.source_lang}
										onChange={(e) => setFormData(prev => ({ ...prev, source_lang: e.target.value }))}
										className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
									>
										{LANGUAGES.map(lang => (
											<option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
										))}
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-slate-700 mb-1">Langue cible</label>
									<select
										value={formData.target_lang}
										onChange={(e) => setFormData(prev => ({ ...prev, target_lang: e.target.value }))}
										className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
									>
										{LANGUAGES.map(lang => (
											<option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
										))}
									</select>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1">Forme recherchee</label>
								<input
									type="text"
									value={formData.searched_form}
									onChange={(e) => setFormData(prev => ({ ...prev, searched_form: e.target.value }))}
									placeholder="говорил"
									className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1">Lemme</label>
								<input
									type="text"
									value={formData.lemma}
									onChange={(e) => setFormData(prev => ({ ...prev, lemma: e.target.value }))}
									placeholder="говорить"
									className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1">Type de mot</label>
								<input
									type="text"
									value={formData.part_of_speech}
									onChange={(e) => setFormData(prev => ({ ...prev, part_of_speech: e.target.value }))}
									placeholder="verb, noun, adjective..."
									className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1">Traductions (separees par des virgules)</label>
								<input
									type="text"
									value={formData.translations}
									onChange={(e) => setFormData(prev => ({ ...prev, translations: e.target.value }))}
									placeholder="parler, dire, raconter"
									className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
								/>
							</div>
						</div>
						<div className="p-6 border-t border-slate-200 flex justify-end gap-3">
							<button
								onClick={() => setAddModal(false)}
								className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition-colors"
							>
								Annuler
							</button>
							<button
								onClick={handleAdd}
								disabled={saving || !formData.searched_form || !formData.lemma || !formData.translations}
								className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 transition-colors"
							>
								{saving && <Loader2 className="w-4 h-4 animate-spin" />}
								Ajouter
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{deleteConfirm.open && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl max-w-md w-full p-6">
						<h3 className="text-lg font-bold text-slate-800 mb-2">Confirmer la suppression</h3>
						<p className="text-slate-600 mb-6">
							{deleteConfirm.multiple
								? `Voulez-vous vraiment supprimer ${selectedIds.length} traduction(s) ?`
								: 'Voulez-vous vraiment supprimer cette traduction ?'}
						</p>
						<div className="flex justify-end gap-3">
							<button
								onClick={() => setDeleteConfirm({ open: false, id: null, multiple: false })}
								className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition-colors"
							>
								Annuler
							</button>
							<button
								onClick={handleDelete}
								disabled={saving}
								className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-slate-300 transition-colors"
							>
								{saving && <Loader2 className="w-4 h-4 animate-spin" />}
								Supprimer
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default TranslationsCacheClient
