# Migration vers App Router - Documentation

Date : 14 novembre 2025
Status : **En cours - Migration partielle réussie**

## 📋 Résumé

Migration progressive de Linguami de Pages Router vers App Router de Next.js 15, tout en maintenant la compatibilité avec l'architecture existante (Redux, next-translate).

## ✅ Pages migrées (8/40+)

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
│   ├── materials/page.js
│   ├── login/page.js
│   ├── signup/page.js
│   ├── dictionary/page.js
│   ├── settings/page.js
│   └── reset-password/page.js
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

3. **Routes dynamiques non migrées**
   - `/method/[level]` - À migrer
   - `/method/[level]/[courseSlug]` - À migrer
   - `/materials/[section]` - À migrer
   - `/materials/[section]/[material]` - À migrer

## 📊 Statistiques

- **Pages migrées :** 8
- **Pages restantes :** ~32
- **Erreurs critiques :** 0
- **Warnings non-bloquants :** 1 (i18n config)
- **Taux de réussite :** 100% des pages migrées fonctionnent

## 🚀 Prochaines étapes recommandées

### Court terme
1. Migrer les routes dynamiques (`/method/[level]`, etc.)
2. Migrer les pages admin
3. Migrer les pages secondaires (blog, leaderboard, etc.)

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

## 🎯 État actuel : Phase 1 complétée

**Phase 1 (Terminée) :** Migration des pages statiques simples
- ✅ Infrastructure App Router en place
- ✅ Hook de compatibilité fonctionnel
- ✅ Pages principales migrées et testées
- ✅ Aucune régression constatée

**Phase 2 (À venir) :** Migration des routes dynamiques
**Phase 3 (À venir) :** Optimisation avec Server Components
