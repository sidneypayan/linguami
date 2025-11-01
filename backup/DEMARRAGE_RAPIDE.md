# Démarrage Rapide - Système de Sauvegarde Linguami

Guide de démarrage rapide pour mettre en place et utiliser le système de sauvegarde.

## ⚡ Installation rapide (5 minutes)

### Étape 1 : Installer PostgreSQL Client

**Windows (choisissez une option) :**

**Option A - Installer PostgreSQL complet :**
1. Téléchargez : https://www.postgresql.org/download/windows/
2. Lancez l'installeur
3. Vous pouvez décocher tous les composants sauf "Command Line Tools"
4. Ajoutez au PATH : `C:\Program Files\PostgreSQL\16\bin`

**Option B - Via Chocolatey (si installé) :**
```cmd
choco install postgresql
```

**Mac :**
```bash
brew install postgresql
```

**Linux (Ubuntu/Debian) :**
```bash
sudo apt-get update
sudo apt-get install postgresql-client
```

**Vérifier l'installation :**
```bash
pg_dump --version
# Devrait afficher : pg_dump (PostgreSQL) 16.x
```

---

### Étape 2 : Configurer les variables d'environnement

#### 2a. Obtenir vos identifiants Supabase

1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet **Linguami**
3. Cliquez sur **Settings** (icône engrenage)

**Pour les clés API :**
- Settings > **API**
- Copiez :
  - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ SECRET!

**Pour DATABASE_URL :**
- Settings > **Database** > **Connection string**
- Sélectionnez l'onglet **URI**
- Copiez l'URL complète
- **IMPORTANT** : Remplacez `[YOUR-PASSWORD]` par votre vrai mot de passe

#### 2b. Ajouter à .env.local

**Si le fichier existe déjà :**

Ouvrez `.env.local` à la racine du projet et ajoutez (si pas déjà présent) :

```env
# Connexion PostgreSQL pour backups
DATABASE_URL=postgresql://postgres:[VOTRE-MOT-DE-PASSE]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

**Si le fichier n'existe pas :**

```bash
# Copier l'exemple
cp backup/.env.example .env.local

# Éditez .env.local et remplissez vos vraies valeurs
```

#### 2c. Vérifier la configuration

```bash
# Depuis la racine du projet
grep DATABASE_URL .env.local
# Devrait afficher votre DATABASE_URL
```

---

### Étape 3 : Tester la première sauvegarde

#### Test SQL :

**Windows :**
```cmd
cd backup
backup-sql.bat
```

**Linux/Mac/Git Bash :**
```bash
cd backup
chmod +x backup-sql.sh
./backup-sql.sh
```

**Résultat attendu :**
```
=== Sauvegarde SQL de la base de données Linguami ===
Date: ...
Démarrage de la sauvegarde...
✓ Sauvegarde réussie !
✓ Compression réussie !
```

Le fichier sera créé dans : `backup/sql/linguami_backup_YYYYMMDD_HHMMSS.sql.gz`

#### Test JSON :

```bash
cd backup
node backup-json.js
```

**Résultat attendu :**
```
=== Export JSON de la base de données Linguami ===
[1/9] users_profile
  Nombre d'enregistrements: XX
  ✓ Exporté: XX lignes
...
=== Export terminé ===
```

Les fichiers seront créés dans : `backup/exports/backup_YYYY-MM-DDTHH-MM-SS/`

---

## 🎯 Utilisation quotidienne

### Sauvegarde manuelle complète

**La commande la plus simple :**

**Windows :**
```cmd
cd backup
backup-auto.bat
```

**Linux/Mac/Git Bash :**
```bash
cd backup
./backup-auto.sh
```

Cela fait :
- ✅ Sauvegarde SQL complète
- ✅ Export JSON de toutes les tables
- ✅ Compression automatique
- ✅ Nettoyage des anciennes sauvegardes
- ✅ Logs détaillés

---

### Sauvegarde automatisée (recommandé)

#### Windows - Planificateur de tâches

1. Appuyez sur `Win + R`
2. Tapez `taskschd.msc` et appuyez sur Entrée
3. Dans le panneau de droite, cliquez sur **Créer une tâche de base**

**Configuration :**
- **Nom** : `Linguami Backup Quotidien`
- **Description** : `Sauvegarde automatique de la base de données Linguami`

**Déclencheur :**
- Sélectionnez : `Quotidien`
- Heure : `02:00` (2h du matin)
- Répéter tous les : `1 jour`

**Action :**
- Action : `Démarrer un programme`
- Programme : `D:\linguami\backup\backup-auto.bat` (ajustez le chemin)
- Démarrer dans : `D:\linguami` (ajustez le chemin)

**Paramètres :**
- ✅ Cochez : "Exécuter même si l'utilisateur n'est pas connecté"
- ✅ Cochez : "Exécuter avec les autorisations maximales"

Cliquez sur **Terminer**

**Tester immédiatement :**
- Clic droit sur la tâche > **Exécuter**
- Vérifiez les logs dans `backup/logs/`

---

#### Linux/Mac - Cron

```bash
# Ouvrir l'éditeur crontab
crontab -e

# Ajouter cette ligne (sauvegarde tous les jours à 2h du matin)
0 2 * * * /chemin/complet/vers/linguami/backup/backup-auto.sh

# Sauvegarder et quitter (Ctrl+X, puis Y, puis Entrée)
```

**Vérifier que c'est activé :**
```bash
crontab -l
# Devrait afficher votre ligne
```

**Pour recevoir les erreurs par email :**
```bash
# Ajoutez en haut du crontab
MAILTO=votre-email@example.com

0 2 * * * /chemin/complet/vers/linguami/backup/backup-auto.sh
```

---

## 📊 Vérifier les sauvegardes

### Lister les sauvegardes disponibles

**Windows :**
```cmd
dir /B /O-D backup\sql\*.gz
dir /B /O-D /AD backup\exports\backup_*
```

**Linux/Mac :**
```bash
ls -lht backup/sql/*.gz | head -5
ls -ldt backup/exports/backup_* | head -5
```

### Vérifier les logs

**Dernier log :**
```bash
# Windows
type backup\logs\*.log | more

# Linux/Mac
tail -f backup/logs/*.log
```

### Espace disque utilisé

```bash
# Windows
du -sh backup

# Linux/Mac
du -sh backup/
```

---

## 🆘 Problèmes courants

### "pg_dump: command not found"

**Cause :** PostgreSQL Client n'est pas installé ou pas dans le PATH

**Solution :**
1. Installez PostgreSQL Client (voir Étape 1)
2. Sur Windows, ajoutez au PATH :
   - Recherchez "Variables d'environnement" dans le menu Démarrer
   - Éditez la variable `Path`
   - Ajoutez : `C:\Program Files\PostgreSQL\16\bin`
   - Redémarrez Git Bash/CMD

---

### "DATABASE_URL non définie"

**Cause :** Variable d'environnement manquante

**Solution :**
```bash
# Vérifier .env.local
cat .env.local | grep DATABASE_URL

# Si vide, ajoutez-la (voir Étape 2)
```

---

### "permission denied" lors de l'export JSON

**Cause :** Mauvaise clé Supabase (utilisation de l'anon key au lieu de service role)

**Solution :**
```env
# Dans .env.local, assurez-vous d'utiliser la SERVICE ROLE KEY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Pas la clé anon !
```

---

### Sauvegarde très lente

**Causes possibles :**
- Connexion Internet lente
- Base de données très volumineuse
- Serveur Supabase surchargé

**Solutions :**
1. Lancez pendant les heures creuses (nuit)
2. Augmentez la taille des batches dans `backup-json.js` :
   ```javascript
   const BATCH_SIZE = 1000; // au lieu de 100
   ```
3. Utilisez seulement la sauvegarde SQL (plus rapide)

---

### "Espace disque insuffisant"

**Solution - Nettoyage manuel :**
```bash
# Garder seulement les 3 dernières sauvegardes SQL
ls -t backup/sql/*.gz | tail -n +4 | xargs rm

# Garder seulement les 3 derniers exports JSON
ls -td backup/exports/backup_* | tail -n +4 | xargs rm -rf

# Nettoyer les logs de plus de 30 jours
find backup/logs -name "*.log" -mtime +30 -delete
```

---

## 🔄 Restauration rapide

### Restaurer depuis SQL (restauration complète)

```bash
# 1. Décompresser
gunzip backup/sql/linguami_backup_YYYYMMDD_HHMMSS.sql.gz

# 2. Restaurer (⚠️ ÉCRASE TOUTES LES DONNÉES!)
psql "$DATABASE_URL" < backup/sql/linguami_backup_YYYYMMDD_HHMMSS.sql
```

### Restaurer depuis JSON (restauration sélective)

```bash
# Lister les backups disponibles
node backup/restore-json.js

# Restaurer un backup spécifique
node backup/restore-json.js backup/exports/backup_2025-01-15T14-30-00
```

**Pour plus de détails, consultez :** [GUIDE_RESTAURATION.md](GUIDE_RESTAURATION.md)

---

## 📋 Checklist de sécurité

Avant de partir en vacances ou de faire une grosse mise à jour :

- [ ] J'ai fait une sauvegarde SQL complète
- [ ] J'ai fait un export JSON complet
- [ ] J'ai vérifié que les fichiers sont bien créés
- [ ] J'ai testé une restauration sur un projet de test
- [ ] J'ai copié les sauvegardes sur un disque externe ou cloud
- [ ] J'ai noté mes identifiants Supabase dans un endroit sûr
- [ ] Les sauvegardes automatiques sont configurées

---

## 🎓 Ressources

- **README complet :** [README.md](README.md)
- **Guide de restauration :** [GUIDE_RESTAURATION.md](GUIDE_RESTAURATION.md)
- **Documentation Supabase :** https://supabase.com/docs
- **Support :** https://supabase.com/support

---

## 💡 Conseils pro

### 1. Règle 3-2-1 des sauvegardes

- **3** copies de vos données
- Sur **2** types de supports différents
- **1** copie hors site (cloud)

**Exemple :**
- Original : Base Supabase
- Copie 1 : Sauvegarde locale (backup/sql)
- Copie 2 : Cloud (Google Drive, Dropbox, etc.)

### 2. Testez vos restaurations

**Une sauvegarde non testée = pas de sauvegarde !**

Tous les 3 mois :
1. Créez un nouveau projet Supabase de test
2. Restaurez votre dernière sauvegarde
3. Vérifiez que tout fonctionne

### 3. Documentez vos procédures

Gardez un fichier texte avec :
- URL de votre projet Supabase
- Où sont stockées les sauvegardes
- Procédure de restauration d'urgence
- Contact du support

### 4. Notifications

Configurez des notifications pour savoir si les sauvegardes échouent :

**Option A - Email :**
Ajoutez à la fin de `backup-auto.sh` :
```bash
echo "Sauvegarde terminée" | mail -s "Backup Linguami OK" votre@email.com
```

**Option B - Telegram :**
Voir [README.md](README.md) section "Notifications"

---

## ✅ Prochaines étapes

Maintenant que votre système de sauvegarde est configuré :

1. **Testez** une première sauvegarde manuelle
2. **Planifiez** les sauvegardes automatiques
3. **Testez** une restauration (sur un projet de test)
4. **Copiez** vos sauvegardes sur le cloud
5. **Dormez tranquille** 😊

---

**Créé le :** 2025-01-15
**Dernière mise à jour :** 2025-01-15
**Version :** 1.0

---

Besoin d'aide ? Consultez le [README complet](README.md) ou le [Guide de restauration](GUIDE_RESTAURATION.md).
