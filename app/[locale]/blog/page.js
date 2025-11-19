import { getTranslations } from 'next-intl/server'
import { Container, Typography, Box } from '@mui/material'
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
		<>
			{/* Hero Section */}
			<Box
				sx={{
					pt: { xs: '5rem', md: '6rem' },
					pb: { xs: '3rem', md: '4rem' },
				}}>
				<Container maxWidth='lg'>
					<Typography
						variant='h1'
						sx={{
							fontWeight: 700,
							fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
							color: 'text.primary',
							mb: 2,
							letterSpacing: '-0.02em',
							fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
						}}>
						{t('pagetitle')}
					</Typography>
					<Typography
						variant='body1'
						sx={{
							color: 'text.secondary',
							fontSize: { xs: '1rem', sm: '1.125rem' },
							maxWidth: '700px',
							lineHeight: 1.6,
						}}>
						{t('description')}
					</Typography>
				</Container>
			</Box>

			<Container
				maxWidth='lg'
				sx={{
					py: { xs: 3, md: 4 },
					px: { xs: 2, sm: 3 },
				}}>
				{/* Blog Posts - Client Component for filtering */}
				<BlogList posts={posts} locale={locale} />
			</Container>
		</>
	)
}
