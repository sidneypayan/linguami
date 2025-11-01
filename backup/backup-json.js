#!/usr/bin/env node

/**
 * Script d'export JSON de la base de données Supabase
 * Exporte toutes les tables importantes en fichiers JSON
 * Plus facile à lire et à versionner que SQL
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration
const BACKUP_DIR = path.join(__dirname, 'exports');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('.')[0];
const backupFolder = path.join(BACKUP_DIR, `backup_${timestamp}`);

// Couleurs pour les messages
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

// Liste des tables à sauvegarder
const TABLES_TO_BACKUP = [
  // Tables utilisateurs (triées par date de création)
  { name: 'users_profile', orderBy: 'created_at' },

  // Tables XP et gamification
  { name: 'user_xp_profile', orderBy: 'created_at' },
  { name: 'xp_rewards_config', orderBy: 'id' },
  { name: 'xp_transactions', orderBy: 'created_at' },

  // Tables de progression
  { name: 'user_h5p_progress', orderBy: 'created_at' },
  { name: 'user_goals', orderBy: 'created_at' },
  { name: 'user_achievements', orderBy: 'unlocked_at' },

  // Tables de leaderboard
  { name: 'weekly_xp_tracking', orderBy: 'week_start' },
  { name: 'monthly_xp_tracking', orderBy: 'month_start' },

  // Tables de contenu (si vous voulez les sauvegarder)
  // { name: 'materials', orderBy: 'id' },
  // { name: 'sections', orderBy: 'id' },
  // { name: 'h5p', orderBy: 'id' },
];

/**
 * Affiche un message coloré
 */
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Affiche une barre de progression
 */
function progressBar(current, total, label) {
  const percentage = Math.round((current / total) * 100);
  const filled = Math.round(percentage / 2);
  const empty = 50 - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  process.stdout.write(`\r${label}: [${bar}] ${percentage}% (${current}/${total})`);
  if (current === total) {
    console.log('');
  }
}

/**
 * Exporte une table en JSON
 */
async function exportTable(supabase, tableName, orderBy) {
  try {
    log(`  Exportation de ${tableName}...`, 'blue');

    // Compter le nombre total d'enregistrements
    const { count, error: countError } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw countError;
    }

    log(`  Nombre d'enregistrements: ${count}`, 'blue');

    if (count === 0) {
      log(`  ⚠ Table vide, création d'un fichier vide`, 'yellow');
      const filePath = path.join(backupFolder, `${tableName}.json`);
      fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
      return { table: tableName, count: 0, success: true };
    }

    // Récupérer toutes les données par lots de 1000
    const BATCH_SIZE = 1000;
    let allData = [];
    let from = 0;

    while (from < count) {
      const to = Math.min(from + BATCH_SIZE - 1, count - 1);

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order(orderBy, { ascending: true })
        .range(from, to);

      if (error) {
        throw error;
      }

      allData = allData.concat(data);
      from += BATCH_SIZE;

      progressBar(allData.length, count, `  Progression`);
    }

    // Sauvegarder en JSON
    const filePath = path.join(backupFolder, `${tableName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(allData, null, 2), 'utf-8');

    const fileSize = (fs.statSync(filePath).size / 1024).toFixed(2);
    log(`  ✓ Exporté: ${allData.length} lignes (${fileSize} KB)`, 'green');

    return { table: tableName, count: allData.length, success: true, size: fileSize };
  } catch (error) {
    log(`  ✗ Erreur lors de l'export de ${tableName}: ${error.message}`, 'red');
    return { table: tableName, count: 0, success: false, error: error.message };
  }
}

/**
 * Fonction principale
 */
async function main() {
  log('=== Export JSON de la base de données Linguami ===', 'yellow');
  log(`Date: ${new Date().toLocaleString('fr-FR')}`, 'yellow');
  console.log('');

  // Vérifier les variables d'environnement
  require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    log('ERREUR: Variables d\'environnement manquantes', 'red');
    log('Assurez-vous que .env.local contient:', 'red');
    log('  - NEXT_PUBLIC_SUPABASE_URL', 'red');
    log('  - SUPABASE_SERVICE_ROLE_KEY', 'red');
    process.exit(1);
  }

  // Créer le client Supabase
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });

  // Créer le dossier de backup
  if (!fs.existsSync(backupFolder)) {
    fs.mkdirSync(backupFolder, { recursive: true });
  }

  log(`Dossier de sauvegarde: ${backupFolder}`, 'blue');
  console.log('');

  // Exporter toutes les tables
  const results = [];
  let totalRecords = 0;

  for (let i = 0; i < TABLES_TO_BACKUP.length; i++) {
    const table = TABLES_TO_BACKUP[i];
    log(`[${i + 1}/${TABLES_TO_BACKUP.length}] ${table.name}`, 'yellow');

    const result = await exportTable(supabase, table.name, table.orderBy);
    results.push(result);

    if (result.success) {
      totalRecords += result.count;
    }

    console.log('');
  }

  // Créer un fichier de métadonnées
  const metadata = {
    backup_date: new Date().toISOString(),
    backup_timestamp: timestamp,
    supabase_url: supabaseUrl,
    total_tables: TABLES_TO_BACKUP.length,
    total_records: totalRecords,
    tables: results,
  };

  const metadataPath = path.join(backupFolder, '_metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');

  // Résumé
  log('=== Résumé de la sauvegarde ===', 'yellow');
  log(`Total de tables: ${TABLES_TO_BACKUP.length}`, 'blue');
  log(`Total d'enregistrements: ${totalRecords}`, 'blue');

  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;

  log(`Réussites: ${successCount}`, 'green');
  if (failureCount > 0) {
    log(`Échecs: ${failureCount}`, 'red');
    log('Tables en échec:', 'red');
    results.filter(r => !r.success).forEach(r => {
      log(`  - ${r.table}: ${r.error}`, 'red');
    });
  }

  console.log('');
  log('Dossier de sauvegarde:', 'green');
  log(`  ${backupFolder}`, 'green');
  console.log('');

  // Suggestions
  log('💡 Suggestions:', 'yellow');
  log('  - Compressez le dossier: 7z a backup.zip ' + backupFolder.replace(/\\/g, '/'), 'yellow');
  log('  - Sauvegardez sur un disque externe ou cloud', 'yellow');
  log('  - Gardez plusieurs versions de sauvegarde', 'yellow');
  console.log('');

  log('=== Export terminé ===', 'green');
}

// Exécuter le script
main().catch(error => {
  log(`Erreur fatale: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
