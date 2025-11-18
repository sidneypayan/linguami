# Structure Cloudflare R2 (Stockage de fichiers)

## ⚠️ RÈGLE IMPORTANTE

Les dossiers dans R2 sont **AU PLURIEL** :
- ✅ `audios/` (PAS `audio/`)
- ✅ `images/` (PAS `image/`)

**Historique** : Les dossiers ont été renommés de `audio/` → `audios/` et `image/` → `images/` pour uniformiser la structure.

## Structure complète

```
R2 Bucket (linguami)
├── audios/                          ← Audio files (PLURIEL!)
│   ├── fr/                          ← Audios en français
│   │   ├── materials/               ← Audios des materials
│   │   ├── courses/                 ← Audios des cours
│   │   └── exercises/               ← Audios des exercices
│   │       └── material_XXX/        ← Par material
│   │           └── sentence_N.m4a   ← Phrases audio
│   ├── ru/                          ← Audios en russe
│   │   ├── materials/
│   │   ├── courses/
│   │   └── exercises/
│   │       └── material_XXX/
│   │           └── sentence_N.m4a
│   └── en/                          ← Audios en anglais
│       ├── materials/
│       ├── courses/
│       └── exercises/
│
├── images/                          ← Images (PLURIEL!)
│   ├── materials/                   ← Images des materials
│   │   ├── xxx.webp                 ← Image principale
│   │   └── thumbnails/              ← Miniatures
│   │       └── xxx.webp
│   ├── ui/                          ← Images de l'interface
│   └── blog/                        ← Images des articles de blog
│
└── videos/                          ← Vidéos
    └── materials/                   ← Vidéos des materials
```

## Exemples de chemins corrects

### Audios d'exercices
```
audios/fr/exercises/material_481/sentence_1.m4a  ✅
audio/exercises/fr/material_481/sentence_1.m4a   ❌ (ancien format)
```

### Audios de cours
```
audios/fr/courses/lesson-1-grammar.mp3           ✅
audio/courses/fr/lesson-1-grammar.mp3            ❌ (ancien format)
```

### Audios de materials
```
audios/ru/materials/dialogue_airport.m4a         ✅
audio/ru/materials/dialogue_airport.m4a          ❌ (ancien format)
```

### Images de materials
```
images/materials/beautiful-place-481.webp        ✅
image/materials/beautiful-place-481.webp         ❌ (ancien format)

images/materials/thumbnails/beautiful-place-481.webp  ✅
image/materials/thumbnails/beautiful-place-481.webp   ❌ (ancien format)
```

## Fichiers utilisant les chemins R2

### Création/Upload
- `components/admin/EditMaterialModal.jsx` - Upload de materials (images + audios)
- `features/content/contentSlice.js` - Upload de contenu
- `scripts/create-fitb-audio.js` - Création d'exercices audio
- `pages/api/courses/generate-audio.js` - Génération d'audio de cours

### Affichage/Lecture
- `utils/imageUtils.js` - Génération d'URLs pour images
- `components/exercises/AudioDictation.jsx` - Lecture audio exercices

## URL publique

Base URL : `process.env.NEXT_PUBLIC_R2_PUBLIC_URL`

Exemple complet :
```javascript
const audioUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/audios/fr/exercises/material_481/sentence_1.m4a`
// https://linguami-cdn.etreailleurs.workers.dev/audios/fr/exercises/material_481/sentence_1.m4a
```

## Comment vérifier la structure

```bash
# Lister tous les fichiers d'un dossier
node -e "
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: '.env.local' });

const s3Client = new S3Client({
  region: 'auto',
  endpoint: \`https://\${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com\`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

(async () => {
  const response = await s3Client.send(new ListObjectsV2Command({
    Bucket: process.env.R2_BUCKET_NAME,
    Prefix: 'audios/fr/exercises/',
    MaxKeys: 100,
  }));

  console.log('Files found:', response.Contents?.length || 0);
  response.Contents?.forEach(item => console.log('  -', item.Key));
})();
"
```

## Migration ancienne → nouvelle structure

Si vous trouvez des chemins avec l'ancienne structure (`audio/` ou `image/`), les corriger en ajoutant un 's' :
- `audio/` → `audios/`
- `image/` → `images/`

**Note** : Les fichiers dans R2 n'ont PAS été déplacés. Seuls les chemins dans le code ont été mis à jour pour pointer vers la nouvelle structure.
