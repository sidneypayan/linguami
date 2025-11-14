/**
 * Script de migration R2 : Restructuration complète du bucket
 *
 * Nouvelle structure :
 * audios/
 *   ├── materials/{lang}/
 *   ├── courses/{lang}/
 *   └── exercises/{lang}/
 *
 * images/
 *   ├── materials/
 *   ├── blog/
 *   └── ui/
 *
 * Migration depuis :
 * - audio/{lang}/ → audios/materials/{lang}/
 * - audio/courses/{lang}/ → audios/courses/{lang}/
 * - audio/exercises/{lang}/ → audios/exercises/{lang}/
 * - image/*.webp (root) → images/materials/
 * - image/materials/ → images/materials/
 * - image/blog/ → images/blog/
 * - image/ui/ → images/ui/
 *
 * Utilisation :
 * 1. node scripts/migrate-r2-bucket-structure.js --dry-run
 * 2. node scripts/migrate-r2-bucket-structure.js
 * 3. Tester le site
 * 4. node scripts/migrate-r2-bucket-structure.js --cleanup
 */

import { S3Client, ListObjectsV2Command, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

const BUCKET_NAME = process.env.R2_BUCKET_NAME

const isDryRun = process.argv.includes('--dry-run')
const isCleanup = process.argv.includes('--cleanup')

/**
 * Détermine le nouveau chemin pour un fichier
 */
function getNewPath(oldPath) {
  // Ignorer les fichiers déjà migrés (commençant par audios/ ou images/)
  if (oldPath.startsWith('audios/') || oldPath.startsWith('images/')) {
    return null // Déjà migré
  }

  // Ignorer les backups
  if (oldPath.includes('/backup-')) {
    return null
  }

  // === AUDIO ===
  if (oldPath.startsWith('audio/')) {
    // audio/courses/{lang}/ → audios/courses/{lang}/
    if (oldPath.startsWith('audio/courses/')) {
      return oldPath.replace('audio/', 'audios/')
    }

    // audio/exercises/{lang}/ → audios/exercises/{lang}/
    if (oldPath.startsWith('audio/exercises/')) {
      return oldPath.replace('audio/', 'audios/')
    }

    // audio/{lang}/ → audios/materials/{lang}/
    // Ex: audio/fr/bonjour.m4a → audios/materials/fr/bonjour.m4a
    const match = oldPath.match(/^audio\/(fr|ru|en)\/(.+)$/)
    if (match) {
      const [, lang, filename] = match
      return `audios/materials/${lang}/${filename}`
    }
  }

  // === IMAGE ===
  if (oldPath.startsWith('image/')) {
    // image/blog/ → images/blog/
    if (oldPath.startsWith('image/blog/')) {
      return oldPath.replace('image/', 'images/')
    }

    // image/ui/ → images/ui/
    if (oldPath.startsWith('image/ui/')) {
      return oldPath.replace('image/', 'images/')
    }

    // image/materials/ → images/materials/
    if (oldPath.startsWith('image/materials/')) {
      return oldPath.replace('image/', 'images/')
    }

    // image/*.webp (root files) → images/materials/
    // Ex: image/dialogues_airport.webp → images/materials/dialogues_airport.webp
    if (oldPath.match(/^image\/[^\/]+\.webp/)) {
      return oldPath.replace('image/', 'images/materials/')
    }

    // Dossiers bizarres comme image/a_lorak.webp/ → images/materials/
    const weirdFolder = oldPath.match(/^image\/([^\/]+\.webp)\/(.+)$/)
    if (weirdFolder) {
      const [, folderName, filename] = weirdFolder
      return `images/materials/${filename}`
    }
  }

  return null // Fichier non géré
}

/**
 * Liste tous les objets avec un préfixe donné
 */
async function listObjects(prefix) {
  const objects = []
  let continuationToken = null

  do {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
      ContinuationToken: continuationToken,
    })

    const response = await r2Client.send(command)

    if (response.Contents) {
      objects.push(...response.Contents)
    }

    continuationToken = response.NextContinuationToken
  } while (continuationToken)

  return objects
}

/**
 * Copie un objet
 */
async function copyObject(sourceKey, destinationKey) {
  const command = new CopyObjectCommand({
    Bucket: BUCKET_NAME,
    CopySource: `${BUCKET_NAME}/${sourceKey}`,
    Key: destinationKey,
  })

  await r2Client.send(command)
}

/**
 * Supprime un objet
 */
async function deleteObject(key) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  await r2Client.send(command)
}

/**
 * Migre un préfixe
 */
async function migratePrefix(prefix, label) {
  console.log(`\n📂 ${label}`)
  console.log('━'.repeat(60))

  console.log(`🔍 Listing objects with prefix: ${prefix}`)
  const objects = await listObjects(prefix)

  if (objects.length === 0) {
    console.log(`   ⚠️  No objects found`)
    return { copied: 0, deleted: 0, errors: 0, skipped: 0 }
  }

  console.log(`   ✓ Found ${objects.length} objects\n`)

  let copied = 0
  let deleted = 0
  let errors = 0
  let skipped = 0

  for (const obj of objects) {
    const oldKey = obj.Key
    const newKey = getNewPath(oldKey)

    // Fichier à ignorer (déjà migré, backup, etc.)
    if (!newKey) {
      skipped++
      continue
    }

    try {
      if (isCleanup) {
        // Mode cleanup : supprimer les anciens fichiers
        if (isDryRun) {
          console.log(`   [DRY RUN] Would delete: ${oldKey}`)
        } else {
          await deleteObject(oldKey)
          console.log(`   🗑️  Deleted: ${oldKey}`)
          deleted++
        }
      } else {
        // Mode migration : copier vers la nouvelle structure
        if (isDryRun) {
          console.log(`   [DRY RUN] Would copy:\n      FROM: ${oldKey}\n      TO:   ${newKey}`)
        } else {
          await copyObject(oldKey, newKey)
          console.log(`   ✅ Copied:\n      FROM: ${oldKey}\n      TO:   ${newKey}`)
          copied++
        }
      }
    } catch (error) {
      console.error(`   ❌ Error processing ${oldKey}:`, error.message)
      errors++
    }
  }

  return { copied, deleted, errors, skipped, total: objects.length }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🚀 Migration R2 Bucket - Restructuration complète')
  console.log('━'.repeat(60))

  if (isDryRun) {
    console.log('⚠️  DRY RUN MODE - No changes will be made\n')
  } else if (isCleanup) {
    console.log('🗑️  CLEANUP MODE - Will delete old files\n')
    console.log('⚠️  WARNING: This will permanently delete files!')
    console.log('⚠️  Make sure the new structure is working before running this!\n')
  } else {
    console.log('📋 MIGRATION MODE - Restructuring bucket\n')
  }

  console.log(`📦 Bucket: ${BUCKET_NAME}`)
  console.log(`🌐 Account: ${process.env.R2_ACCOUNT_ID}\n`)

  console.log('📐 New structure:')
  console.log('   audios/materials/{lang}/')
  console.log('   audios/courses/{lang}/')
  console.log('   audios/exercises/{lang}/')
  console.log('   images/materials/')
  console.log('   images/blog/')
  console.log('   images/ui/')
  console.log('')

  const stats = {
    totalCopied: 0,
    totalDeleted: 0,
    totalErrors: 0,
    totalSkipped: 0,
    totalFiles: 0,
  }

  // Migrer audio/
  const audioResult = await migratePrefix('audio/', 'Migrating audio files')
  stats.totalCopied += audioResult.copied
  stats.totalDeleted += audioResult.deleted
  stats.totalErrors += audioResult.errors
  stats.totalSkipped += audioResult.skipped
  stats.totalFiles += audioResult.total

  // Migrer image/
  const imageResult = await migratePrefix('image/', 'Migrating image files')
  stats.totalCopied += imageResult.copied
  stats.totalDeleted += imageResult.deleted
  stats.totalErrors += imageResult.errors
  stats.totalSkipped += imageResult.skipped
  stats.totalFiles += imageResult.total

  // Résumé final
  console.log('\n━'.repeat(60))
  console.log('📊 SUMMARY')
  console.log('━'.repeat(60))
  console.log(`Total files found:   ${stats.totalFiles}`)
  console.log(`Files skipped:       ${stats.totalSkipped}`)

  if (isCleanup) {
    console.log(`Files deleted:       ${stats.totalDeleted}`)
  } else {
    console.log(`Files copied:        ${stats.totalCopied}`)
  }

  console.log(`Errors:              ${stats.totalErrors}`)

  if (isDryRun) {
    console.log('\n💡 To perform the actual migration, run:')
    console.log('   node scripts/migrate-r2-bucket-structure.js')
  } else if (!isCleanup) {
    console.log('\n✅ Migration complete!')
    console.log('\n📝 Next steps:')
    console.log('   1. Test your site to ensure everything works')
    console.log('   2. Once confirmed, run cleanup:')
    console.log('      node scripts/migrate-r2-bucket-structure.js --cleanup')
  } else {
    console.log('\n✅ Cleanup complete!')
    console.log('   Old files have been deleted.')
  }
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
