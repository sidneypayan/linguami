import SEO from '../../components/SEO'
import Image from 'next/image'
import Link from 'next/link'
import matter from 'gray-matter'
import { marked } from 'marked'
import fs from 'fs'
import path from 'path'
import useTranslation from 'next-translate/useTranslation'
import { Box, Container, Typography, IconButton, Chip } from '@mui/material'
import { ArrowBack, CalendarTodayRounded } from '@mui/icons-material'

const Post = ({ frontmatter: { title, date, img, description }, slug, content }) => {
	const { lang } = useTranslation()

	// Générer une description si elle n'existe pas dans le frontmatter
	const pageDescription = description || `${title} - Article publié le ${date} sur le blog Linguami`

	// JSON-LD pour l'article de blog
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: title,
		datePublished: date,
		image: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}${img}`,
		author: {
			'@type': 'Organization',
			name: 'Linguami',
			url: 'https://www.linguami.com'
		},
		publisher: {
			'@type': 'Organization',
			name: 'Linguami',
			logo: {
				'@type': 'ImageObject',
				url: 'https://www.linguami.com/logo.png'
			}
		},
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `https://www.linguami.com${lang === 'fr' ? '' : `/${lang}`}/blog/${slug}`
		},
		description: pageDescription,
		inLanguage: lang === 'fr' ? 'fr-FR' : lang === 'ru' ? 'ru-RU' : 'en-US'
	}

	return (
		<>
			<SEO
				title={`${title} | Linguami Blog`}
				description={pageDescription}
				path={`/blog/${slug}`}
				image={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}${img}`}
				jsonLd={jsonLd}
			/>

			{/* Hero Section with Image */}
			<Box
				sx={{
					position: 'relative',
					width: '100%',
					height: { xs: '400px', sm: '500px', md: '600px' },
					overflow: 'hidden',
					pt: { xs: '56px', sm: '64px' },
					'&::after': {
						content: '""',
						position: 'absolute',
						bottom: 0,
						left: 0,
						right: 0,
						height: '50%',
						background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
						zIndex: 1,
					},
				}}>
				<Image
					fill
					style={{ objectFit: 'cover' }}
					quality={100}
					priority
					src={process.env.NEXT_PUBLIC_SUPABASE_IMAGE + img}
					alt={title}
				/>

				{/* Back Button */}
				<Link href="/blog" style={{ textDecoration: 'none' }}>
					<IconButton
						sx={{
							position: 'absolute',
							top: { xs: 16, sm: 24 },
							left: { xs: 16, sm: 24 },
							zIndex: 2,
							background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.95) 0%, rgba(6, 182, 212, 0.95) 100%)',
							backdropFilter: 'blur(10px)',
							border: '1px solid rgba(139, 92, 246, 0.3)',
							boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
							transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
							'&:hover': {
								background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%)',
								transform: 'scale(1.05)',
								boxShadow: '0 6px 30px rgba(139, 92, 246, 0.5)',
							},
							'&:active': {
								transform: 'scale(0.95)',
							},
						}}>
						<ArrowBack sx={{ color: 'white' }} />
					</IconButton>
				</Link>

				{/* Title and Date Overlay */}
				<Container
					maxWidth="md"
					sx={{
						position: 'absolute',
						bottom: { xs: 24, sm: 40 },
						left: '50%',
						transform: 'translateX(-50%)',
						zIndex: 2,
						px: { xs: 2, sm: 3 },
					}}>
					<Typography
						variant="h1"
						sx={{
							color: 'white',
							fontWeight: 800,
							fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
							lineHeight: 1.2,
							mb: 2,
							textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
						}}>
						{title}
					</Typography>

					<Chip
						icon={<CalendarTodayRounded sx={{ fontSize: '1rem' }} />}
						label={date}
						sx={{
							background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.95) 0%, rgba(6, 182, 212, 0.95) 100%)',
							backdropFilter: 'blur(10px)',
							color: 'white',
							border: '1px solid rgba(255, 255, 255, 0.3)',
							fontWeight: 700,
							fontSize: '0.95rem',
							padding: '20px 8px',
							boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
							'& .MuiChip-icon': {
								color: 'white',
							},
						}}
					/>
				</Container>
			</Box>

			{/* Content Section */}
			<Container
				maxWidth="md"
				sx={{
					py: { xs: 4, sm: 6, md: 8 },
					px: { xs: 2, sm: 3 },
				}}>
				<Box
					component="article"
					sx={{
						color: '#2d3748',
						fontSize: { xs: '1rem', sm: '1.0625rem' },
						lineHeight: 1.8,

						// Paragraphes
						'& p': {
							marginBottom: 3,
							color: '#4a5568',
						},

						// Titres
						'& h1, & h2, & h3, & h4, & h5, & h6': {
							fontWeight: 700,
							color: '#2d3748',
							marginTop: 4,
							marginBottom: 2,
							lineHeight: 1.3,
						},
						'& h1': { fontSize: { xs: '2rem', md: '2.5rem' } },
						'& h2': {
							fontSize: { xs: '1.75rem', md: '2rem' },
							background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 60%, #06b6d4 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
						},
						'& h3': { fontSize: { xs: '1.5rem', md: '1.75rem' } },
						'& h4': { fontSize: { xs: '1.25rem', md: '1.5rem' } },

						// Listes
						'& ul, & ol': {
							marginBottom: 3,
							paddingLeft: { xs: 3, sm: 4 },
							'& li': {
								marginBottom: 1.5,
								color: '#4a5568',
								'&::marker': {
									color: '#8b5cf6',
								},
							},
						},

						// Code blocks
						'& pre': {
							marginBottom: 3,
							padding: { xs: 2, sm: 3 },
							backgroundColor: '#1e293b',
							borderRadius: 2,
							overflow: 'auto',
							boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
							'& code': {
								backgroundColor: 'transparent',
								color: '#e2e8f0',
								padding: 0,
								fontSize: { xs: '0.875rem', sm: '0.9375rem' },
								fontFamily: 'monospace',
							},
						},

						// Inline code
						'& code': {
							backgroundColor: 'rgba(139, 92, 246, 0.1)',
							color: '#8b5cf6',
							padding: '3px 8px',
							borderRadius: 1,
							fontSize: '0.9em',
							fontFamily: 'monospace',
							fontWeight: 500,
						},

						// Images
						'& img': {
							maxWidth: '100%',
							height: 'auto',
							borderRadius: 3,
							marginTop: 3,
							marginBottom: 3,
							boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
						},

						// Citations
						'& blockquote': {
							borderLeft: '4px solid #8b5cf6',
							paddingLeft: { xs: 2, sm: 3 },
							paddingRight: { xs: 2, sm: 3 },
							paddingTop: 2,
							paddingBottom: 2,
							marginLeft: 0,
							marginRight: 0,
							marginBottom: 3,
							fontStyle: 'italic',
							color: '#718096',
							backgroundColor: 'rgba(139, 92, 246, 0.05)',
							borderRadius: 2,
							fontSize: '1.05em',
							'& p': {
								marginBottom: 0,
							},
						},

						// Liens
						'& a': {
							color: '#8b5cf6',
							textDecoration: 'none',
							fontWeight: 600,
							borderBottom: '2px solid rgba(139, 92, 246, 0.3)',
							transition: 'all 0.2s ease',
							'&:hover': {
								borderBottomColor: '#8b5cf6',
								color: '#06b6d4',
							},
						},

						// Séparateurs
						'& hr': {
							border: 'none',
							borderTop: '2px solid rgba(139, 92, 246, 0.2)',
							marginTop: 5,
							marginBottom: 5,
						},

						// Tables
						'& table': {
							width: '100%',
							borderCollapse: 'collapse',
							marginBottom: 3,
							overflow: 'auto',
							display: 'block',
							'& th, & td': {
								padding: { xs: 1, sm: 2 },
								borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
								textAlign: 'left',
							},
							'& th': {
								backgroundColor: 'rgba(139, 92, 246, 0.1)',
								fontWeight: 700,
								color: '#8b5cf6',
							},
						},
					}}
					dangerouslySetInnerHTML={{ __html: marked(content) }}></Box>
			</Container>
		</>
	)
}

export async function getStaticPaths() {
	const files = fs.readdirSync(path.join('posts'))

	const paths = files.map(filename => ({
		params: {
			slug: filename.replace('.mdx', ''),
		},
	}))

	return {
		paths,
		fallback: false,
	}
}

export async function getStaticProps({ params: { slug } }) {
	const markdownWithMeta = fs.readFileSync(
		path.join('posts', slug + '.mdx'),
		'utf-8'
	)

	const { data: frontmatter, content } = matter(markdownWithMeta)

	return {
		props: {
			frontmatter,
			slug,
			content,
		},
	}
}
export default Post
