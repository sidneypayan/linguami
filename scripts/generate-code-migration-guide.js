/**
 * Script qui génère un guide de migration du code
 *
 * Analyse le code pour trouver les usages des URLs media
 * et génère un guide pour les mettre à jour
 *
 * Usage : node scripts/generate-code-migration-guide.js
 */

const fs = require('fs')
const path = require('path')

console.log('📝 Generating code migration guide...\n')

const guide = `
# Guide de Migration du Code pour la Nouvelle Architecture R2

## 📋 Résumé des Changements

### Ancienne Structure
\`\`\`
audio/{id}_{lang}.m4a
image/{filename}.webp
video/{filename}.mp4
h5p/{filename}.h5p
\`\`\`

### Nouvelle Structure
\`\`\`
audio/
  {lang}/
    {section}/
      {descriptive-name}.m4a
image/
  materials/
    {filename}.webp
  blog/
    {filename}.webp
  ui/
    {filename}.webp
h5p/
  {filename}.h5p
\`\`\`

## 🔧 Modifications Requises dans le Code

### 1. URLs Audio

**Avant :**
\`\`\`javascript
const audioUrl = \`\${process.env.NEXT_PUBLIC_SUPABASE_AUDIO}\${material.audio}\`
\`\`\`

**Après :**
\`\`\`javascript
const audioUrl = \`\${process.env.NEXT_PUBLIC_SUPABASE_AUDIO}\${material.lang}/\${material.section}/\${material.audio}\`
\`\`\`

**Fichiers à modifier :**
- components/material/AudioPlayer.jsx (ou similaire)
- components/Player.jsx
- Tout composant qui utilise material.audio

### 2. URLs Image - Matériaux

**Avant :**
\`\`\`javascript
const imageUrl = \`\${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}\${material.image}\`
\`\`\`

**Après :**
\`\`\`javascript
const imageUrl = \`\${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}materials/\${material.image}\`
\`\`\`

**Fichiers à modifier :**
- components/material/MaterialCard.jsx
- pages/materials/[section]/index.js
- Composants qui affichent des images de matériaux

### 3. URLs Image - Blog

**Avant :**
\`\`\`javascript
const imageUrl = \`\${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}\${post.img}\`
\`\`\`

**Après :**
\`\`\`javascript
const imageUrl = \`\${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}blog/\${post.img}\`
\`\`\`

**Fichiers à modifier :**
- components/blog/PostCard.jsx
- pages/blog/[slug].js
- Composants qui affichent des images de blog

### 4. URLs Image - UI (logos, icônes, etc.)

**Avant :**
\`\`\`javascript
const imageUrl = \`\${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}hero.webp\`
const logoUrl = \`\${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}google.webp\`
\`\`\`

**Après :**
\`\`\`javascript
const imageUrl = \`\${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}ui/hero.webp\`
const logoUrl = \`\${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}ui/google.webp\`
\`\`\`

**Fichiers à modifier :**
- components/homepage/Hero.jsx
- components/auth/OAuthButtons.jsx
- Composants qui utilisent des logos/icônes

### 5. URLs H5P (pas de changement)

Les URLs H5P restent identiques :
\`\`\`javascript
const h5pUrl = \`\${process.env.NEXT_PUBLIC_SUPABASE_H5P}\${activity.h5p_file}\`
\`\`\`

## 🔍 Commandes de Recherche Utiles

Trouvez tous les usages dans votre code :

\`\`\`bash
# Rechercher les usages d'audio
grep -r "NEXT_PUBLIC_SUPABASE_AUDIO" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx"

# Rechercher les usages d'image
grep -r "NEXT_PUBLIC_SUPABASE_IMAGE" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx"

# Rechercher material.audio
grep -r "material.audio" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx"

# Rechercher material.image
grep -r "material.image" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx"
\`\`\`

## 📝 Fonction Utilitaire Recommandée

Créez une fonction helper pour construire les URLs :

\`\`\`javascript
// utils/mediaUrls.js

export function getAudioUrl(material) {
  if (!material?.audio) return null
  if (!material?.lang) {
    console.warn('getAudioUrl: material.lang is missing, audio may not load correctly')
    return null
  }
  return \`\${process.env.NEXT_PUBLIC_SUPABASE_AUDIO}\${material.lang}/\${material.audio}\`
}

export function getMaterialImageUrl(material) {
  if (!material.image) return null
  return \`\${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}materials/\${material.image}\`
}

export function getBlogImageUrl(post) {
  if (!post.img) return null
  return \`\${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}blog/\${post.img}\`
}

export function getUIImageUrl(filename) {
  return \`\${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}ui/\${filename}\`
}

export function getH5pUrl(activity) {
  if (!activity.h5p_file) return null
  return \`\${process.env.NEXT_PUBLIC_SUPABASE_H5P}\${activity.h5p_file}\`
}
\`\`\`

**Usage :**
\`\`\`javascript
import { getAudioUrl, getMaterialImageUrl } from '@/utils/mediaUrls'
import { useUserContext } from '@/context/user'

// Dans votre composant
const { userLearningLanguage } = useUserContext()
const audioUrl = getAudioUrl({ ...material, lang: userLearningLanguage })
const imageUrl = getMaterialImageUrl(material)
\`\`\`

## ✅ Checklist de Migration

- [x] Mettre à jour les URLs audio avec audio/{lang}/{filename}
- [x] Mettre à jour les URLs d'images de matériaux (+ /materials/)
- [x] Mettre à jour les URLs d'images de blog (+ /blog/)
- [x] Mettre à jour les URLs d'images UI (+ /ui/)
- [x] Créer et utiliser les fonctions helper
- [ ] Tester en local
- [ ] Tester en production
- [x] Nettoyer les anciens fichiers (script cleanup)

## 🚀 Ordre d'Exécution des Scripts

1. \`node scripts/reorganize-r2-bucket.js\` - Copie les fichiers vers la nouvelle structure
2. **Modifier le code** selon ce guide
3. \`node scripts/update-db-paths.js\` - Met à jour la base de données (si nécessaire)
4. **Tester l'application** complètement
5. \`node scripts/cleanup-old-files.js\` - Supprime les anciens fichiers

## 💡 Notes Importantes

- Les noms de fichiers dans la base de données restent identiques
- Seule la construction des URLs change dans le code
- H5P ne change pas (reste à la racine /h5p/)
- Testez TOUTES les fonctionnalités avant de supprimer les anciens fichiers

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans migration-log.json
2. Vérifiez que les variables d'environnement sont correctes
3. Testez les URLs manuellement dans le navigateur

`

fs.writeFileSync('CODE-MIGRATION-GUIDE.md', guide)

console.log('✅ Migration guide generated!')
console.log('📄 File: CODE-MIGRATION-GUIDE.md\n')
console.log('📖 Read this guide before modifying your code.')
console.log('💡 It contains all the changes you need to make.\n')
