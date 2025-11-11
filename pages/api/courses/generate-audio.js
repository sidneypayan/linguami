import { createServerClient } from '@/lib/supabase-server'

/**
 * API route to generate audio using ElevenLabs and upload to R2
 * POST /api/courses/generate-audio
 *
 * Body:
 * {
 *   text: string,           // Text to convert to speech
 *   voiceId: string,        // ElevenLabs voice ID
 *   fileName: string,       // Filename for R2 storage (without extension)
 *   language: string        // Language code (fr, ru, en)
 * }
 */
export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	try {
		// Check for script auth via X-Admin-Key header
		const adminKey = req.headers['x-admin-key']
		const isScriptAuth = adminKey === process.env.SUPABASE_SERVICE_ROLE_KEY

		if (!isScriptAuth) {
			// Authenticate user via Supabase
			const supabase = createServerClient(req, res)
			const {
				data: { user },
				error: authError,
			} = await supabase.auth.getUser()

			if (authError || !user) {
				return res.status(401).json({ error: 'Unauthorized' })
			}

			// Check if user is admin
			const { data: profile } = await supabase
				.from('users_profile')
				.select('role')
				.eq('id', user.id)
				.single()

			if (!profile || profile.role !== 'admin') {
				return res.status(403).json({ error: 'Forbidden: Admin access required' })
			}
		}

		const { text, voiceId, fileName, language, slower = false } = req.body

		if (!text || !voiceId || !fileName || !language) {
			return res.status(400).json({
				error: 'Missing required fields: text, voiceId, fileName, language',
			})
		}

		// Generate audio with ElevenLabs
		const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY

		if (!ELEVENLABS_API_KEY) {
			return res.status(500).json({ error: 'ElevenLabs API key not configured' })
		}

		// Adjust voice settings based on slower parameter
		const voiceSettings = slower
			? {
					stability: 0.75, // Higher stability = slower, more deliberate speech
					similarity_boost: 0.75,
					style: 0.0,
					use_speaker_boost: true,
			  }
			: {
					stability: 0.5,
					similarity_boost: 0.75,
			  }

		const elevenLabsResponse = await fetch(
			`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
			{
				method: 'POST',
				headers: {
					'Accept': 'audio/mpeg',
					'Content-Type': 'application/json',
					'xi-api-key': ELEVENLABS_API_KEY,
				},
				body: JSON.stringify({
					text,
					model_id: 'eleven_multilingual_v2',
					voice_settings: voiceSettings,
				}),
			}
		)

		if (!elevenLabsResponse.ok) {
			const errorText = await elevenLabsResponse.text()
			console.error('ElevenLabs API error:', errorText)
			return res.status(500).json({
				error: 'Failed to generate audio',
				details: errorText,
			})
		}

		// Get audio buffer
		const audioBuffer = await elevenLabsResponse.arrayBuffer()

		// Upload to Cloudflare R2
		const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3')

		const s3Client = new S3Client({
			region: 'auto',
			endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
			credentials: {
				accessKeyId: process.env.R2_ACCESS_KEY_ID,
				secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
			},
		})

		// Ensure filename ends with .mp3 (but don't add it if already present)
		const cleanFileName = fileName.endsWith('.mp3') ? fileName : `${fileName}.mp3`
		const filePath = `audio/courses/${language}/${cleanFileName}`

		try {
			await s3Client.send(
				new PutObjectCommand({
					Bucket: process.env.R2_BUCKET_NAME,
					Key: filePath,
					Body: Buffer.from(audioBuffer),
					ContentType: 'audio/mpeg',
				})
			)
		} catch (uploadError) {
			console.error('R2 upload error:', uploadError)
			return res.status(500).json({
				error: 'Failed to upload audio',
				details: uploadError.message,
			})
		}

		// Get public URL
		const publicUrl = `${process.env.R2_PUBLIC_URL}/${filePath}`

		return res.status(200).json({
			success: true,
			url: publicUrl,
			path: filePath,
		})
	} catch (error) {
		console.error('Error generating audio:', error)
		return res.status(500).json({
			error: 'Internal server error',
			details: error.message,
		})
	}
}
