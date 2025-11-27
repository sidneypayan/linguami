'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { FileText, Info, Image as ImageIcon, Type } from 'lucide-react'
import { lang } from '@/utils/constants'

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

const CreatePostForm = ({ formData, handleChange }) => {
	const t = useTranslations('admin')

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h3 className="text-lg font-bold text-slate-800 mb-1">{t('createArticle')}</h3>
				<p className="text-sm text-slate-500">{t('createArticleDesc')}</p>
			</div>

			{/* Basic Info Card */}
			<div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
				<div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
					<FileText className="w-5 h-5 text-indigo-500" />
					<span className="text-sm font-bold text-slate-600">{t('basicInfo')}</span>
				</div>
				<div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
					<FormSelect
						label={t('language')}
						value={formData.locale ?? ''}
						onChange={handleChange}
						name="lang"
						options={lang}
					/>
					<FormInput
						label={t('articleTitle')}
						value={formData.title ?? ''}
						onChange={handleChange}
						name="title"
						placeholder={t('articleTitlePlaceholder')}
					/>
				</div>
			</div>

			{/* Description Card */}
			<div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
				<div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
					<Info className="w-5 h-5 text-indigo-500" />
					<span className="text-sm font-bold text-slate-600">{t('description')}</span>
				</div>
				<div className="p-4">
					<FormInput
						label={t('shortDescription')}
						value={formData.description ?? ''}
						onChange={handleChange}
						name="description"
						multiline={true}
						rows={3}
						placeholder={t('shortDescriptionPlaceholder')}
					/>
					<div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
						<Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
						<p className="text-xs text-blue-700">{t('descriptionInfo')}</p>
					</div>
				</div>
			</div>

			{/* Image Card */}
			<div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
				<div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<ImageIcon className="w-5 h-5 text-indigo-500" />
						<span className="text-sm font-bold text-slate-600">{t('coverImage')}</span>
					</div>
					<span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{t('optional')}</span>
				</div>
				<div className="p-4">
					<FormInput
						label={t('imageUrl')}
						value={formData.img ?? ''}
						onChange={handleChange}
						name="img"
						placeholder={t('imageUrlPlaceholder')}
					/>
				</div>
			</div>

			{/* Content Card */}
			<div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
				<div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Type className="w-5 h-5 text-indigo-500" />
						<span className="text-sm font-bold text-slate-600">{t('articleContent')}</span>
					</div>
					<span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">{t('required')}</span>
				</div>
				<div className="p-4">
					<FormInput
						label={t('articleBody')}
						value={formData.body ?? ''}
						onChange={handleChange}
						name="body"
						multiline={true}
						rows={25}
						placeholder={t('articleBodyPlaceholder')}
					/>

					<div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
						<p className="text-xs font-semibold text-slate-600 mb-2">{t('writingTips')}</p>
						<ul className="space-y-1 text-xs text-slate-500 list-disc pl-4">
							<li>{t('tip1')}</li>
							<li>{t('tip2')}</li>
							<li>{t('tip3')}</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Character Count */}
			<div className="text-center">
				<span className="text-sm text-slate-400">
					{formData.body?.length || 0} {t('characters')}
				</span>
			</div>
		</div>
	)
}

export default CreatePostForm
