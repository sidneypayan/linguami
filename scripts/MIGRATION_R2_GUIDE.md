# Guide de Migration Supabase Storage → Cloudflare R2

Ce guide vous aide à migrer tous vos médias (images, audio) de Supabase Storage vers Cloudflare R2.

## Pourquoi migrer vers R2 ?

- **Coût**: R2 offre un stockage gratuit jusqu'à 10GB et 10M de requêtes/mois
- **Performance**: R2 a un réseau CDN global intégré
- **Pas de frais de sortie**: Contrairement à S3, R2 ne facture pas la bande passante sortante
- **Compatible S3**: Facile à intégrer

## Étape 1: Créer un bucket R2

1. Connectez-vous à [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Allez dans **R2** dans le menu latéral
3. Cliquez sur **Create bucket**
4. Nommez votre bucket: `linguami` (ou autre nom)
5. Sélectionnez la région (recommandé: Eastern North America ou Western Europe)
6. Cliquez sur **Create bucket**

## Étape 2: Obtenir les credentials R2

1. Dans votre bucket R2, allez dans **Settings**
2. Descendez jusqu'à **R2 API Tokens**
3. Cliquez sur **Manage R2 API Tokens**
4. Cliquez sur **Create API Token**
5. Configurez le token:
   - **Token Name**: `linguami-migration`
   - **Permissions**: Object Read & Write
   - **TTL**: Ne pas expirer (ou selon votre préférence)
   - **Bucket**: Sélectionnez votre bucket `linguami`
6. Cliquez sur **Create API Token**
7. **IMPORTANT**: Copiez immédiatement:
   - Access Key ID
   - Secret Access Key
   - Account ID (visible dans l'URL ou les paramètres)

## Étape 3: Configurer les variables d'environnement

Ajoutez ces variables dans votre fichier `.env.local`:

```bash
# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your_account_id_here
R2_ACCESS_KEY_ID=your_access_key_id_here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here
R2_BUCKET_NAME=linguami
```

## Étape 4: Installer les dépendances

```bash
npm install @aws-sdk/client-s3
```

Les autres dépendances (@supabase/supabase-js, dotenv) sont déjà installées.

## Étape 5: Lancer la migration

```bash
node scripts/migrate-to-r2.js
```

Le script va:
1. Lister tous les fichiers dans votre bucket Supabase "linguami"
2. Télécharger chaque fichier
3. Les uploader vers R2 avec la même structure de dossiers
4. Générer un rapport de migration

**Durée estimée**: 5-30 minutes selon le nombre de fichiers

## Étape 6: Configurer un domaine personnalisé (Optionnel mais recommandé)

### Option A: Utiliser R2.dev (Gratuit, par défaut)

1. Dans votre bucket R2, allez dans **Settings**
2. Activez **Public access**
3. Votre domaine sera: `https://pub-xxxxx.r2.dev`

### Option B: Domaine personnalisé avec Cloudflare Workers

1. Créez un Worker Cloudflare
2. Configurez-le pour servir les fichiers R2
3. Associez votre domaine (ex: `cdn.linguami.com`)

Exemple de Worker:

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const key = url.pathname.slice(1)

    const object = await env.BUCKET.get(key)

    if (!object) {
      return new Response('File not found', { status: 404 })
    }

    const headers = new Headers()
    object.writeHttpMetadata(headers)
    headers.set('etag', object.httpEtag)
    headers.set('cache-control', 'public, max-age=31536000, immutable')

    return new Response(object.body, { headers })
  }
}
```

## Étape 7: Mettre à jour les URLs dans l'application

1. Vérifiez que tous les fichiers sont bien sur R2
2. Mettez à jour la variable d'environnement:

```bash
# Ancienne valeur (Supabase)
NEXT_PUBLIC_SUPABASE_IMAGE=https://xxxxx.supabase.co/storage/v1/object/public/linguami/

# Nouvelle valeur (R2 avec domaine r2.dev)
NEXT_PUBLIC_SUPABASE_IMAGE=https://pub-xxxxx.r2.dev/

# OU avec domaine personnalisé
NEXT_PUBLIC_SUPABASE_IMAGE=https://cdn.linguami.com/
```

3. Redémarrez votre serveur de développement
4. Testez que toutes les images et audios se chargent correctement

## Étape 8: Tester en production

1. Déployez sur Vercel/Netlify avec la nouvelle variable d'environnement
2. Testez toutes les pages avec des médias:
   - Page d'accueil
   - Matériaux
   - Blog
   - Avatars
3. Vérifiez dans la console du navigateur qu'il n'y a pas d'erreurs 404

## Étape 9: Supprimer les fichiers de Supabase (Optionnel)

⚠️ **ATTENTION**: Ne faites cela qu'après avoir vérifié que tout fonctionne parfaitement en production pendant au moins 1 semaine.

1. Connectez-vous à [Supabase Dashboard](https://supabase.com/dashboard)
2. Allez dans **Storage**
3. Sélectionnez le bucket `linguami`
4. Supprimez les fichiers (ou gardez-les en backup)

## Dépannage

### Erreur: "Variables d'environnement R2 manquantes"
- Vérifiez que `.env.local` contient les 4 variables R2
- Redémarrez le terminal

### Erreur: "Failed to download"
- Vérifiez que les fichiers sont publics dans Supabase Storage
- Vérifiez votre connexion internet

### Erreur: "Access Denied" lors de l'upload vers R2
- Vérifiez les permissions de votre API Token R2
- Assurez-vous que le token a accès au bon bucket

### Les images ne se chargent pas après migration
- Vérifiez que `NEXT_PUBLIC_SUPABASE_IMAGE` est correctement configuré
- Vérifiez que le bucket R2 est configuré en "Public access"
- Vérifiez dans la console du navigateur les URLs générées

## Structure des fichiers

Après migration, votre bucket R2 aura cette structure:

```
linguami/
├── image/
│   ├── thumbnails/
│   │   └── *.webp
│   ├── small/
│   ├── medium/
│   └── large/
├── audio/
│   └── *.m4a
├── dwarf_male.webp
├── dwarf_female.webp
└── ... (autres avatars)
```

## Coûts estimés

- **Supabase Storage**:
  - Gratuit: 1GB
  - Au-delà: ~$0.021/GB/mois

- **Cloudflare R2**:
  - Gratuit: 10GB stockage + 10M requêtes/mois
  - Au-delà: $0.015/GB/mois + $0.36/million de requêtes
  - **Pas de frais de bande passante sortante** 🎉

Pour un site avec ~2GB de médias et 1M de requêtes/mois:
- Supabase: ~$21/mois
- R2: Gratuit (ou ~$0.36/mois si > 10M requêtes)

## Support

Si vous rencontrez des problèmes:
1. Consultez le fichier `migration-report.json` généré
2. Vérifiez les logs du script
3. Contactez le support Cloudflare si nécessaire
