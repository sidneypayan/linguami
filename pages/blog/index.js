import useTranslation from 'next-translate/useTranslation'
import BlogCard from '../../components/blog/BlogCard'
import SEO from '../../components/SEO'
import { sortPostsByDate } from '../../utils/helpers'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Container, Typography, Box } from '@mui/material'
import { RssFeedRounded } from '@mui/icons-material'

const Blog = ({ posts }) => {
	const { t, lang } = useTranslation('blog')

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
			image: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}${post.frontmatter.img}`,
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
					background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
					pt: { xs: '6rem', md: '7rem' },
					pb: { xs: '5rem', md: '6rem' },
					position: 'relative',
					overflow: 'hidden',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: 'radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.25) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.2) 0%, transparent 50%)',
						pointerEvents: 'none',
					},
					'&::after': {
						content: '""',
						position: 'absolute',
						bottom: 0,
						left: 0,
						right: 0,
						height: '60px',
						background: '#ffffff',
						clipPath: 'polygon(0 50%, 100% 0, 100% 100%, 0 100%)',
					},
				}}>
				<Container
					maxWidth='lg'
					sx={{
						position: 'relative',
						zIndex: 1,
						pb: { xs: 2, md: 3 },
					}}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 2,
							mb: { xs: 2.5, md: 3 },
						}}>
						<RssFeedRounded
							sx={{
								fontSize: { xs: '2.5rem', md: '3rem' },
								color: '#06b6d4',
								filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.5))',
							}}
						/>
						<Typography
							variant='h1'
							sx={{
								fontWeight: 800,
								fontSize: { xs: '2.25rem', sm: '3rem', md: '3.5rem' },
								background: 'linear-gradient(135deg, #ffffff 0%, #8b5cf6 50%, #06b6d4 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
								backgroundSize: '200% 200%',
								animation: 'gradientShift 8s ease infinite',
								'@keyframes gradientShift': {
									'0%, 100%': {
										backgroundPosition: '0% 50%',
									},
									'50%': {
										backgroundPosition: '100% 50%',
									},
								},
							}}>
							{t('pagetitle')}
						</Typography>
					</Box>
					<Typography
						variant='h6'
						align='center'
						sx={{
							color: 'rgba(255, 255, 255, 0.9)',
							fontWeight: 500,
							fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
							maxWidth: '800px',
							mx: 'auto',
							lineHeight: 1.7,
							px: { xs: 2, sm: 0 },
						}}>
						{t('description')}
					</Typography>
				</Container>
			</Box>

			<Container
				maxWidth='lg'
				sx={{
					py: { xs: 4, md: 6 },
					px: { xs: 2, sm: 3, md: 4 },
				}}>
				{/* Blog Posts */}
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: { xs: 3, sm: 4, md: 5 },
					}}>
					{posts.map((post, index) => (
						<BlogCard key={index} post={post} />
					))}
				</Box>
			</Container>
		</>
	)
}

export const getStaticProps = async () => {
	const files = fs.readdirSync(path.join('posts'))

	const posts = files.map(filename => {
		const slug = filename.replace('.mdx', '')

		const markdownWithMeta = fs.readFileSync(
			path.join('posts', filename),
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
