/**
 * Script to run SQL migration via Supabase REST API
 */

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

const migrationFile = '20251211_remove_lesson_content_columns.sql'
const migrationPath = path.resolve(__dirname, '../supabase/migrations', migrationFile)

async function main() {
	console.log(`📄 Reading migration file: ${migrationFile}`)
	const sql = fs.readFileSync(migrationPath, 'utf-8')

	console.log(`\n📝 SQL to execute:\n${sql}\n`)

	console.log('🚀 Executing migration via Supabase REST API...')

	try {
		const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				apikey: supabaseKey,
				Authorization: `Bearer ${supabaseKey}`,
			},
			body: JSON.stringify({ query: sql }),
		})

		if (!response.ok) {
			const error = await response.text()
			console.error('❌ Migration failed:', error)
			console.error('Status:', response.status, response.statusText)

			// Try alternative approach: execute SQL statements one by one using a Node.js PostgreSQL client
			console.log('\n⚠️  Trying alternative approach with pg client...')
			await executeWithPgClient(sql)
			return
		}

		const result = await response.json()
		console.log('✅ Migration applied successfully!', result)
	} catch (err) {
		console.error('❌ Error:', err.message)
		console.log('\n⚠️  Trying alternative approach with pg client...')
		await executeWithPgClient(sql)
	}
}

async function executeWithPgClient(sql) {
	try {
		// Use pg module if available
		const pg = await import('pg')
		const { Client } = pg.default

		// Parse Supabase URL to get connection string
		const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]
		if (!projectRef) {
			console.error('❌ Could not parse project ref from URL')
			process.exit(1)
		}

		const connectionString = `postgresql://postgres.${projectRef}:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`

		console.log('⚠️  You need to manually set up the connection string.')
		console.log('Please run the SQL manually in Supabase SQL Editor:')
		console.log('\n' + '='.repeat(60))
		console.log(sql)
		console.log('='.repeat(60))
		process.exit(1)
	} catch (err) {
		console.log('\n❌ pg module not available. Please run the SQL manually in Supabase SQL Editor:')
		console.log('\n' + '='.repeat(60))
		console.log(sql)
		console.log('='.repeat(60) + '\n')
		console.log('📖 Instructions:')
		console.log('1. Go to https://supabase.com/dashboard/project/psomseputtsdizmmqugy/sql/new')
		console.log('2. Copy and paste the SQL above')
		console.log('3. Click "Run"')
		console.log('4. Run: node scripts/create-prefix-exercises.js')
		process.exit(0)
	}
}

main()
