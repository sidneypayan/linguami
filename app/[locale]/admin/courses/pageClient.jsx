'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Edit, BookOpen, ChevronDown, ChevronRight, GraduationCap, Library, Sparkles } from 'lucide-react'
import { useAllCoursesWithLessons } from '@/lib/admin-client'
import { getStaticLevelById } from '@/lib/method-levels'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import AdminNavbar from '@/components/admin/AdminNavbar'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

const CoursesPageClient = () => {
	const router = useRouter()
	const locale = useLocale()
	const t = useTranslations('admin')
	const { data: courses, isLoading } = useAllCoursesWithLessons()

	const [expandedCourses, setExpandedCourses] = useState(new Set())
	const [selectedLanguage, setSelectedLanguage] = useState('ru')

	// Helper to get localized field
	const getLocalizedField = (obj, fieldPrefix) => {
		const fieldName = `${fieldPrefix}_${locale}`
		return obj[fieldName] || obj[`${fieldPrefix}_en`]
	}

	const toggleCourse = (courseId) => {
		setExpandedCourses(prev => {
			const next = new Set(prev)
			if (next.has(courseId)) {
				next.delete(courseId)
			} else {
				next.add(courseId)
			}
			return next
		})
	}

	// Filter courses by selected language
	const filteredCourses = useMemo(() => {
		if (!courses) return []
		return courses.filter(c => c.target_language === selectedLanguage)
	}, [courses, selectedLanguage])

	// Group filtered courses by level
	const coursesByLevel = useMemo(() => {
		if (!filteredCourses) return {}

		return filteredCourses.reduce((acc, course) => {
			if (!acc[course.level_id]) {
				acc[course.level_id] = []
			}
			acc[course.level_id].push(course)
			return acc
		}, {})
	}, [filteredCourses])

	// Calculate stats for selected language
	const stats = useMemo(() => {
		if (!filteredCourses) return { total: 0, published: 0, lessons: 0 }

		return {
			total: filteredCourses.length,
			published: filteredCourses.filter(c => c.is_published).length,
			lessons: filteredCourses.reduce((sum, c) => sum + (c.course_lessons?.length || 0), 0)
		}
	}, [filteredCourses])

	// Level colors and gradients
	const levelStyles = {
		1: {
			gradient: 'from-emerald-500 to-teal-500',
			bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
			border: 'border-emerald-200',
			text: 'text-emerald-700',
			iconBg: 'bg-emerald-100',
			iconColor: 'text-emerald-600'
		},
		2: {
			gradient: 'from-blue-500 to-indigo-500',
			bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
			border: 'border-blue-200',
			text: 'text-blue-700',
			iconBg: 'bg-blue-100',
			iconColor: 'text-blue-600'
		},
		3: {
			gradient: 'from-purple-500 to-pink-500',
			bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
			border: 'border-purple-200',
			text: 'text-purple-700',
			iconBg: 'bg-purple-100',
			iconColor: 'text-purple-600'
		}
	}

	if (isLoading) return <LoadingSpinner />

	return (
		<>
			<AdminNavbar activePage="courses" />

			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
				<div className="max-w-7xl mx-auto px-4 pt-8 md:pt-16 pb-12">
					{/* Header with gradient */}
					<div className="mb-8">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-3">
								<div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg">
									<BookOpen className="w-6 h-6 text-white" />
								</div>
								<div>
									<h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
										{t('coursesManagement')}
									</h1>
									<p className="text-slate-500 text-sm">{t('manageCourses')}</p>
								</div>
							</div>

							{/* Language Toggle */}
							<div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1.5 shadow-sm">
								<button
									onClick={() => setSelectedLanguage('ru')}
									className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
										selectedLanguage === 'ru'
											? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm'
											: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
									}`}
								>
									🇷🇺 {t('russian')}
								</button>
								<button
									onClick={() => setSelectedLanguage('fr')}
									className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
										selectedLanguage === 'fr'
											? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm'
											: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
									}`}
								>
									🇫🇷 {t('french')}
								</button>
							</div>
						</div>

						{/* Stats Cards */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
							<div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-slate-500 font-medium">
											{t('totalCourses')} {selectedLanguage === 'ru' ? '🇷🇺' : '🇫🇷'}
										</p>
										<p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
									</div>
									<div className="p-3 bg-indigo-100 rounded-lg">
										<Library className="w-6 h-6 text-indigo-600" />
									</div>
								</div>
							</div>

							<div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-slate-500 font-medium">{t('published')}</p>
										<p className="text-2xl font-bold text-emerald-600 mt-1">{stats.published}</p>
									</div>
									<div className="p-3 bg-emerald-100 rounded-lg">
										<Sparkles className="w-6 h-6 text-emerald-600" />
									</div>
								</div>
							</div>

							<div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-slate-500 font-medium">{t('totalLessons')}</p>
										<p className="text-2xl font-bold text-slate-900 mt-1">{stats.lessons}</p>
									</div>
									<div className="p-3 bg-blue-100 rounded-lg">
										<GraduationCap className="w-6 h-6 text-blue-600" />
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Levels with Courses */}
					{[1, 2, 3].map(levelId => {
						const level = getStaticLevelById(levelId)
						const levelCourses = coursesByLevel[levelId] || []
						const styles = levelStyles[levelId]

						return (
							<div key={levelId} className="mb-10">
								{/* Level Header */}
								<div className={`${styles.bg} border ${styles.border} rounded-xl p-5 mb-4 shadow-sm`}>
									<div className="flex items-center gap-3">
										<div className={`p-2.5 ${styles.iconBg} rounded-lg`}>
											<BookOpen className={`w-5 h-5 ${styles.iconColor}`} />
										</div>
										<div className="flex-1">
											<h2 className={`text-xl font-bold ${styles.text}`}>
												{getLocalizedField(level, 'name')}
											</h2>
											<p className="text-sm text-slate-600 mt-0.5">
												{levelCourses.length} {levelCourses.length === 1 ? t('course') : t('courses')}
											</p>
										</div>
									</div>
								</div>

								{/* Courses List */}
								<div className="space-y-3">
									{levelCourses.map(course => (
										<div
											key={course.id}
											className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
										>
											{/* Course Header */}
											<div className="p-5">
												<div className="flex items-start justify-between gap-4">
													<div className="flex items-start gap-3 flex-1 min-w-0">
														<button
															onClick={() => toggleCourse(course.id)}
															className={`p-2 hover:${styles.iconBg} rounded-lg transition-colors flex-shrink-0 mt-0.5`}
														>
															{expandedCourses.has(course.id) ? (
																<ChevronDown className={`w-5 h-5 ${styles.iconColor}`} />
															) : (
																<ChevronRight className="w-5 h-5 text-slate-400" />
															)}
														</button>

														<div className="flex-1 min-w-0">
															<div className="flex items-center gap-2 flex-wrap mb-2">
																<h3 className="font-semibold text-slate-900 text-lg">
																	{getLocalizedField(course, 'title')}
																</h3>
																<Badge
																	variant={course.is_published ? 'success' : 'default'}
																	className="font-medium"
																>
																	{course.is_published ? `✓ ${t('published')}` : `○ ${t('draft')}`}
																</Badge>
																<Badge className={`bg-gradient-to-r ${styles.gradient} text-white border-0 font-medium`}>
																	{course.target_language.toUpperCase()}
																</Badge>
															</div>
															<div className="flex items-center gap-4 text-sm text-slate-500">
																<span className="flex items-center gap-1">
																	<GraduationCap className="w-4 h-4" />
																	{course.course_lessons?.length || 0} {t('lessons')}
																</span>
																<span className="text-slate-300">•</span>
																<span>{t('order')} #{course.order_index}</span>
																{course.estimated_hours && (
																	<>
																		<span className="text-slate-300">•</span>
																		<span>{course.estimated_hours}h {t('estimated')}</span>
																	</>
																)}
															</div>
														</div>
													</div>

													<Button
														size="sm"
														onClick={() => router.push(`/${locale}/admin/courses/${course.id}`)}
														className={`bg-gradient-to-r ${styles.gradient} hover:opacity-90 text-white border-0 shadow-sm flex-shrink-0`}
													>
														<Edit className="w-4 h-4 mr-1.5" />
														{t('edit')}
													</Button>
												</div>
											</div>

											{/* Lessons List (Expandable) */}
											{expandedCourses.has(course.id) && (
												<div className={`border-t ${styles.border} ${styles.bg} p-4`}>
													<p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
														{t('lessons')} ({course.course_lessons?.length || 0})
													</p>
													<div className="space-y-2">
														{course.course_lessons?.map(lesson => (
															<div
																key={lesson.id}
																className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
															>
																<div className="flex items-center gap-3 flex-1 min-w-0">
																	<span className={`text-xs font-bold ${styles.text} w-7 h-7 flex items-center justify-center ${styles.iconBg} rounded-md flex-shrink-0`}>
																		{lesson.order_index}
																	</span>
																	<span className="text-sm font-medium text-slate-700 truncate">
																		{getLocalizedField(lesson, 'title')}
																	</span>
																	<div className="flex items-center gap-1.5 flex-shrink-0">
																		<Badge
																			variant={lesson.is_published ? 'success' : 'default'}
																			className="text-xs"
																		>
																			{lesson.is_published ? t('published') : t('draft')}
																		</Badge>
																		{lesson.is_free && (
																			<Badge variant="primary" className="text-xs">
																				{t('free')}
																			</Badge>
																		)}
																	</div>
																</div>
																<span className="text-xs text-slate-500 font-medium ml-2 flex-shrink-0">
																	{lesson.estimated_minutes || '?'} {t('min')}
																</span>
															</div>
														))}
													</div>
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</>
	)
}

export default CoursesPageClient
