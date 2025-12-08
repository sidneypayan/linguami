const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.production' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  // Get the lesson
  const { data: lesson, error } = await supabase
    .from('course_lessons')
    .select('*')
    .eq('slug', 'bonjour-saluer-prendre-conge')
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Lesson found:', lesson.slug);

  // Définir les 6 paires de matching
  const matchingPairs = [
    {
      left: "Bonjour !",
      right: "Bonjour ! Comment allez-vous ?"
    },
    {
      left: "Comment allez-vous ?",
      right: "Je vais bien, merci. Et vous ?"
    },
    {
      left: "Et vous ?",
      right: "Très bien, merci !"
    },
    {
      left: "Je m'appelle Thomas.",
      right: "Enchantée, Thomas ! Moi, c'est Sophie."
    },
    {
      left: "Moi, c'est Sophie.",
      right: "Enchanté, Sophie !"
    },
    {
      left: "Bonne journée !",
      right: "Merci, à vous aussi ! Au revoir !"
    }
  ];

  // Récupérer le dialogue du premier bloc pour l'animation
  const firstDialogue = lesson.blocks_fr[0].lines;

  // Update blocks_fr (step 12, index 11)
  const blocksFr = [...lesson.blocks_fr];
  blocksFr[11] = {
    type: "conversation",
    title: "A une soiree",
    context: "Vous etes a une fete et vous rencontrez quelqu'un pour la première fois.",
    dialogue: [
      {
        text: "Bonsoir !",
        speaker: "Inconnu(e)"
      },
      {
        text: "...",
        speaker: "Vous"
      },
      {
        text: "Je m'appelle Claire. Et vous ?",
        speaker: "Inconnu(e)"
      },
      {
        text: "...",
        speaker: "Vous"
      },
      {
        text: "Enchantée ! Comment allez-vous ?",
        speaker: "Inconnu(e)"
      },
      {
        text: "...",
        speaker: "Vous"
      }
    ],
    questionType: "matching",
    matchingPairs: matchingPairs,
    matchingDialogue: firstDialogue
  };

  // Update blocks_en (step 12, index 11)
  const firstDialogueEn = lesson.blocks_en[0].lines;
  const blocksEn = [...lesson.blocks_en];
  blocksEn[11] = {
    type: "conversation",
    title: "At a party",
    context: "You are at a party and you meet someone for the first time.",
    dialogue: [
      {
        text: "Bonsoir !",
        speaker: "Stranger"
      },
      {
        text: "...",
        speaker: "You"
      },
      {
        text: "Je m'appelle Claire. Et vous ?",
        speaker: "Stranger"
      },
      {
        text: "...",
        speaker: "You"
      },
      {
        text: "Enchantée ! Comment allez-vous ?",
        speaker: "Stranger"
      },
      {
        text: "...",
        speaker: "You"
      }
    ],
    questionType: "matching",
    matchingPairs: matchingPairs,
    matchingDialogue: firstDialogueEn
  };

  // Update blocks_ru (step 12, index 11)
  const firstDialogueRu = lesson.blocks_ru[0].lines;
  const blocksRu = [...lesson.blocks_ru];
  blocksRu[11] = {
    type: "conversation",
    title: "На вечеринке",
    context: "Вы на вечеринке и встречаете кого-то впервые.",
    dialogue: [
      {
        text: "Bonsoir !",
        speaker: "Незнакомец"
      },
      {
        text: "...",
        speaker: "Вы"
      },
      {
        text: "Je m'appelle Claire. Et vous ?",
        speaker: "Незнакомец"
      },
      {
        text: "...",
        speaker: "Вы"
      },
      {
        text: "Enchantée ! Comment allez-vous ?",
        speaker: "Незнакомец"
      },
      {
        text: "...",
        speaker: "Вы"
      }
    ],
    questionType: "matching",
    matchingPairs: matchingPairs,
    matchingDialogue: firstDialogueRu
  };

  // Update the lesson
  const { error: updateError } = await supabase
    .from('course_lessons')
    .update({
      blocks_fr: blocksFr,
      blocks_en: blocksEn,
      blocks_ru: blocksRu
    })
    .eq('slug', 'bonjour-saluer-prendre-conge');

  if (updateError) {
    console.error('Update error:', updateError);
    return;
  }

  console.log('\n✅ Étape 12 mise à jour avec succès !');
  console.log('\n=== EXERCICE DE MATCHING AJOUTÉ ===');
  console.log('Type: Click matching (relier les questions aux réponses)');
  console.log('\nPaires ajoutées:');
  matchingPairs.forEach((pair, i) => {
    console.log(`\n${i + 1}. "${pair.left}" → "${pair.right}"`);
  });
  console.log('\nAprès complétion: Animation + audio du premier dialogue');
})();
