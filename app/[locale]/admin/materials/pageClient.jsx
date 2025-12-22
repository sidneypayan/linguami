'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Edit, Library, FileText, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import AdminNavbar from '@/components/admin/AdminNavbar'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { getAllMaterials } from '@/app/actions/admin/materials'

const MaterialsPageClient = () => {
	const router = useRouter()
	const locale = useLocale()
	const [materials, setMaterials] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [selectedLanguage, setSelectedLanguage] = useState('all')
	const [selectedSection, setSelectedSection] = useState('all')

	useEffect(() => {
		const fetchMaterials = async () => {
			try {
				const data = await getAllMaterials()
				setMaterials(data)
			} catch (error) {
				console.error('Error fetching materials:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchMaterials()
	}, [])

	// Filter materials
	const filteredMaterials = materials.filter(m => {
		if (selectedLanguage !== 'all' && m.lang !== selectedLanguage) return false
		if (selectedSection !== 'all' && m.section !== selectedSection) return false
		return true
	})

	// Get unique sections
	const sections = [...new Set(materials.map(m => m.section))].filter(Boolean).sort()

	// Calculate stats
	const stats = {
		total: materials.length,
		fr: materials.filter(m => m.lang === 'fr').length,
		ru: materials.filter(m => m.lang === 'ru').length,
		en: materials.filter(m => m.lang === 'en').length,
	}

	if (isLoading) return <LoadingSpinner />

	return (
		<>
			<AdminNavbar activePage="materials" />

			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
				<div className="max-w-7xl mx-auto px-4 pt-8 md:pt-16 pb-12">
					{/* Header */}
					<div className="mb-8">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-3">
								<div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
									<Library className="w-6 h-6 text-white" />
								</div>
								<div>
									<h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
										Learning Materials
									</h1>
									<p className="text-slate-500 text-sm">Manage learning materials and exercises</p>
								</div>
							</div>

							{/* Filters */}
							<div className="flex items-center gap-2">
								{/* Language Filter */}
								<div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1.5 shadow-sm">
									<button
										onClick={() => setSelectedLanguage('all')}
										className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all duration-200 ${
											selectedLanguage === 'all'
												? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm'
												: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
										}`}
									>
										All
									</button>
									<button
										onClick={() => setSelectedLanguage('fr')}
										className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all duration-200 ${
											selectedLanguage === 'fr'
												? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm'
												: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
										}`}
									>
										FR
									</button>
									<button
										onClick={() => setSelectedLanguage('ru')}
										className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all duration-200 ${
											selectedLanguage === 'ru'
												? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm'
												: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
										}`}
									>
										RU
									</button>
									<button
										onClick={() => setSelectedLanguage('en')}
										className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all duration-200 ${
											selectedLanguage === 'en'
												? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm'
												: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
										}`}
									>
										EN
									</button>
								</div>

								{/* Section Filter */}
								{sections.length > 0 && (
									<select
										value={selectedSection}
										onChange={(e) => setSelectedSection(e.target.value)}
										className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
									>
										<option value="all">All Sections</option>
										{sections.map(section => (
											<option key={section} value={section}>{section}</option>
										))}
									</select>
								)}
							</div>
						</div>

						{/* Stats Cards */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
							<div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-slate-500 font-medium">Total Materials</p>
										<p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
									</div>
									<div className="p-3 bg-slate-100 rounded-lg">
										<FileText className="w-6 h-6 text-slate-600" />
									</div>
								</div>
							</div>

							<div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-slate-500 font-medium">French</p>
										<p className="text-2xl font-bold text-blue-600 mt-1">{stats.fr}</p>
									</div>
									<div className="p-3 bg-blue-100 rounded-lg">
										<BookOpen className="w-6 h-6 text-blue-600" />
									</div>
								</div>
							</div>

							<div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-slate-500 font-medium">Russian</p>
										<p className="text-2xl font-bold text-red-600 mt-1">{stats.ru}</p>
									</div>
									<div className="p-3 bg-red-100 rounded-lg">
										<BookOpen className="w-6 h-6 text-red-600" />
									</div>
								</div>
							</div>

							<div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-slate-500 font-medium">English</p>
										<p className="text-2xl font-bold text-emerald-600 mt-1">{stats.en}</p>
									</div>
									<div className="p-3 bg-emerald-100 rounded-lg">
										<BookOpen className="w-6 h-6 text-emerald-600" />
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Materials List */}
					<div className="space-y-3">
						{filteredMaterials.map(material => (
							<div
								key={material.id}
								className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
							>
								<div className="p-5">
									<div className="flex items-start justify-between gap-4">
										<div className="flex items-start gap-3 flex-1 min-w-0">
											<div className="p-2 bg-blue-100 rounded-lg flex-shrink-0 mt-0.5">
												<FileText className="w-5 h-5 text-blue-600" />
											</div>

											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 flex-wrap mb-2">
													<h3 className="font-semibold text-slate-900 text-lg">
														{material.title}
													</h3>
													<Badge
														variant="outline"
														className="font-medium bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0"
													>
														{material.lang?.toUpperCase() || 'N/A'}
													</Badge>
													{material.section && (
														<Badge variant="outline" className="text-slate-600">
															{material.section}
														</Badge>
													)}
													{material.level && (
														<Badge className="bg-purple-100 text-purple-700">
															{material.level.toUpperCase()}
														</Badge>
													)}
												</div>

												<div className="flex items-center gap-4 text-sm text-slate-500">
													<span>ID: {material.id}</span>
													<span className="text-slate-300">•</span>
													<span className={material.exercise_count > 0 ? 'text-indigo-600 font-medium' : ''}>
														{material.exercise_count || 0} exercise{material.exercise_count !== 1 ? 's' : ''}
													</span>
													{material.image_filename && (
														<>
															<span className="text-slate-300">•</span>
															<span className="text-emerald-600">Image</span>
														</>
													)}
													{material.audio_filename && (
														<>
															<span className="text-slate-300">•</span>
															<span className="text-blue-600">Audio</span>
														</>
													)}
													{material.video_url && (
														<>
															<span className="text-slate-300">•</span>
															<span className="text-purple-600">Video</span>
														</>
													)}
												</div>
											</div>
										</div>

										<Button
											size="sm"
											onClick={() => router.push(`/${locale}/admin/materials/${material.id}`)}
											className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-white border-0 shadow-sm flex-shrink-0"
										>
											<Edit className="w-4 h-4 mr-1.5" />
											Edit
										</Button>
									</div>
								</div>
							</div>
						))}
					</div>

					{filteredMaterials.length === 0 && (
						<div className="text-center py-12">
							<FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
							<p className="text-slate-500">No materials found</p>
						</div>
					)}
				</div>
			</div>
		</>
	)
}

export default MaterialsPageClient
