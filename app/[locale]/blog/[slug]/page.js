import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getBlogPost, getBlogPosts } from '@/lib/blog'
import BlogPostClient from '@/components/blog/BlogPostClient'

// Generate static params for all blog posts (ISR)
export async function generateStaticParams() {
	const locales = ['fr', 'en', 'ru']
	const params = []

	for (const locale of locales) {
		const posts = getBlogPosts(locale)
		posts.forEach(post => {
			params.push({
				locale,
				slug: post.slug,
			})
		})
	}

	return params
}

// Metadata for SEO
export async function generateMetadata({ params }) {
	const { slug, locale } = await params
	const post = getBlogPost(slug, locale)

	if (!post) {
		return {
			title: 'Post Not Found',
		}
	}

	const { frontmatter } = post

	return {
		title: frontmatter.title,
		description: frontmatter.description,
		openGraph: {
			title: frontmatter.title,
			description: frontmatter.description,
			type: 'article',
			publishedTime: frontmatter.date,
			images: frontmatter.img ? [{ url: frontmatter.img }] : [],
		},
	}
}

export default async function BlogPostPage({ params }) {
	const { slug, locale } = await params

	// Fetch post server-side - NO API route needed!
	const post = getBlogPost(slug, locale)

	if (!post) {
		notFound()
	}

	// Fetch all posts for related articles
	const allPosts = getBlogPosts(locale)

	// Get translations server-side
	const t = await getTranslations({ locale, namespace: 'blog' })

	// Pass everything to client component
	return (
		<BlogPostClient
			frontmatter={post.frontmatter}
			content={post.content}
			slug={slug}
			allPosts={allPosts}
			locale={locale}
			translations={{
				back: t('backToBlog'),
				readingTime: t('readingTime'),
				tableOfContents: t('tableOfContents'),
				shareArticle: t('shareArticle'),
				relatedArticles: t('relatedArticles'),
			}}
		/>
	)
}
