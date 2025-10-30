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
			<Container
				maxWidth='lg'
				sx={{
					marginTop: { xs: '5rem', md: '8rem' },
					marginBottom: { xs: '3rem', md: '6rem' },
					px: { xs: 2, sm: 3, md: 4 },
				}}>
				{/* Header Section */}
				<Box
					sx={{
						textAlign: 'center',
						marginBottom: { xs: '3rem', md: '5rem' },
					}}>
					<Box
						sx={{
							display: 'inline-flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 1.5,
							marginBottom: 2,
							padding: '0.75rem 1.5rem',
							background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
							borderRadius: 3,
							border: '2px solid rgba(102, 126, 234, 0.2)',
						}}>
						<RssFeedRounded
							sx={{
								fontSize: '2rem',
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
							}}
						/>
						<Typography
							variant='h3'
							sx={{
								fontWeight: 700,
								fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
							}}>
							{t('pagetitle')}
						</Typography>
					</Box>
					<Typography
						variant='h6'
						sx={{
							color: '#718096',
							fontWeight: 500,
							fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
							maxWidth: '700px',
							margin: '0 auto',
							lineHeight: 1.6,
						}}>
						{t('description')}
					</Typography>
				</Box>

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
