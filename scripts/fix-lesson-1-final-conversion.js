const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.production' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Map complète de conversion IPA → Cyrillique
const ipaMap = {
  // Voyelles simples
  'a': 'а',
  'ə': 'ё',
  'e': 'е',
  'ɛ': 'э',
  'i': 'и',
  'o': 'о',
  'ɔ': 'о',
  'u': 'у',
  'y': 'ю',
  'œ': 'ё',
  'ø': 'ё',

  // Voyelles nasales (à traiter en premier)
  'ɑ̃': 'ан',
  'ɛ̃': 'эн',
  'œ̃': 'эн',
  'ɔ̃': 'он',

  // Consonnes
  'p': 'п',
  'b': 'б',
  't': 'т',
  'd': 'д',
  'k': 'к',
  'g': 'г',
  'f': 'ф',
  'v': 'в',
  's': 'с',
  'z': 'з',
  'ʃ': 'ш',
  'ʒ': 'ж',
  'm': 'м',
  'n': 'н',
  'ŋ': 'нг',
  'l': 'л',
  'ʁ': 'р',
  'j': 'й',
  'w': 'у',
  'ɥ': 'юи',
  'ɲ': 'нь'
};

function convertIPA(text) {
  if (!text || typeof text !== 'string') return text;

  let result = text;

  // 1. D'abord les voyelles nasales (ordre important!)
  result = result.replace(/ɑ̃/g, 'ан');
  result = result.replace(/ɛ̃/g, 'эн');
  result = result.replace(/œ̃/g, 'эн');
  result = result.replace(/ɔ̃/g, 'он');

  // 2. Ensuite les autres caractères
  for (const [ipa, cyr] of Object.entries(ipaMap)) {
    if (ipa.length === 1) {
      result = result.split(ipa).join(cyr);
    }
  }

  return result;
}

function processValue(value) {
  if (typeof value === 'string') {
    // Chercher et remplacer tout ce qui est entre crochets [...]
    return value.replace(/\[([^\]]+)\]/g, (match, inside) => {
      const converted = convertIPA(inside);
      return `[${converted}]`;
    });
  }

  if (Array.isArray(value)) {
    return value.map(item => processValue(item));
  }

  if (value && typeof value === 'object') {
    const result = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = processValue(v);
    }
    return result;
  }

  return value;
}

async function main() {
  try {
    console.log('Récupération de la leçon...');

    const { data: lesson, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;

    console.log('Conversion des prononciations en cyrillique...');

    // Traiter blocks_ru
    const updatedBlocksRu = processValue(lesson.blocks_ru);

    // Compter les conversions
    const originalStr = JSON.stringify(lesson.blocks_ru);
    const updatedStr = JSON.stringify(updatedBlocksRu);

    const originalIPA = (originalStr.match(/[ɑɛœɔ]̃|[əɛɔøœʁʒʃɲŋɥ]/g) || []).length;
    const updatedIPA = (updatedStr.match(/[ɑɛœɔ]̃|[əɛɔøœʁʒʃɲŋɥ]/g) || []).length;

    console.log(`Caractères IPA avant: ${originalIPA}`);
    console.log(`Caractères IPA après: ${updatedIPA}`);
    console.log(`Conversions effectuées: ${originalIPA - updatedIPA}`);

    // Sauvegarder
    console.log('\nMise à jour de la base de données...');

    const { data: updated, error: updateError } = await supabase
      .from('lessons')
      .update({ blocks_ru: updatedBlocksRu })
      .eq('id', 1)
      .select()
      .single();

    if (updateError) throw updateError;

    console.log('✅ Leçon mise à jour avec succès!');

    // Sauvegarder pour vérification
    fs.writeFileSync('lesson-1-converted.json', JSON.stringify(updated, null, 2));
    console.log('📄 Résultat sauvegardé dans lesson-1-converted.json');

    // Afficher quelques exemples
    console.log('\n📋 Exemples de conversions:');
    const examples = updatedStr.match(/\[[^\]]+\]/g) || [];
    examples.slice(0, 15).forEach(ex => console.log(`  ${ex}`));

  } catch (err) {
    console.error('❌ Erreur:', err.message);
  }
}

main();
