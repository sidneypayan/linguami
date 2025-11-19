import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations, useLocale } from 'next-intl'
import {
	Box,
	Card,
	CardContent,
	Typography,
	useTheme,
} from '@mui/material'
import { ArrowForwardRounded } from '@mui/icons-material'
import { getBlogImageUrl } from '@/utils/mediaUrls'

const BlogCard = ({ post }) => {
	const t = useTranslations('blog')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	return (
		<Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
			<Card
				sx={{
					display: 'flex',
					flexDirection: { xs: 'column', sm: 'row' },
					borderRadius: 2,
					overflow: 'hidden',
					transition: 'all 0.2s ease',
					bgcolor: 'background.paper',
					boxShadow: 'none',
					border: '1px solid',
					borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
					'&:hover': {
						borderColor: isDark ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.3)',
						boxShadow: isDark
							? '0 4px 12px rgba(0, 0, 0, 0.3)'
							: '0 4px 12px rgba(0, 0, 0, 0.08)',
						'& .blog-image': {
							opacity: 0.85,
						},
						'& .read-more-arrow': {
							transform: 'translateX(4px)',
						},
					},
				}}>
				{/* Image Section */}
				<Box
					sx={{
						width: { xs: '100%', sm: '240px' },
						height: { xs: '200px', sm: 'auto' },
						flexShrink: 0,
						position: 'relative',
						overflow: 'hidden',
					}}>
					<Image
						className='blog-image'
						fill
						style={{ objectFit: 'cover', transition: 'opacity 0.2s ease' }}
						sizes='(max-width: 600px) 100vw, 240px'
						quality={85}
						src={getBlogImageUrl(post)}
						alt={post.title || post.frontmatter?.title}
					/>
				</Box>

				{/* Content Section */}
				<CardContent
					sx={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						padding: { xs: 2.5, sm: 3 },
						'&:last-child': { pb: { xs: 2.5, sm: 3 } },
					}}>
					{/* Date */}
					<Typography
						variant='caption'
						sx={{
							color: 'text.secondary',
							fontSize: '0.875rem',
							mb: 1.5,
							display: 'block',
						}}>
						{post.published_at || post.frontmatter?.date}
					</Typography>

					{/* Title */}
					<Typography
						variant='h3'
						sx={{
							fontWeight: 600,
							fontSize: { xs: '1.25rem', sm: '1.375rem' },
							lineHeight: 1.3,
							color: 'text.primary',
							mb: 1.5,
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
							fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
							letterSpacing: '-0.01em',
						}}>
						{post.title || post.frontmatter?.title}
					</Typography>

					{/* Excerpt */}
					<Typography
						variant='body2'
						sx={{
							color: 'text.secondary',
							fontSize: '0.9375rem',
							lineHeight: 1.6,
							mb: 2,
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
						}}>
						{post.excerpt || post.frontmatter?.excerpt}
					</Typography>

					{/* Read More Link */}
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 0.5,
							color: 'primary.main',
							fontSize: '0.9375rem',
							fontWeight: 500,
							mt: 'auto',
						}}>
						<span>{t('readMore') || 'Lire la suite'}</span>
						<ArrowForwardRounded
							className='read-more-arrow'
							sx={{
								fontSize: '1.125rem',
								transition: 'transform 0.2s ease',
							}}
						/>
					</Box>
				</CardContent>
			</Card>
		</Link>
	)
}

export default BlogCard
