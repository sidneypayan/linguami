'use client'

import React, { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations, useLocale } from 'next-intl'
import {
	TrendingUp,
	BookOpen,
	Video,
	Library,
	AlertTriangle,
	RefreshCw,
	ArrowRightLeft,
	X,
	Search,
	ExternalLink,
	FileAudio,
	Image as ImageIcon,
	Eye,
	Loader2,
} from 'lucide-react'
import AdminNavbar from '@/components/admin/AdminNavbar'
import { logger } from '@/utils/logger'
import { cn } from '@/lib/utils'
import { checkBrokenVideos, updateMaterialVideo, checkBrokenAudios, updateMaterialAudio, checkBrokenImages, updateMaterialImage } from '@/app/actions/admin'

const AdminDashboardClient = ({ initialMaterialsData, initialBooksData }) => {
	const t = useTranslations('admin')
	const locale = useLocale()

	const [selectedLang, setSelectedLang] = useState('fr')
	const [brokenVideos, setBrokenVideos] = useState([])
	const [loadingVideos, setLoadingVideos] = useState(false)
	const [showBrokenVideos, setShowBrokenVideos] = useState(false)
	const [editVideoDialog, setEditVideoDialog] = useState({ open: false, video: null })
	const [newVideoUrl, setNewVideoUrl] = useState('')
	const [savingVideo, setSavingVideo] = useState(false)

	// Audio states
	const [brokenAudios, setBrokenAudios] = useState([])
	const [loadingAudios, setLoadingAudios] = useState(false)
	const [showBrokenAudios, setShowBrokenAudios] = useState(false)
	const [editAudioDialog, setEditAudioDialog] = useState({ open: false, audio: null })
	const [newAudioFilename, setNewAudioFilename] = useState('')
	const [savingAudio, setSavingAudio] = useState(false)

	// Image states
	const [brokenImages, setBrokenImages] = useState([])
	const [loadingImages, setLoadingImages] = useState(false)
	const [showBrokenImages, setShowBrokenImages] = useState(false)
	const [editImageDialog, setEditImageDialog] = useState({ open: false, image: null })
	const [newImageFilename, setNewImageFilename] = useState('')
	const [savingImage, setSavingImage] = useState(false)

	// Use initial data from server
	const materialsCountByLang = initialMaterialsData
	const booksCountByLang = initialBooksData

	const loadBrokenVideos = async () => {
		setLoadingVideos(true)
		try {
			const result = await checkBrokenVideos()
			setBrokenVideos(result.brokenVideos || [])
			setShowBrokenVideos(true)
		} catch (error) {
			logger.error('Error loading broken videos:', error)
		} finally {
			setLoadingVideos(false)
		}
	}

	const handleOpenEditDialog = (video) => {
		setEditVideoDialog({ open: true, video })
		setNewVideoUrl(video.video_url || '')
	}

	const handleCloseEditDialog = () => {
		setEditVideoDialog({ open: false, video: null })
		setNewVideoUrl('')
	}

	const handleSaveVideoUrl = async () => {
		if (!newVideoUrl.trim()) return

		setSavingVideo(true)
		try {
			const result = await updateMaterialVideo(
				editVideoDialog.video.id,
				newVideoUrl.trim()
			)

			if (result.success) {
				setBrokenVideos(prev => prev.filter(v => v.id !== editVideoDialog.video.id))
				handleCloseEditDialog()
			} else {
				logger.error('Failed to update video')
				alert(t('errorUpdatingVideo'))
			}
		} catch (error) {
			logger.error('Error updating video:', error)
			alert(t('errorUpdatingVideo'))
		} finally {
			setSavingVideo(false)
		}
	}

	// Audio functions
	const loadBrokenAudios = async () => {
		setLoadingAudios(true)
		try {
			const result = await checkBrokenAudios()
			setBrokenAudios(result.brokenAudios || [])
			setShowBrokenAudios(true)
		} catch (error) {
			logger.error('Error loading broken audios:', error)
		} finally {
			setLoadingAudios(false)
		}
	}

	const handleOpenEditAudioDialog = (audio) => {
		setEditAudioDialog({ open: true, audio })
		setNewAudioFilename(audio.audio_filename || '')
	}

	const handleCloseEditAudioDialog = () => {
		setEditAudioDialog({ open: false, audio: null })
		setNewAudioFilename('')
	}

	const handleSaveAudioFilename = async () => {
		setSavingAudio(true)
		try {
			const result = await updateMaterialAudio(
				editAudioDialog.audio.id,
				newAudioFilename.trim()
			)

			if (result.success) {
				setBrokenAudios(prev => prev.filter(a => a.id !== editAudioDialog.audio.id))
				handleCloseEditAudioDialog()
			} else {
				logger.error('Failed to update audio')
				alert(t('errorUpdatingAudio'))
			}
		} catch (error) {
			logger.error('Error updating audio:', error)
			alert(t('errorUpdatingAudio'))
		} finally {
			setSavingAudio(false)
		}
	}

	const handleRemoveAudio = async () => {
		setSavingAudio(true)
		try {
			const result = await updateMaterialAudio(
				editAudioDialog.audio.id,
				'' // Empty string to remove audio
			)

			if (result.success) {
				setBrokenAudios(prev => prev.filter(a => a.id !== editAudioDialog.audio.id))
				handleCloseEditAudioDialog()
			} else {
				logger.error('Failed to remove audio')
				alert(t('errorUpdatingAudio'))
			}
		} catch (error) {
			logger.error('Error removing audio:', error)
			alert(t('errorUpdatingAudio'))
		} finally {
			setSavingAudio(false)
		}
	}

	// Image functions
	const loadBrokenImages = async () => {
		setLoadingImages(true)
		try {
			const result = await checkBrokenImages()
			setBrokenImages(result.brokenImages || [])
			setShowBrokenImages(true)
		} catch (error) {
			logger.error('Error loading broken images:', error)
		} finally {
			setLoadingImages(false)
		}
	}

	const handleOpenEditImageDialog = (image) => {
		setEditImageDialog({ open: true, image })
		setNewImageFilename(image.image_filename || '')
	}

	const handleCloseEditImageDialog = () => {
		setEditImageDialog({ open: false, image: null })
		setNewImageFilename('')
	}

	const handleSaveImageFilename = async () => {
		setSavingImage(true)
		try {
			const result = await updateMaterialImage(
				editImageDialog.image.id,
				newImageFilename.trim()
			)

			if (result.success) {
				setBrokenImages(prev => prev.filter(i => i.id !== editImageDialog.image.id))
				handleCloseEditImageDialog()
			} else {
				logger.error('Failed to update image')
				alert(t('errorUpdatingImage'))
			}
		} catch (error) {
			logger.error('Error updating image:', error)
			alert(t('errorUpdatingImage'))
		} finally {
			setSavingImage(false)
		}
	}

	const handleRemoveImage = async () => {
		setSavingImage(true)
		try {
			const result = await updateMaterialImage(
				editImageDialog.image.id,
				'' // Empty string to remove image
			)

			if (result.success) {
				setBrokenImages(prev => prev.filter(i => i.id !== editImageDialog.image.id))
				handleCloseEditImageDialog()
			} else {
				logger.error('Failed to remove image')
				alert(t('errorUpdatingImage'))
			}
		} catch (error) {
			logger.error('Error removing image:', error)
			alert(t('errorUpdatingImage'))
		} finally {
			setSavingImage(false)
		}
	}

	const getLanguageInfo = (lang) => {
		const info = {
			fr: { name: 'Francais', color: 'blue', flag: '🇫🇷' },
			ru: { name: 'Russkiy', color: 'red', flag: '🇷🇺' },
			en: { name: 'English', color: 'emerald', flag: '🇬🇧' },
		}
		return info[lang] || info.fr
	}

	const currentLangData = materialsCountByLang.find(m => m.lang === selectedLang)
	const currentBooks = booksCountByLang.find(b => b.lang === selectedLang)

	const totalAudioText = currentLangData?.audioTextCount || 0
	const totalVideo = currentLangData?.videoCount || 0
	const totalBooks = currentBooks?.count || 0
	const grandTotal = totalAudioText + totalVideo + totalBooks

	const audioTextSectionsArray = [
		'dialogues',
		'culture',
		'legends',
		'slices-of-life',
		'beautiful-places',
		'podcasts',
		'short-stories'
	]

	const videoSectionsArray = selectedLang === 'ru'
		? ['movie-trailers', 'movie-clips', 'cartoons', 'various-materials', 'rock', 'pop', 'folk', 'variety', 'kids', 'eralash', 'galileo']
		: ['movie-trailers', 'movie-clips', 'cartoons', 'various-materials', 'rock', 'pop', 'folk', 'variety', 'kids']

	const audioTextData = currentLangData?.sections?.filter(s => audioTextSectionsArray.includes(s.section)) || []
	const videoData = currentLangData?.sections?.filter(s => videoSectionsArray.includes(s.section)) || []
	const bookChaptersData = currentLangData?.sections?.find(s => s.section === 'book-chapters')

	const tableData = [
		...(audioTextData.length > 0 ? [{
			type: 'category',
			section: t('textAndAudio'),
			isCategory: true,
		}] : []),
		...audioTextData.map(({ section, count }) => ({
			type: 'material',
			section,
			count,
			icon: BookOpen,
			indent: false,
		})),

		...(videoData.length > 0 ? [{
			type: 'category',
			section: t('videos'),
			isCategory: true,
		}] : []),
		...videoData.map(({ section, count }) => ({
			type: 'material',
			section,
			count,
			icon: Video,
			indent: false,
		})),

		...(totalBooks > 0 || bookChaptersData ? [{
			type: 'category',
			section: t('books'),
			isCategory: true,
		}] : []),
		...(totalBooks > 0 ? [{
			type: 'books',
			section: t('books'),
			count: totalBooks,
			icon: Library,
			indent: false,
		}] : []),
		...(bookChaptersData ? [{
			type: 'bookChapters',
			section: 'book-chapters',
			count: bookChaptersData.count,
			icon: Library,
			indent: true,
		}] : [])
	]

	// Stats cards data
	const statsCards = [
		{ label: t('totalContent'), value: grandTotal, icon: TrendingUp, color: 'indigo' },
		{ label: t('textAndAudio'), value: totalAudioText, icon: BookOpen, color: 'blue' },
		{ label: t('videos'), value: totalVideo, icon: Video, color: 'emerald' },
		{ label: t('books'), value: totalBooks, icon: Library, color: 'amber' },
	]

	const colorClasses = {
		indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
		blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
		emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
		amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
		red: { bg: 'bg-red-100', text: 'text-red-600' },
		violet: { bg: 'bg-violet-100', text: 'text-violet-600' },
	}

	return (
		<div className="min-h-screen bg-slate-50 pt-[70px] sm:pt-[80px]">
			<AdminNavbar activePage="dashboard" />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Stats Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
					{statsCards.map((card, index) => {
						const Icon = card.icon
						const colors = colorClasses[card.color]
						return (
							<div
								key={index}
								className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
							>
								<div className="flex items-center gap-4 mb-2">
									<div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', colors.bg)}>
										<Icon className={cn('w-6 h-6', colors.text)} />
									</div>
									<span className="text-3xl font-bold text-slate-800">{card.value}</span>
								</div>
								<p className="text-sm font-medium text-slate-500">{card.label}</p>
							</div>
						)
					})}
				</div>

				{/* Media Health Check - Compact Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					{/* Videos Card */}
					<div className={cn(
						'rounded-xl border p-4 transition-all',
						brokenVideos.length > 0
							? 'border-red-300 bg-red-50'
							: showBrokenVideos
								? 'border-emerald-300 bg-emerald-50'
								: 'border-slate-200 bg-white hover:border-slate-300'
					)}>
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-3">
								<div className={cn(
									'w-10 h-10 rounded-lg flex items-center justify-center',
									brokenVideos.length > 0 ? 'bg-red-100' : 'bg-slate-100'
								)}>
									{brokenVideos.length > 0 ? (
										<AlertTriangle className="w-5 h-5 text-red-600" />
									) : (
										<Video className="w-5 h-5 text-slate-600" />
									)}
								</div>
								<div>
									<h4 className="font-semibold text-slate-800 text-sm">{t('videos')}</h4>
									<p className="text-xs text-slate-500">
										{showBrokenVideos
											? brokenVideos.length > 0
												? `${brokenVideos.length} ${t('broken')}`
												: t('allGood')
											: t('notChecked')}
									</p>
								</div>
							</div>
							{brokenVideos.length > 0 && (
								<span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
									{brokenVideos.length}
								</span>
							)}
						</div>
						<button
							onClick={loadBrokenVideos}
							disabled={loadingVideos}
							className={cn(
								'w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
								brokenVideos.length > 0
									? 'bg-red-500 text-white hover:bg-red-600'
									: 'bg-slate-100 text-slate-700 hover:bg-slate-200'
							)}
						>
							<RefreshCw className={cn('w-4 h-4', loadingVideos && 'animate-spin')} />
							{loadingVideos ? t('checking') : t('check')}
						</button>
					</div>

					{/* Audios Card */}
					<div className={cn(
						'rounded-xl border p-4 transition-all',
						brokenAudios.length > 0
							? 'border-amber-300 bg-amber-50'
							: showBrokenAudios
								? 'border-emerald-300 bg-emerald-50'
								: 'border-slate-200 bg-white hover:border-slate-300'
					)}>
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-3">
								<div className={cn(
									'w-10 h-10 rounded-lg flex items-center justify-center',
									brokenAudios.length > 0 ? 'bg-amber-100' : 'bg-slate-100'
								)}>
									{brokenAudios.length > 0 ? (
										<AlertTriangle className="w-5 h-5 text-amber-600" />
									) : (
										<FileAudio className="w-5 h-5 text-slate-600" />
									)}
								</div>
								<div>
									<h4 className="font-semibold text-slate-800 text-sm">{t('audios')}</h4>
									<p className="text-xs text-slate-500">
										{showBrokenAudios
											? brokenAudios.length > 0
												? `${brokenAudios.length} ${t('broken')}`
												: t('allGood')
											: t('notChecked')}
									</p>
								</div>
							</div>
							{brokenAudios.length > 0 && (
								<span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
									{brokenAudios.length}
								</span>
							)}
						</div>
						<button
							onClick={loadBrokenAudios}
							disabled={loadingAudios}
							className={cn(
								'w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
								brokenAudios.length > 0
									? 'bg-amber-500 text-white hover:bg-amber-600'
									: 'bg-slate-100 text-slate-700 hover:bg-slate-200'
							)}
						>
							<RefreshCw className={cn('w-4 h-4', loadingAudios && 'animate-spin')} />
							{loadingAudios ? t('checking') : t('check')}
						</button>
					</div>

					{/* Images Card */}
					<div className={cn(
						'rounded-xl border p-4 transition-all',
						brokenImages.length > 0
							? 'border-violet-300 bg-violet-50'
							: showBrokenImages
								? 'border-emerald-300 bg-emerald-50'
								: 'border-slate-200 bg-white hover:border-slate-300'
					)}>
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-3">
								<div className={cn(
									'w-10 h-10 rounded-lg flex items-center justify-center',
									brokenImages.length > 0 ? 'bg-violet-100' : 'bg-slate-100'
								)}>
									{brokenImages.length > 0 ? (
										<AlertTriangle className="w-5 h-5 text-violet-600" />
									) : (
										<ImageIcon className="w-5 h-5 text-slate-600" />
									)}
								</div>
								<div>
									<h4 className="font-semibold text-slate-800 text-sm">{t('images')}</h4>
									<p className="text-xs text-slate-500">
										{showBrokenImages
											? brokenImages.length > 0
												? `${brokenImages.length} ${t('broken')}`
												: t('allGood')
											: t('notChecked')}
									</p>
								</div>
							</div>
							{brokenImages.length > 0 && (
								<span className="px-2 py-1 bg-violet-500 text-white text-xs font-bold rounded-full">
									{brokenImages.length}
								</span>
							)}
						</div>
						<button
							onClick={loadBrokenImages}
							disabled={loadingImages}
							className={cn(
								'w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
								brokenImages.length > 0
									? 'bg-violet-500 text-white hover:bg-violet-600'
									: 'bg-slate-100 text-slate-700 hover:bg-slate-200'
							)}
						>
							<RefreshCw className={cn('w-4 h-4', loadingImages && 'animate-spin')} />
							{loadingImages ? t('checking') : t('check')}
						</button>
					</div>
				</div>

				{/* Broken Items Tables - Only show when there are broken items */}
				{(brokenVideos.length > 0 || brokenAudios.length > 0 || brokenImages.length > 0) && (
					<div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
						<div className="border-b border-slate-200 px-4 py-3 bg-slate-50">
							<h3 className="font-semibold text-slate-800 flex items-center gap-2">
								<AlertTriangle className="w-4 h-4 text-amber-500" />
								{t('brokenMediaFiles')}
							</h3>
						</div>

						{/* Videos Table */}
						{brokenVideos.length > 0 && (
							<div className="border-b border-slate-100">
								<div className="px-4 py-2 bg-red-50 flex items-center gap-2">
									<Video className="w-4 h-4 text-red-600" />
									<span className="text-sm font-medium text-red-700">{t('videos')} ({brokenVideos.length})</span>
								</div>
								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<tbody>
											{brokenVideos.map((video) => (
												<tr key={video.id} className="hover:bg-slate-50 border-b border-slate-100">
													<td className="px-4 py-2 font-medium text-slate-800">{video.title}</td>
													<td className="px-4 py-2 text-slate-500 capitalize">{video.section}</td>
													<td className="px-4 py-2">
														<span className="text-xs">{getLanguageInfo(video.lang).flag}</span>
													</td>
													<td className="px-4 py-2 text-right">
														<button
															onClick={() => handleOpenEditDialog(video)}
															className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
														>
															<ArrowRightLeft className="w-4 h-4" />
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}

						{/* Audios Table */}
						{brokenAudios.length > 0 && (
							<div className="border-b border-slate-100">
								<div className="px-4 py-2 bg-amber-50 flex items-center gap-2">
									<FileAudio className="w-4 h-4 text-amber-600" />
									<span className="text-sm font-medium text-amber-700">{t('audios')} ({brokenAudios.length})</span>
								</div>
								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<tbody>
											{brokenAudios.map((audio) => (
												<tr key={audio.id} className="hover:bg-slate-50 border-b border-slate-100">
													<td className="px-4 py-2 font-medium text-slate-800">{audio.title}</td>
													<td className="px-4 py-2 text-slate-500 capitalize">{audio.section}</td>
													<td className="px-4 py-2">
														<span className="text-xs">{getLanguageInfo(audio.lang).flag}</span>
													</td>
													<td className="px-4 py-2 text-right">
														<button
															onClick={() => handleOpenEditAudioDialog(audio)}
															className="p-1.5 text-amber-600 hover:bg-amber-100 rounded transition-colors"
														>
															<ArrowRightLeft className="w-4 h-4" />
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}

						{/* Images Table */}
						{brokenImages.length > 0 && (
							<div>
								<div className="px-4 py-2 bg-violet-50 flex items-center gap-2">
									<ImageIcon className="w-4 h-4 text-violet-600" />
									<span className="text-sm font-medium text-violet-700">{t('images')} ({brokenImages.length})</span>
								</div>
								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<tbody>
											{brokenImages.map((image) => (
												<tr key={image.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-b-0">
													<td className="px-4 py-2 font-medium text-slate-800">{image.title}</td>
													<td className="px-4 py-2 text-slate-500 capitalize">{image.section}</td>
													<td className="px-4 py-2">
														<span className="text-xs">{getLanguageInfo(image.lang).flag}</span>
													</td>
													<td className="px-4 py-2 text-right">
														<button
															onClick={() => handleOpenEditImageDialog(image)}
															className="p-1.5 text-violet-600 hover:bg-violet-100 rounded transition-colors"
														>
															<ArrowRightLeft className="w-4 h-4" />
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}
					</div>
				)}

				{/* Language Tabs */}
				<div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
					<div className="border-b border-slate-200 px-6 py-4">
						<div className="flex gap-1">
							{materialsCountByLang.map(({ lang }) => {
								const langInfo = getLanguageInfo(lang)
								const isActive = selectedLang === lang
								return (
									<button
										key={lang}
										onClick={() => setSelectedLang(lang)}
										className={cn(
											'px-4 py-2.5 rounded-lg font-semibold text-sm transition-all',
											isActive
												? 'bg-indigo-100 text-indigo-700'
												: 'text-slate-500 hover:bg-slate-100'
										)}
									>
										<span className="mr-2 text-lg">{langInfo.flag}</span>
										{langInfo.name}
									</button>
								)
							})}
						</div>
					</div>

					{/* Content Table */}
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className={cn(
									'border-b-2',
									selectedLang === 'fr' && 'bg-blue-50 border-blue-500',
									selectedLang === 'ru' && 'bg-red-50 border-red-500',
									selectedLang === 'en' && 'bg-emerald-50 border-emerald-500'
								)}>
									<th className={cn(
										'px-6 py-3 text-left text-xs font-bold uppercase tracking-wider',
										selectedLang === 'fr' && 'text-blue-600',
										selectedLang === 'ru' && 'text-red-600',
										selectedLang === 'en' && 'text-emerald-600'
									)}>{t('type')}</th>
									<th className={cn(
										'px-6 py-3 text-left text-xs font-bold uppercase tracking-wider',
										selectedLang === 'fr' && 'text-blue-600',
										selectedLang === 'ru' && 'text-red-600',
										selectedLang === 'en' && 'text-emerald-600'
									)}>{t('section')}</th>
									<th className={cn(
										'px-6 py-3 text-center text-xs font-bold uppercase tracking-wider',
										selectedLang === 'fr' && 'text-blue-600',
										selectedLang === 'ru' && 'text-red-600',
										selectedLang === 'en' && 'text-emerald-600'
									)}>{t('content')}</th>
									<th className={cn(
										'px-6 py-3 text-right text-xs font-bold uppercase tracking-wider',
										selectedLang === 'fr' && 'text-blue-600',
										selectedLang === 'ru' && 'text-red-600',
										selectedLang === 'en' && 'text-emerald-600'
									)}>{t('actions')}</th>
								</tr>
							</thead>
							<tbody>
								{tableData.length === 0 ? (
									<tr>
										<td colSpan={4} className="px-6 py-16 text-center text-slate-500">
											{t('noContentAvailable')}
										</td>
									</tr>
								) : (
									tableData.map((item, index) => (
										item.isCategory ? (
											<tr key={`${item.type}-${item.section}-${index}`} className="bg-white">
												<td colSpan={4} className={cn('px-6', index === 0 ? 'pt-4 pb-3' : 'pt-8 pb-3')}>
													<div className="flex items-center gap-3">
														<div className={cn(
															'w-1 h-6 rounded',
															selectedLang === 'fr' && 'bg-blue-500',
															selectedLang === 'ru' && 'bg-red-500',
															selectedLang === 'en' && 'bg-emerald-500'
														)} />
														<span className="font-bold text-slate-800">{item.section}</span>
													</div>
												</td>
											</tr>
										) : (
											<tr
												key={`${item.type}-${item.section}-${index}`}
												className="hover:bg-slate-50 border-b border-slate-100 transition-colors"
											>
												<td className="px-6 py-4">
													<div className={cn('flex items-center gap-3', item.indent && 'pl-6')}>
														<div className={cn(
															'w-10 h-10 rounded-lg flex items-center justify-center',
															item.indent ? 'opacity-70' : '',
															selectedLang === 'fr' && 'bg-blue-100 text-blue-600',
															selectedLang === 'ru' && 'bg-red-100 text-red-600',
															selectedLang === 'en' && 'bg-emerald-100 text-emerald-600'
														)}>
															<item.icon className="w-5 h-5" />
														</div>
													</div>
												</td>
												<td className="px-6 py-4">
													<span className={cn(
														'capitalize',
														item.indent ? 'text-slate-500 text-sm' : 'font-semibold text-slate-800'
													)}>
														{item.section}
													</span>
												</td>
												<td className="px-6 py-4 text-center">
													<span className={cn(
														'inline-flex items-center justify-center min-w-[48px] px-3 py-1 rounded-full text-sm font-bold',
														selectedLang === 'fr' && 'bg-blue-100 text-blue-700',
														selectedLang === 'ru' && 'bg-red-100 text-red-700',
														selectedLang === 'en' && 'bg-emerald-100 text-emerald-700'
													)}>
														{item.count}
													</span>
												</td>
												<td className="px-6 py-4 text-right">
													{(item.type === 'material' || item.type === 'books') ? (
														<Link
															href={
																item.type === 'material'
																	? `/materials/${item.section}?lang=${selectedLang}`
																	: `/materials/books?lang=${selectedLang}`
															}
															className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg inline-flex transition-colors"
															title={t('view')}
														>
															<Eye className="w-4 h-4" />
														</Link>
													) : (
														<span className="text-slate-300 italic text-sm">—</span>
													)}
												</td>
											</tr>
										)
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* Video Edit Dialog */}
			{editVideoDialog.open && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6 border-b border-slate-200 flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
									<ArrowRightLeft className="w-6 h-6 text-amber-600" />
								</div>
								<div>
									<h3 className="text-lg font-bold text-slate-800">{t('replaceVideoLink')}</h3>
									<p className="text-sm text-slate-500">{editVideoDialog.video?.title}</p>
								</div>
							</div>
							<button onClick={handleCloseEditDialog} className="p-2 hover:bg-slate-100 rounded-lg">
								<X className="w-5 h-5 text-slate-500" />
							</button>
						</div>

						<div className="p-6 space-y-4">
							<div>
								<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('currentLink')}</label>
								<a
									href={editVideoDialog.video?.video_url}
									target="_blank"
									rel="noopener noreferrer"
									className="block text-red-500 line-through text-sm mt-1 break-all hover:underline"
								>
									{editVideoDialog.video?.video_url}
								</a>
							</div>

							<div className="flex gap-3">
								<button
									onClick={() => {
										const searchQuery = encodeURIComponent(editVideoDialog.video?.title || '')
										window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank')
									}}
									className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-lg text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
								>
									<Search className="w-4 h-4" />
									{t('searchOnYouTube')}
								</button>
								<Link
									href={`/materials/${editVideoDialog.video?.section}/${editVideoDialog.video?.id}`}
									target="_blank"
									className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-lg text-slate-600 hover:border-emerald-300 hover:text-emerald-600 transition-colors"
								>
									<ExternalLink className="w-4 h-4" />
									{t('viewMaterial')}
								</Link>
							</div>

							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">{t('newVideoLink')}</label>
								<input
									type="text"
									value={newVideoUrl}
									onChange={(e) => setNewVideoUrl(e.target.value)}
									placeholder="https://www.youtube.com/watch?v=..."
									className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
								/>
								<p className="text-xs text-slate-500 mt-1">{t('videoLinkHelp')}</p>
							</div>
						</div>

						<div className="p-6 border-t border-slate-200 flex justify-end gap-3">
							<button
								onClick={handleCloseEditDialog}
								className="px-4 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition-colors"
							>
								{t('cancel')}
							</button>
							<button
								onClick={handleSaveVideoUrl}
								disabled={savingVideo || !newVideoUrl.trim()}
								className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 transition-colors"
							>
								{savingVideo && <Loader2 className="w-4 h-4 animate-spin" />}
								{savingVideo ? t('saving') : t('save')}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Audio Edit Dialog */}
			{editAudioDialog.open && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6 border-b border-slate-200 flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
									<FileAudio className="w-6 h-6 text-amber-600" />
								</div>
								<div>
									<h3 className="text-lg font-bold text-slate-800">{t('replaceAudioLink')}</h3>
									<p className="text-sm text-slate-500">{editAudioDialog.audio?.title}</p>
								</div>
							</div>
							<button onClick={handleCloseEditAudioDialog} className="p-2 hover:bg-slate-100 rounded-lg">
								<X className="w-5 h-5 text-slate-500" />
							</button>
						</div>

						<div className="p-6 space-y-4">
							<div>
								<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('currentAudioFile')}</label>
								<p className="text-red-500 line-through text-sm mt-1 break-all">
									{editAudioDialog.audio?.audio_filename}
								</p>
							</div>

							<Link
								href={`/materials/${editAudioDialog.audio?.section}/${editAudioDialog.audio?.id}`}
								target="_blank"
								className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-lg text-slate-600 hover:border-emerald-300 hover:text-emerald-600 transition-colors"
							>
								<ExternalLink className="w-4 h-4" />
								{t('viewMaterial')}
							</Link>

							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">{t('newAudioFile')}</label>
								<input
									type="text"
									value={newAudioFilename}
									onChange={(e) => setNewAudioFilename(e.target.value)}
									placeholder="mon-audio.mp3"
									className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
								/>
								<p className="text-xs text-slate-500 mt-1">{t('audioFileHelp')}</p>
							</div>
						</div>

						<div className="p-6 border-t border-slate-200 flex justify-between">
							<button
								onClick={handleRemoveAudio}
								disabled={savingAudio}
								className="px-4 py-2.5 text-red-600 font-semibold hover:bg-red-50 rounded-lg transition-colors"
							>
								{t('removeAudio')}
							</button>
							<div className="flex gap-3">
								<button
									onClick={handleCloseEditAudioDialog}
									className="px-4 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition-colors"
								>
									{t('cancel')}
								</button>
								<button
									onClick={handleSaveAudioFilename}
									disabled={savingAudio || !newAudioFilename.trim()}
									className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 disabled:bg-slate-300 transition-colors"
								>
									{savingAudio && <Loader2 className="w-4 h-4 animate-spin" />}
									{savingAudio ? t('saving') : t('save')}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Image Edit Dialog */}
			{editImageDialog.open && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6 border-b border-slate-200 flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 rounded-lg bg-violet-100 flex items-center justify-center">
									<ImageIcon className="w-6 h-6 text-violet-600" />
								</div>
								<div>
									<h3 className="text-lg font-bold text-slate-800">{t('replaceImageLink')}</h3>
									<p className="text-sm text-slate-500">{editImageDialog.image?.title}</p>
								</div>
							</div>
							<button onClick={handleCloseEditImageDialog} className="p-2 hover:bg-slate-100 rounded-lg">
								<X className="w-5 h-5 text-slate-500" />
							</button>
						</div>

						<div className="p-6 space-y-4">
							<div>
								<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('currentImageFile')}</label>
								<p className="text-red-500 line-through text-sm mt-1 break-all">
									{editImageDialog.image?.image_filename}
								</p>
							</div>

							<Link
								href={`/materials/${editImageDialog.image?.section}/${editImageDialog.image?.id}`}
								target="_blank"
								className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-lg text-slate-600 hover:border-emerald-300 hover:text-emerald-600 transition-colors"
							>
								<ExternalLink className="w-4 h-4" />
								{t('viewMaterial')}
							</Link>

							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">{t('newImageFile')}</label>
								<input
									type="text"
									value={newImageFilename}
									onChange={(e) => setNewImageFilename(e.target.value)}
									placeholder="mon-image.jpg"
									className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
								/>
								<p className="text-xs text-slate-500 mt-1">{t('imageFileHelp')}</p>
							</div>
						</div>

						<div className="p-6 border-t border-slate-200 flex justify-between">
							<button
								onClick={handleRemoveImage}
								disabled={savingImage}
								className="px-4 py-2.5 text-red-600 font-semibold hover:bg-red-50 rounded-lg transition-colors"
							>
								{t('removeImage')}
							</button>
							<div className="flex gap-3">
								<button
									onClick={handleCloseEditImageDialog}
									className="px-4 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition-colors"
								>
									{t('cancel')}
								</button>
								<button
									onClick={handleSaveImageFilename}
									disabled={savingImage || !newImageFilename.trim()}
									className="flex items-center gap-2 px-4 py-2.5 bg-violet-500 text-white font-semibold rounded-lg hover:bg-violet-600 disabled:bg-slate-300 transition-colors"
								>
									{savingImage && <Loader2 className="w-4 h-4 animate-spin" />}
									{savingImage ? t('saving') : t('save')}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default React.memo(AdminDashboardClient)
