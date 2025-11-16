'use client'

import { useMemo } from 'react'
import { Box } from '@mui/material'
import BlogCard from './BlogCard'
import { useUserContext } from '@/context/user'

export default function BlogList({ posts, locale }) {
	const { userLearningLanguage } = useUserContext()

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

			// If learning French, show only French-related articles
			if (userLearningLanguage === 'fr') {
				return post.slug !== 'why-learn-russian' && post.slug !== 'how-to-learn-russian'
			}

			// If learning Russian, show only Russian-related articles
			if (userLearningLanguage === 'ru') {
				return post.slug !== 'why-learn-french' && post.slug !== 'how-to-learn-french'
			}

			// If no learning language set (guest or new user), show all
			return true
		})

		return filtered
	}, [posts, locale, userLearningLanguage])

	return (
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
	)
}
