# 🎨 Guide d'optimisation des images

Ce guide explique comment utiliser les scripts d'optimisation d'images pour Linguami.

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Structure générée](#structure-générée)
- [Utilisation](#utilisation)
- [Configuration](#configuration)
- [FAQ](#faq)

---

## 🔧 Prérequis

- Node.js 16+
- Accès à votre compte Supabase
- Variables d'environnement configurées dans `.env.local`

## 📦 Installation

### 1. Installer le package `sharp`

```bash
npm install sharp
```

### 2. Ajouter le script au package.json

Ajoutez ces lignes dans la section `scripts` de votre `package.json` :

```json
"scripts": {
  "optimize-images": "node scripts/optimize-images.js",
  "optimize-image": "node scripts/optimize-single-image.js"
}
```

### 3. Vérifier les variables d'environnement

Assurez-vous que votre `.env.local` contient :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
```

---

## 📁 Structure générée

Le script génère automatiquement plusieurs versions de chaque image :

```
linguami (bucket Supabase)
└── image/
    ├── original-image.jpg          (Image originale - inchangée)
    ├── thumbnails/
    │   └── original-image.webp     (200x200, WebP 85%)
    ├── small/
    │   └── original-image.webp     (400x400, WebP 85%)
    ├── medium/
    │   └── original-image.webp     (800x800, WebP 85%)
    └── large/
        └── original-image.webp     (1200x1200, WebP 85%)
```

### 📊 Tailles générées

| Taille | Dimensions | Usage recommandé |
|--------|-----------|------------------|
| **thumbnail** | 200x200 | Cartes de section, miniatures |
| **small** | 400x400 | Cartes de matériel, aperçus |
| **medium** | 800x800 | Images de détail, blog |
| **large** | 1200x1200 | Images pleine page, hero |

---

## 🚀 Utilisation

### Option 1 : Optimiser TOUTES les images

```bash
npm run optimize-images
```

**⚠️ ATTENTION :** Ce processus :
- Peut prendre plusieurs minutes selon le nombre d'images
- Va télécharger, traiter et réuploader toutes les images
- Consommera de la bande passante

**Exemple de sortie :**
```
🎨 Script d'optimisation d'images Supabase
============================================================
📋 Récupération de la liste des images...
✅ 127 images trouvées

🚀 Début du traitement de 127 images...

[1/127] Traitement de dialogues.jpg
  📥 Téléchargé: 1024.50 KB
  🔄 Optimisation de dialogues.jpg...
    ✅ thumbnail: 15.20 KB
    ✅ small: 32.10 KB
    ✅ medium: 85.40 KB
    ✅ large: 145.60 KB
  📤 Uploadé: image/thumbnails/dialogues.webp
  📤 Uploadé: image/small/dialogues.webp
  📤 Uploadé: image/medium/dialogues.webp
  📤 Uploadé: image/large/dialogues.webp

...

============================================================
📊 RÉSUMÉ
============================================================
✅ Images traitées: 127
❌ Erreurs: 0
📦 Taille originale totale: 130.25 MB
📦 Taille optimisée totale: 12.45 MB
💾 Économie d'espace: 90.4%
============================================================
```

### Option 2 : Optimiser UNE SEULE image

```bash
npm run optimize-image dialogues.jpg
```

ou

```bash
node scripts/optimize-single-image.js dialogues.jpg
```

**Exemple de sortie :**
```
🎨 Optimisation de dialogues.jpg...
📥 Téléchargement...
  ✅ Téléchargé: 1024.50 KB

🔄 Génération thumbnail...
  ✅ Créé: 15.20 KB
  📤 Uploadé vers: image/thumbnails/dialogues.webp

🔄 Génération small...
  ✅ Créé: 32.10 KB
  📤 Uploadé vers: image/small/dialogues.webp

🔄 Génération medium...
  ✅ Créé: 85.40 KB
  📤 Uploadé vers: image/medium/dialogues.webp

🔄 Génération large...
  ✅ Créé: 145.60 KB
  📤 Uploadé vers: image/large/dialogues.webp

✨ Optimisation terminée avec succès!
```

---

## ⚙️ Configuration

Pour modifier les tailles ou la qualité, éditez la section `CONFIG` dans les scripts :

```javascript
const CONFIG = {
  sizes: {
    thumbnail: { width: 200, height: 200, folder: 'thumbnails' },
    small: { width: 400, height: 400, folder: 'small' },
    medium: { width: 800, height: 800, folder: 'medium' },
    large: { width: 1200, height: 1200, folder: 'large' },
  },
  webpQuality: 85, // 0-100 (85 = bon équilibre qualité/taille)
  bucketName: 'linguami',
  imagePrefix: 'image/',
}
```

### Ajuster la qualité WebP

- **75-80** : Qualité standard, petite taille (recommandé pour thumbnails)
- **85-90** : Haute qualité, taille modérée (recommandé par défaut)
- **90-95** : Très haute qualité, taille plus grande (pour images importantes)

---

## 🔄 Mise à jour du code pour utiliser les images optimisées

### Exemple 1 : Utiliser différentes tailles selon le contexte

```javascript
import Image from 'next/image'

// Pour une carte de section (petite)
<Image
  src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}small/${material.img}`}
  alt={material.title}
  width={400}
  height={400}
/>

// Pour une page de détail (grande)
<Image
  src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}large/${material.img}`}
  alt={material.title}
  width={1200}
  height={1200}
/>
```

### Exemple 2 : Fonction utilitaire

```javascript
// utils/imageUtils.js
export const getOptimizedImageUrl = (imageName, size = 'medium') => {
  const folders = {
    thumbnail: 'thumbnails',
    small: 'small',
    medium: 'medium',
    large: 'large',
  }

  const folder = folders[size] || folders.medium
  const baseName = imageName.replace(/\.[^/.]+$/, '') // Retirer l'extension

  return `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}${folder}/${baseName}.webp`
}

// Utilisation
<Image
  src={getOptimizedImageUrl('dialogues.jpg', 'small')}
  alt="Dialogues"
  width={400}
  height={400}
/>
```

---

## ❓ FAQ

### Q : Que se passe-t-il si une image échoue ?

**R :** Le script continue avec les autres images. Les erreurs sont affichées mais ne stoppent pas le processus. Vous pouvez ensuite réessayer uniquement l'image échouée avec `optimize-single-image.js`.

### Q : Les images originales sont-elles supprimées ?

**R :** Non ! Les images originales restent intactes dans `image/`. Les versions optimisées sont créées dans des sous-dossiers séparés.

### Q : Puis-je annuler le processus ?

**R :** Oui, appuyez sur `Ctrl+C`. Les images déjà traitées resteront uploadées, mais le processus s'arrêtera.

### Q : Combien d'espace vais-je économiser ?

**R :** En moyenne :
- **PNG vers WebP** : 25-35% de réduction
- **JPEG vers WebP** : 15-25% de réduction
- **Redimensionnement** : 80-95% de réduction (selon taille originale)

Pour une image de 1024x1024 (1 MB), vous obtiendrez environ :
- thumbnail (200x200) : ~15-20 KB
- small (400x400) : ~30-40 KB
- medium (800x800) : ~80-100 KB
- large (1200x1200) : ~140-180 KB

### Q : Dois-je réoptimiser toutes les images à chaque fois ?

**R :** Non. Une fois les images optimisées, vous n'avez besoin d'exécuter le script que pour les nouvelles images ajoutées.

### Q : Puis-je exécuter le script en production ?

**R :** Le script utilise la `SERVICE_ROLE_KEY` donc il doit être exécuté depuis votre machine locale ou un environnement sécurisé. **Ne jamais exécuter en production client !**

---

## 🎯 Bonnes pratiques

1. **Testez d'abord avec une seule image** avant d'optimiser toutes les images
2. **Sauvegardez vos images originales** (elles sont déjà dans Supabase, mais ayez une copie locale)
3. **Vérifiez la qualité visuelle** des images optimisées avant de déployer
4. **Mettez à jour votre code** pour utiliser les chemins optimisés
5. **Documentez les chemins** utilisés dans chaque composant

---

## 🆘 Support

En cas de problème :

1. Vérifiez que `sharp` est bien installé : `npm list sharp`
2. Vérifiez vos variables d'environnement
3. Vérifiez les permissions de votre bucket Supabase
4. Consultez les logs d'erreur détaillés

---

## 📝 Notes techniques

- **Format de sortie** : WebP uniquement (meilleur compromis qualité/taille)
- **Mode de redimensionnement** : `cover` (conserve les proportions, rogne si nécessaire)
- **Position de recadrage** : `center` (centré sur le sujet)
- **Compression** : Avec perte (lossy) mais haute qualité (85%)
- **Métadonnées** : Conservées par défaut

---

✨ **Bonne optimisation !**
