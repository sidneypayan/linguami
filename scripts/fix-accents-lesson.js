const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://capnpewksfdnllttnvzu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcG5wZXdrc2ZkbmxsdHRudnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU1MzUwMiwiZXhwIjoyMDc5MTI5NTAyfQ.iU3xNj5CO_RBtGCCNpXl5LeobwRf1VGxV17sOqKPtDY'
);

function fixAccents(obj) {
  if (typeof obj === 'string') {
    let result = obj;
    // é
    result = result.replace(/\bapres-midi\b/gi, 'après-midi');
    result = result.replace(/\bapres\b/g, 'après');
    result = result.replace(/\betat\b/g, 'état');
    result = result.replace(/\bReponse\b/g, 'Réponse');
    result = result.replace(/\breponse\b/g, 'réponse');
    result = result.replace(/\bTres\b/g, 'Très');
    result = result.replace(/\btres\b/g, 'très');
    result = result.replace(/\bEnchantee\b/g, 'Enchantée');
    result = result.replace(/\bEnchante\b/g, 'Enchanté');
    result = result.replace(/\bPremiere\b/g, 'Première');
    result = result.replace(/\bpremiere\b/g, 'première');
    result = result.replace(/\bdecontracte\b/g, 'décontracté');
    result = result.replace(/\bdecontractee\b/g, 'décontractée');
    result = result.replace(/\bprefere\b/g, 'préfère');
    result = result.replace(/\beviter\b/g, 'éviter');
    result = result.replace(/\bRepondre\b/g, 'Répondre');
    result = result.replace(/\brepondre\b/g, 'répondre');
    result = result.replace(/\bespere\b/g, 'espère');
    result = result.replace(/\bPresentation\b/g, 'Présentation');
    result = result.replace(/\bpresentation\b/g, 'présentation');
    result = result.replace(/\bdesigne\b/g, 'désigné');
    result = result.replace(/\bSepare\b/g, 'Séparé');
    result = result.replace(/\bsepare\b/g, 'séparé');
    result = result.replace(/\binteresse\b/g, 'intéressé');
    result = result.replace(/\belegant\b/g, 'élégant');
    result = result.replace(/\betrangere\b/g, 'étrangère');
    result = result.replace(/\betranger\b/g, 'étranger');
    result = result.replace(/\bgeneral\b/g, 'général');
    result = result.replace(/\bgenerale\b/g, 'générale');
    result = result.replace(/\bdifferent\b/g, 'différent');
    result = result.replace(/\bdifferente\b/g, 'différente');
    // è
    result = result.replace(/\bcollegue\b/g, 'collègue');
    result = result.replace(/\bcollegues\b/g, 'collègues');
    result = result.replace(/\bsuperieurs\b/g, 'supérieurs');
    result = result.replace(/\bsuperieur\b/g, 'supérieur');
    // ê
    result = result.replace(/\breves\b/g, 'rêves');
    result = result.replace(/\breve\b/g, 'rêve');
    result = result.replace(/\bfete\b/g, 'fête');
    result = result.replace(/\bmeme\b/g, 'même');
    result = result.replace(/\betre\b/g, 'être');
    // à
    result = result.replace(/\ba vous aussi\b/g, 'à vous aussi');
    result = result.replace(/\bA bientot\b/g, 'À bientôt');
    result = result.replace(/\ba bientot\b/g, 'à bientôt');
    result = result.replace(/\bA demain\b/g, 'À demain');
    result = result.replace(/\ba demain\b/g, 'à demain');
    result = result.replace(/\ba tous\b/g, 'à tous');
    result = result.replace(/\ba une femme\b/g, 'à une femme');
    result = result.replace(/\ba un homme\b/g, 'à un homme');
    // â
    result = result.replace(/\bagees\b/g, 'âgées');
    result = result.replace(/\bagee\b/g, 'âgée');
    // ô
    result = result.replace(/\bbientot\b/g, 'bientôt');
    result = result.replace(/\bplutot\b/g, 'plutôt');
    result = result.replace(/\bhote\b/g, 'hôte');
    result = result.replace(/\bl'hote\b/g, "l'hôte");
    result = result.replace(/\bcote\b/g, 'côté');
    // ç
    result = result.replace(/\bfrancais\b/g, 'français');
    result = result.replace(/\bfrancaise\b/g, 'française');
    result = result.replace(/\bFrancais\b/g, 'Français');
    result = result.replace(/\bFrancaise\b/g, 'Française');
    result = result.replace(/\bfacon\b/g, 'façon');
    result = result.replace(/\bFacon\b/g, 'Façon');
    result = result.replace(/\bCa va\b/g, 'Ça va');
    result = result.replace(/\bca va\b/g, 'ça va');
    result = result.replace(/\bgarcon\b/g, 'garçon');
    result = result.replace(/\brecoit\b/g, 'reçoit');
    result = result.replace(/\brecois\b/g, 'reçois');
    // journée/soirée
    result = result.replace(/\bjournee\b/g, 'journée');
    result = result.replace(/\bsoiree\b/g, 'soirée');
    // région
    result = result.replace(/\bRegion\b/g, 'Région');
    result = result.replace(/\bregion\b/g, 'région');
    result = result.replace(/\bregions\b/g, 'régions');
    // santé
    result = result.replace(/\bsante\b/g, 'santé');
    result = result.replace(/\bSante\b/g, 'Santé');
    // complété
    result = result.replace(/\bcomplete\b/g, 'complété');
    result = result.replace(/\bComplete\b/g, 'Complété');
    // résumé
    result = result.replace(/\bresume\b/g, 'résumé');
    result = result.replace(/\bResume\b/g, 'Résumé');
    // répété
    result = result.replace(/\brepete\b/g, 'répété');
    // déjà
    result = result.replace(/\bdeja\b/g, 'déjà');
    // où
    result = result.replace(/\bou \b/g, 'où ');
    // début
    result = result.replace(/\bdebut\b/g, 'début');
    // écouter
    result = result.replace(/\becouter\b/g, 'écouter');
    result = result.replace(/\bEcouter\b/g, 'Écouter');
    result = result.replace(/\becoute\b/g, 'écoute');
    // répéter
    result = result.replace(/\brepeter\b/g, 'répéter');
    // créer
    result = result.replace(/\bcreer\b/g, 'créer');
    // idée
    result = result.replace(/\bidee\b/g, 'idée');
    return result;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => fixAccents(item));
  }
  if (obj !== null && typeof obj === 'object') {
    const result = {};
    for (const key of Object.keys(obj)) {
      result[key] = fixAccents(obj[key]);
    }
    return result;
  }
  return obj;
}

async function updateLesson() {
  // Get current lesson
  const { data: lesson, error: fetchError } = await supabase
    .from('course_lessons')
    .select('blocks_fr')
    .eq('slug', 'saluer-prendre-conge')
    .single();

  if (fetchError) {
    console.error('Fetch error:', fetchError);
    return;
  }

  // Fix accents
  const fixedBlocks = fixAccents(lesson.blocks_fr);

  // Show some examples of what changed
  console.log('Sample fixed content:');
  console.log(JSON.stringify(fixedBlocks[0], null, 2).substring(0, 1000));

  // Update
  const { data, error } = await supabase
    .from('course_lessons')
    .update({ blocks_fr: fixedBlocks })
    .eq('slug', 'saluer-prendre-conge')
    .select('id, slug');

  if (error) {
    console.error('Update error:', error);
  } else {
    console.log('\nUpdated successfully:', data);
  }
}

updateLesson();
