# Scripts Linguami

Ce dossier contient tous les scripts utilitaires pour gérer l'application Linguami.

## Migration vers Cloudflare R2

### 📋 Fichiers de migration

1. **`migrate-to-r2.js`** - Script principal de migration
   - Migre tous les fichiers de Supabase Storage vers Cloudflare R2
   - Préserve la structure de dossiers
   - Génère un rapport détaillé

2. **`verify-r2-migration.js`** - Script de vérification
   - Compare les fichiers entre Supabase et R2
   - Détecte les fichiers manquants ou différents
   - Génère un rapport de vérification

3. **`cloudflare-worker-example.js`** - Worker Cloudflare
   - Code exemple pour servir les fichiers R2
   - Optimisé pour les performances et le cache
   - Support CORS et Range requests

4. **`MIGRATION_R2_GUIDE.md`** - Guide complet
   - Instructions étape par étape
   - Configuration de R2
   - Troubleshooting

### 🚀 Utilisation rapide

```bash
# 1. Installer les dépendances
npm install @aws-sdk/client-s3

# 2. Configurer .env.local avec vos credentials R2
# (voir .env.local.example)

# 3. Lancer la migration
node scripts/migrate-to-r2.js

# 4. Vérifier que tout est bien migré
node scripts/verify-r2-migration.js

# 5. Mettre à jour NEXT_PUBLIC_SUPABASE_IMAGE dans .env.local
# 6. Redémarrer le serveur de développement
```

### 📊 Rapports générés

Après migration, vous trouverez:
- `scripts/migration-report.json` - Rapport de migration complet
- `scripts/verification-report.json` - Rapport de vérification

## Autres scripts

### Optimisation d'images

```bash
# Optimiser toutes les images dans public/
npm run optimize-images

# Optimiser une seule image
npm run optimize-image

# Optimiser et remplacer les images existantes
npm run optimize-replace
```

### Tests

```bash
# Lancer les tests en mode watch
npm run test

# Lancer les tests une fois
npm test -- --watchAll=false
```

## Variables d'environnement requises

Pour la migration R2, ajoutez dans `.env.local`:

```bash
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=linguami
```

## Support

En cas de problème:
1. Consultez le guide de migration: `MIGRATION_R2_GUIDE.md`
2. Vérifiez les rapports JSON générés
3. Consultez les logs du script
