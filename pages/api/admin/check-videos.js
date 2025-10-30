import { createServerClient } from '@supabase/ssr'

export default async function handler(req, res) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				get(name) {
					return req.cookies[name]
				},
				set(name, value, options) {
					res.setHeader('Set-Cookie', `${name}=${value}`)
				},
				remove(name, options) {
					res.setHeader('Set-Cookie', `${name}=; Max-Age=0`)
				},
			},
		}
	)

	// Vérifier l'authentification
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (!user || authError) {
		return res.status(401).json({ error: 'Unauthorized' })
	}

	// Vérifier le rôle admin
	const { data: userProfile } = await supabase
		.from('users_profile')
		.select('role')
		.eq('id', user.id)
		.single()

	if (userProfile?.role !== 'admin') {
		return res.status(403).json({ error: 'Forbidden' })
	}

	// Récupérer tous les matériels avec vidéo
	const { data: materials, error } = await supabase
		.from('materials')
		.select('id, title, section, lang, video')
		.not('video', 'is', null)
		.order('id', { ascending: false })

	if (error) {
		console.error('Error fetching materials:', error)
		return res.status(500).json({ error: 'Failed to fetch materials' })
	}

	// Filtrer pour ne garder que les matériels avec une vraie URL vidéo
	const materialsWithVideo = materials.filter(m => {
		if (!m.video) return false
		const trimmed = m.video.trim()
		// Vérifier que c'est une URL valide qui commence par http
		return trimmed.length > 0 && (trimmed.startsWith('http://') || trimmed.startsWith('https://'))
	})

	// Vérifier chaque lien vidéo
	const checkedVideos = await Promise.all(
		materialsWithVideo.map(async (material) => {
			const status = await checkVideoLink(material.video)
			return {
				...material,
				status,
			}
		})
	)

	// Filtrer pour ne garder que les liens cassés
	const brokenVideos = checkedVideos.filter(v => v.status === 'broken')

	res.status(200).json({ brokenVideos, totalVideos: materialsWithVideo.length })
}

async function checkVideoLink(url) {
	if (!url) return 'broken'

	try {
		// YouTube
		if (url.includes('youtube.com') || url.includes('youtu.be')) {
			const videoId = extractYouTubeId(url)
			if (!videoId) return 'broken'

			// Méthode 1: Vérifier avec l'API oEmbed (rapide)
			try {
				const oembedResponse = await fetch(
					`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
					{ method: 'GET', signal: AbortSignal.timeout(5000) }
				)

				// Si oEmbed retourne une erreur, la vidéo est définitivement cassée
				if (!oembedResponse.ok) {
					return 'broken'
				}

				// oEmbed a réussi, mais ça ne garantit pas que la vidéo est lisible
				// Continuons avec une vérification plus approfondie
			} catch (error) {
				// oEmbed a échoué, la vidéo est probablement cassée
				return 'broken'
			}

			// Méthode 2: Vérifier la page embed pour plus de détails
			const embedResponse = await fetch(
				`https://www.youtube.com/embed/${videoId}`,
				{
					method: 'GET',
					signal: AbortSignal.timeout(10000),
					headers: {
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
					},
				}
			)

			if (!embedResponse.ok) return 'broken'

			const html = await embedResponse.text()

			// Log pour debug (seulement pour cette vidéo spécifique)
			if (videoId === 'kLezFlhQook') {
				console.log('=== DEBUG VIDEO kLezFlhQook ===')
				console.log('Status:', embedResponse.status)
				console.log('HTML length:', html.length)

				// Chercher le playabilityStatus
				const playabilityMatch = html.match(/"playabilityStatus":\s*\{[^}]+\}/);
				if (playabilityMatch) {
					console.log('Playability found:', playabilityMatch[0])
				} else {
					console.log('No playabilityStatus found')
				}

				// Chercher d'autres indicateurs
				if (html.includes('has been blocked')) console.log('Found: has been blocked')
				if (html.includes('copyright')) console.log('Found: copyright')
				if (html.includes('unavailable')) console.log('Found: unavailable')
				if (html.includes('UNPLAYABLE')) console.log('Found: UNPLAYABLE')
			}

			// Chercher les données JSON embarquées dans la page
			const playabilityMatch = html.match(/"playabilityStatus":\s*\{[^}]+\}/);
			if (playabilityMatch) {
				try {
					const jsonStr = playabilityMatch[0].replace('"playabilityStatus":', '');
					const playabilityStatus = JSON.parse(jsonStr);

					// Vérifier le statut
					if (
						playabilityStatus.status === 'ERROR' ||
						playabilityStatus.status === 'UNPLAYABLE' ||
						playabilityStatus.status === 'LOGIN_REQUIRED' ||
						playabilityStatus.status === 'CONTENT_CHECK_REQUIRED'
					) {
						return 'broken'
					}
				} catch (e) {
					// Impossible de parser le JSON, continuer avec d'autres vérifications
					console.error('Error parsing playabilityStatus:', e.message)
				}
			}

			// Indicateurs de vidéo indisponible dans le HTML
			if (
				html.includes('Video unavailable') ||
				html.includes('This video is unavailable') ||
				html.includes('This video isn\'t available') ||
				html.includes('This video has been removed') ||
				html.includes('Private video') ||
				html.includes('has been blocked') ||
				html.includes('This video contains content') ||
				html.includes('who has blocked it') ||
				html.includes('copyright grounds') ||
				html.includes('blocked it in your country') ||
				html.includes('"status":"ERROR"') ||
				html.includes('"status":"UNPLAYABLE"') ||
				html.includes('"status":"LOGIN_REQUIRED"') ||
				html.includes('"reason":"Video unavailable"') ||
				html.includes('CONTENT_NOT_AVAILABLE') ||
				html.includes('playback on other websites has been disabled') ||
				html.includes('"isUnlisted":true') && html.includes('"isPrivate":true')
			) {
				return 'broken'
			}

			return 'working'
		}

		// Odysee
		if (url.includes('odysee.com')) {
			const response = await fetch(url, {
				method: 'GET',
				signal: AbortSignal.timeout(10000),
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
				},
			})

			if (!response.ok) return 'broken'

			const html = await response.text()
			// Vérifier si la page contient des indicateurs d'erreur
			if (html.includes('not found') || html.includes('404')) {
				return 'broken'
			}

			return 'working'
		}

		// Rutube
		if (url.includes('rutube.ru')) {
			const response = await fetch(url, {
				method: 'GET',
				signal: AbortSignal.timeout(10000),
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
				},
			})

			if (!response.ok) return 'broken'

			const html = await response.text()
			// Vérifier si la vidéo existe
			if (html.includes('Видео не найдено') || html.includes('404')) {
				return 'broken'
			}

			return 'working'
		}

		// Autres liens
		const response = await fetch(url, {
			method: 'HEAD',
			signal: AbortSignal.timeout(10000),
		})
		return response.ok ? 'working' : 'broken'
	} catch (error) {
		console.error(`Error checking ${url}:`, error.message)
		return 'broken'
	}
}

function extractYouTubeId(url) {
	const patterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
		/youtube\.com\/watch\?.*v=([^&\n?#]+)/,
	]

	for (const pattern of patterns) {
		const match = url.match(pattern)
		if (match && match[1]) return match[1]
	}

	return null
}
