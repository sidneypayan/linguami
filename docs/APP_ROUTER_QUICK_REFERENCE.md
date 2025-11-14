# App Router - Référence Rapide

Guide de référence rapide pour la migration App Router.

## 🚨 Commandes d'urgence

### Problème : Serveur ne démarre pas
```bash
# 1. Tuer tous les processus Node
tasklist | findstr node
taskkill /F /PID <chaque_PID>

# 2. Nettoyer .next
if exist .next rmdir /s /q .next

# 3. Redémarrer
npm run dev
```

### Problème : Une page App Router ne fonctionne pas
```bash
# Retour temporaire à Pages Router
rm -rf app/[locale]/<nom_page>

# Pages Router reprendra automatiquement
```

### Problème : Tout casser - Rollback complet
```bash
# Sauvegarder App Router
mv app app.backup

# Revenir 100% Pages Router
git restore app/
```

---

## 📁 Structure des fichiers

### Pages Router (ancien)
```
pages/
├── _app.js              → Providers
├── _document.js         → HTML structure
├── privacy.js           → /privacy
└── blog/
    ├── index.js         → /blog
    └── [slug].js        → /blog/mon-article
```

### App Router (nouveau)
```
app/
├── layout.js            → Root layout (HTML, metadata)
├── providers.js         → Tous les providers (Client Component)
├── not-found.js         → 404 global
└── [locale]/
    ├── layout.js        → Layout avec Navbar/Footer
    ├── privacy/
    │   └── page.js      → /fr/privacy
    └── blog/
        ├── page.js      → /fr/blog
        └── [slug]/
            └── page.js  → /fr/blog/mon-article
```

---

## 🎯 Patterns de code

### 1. Page Client (avec MUI, Redux, Hooks)
```javascript
'use client'  // ← OBLIGATOIRE

import { Box, Typography, useTheme } from '@mui/material'
import { useSelector } from 'react-redux'
import useTranslation from 'next-translate/useTranslation'

export default function MyPage() {
	const { t } = useTranslation('common')
	const theme = useTheme()
	const data = useSelector(state => state.mySlice.data)

	return <Box>{/* ... */}</Box>
}
```

### 2. Page Server (sans state, juste affichage)
```javascript
// Pas de 'use client' → Server Component

import { createServerClient } from '@/lib/supabase-server'

export default async function MyPage() {
	const supabase = createServerClient()
	const { data } = await supabase.from('table').select('*')

	return <div>{/* Afficher data */}</div>
}
```

### 3. Métadonnées statiques
```javascript
export const metadata = {
	title: 'Mon titre - Linguami',
	description: 'Ma description',
	openGraph: {
		title: 'Mon titre',
		description: 'Ma description',
		images: ['/og-image.png'],
	},
}

export default function MyPage() {
	// ...
}
```

### 4. Métadonnées dynamiques
```javascript
export async function generateMetadata({ params }) {
	const { slug } = params

	// Fetch data
	const post = await getPost(slug)

	return {
		title: post.title,
		description: post.excerpt,
	}
}

export default async function MyPage({ params }) {
	const post = await getPost(params.slug)
	return <article>{/* ... */}</article>
}
```

### 5. Static Site Generation (SSG)
```javascript
// Générer toutes les routes statiques au build
export async function generateStaticParams() {
	const posts = await getAllPosts()

	return posts.map(post => ({
		slug: post.slug,
	}))
}

export default async function BlogPost({ params }) {
	const post = await getPost(params.slug)
	return <article>{/* ... */}</article>
}
```

### 6. Loading State
```javascript
// Créer app/[locale]/blog/loading.js
export default function Loading() {
	return <div>Chargement...</div>
}

// Automatiquement affiché pendant le chargement de page.js
```

### 7. Error Boundary
```javascript
// Créer app/[locale]/blog/error.js
'use client'  // OBLIGATOIRE

export default function Error({ error, reset }) {
	return (
		<div>
			<h2>Erreur : {error.message}</h2>
			<button onClick={() => reset()}>Réessayer</button>
		</div>
	)
}
```

---

## 🔄 Différences Pages Router vs App Router

### Navigation

**Pages Router :**
```javascript
import { useRouter } from 'next/router'

const router = useRouter()
router.push('/path')
router.query.id          // Query params
router.pathname          // '/blog/[slug]'
router.asPath            // '/blog/mon-article'
router.locale            // 'fr'
```

**App Router :**
```javascript
import { useRouter, usePathname, useSearchParams, useParams } from 'next/navigation'

const router = useRouter()
const pathname = usePathname()          // '/fr/blog/mon-article'
const searchParams = useSearchParams()  // ?id=123
const params = useParams()              // { locale: 'fr', slug: 'mon-article' }

router.push('/path')
router.refresh()  // Recharger les Server Components
```

### Head / Metadata

**Pages Router :**
```javascript
import Head from 'next/head'

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
```

### Data Fetching

**Pages Router :**
```javascript
export async function getServerSideProps() {
	const data = await fetchData()
	return { props: { data } }
}

export default function Page({ data }) {
	return <div>{data}</div>
}
```

**App Router :**
```javascript
// Server Component (par défaut)
export default async function Page() {
	const data = await fetchData()
	return <div>{data}</div>
}
```

### Layouts

**Pages Router :**
```javascript
// pages/_app.js
<Layout>
	<Component {...pageProps} />
</Layout>

// Même layout pour TOUTES les pages
```

**App Router :**
```javascript
// app/layout.js (global)
// app/[locale]/layout.js (pour toutes les pages localisées)
// app/[locale]/blog/layout.js (juste pour /blog)

// Layouts imbriqués !
```

---

## ✅ Checklist de migration d'une page

### Préparation
- [ ] Identifier la page à migrer
- [ ] Vérifier qu'elle n'utilise pas trop de Redux (sinon attendre)
- [ ] Tester qu'elle fonctionne bien dans Pages Router

### Migration
- [ ] Créer `app/[locale]/<nom>/page.js`
- [ ] Copier le code de `pages/<nom>.js`
- [ ] Ajouter `'use client'` si nécessaire (hooks, MUI, Redux)
- [ ] Supprimer `<Head>` (remplacer par commentaire pour l'instant)
- [ ] Tester dans le navigateur

### Vérifications
- [ ] Page s'affiche correctement
- [ ] Thème dark/light fonctionne
- [ ] Traductions fonctionnent (fr, en, ru)
- [ ] Responsive fonctionne (mobile, tablet, desktop)
- [ ] Navigation fonctionne (liens, boutons)

### Finalisation
- [ ] Ajouter métadonnées (`export const metadata` ou `generateMetadata`)
- [ ] Ajouter `loading.js` si nécessaire
- [ ] Ajouter `error.js` si nécessaire
- [ ] Supprimer `pages/<nom>.js` (optionnel)
- [ ] Commit Git

---

## 🎨 Quand utiliser `'use client'` ?

### ✅ Utiliser `'use client'` SI :
- Hooks React : `useState`, `useEffect`, `useContext`, etc.
- Hooks Next.js : `useRouter()`, `usePathname()`, `useSearchParams()`
- Redux : `useSelector`, `useDispatch`
- MUI : `useTheme`, composants MUI qui utilisent des hooks
- next-translate : `useTranslation`
- Event handlers : `onClick`, `onChange`, `onSubmit`, etc.
- Browser APIs : `window`, `document`, `localStorage`, etc.

### ❌ NE PAS utiliser `'use client'` SI :
- Page statique simple
- Fetching direct depuis Supabase (Server Component)
- Pas d'interactivité
- Juste de l'affichage HTML

### 💡 Exemple combiné
```javascript
// app/[locale]/blog/[slug]/page.js

// Server Component (pas de 'use client')
export default async function BlogPost({ params }) {
	const post = await getPost(params.slug)  // Server-side

	return (
		<article>
			<h1>{post.title}</h1>
			<ClientInteractiveComponent post={post} />
		</article>
	)
}

// components/ClientInteractiveComponent.js
'use client'  // Seulement ce composant est client

import { useState } from 'react'

export default function ClientInteractiveComponent({ post }) {
	const [likes, setLikes] = useState(0)

	return (
		<button onClick={() => setLikes(likes + 1)}>
			❤️ {likes} likes
		</button>
	)
}
```

---

## 🐛 Problèmes courants

### Erreur : "useRouter only works in Client Components"
**Solution :** Ajouter `'use client'` en haut du fichier

### Erreur : "Text content does not match server-rendered HTML"
**Solution :** Ajouter `suppressHydrationWarning` sur l'élément concerné

```javascript
<html suppressHydrationWarning>
<body suppressHydrationWarning>
```

### Warning : "i18n configuration in next.config.js is unsupported"
**Solution :** Ignorer pour l'instant (normal avec la cohabitation)

### Erreur : "Cannot read properties of undefined (reading 'locale')"
**Solution :** Utiliser `params.locale` au lieu de `router.locale`

```javascript
// ❌ Pages Router
const { locale } = useRouter()

// ✅ App Router
export default function Page({ params }) {
	const locale = params.locale
}
```

---

## 📦 Migration par ordre de priorité

### 1️⃣ Pages simples (commencer par ça)
- [x] `/privacy` ✅ FAIT
- [ ] `/terms` (conditions)
- [ ] `not-found.js` (404)
- [ ] `/about` (à propos)

### 2️⃣ Blog (excellent pour SEO)
- [ ] `/blog` (liste)
- [ ] `/blog/[slug]` (article)

### 3️⃣ Pages avec fetch simple
- [ ] `/leaderboard`
- [ ] `/lessons`

### 4️⃣ Pages admin (moins de trafic = moins risqué)
- [ ] `/admin`
- [ ] `/admin/users`
- [ ] `/admin/create`

### 5️⃣ Pages complexes (ATTENDRE Redux → React Query)
- [ ] `/materials/[section]/[material]`
- [ ] `/method/[level]/[courseSlug]`

### ❌ Ne JAMAIS migrer
- API routes (`pages/api/*`) → Restent dans Pages Router

---

## 🎓 Resources

**Documentation :**
- [App Router](https://nextjs.org/docs/app)
- [Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [Server vs Client Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)

**Fichiers à consulter :**
- `docs/MIGRATION_APP_ROUTER.md` → Documentation complète
- `app/layout.js` → Root layout de référence
- `app/providers.js` → Providers de référence
- `app/[locale]/privacy/page.js` → Exemple de page migrée

---

**Dernière mise à jour :** 14 novembre 2024
