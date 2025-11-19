import { createClient } from '@supabase/supabase-js'
import { logger } from '@/utils/logger'
import { NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Route Handler to generate audio using ElevenLabs and upload to R2
 * POST /api/courses/generate-audio
 *
 * Body:
 * {
 *   text: string,           // Text to convert to speech
 *   voiceId: string,        // ElevenLabs voice ID
 *   fileName: string,       // Filename for R2 storage (without extension)
 *   language: string        // Language code (fr, ru, en)
 *   slower?: boolean        // Optional: slower speech rate
 * }
 */

// Validation schema to prevent path traversal and injection attacks
const GenerateAudioSchema = z.object({
	text: z.string().min(1).max(5000),
	voiceId: z.string().regex(/^[a-zA-Z0-9_-]+$/, 'Invalid voice ID format'),
	fileName: z.string()
		.regex(/^[a-zA-Z0-9_-]+$/, 'Filename can only contain alphanumeric characters, hyphens and underscores')
		.min(1)
		.max(200),
	language: z.enum(['fr', 'ru', 'en']),
	slower: z.boolean().optional().default(false)
})

export async function POST(request) {
	try {
		// Check for script auth via X-Admin-Key header
		const adminKey = request.headers.get('x-admin-key')
		const isScriptAuth = adminKey === process.env.SUPABASE_SERVICE_ROLE_KEY

		if (!isScriptAuth) {
			// Authenticate user via Supabase
			const supabase = createClient(
				process.env.NEXT_PUBLIC_SUPABASE_URL,
				process.env.SUPABASE_SERVICE_ROLE_KEY
			)

			// Get authorization header
			const authHeader = request.headers.get('authorization')
			if (!authHeader) {
				return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
			}

			const token = authHeader.replace('Bearer ', '')
			const {
				data: { user },
				error: authError,
			} = await supabase.auth.getUser(token)

			if (authError || !user) {
				return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
			}

			// Check if user is admin
			const { data: profile } = await supabase
				.from('users_profile')
				.select('role')
				.eq('id', user.id)
				.single()

			if (!profile || profile.role !== 'admin') {
				return NextResponse.json(
					{ error: 'Forbidden: Admin access required' },
					{ status: 403 }
				)
			}
		}

		const body = await request.json()

		// Validate input with Zod to prevent path traversal and injection
		const validationResult = GenerateAudioSchema.safeParse(body)

		if (!validationResult.success) {
			logger.error('Validation error:', validationResult.error.errors)
			return NextResponse.json(
				{
					error: 'Invalid request data',
					details: validationResult.error.errors
				},
				{ status: 400 }
			)
		}

		const { text, voiceId, fileName, language, slower } = validationResult.data

		// Generate audio with ElevenLabs
		const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY

		if (!ELEVENLABS_API_KEY) {
			return NextResponse.json(
				{ error: 'ElevenLabs API key not configured' },
				{ status: 500 }
			)
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
			logger.error('ElevenLabs API error:', errorText)
			return NextResponse.json(
				{
					error: 'Failed to generate audio',
					details: errorText,
				},
				{ status: 500 }
			)
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
		const filePath = `audios/courses/${language}/${cleanFileName}`

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
			logger.error('R2 upload error:', uploadError)
			return NextResponse.json(
				{
					error: 'Failed to upload audio',
					details: uploadError.message,
				},
				{ status: 500 }
			)
		}

		// Get public URL
		const publicUrl = `${process.env.R2_PUBLIC_URL}/${filePath}`

		return NextResponse.json({
			success: true,
			url: publicUrl,
			path: filePath,
		})
	} catch (error) {
		logger.error('Error generating audio:', error)
		return NextResponse.json(
			{
				error: 'Internal server error',
				details: error.message,
			},
			{ status: 500 }
		)
	}
}
