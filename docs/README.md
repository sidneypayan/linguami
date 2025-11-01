# Documentation Linguami

Documentation complète du projet Linguami, incluant les systèmes de gamification, les optimisations SEO et les guides techniques.

---

## 📂 Structure de la documentation

```
docs/
├── README.md                          # Ce fichier
├── systems/                           # Documentation des systèmes
│   ├── XP_SYSTEM_README.md           # Système XP et gamification
│   └── GOLD_SYSTEM_README.md         # Système de monnaie Gold
└── SEO-OPTIMIZATIONS.md              # Optimisations SEO multilingues
```

---

## 🎮 Systèmes de gamification

### Système XP
**Fichier :** [`systems/XP_SYSTEM_README.md`](systems/XP_SYSTEM_README.md)

Documentation complète du système XP et de gamification de Linguami.

**Contenu :**
- ✅ Vue d'ensemble du système
- ✅ Installation et configuration
- ✅ Architecture des tables
- ✅ API Endpoints (`/api/xp/*`, `/api/goals`, `/api/statistics`)
- ✅ Exemples d'intégration
- ✅ Formules de calcul de niveaux
- ✅ Configuration des récompenses

**Tables concernées :**
- `user_xp_profile` - Profils XP des utilisateurs
- `xp_rewards_config` - Configuration des récompenses
- `xp_transactions` - Historique des transactions
- `user_h5p_progress` - Progression sur activités H5P
- `user_goals` - Objectifs utilisateurs
- `user_achievements` - Badges et achievements

**Dernière mise à jour :** 2025-11-01 (ajout de `created_at`, `updated_at`, `total_gold`)

---

### Système Gold
**Fichier :** [`systems/GOLD_SYSTEM_README.md`](systems/GOLD_SYSTEM_README.md)

Documentation du système de monnaie virtuelle (Gold) de Linguami.

**Contenu :**
- ✅ Philosophie du système Gold
- ✅ Distribution et équilibrage
- ✅ Intégration avec le système XP
- ✅ Configuration des récompenses Gold
- ✅ Affichage dans l'interface
- ✅ Évolutions futures possibles

**Philosophie :**
- Gold 50-100x plus rare que l'XP
- Récompense les achievements significatifs
- Pas pour les actions répétitives
- Accumulation stratégique

**Tables modifiées :**
- `user_xp_profile.total_gold` - Solde Gold du joueur
- `xp_rewards_config.gold_amount` - Montant Gold par action
- `xp_transactions.gold_earned` - Gold gagné dans la transaction

---

## 🔍 Optimisations SEO

**Fichier :** [`SEO-OPTIMIZATIONS.md`](SEO-OPTIMIZATIONS.md)

Documentation des optimisations SEO pour le référencement multilingue (Google, Yandex, Bing).

**Contenu :**
- ✅ Support multilingue (français, russe, anglais)
- ✅ Métadonnées optimisées
- ✅ Balises hreflang
- ✅ Schema JSON-LD (Organization, Course, Blog, etc.)
- ✅ Open Graph pour réseaux sociaux
- ✅ Optimisations par page (10+ pages)
- ✅ Fichiers de vérification moteurs de recherche
- ✅ Sitemap XML et robots.txt

**Pages optimisées :**
- Page d'accueil
- Matériaux pédagogiques (`/materials`)
- Sections de matériaux (`/materials/[section]`)
- Blog (`/blog`, `/blog/[slug]`)
- Leçons (`/lessons`)
- Professeurs (`/teacher`)
- Leaderboard (`/leaderboard`)
- Dictionnaire (`/dictionary`)

---

## 🗄️ Documentation base de données

Pour la documentation des migrations et de la structure de la base de données, consultez :

**Dossier :** [`../database/`](../database/README.md)

**Contenu :**
- 📦 Historique complet des migrations
- 🔧 Scripts utilitaires
- 📖 Guides de migration
- 📋 Checklist avant migration

---

## 💾 Sauvegardes et restauration

Pour la documentation du système de sauvegarde :

**Dossier :** [`../backup/`](../backup/README.md)

**Contenu :**
- 🚀 Guide de démarrage rapide
- 📚 Documentation complète
- 🔄 Guide de restauration
- 🔧 Scripts de sauvegarde SQL et JSON

---

## 🔗 Liens rapides

### Pour les développeurs

| Besoin | Documentation |
|--------|---------------|
| Ajouter de l'XP à un utilisateur | [`systems/XP_SYSTEM_README.md`](systems/XP_SYSTEM_README.md#api-endpoints) |
| Configurer les récompenses | [`systems/XP_SYSTEM_README.md`](systems/XP_SYSTEM_README.md#configuration-xp) |
| Comprendre le système Gold | [`systems/GOLD_SYSTEM_README.md`](systems/GOLD_SYSTEM_README.md) |
| Optimiser le SEO d'une page | [`SEO-OPTIMIZATIONS.md`](SEO-OPTIMIZATIONS.md) |
| Appliquer une migration | [`../database/README.md`](../database/README.md#comment-appliquer-une-nouvelle-migration) |
| Faire une sauvegarde | [`../backup/README.md`](../backup/README.md) |

### Pour l'administration

| Action | Documentation |
|--------|---------------|
| Modifier les récompenses XP | [`systems/XP_SYSTEM_README.md`](systems/XP_SYSTEM_README.md#configuration-xp) |
| Voir les statistiques | [`systems/XP_SYSTEM_README.md`](systems/XP_SYSTEM_README.md#api-endpoints) |
| Sauvegarder la base | [`../backup/DEMARRAGE_RAPIDE.md`](../backup/DEMARRAGE_RAPIDE.md) |
| Restaurer des données | [`../backup/GUIDE_RESTAURATION.md`](../backup/GUIDE_RESTAURATION.md) |

---

## 📝 Conventions de documentation

### Format des fichiers README

Tous les fichiers README suivent cette structure :
1. **Table des matières** avec liens d'ancrage
2. **Vue d'ensemble** courte et claire
3. **Installation/Configuration** étape par étape
4. **Architecture** avec schémas/exemples
5. **Utilisation** avec code examples
6. **API/Intégration** si applicable
7. **Dépannage** pour les problèmes courants

### Mise à jour

Lors de modifications du système :
1. ✅ Mettre à jour le README concerné
2. ✅ Ajouter la date de dernière mise à jour
3. ✅ Documenter les changements majeurs
4. ✅ Mettre à jour les exemples de code si nécessaire

---

## 🆕 Dernières mises à jour

### 2025-11-01
- ✅ **XP_SYSTEM_README.md** : Ajout de `created_at`, `updated_at` et `total_gold` dans les structures de tables
- ✅ Organisation de la documentation dans `docs/`
- ✅ Création de ce README.md d'index

### 2024-10-31
- ✅ **GOLD_SYSTEM_README.md** : Documentation initiale du système Gold
- ✅ **XP_SYSTEM_README.md** : Documentation initiale du système XP

### 2024-10-30
- ✅ **SEO-OPTIMIZATIONS.md** : Documentation des optimisations SEO multilingues

---

## 📚 Ressources externes

- [Documentation Supabase](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Google Search Console](https://search.google.com/search-console)
- [Yandex Webmaster](https://webmaster.yandex.com/)

---

## 🤝 Contribution

Pour contribuer à cette documentation :

1. **Vérifiez l'existant** avant d'ajouter une nouvelle doc
2. **Suivez les conventions** de format ci-dessus
3. **Testez les exemples** de code avant de documenter
4. **Gardez à jour** : documentation périmée = documentation inutile
5. **Soyez clair** : privilégiez la clarté à l'exhaustivité

---

**Projet :** Linguami - Plateforme d'apprentissage des langues
**Langues supportées :** Français, Russe, Anglais
**Technologies :** Next.js, Supabase, PostgreSQL, React

**Dernière mise à jour :** 2025-11-01
**Version :** 1.0
