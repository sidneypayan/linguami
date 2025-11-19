import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getBlogPostBySlugAction, getPublishedBlogPostsAction, getPublishedBlogPostsForBuildAction } from '@/app/actions/blog'
import BlogPostClient from '@/components/blog/BlogPostClient'

// Generate static params for all published blog posts (ISR)
export async function generateStaticParams() {
	const locales = ['fr', 'en', 'ru']
	const params = []

	for (const locale of locales) {
		const posts = await getPublishedBlogPostsForBuildAction(locale)
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
	const post = await getBlogPostBySlugAction({ slug, lang: locale })

	if (!post) {
		return {
			title: 'Post Not Found',
		}
	}

	return {
		title: post.title,
		description: post.meta_description || post.excerpt,
		openGraph: {
			title: post.title,
			description: post.meta_description || post.excerpt,
			type: 'article',
			publishedTime: post.published_at,
			images: post.img ? [{ url: post.img }] : [],
		},
	}
}

export default async function BlogPostPage({ params }) {
	const { slug, locale } = await params

	// Fetch post from Supabase
	const post = await getBlogPostBySlugAction({ slug, lang: locale })

	if (!post) {
		notFound()
	}

	// Fetch all published posts for related articles
	const allPosts = await getPublishedBlogPostsAction(locale)

	// Get translations server-side
	const t = await getTranslations({ locale, namespace: 'blog' })

	// Transform post data to match BlogPostClient expected format
	const frontmatter = {
		title: post.title,
		date: post.published_at,
		excerpt: post.excerpt,
		img: post.img,
	}

	// Pass everything to client component
	return (
		<BlogPostClient
			frontmatter={frontmatter}
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
