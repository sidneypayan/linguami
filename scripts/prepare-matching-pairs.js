const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.production' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  const { data, error } = await supabase
    .from('course_lessons')
    .select('blocks_fr')
    .eq('slug', 'bonjour-saluer-prendre-conge')
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  const dialogue = data.blocks_fr[0].lines;

  console.log('=== RÉPLIQUES DU PREMIER DIALOGUE ===\n');
  dialogue.forEach((line, i) => {
    console.log(`${i + 1}. [${line.speaker}] "${line.text}"`);
  });

  console.log('\n\n=== PROPOSITION DE 6 PAIRES QUESTION/RÉPONSE ===\n');

  const pairs = [
    {
      left: "Bonjour !",
      right: "Bonjour ! Comment allez-vous ?",
      explanation: "Salutation de base"
    },
    {
      left: "Comment allez-vous ?",
      right: "Je vais bien, merci. Et vous ?",
      explanation: "Demander comment va quelqu'un"
    },
    {
      left: "Et vous ?",
      right: "Très bien, merci !",
      explanation: "Retourner la question"
    },
    {
      left: "Je m'appelle Thomas.",
      right: "Enchantée, Thomas ! Moi, c'est Sophie.",
      explanation: "Se présenter"
    },
    {
      left: "Moi, c'est Sophie.",
      right: "Enchanté, Sophie !",
      explanation: "Répondre à une présentation"
    },
    {
      left: "Bonne journée !",
      right: "Merci, à vous aussi ! Au revoir !",
      explanation: "Prendre congé"
    }
  ];

  pairs.forEach((pair, i) => {
    console.log(`Paire ${i + 1}: ${pair.explanation}`);
    console.log(`  Q: "${pair.left}"`);
    console.log(`  R: "${pair.right}"`);
    console.log('');
  });

  console.log('Ces 6 paires couvrent :');
  console.log('✓ Saluer (Bonjour)');
  console.log('✓ Demander comment va quelqu\'un');
  console.log('✓ Répondre sur son état');
  console.log('✓ Se présenter');
  console.log('✓ Répondre à une présentation');
  console.log('✓ Prendre congé');
})();
