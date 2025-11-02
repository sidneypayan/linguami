# Système de Sauvegarde Linguami

Documentation complète du système de sauvegarde et de restauration de la base de données Supabase pour Linguami.

## 📋 Vue d'ensemble

Ce dossier contient tous les outils nécessaires pour sauvegarder et restaurer votre base de données Linguami. Vous avez accès à :

- ✅ Sauvegarde SQL complète (structure + données)
- ✅ Scripts automatisés pour sauvegardes régulières
- ✅ Guide complet de restauration

## 🚀 Démarrage rapide

### Installation

#### 1. Installer les dépendances

**Sur Windows :**
```bash
# Installer PostgreSQL Client
# Téléchargez depuis : https://www.postgresql.org/download/windows/
# Ajoutez à votre PATH : C:\Program Files\PostgreSQL\XX\bin

# Vérifier l'installation
pg_dump --version
```

**Sur Mac :**
```bash
brew install postgresql
```

**Sur Linux :**
```bash
sudo apt-get install postgresql-client
```

#### 2. Installer les packages Node.js

```bash
# Dans le dossier racine du projet
npm install @supabase/supabase-js dotenv
```

#### 3. Configurer les variables d'environnement

```bash
# Créez ou modifiez .env.local à la racine du projet
cp backup/.env.example ../.env.local

# Éditez .env.local et remplissez vos vraies valeurs
```

**Variables essentielles :**
```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
```

Pour obtenir ces valeurs :
1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet
3. Settings > API (pour les clés)
4. Settings > Database > Connection string (pour DATABASE_URL)

### Première sauvegarde

#### Option 1 : Sauvegarde SQL complète

**Linux/Mac/Git Bash :**
```bash
cd backup
chmod +x backup-sql.sh
./backup-sql.sh
```

**Windows (CMD) :**
```cmd
cd backup
backup-sql.bat
```

Résultat : Un fichier `.sql.gz` dans `backup/sql/`

#### Option 2 : Sauvegarde automatisée

**Linux/Mac/Git Bash :**
```bash
cd backup
chmod +x backup-auto.sh
./backup-auto.sh
```

**Windows (CMD) :**
```cmd
cd backup
backup-auto.bat
```

Résultat : Sauvegarde SQL + Nettoyage automatique

---

## 📂 Structure du dossier

```
backup/
├── README.md                      # Ce fichier
├── GUIDE_RESTAURATION.md          # Guide détaillé de restauration
├── .env.example                   # Exemple de configuration
│
├── backup-sql.sh                  # Sauvegarde SQL (Linux/Mac)
├── backup-sql.bat                 # Sauvegarde SQL (Windows)
│
├── backup-auto.sh                 # Sauvegarde automatisée (Linux/Mac)
├── backup-auto.bat                # Sauvegarde automatisée (Windows)
│
├── sql/                           # Sauvegardes SQL (.sql.gz)
│   └── linguami_backup_*.sql.gz
│
└── logs/                          # Logs d'exécution
    └── *.log
```

---

## 📖 Guide des scripts

### 1. backup-sql.sh / backup-sql.bat

**Ce qu'il fait :**
- Crée une sauvegarde complète de la base de données en SQL
- Inclut la structure (tables, fonctions, politiques RLS)
- Inclut toutes les données
- Compresse automatiquement avec gzip/7zip

**Quand l'utiliser :**
- Avant une migration importante
- Avant de modifier la structure de la base
- Pour une sauvegarde complète et restaurable

**Usage :**
```bash
# Linux/Mac/Git Bash
./backup-sql.sh

# Windows
backup-sql.bat
```

**Résultat :**
```
backup/sql/linguami_backup_20250115_143022.sql.gz
```

---

### 2. backup-auto.sh / backup-auto.bat

**Ce qu'il fait :**
- Exécute sauvegarde SQL complète
- Nettoie automatiquement les anciennes sauvegardes
- Garde les 7 dernières sauvegardes
- Crée des logs détaillés

**Quand l'utiliser :**
- Pour les sauvegardes automatisées quotidiennes
- Planifié avec cron (Linux/Mac) ou Task Scheduler (Windows)

**Usage manuel :**
```bash
# Linux/Mac/Git Bash
./backup-auto.sh

# Windows
backup-auto.bat
```

**Planification automatique :**

**Linux/Mac (Cron) :**
```bash
# Éditer crontab
crontab -e

# Ajouter : Tous les jours à 2h du matin
0 2 * * * /chemin/vers/linguami/backup/backup-auto.sh
```

**Windows (Planificateur de tâches) :**
1. Ouvrir le Planificateur de tâches (`Win + R` → `taskschd.msc`)
2. Créer une tâche de base
3. Nom : "Linguami Backup"
4. Déclencheur : Quotidien à 2h00
5. Action : Démarrer un programme
6. Programme : `D:\linguami\backup\backup-auto.bat`
7. Démarrer dans : `D:\linguami`

---

## 🔄 Restauration

Consultez le **[Guide de Restauration](GUIDE_RESTAURATION.md)** complet pour :

- Restauration complète depuis SQL
- Restauration d'urgence via Supabase
- Dépannage des problèmes courants

### Restauration rapide (SQL)

```bash
# Décompresser
gunzip backup/sql/linguami_backup_YYYYMMDD_HHMMSS.sql.gz

# Restaurer
psql "$DATABASE_URL" < backup/sql/linguami_backup_YYYYMMDD_HHMMSS.sql
```

---

## ⚙️ Configuration avancée

### Notifications par email/Telegram

1. Décommentez les sections de notification dans `backup-auto.sh`
2. Ajoutez vos identifiants dans `.env.local`

**Exemple Telegram :**
```bash
# .env.local
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
```

**Dans backup-auto.sh :**
```bash
# Décommentez à la fin du script
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
     -d "chat_id=$TELEGRAM_CHAT_ID" \
     -d "text=✅ Sauvegarde Linguami terminée avec succès"
```

### Changer la rétention des sauvegardes

Par défaut, les scripts gardent les 7 dernières sauvegardes.

Dans `backup-auto.sh`, modifiez :
```bash
# Ligne ~90
if [ "$SQL_COUNT" -gt 7 ]; then  # Changez 7 par votre valeur
```

---

## 🔒 Sécurité

### ⚠️ IMPORTANT

**NE COMMITTEZ JAMAIS** :
- `.env.local`
- Fichiers de sauvegarde contenant des données réelles
- Logs contenant des informations sensibles

### Fichiers déjà dans .gitignore

```gitignore
# Sauvegardes
backup/sql/*.sql
backup/sql/*.sql.gz
backup/logs/*.log

# Configuration
.env.local
```

### Bonnes pratiques

1. **Gardez le Service Role Key secret** - Il donne un accès complet à votre base
2. **Chiffrez les sauvegardes** si vous les stockez sur le cloud
3. **Utilisez des mots de passe forts** pour votre base de données
4. **Limitez l'accès** aux fichiers de sauvegarde
5. **Testez vos restaurations** régulièrement

---

## 📊 Monitoring

### Vérifier l'état des sauvegardes

```bash
# Nombre de sauvegardes disponibles
ls -l backup/sql/*.sql.gz | wc -l

# Taille totale
du -sh backup/

# Dernière sauvegarde
ls -lht backup/sql/*.sql.gz | head -1
```

### Vérifier les logs

```bash
# Dernier log
tail -f backup/logs/auto_backup_*.log

# Rechercher les erreurs
grep -i "error\|erreur" backup/logs/*.log
```

---

## 🆘 Dépannage

### Problème : "DATABASE_URL non définie"

**Solution :**
```bash
# Vérifiez .env.local
cat .env.local | grep DATABASE_URL

# Obtenez votre DATABASE_URL sur Supabase :
# Settings > Database > Connection string > URI
```

---

### Problème : "pg_dump: command not found"

**Solution :** Installez PostgreSQL Client

**Windows :**
1. https://www.postgresql.org/download/windows/
2. Installez PostgreSQL (ou juste les outils clients)
3. Ajoutez au PATH : `C:\Program Files\PostgreSQL\16\bin`

**Mac :**
```bash
brew install postgresql
```

**Linux :**
```bash
sudo apt-get install postgresql-client
```

---

### Problème : "permission denied" lors de l'export JSON

**Solution :** Utilisez le Service Role Key (pas l'Anon Key)

```env
# .env.local
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key  # Pas l'anon key!
```

---

### Problème : Espace disque insuffisant

**Solution :** Nettoyez les anciennes sauvegardes

```bash
# Garder seulement les 3 dernières sauvegardes SQL
ls -t backup/sql/*.sql.gz | tail -n +4 | xargs rm
```

---

## 📚 Ressources

- [Guide de Restauration complet](GUIDE_RESTAURATION.md)
- [Documentation Supabase](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Support Supabase](https://supabase.com/support)

---

## 🤝 Contribution

Pour améliorer ce système de backup :

1. Testez les scripts
2. Signalez les bugs
3. Proposez des améliorations
4. Partagez vos cas d'usage

---

## 📝 Changelog

### Version 1.1 (2025-11-02)
- ✅ Suppression de l'export JSON (redondant avec SQL)
- ✅ Simplification du système de backup
- ✅ Focus sur backup SQL complet uniquement

### Version 1.0 (2025-01-15)
- ✅ Sauvegarde SQL complète
- ✅ Scripts automatisés
- ✅ Support Windows, Linux, Mac
- ✅ Guide de restauration complet
- ✅ Nettoyage automatique des anciennes sauvegardes
- ✅ Logs détaillés

---

## ❓ Questions fréquentes (FAQ)

### À quelle fréquence dois-je sauvegarder ?

**Recommandation :**
- **Minimum** : 1 fois par semaine
- **Optimal** : 1 fois par jour (automatisé)
- **Avant modifications importantes** : Toujours

### Combien de temps garder les sauvegardes ?

**Recommandation :**
- Quotidiennes : 7 derniers jours
- Hebdomadaires : 4 dernières semaines
- Mensuelles : 12 derniers mois

### Quel format utiliser ?

**SQL (pg_dump) :**
- ✅ Restauration complète facile
- ✅ Inclut structure + données + fonctions
- ✅ Format compact (compressé)
- ✅ Backup complet et auto-suffisant

Le script `backup-auto` effectue automatiquement la sauvegarde SQL et nettoie les anciennes versions.

### Puis-je sauvegarder automatiquement sur le cloud ?

Oui ! Ajoutez à la fin de `backup-auto.sh` :

**Google Drive (rclone) :**
```bash
rclone copy backup/sql/ gdrive:linguami-backups/sql/
```

**AWS S3 :**
```bash
aws s3 sync backup/sql/ s3://mon-bucket/linguami/sql/
```

---

**Créé par :** Linguami Team
**Date :** 2025-01-15
**Version :** 1.0

---

💡 **Conseil :** Ajoutez ce README à vos favoris et testez une restauration dès maintenant !
