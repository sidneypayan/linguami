require('dotenv').config({ path: '.env.production' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const frenchContent = {
  greetings: {
    label_fr: 'Salutations',
    label_en: 'Greetings',
    label_ru: 'Приветствия',
    icon: '👋',
    questions: [
      {
        question_fr: 'Comment dit-on "bonjour" en français ?',
        question_en: 'How do you say "hello" in French?',
        question_ru: 'Как сказать "привет" по-французски?',
        options: ['Bonjour', 'Au revoir', 'Merci', 'Bonsoir'],
        correct_answer: 0,
        explanation_fr: 'Bonjour est la salutation standard.',
        explanation_en: 'Bonjour is the standard greeting.',
        explanation_ru: 'Bonjour - стандартное приветствие.',
      },
      {
        question_fr: 'Comment dit-on "merci" en français ?',
        question_en: 'How do you say "thank you" in French?',
        question_ru: 'Как сказать "спасибо" по-французски?',
        options: ['Merci', 'Pardon', 'Bonjour', 'Salut'],
        correct_answer: 0,
        explanation_fr: 'Merci signifie "thank you".',
        explanation_en: 'Merci means "thank you".',
        explanation_ru: 'Merci означает "спасибо".',
      },
      {
        question_fr: 'Comment dit-on "au revoir" en français ?',
        question_en: 'How do you say "goodbye" in French?',
        question_fr: 'Comment dit-on "au revoir" en français ?',
        options: ['Au revoir', 'Bonjour', 'Salut', 'Bonne nuit'],
        correct_answer: 0,
        explanation_fr: 'Au revoir = goodbye (formel).',
        explanation_en: 'Au revoir = goodbye (formal).',
        explanation_ru: 'Au revoir = до свидания (формально).',
      },
    ],
  },
};

async function createTest() {
  console.log('Testing French content creation...\n');

  for (const [themeKey, themeData] of Object.entries(frenchContent)) {
    const { data: theme, error: themeError } = await supabase
      .from('training_themes')
      .insert({
        lang: 'fr',
        level: 'beginner',
        key: themeKey,
        icon: themeData.icon,
        label_fr: themeData.label_fr,
        label_en: themeData.label_en,
        label_ru: themeData.label_ru,
        display_order: 0,
        is_active: true,
      })
      .select()
      .single();

    if (themeError) {
      console.error('Theme error:', themeError);
      continue;
    }

    console.log(`Theme created: ${theme.key} (ID: ${theme.id})`);

    const questionsToInsert = themeData.questions.map(q => ({
      theme_id: theme.id,
      type: 'mcq',
      question_fr: q.question_fr,
      question_en: q.question_en,
      question_ru: q.question_ru,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation_fr: q.explanation_fr,
      explanation_en: q.explanation_en,
      explanation_ru: q.explanation_ru,
      difficulty: 1,
      is_active: true,
    }));

    const { data: questions, error: qError } = await supabase
      .from('training_questions')
      .insert(questionsToInsert)
      .select();

    if (qError) {
      console.error('Questions error:', qError);
    } else {
      console.log(`Created ${questions.length} questions`);
      console.log('Sample question options:', questions[0].options);
    }
  }
}

createTest()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
