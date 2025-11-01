# Changelog - Système de Sauvegarde Linguami

Historique des modifications du système de sauvegarde.

---

## [1.1.0] - 2025-11-01

### ✨ Améliorations

#### Tri chronologique par `created_at`
- **Mise à jour de `backup-json.js`**
  - `users_profile` : Maintenant trié par `created_at` au lieu de `id`
  - `user_xp_profile` : Maintenant trié par `created_at` au lieu de `total_xp`
  - Les sauvegardes sont maintenant dans l'ordre chronologique

#### Avantages
- 📅 Export chronologique plus logique
- 🔍 Plus facile de voir l'évolution temporelle
- 📊 Meilleure traçabilité des données historiques
- 🔄 Cohérence avec la structure de la base de données

### 🔧 Détails techniques

**Fichiers modifiés :**
- `backup/backup-json.js` - Mise à jour de l'ordre de tri

**Tables affectées :**
```javascript
// Avant
{ name: 'users_profile', orderBy: 'id' }
{ name: 'user_xp_profile', orderBy: 'total_xp' }

// Après
{ name: 'users_profile', orderBy: 'created_at' }
{ name: 'user_xp_profile', orderBy: 'created_at' }
```

### ✅ Tests

- ✅ Export JSON avec tri chronologique
- ✅ Toutes les tables (9/9) exportées avec succès
- ✅ 98 enregistrements sauvegardés
- ✅ Vérification du tri : Premier utilisateur créé en 2022

---

## [1.0.0] - 2025-11-01

### 🎉 Lancement initial

#### Scripts de sauvegarde
- ✅ `backup-sql.sh` / `backup-sql.bat` - Sauvegarde SQL complète (pg_dump)
- ✅ `backup-json.js` - Export JSON de toutes les tables
- ✅ `backup-auto.sh` / `backup-auto.bat` - Sauvegarde automatisée
- ✅ `restore-json.js` - Restauration interactive depuis JSON

#### Structure
```
backup/
├── sql/              # Sauvegardes SQL (.sql.gz)
├── exports/          # Exports JSON
├── logs/             # Logs d'exécution
└── scripts/          # Scripts de sauvegarde
```

#### Documentation
- ✅ `README.md` - Documentation complète
- ✅ `DEMARRAGE_RAPIDE.md` - Guide de démarrage (5 min)
- ✅ `GUIDE_RESTAURATION.md` - Guide de restauration détaillé

#### Tables sauvegardées
1. `users_profile` - Profils utilisateurs
2. `user_xp_profile` - Profils XP et niveaux
3. `xp_rewards_config` - Configuration des récompenses
4. `xp_transactions` - Historique des transactions XP
5. `user_h5p_progress` - Progression sur les activités H5P
6. `user_goals` - Objectifs utilisateurs (quotidien/hebdo/mensuel)
7. `user_achievements` - Achievements et badges
8. `weekly_xp_tracking` - Tracking hebdomadaire pour leaderboard
9. `monthly_xp_tracking` - Tracking mensuel pour leaderboard

#### Fonctionnalités
- ✅ Sauvegarde SQL complète avec compression
- ✅ Export JSON lisible et versionnable
- ✅ Nettoyage automatique (garde 7 dernières sauvegardes)
- ✅ Logs détaillés
- ✅ Support multi-plateforme (Windows, Linux, Mac)
- ✅ Protection Git (données sensibles non committées)
- ✅ Restauration interactive

---

## Prochaines versions (Roadmap)

### [1.2.0] - Prévu
- [ ] Sauvegarde automatique sur cloud (Google Drive, Dropbox)
- [ ] Notifications par email/Telegram
- [ ] Vérification d'intégrité des sauvegardes
- [ ] Compression différentielle

### [1.3.0] - Prévu
- [ ] Interface web pour gérer les sauvegardes
- [ ] Planification avancée (cron intégré)
- [ ] Statistiques de sauvegarde

---

## Notes de migration

### De 1.0.0 à 1.1.0

**Aucune action requise !** Les scripts sont rétrocompatibles.

Si vous voulez profiter du nouveau tri chronologique :
1. Aucune modification de configuration nécessaire
2. La prochaine sauvegarde utilisera automatiquement `created_at`
3. Les anciennes sauvegardes restent valides

---

## Support

Pour des questions ou problèmes :
1. Consultez la documentation dans `backup/README.md`
2. Vérifiez les logs dans `backup/logs/`
3. Consultez le guide de dépannage dans `backup/GUIDE_RESTAURATION.md`

---

**Maintenu par :** Linguami Team
**Dernière mise à jour :** 2025-11-01
