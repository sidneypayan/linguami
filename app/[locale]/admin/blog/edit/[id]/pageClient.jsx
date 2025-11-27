'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import { Save, ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import TextEditor from '@/components/shared/TextEditor'
import { getBlogPostByIdAction, updateBlogPostAction } from '@/app/actions/blog'
import AdminNavbar from '@/components/admin/AdminNavbar'

export default function BlogEditClient({ postId }) {
	const router = useRouter()
	const locale = useLocale()
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)

	const [formData, setFormData] = useState({
		title: '',
		slug: '',
		excerpt: '',
		content: '',
		lang: locale,
		img: '',
		meta_description: '',
		is_published: false,
	})

	useEffect(() => {
		loadPost()
	}, [postId])

	const loadPost = async () => {
		const result = await getBlogPostByIdAction(postId)

		if (result.success) {
			setFormData({
				title: result.data.title,
				slug: result.data.slug,
				excerpt: result.data.excerpt,
				content: result.data.content,
				lang: result.data.lang,
				img: result.data.img || '',
				meta_description: result.data.meta_description || '',
				is_published: result.data.is_published,
			})
		} else {
			toast.error(result.error || 'Failed to load post')
			router.push(`/${locale}/admin/blog`)
		}

		setLoading(false)
	}

	const handleChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
	}

	const handleSave = async () => {
		// Validation
		if (!formData.title.trim()) {
			toast.error('Title is required')
			return
		}
		if (!formData.slug.trim()) {
			toast.error('Slug is required')
			return
		}
		if (!formData.excerpt.trim()) {
			toast.error('Excerpt is required')
			return
		}
		if (!formData.content.trim()) {
			toast.error('Content is required')
			return
		}
		if (formData.meta_description && formData.meta_description.length > 160) {
			toast.error('Meta description must be 160 characters or less')
			return
		}
		if (formData.excerpt.length > 500) {
			toast.error('Excerpt must be 500 characters or less')
			return
		}

		setSaving(true)

		const result = await updateBlogPostAction(postId, formData)

		if (result.success) {
			toast.success('Blog post updated!')
			router.push(`/${locale}/admin/blog`)
		} else {
			toast.error(result.error || 'Failed to update post')
		}

		setSaving(false)
	}

	if (loading) {
		return (
			<>
				<AdminNavbar activePage="blog" />
				<div className="flex justify-center items-center min-h-[60vh]">
					<Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
				</div>
			</>
		)
	}

	return (
		<>
			<AdminNavbar activePage="blog" />

			<div className="max-w-5xl mx-auto px-4 pt-16 md:pt-24 pb-8">
				{/* Header */}
				<div className="flex items-center gap-3 mb-6">
					<button
						onClick={() => router.push(`/${locale}/admin/blog`)}
						className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors"
					>
						<ArrowLeft className="w-5 h-5" />
						Back
					</button>
					<h1 className="text-2xl font-bold text-slate-800">Edit Blog Post</h1>
				</div>

				{/* Form */}
				<div className="bg-white rounded-xl border border-slate-200 p-6">
					<div className="space-y-6">
						{/* Title */}
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1.5">
								Title *
							</label>
							<input
								type="text"
								value={formData.title}
								onChange={(e) => handleChange('title', e.target.value)}
								className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
								required
							/>
						</div>

						{/* Slug + Language */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1.5">
									Slug *
								</label>
								<input
									type="text"
									value={formData.slug}
									onChange={(e) => handleChange('slug', e.target.value)}
									className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
									required
								/>
								<p className="text-xs text-slate-500 mt-1">URL-friendly identifier</p>
							</div>

							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1.5">
									Language *
								</label>
								<select
									value={formData.lang}
									onChange={(e) => handleChange('lang', e.target.value)}
									className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
								>
									<option value="fr">Francais</option>
									<option value="en">English</option>
									<option value="ru">Русский</option>
								</select>
							</div>
						</div>

						{/* Excerpt */}
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1.5">
								Excerpt *
							</label>
							<textarea
								value={formData.excerpt}
								onChange={(e) => handleChange('excerpt', e.target.value)}
								rows={2}
								className={cn(
									'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none',
									formData.excerpt.length > 500 ? 'border-red-300' : 'border-slate-200'
								)}
								required
							/>
							<p className={cn(
								'text-xs mt-1',
								formData.excerpt.length > 500 ? 'text-red-500' : 'text-slate-500'
							)}>
								Short description for listing ({formData.excerpt.length}/500 chars)
							</p>
						</div>

						{/* Image + Meta Description */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1.5">
									Image
								</label>
								<input
									type="text"
									value={formData.img}
									onChange={(e) => handleChange('img', e.target.value)}
									className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
								/>
								<p className="text-xs text-slate-500 mt-1">Image filename or URL</p>
							</div>

							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1.5">
									Meta Description
								</label>
								<input
									type="text"
									value={formData.meta_description}
									onChange={(e) => handleChange('meta_description', e.target.value)}
									className={cn(
										'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none',
										formData.meta_description.length > 160 ? 'border-red-300' : 'border-slate-200'
									)}
								/>
								<p className={cn(
									'text-xs mt-1',
									formData.meta_description.length > 160 ? 'text-red-500' : 'text-slate-500'
								)}>
									SEO description ({formData.meta_description.length}/160 chars)
								</p>
							</div>
						</div>

						{/* Content */}
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1.5">
								Content (Markdown) *
							</label>
							<TextEditor
								value={formData.content}
								setValue={(value) => handleChange('content', value)}
								height={600}
							/>
						</div>

						{/* Published */}
						<div className="flex items-center gap-3">
							<label className="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={formData.is_published}
									onChange={(e) => handleChange('is_published', e.target.checked)}
									className="sr-only peer"
								/>
								<div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
								<span className="ms-3 text-sm font-medium text-slate-700">Published</span>
							</label>
						</div>

						{/* Actions */}
						<div className="flex gap-3 pt-4 border-t border-slate-200">
							<button
								onClick={handleSave}
								disabled={saving}
								className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
							>
								<Save className="w-4 h-4" />
								{saving ? 'Saving...' : 'Save Changes'}
							</button>
							<button
								onClick={() => router.push(`/${locale}/admin/blog`)}
								className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
