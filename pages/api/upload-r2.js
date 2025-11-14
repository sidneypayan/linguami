import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import formidable from 'formidable'
import fs from 'fs'

// Disable bodyParser pour permettre formidable de parser
export const config = {
	api: {
		bodyParser: false,
	},
}

// Client R2
const r2Client = new S3Client({
	region: 'auto',
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
	},
})

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	try {
		// Parser le formulaire avec formidable
		const form = formidable({ multiples: true })

		const [fields, files] = await new Promise((resolve, reject) => {
			form.parse(req, (err, fields, files) => {
				if (err) reject(err)
				resolve([fields, files])
			})
		})

		const file = files.file[0] || files.file
		const path = fields.path[0] || fields.path
		const contentType = fields.contentType[0] || fields.contentType

		if (!file || !path) {
			return res.status(400).json({ error: 'Missing file or path' })
		}

		// Lire le fichier
		const fileBuffer = fs.readFileSync(file.filepath)

		// Upload vers R2
		const command = new PutObjectCommand({
			Bucket: process.env.R2_BUCKET_NAME,
			Key: path,
			Body: fileBuffer,
			ContentType: contentType || file.mimetype,
		})

		await r2Client.send(command)

		// Nettoyer le fichier temporaire
		fs.unlinkSync(file.filepath)

		console.log(`✅ Fichier uploadé vers R2: ${path}`)

		res.status(200).json({ success: true, path })
	} catch (error) {
		console.error('❌ Erreur upload R2:', error)
		res.status(500).json({ error: error.message })
	}
}
