'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowLeft, Save, FileText, Image as ImageIcon, Music, Video, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AdminNavbar from '@/components/admin/AdminNavbar'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import MaterialExercisesSection from '@/components/admin/materials/MaterialExercisesSection'
import { getMaterialById, updateMaterial, updateMaterialWithFiles } from '@/app/actions/admin/materials'
import { toast } from 'sonner'
import { allSections } from '@/data/sections'

const EditMaterialPageClient = ({ materialId }) => {
	const router = useRouter()
	const locale = useLocale()
	const t = useTranslations('admin')
	const [material, setMaterial] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isSaving, setIsSaving] = useState(false)

	// Form state
	const [formData, setFormData] = useState({
		lang: '',
		section: '',
		level: '',
		title: '',
		content: '',
		content_accented: '',
		image_filename: '',
		audio_filename: '',
		video_url: '',
		book_id: null,
		chapter_number: null
	})

	// File upload state
	const [selectedFiles, setSelectedFiles] = useState({
		image: null,
		audio: null
	})

	useEffect(() => {
		const fetchMaterial = async () => {
			try {
				const data = await getMaterialById(materialId)
				setMaterial(data)
				setFormData({
					lang: data.lang || '',
					section: data.section || '',
					level: data.level || '',
					title: data.title || '',
					content: data.content?.replace(/<br\s*\/?>/gi, '\n') || '',
					content_accented: data.content_accented?.replace(/<br\s*\/?>/gi, '\n') || '',
					image_filename: data.image_filename || '',
					audio_filename: data.audio_filename || '',
					video_url: data.video_url || '',
					book_id: data.book_id || null,
					chapter_number: data.chapter_number || null
				})
			} catch (error) {
				console.error('Error fetching material:', error)
				toast.error('Failed to fetch material')
			} finally {
				setIsLoading(false)
			}
		}

		fetchMaterial()
	}, [materialId])

	const handleSave = async () => {
		setIsSaving(true)
		try {
			// Convert newlines to <br> for database storage
			const updates = {
				...formData,
				content: formData.content?.replace(/\n/g, '<br>') || '',
				content_accented: formData.content_accented?.replace(/\n/g, '<br>') || ''
			}

			// Prepare files data if any files are selected
			const filesData = []

			if (selectedFiles.image) {
				const imageData = await fileToBase64(selectedFiles.image)
				filesData.push({
					fileName: selectedFiles.image.name,
					fileType: 'image',
					base64Data: imageData
				})
			}

			if (selectedFiles.audio) {
				const audioData = await fileToBase64(selectedFiles.audio)
				filesData.push({
					fileName: selectedFiles.audio.name,
					fileType: 'audio',
					base64Data: audioData
				})
			}

			// Use appropriate update function
			if (filesData.length > 0) {
				await updateMaterialWithFiles(materialId, updates, filesData)
			} else {
				await updateMaterial(materialId, updates)
			}

			toast.success('Material updated successfully!')

			// Clear selected files after successful upload
			setSelectedFiles({ image: null, audio: null })
		} catch (error) {
			console.error('Error saving material:', error)
			toast.error('Failed to save material')
		} finally {
			setIsSaving(false)
		}
	}

	// Convert file to base64
	const fileToBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => {
				const base64 = reader.result.split(',')[1]
				resolve(base64)
			}
			reader.onerror = error => reject(error)
		})
	}

	// Handle file selection
	const handleFileSelect = (fileType, event) => {
		const file = event.target.files?.[0]
		if (file) {
			setSelectedFiles(prev => ({
				...prev,
				[fileType]: file
			}))
		}
	}

	// Remove selected file
	const handleRemoveFile = (fileType) => {
		setSelectedFiles(prev => ({
			...prev,
			[fileType]: null
		}))
	}

	const handleChange = (field, value) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

	if (isLoading) return <LoadingSpinner />

	const isBookChapter = formData.section === 'book-chapters'

	return (
		<>
			<AdminNavbar activePage="materials" />

			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
				<div className="max-w-7xl mx-auto px-4 pt-8 md:pt-16 pb-12">
					{/* Header */}
					<div className="mb-8">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-3">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => router.push(`/${locale}/admin/materials`)}
									className="flex items-center gap-2"
								>
									<ArrowLeft className="w-4 h-4" />
									{t('back')}
								</Button>
								<div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
									<FileText className="w-6 h-6 text-white" />
								</div>
								<div>
									<h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
										{t('editMaterial')}
									</h1>
									<p className="text-slate-500 text-sm">ID: {materialId}</p>
								</div>
							</div>

							<Button
								onClick={handleSave}
								disabled={isSaving}
								className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-white border-0 shadow-sm"
							>
								<Save className="w-4 h-4 mr-2" />
								{isSaving ? t('saving') : t('saveChanges')}
							</Button>
						</div>

						{/* Metadata Form */}
						<div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
							<h2 className="text-lg font-semibold text-slate-900 mb-4">{t('materialDetails')}</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor="lang">{t('language')}</Label>
									<Select value={formData.lang} onValueChange={(value) => handleChange('lang', value)}>
										<SelectTrigger>
											<SelectValue placeholder={t('selectLanguage')} />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="fr">French (fr)</SelectItem>
											<SelectItem value="ru">Russian (ru)</SelectItem>
											<SelectItem value="en">English (en)</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor="section">{t('section')}</Label>
									<Select value={formData.section} onValueChange={(value) => handleChange('section', value)}>
										<SelectTrigger>
											<SelectValue placeholder={t('selectSection')} />
										</SelectTrigger>
										<SelectContent>
											{allSections.map(section => (
												<SelectItem key={section} value={section}>
													{section}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor="level">{t('level')}</Label>
									<Select value={formData.level} onValueChange={(value) => handleChange('level', value)}>
										<SelectTrigger>
											<SelectValue placeholder={t('selectLevel')} />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="beginner">Beginner</SelectItem>
											<SelectItem value="intermediate">Intermediate</SelectItem>
											<SelectItem value="advanced">Advanced</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="md:col-span-2">
									<Label htmlFor="title">{t('title')}</Label>
									<Input
										id="title"
										value={formData.title}
										onChange={(e) => handleChange('title', e.target.value)}
										placeholder="Material title"
									/>
								</div>

								{isBookChapter && (
									<>
										<div>
											<Label htmlFor="book_id">Book ID</Label>
											<Input
												id="book_id"
												type="number"
												value={formData.book_id || ''}
												onChange={(e) => handleChange('book_id', e.target.value ? parseInt(e.target.value) : null)}
												placeholder="Book ID"
											/>
										</div>
										<div>
											<Label htmlFor="chapter_number">Chapter Number</Label>
											<Input
												id="chapter_number"
												type="number"
												value={formData.chapter_number || ''}
												onChange={(e) => handleChange('chapter_number', e.target.value ? parseInt(e.target.value) : null)}
												placeholder="Chapter number"
											/>
										</div>
									</>
								)}
							</div>
						</div>

						{/* Content */}
						<div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
							<h2 className="text-lg font-semibold text-slate-900 mb-4">{t('content')}</h2>
							<div className="space-y-4">
								<div>
									<Label htmlFor="content">{t('mainContent')}</Label>
									<Textarea
										id="content"
										value={formData.content}
										onChange={(e) => handleChange('content', e.target.value)}
										placeholder="Material content (use \\n for line breaks)"
										rows={15}
										className="font-mono text-sm"
									/>
								</div>
								{formData.lang === 'ru' && (
									<div>
										<Label htmlFor="content_accented">{t('contentWithAccents')}</Label>
										<Textarea
											id="content_accented"
											value={formData.content_accented}
											onChange={(e) => handleChange('content_accented', e.target.value)}
											placeholder="Content with stress marks for Russian materials"
											rows={15}
											className="font-mono text-sm"
										/>
									</div>
								)}
							</div>
						</div>

						{/* Media Files */}
						<div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
							<h2 className="text-lg font-semibold text-slate-900 mb-4">{t('mediaFiles')}</h2>

							{/* Current filenames */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
								<div>
									<Label htmlFor="image_filename" className="flex items-center gap-2">
										<ImageIcon className="w-4 h-4" />
										{t('currentImage')}
									</Label>
									<Input
										id="image_filename"
										value={formData.image_filename}
										onChange={(e) => handleChange('image_filename', e.target.value)}
										placeholder="image.webp"
										className="bg-slate-50"
									/>
								</div>
								<div>
									<Label htmlFor="audio_filename" className="flex items-center gap-2">
										<Music className="w-4 h-4" />
										{t('currentAudio')}
									</Label>
									<Input
										id="audio_filename"
										value={formData.audio_filename}
										onChange={(e) => handleChange('audio_filename', e.target.value)}
										placeholder="audio.mp3"
										className="bg-slate-50"
									/>
								</div>
								<div>
									<Label htmlFor="video_url" className="flex items-center gap-2">
										<Video className="w-4 h-4" />
										{t('videoURL')}
									</Label>
									<Input
										id="video_url"
										value={formData.video_url}
										onChange={(e) => handleChange('video_url', e.target.value)}
										placeholder="https://youtube.com/..."
									/>
								</div>
							</div>

							{/* File upload section */}
							<div className="border-t border-slate-200 pt-6">
								<h3 className="text-sm font-semibold text-slate-700 mb-4">{t('uploadNewFiles')}</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{/* Image Upload */}
									<div>
										<Label htmlFor="image_upload" className="flex items-center gap-2 mb-2">
											<Upload className="w-4 h-4" />
											{t('uploadNewImage')}
										</Label>
										<div className="space-y-2">
											<Input
												id="image_upload"
												type="file"
												accept="image/*"
												onChange={(e) => handleFileSelect('image', e)}
												className="cursor-pointer"
											/>
											{selectedFiles.image && (
												<div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-md p-2">
													<span className="text-sm text-blue-700 truncate">
														{selectedFiles.image.name}
													</span>
													<Button
														size="sm"
														variant="ghost"
														onClick={() => handleRemoveFile('image')}
														className="h-6 w-6 p-0 text-blue-700 hover:text-blue-900 hover:bg-blue-100"
													>
														<X className="w-4 h-4" />
													</Button>
												</div>
											)}
										</div>
										<p className="text-xs text-slate-500 mt-1">
											{t('willBeOptimized')}
										</p>
									</div>

									{/* Audio Upload */}
									<div>
										<Label htmlFor="audio_upload" className="flex items-center gap-2 mb-2">
											<Upload className="w-4 h-4" />
											{t('uploadNewAudio')}
										</Label>
										<div className="space-y-2">
											<Input
												id="audio_upload"
												type="file"
												accept="audio/*"
												onChange={(e) => handleFileSelect('audio', e)}
												className="cursor-pointer"
											/>
											{selectedFiles.audio && (
												<div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-md p-2">
													<span className="text-sm text-blue-700 truncate">
														{selectedFiles.audio.name}
													</span>
													<Button
														size="sm"
														variant="ghost"
														onClick={() => handleRemoveFile('audio')}
														className="h-6 w-6 p-0 text-blue-700 hover:text-blue-900 hover:bg-blue-100"
													>
														<X className="w-4 h-4" />
													</Button>
												</div>
											)}
										</div>
										<p className="text-xs text-slate-500 mt-1">
											{t('acceptsAudioFormats')}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Exercises Section */}
					<MaterialExercisesSection materialId={materialId} />
				</div>
			</div>
		</>
	)
}

export default EditMaterialPageClient
