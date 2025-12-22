'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { ArrowLeft, Save, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AdminNavbar from '@/components/admin/AdminNavbar'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import StandaloneJSONEditor from '@/components/admin/lessons/StandaloneJSONEditor'
import LessonExercisesSection from '@/components/admin/lessons/LessonExercisesSection'
import { getStandaloneLessonById, updateStandaloneLesson } from '@/app/actions/admin/lessons'
import { toast } from 'sonner'

const EditLessonPageClient = ({ lessonId }) => {
	const router = useRouter()
	const locale = useLocale()
	const [lesson, setLesson] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isSaving, setIsSaving] = useState(false)
	const [activeTab, setActiveTab] = useState('fr')

	// Form state
	const [formData, setFormData] = useState({
		title_fr: '',
		title_en: '',
		title_ru: '',
		slug: '',
		target_language: '',
		level: '',
		blocks_fr: [],
		blocks_en: [],
		blocks_ru: []
	})

	useEffect(() => {
		const fetchLesson = async () => {
			try {
				const data = await getStandaloneLessonById(lessonId)
				setLesson(data)
				setFormData({
					title_fr: data.title_fr || '',
					title_en: data.title_en || '',
					title_ru: data.title_ru || '',
					slug: data.slug || '',
					target_language: data.target_language || '',
					level: data.level || '',
					blocks_fr: data.blocks_fr || [],
					blocks_en: data.blocks_en || [],
					blocks_ru: data.blocks_ru || []
				})
			} catch (error) {
				console.error('Error fetching lesson:', error)
				toast.error('Failed to fetch lesson')
			} finally {
				setIsLoading(false)
			}
		}

		fetchLesson()
	}, [lessonId])

	const handleSave = async () => {
		setIsSaving(true)
		try {
			await updateStandaloneLesson(lessonId, formData)
			toast.success('Lesson updated successfully!')
		} catch (error) {
			console.error('Error saving lesson:', error)
			toast.error('Failed to save lesson')
		} finally {
			setIsSaving(false)
		}
	}

	const handleBlocksChange = (lang, blocks) => {
		setFormData(prev => ({
			...prev,
			[`blocks_${lang}`]: blocks
		}))
	}

	if (isLoading) return <LoadingSpinner />

	return (
		<>
			<AdminNavbar activePage="lessons" />

			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
				<div className="max-w-7xl mx-auto px-4 pt-8 md:pt-16 pb-12">
					{/* Header */}
					<div className="mb-8">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-3">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => router.push(`/${locale}/admin/lessons`)}
									className="flex items-center gap-2"
								>
									<ArrowLeft className="w-4 h-4" />
									Back
								</Button>
								<div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
									<FileText className="w-6 h-6 text-white" />
								</div>
								<div>
									<h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
										Edit Lesson
									</h1>
									<p className="text-slate-500 text-sm">ID: {lessonId}</p>
								</div>
							</div>

							<Button
								onClick={handleSave}
								disabled={isSaving}
								className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white border-0 shadow-sm"
							>
								<Save className="w-4 h-4 mr-2" />
								{isSaving ? 'Saving...' : 'Save Changes'}
							</Button>
						</div>

						{/* Metadata Form */}
						<div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
							<h2 className="text-lg font-semibold text-slate-900 mb-4">Lesson Metadata</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor="title_fr">Title (French)</Label>
									<Input
										id="title_fr"
										value={formData.title_fr}
										onChange={(e) => setFormData(prev => ({ ...prev, title_fr: e.target.value }))}
										placeholder="Title in French"
									/>
								</div>
								<div>
									<Label htmlFor="title_en">Title (English)</Label>
									<Input
										id="title_en"
										value={formData.title_en}
										onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
										placeholder="Title in English"
									/>
								</div>
								<div>
									<Label htmlFor="title_ru">Title (Russian)</Label>
									<Input
										id="title_ru"
										value={formData.title_ru}
										onChange={(e) => setFormData(prev => ({ ...prev, title_ru: e.target.value }))}
										placeholder="Title in Russian"
									/>
								</div>
								<div>
									<Label htmlFor="slug">Slug</Label>
									<Input
										id="slug"
										value={formData.slug}
										onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
										placeholder="lesson-slug"
									/>
								</div>
								<div>
									<Label htmlFor="target_language">Target Language</Label>
									<Input
										id="target_language"
										value={formData.target_language}
										onChange={(e) => setFormData(prev => ({ ...prev, target_language: e.target.value }))}
										placeholder="fr, ru, en"
									/>
								</div>
								<div>
									<Label htmlFor="level">Level</Label>
									<Input
										id="level"
										value={formData.level}
										onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
										placeholder="A1, A2, B1, etc."
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Blocks Editor */}
					<div className="bg-white rounded-xl border border-slate-200 shadow-sm">
						{/* Language Tabs */}
						<div className="border-b border-slate-200">
							<div className="flex gap-2 p-4">
								<button
									onClick={() => setActiveTab('fr')}
									className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
										activeTab === 'fr'
											? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
											: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
									}`}
								>
									🇫🇷 French Blocks
								</button>
								<button
									onClick={() => setActiveTab('en')}
									className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
										activeTab === 'en'
											? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
											: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
									}`}
								>
									🇬🇧 English Blocks
								</button>
								<button
									onClick={() => setActiveTab('ru')}
									className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
										activeTab === 'ru'
											? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
											: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
									}`}
								>
									🇷🇺 Russian Blocks
								</button>
							</div>
						</div>

						{/* JSON Editor */}
						<div className="p-4">
							{activeTab === 'fr' && (
								<StandaloneJSONEditor
									blocks={formData.blocks_fr}
									onChange={(blocks) => handleBlocksChange('fr', blocks)}
								/>
							)}
							{activeTab === 'en' && (
								<StandaloneJSONEditor
									blocks={formData.blocks_en}
									onChange={(blocks) => handleBlocksChange('en', blocks)}
								/>
							)}
							{activeTab === 'ru' && (
								<StandaloneJSONEditor
									blocks={formData.blocks_ru}
									onChange={(blocks) => handleBlocksChange('ru', blocks)}
								/>
							)}
						</div>
					</div>

					{/* Exercises Section */}
					<div className="mt-6">
						<LessonExercisesSection lessonId={lessonId} />
					</div>
				</div>
			</div>
		</>
	)
}

export default EditLessonPageClient
