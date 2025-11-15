'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import BlogCard from '@/components/blog/BlogCard'
import { sortPostsByDate } from '@/utils/blogHelpers'
import { Container, Typography, Box, useTheme } from '@mui/material'
import { getBlogImageUrl } from '@/utils/mediaUrls'
import { useUserContext } from '@/context/user'

export default function Blog() {
	const t = useTranslations('blog')
	const locale = useLocale()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const { userLearningLanguage } = useUserContext()
	const [posts, setPosts] = useState([])

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = await fetch(`/api/blog/posts?locale=${locale}`)
				if (response.ok) {
					const data = await response.json()
					setPosts(data.posts || [])
				}
			} catch (error) {
				console.error('Error fetching blog posts:', error)
			}
		}

		fetchPosts()
	}, [locale])

	// Filter posts based on learning language for English blog
	const filteredPosts = useMemo(() => {
		if (locale !== 'en') {
			return posts
		}

		// For English blog, filter based on learning language
		const filtered = posts.filter(post => {
			// Always exclude the comparison article
			if (post.slug === 'french-vs-russian-which-to-learn') {
				return false
			}

			// If learning French, show only "why-learn-french"
			if (userLearningLanguage === 'fr') {
				return post.slug !== 'why-learn-russian'
			}

			// If learning Russian, show only "why-learn-russian"
			if (userLearningLanguage === 'ru') {
				return post.slug !== 'why-learn-french'
			}

			// If no learning language set (guest or new user), show both
			return true
		})

		return filtered
	}, [posts, locale, userLearningLanguage])

	return (
		<>
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
					{filteredPosts.map((post, index) => (
						<BlogCard key={index} post={post} />
					))}
				</Box>
			</Container>
		</>
	)
}
