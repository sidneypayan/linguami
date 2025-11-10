import useTranslation from 'next-translate/useTranslation'
import BlogCard from '@/components/blog/BlogCard'
import SEO from '@/components/SEO'
import { sortPostsByDate } from '@/utils/helpers'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Container, Typography, Box, useTheme } from '@mui/material'
import { getBlogImageUrl } from '@/utils/mediaUrls'

const Blog = ({ posts }) => {
	const { t, lang } = useTranslation('blog')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	// Mots-clés SEO par langue
	const keywordsByLang = {
		fr: 'blog russe, culture russe, langue russe, articles russe, histoire russe, apprendre russe',
		ru: 'блог французский, французская культура, французский язык, статьи о французском, история Франции',
		en: 'russian blog, russian culture, russian language, french blog, french culture, language learning blog'
	}

	// JSON-LD pour Blog
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Blog',
		name: `${t('pagetitle')} | Linguami`,
		description: t('description'),
		url: `https://www.linguami.com${lang === 'fr' ? '' : `/${lang}`}/blog`,
		inLanguage: lang === 'fr' ? 'fr-FR' : lang === 'ru' ? 'ru-RU' : 'en-US',
		blogPost: posts.slice(0, 5).map((post, index) => ({
			'@type': 'BlogPosting',
			headline: post.frontmatter.title,
			datePublished: post.frontmatter.date,
			image: getBlogImageUrl(post),
			url: `https://www.linguami.com${lang === 'fr' ? '' : `/${lang}`}/blog/${post.slug}`,
			author: {
				'@type': 'Organization',
				name: 'Linguami'
			}
		}))
	}

	return (
		<>
			<SEO
				title={`${t('pagetitle')} | Linguami`}
				description={t('description')}
				path='/blog'
				keywords={keywordsByLang[lang]}
				jsonLd={jsonLd}
			/>

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
				{/* Blog Posts */}
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: { xs: 2.5, sm: 3 },
						maxWidth: '800px',
						mx: 'auto',
					}}>
					{posts.map((post, index) => (
						<BlogCard key={index} post={post} />
					))}
				</Box>
			</Container>
		</>
	)
}

export const getStaticProps = async ({ locale }) => {
	// Déterminer le dossier de posts selon la langue
	const postsDirectory = path.join('posts', locale)

	// Vérifier si le dossier existe
	if (!fs.existsSync(postsDirectory)) {
		return {
			props: {
				posts: [],
			},
		}
	}

	const files = fs.readdirSync(postsDirectory)

	const posts = files
		.filter(filename => filename.endsWith('.mdx'))
		.map(filename => {
			const slug = filename.replace('.mdx', '')

			const markdownWithMeta = fs.readFileSync(
				path.join(postsDirectory, filename),
				'utf-8'
			)

			const { data: frontmatter } = matter(markdownWithMeta)

			return { slug, frontmatter }
		})

	return {
		props: {
			posts: posts.sort(sortPostsByDate),
		},
	}
}

export default Blog
