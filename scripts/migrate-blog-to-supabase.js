const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
	console.error('❌ Missing Supabase credentials')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * Migrate all MDX blog posts from /posts to Supabase
 */
async function migrateBlogPosts() {
	console.log('🚀 Starting blog post migration to Supabase...\n')

	const languages = ['fr', 'en', 'ru']
	let totalMigrated = 0
	let totalSkipped = 0
	let totalErrors = 0

	for (const lang of languages) {
		const postsDirectory = path.join(process.cwd(), 'posts', lang)

		// Check if directory exists
		if (!fs.existsSync(postsDirectory)) {
			console.log(`⚠️  No posts found for ${lang}`)
			continue
		}

		const files = fs.readdirSync(postsDirectory)
		const mdxFiles = files.filter((filename) => filename.endsWith('.mdx'))

		console.log(`📁 Found ${mdxFiles.length} posts for ${lang}`)

		for (const filename of mdxFiles) {
			const filePath = path.join(postsDirectory, filename)
			const slug = filename.replace('.mdx', '')

			try {
				// Read MDX file
				const fileContents = fs.readFileSync(filePath, 'utf-8')
				const { data: frontmatter, content } = matter(fileContents)

				// Check if post already exists
				const { data: existing } = await supabase
					.from('blog_posts')
					.select('id')
					.eq('slug', slug)
					.eq('lang', lang)
					.single()

				if (existing) {
					console.log(`  ⏭️  Skipping ${lang}/${slug} (already exists)`)
					totalSkipped++
					continue
				}

				// Prepare data for insertion
				const blogPost = {
					title: frontmatter.title || 'Untitled',
					slug,
					excerpt: frontmatter.excerpt || '',
					content,
					lang,
					img: frontmatter.img || null,
					meta_description: frontmatter.description || frontmatter.excerpt || null,
					is_published: true,
					published_at: frontmatter.date
						? new Date(frontmatter.date).toISOString()
						: new Date().toISOString(),
				}

				// Insert into Supabase
				const { error } = await supabase.from('blog_posts').insert([blogPost])

				if (error) throw error

				console.log(`  ✅ Migrated ${lang}/${slug}`)
				totalMigrated++
			} catch (error) {
				console.error(`  ❌ Error migrating ${lang}/${slug}:`, error.message)
				totalErrors++
			}
		}

		console.log('')
	}

	console.log('\n📊 Migration Summary:')
	console.log(`  ✅ Migrated: ${totalMigrated}`)
	console.log(`  ⏭️  Skipped:  ${totalSkipped}`)
	console.log(`  ❌ Errors:   ${totalErrors}`)
	console.log('\n✨ Migration complete!')
}

migrateBlogPosts()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error('❌ Migration failed:', error)
		process.exit(1)
	})
