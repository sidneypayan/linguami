import Image from 'next/image'
import Link from 'next/link'
import {
	Box,
	Card,
	CardContent,
	Typography,
	Button,
	Chip,
	CardMedia,
} from '@mui/material'
import { ArrowForwardRounded, CalendarTodayRounded } from '@mui/icons-material'

const BlogCard = ({ post }) => {
	return (
		<Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
			<Card
				sx={{
					display: 'flex',
					flexDirection: { xs: 'column', md: 'row' },
					borderRadius: 4,
					overflow: 'hidden',
					transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
					background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
					boxShadow: '0 4px 20px rgba(139, 92, 246, 0.15)',
					border: '1px solid rgba(139, 92, 246, 0.2)',
					position: 'relative',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: '-100%',
						width: '100%',
						height: '100%',
						background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent)',
						transition: 'left 0.5s ease',
						pointerEvents: 'none',
					},
					'&:hover': {
						transform: 'translateY(-8px)',
						boxShadow: '0 12px 40px rgba(139, 92, 246, 0.3)',
						borderColor: 'rgba(139, 92, 246, 0.4)',
						'&::before': {
							left: '100%',
						},
						'& .blog-image': {
							transform: 'scale(1.05)',
						},
						'& .read-more-btn': {
							background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
							transform: 'translateX(8px)',
							boxShadow: '0 6px 25px rgba(139, 92, 246, 0.4)',
							'& .arrow-icon': {
								transform: 'translateX(4px)',
							},
							'&::before': {
								left: '100%',
							},
						},
					},
				}}>
				{/* Image Section */}
				<Box
					sx={{
						width: { xs: '100%', md: '40%' },
						height: { xs: '250px', md: 'auto' },
						position: 'relative',
						overflow: 'hidden',
						minHeight: { md: '300px' },
					}}>
					<Box
						className='blog-image'
						sx={{
							position: 'relative',
							width: '100%',
							height: '100%',
							transition: 'transform 0.4s ease',
						}}>
						<Image
							fill
							style={{ objectFit: 'cover' }}
							sizes='(max-width: 900px) 100vw, 40vw'
							quality={90}
							src={process.env.NEXT_PUBLIC_SUPABASE_IMAGE + post.frontmatter.img}
							alt={post.frontmatter.title}
						/>
					</Box>
				</Box>

				{/* Content Section */}
				<CardContent
					sx={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						padding: { xs: 3, sm: 4 },
						gap: 2,
					}}>
					{/* Date Badge */}
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<Chip
							icon={<CalendarTodayRounded sx={{ fontSize: '0.9rem' }} />}
							label={post.frontmatter.date}
							sx={{
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
								border: '1px solid rgba(139, 92, 246, 0.3)',
								color: '#8b5cf6',
								fontWeight: 600,
								fontSize: '0.875rem',
								backdropFilter: 'blur(10px)',
								'& .MuiChip-icon': {
									color: '#8b5cf6',
								},
							}}
						/>
					</Box>

					{/* Title */}
					<Typography
						variant='h4'
						sx={{
							fontWeight: 700,
							fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
							lineHeight: 1.3,
							color: '#2d3748',
							transition: 'color 0.2s ease',
							'&:hover': {
								background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 60%, #06b6d4 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
							},
						}}>
						{post.frontmatter.title}
					</Typography>

					{/* Excerpt */}
					<Typography
						variant='body1'
						sx={{
							color: '#718096',
							fontSize: { xs: '0.95rem', sm: '1rem' },
							lineHeight: 1.7,
							flex: 1,
						}}>
						{post.frontmatter.excerpt}
					</Typography>

					{/* Read More Button */}
					<Box sx={{ display: 'flex', alignItems: 'center', marginTop: 'auto' }}>
						<Button
							className='read-more-btn'
							endIcon={
								<ArrowForwardRounded
									className='arrow-icon'
									sx={{
										transition: 'transform 0.3s ease',
									}}
								/>
							}
							sx={{
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								color: 'white',
								fontWeight: 700,
								fontSize: { xs: '0.9rem', sm: '1rem' },
								padding: '0.75rem 2rem',
								borderRadius: 3,
								textTransform: 'none',
								transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
								boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
								border: '1px solid rgba(139, 92, 246, 0.3)',
								position: 'relative',
								overflow: 'hidden',
								'&::before': {
									content: '""',
									position: 'absolute',
									top: 0,
									left: '-100%',
									width: '100%',
									height: '100%',
									background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
									transition: 'left 0.5s ease',
								},
								'&:active': {
									transform: 'scale(0.98)',
								},
							}}>
							Lire l&apos;article
						</Button>
					</Box>
				</CardContent>
			</Card>
		</Link>
	)
}

export default BlogCard
