'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useCourseWithLessons, useUpdateCourse } from '@/lib/admin-client'
import { getStaticLevelById } from '@/lib/method-levels'
import { ArrowLeft, Save, BookOpen, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import AdminNavbar from '@/components/admin/AdminNavbar'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import LessonsList from '@/components/admin/courses/LessonsList'

const EditCoursePageClient = ({ courseId }) => {
	const router = useRouter()
	const locale = useLocale()
	const t = useTranslations('admin')
	const { data: course, isLoading } = useCourseWithLessons(courseId)
	const updateCourseMutation = useUpdateCourse()

	const [formData, setFormData] = useState({})
	const [activeTab, setActiveTab] = useState('fr')

	// Helper to get localized field
	const getLocalizedField = (obj, fieldPrefix) => {
		const fieldName = `${fieldPrefix}_${locale}`
		return obj[fieldName] || obj[`${fieldPrefix}_en`]
	}

	// Initialize form when course loads
	useEffect(() => {
		if (course) {
			setFormData({
				title_fr: course.title_fr,
				title_ru: course.title_ru,
				title_en: course.title_en,
				description_fr: course.description_fr || '',
				description_ru: course.description_ru || '',
				description_en: course.description_en || '',
				order_index: course.order_index,
				estimated_hours: course.estimated_hours || '',
				is_published: course.is_published,
			})
		}
	}, [course])

	const handleSave = () => {
		updateCourseMutation.mutate({
			courseId,
			courseData: {
				...formData,
				level_id: course.level_id,
				target_language: course.target_language,
				slug: course.slug,
			}
		})
	}

	if (isLoading) return <LoadingSpinner />

	const level = getStaticLevelById(course?.level_id)
	const levelStyles = {
		1: { gradient: 'from-emerald-500 to-teal-500', bg: 'bg-gradient-to-br from-emerald-50 to-teal-50', border: 'border-emerald-200', text: 'text-emerald-700' },
		2: { gradient: 'from-blue-500 to-indigo-500', bg: 'bg-gradient-to-br from-blue-50 to-indigo-50', border: 'border-blue-200', text: 'text-blue-700' },
		3: { gradient: 'from-purple-500 to-pink-500', bg: 'bg-gradient-to-br from-purple-50 to-pink-50', border: 'border-purple-200', text: 'text-purple-700' }
	}
	const styles = levelStyles[course?.level_id] || levelStyles[1]

	return (
		<>
			<AdminNavbar activePage="courses" />

			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
				<div className="max-w-6xl mx-auto px-4 pt-8 md:pt-16 pb-12">
					{/* Header */}
					<div className="mb-8">
						<div className="flex items-center gap-3 mb-4">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => router.back()}
								className="flex items-center gap-2"
							>
								<ArrowLeft className="w-4 h-4" />
								{t('back')}
							</Button>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className={`p-3 bg-gradient-to-br ${styles.gradient} rounded-xl shadow-lg`}>
									<BookOpen className="w-6 h-6 text-white" />
								</div>
								<div>
									<h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
										{t('editCourse')}
									</h1>
									<p className="text-slate-500 text-sm mt-1">
										{getLocalizedField(level, 'name')} • {getLocalizedField(course, 'title')}
									</p>
								</div>
							</div>

							<Button
								onClick={handleSave}
								disabled={updateCourseMutation.isPending}
								className={`bg-gradient-to-r ${styles.gradient} hover:opacity-90 text-white border-0 shadow-sm`}
							>
								<Save className="w-4 h-4 mr-2" />
								{t('saveChanges')}
							</Button>
						</div>
					</div>

					{/* Course Metadata Form */}
					<div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
						<div className="flex items-center gap-3 mb-6">
							<div className={`p-2 bg-gradient-to-br ${styles.gradient} rounded-lg`}>
								<GraduationCap className="w-5 h-5 text-white" />
							</div>
							<h2 className="text-xl font-bold text-slate-900">{t('courseMetadata')}</h2>
						</div>

						<Tabs value={activeTab} onValueChange={setActiveTab}>
							<TabsList className="grid w-full grid-cols-3 mb-6">
								<TabsTrigger value="fr">🇫🇷 Français</TabsTrigger>
								<TabsTrigger value="ru">🇷🇺 Русский</TabsTrigger>
								<TabsTrigger value="en">🇬🇧 English</TabsTrigger>
							</TabsList>

							<TabsContent value="fr" className="space-y-4">
								<div>
									<Label htmlFor="title_fr">{t('titleFrench')}</Label>
									<Input
										id="title_fr"
										value={formData.title_fr || ''}
										onChange={(e) => setFormData({...formData, title_fr: e.target.value})}
										className="mt-1.5"
									/>
								</div>
								<div>
									<Label htmlFor="desc_fr">{t('descriptionFrench')}</Label>
									<Textarea
										id="desc_fr"
										value={formData.description_fr || ''}
										onChange={(e) => setFormData({...formData, description_fr: e.target.value})}
										rows={4}
										className="mt-1.5"
									/>
								</div>
							</TabsContent>

							<TabsContent value="ru" className="space-y-4">
								<div>
									<Label htmlFor="title_ru">{t('titleRussian')}</Label>
									<Input
										id="title_ru"
										value={formData.title_ru || ''}
										onChange={(e) => setFormData({...formData, title_ru: e.target.value})}
										className="mt-1.5"
									/>
								</div>
								<div>
									<Label htmlFor="desc_ru">{t('descriptionRussian')}</Label>
									<Textarea
										id="desc_ru"
										value={formData.description_ru || ''}
										onChange={(e) => setFormData({...formData, description_ru: e.target.value})}
										rows={4}
										className="mt-1.5"
									/>
								</div>
							</TabsContent>

							<TabsContent value="en" className="space-y-4">
								<div>
									<Label htmlFor="title_en">{t('titleEnglish')}</Label>
									<Input
										id="title_en"
										value={formData.title_en || ''}
										onChange={(e) => setFormData({...formData, title_en: e.target.value})}
										className="mt-1.5"
									/>
								</div>
								<div>
									<Label htmlFor="desc_en">{t('descriptionEnglish')}</Label>
									<Textarea
										id="desc_en"
										value={formData.description_en || ''}
										onChange={(e) => setFormData({...formData, description_en: e.target.value})}
										rows={4}
										className="mt-1.5"
									/>
								</div>
							</TabsContent>
						</Tabs>

						<div className="border-t border-slate-200 pt-6 mt-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
								<div>
									<Label htmlFor="order">{t('orderIndex')}</Label>
									<Input
										id="order"
										type="number"
										value={formData.order_index || 0}
										onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})}
										className="mt-1.5"
									/>
								</div>
								<div>
									<Label htmlFor="hours">{t('estimatedHours')}</Label>
									<Input
										id="hours"
										type="number"
										value={formData.estimated_hours || ''}
										onChange={(e) => setFormData({...formData, estimated_hours: parseInt(e.target.value) || null})}
										className="mt-1.5"
									/>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<Switch
									checked={formData.is_published || false}
									onCheckedChange={(checked) => setFormData({...formData, is_published: checked})}
								/>
								<Label className="font-medium">{t('published')}</Label>
								{formData.is_published && (
									<Badge variant="success" className="ml-2">✓ {t('published')}</Badge>
								)}
							</div>
						</div>
					</div>

					{/* Lessons List with Drag & Drop */}
					<div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
						<div className="flex items-center gap-3 mb-6">
							<div className={`p-2 bg-gradient-to-br ${styles.gradient} rounded-lg`}>
								<BookOpen className="w-5 h-5 text-white" />
							</div>
							<h2 className="text-xl font-bold text-slate-900">{t('lessonsManagement')}</h2>
						</div>

						<LessonsList
							courseId={courseId}
							lessons={course?.course_lessons || []}
							targetLanguage={course?.target_language}
							levelId={course?.level_id}
						/>
					</div>
				</div>
			</div>
		</>
	)
}

export default EditCoursePageClient
