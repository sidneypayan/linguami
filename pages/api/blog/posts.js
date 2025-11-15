import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { sortPostsByDate } from '@/utils/blogHelpers'

export default async function handler(req, res) {
	const { locale = 'fr' } = req.query

	// Déterminer le dossier de posts selon la langue
	const postsDirectory = path.join(process.cwd(), 'posts', locale)

	// Vérifier si le dossier existe
	if (!fs.existsSync(postsDirectory)) {
		return res.json({ posts: [] })
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

	res.json({
		posts: posts.sort(sortPostsByDate),
	})
}
