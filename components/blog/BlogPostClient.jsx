'use client'

import { Link } from '@/i18n/navigation'
import { marked } from 'marked'
import { useThemeMode } from '@/context/ThemeContext'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import ReadingProgress from '@/components/blog/ReadingProgress'
import TableOfContents from '@/components/blog/TableOfContents'
import SocialShareButtons from '@/components/blog/SocialShareButtons'
import StickySignupWidget from '@/components/blog/StickySignupWidget'
import RelatedArticles from '@/components/blog/RelatedArticles'
import ArticleCTA from '@/components/blog/ArticleCTA'
import { calculateReadingTime, formatReadingTime } from '@/utils/readingTime'
import { slugify } from '@/utils/slugify'
import { formatBlogDate } from '@/utils/blogHelpers'
import { cn } from '@/lib/utils'

/**
 * Divise le contenu markdown en deux parties pour injecter un CTA
 * Coupe apres le premier ~30% du contenu (apres le 2eme H2)
 */
function splitContentForCTA(content) {
	// Trouver tous les H2 dans le contenu
	const h2Regex = /^## .+$/gm
	const matches = [...content.matchAll(h2Regex)]

	// Si moins de 3 H2, pas de split (article trop court)
	if (matches.length < 3) {
		return { before: content, after: null }
	}

	// Couper apres le 2eme H2 (environ 30% du contenu)
	const splitIndex = matches[2].index
	const before = content.substring(0, splitIndex).trim()
	const after = content.substring(splitIndex).trim()

	return { before, after }
}

export default function BlogPostClient({ frontmatter, content, slug, allPosts, locale, translations }) {
	const { isDark } = useThemeMode()

	const { title, date, img, description } = frontmatter

	// Calculer le temps de lecture
	const readingTime = calculateReadingTime(content)
	const readingTimeText = formatReadingTime(readingTime, locale)

	// Diviser le contenu pour injecter un CTA
	const { before: contentBefore, after: contentAfter } = splitContentForCTA(content)

	// Configurer marked pour ajouter des IDs aux titres H2
	marked.use({
		renderer: {
			heading(text, level) {
				if (level === 2) {
					const id = slugify(text)
					return `<h${level} id="${id}">${text}</h${level}>`
				}
				return `<h${level}>${text}</h${level}>`
			}
		}
	})

	return (
		<>
			{/* Reading Progress Bar */}
			<ReadingProgress />

			{/* Header Section */}
			<header className="pt-24 sm:pt-28 pb-8 sm:pb-10 max-w-3xl mx-auto px-4 sm:px-6">
				{/* Back Button */}
				<Link
					href="/blog"
					className={cn(
						'inline-flex items-center gap-2 mb-8 group',
						'text-slate-500 dark:text-slate-400',
						'hover:text-violet-500 dark:hover:text-violet-400',
						'transition-all duration-300'
					)}
				>
					<ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
					<span className="font-medium">{translations.back}</span>
				</Link>

				{/* Title */}
				<div className="mb-6">
					<h1 className={cn(
						'text-3xl sm:text-4xl md:text-5xl font-black',
						'leading-tight tracking-tight',
						isDark ? 'text-slate-100' : 'text-slate-800'
					)}>
						{title}
					</h1>
				</div>

				{/* Meta information */}
				<div className={cn(
					'flex items-center gap-4 flex-wrap pb-6',
					'border-b-2',
					isDark ? 'border-violet-500/20' : 'border-violet-600/10'
				)}>
					<div className="flex items-center gap-2">
						<Calendar className={cn(
							'w-4 h-4',
							isDark ? 'text-violet-400' : 'text-violet-500'
						)} />
						<span className={cn(
							'text-sm font-medium',
							isDark ? 'text-slate-400' : 'text-slate-500'
						)}>
							{formatBlogDate(date, locale)}
						</span>
					</div>
					<div className={cn(
						'w-1 h-1 rounded-full',
						isDark ? 'bg-violet-400/50' : 'bg-violet-500/50'
					)} />
					<div className="flex items-center gap-2">
						<Clock className={cn(
							'w-4 h-4',
							isDark ? 'text-cyan-400' : 'text-cyan-500'
						)} />
						<span className={cn(
							'text-sm font-medium',
							isDark ? 'text-slate-400' : 'text-slate-500'
						)}>
							{readingTimeText}
						</span>
					</div>
				</div>
			</header>

			{/* Content Section with Sidebar */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
					{/* Sidebar - Table of Contents (desktop only) */}
					<aside className="hidden lg:block lg:col-span-3">
						<TableOfContents content={content} />
					</aside>

					{/* Main Content */}
					<main className="lg:col-span-9">
						{/* Premiere partie du contenu */}
						<article
							className={cn(
								'prose prose-lg max-w-none',
								isDark ? 'prose-invert' : '',
								// Paragraphs
								'prose-p:leading-relaxed',
								isDark ? 'prose-p:text-slate-300' : 'prose-p:text-slate-600',
								// Headings
								'prose-headings:font-bold prose-headings:tracking-tight',
								isDark ? 'prose-headings:text-slate-100' : 'prose-headings:text-slate-800',
								'prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6',
								'prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4',
								// Links
								'prose-a:text-violet-500 prose-a:font-semibold prose-a:no-underline',
								'prose-a:border-b-2 prose-a:border-violet-500/30',
								'hover:prose-a:border-violet-500 hover:prose-a:text-cyan-500',
								// Lists
								'prose-li:marker:text-violet-500',
								isDark ? 'prose-li:text-slate-300' : 'prose-li:text-slate-600',
								// Code
								'prose-code:text-violet-500 prose-code:font-medium',
								isDark ? 'prose-code:bg-violet-500/20' : 'prose-code:bg-violet-500/10',
								'prose-code:px-2 prose-code:py-0.5 prose-code:rounded',
								'prose-code:before:content-none prose-code:after:content-none',
								// Pre/Code blocks
								isDark ? 'prose-pre:bg-slate-950' : 'prose-pre:bg-slate-900',
								'prose-pre:border-2',
								isDark ? 'prose-pre:border-violet-500/20' : 'prose-pre:border-violet-600/10',
								'prose-pre:shadow-lg',
								// Blockquotes
								'prose-blockquote:border-l-4 prose-blockquote:border-violet-500',
								isDark ? 'prose-blockquote:bg-violet-500/10' : 'prose-blockquote:bg-violet-500/5',
								'prose-blockquote:rounded-r-xl prose-blockquote:py-1',
								isDark ? 'prose-blockquote:text-slate-300' : 'prose-blockquote:text-slate-600',
								// Images
								'prose-img:rounded-2xl prose-img:shadow-xl',
								// HR
								isDark ? 'prose-hr:border-violet-500/20' : 'prose-hr:border-violet-600/10',
								// Tables
								'prose-th:text-violet-500',
								isDark ? 'prose-th:bg-violet-500/20' : 'prose-th:bg-violet-500/10',
								isDark ? 'prose-td:border-violet-500/20' : 'prose-td:border-violet-600/10',
							)}
							dangerouslySetInnerHTML={{ __html: marked(contentBefore) }}
						/>

						{/* CTA precoce - apres le premier tiers de l'article */}
						{contentAfter && (
							<ArticleCTA type="start-learning" className="my-12" />
						)}

						{/* Deuxieme partie du contenu (si existante) */}
						{contentAfter && (
							<article
								className={cn(
									'prose prose-lg max-w-none',
									isDark ? 'prose-invert' : '',
									// Paragraphs
									'prose-p:leading-relaxed',
									isDark ? 'prose-p:text-slate-300' : 'prose-p:text-slate-600',
									// Headings
									'prose-headings:font-bold prose-headings:tracking-tight',
									isDark ? 'prose-headings:text-slate-100' : 'prose-headings:text-slate-800',
									'prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6',
									'prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4',
									// Links
									'prose-a:text-violet-500 prose-a:font-semibold prose-a:no-underline',
									'prose-a:border-b-2 prose-a:border-violet-500/30',
									'hover:prose-a:border-violet-500 hover:prose-a:text-cyan-500',
									// Lists
									'prose-li:marker:text-violet-500',
									isDark ? 'prose-li:text-slate-300' : 'prose-li:text-slate-600',
									// Code
									'prose-code:text-violet-500 prose-code:font-medium',
									isDark ? 'prose-code:bg-violet-500/20' : 'prose-code:bg-violet-500/10',
									'prose-code:px-2 prose-code:py-0.5 prose-code:rounded',
									'prose-code:before:content-none prose-code:after:content-none',
									// Pre/Code blocks
									isDark ? 'prose-pre:bg-slate-950' : 'prose-pre:bg-slate-900',
									'prose-pre:border-2',
									isDark ? 'prose-pre:border-violet-500/20' : 'prose-pre:border-violet-600/10',
									'prose-pre:shadow-lg',
									// Blockquotes
									'prose-blockquote:border-l-4 prose-blockquote:border-violet-500',
									isDark ? 'prose-blockquote:bg-violet-500/10' : 'prose-blockquote:bg-violet-500/5',
									'prose-blockquote:rounded-r-xl prose-blockquote:py-1',
									isDark ? 'prose-blockquote:text-slate-300' : 'prose-blockquote:text-slate-600',
									// Images
									'prose-img:rounded-2xl prose-img:shadow-xl',
									// HR
									isDark ? 'prose-hr:border-violet-500/20' : 'prose-hr:border-violet-600/10',
									// Tables
									'prose-th:text-violet-500',
									isDark ? 'prose-th:bg-violet-500/20' : 'prose-th:bg-violet-500/10',
									isDark ? 'prose-td:border-violet-500/20' : 'prose-td:border-violet-600/10',
								)}
								dangerouslySetInnerHTML={{ __html: marked(contentAfter) }}
							/>
						)}

						{/* Social Share Buttons */}
						<SocialShareButtons
							title={title}
							url={`https://www.linguami.com${locale === 'fr' ? '' : `/${locale}`}/blog/${slug}`}
						/>

						{/* Related Articles */}
						<RelatedArticles
							currentSlug={slug}
							allPosts={allPosts}
							maxItems={3}
						/>
					</main>
				</div>
			</div>

			{/* Sticky Signup Widget */}
			<StickySignupWidget />
		</>
	)
}
