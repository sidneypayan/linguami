#!/usr/bin/env node

/**
 * Script de restauration JSON de la base de données Supabase
 * Restaure les données depuis un export JSON
 * Permet une restauration complète ou sélective
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Couleurs pour les messages
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

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
  process.stdout.write(`\r  ${label}: [${bar}] ${percentage}% (${current}/${total})`);
  if (current === total) {
    console.log('');
  }
}

/**
 * Demande confirmation à l'utilisateur
 */
async function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${colors.yellow}${question} (oui/non): ${colors.reset}`, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'oui' || answer.toLowerCase() === 'o');
    });
  });
}

/**
 * Restaure une table depuis JSON
 */
async function restoreTable(supabase, tableName, backupFolder, options = {}) {
  const { deleteExisting = false, upsert = true } = options;

  try {
    log(`\n[${tableName}]`, 'blue');

    const filePath = path.join(backupFolder, `${tableName}.json`);

    if (!fs.existsSync(filePath)) {
      log(`  ⚠ Fichier introuvable: ${tableName}.json`, 'yellow');
      return { table: tableName, success: false, skipped: true };
    }

    // Charger les données
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    log(`  Enregistrements à restaurer: ${data.length}`, 'blue');

    if (data.length === 0) {
      log(`  ⚠ Aucune donnée à restaurer`, 'yellow');
      return { table: tableName, count: 0, success: true, skipped: true };
    }

    // Supprimer les données existantes si demandé
    if (deleteExisting) {
      log(`  🗑  Suppression des données existantes...`, 'yellow');

      // Pour Supabase, on ne peut pas faire un DELETE FROM sans condition
      // On va d'abord compter les lignes
      const { count: existingCount, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (countError) {
        log(`  ⚠ Impossible de compter les enregistrements: ${countError.message}`, 'yellow');
      } else {
        log(`  Enregistrements existants: ${existingCount}`, 'blue');

        if (existingCount > 0) {
          // Supprimer par lots
          const { error: deleteError } = await supabase
            .from(tableName)
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Condition pour supprimer tout

          if (deleteError) {
            log(`  ⚠ Erreur lors de la suppression: ${deleteError.message}`, 'yellow');
          } else {
            log(`  ✓ Données existantes supprimées`, 'green');
          }
        }
      }
    }

    // Restaurer les données par lots
    const BATCH_SIZE = 100;
    let processed = 0;
    let inserted = 0;
    let errors = 0;

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE);

      let result;
      if (upsert) {
        // Upsert : remplace si existe déjà (basé sur la clé primaire)
        result = await supabase.from(tableName).upsert(batch, {
          onConflict: 'id', // Ajustez selon votre clé primaire
          ignoreDuplicates: false,
        });
      } else {
        // Insert : échoue si existe déjà
        result = await supabase.from(tableName).insert(batch);
      }

      if (result.error) {
        errors += batch.length;
        log(`  ✗ Erreur batch ${i}-${i + batch.length}: ${result.error.message}`, 'red');
      } else {
        inserted += batch.length;
      }

      processed += batch.length;
      progressBar(processed, data.length, 'Progression');
    }

    const successRate = ((inserted / data.length) * 100).toFixed(1);
    log(`  ✓ Restauration terminée: ${inserted}/${data.length} enregistrements (${successRate}%)`, 'green');

    if (errors > 0) {
      log(`  ⚠ Erreurs: ${errors} enregistrements`, 'yellow');
    }

    return { table: tableName, total: data.length, inserted, errors, success: errors === 0 };
  } catch (error) {
    log(`  ✗ Erreur fatale: ${error.message}`, 'red');
    return { table: tableName, success: false, error: error.message };
  }
}

/**
 * Affiche les métadonnées d'un backup
 */
function displayBackupInfo(backupFolder) {
  const metadataPath = path.join(backupFolder, '_metadata.json');

  if (!fs.existsSync(metadataPath)) {
    log('⚠ Fichier de métadonnées introuvable', 'yellow');
    return;
  }

  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));

  log('Informations du backup:', 'blue');
  log(`  Date: ${new Date(metadata.backup_date).toLocaleString('fr-FR')}`, 'blue');
  log(`  URL Supabase: ${metadata.supabase_url}`, 'blue');
  log(`  Tables: ${metadata.total_tables}`, 'blue');
  log(`  Enregistrements: ${metadata.total_records}`, 'blue');
  console.log('');

  log('Tables disponibles:', 'blue');
  metadata.tables.forEach((table) => {
    if (table.success) {
      log(`  ✓ ${table.table} (${table.count} enregistrements, ${table.size} KB)`, 'green');
    } else {
      log(`  ✗ ${table.table} (erreur: ${table.error})`, 'red');
    }
  });
  console.log('');
}

/**
 * Liste les backups disponibles
 */
function listAvailableBackups() {
  const exportsDir = path.join(__dirname, 'exports');

  if (!fs.existsSync(exportsDir)) {
    log('Aucun backup disponible dans exports/', 'yellow');
    return [];
  }

  const backups = fs
    .readdirSync(exportsDir)
    .filter((dir) => dir.startsWith('backup_'))
    .map((dir) => {
      const fullPath = path.join(exportsDir, dir);
      const stats = fs.statSync(fullPath);
      return {
        name: dir,
        path: fullPath,
        date: stats.mtime,
      };
    })
    .sort((a, b) => b.date - a.date);

  return backups;
}

/**
 * Fonction principale
 */
async function main() {
  log('╔═══════════════════════════════════════════════════════╗', 'yellow');
  log('║   Restauration JSON de la base de données Linguami   ║', 'yellow');
  log('╚═══════════════════════════════════════════════════════╝', 'yellow');
  console.log('');

  // Vérifier les variables d'environnement
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
    auth: { persistSession: false },
  });

  log(`Base de données cible: ${supabaseUrl}`, 'blue');
  console.log('');

  // Récupérer le dossier de backup depuis les arguments
  let backupFolder = process.argv[2];

  if (!backupFolder) {
    // Lister les backups disponibles
    log('Backups disponibles:', 'blue');
    const backups = listAvailableBackups();

    if (backups.length === 0) {
      log('Aucun backup trouvé dans exports/', 'red');
      log('', 'reset');
      log('Usage: node restore-json.js <backup_folder>', 'yellow');
      log('Exemple: node restore-json.js backup/exports/backup_2025-01-15T10-30-00', 'yellow');
      process.exit(1);
    }

    backups.forEach((backup, index) => {
      log(`  [${index + 1}] ${backup.name} (${backup.date.toLocaleString('fr-FR')})`, 'green');
    });

    console.log('');
    log('Usage: node restore-json.js <backup_folder>', 'yellow');
    log('Exemple: node restore-json.js backup/exports/backup_2025-01-15T10-30-00', 'yellow');
    console.log('');
    log('Ou utilisez directement:', 'yellow');
    log(`  node restore-json.js "${backups[0].path}"`, 'yellow');
    process.exit(0);
  }

  // Vérifier que le dossier existe
  if (!fs.existsSync(backupFolder)) {
    log(`Dossier introuvable: ${backupFolder}`, 'red');
    process.exit(1);
  }

  log(`Dossier de restauration: ${backupFolder}`, 'blue');
  console.log('');

  // Afficher les infos du backup
  displayBackupInfo(backupFolder);

  // Demander confirmation
  log('⚠️  ATTENTION ⚠️', 'red');
  log('Cette opération va modifier votre base de données.', 'red');
  log('Assurez-vous d\'avoir une sauvegarde de sécurité avant de continuer.', 'red');
  console.log('');

  const confirm = await askConfirmation('Voulez-vous continuer la restauration ?');

  if (!confirm) {
    log('Restauration annulée.', 'yellow');
    process.exit(0);
  }

  console.log('');

  // Options de restauration
  log('Options de restauration:', 'blue');
  const deleteExisting = await askConfirmation(
    'Supprimer les données existantes avant restauration ?'
  );
  const upsert = true; // Toujours utiliser upsert pour éviter les erreurs de doublons

  console.log('');
  log('Début de la restauration...', 'green');
  console.log('');

  // Tables à restaurer dans l'ordre (important pour les dépendances!)
  const TABLES_TO_RESTORE = [
    'users_profile',
    'xp_rewards_config',
    'user_xp_profile',
    'xp_transactions',
    'user_h5p_progress',
    'user_goals',
    'user_achievements',
    'weekly_xp_tracking',
    'monthly_xp_tracking',
  ];

  // Restaurer toutes les tables
  const results = [];
  let totalRecords = 0;
  let totalInserted = 0;
  let totalErrors = 0;

  for (let i = 0; i < TABLES_TO_RESTORE.length; i++) {
    const tableName = TABLES_TO_RESTORE[i];
    log(`[${i + 1}/${TABLES_TO_RESTORE.length}] ${tableName}`, 'magenta');

    const result = await restoreTable(supabase, tableName, backupFolder, {
      deleteExisting,
      upsert,
    });

    results.push(result);

    if (result.total) totalRecords += result.total;
    if (result.inserted) totalInserted += result.inserted;
    if (result.errors) totalErrors += result.errors;
  }

  // Résumé
  console.log('');
  log('╔═══════════════════════════════════════════════════════╗', 'yellow');
  log('║   Résumé de la restauration                           ║', 'yellow');
  log('╚═══════════════════════════════════════════════════════╝', 'yellow');

  log(`Tables traitées: ${TABLES_TO_RESTORE.length}`, 'blue');
  log(`Enregistrements totaux: ${totalRecords}`, 'blue');
  log(`Enregistrements insérés: ${totalInserted}`, 'green');

  if (totalErrors > 0) {
    log(`Erreurs: ${totalErrors}`, 'red');
  }

  const successRate = totalRecords > 0 ? ((totalInserted / totalRecords) * 100).toFixed(1) : 0;
  log(`Taux de succès: ${successRate}%`, successRate === '100.0' ? 'green' : 'yellow');

  console.log('');
  log('Détails par table:', 'blue');
  results.forEach((result) => {
    if (result.skipped) {
      log(`  ⊘ ${result.table} - ignoré`, 'yellow');
    } else if (result.success) {
      log(`  ✓ ${result.table} - ${result.inserted}/${result.total} enregistrements`, 'green');
    } else {
      log(`  ✗ ${result.table} - erreur: ${result.error || 'inconnue'}`, 'red');
    }
  });

  console.log('');
  log('╔═══════════════════════════════════════════════════════╗', 'green');
  log('║   Restauration terminée                                ║', 'green');
  log('╚═══════════════════════════════════════════════════════╝', 'green');
  console.log('');

  log('💡 Vérifications recommandées:', 'yellow');
  log('  1. Testez la connexion à votre application', 'yellow');
  log('  2. Vérifiez les compteurs d\'utilisateurs et XP', 'yellow');
  log('  3. Consultez les leaderboards', 'yellow');
  log('  4. Testez les fonctionnalités critiques', 'yellow');
  console.log('');
}

// Exécuter le script
main().catch((error) => {
  log(`Erreur fatale: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
