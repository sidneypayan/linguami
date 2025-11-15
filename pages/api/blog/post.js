import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { sortPostsByDate } from '@/utils/blogHelpers'

export default async function handler(req, res) {
	const { slug, locale = 'fr' } = req.query

	if (!slug) {
		return res.status(400).json({ error: 'Slug is required' })
	}

	const postsDirectory = path.join(process.cwd(), 'posts', locale)
	const filePath = path.join(postsDirectory, `${slug}.mdx`)

	// Vérifier si le fichier existe
	if (!fs.existsSync(filePath)) {
		return res.status(404).json({ error: 'Post not found' })
	}

	const markdownWithMeta = fs.readFileSync(filePath, 'utf-8')
	const { data: frontmatter, content } = matter(markdownWithMeta)

	// Récupérer tous les articles pour les suggestions (dans la même langue)
	const files = fs.readdirSync(postsDirectory)
	const allPosts = files
		.filter(filename => filename.endsWith('.mdx'))
		.map(filename => {
			const postSlug = filename.replace('.mdx', '')
			const markdownWithMeta = fs.readFileSync(
				path.join(postsDirectory, filename),
				'utf-8'
			)
			const { data: frontmatter } = matter(markdownWithMeta)
			return { slug: postSlug, frontmatter }
		})

	res.json({
		frontmatter,
		slug,
		content,
		allPosts: allPosts.sort(sortPostsByDate),
	})
}
