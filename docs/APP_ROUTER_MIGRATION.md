# Migration vers App Router - Documentation

> **⚠️ DOCUMENT OBSOLÈTE**
>
> Ce document est conservé pour référence historique. Pour la documentation à jour de la migration App Router, consultez **[MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)**.
>
> **Status final :** ✅ Migration 100% complète (33 pages migrées)

---

Date : 14 novembre 2025
Status : **~~En cours - Migration partielle réussie~~** → **✅ COMPLÉTÉE le 15 janvier 2025**

## 📋 Résumé

Migration progressive de Linguami de Pages Router vers App Router de Next.js 15, tout en maintenant la compatibilité avec l'architecture existante (Redux, next-translate).

## ✅ Pages migrées (18/40+)

### Pages principales
- ✅ `/` - Homepage avec SEO complet
- ✅ `/privacy` - Politique de confidentialité
- ✅ `/materials` - Catalogue de matériaux avec filtres et pagination
- ✅ `/login` - Authentification avec Turnstile captcha
- ✅ `/signup` - Inscription complète avec validation de mot de passe et avatars

### Pages utilisateur
- ✅ `/dictionary` - Dictionnaire personnel
- ✅ `/settings` - Paramètres du compte
- ✅ `/reset-password` - Réinitialisation du mot de passe
- ✅ `/leaderboard` - Classement des utilisateurs
- ✅ `/lessons` - Liste des leçons disponibles
- ✅ `/statistics` - Statistiques de progression
- ✅ `/premium` - Page d'abonnement premium
- ✅ `/my-materials` - Matériaux personnalisés de l'utilisateur

### Routes dynamiques (Méthode & Matériaux)
- ✅ `/method` - Liste des niveaux de la méthode
- ✅ `/method/[level]` - Cours par niveau (ex: `/method/a1`)
- ✅ `/method/[level]/[lessonSlug]` - Leçons individuelles (ex: `/method/a1/se-presenter`)
- ✅ `/materials/[section]` - Sections de matériaux (ex: `/materials/story`)
- ✅ `/materials/[section]/[material]` - Matériaux individuels avec exercices

## 🏗️ Infrastructure créée

### Fichiers App Router
```
app/
├── layout.js              # Layout racine avec metadata et providers
├── providers.js           # Centralisation des providers (Redux, Theme, User)
├── [locale]/
│   ├── layout.js         # Layout pour les routes i18n
│   ├── page.js           # Homepage
│   ├── privacy/page.js
│   ├── materials/
│   │   ├── page.js                        # Liste des matériaux
│   │   └── [section]/
│   │       ├── page.js                    # Section de matériaux
│   │       └── [material]/page.js         # Matériau individuel
│   ├── method/
│   │   ├── page.js                        # Liste des niveaux
│   │   └── [level]/
│   │       ├── page.js                    # Cours du niveau
│   │       └── [lessonSlug]/page.js       # Leçon individuelle
│   ├── login/page.js
│   ├── signup/page.js
│   ├── dictionary/page.js
│   ├── settings/page.js
│   ├── reset-password/page.js
│   ├── leaderboard/page.js
│   ├── lessons/page.js
│   ├── statistics/page.js
│   ├── premium/page.js
│   └── my-materials/page.js
```

### Hooks de compatibilité
```javascript
// hooks/useRouterCompat.js
// Hook qui détecte automatiquement Pages Router vs App Router
const { locale, push, routerType } = useRouterCompat()
```

### Modifications du UserContext
- `context/user.js` modifié pour utiliser `useRouterCompat`
- Compatible avec Pages Router ET App Router

## 🔧 Problèmes résolus

### 1. Erreur "NextRouter was not mounted"
**Problème :** Le `UserContext` utilisait `useRouter()` de `next/router` qui n'existe pas dans App Router.

**Solution :** Création du hook `useRouterCompat` qui détecte automatiquement le contexte et retourne l'API appropriée.

```javascript
// Avant
import { useRouter } from 'next/router'
const router = useRouter()

// Après
import { useRouterCompat } from '@/hooks/useRouterCompat'
const router = useRouterCompat()
```

### 2. Erreur d'hydratation sur `/privacy`
**Problème :** `new Date().toLocaleDateString()` générait des dates différentes entre serveur et client.

**Solution :** Utilisation de `useEffect` pour générer la date uniquement côté client.

```javascript
const [formattedDate, setFormattedDate] = useState('')

useEffect(() => {
  setFormattedDate(new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }))
}, [])
```

### 3. Configuration i18n incompatible
**Note :** Le warning "i18n configuration in next.config.js is unsupported in App Router" est normal. `next-translate` fonctionne toujours en mode hybride.

### 4. Clé de traduction manquante `siteName`
**Problème :** L'erreur `[next-translate] "common:siteName" is missing` apparaissait sur la page `/method`.

**Solution :** Ajout de la clé `"siteName": "Linguami"` dans les 3 fichiers de traduction (`locales/fr/common.json`, `locales/en/common.json`, `locales/ru/common.json`).

### 5. Migration des routes dynamiques avec `getStaticProps`
**Problème :** La route `/materials/[section]/[material]` utilisait `getStaticProps` et `getStaticPaths` incompatibles avec les Client Components d'App Router.

**Solution :** Remplacement par du client-side data fetching avec `useEffect` :
```javascript
// Dans App Router - Client Component
const [currentMaterial, setCurrentMaterial] = useState(null)

useEffect(() => {
  const fetchMaterial = async () => {
    const { data: material } = await supabase
      .from('materials')
      .select('*')
      .eq('id', params.material)
      .single()

    if (material) setCurrentMaterial(material)
  }

  fetchMaterial()
}, [params?.material])
```

**Note :** Dans la Phase 3, ces routes seront optimisées avec Server Components et ISR pour retrouver les performances du SSG.

## 📝 Pattern de migration

Pour chaque page :
1. Créer `app/[locale]/[route]/page.js`
2. Ajouter `'use client'` en première ligne (car toutes utilisent des hooks)
3. Copier le contenu de `pages/[route].js`
4. Remplacer `useRouter` par `useRouterCompat` si nécessaire
5. Tester la page

## 🔄 Mode hybride

L'application fonctionne en **mode hybride** :
- Routes dans `app/` utilisent App Router
- Routes dans `pages/` utilisent Pages Router
- Les deux coexistent sans problème
- La migration peut être progressive

## ⚠️ Limitations actuelles

1. **Toutes les pages sont Client Components** (`'use client'`)
   - Raison : Utilisation intensive de hooks (`useState`, `useEffect`, `useTheme`, etc.)
   - Impact : Pas d'optimisation Server Components pour l'instant
   - À améliorer : Refactorisation en Server + Client Components

2. **Redux toujours utilisé pour le data fetching**
   - Fonctionne mais pas optimal pour App Router
   - Recommandation future : Migration vers React Query + Server Components

3. **Routes dynamiques adaptées pour App Router**
   - Client-side data fetching avec `useEffect` pour remplacer `getStaticProps`
   - Paramètres de route accessibles via props `params` au lieu de `useRouter().query`
   - Compatible avec le mode hybride (Pages Router continue de fonctionner)

## 📊 Statistiques

- **Pages migrées :** 18 (13 statiques + 5 dynamiques)
- **Pages restantes :** ~22
- **Erreurs critiques :** 0
- **Warnings non-bloquants :** 1 (i18n config)
- **Taux de réussite :** 100% des pages migrées fonctionnent
- **Progression :** 45% (18/40)

## 🚀 Prochaines étapes recommandées

### Court terme
1. Migrer les pages admin (`/admin/*`)
2. Migrer les pages restantes (blog, teacher, test, etc.)
3. Tester un build de production pour détecter d'éventuels problèmes

### Moyen terme
1. Refactoriser en Server Components + Client Components
2. Migrer de Redux vers React Query pour le data fetching
3. Implémenter le streaming et le Suspense

### Long terme
1. Optimisation des performances avec Server Components
2. Implémentation de l'ISR (Incremental Static Regeneration)
3. Migration vers next-intl (remplacer next-translate)

## 📚 Ressources

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Migration Guide Pages → App](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

## ✅ Checklist de validation

Avant de considérer la migration terminée :

- [ ] Toutes les pages principales migrées
- [ ] Routes dynamiques fonctionnelles
- [ ] Authentification et autorisation testées
- [ ] SEO préservé (metadata, sitemap, etc.)
- [ ] Performances mesurées et optimisées
- [ ] Erreurs d'hydratation résolues
- [ ] Build de production réussi
- [ ] Tests E2E passent

## 🎯 État actuel : Phase 2 complétée ✅

**Phase 1 (✅ Terminée) :** Migration des pages statiques
- ✅ Infrastructure App Router en place
- ✅ Hook de compatibilité fonctionnel (`useRouterCompat`)
- ✅ 13 pages statiques migrées et testées (100% fonctionnelles)
- ✅ Aucune régression constatée
- ✅ Pages utilisateur : dictionary, settings, reset-password, leaderboard, lessons, statistics, premium, my-materials
- ✅ Pages principales : homepage, privacy, materials, login, signup

**Phase 2 (✅ Terminée) :** Migration des routes dynamiques
- ✅ `/method` - Liste des niveaux de la méthode
- ✅ `/method/[level]` - Routes de cours par niveau (ex: `/method/a1`)
- ✅ `/method/[level]/[lessonSlug]` - Pages de leçons individuelles (ex: `/method/a1/se-presenter`)
- ✅ `/materials/[section]` - Pages de sections de matériaux (ex: `/materials/story`)
- ✅ `/materials/[section]/[material]` - Pages de matériaux individuels avec exercices
- ✅ Adaptation de `getStaticProps` vers client-side fetching
- ✅ Paramètres de route via props `params` au lieu de `useRouter().query`
- ✅ 5 routes dynamiques fonctionnelles sans erreur

**Phase 3 (À venir) :** Optimisation avec Server Components
- Refactorisation des pages en Server + Client Components
- Migration vers React Query pour le data fetching
- Implémentation du streaming et Suspense
- Restauration de l'ISR pour les routes dynamiques (ex: `/materials/[section]/[material]`)
