'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import {
	Box,
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	IconButton,
	Chip,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from '@mui/material'
import { Edit, Delete, Add, Visibility } from '@mui/icons-material'
import { toast } from 'sonner'
import { getAllBlogPostsAction, deleteBlogPostAction } from '@/app/actions/blog'

export default function BlogListClient() {
	const router = useRouter()
	const locale = useLocale()
	const [posts, setPosts] = useState([])
	const [loading, setLoading] = useState(true)
	const [langFilter, setLangFilter] = useState('all')

	useEffect(() => {
		loadPosts()
	}, [langFilter])

	const loadPosts = async () => {
		setLoading(true)
		const result = await getAllBlogPostsAction({
			lang: langFilter === 'all' ? undefined : langFilter,
		})

		if (result.success) {
			setPosts(result.data)
		} else {
			toast.error(result.error || 'Failed to load blog posts')
		}
		setLoading(false)
	}

	const handleDelete = async (id, title) => {
		if (!confirm(`Are you sure you want to delete "${title}"?`)) return

		const result = await deleteBlogPostAction(id)

		if (result.success) {
			toast.success('Blog post deleted')
			loadPosts()
		} else {
			toast.error(result.error || 'Failed to delete post')
		}
	}

	const formatDate = (dateString) => {
		if (!dateString) return 'Not published'
		return new Date(dateString).toLocaleDateString(locale, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		})
	}

	return (
		<Box sx={{ p: 3 }}>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					mb: 3,
				}}>
				<Typography variant="h4">Blog Posts</Typography>
				<Box sx={{ display: 'flex', gap: 2 }}>
					<FormControl size="small" sx={{ minWidth: 120 }}>
						<InputLabel>Language</InputLabel>
						<Select
							value={langFilter}
							label="Language"
							onChange={(e) => setLangFilter(e.target.value)}>
							<MenuItem value="all">All</MenuItem>
							<MenuItem value="fr">Français</MenuItem>
							<MenuItem value="en">English</MenuItem>
							<MenuItem value="ru">Русский</MenuItem>
						</Select>
					</FormControl>
					<Button
						variant="contained"
						startIcon={<Add />}
						onClick={() => router.push(`/${locale}/admin/blog/create`)}>
						New Post
					</Button>
				</Box>
			</Box>

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Title</TableCell>
							<TableCell>Slug</TableCell>
							<TableCell>Lang</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Published</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={6} align="center">
									Loading...
								</TableCell>
							</TableRow>
						) : posts.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} align="center">
									No blog posts found
								</TableCell>
							</TableRow>
						) : (
							posts.map((post) => (
								<TableRow key={post.id}>
									<TableCell>{post.title}</TableCell>
									<TableCell>
										<code>{post.slug}</code>
									</TableCell>
									<TableCell>
										<Chip
											label={post.lang.toUpperCase()}
											size="small"
											color="primary"
											variant="outlined"
										/>
									</TableCell>
									<TableCell>
										{post.is_published ? (
											<Chip label="Published" size="small" color="success" />
										) : (
											<Chip label="Draft" size="small" color="default" />
										)}
									</TableCell>
									<TableCell>{formatDate(post.published_at)}</TableCell>
									<TableCell>
										<IconButton
											size="small"
											onClick={() =>
												router.push(`/${locale}/blog/${post.slug}`)
											}
											title="View">
											<Visibility />
										</IconButton>
										<IconButton
											size="small"
											onClick={() =>
												router.push(`/${locale}/admin/blog/edit/${post.id}`)
											}
											title="Edit">
											<Edit />
										</IconButton>
										<IconButton
											size="small"
											color="error"
											onClick={() => handleDelete(post.id, post.title)}
											title="Delete">
											<Delete />
										</IconButton>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	)
}
