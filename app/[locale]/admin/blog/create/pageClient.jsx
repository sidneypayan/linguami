'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import {
	Box,
	Button,
	Paper,
	TextField,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormControlLabel,
	Switch,
	Grid,
} from '@mui/material'
import { Save, ArrowBack } from '@mui/icons-material'
import { toast } from 'sonner'
import TextEditor from '@/components/shared/TextEditor'
import { createBlogPostAction } from '@/app/actions/blog'

export default function BlogCreateClient() {
	const router = useRouter()
	const locale = useLocale()
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

	const handleChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }))

		// Auto-generate slug from title
		if (field === 'title' && !formData.slug) {
			const slug = value
				.toLowerCase()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '') // Remove accents
				.replace(/[^a-z0-9\s-]/g, '') // Remove special chars
				.trim()
				.replace(/\s+/g, '-') // Replace spaces with hyphens
			setFormData((prev) => ({ ...prev, slug }))
		}
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

		const result = await createBlogPostAction(formData)

		if (result.success) {
			toast.success('Blog post created!')
			router.push(`/${locale}/admin/blog`)
		} else {
			toast.error(result.error || 'Failed to create post')
		}

		setSaving(false)
	}

	return (
		<Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
			<Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
				<Button
					startIcon={<ArrowBack />}
					onClick={() => router.push(`/${locale}/admin/blog`)}>
					Back
				</Button>
				<Typography variant="h4">Create Blog Post</Typography>
			</Box>

			<Paper sx={{ p: 3 }}>
				<Grid container spacing={3}>
					{/* Title */}
					<Grid item xs={12}>
						<TextField
							fullWidth
							label="Title"
							value={formData.title}
							onChange={(e) => handleChange('title', e.target.value)}
							required
						/>
					</Grid>

					{/* Slug */}
					<Grid item xs={12} md={6}>
						<TextField
							fullWidth
							label="Slug"
							value={formData.slug}
							onChange={(e) => handleChange('slug', e.target.value)}
							helperText="URL-friendly identifier"
							required
						/>
					</Grid>

					{/* Language */}
					<Grid item xs={12} md={6}>
						<FormControl fullWidth required>
							<InputLabel>Language</InputLabel>
							<Select
								value={formData.lang}
								label="Language"
								onChange={(e) => handleChange('lang', e.target.value)}>
								<MenuItem value="fr">Français</MenuItem>
								<MenuItem value="en">English</MenuItem>
								<MenuItem value="ru">Русский</MenuItem>
							</Select>
						</FormControl>
					</Grid>

					{/* Excerpt */}
					<Grid item xs={12}>
						<TextField
							fullWidth
							label="Excerpt"
							value={formData.excerpt}
							onChange={(e) => handleChange('excerpt', e.target.value)}
							multiline
							rows={2}
							helperText={`Short description for listing (${formData.excerpt.length}/500 chars)`}
							required
							error={formData.excerpt.length > 500}
						/>
					</Grid>

					{/* Image */}
					<Grid item xs={12} md={6}>
						<TextField
							fullWidth
							label="Image"
							value={formData.img}
							onChange={(e) => handleChange('img', e.target.value)}
							helperText="Image filename or URL"
						/>
					</Grid>

					{/* Meta Description */}
					<Grid item xs={12} md={6}>
						<TextField
							fullWidth
							label="Meta Description"
							value={formData.meta_description}
							onChange={(e) => handleChange('meta_description', e.target.value)}
							helperText={`SEO description (${formData.meta_description.length}/160 chars)`}
							error={formData.meta_description.length > 160}
						/>
					</Grid>

					{/* Content (Markdown Editor) */}
					<Grid item xs={12}>
						<Typography variant="subtitle1" gutterBottom>
							Content (Markdown)
						</Typography>
						<TextEditor
							value={formData.content}
							setValue={(value) => handleChange('content', value)}
							height={600}
						/>
					</Grid>

					{/* Published */}
					<Grid item xs={12}>
						<FormControlLabel
							control={
								<Switch
									checked={formData.is_published}
									onChange={(e) => handleChange('is_published', e.target.checked)}
								/>
							}
							label="Publish immediately"
						/>
					</Grid>

					{/* Actions */}
					<Grid item xs={12}>
						<Box sx={{ display: 'flex', gap: 2 }}>
							<Button
								variant="contained"
								startIcon={<Save />}
								onClick={handleSave}
								disabled={saving}>
								{saving ? 'Saving...' : 'Create Post'}
							</Button>
							<Button
								variant="outlined"
								onClick={() => router.push(`/${locale}/admin/blog`)}>
								Cancel
							</Button>
						</Box>
					</Grid>
				</Grid>
			</Paper>
		</Box>
	)
}
