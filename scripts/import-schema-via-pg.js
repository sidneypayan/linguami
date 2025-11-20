const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

const connectionString = 'postgresql://postgres:3lYZjPrL9X6nNwTk@db.capnpewksfdnllttnvzu.supabase.co:5432/postgres'

async function importSchema() {
  const client = new Client({ connectionString })

  try {
    console.log('🔌 Connecting to dev database...')
    await client.connect()
    console.log('✅ Connected!')

    console.log('📥 Reading schema file...')
    const schemaPath = path.join(__dirname, '..', 'prod_schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')

    console.log('⚙️  Executing schema import...')
    console.log('⏳ This may take a minute...')

    await client.query(schema)

    console.log('✅ Schema imported successfully!')
    console.log('\n📊 Verifying tables...')

    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)

    console.log(`\n✅ Found ${result.rows.length} tables:`)
    result.rows.forEach(row => console.log(`   - ${row.table_name}`))

  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.code) console.error('Error code:', error.code)
  } finally {
    await client.end()
    console.log('\n🔌 Connection closed')
  }
}

importSchema()
