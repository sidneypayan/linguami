import dbConnect from '../../../util/mongo'
import Material from '../../../models/Material'

export default async function handler(req, res) {
	const { method } = req

	dbConnect()

	if (method === 'GET') {
		res.status(200).json({ msg: 'Tout est ok!' })
	}

	if (method === 'POST') {
		try {
			const material = await Material.create(req.body)
			res.status(201).json(material)
		} catch (error) {
			res.status(500).json(error)
		}
	}
}
