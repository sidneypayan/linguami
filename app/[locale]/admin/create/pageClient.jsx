'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import CreateMaterialForm from '@/components/admin/CreateMaterialForm'
import CreatePostForm from '@/components/admin/CreatePostForm'
import { useCreateMaterial } from '@/lib/admin-client'
import { materialData, postData } from '@/utils/constants'
import { ArrowLeft, CheckCircle, FileText, BookOpen } from 'lucide-react'
import AdminNavbar from '@/components/admin/AdminNavbar'
import { useUserContext } from '@/context/user'
import { optimizeImage } from '@/utils/imageOptimizer'
import { logger } from '@/utils/logger'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const CreateMaterial = () => {
	const t = useTranslations('admin')
	const locale = useLocale()
	const [formData, setFormData] = useState(materialData)
	const [files, setFiles] = useState([])
	const [contentType, setContentType] = useState('materials')

	const router = useRouter()
	const { isUserAdmin, isBootstrapping } = useUserContext()
	const createMaterialMutation = useCreateMaterial()

	// Redirect if not admin
	useEffect(() => {
		if (!isBootstrapping && !isUserAdmin) {
			router.push(`/${locale}`)
		}
	}, [isUserAdmin, isBootstrapping, router, locale])

	const toggleContent = (type) => {
		setContentType(type)
		setFormData(type === 'materials' ? materialData : postData)
		createMaterialMutation.reset()
	}

	const handleChange = async e => {
		let { name, value } = e.target

		if ((name === 'image_filename' || name === 'audio_filename') && e.target.files) {
			const file = e.target.files[0]
			if (!file) return

			const fileType = name === 'image_filename' ? 'image' : 'audio'

			if (fileType === 'image') {
				try {
					const optimized = await optimizeImage(file)
					value = optimized.main.fileName

					setFiles(prev => {
						return [...prev, {
							file: optimized.main.file,
							fileName: optimized.main.fileName,
							fileType
						}]
					})

					logger.info(`Image optimized: ${file.name} (${(file.size / 1024).toFixed(0)}KB) → ${optimized.main.fileName} (${(optimized.main.size / 1024).toFixed(0)}KB)`)
				} catch (error) {
					logger.error('Image optimization failed, using original file:', error)
					value = file.name
					setFiles(prev => {
						return [...prev, { file, fileName: value, fileType }]
					})
				}
			} else {
				value = file.name
				setFiles(prev => {
					return [...prev, { file, fileName: value, fileType }]
				})
			}
		}

		setFormData(prev => {
			return { ...prev, [name]: value }
		})
	}

	const submitContent = async e => {
		e.preventDefault()

		if (contentType !== 'materials') {
			return
		}

		const materialDataToSubmit = {
			lang: formData.lang,
			section: formData.section,
			level: formData.level,
			title: formData.title,
			content: formData.content || '',
			content_accented: formData.content_accented || '',
			video_url: formData.video_url || '',
		}

		if (formData.section === 'book-chapters') {
			materialDataToSubmit.book_id = formData.book_id ? parseInt(formData.book_id) : null
			materialDataToSubmit.chapter_number = formData.chapter_number ? parseInt(formData.chapter_number) : null
		}

		createMaterialMutation.mutate(
			{ materialData: materialDataToSubmit, files },
			{
				onSuccess: () => {
					router.back()
				}
			}
		)
	}

	const canPublish = () => {
		if (contentType === 'posts') {
			return !!(
				formData.lang &&
				formData.title &&
				formData.title.trim() &&
				formData.body &&
				formData.body.trim()
			)
		} else {
			const hasLang = !!formData.lang
			const hasLevel = !!formData.level
			const hasSection = !!formData.section
			const hasTitle = !!(formData.title && typeof formData.title === 'string' && formData.title.trim())
			const hasContent = !!(formData.content && typeof formData.content === 'string' && formData.content.trim())

			let basicValid = hasLang && hasLevel && hasSection && hasTitle && hasContent

			if (formData.section === 'book-chapters') {
				const bookIdStr = String(formData.book_id || '').trim()
				const chapterStr = String(formData.chapter_number || '').trim()
				const hasBookId = bookIdStr !== '' && bookIdStr !== '0'
				const hasChapter = chapterStr !== '' && chapterStr !== '0'

				return basicValid && hasBookId && hasChapter
			}

			const hasMedia = !!(formData.image_filename || formData.audio_filename || formData.video_url)
			return basicValid && hasMedia
		}
	}

	const calculateProgress = () => {
		if (contentType === 'posts') {
			const requiredFields = ['lang', 'title', 'body']
			const filled = requiredFields.filter(field => formData[field] && formData[field].trim()).length
			return (filled / requiredFields.length) * 100
		} else {
			let requiredFieldsCount = 5
			let filledCount = 0

			if (formData.lang) filledCount++
			if (formData.level) filledCount++
			if (formData.section) filledCount++
			if (formData.title && formData.title.trim()) filledCount++
			if (formData.content && formData.content.trim()) filledCount++

			if (formData.section === 'book-chapters') {
				requiredFieldsCount += 2
				const bookIdStr = String(formData.book_id || '').trim()
				const chapterStr = String(formData.chapter_number || '').trim()
				if (bookIdStr !== '' && bookIdStr !== '0') filledCount++
				if (chapterStr !== '' && chapterStr !== '0') filledCount++
			} else {
				requiredFieldsCount += 1
				const hasMedia = !!(formData.image_filename || formData.audio_filename || formData.video_url)
				if (hasMedia) filledCount++
			}

			return (filledCount / requiredFieldsCount) * 100
		}
	}

	const progress = calculateProgress()
	const publishable = canPublish()

	if (isBootstrapping || !isUserAdmin) {
		return null
	}

	return (
		<div className="min-h-screen bg-slate-50 pt-16">
			<AdminNavbar activePage="create" />

			{/* Header */}
			<div className="bg-white border-b sticky top-16 z-40 shadow-sm">
				<div className="max-w-5xl mx-auto px-4 sm:px-6">
					<div className="flex items-center justify-between py-4 gap-4 flex-wrap">
						<div className="flex items-center gap-4">
							<Button
								variant="outline"
								size="icon"
								onClick={() => router.back()}
								className="rounded-lg">
								<ArrowLeft className="h-5 w-5" />
							</Button>
							<div>
								<h1 className="text-xl font-bold text-slate-800 tracking-tight">
									{t('createContent')}
								</h1>
								<p className="text-sm text-slate-500">
									{contentType === 'materials' ? t('materialContent') : t('blogArticle')}
								</p>
							</div>
						</div>

						<div className="flex gap-2">
							<Badge
								variant={contentType === 'materials' ? 'default' : 'outline'}
								className={cn(
									'cursor-pointer px-3 py-1.5 font-semibold',
									contentType === 'materials'
										? 'bg-indigo-500 hover:bg-indigo-600'
										: 'border-indigo-500 text-indigo-500 hover:bg-indigo-50'
								)}
								onClick={() => toggleContent('materials')}>
								<BookOpen className="h-4 w-4 mr-1.5" />
								{t('material')}
							</Badge>
							<Badge
								variant={contentType === 'posts' ? 'default' : 'outline'}
								className={cn(
									'cursor-pointer px-3 py-1.5 font-semibold',
									contentType === 'posts'
										? 'bg-indigo-500 hover:bg-indigo-600'
										: 'border-indigo-500 text-indigo-500 hover:bg-indigo-50'
								)}
								onClick={() => toggleContent('posts')}>
								<FileText className="h-4 w-4 mr-1.5" />
								{t('article')}
							</Badge>
						</div>
					</div>

					{/* Progress Bar */}
					<div className="pb-4">
						<div className="flex items-center gap-3 mb-2">
							<span className="text-xs font-semibold text-slate-500">{t('progression')}</span>
							<span className="text-xs font-bold text-indigo-500">{Math.round(progress)}%</span>
						</div>
						<Progress value={progress} className="h-1.5" />
					</div>
				</div>
			</div>

			<div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
				{/* Error Alert */}
				{createMaterialMutation.error && (
					<div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
						{createMaterialMutation.error.message}
					</div>
				)}

				{/* Main Form */}
				<Card className="rounded-2xl border overflow-hidden">
					<div className="p-6 md:p-8">
						<form onSubmit={submitContent}>
							{contentType === 'posts' ? (
								<CreatePostForm formData={formData} handleChange={handleChange} />
							) : (
								<CreateMaterialForm
									formData={formData}
									handleChange={handleChange}
								/>
							)}

							{/* Form Actions */}
							<div className="mt-8 pt-6 border-t flex justify-end gap-3">
								<Button
									type="submit"
									disabled={createMaterialMutation.isPending || !publishable}
									className={cn(
										'px-8 py-3 rounded-xl font-semibold',
										'bg-emerald-500 hover:bg-emerald-600',
										'disabled:bg-slate-300'
									)}>
									<CheckCircle className="h-5 w-5 mr-2" />
									{createMaterialMutation.isPending ? t('saving') : t('publish')}
								</Button>
							</div>
						</form>
					</div>
				</Card>

				{/* Help Text */}
				<p className="mt-4 text-center text-sm text-slate-400">
					{!publishable ? t('formProgress') : t('formReady')}
				</p>
			</div>
		</div>
	)
}

export default CreateMaterial
