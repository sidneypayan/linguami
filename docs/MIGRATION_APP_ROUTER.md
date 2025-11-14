# Migration Pages Router → App Router

**Date de début :** 14 novembre 2024
**Status :** En cours - Phase 1 (Setup initial)

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [État actuel](#état-actuel)
3. [Fichiers créés](#fichiers-créés)
4. [Problèmes rencontrés](#problèmes-rencontrés)
5. [Prochaines étapes](#prochaines-étapes)
6. [Comment tester](#comment-tester)
7. [Retour en arrière](#retour-en-arrière)
8. [Ressources](#ressources)

---

## Vue d'ensemble

### Objectif
Migrer progressivement de Pages Router vers App Router pour profiter de :
- Server Components (bundle JS plus léger)
- Meilleure performance SEO
- Streaming et loading states
- Layouts imbriqués
- Métadonnées améliorées

### Stratégie
✅ **Migration progressive** - Les deux architectures cohabitent
- App Router prend la priorité sur les routes existantes
- Pages Router sert de fallback
- En cas de problème : supprimer le fichier dans `app/` → Pages Router reprend

### Ordre de migration recommandé
1. ✅ **Phase 1 : Setup App Router** (2-4 semaines) ← VOUS ÊTES ICI
2. **Phase 2 : MUI → Tailwind** (2-3 mois) - En parallèle
3. **Phase 3 : Redux → React Query** (2-3 mois) - En parallèle
4. **Phase 4 : next-translate → next-intl** (1-2 mois) - EN DERNIER

---

## État actuel

### Architecture actuelle
- **Pages Router** : 100% des pages (~54 fichiers)
- **App Router** : Setup initial créé + 1 page test (/privacy)
- **Next.js** : 15.5.6
- **React** : 19.0.0
- **i18n** : next-translate 2.5.2 (fonctionne avec App Router via `'use client'`)

### Outils actuels (compatibles App Router)
- ✅ Material-UI 5.16.7 (avec `'use client'`)
- ✅ Redux Toolkit 1.8.5 (avec `'use client'`)
- ✅ next-translate 2.5.2 (avec `'use client'`)
- ✅ Supabase SSR 0.7.0

---

## Fichiers créés

### 1. `app/layout.js` (Root Layout)
**Remplace :** `pages/_document.js` et une partie de `pages/_app.js`

**Responsabilités :**
- Configuration HTML de base
- Métadonnées globales (SEO, favicons, verification)
- Fonts (Poppins via next/font)
- Google Tag Manager
- Wrapper `<Providers>` pour les contextes

**Code :**
```javascript
import 'normalize.css'
import '../styles/globals.css'
import { Poppins } from 'next/font/google'
import Script from 'next/script'
import Providers from './providers'

const poppins = Poppins({
	weight: ['300', '400', '500', '600', '700', '800', '900'],
	subsets: ['latin'],
	display: 'swap',
})

export const metadata = {
	metadataBase: new URL('https://linguami.com'),
	robots: { /* ... */ },
	verification: { /* Google, Yandex, Bing */ },
	icons: { /* favicons */ },
	manifest: '/site.webmanifest',
	themeColor: '#667eea',
}

export default function RootLayout({ children }) {
	// GTM + HTML structure
}
```

**⚠️ Important :**
- `suppressHydrationWarning` sur `<html>` et `<body>` pour éviter les warnings de thème
- Pas de `'use client'` → Server Component par défaut

---

### 2. `app/providers.js` (Client Providers)
**Remplace :** La logique de providers de `pages/_app.js`

**Responsabilités :**
- Redux Provider
- UserProvider (auth)
- ThemeModeProvider (dark/light)
- AchievementProvider
- Toaster (sonner)
- GTM tracking sur changement de route

**Code :**
```javascript
'use client'

import { Provider } from 'react-redux'
import { store } from '@/features/store'
import UserProvider from '@/context/user.js'
import { ThemeModeProvider } from '@/context/ThemeContext'
import { AchievementProvider } from '@/components/AchievementProvider'
import { Toaster } from 'sonner'
import { usePathname } from 'next/navigation'
import * as gtm from '@/lib/gtm'

export default function Providers({ children }) {
	// Tous les providers + tracking GTM
}
```

**⚠️ Important :**
- `'use client'` requis (Redux, Context, hooks)
- Utilise `usePathname()` au lieu de `useRouter()` pour le tracking

---

### 3. `app/[locale]/layout.js` (Locale Layout)
**Responsabilités :**
- Wrapper `<Layout>` (Navbar, Footer, etc.)
- Gestion de la locale dynamique

**Code :**
```javascript
'use client'

import Layout from '@/components/Layout'

export default function LocaleLayout({ children, params }) {
	return <Layout>{children}</Layout>
}
```

**⚠️ Important :**
- `'use client'` requis (Layout utilise des hooks)
- `params.locale` sera 'fr', 'ru', ou 'en'

---

### 4. `app/[locale]/privacy/page.js` (Page test)
**Remplace :** `pages/privacy.js`

**Responsabilités :**
- Afficher la politique de confidentialité
- Utiliser next-translate pour les traductions
- Utiliser MUI pour les composants

**Code :**
```javascript
'use client'

import { Container, Box, Typography, useTheme } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'

export default function PrivacyPolicy() {
	const { t } = useTranslation('privacy')
	// Même code que pages/privacy.js
}
```

**⚠️ Important :**
- `'use client'` requis (useTheme, useTranslation)
- Pas de `<Head>` → metadata sera ajoutée plus tard
- Code 100% identique à Pages Router (copier-coller)

---

## Problèmes rencontrés

### Problème 1 : Warning i18n dans next.config.js
**Erreur :**
```
⚠ i18n configuration in next.config.js is unsupported in App Router.
```

**Cause :**
App Router ne supporte pas l'ancienne config i18n de Pages Router.

**Solution :**
Le warning peut être ignoré pour l'instant car :
1. Pages Router utilise toujours cette config
2. App Router utilise `[locale]` comme segment dynamique
3. next-translate gère l'i18n via `'use client'`

**TODO plus tard :**
- Migrer vers next-intl (Phase 4)
- OU garder next-translate en mode "legacy"

---

### Problème 2 : Erreur EPERM sur .next/trace
**Erreur :**
```
Error: EPERM: operation not permitted, open 'D:\linguami\.next\trace'
```

**Cause :**
Un autre processus Next.js tourne déjà et verrouille le fichier `.next/trace`.

**Solution :**
```bash
# 1. Arrêter tous les processus Node
tasklist | findstr node
taskkill /F /PID <PID>

# 2. Supprimer le dossier .next
if exist .next rmdir /s /q .next

# 3. Relancer
npm run dev
```

**Alternative (Windows PowerShell) :**
```powershell
Get-Process node | Stop-Process -Force
Remove-Item -Recurse -Force .next
npm run dev
```

---

### Problème 3 : Port 3000 déjà utilisé
**Solution :**
Next.js choisit automatiquement le port 3001. Ou arrêtez le processus sur le port 3000.

---

## Prochaines étapes

### Étape 1 : Résoudre les problèmes techniques ✅ À FAIRE EN PREMIER

```bash
# 1. Arrêter tous les serveurs Next.js
tasklist | findstr node
# Pour chaque PID trouvé :
taskkill /F /PID <PID>

# 2. Nettoyer .next
if exist .next rmdir /s /q .next

# 3. Tester le serveur
npm run dev

# 4. Ouvrir dans le navigateur
# http://localhost:3000/fr/privacy
# http://localhost:3000/en/privacy
# http://localhost:3000/ru/privacy
```

**Résultat attendu :**
- ✅ Serveur démarre sans erreur
- ✅ Page `/fr/privacy` affiche la politique en français
- ✅ Navbar et Footer sont présents (vient de Layout)
- ✅ Thème dark/light fonctionne
- ✅ Toaster fonctionne

---

### Étape 2 : Ajouter les métadonnées à la page privacy

**Fichier :** `app/[locale]/privacy/page.js`

**Ajouter avant le composant :**
```javascript
export async function generateMetadata({ params }) {
	const locale = params.locale || 'fr'

	// Charger les traductions (nécessite une fonction helper)
	// OU utiliser des métadonnées statiques simples

	return {
		title: 'Politique de confidentialité - Linguami',
		description: 'Politique de confidentialité de Linguami',
		alternates: {
			languages: {
				'fr': '/fr/privacy',
				'en': '/en/privacy',
				'ru': '/ru/privacy',
			},
		},
	}
}
```

---

### Étape 3 : Migrer une 2ème page simple (404)

**Créer :** `app/not-found.js`

```javascript
'use client'

import { Box, Container, Typography, Button } from '@mui/material'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'

export default function NotFound() {
	const { t } = useTranslation('common')

	return (
		<Container>
			<Box sx={{ textAlign: 'center', py: 10 }}>
				<Typography variant="h1">404</Typography>
				<Typography variant="h5">{t('page_not_found')}</Typography>
				<Link href="/">
					<Button variant="contained" sx={{ mt: 3 }}>
						{t('back_home')}
					</Button>
				</Link>
			</Box>
		</Container>
	)
}
```

**Supprimer (optionnel) :** `pages/404.js`

---

### Étape 4 : Migrer le blog (excellent pour SEO)

**Structure :**
```
app/[locale]/blog/
├── page.js           # Liste des articles
└── [slug]/
    └── page.js       # Article individuel
```

**Avantages :**
- Server Components par défaut (pas de `'use client'`)
- SSG natif avec `generateStaticParams`
- Meilleur SEO

**Exemple :**
```javascript
// app/[locale]/blog/[slug]/page.js
import { getAllPosts, getPostBySlug } from '@/lib/blog'

export async function generateStaticParams() {
	const posts = getAllPosts()
	return posts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }) {
	const post = getPostBySlug(params.slug)
	return {
		title: post.title,
		description: post.excerpt,
	}
}

export default async function BlogPost({ params }) {
	const post = getPostBySlug(params.slug)

	return (
		<article>
			<h1>{post.title}</h1>
			<div dangerouslySetInnerHTML={{ __html: post.content }} />
		</article>
	)
}
```

---

### Étape 5 : Migrer pages simples suivantes

**Par ordre de priorité :**
1. ✅ `/privacy` (FAIT)
2. `not-found.js` (404)
3. `/blog` et `/blog/[slug]` (SSG)
4. `/leaderboard` (SSR simple)
5. `/settings` (Client Component)

**Pour chaque page :**
1. Créer `app/[locale]/<nom>/page.js`
2. Copier le code de `pages/<nom>.js`
3. Ajouter `'use client'` en haut
4. Remplacer `<Head>` par `generateMetadata` (optionnel)
5. Tester dans le navigateur
6. Si ça marche, supprimer `pages/<nom>.js`

---

### Étape 6 : Ne PAS migrer encore (complexe)

**Pages à laisser dans Pages Router pour l'instant :**
- `/materials/[section]/[material]` (Redux complexe)
- `/method/[level]/[courseSlug]` (Redux complexe)
- `/admin/*` (Redux + formulaires complexes)
- `/api/*` (API routes restent TOUJOURS dans pages/)

**Raison :** Attendre la migration Redux → React Query d'abord.

---

## Comment tester

### Test 1 : Vérifier la cohabitation Pages/App Router

**Tester App Router :**
```
http://localhost:3000/fr/privacy  → App Router
http://localhost:3000/en/privacy  → App Router
http://localhost:3000/ru/privacy  → App Router
```

**Tester Pages Router (fallback) :**
```
http://localhost:3000/fr/materials  → Pages Router (pas dans app/)
http://localhost:3000/fr/lessons    → Pages Router (pas dans app/)
http://localhost:3000/fr/dictionary → Pages Router (pas dans app/)
```

---

### Test 2 : Vérifier les providers fonctionnent

**À vérifier :**
1. ✅ Navbar s'affiche
2. ✅ Footer s'affiche
3. ✅ Thème dark/light fonctionne (bouton dans Navbar)
4. ✅ Traductions fonctionnent (changer de langue)
5. ✅ Toaster s'affiche (si erreur)
6. ✅ Auth fonctionne (se connecter)

---

### Test 3 : Vérifier le build production

```bash
npm run build
npm run start

# Vérifier les logs
# - Pas d'erreurs
# - Pages statiques générées pour /privacy
```

---

## Retour en arrière

### Si problème avec App Router

**Option 1 : Désactiver une page spécifique**
```bash
# Supprimer juste la page problématique
rm -rf app/[locale]/privacy

# Pages Router reprendra automatiquement
```

**Option 2 : Tout désactiver**
```bash
# Renommer le dossier app/
mv app app.backup

# Tout revient à Pages Router
```

**Option 3 : Rollback Git**
```bash
git status
git restore app/
# OU
git checkout HEAD -- app/
```

---

## Ressources

### Documentation officielle
- [App Router Documentation](https://nextjs.org/docs/app)
- [Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [next-translate with App Router](https://github.com/aralroca/next-translate/issues/851)

### Fichiers de référence
- `pages/_app.js` → Voir comment les providers sont configurés
- `pages/_document.js` → Voir la config HTML
- `pages/privacy.js` → Exemple de page simple à migrer

### Commandes utiles

```bash
# Nettoyer et redémarrer
if exist .next rmdir /s /q .next
npm run dev

# Tuer les processus Node
tasklist | findstr node
taskkill /F /PID <PID>

# Build production
npm run build
npm run start

# Trouver les pages dans app/
find app -name "page.js"

# Trouver les pages dans pages/
find pages -name "*.js" | grep -v api | grep -v _
```

---

## Notes importantes

### 1. API Routes
**IMPORTANT :** Les API routes restent dans `pages/api/` - App Router ne les gère pas encore bien.

### 2. `'use client'` vs Server Components
**Quand utiliser `'use client'` :**
- useState, useEffect, ou autres hooks React
- Redux (useSelector, useDispatch)
- MUI components qui utilisent des hooks (useTheme, etc.)
- next-translate (useTranslation)
- Event handlers (onClick, onChange, etc.)

**Quand NE PAS utiliser `'use client'` :**
- Pages statiques (blog posts)
- Fetching direct depuis la base de données
- Layouts simples sans interaction

### 3. Métadonnées
**Pages Router :**
```javascript
<Head>
  <title>Mon titre</title>
  <meta name="description" content="..." />
</Head>
```

**App Router :**
```javascript
export const metadata = {
  title: 'Mon titre',
  description: '...',
}

// OU dynamique
export async function generateMetadata({ params }) {
  return {
    title: '...',
    description: '...',
  }
}
```

### 4. Navigation
**Pages Router :** `useRouter()` from 'next/router'
**App Router :** `useRouter()` from 'next/navigation'

**DIFFÉRENCES :**
```javascript
// Pages Router
import { useRouter } from 'next/router'
const router = useRouter()
router.push('/path')
router.query.id  // Query params
router.locale    // 'fr', 'en', 'ru'

// App Router
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
const router = useRouter()
const pathname = usePathname()  // '/fr/privacy'
const searchParams = useSearchParams()  // ?id=123
router.push('/path')
// Pas de router.locale (utiliser params)
```

---

## Checklist de migration par page

Pour chaque page que vous migrez, suivez cette checklist :

### ✅ Avant de commencer
- [ ] La page n'utilise pas de state complexe Redux (sinon attendre Phase 3)
- [ ] Vous avez testé la page dans Pages Router
- [ ] Vous avez créé un backup Git

### ✅ Pendant la migration
- [ ] Créer `app/[locale]/<nom>/page.js`
- [ ] Copier le code de `pages/<nom>.js`
- [ ] Ajouter `'use client'` en haut (si hooks/MUI/Redux)
- [ ] Remplacer `<Head>` par un commentaire (métadonnées plus tard)
- [ ] Ajuster les imports si nécessaire
- [ ] Tester dans le navigateur (toutes les locales)

### ✅ Après la migration
- [ ] Vérifier que la page s'affiche correctement
- [ ] Vérifier le thème dark/light
- [ ] Vérifier les traductions (fr, en, ru)
- [ ] Vérifier le responsive (mobile, tablet, desktop)
- [ ] Ajouter les métadonnées avec `generateMetadata`
- [ ] Supprimer `pages/<nom>.js` (optionnel)
- [ ] Commit Git

---

## Questions fréquentes

**Q : Est-ce que je dois migrer toutes les pages d'un coup ?**
R : NON ! Migrez progressivement. Commencez par 2-3 pages simples.

**Q : Que faire si une page ne fonctionne pas dans App Router ?**
R : Supprimez le fichier dans `app/` et laissez-le dans `pages/`. Vous pourrez réessayer plus tard.

**Q : Est-ce que next-translate fonctionne avec App Router ?**
R : OUI, mais nécessite `'use client'`. Pour une solution optimale, migrez vers next-intl plus tard.

**Q : Est-ce que MUI fonctionne avec App Router ?**
R : OUI, mais nécessite `'use client'`. Les Server Components ne peuvent pas utiliser MUI.

**Q : Les API routes doivent être migrées ?**
R : NON ! Laissez-les dans `pages/api/` - elles fonctionnent très bien comme ça.

**Q : Comment gérer les erreurs ?**
R : Créez un fichier `app/error.js` ou `app/[locale]/error.js` pour capturer les erreurs.

---

## Logs de progression

### 14 novembre 2024 - Setup initial
- ✅ Créé `app/layout.js` (root layout)
- ✅ Créé `app/providers.js` (client providers)
- ✅ Créé `app/[locale]/layout.js` (locale layout)
- ✅ Créé `app/[locale]/privacy/page.js` (première page test)
- ⚠️ Warning i18n (ignoré - normal)
- ❌ Erreur EPERM .next/trace (à résoudre)

### TODO : Prochaine session
- [ ] Résoudre erreur EPERM
- [ ] Tester /fr/privacy dans le navigateur
- [ ] Ajouter métadonnées à privacy
- [ ] Migrer 404 (not-found.js)

---

**Maintenu par :** Claude Code
**Dernière mise à jour :** 14 novembre 2024
