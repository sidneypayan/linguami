# App Router (Next.js 15)

Ce dossier contient les pages utilisant le **nouveau App Router** de Next.js 13+.

## 📊 État de la migration

**Démarré :** 14 novembre 2024
**Progression :** Phase 1 - Setup initial

### Pages migrées
- ✅ `/[locale]/privacy` - Politique de confidentialité

### Pages restantes dans Pages Router
- Toutes les autres pages (~53 pages)
- Voir `pages/` pour les pages non migrées

## 🏗️ Structure

```
app/
├── layout.js               # Root layout (HTML, fonts, metadata)
├── providers.js            # Client providers (Redux, Theme, Auth, Toaster)
├── not-found.js            # 404 global (TODO)
└── [locale]/               # Routes i18n (fr, en, ru)
    ├── layout.js           # Layout avec Navbar/Footer
    └── privacy/
        └── page.js         # Page politique de confidentialité
```

## 🎯 Conventions

### Nomenclature des fichiers
- `layout.js` - Layout partagé entre plusieurs pages
- `page.js` - Page (route accessible)
- `loading.js` - État de chargement
- `error.js` - Gestion d'erreur
- `not-found.js` - Page 404

### Client vs Server Components
- **`'use client'`** - Composant Client (hooks, MUI, Redux, interactivité)
- **Pas de directive** - Server Component par défaut (meilleur pour la performance)

### Organisation
- Routes i18n : toutes sous `[locale]/`
- Layouts imbriqués : un layout par niveau si nécessaire
- Composants réutilisables : dans `/components` (pas dans `/app`)

## 🔄 Cohabitation avec Pages Router

**Priorité :** App Router > Pages Router

Si une route existe dans `app/[locale]/privacy/page.js`, elle sera utilisée.
Sinon, Next.js cherche dans `pages/privacy.js` (fallback).

**Avantage :** Migration progressive et sans risque !

## 📚 Documentation

- **Guide complet :** `docs/MIGRATION_APP_ROUTER.md`
- **Référence rapide :** `docs/APP_ROUTER_QUICK_REFERENCE.md`
- **Next.js Docs :** https://nextjs.org/docs/app

## 🚀 Prochaines étapes

1. Migrer `not-found.js` (404)
2. Migrer le blog (`/blog` et `/blog/[slug]`)
3. Migrer les pages simples (leaderboard, settings)
4. Attendre migration Redux avant les pages complexes

---

**Note :** Les API routes restent dans `pages/api/` - ne pas les migrer.
