import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const r2Client = new S3Client({
	region: 'auto',
	endpoint: 'https://' + process.env.R2_ACCOUNT_ID + '.r2.cloudflarestorage.com',
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
	},
})

async function checkIlya() {
	const command = new ListObjectsV2Command({
		Bucket: process.env.R2_BUCKET_NAME,
		Prefix: 'audios/ru/materials/',
	})

	const response = await r2Client.send(command)
	
	console.log('Files containing "ilya" in audios/ru/materials/:\n')
	response.Contents.filter(obj => obj.Key.toLowerCase().includes('ilya')).forEach(obj => {
		console.log('  - ' + obj.Key)
	})
}

checkIlya()
