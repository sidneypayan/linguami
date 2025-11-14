import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function analyzePrefixes() {
  const structure = {};
  let continuationToken = null;
  let totalFiles = 0;

  console.log('🔍 Analyzing R2 bucket structure...\n');

  do {
    const response = await r2.send(new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      MaxKeys: 1000,
      ContinuationToken: continuationToken,
    }));

    if (response.Contents) {
      response.Contents.forEach(obj => {
        totalFiles++;
        const parts = obj.Key.split('/');

        // Construire la hiérarchie
        let level1 = parts[0];
        let level2 = parts[1] || '';
        let level3 = parts[2] || '';

        if (!structure[level1]) structure[level1] = {};
        if (level2 && !structure[level1][level2]) structure[level1][level2] = new Set();
        if (level3 && structure[level1][level2]) structure[level1][level2].add(level3.split('/')[0]);
      });
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  console.log('📊 Structure actuelle du bucket R2:');
  console.log('━'.repeat(70));
  console.log(`Total files: ${totalFiles}\n`);

  Object.keys(structure).sort().forEach(level1 => {
    console.log(`📁 ${level1}/`);

    const level2s = Object.keys(structure[level1]).sort();
    level2s.forEach((level2, idx) => {
      const isLast = idx === level2s.length - 1;
      const prefix = isLast ? '└── ' : '├── ';

      if (structure[level1][level2] instanceof Set) {
        const count = structure[level1][level2].size;
        console.log(`   ${prefix}${level2}/ (${count} subfolders)`);
      } else {
        console.log(`   ${prefix}${level2}`);
      }
    });
    console.log('');
  });
}

analyzePrefixes().catch(console.error);
