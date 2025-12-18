const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.production' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Conversion table IPA → Cyrillic
const ipaToRussian = {
  // Voyelles
  'a': 'а',
  'ə': 'ё', // schwa
  'e': 'е', // fermé
  'ɛ': 'э', // ouvert
  'i': 'и',
  'o': 'о',
  'ɔ': 'о', // ouvert
  'u': 'у',
  'y': 'ю',
  'œ': 'ё',
  'ø': 'ё',

  // Voyelles nasales
  'ɑ̃': 'ан',
  'ɛ̃': 'эн',
  'œ̃': 'эн',
  'ɔ̃': 'он',

  // Consonnes
  'k': 'к',
  's': 'с',
  'ʒ': 'ж',
  'ʃ': 'ш',
  'ʁ': 'р', // r grasseyé
  'l': 'л',
  'm': 'м',
  'n': 'н',
  'p': 'п',
  't': 'т',
  'f': 'ф',
  'v': 'в',
  'b': 'б',
  'd': 'д',
  'g': 'г',
  'z': 'з',
  'ɲ': 'нь', // gn français
  'ŋ': 'нг',
  'j': 'й',
  'w': 'у',
  'ɥ': 'юи',
  'nœf': 'нёф',
  'puʁ': 'пур',
  'avɛk': 'авэк',
  'mal': 'маль',
  'pəti': 'пёти',
  'frɑ̃sɛ': 'франсэ',
  'boku': 'боку',
  'lezɑ̃fɑ̃': 'лезанфан',
  'œ̃nami': 'энами',
  'døzœʁ': 'дёзёр',
  'pətit': 'пётит',
  'ete': 'ете',
  'pɛʁ': 'пэр'
};

// Fonction pour convertir une prononciation IPA en cyrillique
function convertIpaToCyrillic(ipaText) {
  if (!ipaText || typeof ipaText !== 'string') return ipaText;

  let result = ipaText;

  // D'abord remplacer les mots complets connus
  const wholeWords = ['nœf', 'puʁ', 'avɛk', 'mal', 'pəti', 'frɑ̃sɛ', 'boku', 'lezɑ̃fɑ̃', 'œ̃nami', 'døzœʁ', 'pətit', 'ete', 'pɛʁ'];
  for (const word of wholeWords) {
    if (result.includes(word)) {
      result = result.replace(word, ipaToRussian[word]);
    }
  }

  // Puis remplacer les groupes de caractères (nasales d'abord)
  result = result.replace(/ɑ̃/g, ipaToRussian['ɑ̃']);
  result = result.replace(/ɛ̃/g, ipaToRussian['ɛ̃']);
  result = result.replace(/œ̃/g, ipaToRussian['œ̃']);
  result = result.replace(/ɔ̃/g, ipaToRussian['ɔ̃']);

  // Puis les caractères individuels
  for (const [ipa, cyrillic] of Object.entries(ipaToRussian)) {
    if (ipa.length === 1 || ipa.length === 2) {
      result = result.split(ipa).join(cyrillic);
    }
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
      // Remplacer "CaReFuL" dans les textes
      if (typeof value === 'string') {
        let newValue = value;

        // Remplacements spécifiques pour "CaReFuL" en russe
        if (newValue.includes('CaReFuL')) {
          newValue = newValue.replace(/CaReFuL/g, 'C, R, F, L');
          newValue = newValue.replace('Исключение: C, R, F, L', 'Исключение: C, R, F, L произносятся в конце');
          newValue = newValue.replace('Помните C, R, F, L для распространённых исключений', 'Помните: C, R, F, L часто произносятся в конце слова');
          newValue = newValue.replace('Применяйте правило C, R, F, L', 'Помните: C, R, F, L обычно произносятся в конце');
        }

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
    // Récupérer la leçon
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

    // Traiter uniquement blocks_ru (pour les russophones)
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
    console.log('- Removed "CaReFuL" references');
    console.log('- Converted IPA pronunciations to Cyrillic');

    // Sauvegarder le résultat pour vérification
    const fs = require('fs');
    fs.writeFileSync('lesson-1-updated.json', JSON.stringify(updated, null, 2));
    console.log('\n📄 Updated lesson saved to lesson-1-updated.json for review');

  } catch (error) {
    console.error('Error:', error);
  }
}

updateLesson();
