# Optimisations SEO pour Linguami

Ce document récapitule toutes les optimisations SEO effectuées pour améliorer le référencement sur les moteurs de recherche russes (Yandex), français/francophones (Google France) et américains/anglais (Google US).

## ✅ Optimisations Complétées

### 1. Support Multilingue Amélioré
- **Ajout de l'anglais** : Création des fichiers de traduction anglaise (`locales/en/`)
- **Configuration i18n** : Mise à jour de `i18n.json` pour inclure les 3 langues (fr, ru, en)
- **URLs optimisées** : Structure d'URL claire pour chaque langue (/fr, /ru, /en)
- **Traductions mises à jour** : Les descriptions anglaises mentionnent maintenant le français ET le russe

### 2. Fichier `_documents.js` Optimisé
- **Langue dynamique** : Suppression de `lang='fr'` en dur pour permettre la détection automatique
- **Métadonnées globales** : Ajout de balises robots pour Google, Yandex et Bing
- **Codes de vérification** : Préparé les balises de vérification (à remplir avec vos codes)

### 3. Page d'Accueil (`pages/index.js`) Optimisée
- **Balises hreflang** : Indiquent aux moteurs de recherche les versions linguistiques alternatives
- **Schema JSON-LD** : Données structurées pour Google (EducationalOrganization)
- **Open Graph multilingue** : Optimisation pour le partage sur les réseaux sociaux
- **Mots-clés multilingues** : Keywords adaptés à chaque langue
- **DNS prefetch** : Amélioration des performances de chargement

### 4. Toutes les Pages Publiques Optimisées avec Composant SEO
**Total : 10 pages** (8 pages principales + 2 pages spéciales) utilisent maintenant le composant SEO avec métadonnées complètes et JSON-LD :

**Note importante** : Les pages `/materials` et `/materials/[section]` utilisent le contexte utilisateur (`userLearningLanguage`) pour afficher dynamiquement les matériaux appropriés selon la langue que l'utilisateur apprend, assurant ainsi une expérience personnalisée pour les francophones, russophones et anglophones.

#### `/materials` - Matériel pédagogique
- **JSON-LD** : Schema ItemList pour les catégories (textes, vidéos, musique)
- **Mots-clés multilingues** : Couvrant russe ET français pour les anglophones
- **Localisation** : pages/materials/index.js:17-71
- **Logique adaptive** : Utilise `userLearningLanguage` pour afficher les bons matériaux
  - Utilisateurs apprenant le russe → matériaux russes
  - Utilisateurs apprenant le français → matériaux français
  - Anglophones sans préférence → tous les matériaux

#### `/materials/[section]` - Sections de matériaux (music, video, text, etc.)
- **JSON-LD** : Schema CollectionPage pour chaque section
- **SEO dynamique** : Mots-clés adaptés à chaque section
- **Localisation** : pages/materials/[section]/index.js:79-113
- **Support multilingue** : Utilise `userLearningLanguage` pour filtrer les contenus

#### `/blog` - Blog multilingue
- **JSON-LD** : Schema Blog avec les 5 articles les plus récents
- **Optimisation** : BlogPosting pour chaque article avec métadonnées complètes
- **Localisation** : pages/blog/index.js:14-50

#### `/blog/[slug]` - Articles de blog individuels
- **JSON-LD** : Schema BlogPosting avec auteur, publisher, image
- **Open Graph** : Images spécifiques à chaque article
- **Localisation** : pages/blog/[slug].js:12-54

#### `/lessons` - Leçons interactives
- **JSON-LD** : Schema Course avec informations sur le fournisseur
- **Mots-clés** : Couvrant leçons de russe et français
- **Localisation** : pages/lessons/index.js:59-91

#### `/teacher` - Professeurs natifs
- **JSON-LD** : Schema Person avec teachesLanguage
- **Personnalisation** : Informations différentes selon la langue (Natacha/Sidney)
- **Localisation** : pages/teacher/index.js:23-61

#### `/premium` - Offres premium
- **JSON-LD** : Schema Product avec Offer (prix, disponibilité)
- **E-commerce** : Données structurées pour les deux offres (1 mois, 3 mois)
- **Localisation** : pages/premium/index.js:19-74

#### `/dictionary` - Dictionnaire personnel
- **Protection** : noindex=true (page privée)
- **Métadonnées** : Titre et description multilingues pour utilisateurs connectés
- **Localisation** : pages/dictionary/index.js:120-140

#### `/404` - Page d'erreur
- **Protection** : noindex=true (page d'erreur)
- **UX** : Métadonnées pour navigation
- **Localisation** : pages/404.js:11-17

### 5. Sitemap.xml Complet
- **33 URLs** : Toutes les pages publiques principales en 3 langues
- **Pages premium ajoutées** : 3 nouvelles URLs (fr, ru, en)
- **Dictionary retiré** : Page privée ne doit pas être indexée
- **Balises hreflang** : Chaque URL indique ses alternatives linguistiques
- **Priorités optimisées** : Pages importantes (home, materials) ont une priorité plus élevée
- **Dates mises à jour** : lastmod défini à la date actuelle (2025-10-30)

### 6. Robots.txt Optimisé
- **Support Yandex** : Configuration spécifique pour le moteur de recherche russe
- **Host directive** : Important pour Yandex (indication du domaine principal)
- **Crawl-delay** : Configuré à 0 pour permettre un crawl rapide
- **Blocage des bots malveillants** : AhrefsBot, SemrushBot, MJ12bot bloqués
- **Pages exclues** : Pages privées et d'authentification non indexées

### 7. Composant SEO Réutilisable (`components/SEO.jsx`)
- **Facile à utiliser** : Simplifie l'ajout de balises SEO sur toutes les pages
- **Multilingue** : Gère automatiquement les 3 langues
- **Flexible** : Supporte les données structurées JSON-LD personnalisées
- **Complet** : Inclut Open Graph, Twitter Cards, hreflang, canonical
- **Utilisé partout** : Intégré sur 10 pages (8 principales + 2 spéciales)

### 8. Correction Bug Affichage Matériaux pour Anglophones
- **Problème identifié** : Les matériaux ne s'affichaient pas pour les utilisateurs anglophones
- **Solution** : Implémentation de la logique `userLearningLanguage`
- **Comportement** :
  - Francophones → voient matériaux russes
  - Russophones → voient matériaux français
  - Anglophones → voient matériaux selon leur langue d'apprentissage (ou tous si non défini)
- **Fichiers modifiés** :
  - pages/materials/index.js:17-34
  - pages/materials/[section]/index.js:79-113

### 9. Traduction Dynamique des Titres de Cartes Matériaux
- **Problème identifié** : Les titres des cartes matériaux s'affichaient dans la langue qu'on apprend au lieu de la langue de l'interface
- **Solution** : Utilisation du système de traduction dans MaterialsCard
- **Comportement** :
  - Les titres s'affichent maintenant dans la langue de l'interface du navigateur
  - Exemple : utilisateur anglophone apprenant français → voit titres en anglais
- **Fichiers modifiés** :
  - components/materials/MaterialsCard.jsx:3,7,58 - Import et utilisation de `useTranslation`
  - locales/en/materials.json - Ajout de toutes les clés de sections
  - locales/fr/materials.json - Ajout de toutes les clés de sections
  - locales/ru/materials.json - Ajout de toutes les clés de sections
- **Clés ajoutées** : dialogues, legends, slices-of-life, beautiful-places, podcasts, books, short-stories, movie-trailers, movie-clips, cartoons, various-materials, folk
- **Amélioration** : Majuscules au début de chaque mot pour les sections en anglais (ex: "Slice Of Life", "Beautiful Places")

### 10. Traduction du Formulaire de Connexion en Anglais
- **Problème identifié** : Le fichier `locales/en/register.json` n'existait pas
- **Solution** : Création du fichier complet de traductions pour le formulaire de connexion
- **Contenu traduit** :
  - Titres : "Sign In" / "Sign Up"
  - Sous-titres : "Welcome back! Sign in to continue" / "Create your account to get started"
  - Tous les labels et messages (email, password, forgot password, etc.)
- **Fichier créé** : locales/en/register.json (29 clés de traduction)

### 11. Amélioration Complète de Google Tag Manager & Analytics 🚀

#### Problèmes corrigés :
1. ❌ **GTM mal placé** : Était dans `_app.js` au lieu de `_document.js`
2. ❌ **Pas de tracking des pages** : Next.js nécessite un tracking manuel
3. ❌ **Pas de suivi multilingue** : La langue n'était pas trackée
4. ❌ **Pas d'utilitaire d'événements** : Code dupliqué partout

#### Solutions implémentées :

**A. GTM déplacé dans _document.js** (pages/_documents.js:40-53, 56-66)
- ✅ Script dans le `<Head>` pour chargement optimal
- ✅ Noscript dans le `<body>` pour utilisateurs sans JS
- ✅ Variable d'environnement sécurisée (`NEXT_PUBLIC_GTM_ID`)
- ✅ Vérification conditionnelle (ne charge que si GTM_ID existe)

**B. Utilitaire GTM créé** (lib/gtm.js)
- ✅ Fonction `pageview()` pour tracking des pages
- ✅ Fonction `event()` générique pour événements personnalisés
- ✅ **11 fonctions prédéfinies** pour interactions courantes :
  - `trackSignup()` - Inscription utilisateur
  - `trackLogin()` - Connexion utilisateur
  - `trackLanguageSelection()` - Choix langue d'apprentissage
  - `trackMaterialView()` - Consultation matériel
  - `trackLessonComplete()` - Complétion leçon
  - `trackWordAdded()` - Ajout mot au dictionnaire
  - `trackFlashcardSession()` - Utilisation flashcards
  - `trackPremiumPurchase()` - Achat premium
  - `trackTeacherContact()` - Contact professeur

**C. Tracking automatique des pages** (pages/_app.js:11-13, 98-116)
- ✅ `useRouter` + `useEffect` pour écouter les changements de route
- ✅ Pageview envoyé à chaque navigation
- ✅ **Suivi multilingue automatique** : `router.locale` inclus dans chaque pageview
- ✅ Nettoyage des event listeners (performance)

**D. DataLayer enrichi** :
Chaque événement inclut maintenant :
- ✅ `language` - Langue de l'interface (fr/ru/en)
- ✅ `page` - URL de la page
- ✅ `pageTitle` - Titre de la page
- ✅ Catégories personnalisées (User, Content, Education, Learning, Ecommerce, Lead)

#### Configuration Google Tag Manager (à faire) :

**1. Dans GTM, créer ces variables :**
- `language` - Variable de couche de données
- `materialSection` - Variable de couche de données
- `lessonId` - Variable de couche de données

**2. Dans GTM, créer ces déclencheurs :**
- `pageview` - Vue de page
- `signup` - Inscription
- `login` - Connexion
- `material_view` - Vue matériel
- `lesson_complete` - Leçon terminée
- `word_added` - Mot ajouté
- `flashcard_session` - Session flashcards
- `purchase` - Achat premium
- `teacher_contact` - Contact prof

**3. Dans GTM, créer une balise Google Analytics 4 :**
- Type : Google Analytics : Événement GA4
- ID de mesure : Votre `G-XXXXXXXXXX`
- Déclencheur : Tous les événements ci-dessus

#### Exemple d'utilisation dans ton code :

```javascript
import * as gtm from '../lib/gtm'

// Dans un composant après inscription
gtm.trackSignup('google', router.locale)

// Après ajout d'un mot au dictionnaire
gtm.trackWordAdded('привет', 'bonjour', router.locale)

// Après complétion d'une leçon
gtm.trackLessonComplete('lesson-1', 'Les bases', router.locale)
```

#### Avantages de cette implémentation :

1. ✅ **SEO-friendly** : GTM chargé au bon moment
2. ✅ **Performance** : Pas de duplication de code
3. ✅ **Multilingue** : Tracking par langue (fr/ru/en)
4. ✅ **Réutilisable** : Fonctions standardisées
5. ✅ **Maintenable** : Un seul fichier à modifier (lib/gtm.js)
6. ✅ **Type-safe** : JSDoc pour autocomplétion
7. ✅ **Next.js optimisé** : Gère les changements de route SPA

## 📋 Prochaines Étapes Recommandées

### Actions Immédiates

1. **Configurer Google Tag Manager** (URGENT)
   - Aller sur https://tagmanager.google.com
   - Créer les variables de couche de données (language, materialSection, lessonId)
   - Créer les déclencheurs personnalisés (voir section 11)
   - Créer une balise Google Analytics 4
   - Tester avec l'aperçu GTM

2. **Intégrer les événements GTM dans ton code**
   ```javascript
   // Exemples d'intégration recommandée :

   // Dans pages/signup.js après inscription réussie :
   import * as gtm from '../lib/gtm'
   gtm.trackSignup(method, router.locale)

   // Dans le contexte user après login :
   gtm.trackLogin(method, router.locale)

   // Dans components/words après ajout au dictionnaire :
   gtm.trackWordAdded(word_ru, word_fr, router.locale)

   // Dans pages/lessons après complétion :
   gtm.trackLessonComplete(lessonId, lessonTitle, router.locale)

   // Dans pages/premium après achat :
   gtm.trackPremiumPurchase(plan, price, router.locale)
   ```

3. **Vérifier les traductions**
   - Réviser les traductions anglaises dans `locales/en/`
   - Créer les fichiers de traduction manquants pour les autres pages (common.json, materials.json, etc.)

2. **Codes de vérification**
   Ajouter vos codes dans `pages/_documents.js` :
   ```jsx
   <meta name='google-site-verification' content='VOTRE_CODE' />
   <meta name='yandex-verification' content='VOTRE_CODE' />
   <meta name='msvalidate.01' content='VOTRE_CODE' />
   ```

3. **Utiliser le composant SEO sur les autres pages**
   Exemple pour `/blog` :
   ```jsx
   import SEO from '../components/SEO'
   import useTranslation from 'next-translate/useTranslation'

   export default function Blog() {
     const { t } = useTranslation('blog')

     return (
       <>
         <SEO
           title={`${t('pagetitle')} | Linguami`}
           description={t('description')}
           path='/blog'
           keywords='blog russe, culture russe, apprendre russe'
         />
         {/* Contenu de la page */}
       </>
     )
   }
   ```

4. **Soumettre les sitemaps**
   - Google Search Console : https://search.google.com/search-console
   - Yandex Webmaster : https://webmaster.yandex.com
   - Bing Webmaster Tools : https://www.bing.com/webmasters

### Optimisations Supplémentaires

5. **Images**
   - Ajouter des attributs `alt` multilingues à toutes les images
   - Optimiser les images (compression, formats modernes comme WebP)
   - Ajouter un sitemap d'images si beaucoup de contenu visuel

6. **Performance (Core Web Vitals)**
   - Optimiser le temps de chargement (Largest Contentful Paint)
   - Réduire le temps de blocage (First Input Delay)
   - Minimiser les décalages visuels (Cumulative Layout Shift)

7. **Contenu**
   - Créer du contenu unique pour chaque langue (pas seulement des traductions)
   - Ajouter des articles de blog réguliers
   - Créer des pages de destination pour des mots-clés spécifiques

8. **Backlinks**
   - Obtenir des liens depuis des sites russes, français et anglais
   - Participer à des forums et communautés linguistiques
   - Créer des partenariats avec des écoles de langues

9. **Schema JSON-LD Avancé**
   - Ajouter BreadcrumbList pour la navigation
   - Ajouter Course schema pour les leçons
   - Ajouter VideoObject pour les vidéos
   - Ajouter Review schema pour les avis

10. **Analytics et Suivi**
    - Configurer Google Analytics 4 avec suivi multilingue
    - Configurer Yandex Metrica pour le public russe
    - Suivre les conversions et objectifs par langue

## 🔍 Vérifications Post-Déploiement

Après avoir déployé ces changements :

1. **Tester les URLs**
   - https://www.linguami.com/
   - https://www.linguami.com/ru
   - https://www.linguami.com/en

2. **Vérifier le sitemap**
   - https://www.linguami.com/sitemap.xml

3. **Vérifier robots.txt**
   - https://www.linguami.com/robots.txt

4. **Tester avec les outils**
   - Google Rich Results Test : https://search.google.com/test/rich-results
   - Schema.org Validator : https://validator.schema.org/
   - Yandex Structured Data Validator

5. **Vérifier hreflang**
   - Utiliser l'outil hreflang de Ahrefs ou Merkle

## 📊 Métriques à Suivre

- **Positions dans les SERPs** : Suivre le classement pour vos mots-clés principaux
- **Trafic organique** : Par langue et par pays
- **Taux de clics (CTR)** : Dans les résultats de recherche
- **Temps de chargement** : Core Web Vitals
- **Taux de rebond** : Par langue et par page
- **Conversions** : Inscriptions, contacts, ventes

## 🌐 Mots-clés Cibles par Langue

### Français
- apprendre russe
- cours russe en ligne
- langue russe débutant
- vocabulaire russe
- grammaire russe

### Russe
- изучение французского языка
- курсы французского онлайн
- французский для начинающих
- французская грамматика

### Anglais (mentionnant français ET russe)
- learn russian online, learn french online
- russian language course, french language course
- learn russian for beginners, learn french for beginners
- russian vocabulary, french vocabulary
- russian grammar lessons, french grammar lessons
- language learning materials
- interactive language courses

## 💡 Conseils Supplémentaires

1. **Contenu local** : Créez du contenu spécifique à chaque marché (actualités russes pour les russophones, etc.)
2. **Réseaux sociaux** : Soyez actif sur VK (russe), Facebook (français), Twitter/Reddit (anglais)
3. **Vitesse** : Le site doit charger rapidement partout (utilisez un CDN)
4. **Mobile** : Assurez-vous que le site est parfaitement responsive
5. **Sécurité** : HTTPS est obligatoire (déjà en place)

## 📞 Support

Si vous avez des questions sur ces optimisations, n'hésitez pas à demander de l'aide !
