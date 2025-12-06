require('dotenv').config({ path: '.env.production' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Dictionnaire des corrections d'accents
const accentCorrections = {
  // Mots avec é
  'apres': 'après',
  'Apres': 'Après',
  'etat': 'état',
  'Etat': 'État',
  'sante': 'santé',
  'Sante': 'Santé',
  'Reponse': 'Réponse',
  'reponse': 'réponse',
  'Tres': 'Très',
  'tres': 'très',
  'Enchantee': 'Enchantée',
  'enchantee': 'enchantée',
  'feminin': 'féminin',
  'Feminin': 'Féminin',
  'Enchante': 'Enchanté',
  'enchante': 'enchanté',
  'journee': 'journée',
  'Journee': 'Journée',
  'decontractee': 'décontractée',
  'Decontractee': 'Décontractée',
  'Premiere': 'Première',
  'premiere': 'première',

  // Mots avec à
  'a vous': 'à vous',
  'A vous': 'À vous',
  'a demain': 'à demain',
  'A demain': 'À demain',
  'a bientot': 'à bientôt',
  'A bientot': 'À bientôt',
  'a plus': 'à plus',
  'A plus': 'À plus',
  'a tout': 'à tout',
  'A tout': 'À tout',
  'a quelqu': 'à quelqu',
  'A quelqu': 'À quelqu',

  // Mots avec ç
  'conge': 'congé',
  'Conge': 'Congé',
  'Facon': 'Façon',
  'facon': 'façon',

  // Mots avec è/ê
  'cafe': 'café',
  'Cafe': 'Café',
  'presenter': 'présenter',
  'Presenter': 'Présenter',

  // Mots avec ô
  'l\'hote': 'l\'hôte',
  'L\'hote': 'L\'hôte',
  'hote': 'hôte',
  'Hote': 'Hôte',
};

// Fonction récursive pour corriger les accents dans tout l'objet
function fixAccents(obj) {
  if (typeof obj === 'string') {
    let result = obj;
    // Appliquer toutes les corrections
    Object.entries(accentCorrections).forEach(([wrong, correct]) => {
      // Utiliser une regex globale pour remplacer toutes les occurrences
      const regex = new RegExp(wrong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      result = result.replace(regex, correct);
    });
    return result;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => fixAccents(item));
  }

  if (obj && typeof obj === 'object') {
    const fixed = {};
    Object.keys(obj).forEach(key => {
      fixed[key] = fixAccents(obj[key]);
    });
    return fixed;
  }

  return obj;
}

async function updateLesson() {
  console.log('Récupération de la leçon 11...\n');

  const { data: lesson } = await supabase
    .from('course_lessons')
    .select('*')
    .eq('id', 11)
    .single();

  if (!lesson) {
    console.error('Leçon 11 non trouvée');
    return;
  }

  console.log('Leçon actuelle:');
  console.log('  Title FR:', lesson.title_fr);

  // Corriger le titre
  const updatedTitleFr = fixAccents(lesson.title_fr);

  // Corriger tous les blocs FR
  const updatedBlocksFr = fixAccents(lesson.blocks_fr);

  // Corriger tous les blocs RU (au cas où il y aurait du français dedans)
  const updatedBlocksRu = fixAccents(lesson.blocks_ru);

  console.log('\nNouveau titre:');
  console.log('  Title FR:', updatedTitleFr);
  console.log('\nMise à jour de la base de données...\n');

  const { error } = await supabase
    .from('course_lessons')
    .update({
      title_fr: updatedTitleFr,
      blocks_fr: updatedBlocksFr,
      blocks_ru: updatedBlocksRu,
    })
    .eq('id', 11);

  if (error) {
    console.error('Erreur lors de la mise à jour:', error);
    return;
  }

  console.log('✅ Tous les accents français ont été corrigés avec succès !');
  console.log('\nExemples de corrections:');
  console.log('  - "apres-midi" → "après-midi"');
  console.log('  - "etat" → "état"');
  console.log('  - "Enchantee" → "Enchantée"');
  console.log('  - "a bientot" → "à bientôt"');
  console.log('  - "prendre conge" → "prendre congé"');
  console.log('  - "Facon" → "Façon"');
  console.log('  - "cafe" → "café"');
  console.log('  - "l\'hote" → "l\'hôte"');
}

updateLesson()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Erreur:', err);
    process.exit(1);
  });
