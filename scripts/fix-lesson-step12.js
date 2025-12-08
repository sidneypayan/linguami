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

  // Update blocks_fr (step 12, index 11)
  const blocksFr = [...lesson.blocks_fr];
  blocksFr[11] = {
    ...blocksFr[11],
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
    questions: [
      {
        question: "Comment répondre à \"Bonsoir !\" ?",
        answer: "Bonsoir !"
      },
      {
        question: "Comment vous présenter après \"Et vous ?\" ?",
        answer: "Je m'appelle [votre prénom]. / Moi, c'est [votre prénom]."
      },
      {
        question: "Comment répondre à \"Comment allez-vous ?\" ?",
        answer: "Je vais bien, merci. Et vous ? / Très bien, merci !"
      }
    ]
  };

  // Update blocks_en (step 12, index 11)
  const blocksEn = [...lesson.blocks_en];
  blocksEn[11] = {
    ...blocksEn[11],
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
    questions: [
      {
        question: "How to respond to \"Bonsoir !\"?",
        answer: "Bonsoir !"
      },
      {
        question: "How to introduce yourself after \"Et vous ?\"?",
        answer: "Je m'appelle [your first name]. / Moi, c'est [your first name]."
      },
      {
        question: "How to respond to \"Comment allez-vous ?\"?",
        answer: "Je vais bien, merci. Et vous ? / Très bien, merci !"
      }
    ]
  };

  // Update blocks_ru (step 12, index 11)
  const blocksRu = [...lesson.blocks_ru];
  blocksRu[11] = {
    ...blocksRu[11],
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
    questions: [
      {
        question: "Как ответить на \"Bonsoir !\"?",
        answer: "Bonsoir !"
      },
      {
        question: "Как представиться после \"Et vous ?\"?",
        answer: "Je m'appelle [ваше имя]. / Moi, c'est [ваше имя]."
      },
      {
        question: "Как ответить на \"Comment allez-vous ?\"?",
        answer: "Je vais bien, merci. Et vous ? / Très bien, merci !"
      }
    ]
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
  console.log('Changement : "Vous connaissez l\'hôte ?" → "Comment allez-vous ?"');
  console.log('\nNouvelle réponse attendue : "Je vais bien, merci. Et vous ? / Très bien, merci !"');
})();
