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
					borderRadius: 3,
					overflow: 'hidden',
					transition: 'all 0.3s ease',
					backgroundColor: '#ffffff',
					boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
					border: '1px solid rgba(102, 126, 234, 0.1)',
					'&:hover': {
						transform: 'translateY(-8px)',
						boxShadow: '0 12px 40px rgba(102, 126, 234, 0.2)',
						borderColor: 'rgba(102, 126, 234, 0.3)',
						'& .blog-image': {
							transform: 'scale(1.05)',
						},
						'& .read-more-btn': {
							background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
							transform: 'translateX(8px)',
							'& .arrow-icon': {
								transform: 'translateX(4px)',
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
								background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
								border: '1px solid rgba(102, 126, 234, 0.2)',
								color: '#667eea',
								fontWeight: 600,
								fontSize: '0.875rem',
								'& .MuiChip-icon': {
									color: '#667eea',
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
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								color: 'white',
								fontWeight: 600,
								fontSize: { xs: '0.9rem', sm: '1rem' },
								padding: '0.75rem 2rem',
								borderRadius: 3,
								textTransform: 'none',
								transition: 'all 0.3s ease',
								boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
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
