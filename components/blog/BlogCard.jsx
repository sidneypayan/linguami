'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { ArrowRight, Sparkles } from 'lucide-react'
import { getBlogImageUrl } from '@/utils/mediaUrls'
import { formatBlogDate } from '@/utils/blogHelpers'
import { cn } from '@/lib/utils'

const BlogCard = ({ post }) => {
	const t = useTranslations('blog')
	const locale = useLocale()
	const { isDark } = useThemeMode()

	return (
		<Link href={`/blog/${post.slug}`} className="block group">
			<article className={cn(
				'flex flex-col sm:flex-row rounded-2xl overflow-hidden',
				'border-2 transition-all duration-300',
				isDark
					? 'bg-slate-900/80 border-violet-500/20 hover:border-violet-400/50'
					: 'bg-white/90 border-violet-600/10 hover:border-violet-500/30',
				!isDark && 'shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-violet-400/30',
				'hover:-translate-y-1'
			)}>
				{/* Image Section */}
				<div className="relative w-full sm:w-60 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
					{/* Decorative corner */}
					<div className={cn(
						'absolute top-0 left-0 w-16 h-16 z-10',
						'bg-gradient-to-br from-violet-500/20 to-transparent'
					)} />
					<Image
						fill
						className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
						sizes="(max-width: 640px) 100vw, 240px"
						quality={85}
						src={getBlogImageUrl(post)}
						alt={post.title || post.frontmatter?.title}
					/>
					{/* Gradient overlay */}
					<div className={cn(
						'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
						'bg-gradient-to-t from-violet-900/30 to-transparent'
					)} />
				</div>

				{/* Content Section */}
				<div className="flex-1 flex flex-col p-5 sm:p-6">
					{/* Date with sparkle */}
					<div className="flex items-center gap-2 mb-3">
						<Sparkles className={cn(
							'w-4 h-4',
							isDark ? 'text-amber-400' : 'text-amber-500'
						)} />
						<span className={cn(
							'text-sm font-medium',
							isDark ? 'text-slate-400' : 'text-slate-500'
						)}>
							{formatBlogDate(post.published_at || post.frontmatter?.date, locale)}
						</span>
					</div>

					{/* Title */}
					<h2 className={cn(
						'font-bold text-xl sm:text-[1.375rem] leading-tight mb-3',
						'line-clamp-2 tracking-tight',
						isDark ? 'text-slate-100' : 'text-slate-800',
						'group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors'
					)}>
						{post.title || post.frontmatter?.title}
					</h2>

					{/* Excerpt */}
					<p className={cn(
						'text-[0.9375rem] leading-relaxed mb-4 line-clamp-2',
						isDark ? 'text-slate-400' : 'text-slate-600'
					)}>
						{post.excerpt || post.frontmatter?.excerpt}
					</p>

					{/* Read More Link */}
					<div className={cn(
						'flex items-center gap-2 mt-auto font-semibold text-[0.9375rem]',
						'text-violet-500 dark:text-violet-400',
						'group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors'
					)}>
						<span>{t('readMore') || 'Lire la suite'}</span>
						<ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
					</div>
				</div>
			</article>
		</Link>
	)
}

export default BlogCard
