'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useUpdateMaterial } from '@/lib/admin-client'
import { optimizeImage } from '@/utils/imageOptimizer'
import { logger } from '@/utils/logger'
import { cn } from '@/lib/utils'
import { X, Save, Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

/**
 * Modal optimise pour l'edition de materials
 * - Utilise React Query + Server Actions
 * - Optimisation d'images cote serveur (Sharp)
 * - Validation Zod cote serveur
 * - Securise (admin verifie cote serveur)
 */
const EditMaterialModal = ({ open, onClose, material, onSuccess }) => {
	const t = useTranslations('admin')

	// React Query mutation
	const updateMaterialMutation = useUpdateMaterial()

	// Form state
	const [formData, setFormData] = useState({})
	const [files, setFiles] = useState([])

	// Charger les donnees du material quand le modal s'ouvre
	useEffect(() => {
		if (material) {
			setFormData({
				lang: material.lang || '',
				section: material.section || '',
				book_id: material.book_id || '',
				chapter_number: material.chapter_number || '',
				level: material.level || '',
				title: material.title || '',
				image_filename: material.image_filename || '',
				audio_filename: material.audio_filename || '',
				video_url: material.video_url || '',
				content: material.content?.replace(/<br\s*\/?>/gi, '\n') || '',
				content_accented: material.content_accented?.replace(/<br\s*\/?>/gi, '\n') || '',
			})
			setFiles([])
		}
	}, [material, open])

	const handleChange = (field, value) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

	const handleFileUpload = async (e, fileType) => {
		const file = e.target.files?.[0]
		if (!file) return

		let processedFile = file
		let fileName = file.name

		if (fileType === 'image') {
			try {
				const optimized = await optimizeImage(file)
				processedFile = optimized.main.file
				fileName = optimized.main.fileName
				logger.info(`Image optimized: ${file.name} → ${optimized.main.fileName}`)
			} catch (error) {
				logger.error('Image optimization failed, using original file:', error)
			}
		}

		setFiles(prev => {
			const filtered = prev.filter(f => f.fileType !== fileType)
			return [...filtered, { file: processedFile, fileName, fileType }]
		})

		const fieldName = fileType === 'image' ? 'image_filename' : 'audio_filename'
		setFormData(prev => ({ ...prev, [fieldName]: fileName }))
	}

	const handleSave = async () => {
		const materialData = {
			lang: formData.lang,
			section: formData.section,
			level: formData.level,
			title: formData.title,
			content: formData.content || '',
			content_accented: formData.content_accented || '',
			video_url: formData.video_url || '',
		}

		if (formData.section === 'book-chapters') {
			materialData.book_id = formData.book_id ? parseInt(formData.book_id) : null
			materialData.chapter_number = formData.chapter_number ? parseInt(formData.chapter_number) : null
		} else {
			materialData.book_id = null
			materialData.chapter_number = null
		}

		if (!files.find(f => f.fileType === 'image') && formData.image_filename) {
			materialData.image_filename = formData.image_filename
		}
		if (!files.find(f => f.fileType === 'audio') && formData.audio_filename) {
			materialData.audio_filename = formData.audio_filename
		}

		updateMaterialMutation.mutate(
			{ materialId: material.id, materialData, files },
			{
				onSuccess: () => {
					if (onSuccess) onSuccess()
					onClose()
				},
			}
		)
	}

	const isBookChapter = formData.section === 'book-chapters'
	const needsImage = !isBookChapter
	const needsAudio = formData.section && [
		'dialogues', 'culture', 'legends', 'slices-of-life',
		'beautiful-places', 'podcasts', 'short-stories',
	].includes(formData.section)
	const needsVideo = formData.section && [
		'movie-trailers', 'movie-clips', 'cartoons', 'various-materials',
		'rock', 'pop', 'folk', 'variety', 'kids', 'eralash', 'galileo',
	].includes(formData.section)

	const isLoading = updateMaterialMutation.isPending

	if (!open) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
			<div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
				{/* Header */}
				<div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
							<Save className="w-6 h-6" />
						</div>
						<div>
							<h2 className="text-lg font-bold text-slate-800">{t('editContent')}</h2>
							<p className="text-sm text-slate-500">{material?.title}</p>
						</div>
					</div>
					<button
						onClick={onClose}
						disabled={isLoading}
						className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
					>
						<X className="w-5 h-5 text-slate-500" />
					</button>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-y-auto p-6 space-y-6">
					{updateMaterialMutation.isError && (
						<div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
							<AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
							<span className="text-sm text-red-700">
								{updateMaterialMutation.error?.message || 'An error occurred'}
							</span>
						</div>
					)}

					{/* Language, Level, Section */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div className="space-y-1.5">
							<label className="block text-sm font-medium text-slate-700">{t('language')}</label>
							<select
								value={formData.lang || ''}
								onChange={(e) => handleChange('lang', e.target.value)}
								disabled={isLoading}
								className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white disabled:bg-slate-50"
							>
								<option value="">--</option>
								<option value="fr">Francais</option>
								<option value="ru">Russkiy</option>
								<option value="en">English</option>
							</select>
						</div>

						<div className="space-y-1.5">
							<label className="block text-sm font-medium text-slate-700">{t('level')}</label>
							<select
								value={formData.level || ''}
								onChange={(e) => handleChange('level', e.target.value)}
								disabled={isLoading}
								className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white disabled:bg-slate-50"
							>
								<option value="">--</option>
								<option value="beginner">{t('beginner')}</option>
								<option value="intermediate">{t('intermediate')}</option>
								<option value="advanced">{t('advanced')}</option>
							</select>
						</div>

						<div className="space-y-1.5">
							<label className="block text-sm font-medium text-slate-700">{t('section')}</label>
							<select
								value={formData.section || ''}
								onChange={(e) => handleChange('section', e.target.value)}
								disabled={isLoading}
								className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white disabled:bg-slate-50"
							>
								<option value="">--</option>
								<optgroup label="📝 Text & Audio">
									<option value="dialogues">Dialogues</option>
									<option value="culture">Culture</option>
									<option value="legends">Legends</option>
									<option value="slices-of-life">Slices of Life</option>
									<option value="beautiful-places">Beautiful Places</option>
									<option value="podcasts">Podcasts</option>
									<option value="short-stories">Short Stories</option>
									<option value="book-chapters">Book Chapters</option>
								</optgroup>
								<optgroup label="🎬 Video">
									<option value="movie-trailers">Movie Trailers</option>
									<option value="movie-clips">Movie Clips</option>
									<option value="cartoons">Cartoons</option>
									<option value="eralash">Eralash</option>
									<option value="galileo">Galileo</option>
									<option value="various-materials">Various Materials</option>
								</optgroup>
								<optgroup label="🎵 Music">
									<option value="rock">Rock</option>
									<option value="pop">Pop</option>
									<option value="folk">Folk</option>
									<option value="variety">Variety</option>
									<option value="kids">Kids</option>
								</optgroup>
							</select>
						</div>
					</div>

					{/* Title */}
					<div className="space-y-1.5">
						<label className="block text-sm font-medium text-slate-700">{t('title')}</label>
						<input
							type="text"
							value={formData.title || ''}
							onChange={(e) => handleChange('title', e.target.value)}
							placeholder={t('materialTitlePlaceholder')}
							disabled={isLoading}
							className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white disabled:bg-slate-50"
						/>
					</div>

					{/* Book Chapter fields */}
					{isBookChapter && (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-1.5">
								<label className="block text-sm font-medium text-slate-700">{t('bookId')}</label>
								<input
									type="number"
									value={formData.book_id || ''}
									onChange={(e) => handleChange('book_id', e.target.value)}
									disabled={isLoading}
									className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white disabled:bg-slate-50"
								/>
							</div>
							<div className="space-y-1.5">
								<label className="block text-sm font-medium text-slate-700">{t('chapterNumber')}</label>
								<input
									type="number"
									value={formData.chapter_number || ''}
									onChange={(e) => handleChange('chapter_number', e.target.value)}
									disabled={isLoading}
									className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white disabled:bg-slate-50"
								/>
							</div>
						</div>
					)}

					{/* Image Upload */}
					{needsImage && (
						<div>
							<p className="text-sm font-semibold text-slate-600 mb-3">{t('image')}</p>
							<label className={cn(
								'flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors',
								isLoading
									? 'border-slate-200 text-slate-400 cursor-not-allowed'
									: 'border-indigo-300 text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50/50'
							)}>
								<Upload className="w-5 h-5" />
								<span className="font-semibold">{t('uploadImage')}</span>
								<input
									type="file"
									accept="image/*"
									onChange={(e) => handleFileUpload(e, 'image')}
									disabled={isLoading}
									className="hidden"
								/>
							</label>

							<div className="flex items-center gap-4 my-4">
								<div className="flex-1 border-t border-slate-200" />
								<span className="text-sm font-semibold text-slate-400">{t('or')}</span>
								<div className="flex-1 border-t border-slate-200" />
							</div>

							<input
								type="text"
								value={formData.image_filename || ''}
								onChange={(e) => handleChange('image_filename', e.target.value)}
								placeholder="exemple: mon-image.webp"
								disabled={isLoading}
								className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white disabled:bg-slate-50"
							/>
							<p className="text-xs text-slate-500 mt-1">{t('fileNameOnlyHelper')}</p>

							{formData.image_filename && (
								<div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
									<CheckCircle className="w-4 h-4 text-emerald-500" />
									<span className="text-sm font-semibold text-emerald-700">{formData.image_filename}</span>
								</div>
							)}
						</div>
					)}

					{/* Audio Upload */}
					{needsAudio && (
						<div>
							<p className="text-sm font-semibold text-slate-600 mb-3">{t('audio')}</p>
							<label className={cn(
								'flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors',
								isLoading
									? 'border-slate-200 text-slate-400 cursor-not-allowed'
									: 'border-indigo-300 text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50/50'
							)}>
								<Upload className="w-5 h-5" />
								<span className="font-semibold">{t('uploadAudio')}</span>
								<input
									type="file"
									accept="audio/*"
									onChange={(e) => handleFileUpload(e, 'audio')}
									disabled={isLoading}
									className="hidden"
								/>
							</label>

							<div className="flex items-center gap-4 my-4">
								<div className="flex-1 border-t border-slate-200" />
								<span className="text-sm font-semibold text-slate-400">{t('or')}</span>
								<div className="flex-1 border-t border-slate-200" />
							</div>

							<input
								type="text"
								value={formData.audio_filename || ''}
								onChange={(e) => handleChange('audio_filename', e.target.value)}
								placeholder="exemple: mon-audio.mp3"
								disabled={isLoading}
								className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white disabled:bg-slate-50"
							/>
							<p className="text-xs text-slate-500 mt-1">{t('fileNameOnlyHelper')}</p>

							{formData.audio_filename && (
								<div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
									<CheckCircle className="w-4 h-4 text-emerald-500" />
									<span className="text-sm font-semibold text-emerald-700">{formData.audio_filename}</span>
								</div>
							)}
						</div>
					)}

					{/* Video URL */}
					{needsVideo && (
						<div className="space-y-1.5">
							<label className="block text-sm font-medium text-slate-700">{t('videoUrl')}</label>
							<input
								type="text"
								value={formData.video_url || ''}
								onChange={(e) => handleChange('video_url', e.target.value)}
								placeholder="https://www.youtube.com/watch?v=..."
								disabled={isLoading}
								className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white disabled:bg-slate-50"
							/>
						</div>
					)}

					{/* Content without accents */}
					<div className="space-y-1.5">
						<label className="block text-sm font-medium text-slate-700">{t('textWithoutAccents')}</label>
						<textarea
							value={formData.content || ''}
							onChange={(e) => handleChange('content', e.target.value)}
							placeholder={t('textWithoutAccentsPlaceholder')}
							disabled={isLoading}
							rows={12}
							className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white disabled:bg-slate-50 resize-none"
						/>
					</div>

					{/* Content with accents (Russian only) */}
					{formData.lang === 'ru' && (
						<div className="space-y-1.5">
							<label className="block text-sm font-medium text-slate-700">{t('textWithAccents')}</label>
							<textarea
								value={formData.content_accented || ''}
								onChange={(e) => handleChange('content_accented', e.target.value)}
								placeholder={t('textWithAccentsPlaceholder')}
								disabled={isLoading}
								rows={12}
								className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white disabled:bg-slate-50 resize-none"
							/>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-white">
					<button
						onClick={onClose}
						disabled={isLoading}
						className="px-4 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
					>
						{t('cancel')}
					</button>
					<button
						onClick={handleSave}
						disabled={isLoading}
						className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 transition-colors"
					>
						{isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
						{isLoading ? t('saving') : t('save')}
					</button>
				</div>
			</div>
		</div>
	)
}

export default EditMaterialModal
