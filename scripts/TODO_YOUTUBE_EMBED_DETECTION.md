# TODO: Implémentation de la détection d'embedding désactivé

## Contexte

Le script actuel de détection de vidéos cassées (`app/actions/admin.js::checkBrokenVideos`) ne détecte pas les vidéos YouTube avec embedding désactivé (Error 153).

## Découvertes importantes

Après analyse approfondie :

1. ❌ **Impossible de détecter via HTML statique** : Le HTML retourné par YouTube est identique pour les vidéos avec embedding activé/désactivé. Les patterns comme "Error 153", "PLAYABILITY_ERROR", "previewPlayabilityStatus" sont présents dans TOUTES les pages embed (templates de messages d'erreur).

2. ✅ **Solution : API YouTube Data v3** : L'API officielle YouTube peut nous dire de manière fiable si une vidéo a l'embedding activé ou désactivé via le champ `status.embeddable`.

## Implémentation à faire depuis le travail

### Étape 1 : Obtenir une clé API YouTube

1. Aller sur https://console.cloud.google.com/
2. Créer un projet (ou utiliser un existant)
3. Activer **YouTube Data API v3**
4. Créer des identifiants → **Clé API**
5. Ajouter la clé dans `.env.local` :
   ```
   YOUTUBE_API_KEY=votre_cle_api
   ```

### Étape 2 : Modifier `app/actions/admin.js`

Ajouter cette fonction helper :

```javascript
// Vérifier si une vidéo YouTube a l'embedding activé via l'API YouTube Data v3
async function checkYouTubeEmbeddable(videoId) {
	const API_KEY = process.env.YOUTUBE_API_KEY

	if (!API_KEY) {
		logger.warn('YouTube API key not configured, skipping embeddable check')
		return null // Ne pas bloquer si pas de clé API
	}

	try {
		const url = `https://www.googleapis.com/youtube/v3/videos?part=status&id=${videoId}&key=${API_KEY}`

		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), 5000)

		const response = await fetch(url, {
			method: 'GET',
			signal: controller.signal
		})

		clearTimeout(timeoutId)

		if (!response.ok) {
			logger.error(`YouTube API error: ${response.status}`)
			return null
		}

		const data = await response.json()

		if (data.items && data.items.length > 0) {
			return data.items[0].status.embeddable
		}

		return null // Vidéo non trouvée

	} catch (error) {
		logger.error('Error checking YouTube embeddable:', error.message)
		return null
	}
}
```

### Étape 3 : Intégrer dans `checkVideoLink`

Dans la fonction `checkVideoLink`, après la vérification oEmbed, ajouter :

```javascript
// YouTube
if (url.includes('youtube.com') || url.includes('youtu.be')) {
	const videoId = extractYouTubeId(url)
	if (!videoId) return 'broken'

	// Méthode 1: Vérifier avec l'API oEmbed (rapide)
	try {
		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), 5000)

		const oembedResponse = await fetch(
			`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
			{ method: 'GET', signal: controller.signal }
		)

		clearTimeout(timeoutId)

		if (!oembedResponse.ok) {
			return 'broken'
		}
	} catch (error) {
		return 'broken'
	}

	// ✨ NOUVEAU: Vérifier si l'embedding est désactivé via l'API YouTube
	const embeddable = await checkYouTubeEmbeddable(videoId)
	if (embeddable === false) {
		logger.info(`[Video Check] ${videoId}: Embedding disabled`)
		return 'broken'
	}

	return 'working'
}
```

### Étape 4 : Tester

Script de test créé : `scripts/test-youtube-api.mjs`

Exécuter :
```bash
node scripts/test-youtube-api.mjs
```

Devrait retourner :
- `_rlY4E_J0ro` : ✅ working (embedding activé)
- `Js11a9BuAe8` : ❌ broken (embedding désactivé - Error 153)

## Scripts utiles créés

- ✅ `scripts/test-youtube-api.mjs` - Test de l'API YouTube Data v3
- ✅ `scripts/test-working-video-confirmed.mjs` - Comparaison vidéo working vs broken
- ✅ `test-embed-*.html` - Fichiers HTML pour tester manuellement l'embedding

## Notes importantes

1. **Quota API** : L'API YouTube Data v3 a des quotas (10,000 unités/jour par défaut). Chaque requête `videos.list` coûte 1 unité. Pour vérifier ~1000 vidéos, ça coûte 1000 unités = 10% du quota quotidien.

2. **Fallback** : Si la clé API n'est pas configurée ou si l'API échoue, le code doit continuer de fonctionner avec l'ancienne logique (ne pas bloquer).

3. **Cache** : Pour éviter de consommer le quota, on pourrait cacher les résultats en DB (ajouter une colonne `embedding_status` dans `materials`).

## Vidéos de test

- ✅ Fonctionne en embed : `_rlY4E_J0ro`
- ❌ Error 153 : `Js11a9BuAe8`, `_mLAFrU9-VA`, `9bZkp7q19f0`, `kJQP7kiw5Fk`

## Références

- YouTube Data API v3 : https://developers.google.com/youtube/v3/docs/videos/list
- Quotas : https://developers.google.com/youtube/v3/getting-started#quota
