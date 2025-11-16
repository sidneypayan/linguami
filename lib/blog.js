import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { sortPostsByDate } from '@/utils/blogHelpers'

/**
 * Get all blog posts for a specific locale
 * @param {string} locale - The locale (fr, en, ru)
 * @returns {Array} Array of posts with slug and frontmatter
 */
export function getBlogPosts(locale = 'fr') {
	const postsDirectory = path.join(process.cwd(), 'posts', locale)

	// Check if directory exists
	if (!fs.existsSync(postsDirectory)) {
		return []
	}

	const files = fs.readdirSync(postsDirectory)

	const posts = files
		.filter(filename => filename.endsWith('.mdx'))
		.map(filename => {
			const slug = filename.replace('.mdx', '')

			const markdownWithMeta = fs.readFileSync(
				path.join(postsDirectory, filename),
				'utf-8'
			)

			const { data: frontmatter } = matter(markdownWithMeta)

			return { slug, frontmatter }
		})

	return posts.sort(sortPostsByDate)
}

/**
 * Get a single blog post by slug
 * @param {string} slug - The post slug
 * @param {string} locale - The locale (fr, en, ru)
 * @returns {Object|null} Post object or null if not found
 */
export function getBlogPost(slug, locale = 'fr') {
	const postsDirectory = path.join(process.cwd(), 'posts', locale)
	const filePath = path.join(postsDirectory, `${slug}.mdx`)

	if (!fs.existsSync(filePath)) {
		return null
	}

	const markdownWithMeta = fs.readFileSync(filePath, 'utf-8')
	const { data: frontmatter, content } = matter(markdownWithMeta)

	return {
		slug,
		frontmatter,
		content,
	}
}
