'use client'

import { Box, Typography, Grid, Card, CardContent, CardMedia, useTheme, Chip } from '@mui/material'
import { CalendarTodayRounded, AccessTimeRounded } from '@mui/icons-material'
import { Link } from '@/i18n/navigation'
import { getBlogImageUrl } from '@/utils/mediaUrls'
import { formatBlogDate } from '@/utils/blogHelpers'
import * as gtm from '@/lib/gtm'
import { useRouter, usePathname, useParams } from 'next/navigation'

/**
 * Affiche des articles suggérés en fonction de l'article actuel
 *
 * @param {string} currentSlug - Slug de l'article actuel (pour l'exclure)
 * @param {Array} allPosts - Tous les articles disponibles
 * @param {number} maxItems - Nombre maximum d'articles à afficher (défaut: 3)
 */
export default function RelatedArticles({ currentSlug, allPosts, maxItems = 3 }) {
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const router = useRouter()
	const pathname = usePathname()
	const params = useParams()

	// Filtrer l'article actuel et limiter le nombre
	const relatedPosts = allPosts
		.filter(post => post.slug !== currentSlug)
		.slice(0, maxItems)

	const handleClick = (postSlug) => {
		gtm.event({
			event: 'blog_related_article_click',
			category: 'Blog',
			action: 'Related Article Click',
			label: postSlug,
			language: params.locale
		})
	}

	if (relatedPosts.length === 0) return null

	return (
		<Box sx={{ mt: 8, mb: 4 }}>
			<Typography
				variant="h5"
				sx={{
					fontWeight: 800,
					mb: 4,
					fontSize: { xs: '1.5rem', md: '1.75rem' },
					color: isDark ? '#f1f5f9' : '#2d3748',
					textAlign: 'center',
				}}>
				Vous aimerez aussi
			</Typography>

			<Grid container spacing={3}>
				{relatedPosts.map((post, index) => (
					<Grid item xs={12} md={maxItems === 2 ? 6 : 4} key={index}>
						<Link
							href={`/blog/${post.slug}`}
							style={{ textDecoration: 'none' }}
							onClick={() => handleClick(post.slug)}>
							<Card
								sx={{
									height: '100%',
									background: isDark
										? 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(49, 46, 129, 0.6) 100%)'
										: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.9) 100%)',
									border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'}`,
									borderRadius: 2,
									overflow: 'hidden',
									transition: 'all 0.3s ease',
									cursor: 'pointer',
									'&:hover': {
										transform: 'translateY(-8px)',
										boxShadow: '0 16px 40px rgba(139, 92, 246, 0.2)',
										borderColor: 'rgba(139, 92, 246, 0.4)',
									},
								}}>
								<CardMedia
									component="img"
									height="180"
									image={getBlogImageUrl(post)}
									alt={post.title || post.frontmatter?.title}
									sx={{
										objectFit: 'cover',
									}}
								/>
								<CardContent sx={{ p: 2.5 }}>
									<Chip
										icon={<CalendarTodayRounded sx={{ fontSize: '0.875rem' }} />}
										label={formatBlogDate(post.published_at || post.frontmatter?.date, params.locale)}
										size="small"
										sx={{
											mb: 1.5,
											fontSize: '0.75rem',
											fontWeight: 600,
											background: 'rgba(139, 92, 246, 0.1)',
											color: '#8b5cf6',
											border: '1px solid rgba(139, 92, 246, 0.2)',
											'& .MuiChip-icon': {
												color: '#8b5cf6',
											},
										}}
									/>

									<Typography
										variant="h6"
										sx={{
											fontWeight: 700,
											fontSize: '1.125rem',
											lineHeight: 1.4,
											mb: 1,
											color: isDark ? '#f1f5f9' : '#2d3748',
											display: '-webkit-box',
											WebkitLineClamp: 2,
											WebkitBoxOrient: 'vertical',
											overflow: 'hidden',
										}}>
										{post.title || post.frontmatter?.title}
									</Typography>

									<Typography
										variant="body2"
										sx={{
											color: isDark ? '#94a3b8' : '#64748b',
											lineHeight: 1.6,
											display: '-webkit-box',
											WebkitLineClamp: 3,
											WebkitBoxOrient: 'vertical',
											overflow: 'hidden',
										}}>
										{post.excerpt || post.frontmatter?.excerpt}
									</Typography>
								</CardContent>
							</Card>
						</Link>
					</Grid>
				))}
			</Grid>
		</Box>
	)
}
