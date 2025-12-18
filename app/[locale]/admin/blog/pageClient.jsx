'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Edit, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { getAllBlogPostsAction, deleteBlogPostAction } from '@/app/actions/blog'
import AdminNavbar from '@/components/admin/AdminNavbar'

// Badge component
const Badge = ({ children, variant = 'default', size = 'sm' }) => {
	const variants = {
		default: 'bg-slate-100 text-slate-700',
		primary: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
		success: 'bg-emerald-100 text-emerald-700',
	}

	const sizes = {
		sm: 'px-2 py-0.5 text-xs',
		md: 'px-3 py-1 text-sm',
	}

	return (
		<span className={cn('rounded-full font-medium', variants[variant], sizes[size])}>
			{children}
		</span>
	)
}

export default function BlogListClient() {
	const router = useRouter()
	const locale = useLocale()
	const t = useTranslations('admin')
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
		<>
			<AdminNavbar activePage="blog" />

			<div className="max-w-6xl mx-auto px-4 pt-8 md:pt-16 pb-8">
				{/* Header */}
				<div className="flex flex-wrap justify-between items-center gap-4 mb-6">
					<h1 className="text-2xl font-bold text-slate-800">{t('blogPosts')}</h1>
					<select
						value={langFilter}
						onChange={(e) => setLangFilter(e.target.value)}
						className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
					>
						<option value="all">{t('allLanguages')}</option>
						<option value="fr">{t('french')}</option>
						<option value="en">{t('english')}</option>
						<option value="ru">{t('russian')}</option>
					</select>
				</div>

				{/* Table */}
				<div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="bg-slate-50 border-b border-slate-200">
									<th className="px-4 py-3 text-left font-bold text-slate-700">{t('title')}</th>
									<th className="px-4 py-3 text-left font-bold text-slate-700">{t('slug')}</th>
									<th className="px-4 py-3 text-left font-bold text-slate-700">{t('language')}</th>
									<th className="px-4 py-3 text-left font-bold text-slate-700">{t('status')}</th>
									<th className="px-4 py-3 text-left font-bold text-slate-700">{t('published')}</th>
									<th className="px-4 py-3 text-right font-bold text-slate-700">{t('actions')}</th>
								</tr>
							</thead>
							<tbody>
								{loading ? (
									<tr>
										<td colSpan={6} className="px-4 py-8 text-center text-slate-500">
											Loading...
										</td>
									</tr>
								) : posts.length === 0 ? (
									<tr>
										<td colSpan={6} className="px-4 py-8 text-center text-slate-500">
											No blog posts found
										</td>
									</tr>
								) : (
									posts.map((post) => (
										<tr key={post.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
											<td className="px-4 py-3 font-medium text-slate-800">{post.title}</td>
											<td className="px-4 py-3">
												<code className="px-2 py-1 bg-slate-100 rounded text-sm text-slate-600">
													{post.slug}
												</code>
											</td>
											<td className="px-4 py-3">
												<Badge variant="primary">
													{post.lang.toUpperCase()}
												</Badge>
											</td>
											<td className="px-4 py-3">
												{post.is_published ? (
													<Badge variant="success">{t('published')}</Badge>
												) : (
													<Badge>{t('draft')}</Badge>
												)}
											</td>
											<td className="px-4 py-3 text-slate-600 text-sm">
												{formatDate(post.published_at)}
											</td>
											<td className="px-4 py-3">
												<div className="flex justify-end gap-1">
													<button
														onClick={() => router.push(`/${locale}/blog/${post.slug}`)}
														className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
														title="View"
													>
														<Eye className="w-4 h-4" />
													</button>
													<button
														onClick={() => router.push(`/${locale}/admin/blog/edit/${post.id}`)}
														className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
														title="Edit"
													>
														<Edit className="w-4 h-4" />
													</button>
													<button
														onClick={() => handleDelete(post.id, post.title)}
														className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
														title="Delete"
													>
														<Trash2 className="w-4 h-4" />
													</button>
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	)
}
