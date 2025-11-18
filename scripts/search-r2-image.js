const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: '.env.local' });

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const searchTerm = process.argv[2] || 'drug_detstva';

(async () => {
  try {
    console.log(`🔍 Recherche de "${searchTerm}" dans R2...\n`);

    // Chercher dans images/materials/
    const response = await s3Client.send(new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      Prefix: 'images/materials/',
      MaxKeys: 1000,
    }));

    const files = response.Contents || [];
    const matches = files.filter(f => f.Key.includes(searchTerm));

    if (matches.length > 0) {
      console.log('✅ Fichier(s) trouvé(s) :');
      matches.forEach(item => {
        console.log('  📁', item.Key);
        console.log('  📏 Taille:', (item.Size / 1024).toFixed(2), 'KB');
        console.log('  🕒 Modifié:', item.LastModified);
        console.log('  🌐 URL:', `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${item.Key}`);
        console.log('');
      });
    } else {
      console.log(`❌ Aucun fichier trouvé avec le nom "${searchTerm}"`);
      console.log('\n💡 Fichiers disponibles dans images/materials/ (premiers 30):');
      files.slice(0, 30).forEach(item => console.log('  -', item.Key));
    }

    console.log(`\n📊 Total de fichiers dans images/materials/: ${files.length}`);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
})();
