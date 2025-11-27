'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useThemeMode } from '@/context/ThemeContext'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { getBlogImageUrl } from '@/utils/mediaUrls'
import { formatBlogDate } from '@/utils/blogHelpers'
import * as gtm from '@/lib/gtm'
import { cn } from '@/lib/utils'
import { Calendar, Sparkles, Star } from 'lucide-react'

/**
 * Affiche des articles suggeres en fonction de l'article actuel
 *
 * @param {string} currentSlug - Slug de l'article actuel (pour l'exclure)
 * @param {Array} allPosts - Tous les articles disponibles
 * @param {number} maxItems - Nombre maximum d'articles a afficher (defaut: 3)
 */
export default function RelatedArticles({ currentSlug, allPosts, maxItems = 3 }) {
	const { isDark } = useThemeMode()
	const t = useTranslations('blog')
	const params = useParams()

	// Filtrer l'article actuel et limiter le nombre
	const relatedPosts = allPosts
		.filter(post => post.slug !== currentSlug)
		.slice(0, maxItems)

	const handleClick = (postSlug) => {
		gtm.event({
			event: 'blog_related_article_click',
			category: 'Blog',
			action: 'Related Article Click',
			label: postSlug,
			language: params.locale
		})
	}

	if (relatedPosts.length === 0) return null

	return (
		<section className="mt-16 mb-8">
			{/* Section Header */}
			<div className="flex items-center justify-center gap-3 mb-8">
				<Star className={cn(
					'w-5 h-5',
					isDark ? 'text-amber-400' : 'text-amber-500'
				)} />
				<h2 className={cn(
					'text-2xl md:text-3xl font-black text-center',
					'bg-gradient-to-r from-violet-500 to-cyan-500',
					'bg-clip-text text-transparent'
				)}>
					{t('relatedArticles') || 'Vous aimerez aussi'}
				</h2>
				<Star className={cn(
					'w-5 h-5',
					isDark ? 'text-amber-400' : 'text-amber-500'
				)} />
			</div>

			{/* Articles Grid */}
			<div className={cn(
				'grid gap-6',
				maxItems === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
			)}>
				{relatedPosts.map((post, index) => (
					<Link
						key={index}
						href={`/blog/${post.slug}`}
						onClick={() => handleClick(post.slug)}
						className="block group"
					>
						<article className={cn(
							'h-full rounded-2xl overflow-hidden',
							'border-2 transition-all duration-300',
							isDark
								? 'bg-slate-900/80 border-violet-500/20'
								: 'bg-white/90 border-violet-600/10',
							'shadow-lg',
							isDark ? 'shadow-black/20' : 'shadow-slate-200/50',
							'hover:-translate-y-2 hover:shadow-xl',
							isDark
								? 'hover:border-violet-400/50 hover:shadow-violet-500/20'
								: 'hover:border-violet-500/30 hover:shadow-violet-400/30'
						)}>
							{/* Image */}
							<div className="relative h-44 overflow-hidden">
								<Image
									fill
									className="object-cover transition-all duration-500 group-hover:scale-105"
									sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
									src={getBlogImageUrl(post)}
									alt={post.title || post.frontmatter?.title}
								/>
								{/* Gradient overlay */}
								<div className={cn(
									'absolute inset-0',
									'bg-gradient-to-t from-black/50 via-transparent to-transparent',
									'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
								)} />
								{/* Decorative corner */}
								<div className={cn(
									'absolute top-0 right-0 w-20 h-20',
									'bg-gradient-to-bl from-violet-500/20 to-transparent'
								)} />
							</div>

							{/* Content */}
							<div className="p-5">
								{/* Date badge */}
								<div className={cn(
									'inline-flex items-center gap-1.5 px-3 py-1 mb-3',
									'rounded-full text-xs font-semibold',
									isDark
										? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
										: 'bg-violet-500/10 text-violet-600 border border-violet-500/20'
								)}>
									<Calendar className="w-3 h-3" />
									{formatBlogDate(post.published_at || post.frontmatter?.date, params.locale)}
								</div>

								{/* Title */}
								<h3 className={cn(
									'font-bold text-lg leading-tight mb-2',
									'line-clamp-2 transition-colors',
									isDark ? 'text-slate-100' : 'text-slate-800',
									'group-hover:text-violet-500 dark:group-hover:text-violet-400'
								)}>
									{post.title || post.frontmatter?.title}
								</h3>

								{/* Excerpt */}
								<p className={cn(
									'text-sm leading-relaxed line-clamp-3',
									isDark ? 'text-slate-400' : 'text-slate-600'
								)}>
									{post.excerpt || post.frontmatter?.excerpt}
								</p>
							</div>
						</article>
					</Link>
				))}
			</div>
		</section>
	)
}
