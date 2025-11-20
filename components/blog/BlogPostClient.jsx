'use client'

import { Link } from '@/i18n/navigation'
import { marked } from 'marked'
import { Box, Container, Typography, Grid, useTheme } from '@mui/material'
import { ArrowBack, CalendarTodayRounded, AccessTimeRounded } from '@mui/icons-material'
import ReadingProgress from '@/components/blog/ReadingProgress'
import TableOfContents from '@/components/blog/TableOfContents'
import SocialShareButtons from '@/components/blog/SocialShareButtons'
import StickySignupWidget from '@/components/blog/StickySignupWidget'
import RelatedArticles from '@/components/blog/RelatedArticles'
import { calculateReadingTime, formatReadingTime } from '@/utils/readingTime'
import { slugify } from '@/utils/slugify'
import { formatBlogDate } from '@/utils/blogHelpers'

export default function BlogPostClient({ frontmatter, content, slug, allPosts, locale, translations }) {
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	const { title, date, img, description } = frontmatter

	// Calculer le temps de lecture
	const readingTime = calculateReadingTime(content)
	const readingTimeText = formatReadingTime(readingTime, locale)

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
			{/* Header Section */}
			<Container
				maxWidth="md"
				sx={{
					pt: { xs: '72px', sm: '88px' },
					pb: { xs: 4, sm: 5 },
				}}>
				{/* Back Button */}
				<Link href="/blog" style={{ textDecoration: 'none' }}>
					<Box
						sx={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 1,
							mb: 4,
							color: isDark ? 'text.secondary' : 'text.secondary',
							transition: 'all 0.2s ease',
							cursor: 'pointer',
							'&:hover': {
								color: isDark ? 'primary.light' : 'primary.main',
								transform: 'translateX(-4px)',
							},
						}}>
						<ArrowBack sx={{ fontSize: '1.25rem' }} />
						<Typography
							sx={{
								fontSize: '0.95rem',
								fontWeight: 500,
							}}>
							{translations.back}
						</Typography>
					</Box>
				</Link>

				{/* Title */}
				<Typography
					variant="h1"
					sx={{
						fontWeight: 700,
						fontSize: { xs: '1.875rem', sm: '2.5rem', md: '3rem' },
						lineHeight: 1.15,
						mb: 3,
						color: 'text.primary',
						letterSpacing: '-0.025em',
						fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
					}}>
					{title}
				</Typography>

				{/* Meta information */}
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 2.5,
						flexWrap: 'wrap',
						mb: 5,
						pb: 4,
						borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
					}}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<CalendarTodayRounded
							sx={{
								fontSize: '1rem',
								color: 'text.secondary',
							}}
						/>
						<Typography
							sx={{
								fontSize: '0.9rem',
								color: 'text.secondary',
								fontWeight: 400,
							}}>
							{formatBlogDate(date, locale)}
						</Typography>
					</Box>
					<Box
						sx={{
							width: '4px',
							height: '4px',
							borderRadius: '50%',
							bgcolor: 'text.secondary',
							opacity: 0.4,
						}}
					/>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<AccessTimeRounded
							sx={{
								fontSize: '1rem',
								color: 'text.secondary',
							}}
						/>
						<Typography
							sx={{
								fontSize: '0.9rem',
								color: 'text.secondary',
								fontWeight: 400,
							}}>
							{readingTimeText}
						</Typography>
					</Box>
				</Box>
			</Container>

			{/* Reading Progress Bar */}
			<ReadingProgress />

			{/* Content Section with Sidebar */}
			<Container
				maxWidth="xl"
				sx={{
					py: { xs: 4, sm: 6, md: 8 },
					px: { xs: 2, sm: 3 },
				}}>
				<Grid container spacing={4}>
					{/* Sidebar gauche - Table des matières (desktop seulement) */}
					<Grid item xs={0} lg={3} sx={{ display: { xs: 'none', lg: 'block' } }}>
						<TableOfContents content={content} />
					</Grid>

					{/* Contenu principal */}
					<Grid item xs={12} lg={9}>
						<Box
							component="article"
							sx={{
						color: isDark ? '#f1f5f9' : '#2d3748',
						fontSize: { xs: '1rem', sm: '1.0625rem' },
						lineHeight: 1.8,

						// Paragraphes
						'& p': {
							marginBottom: 3,
							color: isDark ? '#cbd5e1' : '#4a5568',
						},

						// Titres - même style que le titre principal de l'article
						'& h1, & h2, & h3, & h4, & h5, & h6': {
							fontWeight: 700,
							color: 'text.primary',
							marginTop: 4,
							marginBottom: 2,
							lineHeight: 1.15,
							letterSpacing: '-0.025em',
							fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
						},
						'& h1': { fontSize: { xs: '2rem', md: '2.5rem' } },
						'& h2': {
							fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
							mt: 6,
							mb: 3,
						},
						'& h3': {
							fontSize: { xs: '1.25rem', sm: '1.375rem', md: '1.5rem' },
							mt: 5,
							mb: 2.5,
						},
						'& h4': {
							fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' },
							mt: 4,
						},

						// Listes
						'& ul, & ol': {
							marginBottom: 3,
							paddingLeft: { xs: 3, sm: 4 },
							'& li': {
								marginBottom: 1.5,
								color: isDark ? '#cbd5e1' : '#4a5568',
								'&::marker': {
									color: '#8b5cf6',
								},
							},
						},

						// Code blocks
						'& pre': {
							marginBottom: 3,
							padding: { xs: 2, sm: 3 },
							backgroundColor: isDark ? '#0f172a' : '#1e293b',
							borderRadius: 2,
							overflow: 'auto',
							boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
							border: isDark ? '1px solid rgba(139, 92, 246, 0.2)' : 'none',
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
							backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
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
							color: isDark ? '#94a3b8' : '#718096',
							backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.05)',
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
								color: isDark ? '#cbd5e1' : '#4a5568',
							},
							'& th': {
								backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
								fontWeight: 700,
								color: '#8b5cf6',
							},
						},
					}}
					dangerouslySetInnerHTML={{ __html: marked(content) }}></Box>

						{/* Boutons de partage social */}
						<SocialShareButtons
							title={title}
							url={`https://www.linguami.com${locale === 'fr' ? '' : `/${locale}`}/blog/${slug}`}
						/>

						{/* Articles suggérés */}
						<RelatedArticles
							currentSlug={slug}
							allPosts={allPosts}
							maxItems={3}
						/>
					</Grid>
				</Grid>
			</Container>

			{/* Sticky Signup Widget */}
			<StickySignupWidget />
		</>
	)
}
