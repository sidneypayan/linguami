import { createServerClient } from '@supabase/ssr'
import { logger } from '@/utils/logger'

export default async function handler(req, res) {
	if (req.method !== 'PUT') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	const { materialId, videoUrl } = req.body

	if (!materialId || !videoUrl) {
		return res.status(400).json({ error: 'Material ID and video URL are required' })
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

	// Mettre à jour le lien vidéo
	const { data, error } = await supabase
		.from('materials')
		.update({ video: videoUrl })
		.eq('id', materialId)
		.select()
		.single()

	if (error) {
		logger.error('Error updating video:', error)
		return res.status(500).json({ error: 'Failed to update video' })
	}

	res.status(200).json({ success: true, material: data })
}
