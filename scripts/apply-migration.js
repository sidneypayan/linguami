/**
 * Script to apply a migration to production database
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env.production
dotenv.config({ path: path.resolve(__dirname, '../.env.production') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
	console.error('Missing Supabase credentials in .env.production')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const migrationFile = process.argv[2]

if (!migrationFile) {
	console.error('Usage: node apply-migration.js <migration-file>')
	console.error('Example: node apply-migration.js 20251204_add_multi_fill_type.sql')
	process.exit(1)
}

const migrationPath = path.resolve(__dirname, '../supabase/migrations', migrationFile)

if (!fs.existsSync(migrationPath)) {
	console.error(`Migration file not found: ${migrationPath}`)
	process.exit(1)
}

async function main() {
	console.log(`📄 Reading migration file: ${migrationFile}`)
	const sql = fs.readFileSync(migrationPath, 'utf-8')

	console.log(`\n📝 SQL to execute:\n${sql}\n`)

	console.log('🚀 Executing migration...')

	try {
		const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql })

		if (error) {
			console.error('❌ Migration failed:', error)
			process.exit(1)
		}

		console.log('✅ Migration applied successfully!')
	} catch (err) {
		// Try direct query if RPC fails
		console.log('⚠️  RPC not available, trying direct query...')

		// Split by semicolon and execute each statement
		const statements = sql
			.split(';')
			.map((s) => s.trim())
			.filter((s) => s.length > 0 && !s.startsWith('--'))

		for (const statement of statements) {
			console.log(`Executing: ${statement.substring(0, 50)}...`)
			const { error } = await supabase.rpc('exec_sql', { sql: statement })

			if (error) {
				console.error('❌ Statement failed:', error)
				console.error('Statement was:', statement)
				process.exit(1)
			}
		}

		console.log('✅ Migration applied successfully!')
	}
}

main()
