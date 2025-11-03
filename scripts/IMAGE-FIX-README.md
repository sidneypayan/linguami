# Guide de correction des extensions d'images

## Problème
Les images ont été converties en format WebP dans le storage Supabase, mais les références dans la base de données et les fichiers markdown pointent encore vers des fichiers `.png`. Cela provoque des liens brisés et des images qui ne s'affichent pas.

## Solution en 3 étapes

### 📋 Étape 1 : Vérifier les images dans Supabase Storage

Avant de commencer, vérifiez que vos images sont bien en format `.webp` dans votre Supabase Storage :

1. Allez sur votre dashboard Supabase
2. Naviguez vers **Storage** > **linguami**
3. Vérifiez les dossiers `image/`, `thumbnails/`, `small/`, `medium/`, `large/`
4. Confirmez que les images sont en format `.webp`

### 🗄️ Étape 2 : Mettre à jour la base de données Supabase

1. Ouvrez votre dashboard Supabase
2. Allez dans **SQL Editor**
3. Ouvrez le fichier `scripts/update-image-extensions.sql`
4. Copiez-collez le contenu dans l'éditeur SQL
5. Cliquez sur **Run** pour exécuter le script

Ce script va mettre à jour toutes les extensions `.png` en `.webp` dans les tables :
- `materials`
- `books`

### 📝 Étape 3 : Mettre à jour les fichiers markdown du blog

Si vous avez des posts de blog avec des images, exécutez le script Node.js :

```bash
node scripts/update-blog-image-extensions.js
```

Ce script va parcourir tous les fichiers `.mdx` dans le dossier `posts/` et remplacer toutes les extensions `.png` par `.webp`.

### ✅ Étape 4 : Vérification

1. Redémarrez votre serveur de développement :
```bash
npm run dev
```

2. Videz le cache de votre navigateur (Ctrl + Shift + Delete)

3. Vérifiez que les images s'affichent correctement dans :
   - Les cartes de matériaux (`/materials`)
   - Les cartes de sections
   - Les posts de blog (`/blog`)

### 🔍 Débogage

Si les images ne s'affichent toujours pas :

1. **Ouvrez la console du navigateur** (F12) et vérifiez les erreurs 404
2. **Copiez l'URL d'une image qui ne charge pas** et vérifiez :
   - L'extension est bien `.webp`
   - Le chemin correspond à votre structure de storage Supabase
3. **Vérifiez les variables d'environnement** dans `.env.local` :
   ```
   NEXT_PUBLIC_SUPABASE_IMAGE=https://[votre-projet].supabase.co/storage/v1/object/public/linguami/image/
   ```

### 📚 Fichiers concernés

Les composants qui affichent des images :
- `components/SectionCard.jsx` (ligne 187)
- `components/materials/MaterialsCard.jsx` (ligne 89)
- `components/blog/BlogCard.jsx` (ligne 83)

Les utilitaires d'images :
- `utils/imageUtils.js` - fonctions `getOptimizedImageUrl()` et `getImageUrl()`

## Note importante

Si vous ajoutez de nouvelles images à l'avenir, assurez-vous de :
1. Les uploader en format `.webp` dans Supabase Storage
2. Enregistrer le nom avec l'extension `.webp` dans la base de données
