const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.production' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Map de conversion directe pour les mots français complets
const directConversions = {
  // Mots complets les plus courants
  'pəti': 'пёти',
  'pətit': 'пётит',
  'frɑ̃sɛ': 'франсэ',
  'boku': 'боку',
  'avɛk': 'авэк',
  'puʁ': 'пур',
  'nœf': 'нёф',
  'mal': 'маль',
  'lezɑ̃fɑ̃': 'лезанфан',
  'œ̃nami': 'энами',
  'døzœʁ': 'дёзёр',
  'ete': 'ете',
  'pɛʁ': 'пэр',
  // Ajout de mots simples
  'lə': 'лё',
  'ʒə': 'жё',
  'də': 'дё',
  'e': 'е',
  'ɛ': 'э',
  'ə': 'ё',
  'kafe': 'кафе',
  'sə': 'сё',
  'isi': 'иси',
  'gaʁ': 'гар',
  'gɔm': 'гом',
  'gid': 'гид',
  'ʒiʁaf': 'жираф',
  'mɑ̃ʒɔ̃': 'манжон',
  'ʒɔʁʒ': 'жорж',
  'kɔm': 'ком',
  'kyb': 'кюб'
};

// Fonction pour convertir une prononciation IPA en cyrillique
function convertIpaToCyrillic(ipa) {
  if (!ipa || typeof ipa !== 'string') return ipa;

  // D'abord essayer une conversion directe
  if (directConversions[ipa]) {
    return directConversions[ipa];
  }

  // Sinon, convertir caractère par caractère avec règles
  let result = ipa;

  // Règles de conversion (de la plus spécifique à la plus générale)
  const rules = [
    // Voyelles nasales (doivent être avant les voyelles simples)
    [/ɑ̃/g, 'ан'],
    [/ɛ̃/g, 'эн'],
    [/œ̃/g, 'эн'],
    [/ɔ̃/g, 'он'],

    // Digrammes et trigrammes
    [/nœf/g, 'нёф'],
    [/puʁ/g, 'пур'],

    // Voyelles
    [/a/g, 'а'],
    [/ə/g, 'ё'],
    [/e/g, 'е'],
    [/ɛ/g, 'э'],
    [/i/g, 'и'],
    [/o/g, 'о'],
    [/ɔ/g, 'о'],
    [/u/g, 'у'],
    [/y/g, 'ю'],
    [/œ/g, 'ё'],
    [/ø/g, 'ё'],

    // Consonnes
    [/k/g, 'к'],
    [/s/g, 'с'],
    [/ʒ/g, 'ж'],
    [/ʃ/g, 'ш'],
    [/ʁ/g, 'р'],
    [/l/g, 'л'],
    [/m/g, 'м'],
    [/n/g, 'н'],
    [/p/g, 'п'],
    [/t/g, 'т'],
    [/f/g, 'ф'],
    [/v/g, 'в'],
    [/b/g, 'б'],
    [/d/g, 'д'],
    [/g/g, 'г'],
    [/z/g, 'з'],
    [/ɲ/g, 'нь'],
    [/ŋ/g, 'нг'],
    [/j/g, 'й'],
    [/w/g, 'у'],
    [/ɥ/g, 'юи']
  ];

  // Appliquer toutes les règles
  for (const [pattern, replacement] of rules) {
    result = result.replace(pattern, replacement);
  }

  return result;
}

// Fonction récursive pour traiter les objets et tableaux
function processContent(obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => processContent(item));
  } else if (obj !== null && typeof obj === 'object') {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        let newValue = value;

        // Convertir les prononciations API entre crochets
        if (newValue.includes('[') && newValue.includes(']')) {
          newValue = newValue.replace(/\[([^\]]+)\]/g, (match, ipa) => {
            const cyrillic = convertIpaToCyrillic(ipa);
            return `[${cyrillic}]`;
          });
        }

        newObj[key] = newValue;
      } else {
        newObj[key] = processContent(value);
      }
    }
    return newObj;
  }
  return obj;
}

async function updateLesson() {
  try {
    // Récupérer la leçon actuelle
    const { data: lesson, error: fetchError } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', 1)
      .single();

    if (fetchError) {
      console.error('Error fetching lesson:', fetchError);
      return;
    }

    console.log('Original lesson loaded');

    // Traiter blocks_ru
    const updatedBlocksRu = processContent(lesson.blocks_ru);

    // Sauvegarder les modifications
    const { data: updated, error: updateError } = await supabase
      .from('lessons')
      .update({
        blocks_ru: updatedBlocksRu
      })
      .eq('id', 1)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating lesson:', updateError);
      return;
    }

    console.log('✅ Lesson updated successfully!');
    console.log('- Converted ALL IPA pronunciations to Cyrillic');

    // Sauvegarder le résultat pour vérification
    const fs = require('fs');
    fs.writeFileSync('lesson-1-final.json', JSON.stringify(updated, null, 2));
    console.log('\n📄 Updated lesson saved to lesson-1-final.json for review');

    // Compter les conversions
    const blocksStr = JSON.stringify(updated.blocks_ru);
    const ipaMatches = blocksStr.match(/\[([^\]]+)\]/g) || [];
    console.log(`\n📊 Found ${ipaMatches.length} pronunciation notations`);

    // Afficher quelques exemples
    console.log('\nExemples de prononciations converties:');
    const examples = ipaMatches.slice(0, 10);
    examples.forEach(ex => console.log(`  ${ex}`));

  } catch (error) {
    console.error('Error:', error);
  }
}

updateLesson();
