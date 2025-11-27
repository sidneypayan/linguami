'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Upload, Info, CheckCircle } from 'lucide-react'
import { audioSections, videoSections, lang, level } from '@/utils/constants'

// Simple input component
const FormInput = ({ label, value, onChange, name, placeholder, type = 'text', multiline = false, rows = 4 }) => {
	if (multiline) {
		return (
			<div className="space-y-1.5">
				{label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
				<textarea
					name={name}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					rows={rows}
					className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none bg-white"
				/>
			</div>
		)
	}
	return (
		<div className="space-y-1.5">
			{label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
			<input
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
			/>
		</div>
	)
}

// Simple select component
const FormSelect = ({ label, value, onChange, name, options }) => {
	return (
		<div className="space-y-1.5">
			{label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
			<select
				name={name}
				value={value}
				onChange={onChange}
				className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white appearance-none cursor-pointer"
			>
				<option value="">--</option>
				{options.map(opt => (
					<option key={opt} value={opt}>{opt}</option>
				))}
			</select>
		</div>
	)
}

const CreateMaterialForm = ({ formData, handleChange }) => {
	const t = useTranslations('admin')

	return (
		<div className="space-y-6">
			{/* Configuration Section */}
			<div>
				<div className="mb-4">
					<h3 className="text-lg font-bold text-slate-800 mb-1">{t('materialConfiguration')}</h3>
					<p className="text-sm text-slate-500">{t('materialConfigDesc')}</p>
				</div>

				<div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
					<p className="text-sm font-semibold text-amber-800">{t('allFieldsRequired')}</p>
				</div>

				<div className="space-y-4">
					{/* Language Settings */}
					<div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
						<div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
							<span className="text-sm font-bold text-slate-600">{t('languageSettings')}</span>
							<span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">{t('required')}</span>
						</div>
						<div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormSelect
								label={t('language')}
								value={formData.lang ?? ''}
								onChange={handleChange}
								name="lang"
								options={lang}
							/>
							<FormSelect
								label={t('difficultyLevel')}
								value={formData.level ?? ''}
								onChange={handleChange}
								name="level"
								options={level}
							/>
						</div>
					</div>

					{/* Category */}
					<div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
						<div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
							<span className="text-sm font-bold text-slate-600">{t('category')}</span>
							<span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">{t('required')}</span>
						</div>
						<div className="p-4">
							<label className="block text-sm font-medium text-slate-700 mb-1.5">{t('section')}</label>
							<select
								name="section"
								value={formData.section ?? ''}
								onChange={handleChange}
								className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white appearance-none cursor-pointer"
							>
								<option value="">--</option>
								<optgroup label="📝 Text & Audio" className="font-semibold">
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
									<option value="folk">Folk / Traditional</option>
									<option value="variety">Variety</option>
									<option value="kids">Kids</option>
								</optgroup>
							</select>
						</div>
					</div>
				</div>
			</div>

			{/* Content Section */}
			{formData.lang && formData.level && formData.section && (
				<div>
					<div className="mb-4">
						<h3 className="text-lg font-bold text-slate-800 mb-1">{t('materialContent')}</h3>
						<p className="text-sm text-slate-500">{t('materialContentDesc')}</p>
					</div>

					<div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
						<p className="text-sm font-semibold text-amber-800">{t('titleAndBodyRequired')}</p>
					</div>

					<div className="space-y-4">
						{/* Title */}
						<div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
							<div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
								<span className="text-sm font-bold text-slate-600">{t('title')}</span>
								<span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">{t('required')}</span>
							</div>
							<div className="p-4">
								<FormInput
									label={t('materialTitle')}
									value={formData.title ?? ''}
									onChange={handleChange}
									name="title"
									placeholder={t('materialTitlePlaceholder')}
								/>
							</div>
						</div>

						{/* Material Text */}
						<div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
							<div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
								<span className="text-sm font-bold text-slate-600">{t('materialText')}</span>
								<span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">{t('required')}</span>
							</div>
							<div className="p-4">
								<div className={cn(
									'grid gap-4',
									formData.lang === 'ru' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
								)}>
									<div>
										<p className="text-xs font-semibold text-slate-500 mb-2">
											{formData.lang === 'ru' ? t('textWithoutAccents') : t('materialText')}
										</p>
										<FormInput
											value={formData.content ?? ''}
											onChange={handleChange}
											name="content"
											multiline={true}
											rows={20}
											placeholder={formData.lang === 'ru' ? t('textWithoutAccentsPlaceholder') : t('textWithAccentsPlaceholder')}
										/>
									</div>
									{formData.lang === 'ru' && (
										<div>
											<p className="text-xs font-semibold text-slate-500 mb-2">
												{t('textWithAccents')}
											</p>
											<FormInput
												value={formData.content_accented ?? ''}
												onChange={handleChange}
												name="content_accented"
												multiline={true}
												rows={20}
												placeholder={t('textWithAccentsPlaceholder')}
											/>
										</div>
									)}
								</div>
								{formData.lang === 'ru' && (
									<div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
										<CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
										<p className="text-xs text-blue-700">{t('textVersionsInfo')}</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Media Section */}
			{formData.section && formData.title && formData.content && (
				<div>
					<div className="mb-4">
						<h3 className="text-lg font-bold text-slate-800 mb-1">{t('mediaFilesTitle')}</h3>
						<p className="text-sm text-slate-500">{t('mediaFilesDesc')}</p>
					</div>

					{formData.section === 'book-chapters' && (
						<div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
							<p className="text-sm font-semibold text-amber-800">{t('bookFieldsRequired')}</p>
						</div>
					)}

					{audioSections.includes(formData.section) && (
						<div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
							<p className="text-sm font-semibold text-amber-800">{t('imageAndAudioRequired')}</p>
						</div>
					)}

					{videoSections.includes(formData.section) && (
						<div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
							<p className="text-sm font-semibold text-amber-800">{t('imageAndVideoRequired')}</p>
						</div>
					)}

					<div className="space-y-4">
						{/* Files */}
						<div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
							<div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
								<span className="text-sm font-bold text-slate-600">{t('files')}</span>
							</div>
							<div className="p-4 space-y-6">
								{/* Image Upload */}
								<div>
									<p className="text-sm font-semibold text-slate-600 mb-3">{t('image')}</p>
									<label className={cn(
										'flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors',
										formData.image_filename
											? 'border-slate-200 text-slate-400 cursor-not-allowed'
											: 'border-indigo-300 text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50/50'
									)}>
										<Upload className="w-5 h-5" />
										<span className="font-semibold">{t('uploadImage')}</span>
										<input
											onChange={handleChange}
											name="image_filename"
											type="file"
											accept="image/*"
											className="hidden"
											disabled={!!formData.image_filename}
										/>
									</label>

									<div className="flex items-center gap-4 my-4">
										<div className="flex-1 border-t border-slate-200" />
										<span className="text-sm font-semibold text-slate-400">{t('or')}</span>
										<div className="flex-1 border-t border-slate-200" />
									</div>

									<FormInput
										label={t('imageFileName')}
										value={typeof formData.image_filename === 'string' ? formData.image_filename : ''}
										onChange={(e) => handleChange({ target: { name: 'image_filename', value: e.target.value } })}
										placeholder="exemple: mon-image.jpg"
									/>
									<p className="text-xs text-slate-500 mt-1">{t('fileNameOnlyHelper')}</p>

									{formData.image_filename && (
										<div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
											<CheckCircle className="w-4 h-4 text-emerald-500" />
											<span className="text-sm font-semibold text-emerald-700">
												{formData.image_filename}
											</span>
										</div>
									)}
								</div>

								{/* Audio Upload */}
								{audioSections.includes(formData.section) && (
									<div>
										<p className="text-sm font-semibold text-slate-600 mb-3">{t('audio')}</p>
										<label className={cn(
											'flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors',
											formData.audio_filename
												? 'border-slate-200 text-slate-400 cursor-not-allowed'
												: 'border-indigo-300 text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50/50'
										)}>
											<Upload className="w-5 h-5" />
											<span className="font-semibold">{t('uploadAudio')}</span>
											<input
												onChange={handleChange}
												name="audio_filename"
												type="file"
												accept="audio/*"
												className="hidden"
												disabled={!!formData.audio_filename}
											/>
										</label>

										<div className="flex items-center gap-4 my-4">
											<div className="flex-1 border-t border-slate-200" />
											<span className="text-sm font-semibold text-slate-400">{t('or')}</span>
											<div className="flex-1 border-t border-slate-200" />
										</div>

										<FormInput
											label={t('audioFileName')}
											value={typeof formData.audio_filename === 'string' ? formData.audio_filename : ''}
											onChange={(e) => handleChange({ target: { name: 'audio_filename', value: e.target.value } })}
											placeholder="exemple: mon-audio.mp3"
										/>
										<p className="text-xs text-slate-500 mt-1">{t('fileNameOnlyHelper')}</p>

										{formData.audio_filename && (
											<div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
												<CheckCircle className="w-4 h-4 text-emerald-500" />
												<span className="text-sm font-semibold text-emerald-700">
													{formData.audio_filename}
												</span>
											</div>
										)}
									</div>
								)}
							</div>
						</div>

						{/* Video URL */}
						{videoSections.includes(formData.section) && (
							<div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
								<div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
									<span className="text-sm font-bold text-slate-600">{t('videoUrl')}</span>
								</div>
								<div className="p-4">
									<FormInput
										label={t('youtubeLink')}
										value={formData.video_url ?? ''}
										onChange={handleChange}
										name="video_url"
										placeholder="https://www.youtube.com/watch?v=..."
									/>
								</div>
							</div>
						)}

						{/* Book Chapter */}
						{formData.section === 'book-chapters' && (
							<div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
								<div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
									<span className="text-sm font-bold text-slate-600">{t('bookReference')}</span>
									<span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">{t('required')}</span>
								</div>
								<div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
									<FormInput
										label={t('bookId')}
										value={formData.book_id ?? ''}
										onChange={handleChange}
										name="book_id"
										type="number"
										placeholder="1"
									/>
									<FormInput
										label={t('chapterNumber')}
										value={formData.chapter_number ?? ''}
										onChange={handleChange}
										name="chapter_number"
										type="number"
										placeholder="1"
									/>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export default CreateMaterialForm
