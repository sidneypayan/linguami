import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import matter from 'gray-matter'
import { marked } from 'marked'
import fs from 'fs'
import path from 'path'
import { Box, Container, Typography, IconButton, Chip } from '@mui/material'
import { ArrowBack, CalendarTodayRounded } from '@mui/icons-material'

const Post = ({ frontmatter: { title, date, img }, slug, content }) => {
	return (
		<>
			<Head>
				<title>{title} | Linguami Blog</title>
				{/* <meta name='description' content={description} /> */}
			</Head>

			{/* Hero Section with Image */}
			<Box
				sx={{
					position: 'relative',
					width: '100%',
					height: { xs: '300px', sm: '400px', md: '500px' },
					overflow: 'hidden',
					marginTop: { xs: '56px', sm: '64px' },
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
							backgroundColor: 'rgba(255, 255, 255, 0.95)',
							backdropFilter: 'blur(8px)',
							boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
							transition: 'all 0.3s ease',
							'&:hover': {
								backgroundColor: 'white',
								transform: 'scale(1.05)',
								boxShadow: '0 6px 25px rgba(102, 126, 234, 0.3)',
							},
							'&:active': {
								transform: 'scale(0.95)',
							},
						}}>
						<ArrowBack sx={{ color: '#667eea' }} />
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
							backgroundColor: 'rgba(255, 255, 255, 0.95)',
							backdropFilter: 'blur(8px)',
							color: '#667eea',
							fontWeight: 600,
							fontSize: '0.95rem',
							padding: '20px 8px',
							boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
							'& .MuiChip-icon': {
								color: '#667eea',
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
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
									color: '#667eea',
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
							backgroundColor: 'rgba(102, 126, 234, 0.1)',
							color: '#667eea',
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
							borderLeft: '4px solid #667eea',
							paddingLeft: { xs: 2, sm: 3 },
							paddingRight: { xs: 2, sm: 3 },
							paddingTop: 2,
							paddingBottom: 2,
							marginLeft: 0,
							marginRight: 0,
							marginBottom: 3,
							fontStyle: 'italic',
							color: '#718096',
							backgroundColor: 'rgba(102, 126, 234, 0.05)',
							borderRadius: 2,
							fontSize: '1.05em',
							'& p': {
								marginBottom: 0,
							},
						},

						// Liens
						'& a': {
							color: '#667eea',
							textDecoration: 'none',
							fontWeight: 600,
							borderBottom: '2px solid rgba(102, 126, 234, 0.3)',
							transition: 'all 0.2s ease',
							'&:hover': {
								borderBottomColor: '#667eea',
								color: '#764ba2',
							},
						},

						// Séparateurs
						'& hr': {
							border: 'none',
							borderTop: '2px solid rgba(102, 126, 234, 0.2)',
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
								borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
								textAlign: 'left',
							},
							'& th': {
								backgroundColor: 'rgba(102, 126, 234, 0.1)',
								fontWeight: 700,
								color: '#667eea',
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
