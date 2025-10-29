import { supabaseServer } from '../../../lib/supabase-server'

export default async function handler(req, res) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	const { id, type } = req.query

	if (!id || !type) {
		return res.status(400).json({ error: 'Missing id or type parameter' })
	}

	try {
		const { count, error } = await supabaseServer
			.from('h5p')
			.select('*', { count: 'exact', head: true })
			.eq('material_id', id)
			.eq('type', type)

		if (error) {
			console.error('Error counting activities:', error)
			return res.status(500).json({ error: 'Failed to count activities' })
		}

		return res.status(200).json({ count: count || 0 })
	} catch (error) {
		console.error('Error:', error)
		return res.status(500).json({ error: 'Internal server error' })
	}
}
