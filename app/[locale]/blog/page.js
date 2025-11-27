import { getTranslations } from 'next-intl/server'
import { getPublishedBlogPostsAction } from '@/app/actions/blog'
import BlogList from '@/components/blog/BlogList'

// Metadata for SEO
export async function generateMetadata({ params }) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'blog' })

	return {
		title: t('pagetitle'),
		description: t('description'),
	}
}

export default async function BlogPage({ params }) {
	const { locale } = await params

	// Fetch published posts from Supabase
	const posts = await getPublishedBlogPostsAction(locale)

	// Get translations server-side
	const t = await getTranslations({ locale, namespace: 'blog' })

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="pt-20 md:pt-24 pb-12 md:pb-16">
				<div className="max-w-5xl mx-auto px-4 sm:px-6">
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-800 dark:text-slate-100 mb-4">
						{t('pagetitle')}
					</h1>
					<p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
						{t('description')}
					</p>
				</div>
			</section>

			{/* Blog Posts */}
			<section className="py-6 md:py-8 px-4 sm:px-6">
				<div className="max-w-5xl mx-auto">
					<BlogList posts={posts} locale={locale} />
				</div>
			</section>
		</div>
	)
}
