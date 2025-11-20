const { createClient } = require('@supabase/supabase-js')

// Dev Supabase credentials
const supabaseUrl = 'https://capnpewksfdnllttnvzu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcG5wZXdrc2ZkbmxsdHRudnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU1MzUwMiwiZXhwIjoyMDc5MTI5NTAyfQ.iU3xNj5CO_RBtGCCNpXl5LeobwRf1VGxV17sOqKPtDY'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function seedDatabase() {
  console.log('🌱 Starting COMPLETE database seeding...\n')

  try {
    // =============================================================================
    // 1. USERS - 3 users with different levels
    // =============================================================================
    console.log('👤 Creating test users...')

    const users = [
      { email: 'admin@linguami.dev', password: 'admin123', name: 'Admin Dev', role: 'admin', level: 'beginner', learning: 'fr', spoken: 'fr' },
      { email: 'user@linguami.dev', password: 'user123', name: 'Test User', role: 'user', level: 'intermediate', learning: 'ru', spoken: 'en' },
      { email: 'advanced@linguami.dev', password: 'advanced123', name: 'Advanced User', role: 'user', level: 'advanced', learning: 'fr', spoken: 'ru' }
    ]

    const createdUserIds = {}

    for (const userInfo of users) {
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: userInfo.email,
        password: userInfo.password,
        email_confirm: true
      })

      let userId
      if (authError) {
        console.log(`⚠️  ${userInfo.email} might already exist`)
        const { data: existingUsers } = await supabase.auth.admin.listUsers()
        const existing = existingUsers?.users?.find(u => u.email === userInfo.email)
        if (existing) userId = existing.id
      } else {
        userId = authUser.user.id
        console.log(`✅ Created ${userInfo.email}`)
      }

      if (userId) {
        createdUserIds[userInfo.email] = userId

        await supabase.from('users_profile').upsert({
          id: userId,
          email: userInfo.email,
          name: userInfo.name,
          role: userInfo.role,
          learning_language: userInfo.learning,
          spoken_language: userInfo.spoken,
          language_level: userInfo.level,
          created_at: new Date().toISOString()
        })

        // Create XP profile for non-admin users
        if (userInfo.role !== 'admin') {
          await supabase.from('user_xp_profile').upsert({
            user_id: userId,
            total_xp: userInfo.level === 'intermediate' ? 250 : 1500,
            current_level: userInfo.level === 'intermediate' ? 3 : 8,
            xp_in_current_level: userInfo.level === 'intermediate' ? 50 : 200,
            daily_streak: userInfo.level === 'intermediate' ? 5 : 12,
            longest_streak: userInfo.level === 'intermediate' ? 8 : 20,
            total_gold: userInfo.level === 'intermediate' ? 45 : 180
          })
        }
      }
    }

    console.log('✅ All users created with profiles')

    // =============================================================================
    // 2. XP REWARDS CONFIG
    // =============================================================================
    console.log('\n⭐ Creating XP rewards config...')
    await supabase.from('xp_rewards_config').upsert([
      { action_type: 'exercise_mcq', xp_amount: 10, gold_amount: 2, description: 'Compléter un exercice MCQ' },
      { action_type: 'exercise_fill_in_blank', xp_amount: 15, gold_amount: 3, description: 'Compléter un exercice à trous' },
      { action_type: 'exercise_drag_and_drop', xp_amount: 20, gold_amount: 4, description: 'Compléter un exercice drag & drop' },
      { action_type: 'daily_login', xp_amount: 5, gold_amount: 1, description: 'Connexion quotidienne' },
      { action_type: 'lesson_complete', xp_amount: 50, gold_amount: 10, description: 'Compléter une leçon' },
      { action_type: 'material_completed', xp_amount: 25, gold_amount: 5, description: 'Compléter un matériau' }
    ])
    console.log('✅ XP config created')

    // =============================================================================
    // 3. MATERIALS - Comprehensive test data
    // =============================================================================
    console.log('\n📚 Creating comprehensive materials...')

    const materialsFr = [
      // Audio/Text sections - Using null to trigger fallback placeholder
      { section: 'dialogues', title: 'Au restaurant', content: 'Dialogue au restaurant...', level: 'beginner', audio: 'audio/fr/restaurant.mp3', image: null },
      { section: 'dialogues', title: 'À l\'aéroport', content: 'Dialogue à l\'aéroport...', level: 'intermediate', audio: 'audio/fr/airport.mp3', image: null },
      { section: 'culture', title: 'La Tour Eiffel', content: 'Histoire de la Tour Eiffel...', level: 'intermediate', audio: 'audio/fr/eiffel.mp3', image: null },
      { section: 'culture', title: 'Le Mont Saint-Michel', content: 'Le Mont Saint-Michel...', level: 'advanced', image: null },
      { section: 'short-stories', title: 'Le petit chat', content: 'Histoire du petit chat...', level: 'beginner', audio: 'audio/fr/cat.mp3', image: null },
      { section: 'short-stories', title: 'La boulangerie', content: 'Histoire de la boulangerie...', level: 'intermediate', image: null },
      { section: 'podcasts', title: 'Apprendre le français', content: 'Podcast d\'apprentissage...', level: 'beginner', audio: 'audio/fr/podcast-learn.mp3', image: null },
      { section: 'beautiful-places', title: 'Les Alpes françaises', content: 'Les Alpes françaises...', level: 'intermediate', image: null },
      { section: 'legends', title: 'Jeanne d\'Arc', content: 'Légende de Jeanne d\'Arc...', level: 'advanced', audio: 'audio/fr/jeanne.mp3', image: null },
      { section: 'slices-of-life', title: 'Un jour à Paris', content: 'Vie quotidienne à Paris...', level: 'intermediate', image: null },

      // Video sections
      { section: 'movie-trailers', title: 'Trailer - Amélie', content: 'Bande annonce du film Amélie', level: 'intermediate', video: 'https://youtube.com/watch?v=example1', image: null },
      { section: 'cartoons', title: 'Dessin animé - Astérix', content: 'Épisode d\'Astérix', level: 'beginner', video: 'https://youtube.com/watch?v=example2', image: null },
      { section: 'rock', title: 'Indochine - L\'Aventurier', content: 'Clip de L\'Aventurier', level: 'intermediate', video: 'https://youtube.com/watch?v=example3', image: null },
      { section: 'folk', title: 'Chanson traditionnelle', content: 'Chanson folk française', level: 'beginner', video: 'https://youtube.com/watch?v=example4', image: null }
    ]

    const materialsRu = [
      // Audio/Text sections - Using null to trigger fallback placeholder
      { section: 'dialogues', title: 'В ресторане', content: 'Диалог в ресторане...', level: 'beginner', audio: 'audio/ru/restaurant.mp3', image: null },
      { section: 'dialogues', title: 'В аэропорту', content: 'Диалог в аэропорту...', level: 'intermediate', audio: 'audio/ru/airport.mp3', image: null },
      { section: 'culture', title: 'Красная площадь', content: 'История Красной площади...', level: 'intermediate', audio: 'audio/ru/red-square.mp3', image: null },
      { section: 'culture', title: 'Эрмитаж', content: 'Музей Эрмитаж...', level: 'advanced', image: null },
      { section: 'short-stories', title: 'Маленький кот', content: 'История маленького кота...', level: 'beginner', audio: 'audio/ru/cat.mp3', image: null },
      { section: 'podcasts', title: 'Учим русский', content: 'Подкаст для изучения...', level: 'beginner', audio: 'audio/ru/podcast-learn.mp3', image: null },
      { section: 'beautiful-places', title: 'Озеро Байкал', content: 'Озеро Байкал...', level: 'intermediate', image: null },
      { section: 'beautiful-places', title: 'Карелия', content: 'Карелия и её природа...', level: 'advanced', audio: 'audio/ru/karelia.mp3', image: null },
      { section: 'legends', title: 'Илья Муромец', content: 'Легенда об Илье Муромце...', level: 'advanced', audio: 'audio/ru/ilya.mp3', image: null },
      { section: 'slices-of-life', title: 'День в Москве', content: 'Повседневная жизнь...', level: 'intermediate', image: null },

      // Video sections (including RU-specific)
      { section: 'eralash', title: 'Ералаш - Эпизод 1', content: 'Юмористический скетч', level: 'beginner', video: 'https://youtube.com/watch?v=example5', image: null },
      { section: 'galileo', title: 'Галилео - Наука', content: 'Научная передача', level: 'intermediate', video: 'https://youtube.com/watch?v=example6', image: null },
      { section: 'cartoons', title: 'Маша и Медведь', content: 'Épisode de dessin animé', level: 'beginner', video: 'https://youtube.com/watch?v=example7', image: null },
      { section: 'rock', title: 'Кино - Группа крови', content: 'Clip de Kino', level: 'intermediate', video: 'https://youtube.com/watch?v=example8', image: null }
    ]

    // Insert French materials
    const allMaterialsData = [
      ...materialsFr.map(m => ({
        section: m.section,
        title: m.title,
        content: m.content,
        lang: 'fr',
        level: m.level,
        image_filename: m.image,
        audio_filename: m.audio || null,
        video_url: m.video || null
      })),
      ...materialsRu.map(m => ({
        section: m.section,
        title: m.title,
        content: m.content,
        lang: 'ru',
        level: m.level,
        image_filename: m.image,
        audio_filename: m.audio || null,
        video_url: m.video || null
      }))
    ]

    const { data: materials, error: materialsError } = await supabase
      .from('materials')
      .insert(allMaterialsData)
      .select()

    if (materialsError) {
      console.log('⚠️  Materials error:', materialsError.message)
    } else {
      console.log(`✅ Created ${materials.length} materials (${materialsFr.length} FR + ${materialsRu.length} RU)`)
      console.log(`   - All levels: beginner, intermediate, advanced`)
      console.log(`   - All audio/text sections: dialogues, culture, short-stories, podcasts, beautiful-places, legends, slices-of-life`)
      console.log(`   - Video sections FR: movie-trailers, cartoons, rock, folk`)
      console.log(`   - Video sections RU: eralash, galileo, cartoons, rock`)
    }

    // =============================================================================
    // 4. USER MATERIALS STATUS - Test all filter conditions
    // =============================================================================
    if (materials && materials.length > 0) {
      console.log('\n📊 Creating user materials status...')

      const regularUserId = createdUserIds['user@linguami.dev']
      if (regularUserId) {
        // Get some RU materials for the regular user (who learns RU)
        const ruMaterials = materials.filter(m => m.lang === 'ru')

        const userMaterialsStatus = [
          // Being studied
          { user_id: regularUserId, material_id: ruMaterials[0]?.id, is_being_studied: true, is_studied: false },
          { user_id: regularUserId, material_id: ruMaterials[1]?.id, is_being_studied: true, is_studied: false },
          { user_id: regularUserId, material_id: ruMaterials[2]?.id, is_being_studied: true, is_studied: false },

          // Studied (completed)
          { user_id: regularUserId, material_id: ruMaterials[3]?.id, is_being_studied: false, is_studied: true },
          { user_id: regularUserId, material_id: ruMaterials[4]?.id, is_being_studied: false, is_studied: true }

          // Some materials will have no status (for "not_studied" filter)
        ].filter(m => m.material_id) // Remove any undefined

        await supabase.from('user_materials').insert(userMaterialsStatus)
        console.log(`✅ Created ${userMaterialsStatus.length} user material statuses`)
        console.log(`   - 3 being studied`)
        console.log(`   - 2 completed`)
        console.log(`   - ${ruMaterials.length - 5} not studied (for filter testing)`)
      }
    }

    // =============================================================================
    // 5. EXERCISES - All 3 types
    // =============================================================================
    if (materials && materials.length > 0) {
      console.log('\n✍️  Creating exercises (MCQ, Fill-in-blank, Drag-and-drop)...')

      const frMaterials = materials.filter(m => m.lang === 'fr')
      const ruMaterials = materials.filter(m => m.lang === 'ru')

      const exercises = [
        // MCQ - French
        {
          material_id: frMaterials[0]?.id,
          type: 'mcq',
          title: 'Vocabulaire restaurant - MCQ',
          level: 'beginner',
          lang: 'fr',
          data: {
            questions: [
              {
                id: 1,
                question: 'Comment dit-on "menu" en français ?',
                options: ['La carte', 'Le menu', 'La liste', 'Le papier'],
                correctAnswer: 1,
                explanation: 'On dit "le menu" ou "la carte" en français.'
              },
              {
                id: 2,
                question: 'Que signifie "addition" ?',
                options: ['Menu', 'Serveur', 'Note à payer', 'Table'],
                correctAnswer: 2,
                explanation: 'L\'addition est la note à payer au restaurant.'
              }
            ]
          },
          xp_reward: 10
        },

        // Fill in blank - French
        {
          material_id: frMaterials[1]?.id,
          type: 'fill_in_blank',
          title: 'Conjugaison présent - Fill in blank',
          level: 'beginner',
          lang: 'fr',
          data: {
            questions: [
              {
                id: 1,
                text: 'Je ____ français.',
                blanks: [
                  {
                    position: 1,
                    correctAnswers: ['parle'],
                    hint: 'Verbe parler, 1ère personne'
                  }
                ],
                explanation: 'Je parle : verbe parler conjugué au présent.'
              },
              {
                id: 2,
                text: 'Tu ____ en France.',
                blanks: [
                  {
                    position: 1,
                    correctAnswers: ['habites', 'vis'],
                    hint: 'Verbe habiter ou vivre'
                  }
                ],
                explanation: 'Tu habites ou tu vis : 2ème personne du singulier.'
              }
            ]
          },
          xp_reward: 15
        },

        // Drag and drop - French
        {
          material_id: frMaterials[2]?.id,
          type: 'drag_and_drop',
          title: 'Monuments français - Drag & Drop',
          level: 'intermediate',
          lang: 'fr',
          data: {
            pairs: [
              { id: 1, left: 'Tour Eiffel', right: 'Paris' },
              { id: 2, left: 'Notre-Dame', right: 'Paris' },
              { id: 3, left: 'Mont Saint-Michel', right: 'Normandie' },
              { id: 4, left: 'Château de Versailles', right: 'Versailles' }
            ],
            instructions: 'Associez chaque monument à sa ville/région'
          },
          xp_reward: 20
        },

        // MCQ - Russian
        {
          material_id: ruMaterials[0]?.id,
          type: 'mcq',
          title: 'Vocabulaire restaurant - MCQ (RU)',
          level: 'beginner',
          lang: 'ru',
          data: {
            questions: [
              {
                id: 1,
                question: 'Как сказать "меню" по-русски?',
                options: ['Меню', 'Список', 'Карта', 'Бумага'],
                correctAnswer: 0,
                explanation: 'По-русски говорят "меню".'
              }
            ]
          },
          xp_reward: 10
        },

        // Fill in blank - Russian
        {
          material_id: ruMaterials[1]?.id,
          type: 'fill_in_blank',
          title: 'Глаголы настоящее время - Fill in blank (RU)',
          level: 'beginner',
          lang: 'ru',
          data: {
            questions: [
              {
                id: 1,
                text: 'Я ____ по-русски.',
                blanks: [
                  {
                    position: 1,
                    correctAnswers: ['говорю'],
                    hint: 'Глагол говорить, 1-е лицо'
                  }
                ],
                explanation: 'Я говорю : глагол говорить в настоящем времени.'
              }
            ]
          },
          xp_reward: 15
        },

        // Drag and drop - Russian
        {
          material_id: ruMaterials[2]?.id,
          type: 'drag_and_drop',
          title: 'Города России - Drag & Drop (RU)',
          level: 'intermediate',
          lang: 'ru',
          data: {
            pairs: [
              { id: 1, left: 'Красная площадь', right: 'Москва' },
              { id: 2, left: 'Эрмитаж', right: 'Санкт-Петербург' },
              { id: 3, left: 'Байкал', right: 'Сибирь' }
            ],
            instructions: 'Сопоставьте каждое место с городом/регионом'
          },
          xp_reward: 20
        }
      ].filter(e => e.material_id) // Remove any undefined

      const { data: createdExercises, error: exercisesError } = await supabase
        .from('exercises')
        .insert(exercises)
        .select()

      if (exercisesError) {
        console.log('⚠️  Exercises error:', exercisesError.message)
      } else {
        console.log(`✅ Created ${createdExercises.length} exercises`)
        console.log(`   - MCQ: 2 (FR + RU)`)
        console.log(`   - Fill in blank: 2 (FR + RU)`)
        console.log(`   - Drag and drop: 2 (FR + RU)`)
      }
    }

    // =============================================================================
    // 6. COURSE STRUCTURE - Full course with lessons
    // =============================================================================
    console.log('\n🎓 Creating course structure...')

    // Create course levels
    const levels = [
      {
        slug: 'a1-debutant',
        name_fr: 'A1 - Débutant',
        name_ru: 'A1 - Начальный',
        name_en: 'A1 - Beginner',
        description_fr: 'Niveau débutant complet',
        description_ru: 'Начальный уровень',
        description_en: 'Complete beginner level',
        order_index: 1,
        is_free: true,
        price_eur: 0.00
      },
      {
        slug: 'a2-elementaire',
        name_fr: 'A2 - Élémentaire',
        name_ru: 'A2 - Элементарный',
        name_en: 'A2 - Elementary',
        description_fr: 'Niveau élémentaire',
        description_ru: 'Элементарный уровень',
        description_en: 'Elementary level',
        order_index: 2,
        is_free: false,
        price_eur: 29.99
      }
    ]

    const { data: createdLevels } = await supabase.from('course_levels').insert(levels).select()
    console.log(`✅ Created ${createdLevels.length} course levels (A1 free, A2 premium)`)

    // Create courses for each level
    if (createdLevels && createdLevels.length > 0) {
      const courses = [
        // A1 courses
        {
          level_id: createdLevels[0].id,
          slug: 'se-presenter',
          title_fr: 'Se présenter',
          title_ru: 'Представиться',
          title_en: 'Introducing yourself',
          description_fr: 'Apprenez à vous présenter',
          description_ru: 'Научитесь представляться',
          description_en: 'Learn to introduce yourself',
          lang: 'fr',
          target_language: 'fr',
          order_index: 1,
          estimated_hours: 2,
          is_published: true
        },
        {
          level_id: createdLevels[0].id,
          slug: 'les-nombres',
          title_fr: 'Les nombres',
          title_ru: 'Числа',
          title_en: 'Numbers',
          description_fr: 'Apprenez les nombres en français',
          description_ru: 'Изучите французские числа',
          description_en: 'Learn French numbers',
          lang: 'fr',
          target_language: 'fr',
          order_index: 2,
          estimated_hours: 2,
          is_published: true
        },
        // A2 course
        {
          level_id: createdLevels[1].id,
          slug: 'passe-compose',
          title_fr: 'Le passé composé',
          title_ru: 'Прошедшее время',
          title_en: 'Past tense',
          description_fr: 'Maîtrisez le passé composé',
          description_ru: 'Освойте прошедшее время',
          description_en: 'Master the past tense',
          lang: 'fr',
          target_language: 'fr',
          order_index: 1,
          estimated_hours: 3,
          is_published: true
        }
      ]

      const { data: createdCourses, error: coursesError } = await supabase.from('courses').insert(courses).select()

      if (coursesError) {
        console.log('⚠️  Courses error:', coursesError.message)
      } else {
        console.log(`✅ Created ${createdCourses?.length || 0} courses`)
      }

      // Create lessons for first course
      if (createdCourses && createdCourses.length > 0) {
        const lessons = [
          {
            course_id: createdCourses[0].id,
            slug: 'les-salutations',
            title_fr: 'Les salutations',
            title_ru: 'Приветствия',
            title_en: 'Greetings',
            order_index: 1,
            estimated_minutes: 30,
            is_published: true,
            objectives_fr: ['Apprendre les salutations de base', 'Dire bonjour et au revoir'],
            objectives_ru: ['Выучить основные приветствия', 'Сказать привет и до свидания'],
            objectives_en: ['Learn basic greetings', 'Say hello and goodbye'],
            blocks: [
              {
                type: 'dialogue',
                content: {
                  lines: [
                    { speaker: 'Marie', text: 'Bonjour !', translation: 'Hello!' },
                    { speaker: 'Pierre', text: 'Bonjour, ça va ?', translation: 'Hello, how are you?' },
                    { speaker: 'Marie', text: 'Ça va bien, merci !', translation: 'I\'m fine, thank you!' }
                  ]
                }
              },
              {
                type: 'vocabulary',
                content: {
                  words: [
                    { word: 'Bonjour', translation: 'Hello', example: 'Bonjour Marie !' },
                    { word: 'Au revoir', translation: 'Goodbye', example: 'Au revoir Pierre !' },
                    { word: 'Ça va ?', translation: 'How are you?', example: 'Bonjour, ça va ?' }
                  ]
                }
              }
            ]
          },
          {
            course_id: createdCourses[0].id,
            slug: 'se-presenter',
            title_fr: 'Se présenter',
            title_ru: 'Представиться',
            title_en: 'Introduce yourself',
            order_index: 2,
            estimated_minutes: 45,
            is_published: true,
            objectives_fr: ['Dire son nom', 'Dire son âge', 'Dire sa nationalité'],
            objectives_ru: ['Назвать своё имя', 'Назвать свой возраст', 'Назвать свою национальность'],
            objectives_en: ['Say your name', 'Say your age', 'Say your nationality'],
            blocks: [
              {
                type: 'dialogue',
                content: {
                  lines: [
                    { speaker: 'Marie', text: 'Je m\'appelle Marie.', translation: 'My name is Marie.' },
                    { speaker: 'Pierre', text: 'Enchanté ! Moi, c\'est Pierre.', translation: 'Nice to meet you! I\'m Pierre.' }
                  ]
                }
              }
            ]
          }
        ]

        await supabase.from('course_lessons').insert(lessons)
        console.log(`✅ Created ${lessons.length} lessons for first course`)
      }
    }

    // =============================================================================
    // 7. XP HISTORY - For realistic testing
    // =============================================================================
    const regularUserId = createdUserIds['user@linguami.dev']
    if (regularUserId) {
      console.log('\n🎯 Creating XP history...')

      const now = new Date()
      const xpHistory = [
        { user_id: regularUserId, action_type: 'daily_login', xp_earned: 5, gold_earned: 1, created_at: new Date(now - 1000 * 60 * 60 * 24).toISOString() },
        { user_id: regularUserId, action_type: 'exercise_mcq', xp_earned: 10, gold_earned: 2, created_at: new Date(now - 1000 * 60 * 60 * 20).toISOString() },
        { user_id: regularUserId, action_type: 'exercise_fill_in_blank', xp_earned: 15, gold_earned: 3, created_at: new Date(now - 1000 * 60 * 60 * 18).toISOString() },
        { user_id: regularUserId, action_type: 'material_completed', xp_earned: 25, gold_earned: 5, created_at: new Date(now - 1000 * 60 * 60 * 12).toISOString() },
        { user_id: regularUserId, action_type: 'lesson_complete', xp_earned: 50, gold_earned: 10, created_at: new Date(now - 1000 * 60 * 60 * 2).toISOString() }
      ]

      const { error: xpHistoryError } = await supabase.from('user_xp_history').insert(xpHistory)

      if (xpHistoryError) {
        console.log(`⚠️  XP history error: ${xpHistoryError.message}`)
      } else {
        console.log(`✅ Created ${xpHistory.length} XP history entries`)
      }
    }

    console.log('\n✨ Complete database seeding finished!\n')
    console.log('📝 Test credentials:')
    console.log('   Admin (FR, beginner):     admin@linguami.dev / admin123')
    console.log('   User (RU, intermediate):  user@linguami.dev / user123')
    console.log('   Advanced (FR, advanced):  advanced@linguami.dev / advanced123')
    console.log('\n📊 What was created:')
    console.log('   ✅ 3 users with different levels and learning languages')
    console.log('   ✅ 28 materials (14 FR + 14 RU) covering all sections and levels')
    console.log('   ✅ User materials status (being studied, completed, not studied)')
    console.log('   ✅ 6 exercises (MCQ, Fill-in-blank, Drag-and-drop) in FR + RU')
    console.log('   ✅ Course structure with 2 levels, 3 courses, 2 lessons')
    console.log('   ✅ XP config and history')
    console.log('\n🚀 All code paths are now testable!')

  } catch (error) {
    console.error('\n❌ Error during seeding:', error.message)
    console.error(error)
  }
}

seedDatabase()
