require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function listAllStorageContent() {
	console.log('📦 Listing all Supabase Storage content...\n')

	try {
		// List all buckets
		const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

		if (bucketsError) {
			console.error('❌ Error listing buckets:', bucketsError)
			return
		}

		console.log(`Found ${buckets.length} bucket(s):\n`)

		let totalFiles = 0

		for (const bucket of buckets) {
			console.log(`\n📁 Bucket: ${bucket.name}`)
			console.log(`   ID: ${bucket.id}`)
			console.log(`   Public: ${bucket.public}`)
			console.log(`   Created: ${bucket.created_at}`)

			// List all files in bucket recursively
			const files = await listFilesRecursively(bucket.name)
			totalFiles += files.length

			console.log(`   Files: ${files.length}`)

			if (files.length > 0) {
				console.log(`   Sample files (first 10):`)
				files.slice(0, 10).forEach(file => {
					console.log(`   - ${file.name}`)
				})
				if (files.length > 10) {
					console.log(`   ... and ${files.length - 10} more`)
				}
			}
		}

		console.log(`\n\n📊 SUMMARY:`)
		console.log(`   Total buckets: ${buckets.length}`)
		console.log(`   Total files: ${totalFiles}`)

	} catch (error) {
		console.error('❌ Unexpected error:', error)
	}
}

async function listFilesRecursively(bucketName, path = '') {
	const allFiles = []

	try {
		const { data, error } = await supabase.storage
			.from(bucketName)
			.list(path, {
				limit: 1000,
				offset: 0,
			})

		if (error) {
			console.error(`Error listing files in ${bucketName}/${path}:`, error)
			return allFiles
		}

		for (const item of data) {
			const fullPath = path ? `${path}/${item.name}` : item.name

			if (item.id) {
				// It's a file
				allFiles.push({
					name: fullPath,
					size: item.metadata?.size || 0,
				})
			} else {
				// It's a folder, recurse into it
				const subFiles = await listFilesRecursively(bucketName, fullPath)
				allFiles.push(...subFiles)
			}
		}
	} catch (error) {
		console.error(`Error in recursion for ${bucketName}/${path}:`, error)
	}

	return allFiles
}

listAllStorageContent()
