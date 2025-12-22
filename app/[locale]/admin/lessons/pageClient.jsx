'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Edit, BookOpen, Library, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import AdminNavbar from '@/components/admin/AdminNavbar'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { getAllStandaloneLessons } from '@/app/actions/admin/lessons'

const LessonsPageClient = () => {
	const router = useRouter()
	const locale = useLocale()
	const [lessons, setLessons] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [selectedLanguage, setSelectedLanguage] = useState('all')

	useEffect(() => {
		const fetchLessons = async () => {
			try {
				const data = await getAllStandaloneLessons()
				setLessons(data)
			} catch (error) {
				console.error('Error fetching lessons:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchLessons()
	}, [])

	// Helper to get localized field
	const getLocalizedField = (lesson, fieldPrefix) => {
		const fieldName = `${fieldPrefix}_${locale}`
		return lesson[fieldName] || lesson[`${fieldPrefix}_en`] || lesson[`${fieldPrefix}_fr`]
	}

	// Filter lessons by language
	const filteredLessons = selectedLanguage === 'all'
		? lessons
		: lessons.filter(l => l.target_language === selectedLanguage)

	// Calculate stats
	const stats = {
		total: lessons.length,
		fr: lessons.filter(l => l.target_language === 'fr').length,
		ru: lessons.filter(l => l.target_language === 'ru').length,
	}

	if (isLoading) return <LoadingSpinner />

	return (
		<>
			<AdminNavbar activePage="lessons" />

			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
				<div className="max-w-7xl mx-auto px-4 pt-8 md:pt-16 pb-12">
					{/* Header */}
					<div className="mb-8">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-3">
								<div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
									<FileText className="w-6 h-6 text-white" />
								</div>
								<div>
									<h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
										Standalone Lessons
									</h1>
									<p className="text-slate-500 text-sm">Manage standalone grammar lessons</p>
								</div>
							</div>

							{/* Language Filter */}
							<div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1.5 shadow-sm">
								<button
									onClick={() => setSelectedLanguage('all')}
									className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
										selectedLanguage === 'all'
											? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
											: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
									}`}
								>
									🌐 All
								</button>
								<button
									onClick={() => setSelectedLanguage('ru')}
									className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
										selectedLanguage === 'ru'
											? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
											: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
									}`}
								>
									🇷🇺 Russian
								</button>
								<button
									onClick={() => setSelectedLanguage('fr')}
									className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
										selectedLanguage === 'fr'
											? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
											: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
									}`}
								>
									🇫🇷 French
								</button>
							</div>
						</div>

						{/* Stats Cards */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
							<div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-slate-500 font-medium">Total Lessons</p>
										<p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
									</div>
									<div className="p-3 bg-purple-100 rounded-lg">
										<Library className="w-6 h-6 text-purple-600" />
									</div>
								</div>
							</div>

							<div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-slate-500 font-medium">Russian Lessons</p>
										<p className="text-2xl font-bold text-blue-600 mt-1">{stats.ru}</p>
									</div>
									<div className="p-3 bg-blue-100 rounded-lg">
										<BookOpen className="w-6 h-6 text-blue-600" />
									</div>
								</div>
							</div>

							<div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-slate-500 font-medium">French Lessons</p>
										<p className="text-2xl font-bold text-rose-600 mt-1">{stats.fr}</p>
									</div>
									<div className="p-3 bg-rose-100 rounded-lg">
										<BookOpen className="w-6 h-6 text-rose-600" />
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Lessons List */}
					<div className="space-y-3">
						{filteredLessons.map(lesson => (
							<div
								key={lesson.id}
								className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
							>
								<div className="p-5">
									<div className="flex items-start justify-between gap-4">
										<div className="flex items-start gap-3 flex-1 min-w-0">
											<div className="p-2 bg-purple-100 rounded-lg flex-shrink-0 mt-0.5">
												<FileText className="w-5 h-5 text-purple-600" />
											</div>

											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 flex-wrap mb-2">
													<h3 className="font-semibold text-slate-900 text-lg">
														{getLocalizedField(lesson, 'title')}
													</h3>
													<Badge
														variant="outline"
														className="font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"
													>
														{lesson.target_language?.toUpperCase() || 'N/A'}
													</Badge>
												</div>
												<div className="flex items-center gap-4 text-sm text-slate-500">
													<span>ID: {lesson.id}</span>
													<span className="text-slate-300">•</span>
													<span>Slug: {lesson.slug}</span>
													{lesson.level && (
														<>
															<span className="text-slate-300">•</span>
															<span>Level: {lesson.level}</span>
														</>
													)}
													<span className="text-slate-300">•</span>
													<span className={lesson.exercise_count > 0 ? 'text-indigo-600 font-medium' : ''}>
														{lesson.exercise_count || 0} exercise{lesson.exercise_count !== 1 ? 's' : ''}
													</span>
												</div>
											</div>
										</div>

										<Button
											size="sm"
											onClick={() => router.push(`/${locale}/admin/lessons/${lesson.id}`)}
											className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white border-0 shadow-sm flex-shrink-0"
										>
											<Edit className="w-4 h-4 mr-1.5" />
											Edit
										</Button>
									</div>
								</div>
							</div>
						))}
					</div>

					{filteredLessons.length === 0 && (
						<div className="text-center py-12">
							<FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
							<p className="text-slate-500">No lessons found</p>
						</div>
					)}
				</div>
			</div>
		</>
	)
}

export default LessonsPageClient
