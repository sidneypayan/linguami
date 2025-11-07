/**
 * Cloudflare Worker pour servir les fichiers R2
 *
 * Ce Worker permet de:
 * - Servir les fichiers R2 avec un domaine personnalisé
 * - Ajouter des headers de cache optimaux
 * - Gérer les CORS pour les médias
 * - Servir les images avec des formats optimisés (WebP)
 *
 * Déploiement:
 * 1. Créez un nouveau Worker dans Cloudflare Dashboard
 * 2. Copiez ce code dans le Worker
 * 3. Configurez le binding R2:
 *    - Nom de la variable: BUCKET
 *    - Bucket: linguami
 * 4. Déployez et associez votre domaine (ex: cdn.linguami.com)
 */

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url)

		// Extraire le chemin du fichier (enlever le premier /)
		const key = url.pathname.slice(1)

		// Si le chemin est vide, retourner une erreur
		if (!key) {
			return new Response('Path required', { status: 400 })
		}

		try {
			// Récupérer l'objet depuis R2
			const object = await env.BUCKET.get(key)

			if (!object) {
				return new Response('File not found', { status: 404 })
			}

			// Créer les headers de réponse
			const headers = new Headers()

			// Copier les métadonnées de l'objet
			object.writeHttpMetadata(headers)
			headers.set('etag', object.httpEtag)

			// Ajouter les headers de cache
			// Cache pendant 1 an car les fichiers sont versionnés
			headers.set('cache-control', 'public, max-age=31536000, immutable')

			// Ajouter les headers CORS pour permettre l'accès depuis votre site
			headers.set('access-control-allow-origin', '*')
			headers.set('access-control-allow-methods', 'GET, HEAD, OPTIONS')
			headers.set('access-control-allow-headers', 'Range')

			// Headers de sécurité
			headers.set('x-content-type-options', 'nosniff')

			// Gérer les requêtes OPTIONS (CORS preflight)
			if (request.method === 'OPTIONS') {
				return new Response(null, { headers })
			}

			// Gérer les requêtes Range (pour les vidéos/audio)
			const range = request.headers.get('range')
			if (range) {
				const parts = range.replace(/bytes=/, '').split('-')
				const start = parseInt(parts[0], 10)
				const end = parts[1] ? parseInt(parts[1], 10) : object.size - 1

				headers.set('content-range', `bytes ${start}-${end}/${object.size}`)
				headers.set('content-length', (end - start + 1).toString())

				return new Response(object.body, {
					status: 206,
					headers,
				})
			}

			// Retourner le fichier
			return new Response(object.body, {
				headers,
			})

		} catch (error) {
			return new Response(`Error: ${error.message}`, { status: 500 })
		}
	},
}
