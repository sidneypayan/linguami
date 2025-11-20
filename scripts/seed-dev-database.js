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
  console.log('🌱 Starting database seeding...\n')

  try {
    // 1. Create test users via Supabase Auth
    console.log('👤 Creating test users...')

    // Admin user
    const { data: adminAuth, error: adminAuthError } = await supabase.auth.admin.createUser({
      email: 'admin@linguami.dev',
      password: 'admin123',
      email_confirm: true
    })

    let adminUserId
    if (adminAuthError) {
      console.log('⚠️  Admin user might already exist:', adminAuthError.message)
      // Get existing admin user
      const { data: existingAdmins } = await supabase.auth.admin.listUsers()
      const existingAdmin = existingAdmins?.users?.find(u => u.email === 'admin@linguami.dev')
      if (existingAdmin) {
        adminUserId = existingAdmin.id
      }
    } else {
      adminUserId = adminAuth.user.id
      console.log('✅ Admin user created:', adminAuth.user.id)
    }

    // Create/update admin profile (works for both new and existing users)
    if (adminUserId) {
      const { error: adminProfileError } = await supabase.from('users_profile').upsert({
        id: adminUserId,
        email: 'admin@linguami.dev',
        name: 'Admin Dev',
        role: 'admin',
        learning_language: 'fr',
        spoken_language: 'fr',
        language_level: 'beginner', // Match seeded materials level
        created_at: new Date().toISOString()
      })

      if (adminProfileError) {
        console.log('⚠️  Admin profile error:', adminProfileError.message)
      } else {
        console.log('✅ Admin profile created/updated')
      }
    }

    // Regular user
    const { data: userAuth, error: userAuthError } = await supabase.auth.admin.createUser({
      email: 'user@linguami.dev',
      password: 'user123',
      email_confirm: true
    })

    let testUserId
    if (userAuthError) {
      console.log('⚠️  Regular user might already exist:', userAuthError.message)
      // Get existing test user
      const { data: existingUsers } = await supabase.auth.admin.listUsers()
      const existingUser = existingUsers?.users?.find(u => u.email === 'user@linguami.dev')
      if (existingUser) {
        testUserId = existingUser.id
      }
    } else {
      testUserId = userAuth.user.id
      console.log('✅ Regular user created:', userAuth.user.id)
    }

    // Create/update user profile (works for both new and existing users)
    if (testUserId) {
      const { error: userProfileError } = await supabase.from('users_profile').upsert({
        id: testUserId,
        email: 'user@linguami.dev',
        name: 'Test User',
        role: 'user',
        learning_language: 'fr',
        spoken_language: 'en',
        language_level: 'beginner',
        created_at: new Date().toISOString()
      })

      if (userProfileError) {
        console.log('⚠️  User profile error:', userProfileError.message)
      } else {
        console.log('✅ User profile created/updated')
      }

      // Create XP profile for user
      const { error: xpProfileError } = await supabase.from('user_xp_profile').upsert({
        user_id: testUserId,
        total_xp: 150,
        current_level: 2,
        xp_in_current_level: 50,
        daily_streak: 3,
        longest_streak: 5,
        total_gold: 30
      })

      if (xpProfileError) {
        console.log('⚠️  XP profile error:', xpProfileError.message)
      } else {
        console.log('✅ User XP profile created/updated')
      }
    }

    // 2. Create XP rewards config
    console.log('\n⭐ Creating XP rewards config...')
    const { error: xpConfigError } = await supabase.from('xp_rewards_config').upsert([
      { action_type: 'exercise_mcq', xp_amount: 10, gold_amount: 2, description: 'Compléter un exercice MCQ' },
      { action_type: 'exercise_fill_in_blank', xp_amount: 15, gold_amount: 3, description: 'Compléter un exercice à trous' },
      { action_type: 'exercise_drag_and_drop', xp_amount: 20, gold_amount: 4, description: 'Compléter un exercice drag & drop' },
      { action_type: 'daily_login', xp_amount: 5, gold_amount: 1, description: 'Connexion quotidienne' },
      { action_type: 'lesson_complete', xp_amount: 50, gold_amount: 10, description: 'Compléter une leçon' }
    ])

    if (xpConfigError) {
      console.log('⚠️  XP config error:', xpConfigError.message)
    } else {
      console.log('✅ XP config created')
    }

    // 3. Create test materials (ONLY valid sections from app/data/materials.js)
    console.log('\n📚 Creating test materials...')
    const { data: materials, error: materialsError } = await supabase.from('materials').insert([
      {
        section: 'dialogues',
        title: 'Au restaurant - At the restaurant - В ресторане',
        content: 'Bonjour, une table pour deux personnes s\'il vous plaît.\nHello, a table for two please.\nЗдравствуйте, столик на двоих, пожалуйста.',
        lang: 'fr',
        level: 'beginner',
        image_filename: 'materials/restaurant.jpg',
        audio_filename: 'audio/fr/restaurant-dialogue.mp3'
      },
      {
        section: 'short-stories',
        title: 'Le petit chat perdu - The lost kitten - Потерянный котёнок',
        content: 'Il était une fois un petit chat qui s\'était perdu dans la ville. Le petit chat avait faim et froid. Mais une gentille famille l\'a trouvé et adopté. Maintenant il est heureux !\n\nOnce upon a time, there was a little cat who got lost in the city. The little cat was hungry and cold. But a kind family found him and adopted him. Now he is happy!\n\nЖил-был маленький котёнок, который потерялся в городе. Котёнок был голодным и замёрз. Но добрая семья нашла его и усыновила. Теперь он счастлив!',
        lang: 'fr',
        level: 'intermediate',
        image_filename: 'materials/lost-cat.jpg'
      },
      {
        section: 'culture',
        title: 'La Tour Eiffel - The Eiffel Tower - Эйфелева башня',
        content: 'Construite en 1889 pour l\'Exposition universelle, la Tour Eiffel mesure 324 mètres. C\'est le monument le plus visité au monde avec près de 7 millions de visiteurs par an.\n\nBuilt in 1889 for the World\'s Fair, the Eiffel Tower is 324 meters tall. It is the most visited monument in the world with nearly 7 million visitors per year.\n\nПостроенная в 1889 году для Всемирной выставки, Эйфелева башня имеет высоту 324 метра. Это самый посещаемый памятник в мире с почти 7 миллионами посетителей в год.',
        lang: 'fr',
        level: 'intermediate',
        image_filename: 'materials/eiffel-tower.jpg'
      },
      {
        section: 'podcasts',
        title: 'Apprendre le français - Learning French - Изучение французского',
        content: 'Bienvenue dans ce podcast pour apprendre le français ! Aujourd\'hui nous allons parler de la vie quotidienne en France.\n\nWelcome to this podcast for learning French! Today we will talk about daily life in France.\n\nДобро пожаловать в этот подкаст для изучения французского языка! Сегодня мы поговорим о повседневной жизни во Франции.',
        lang: 'fr',
        level: 'beginner',
        image_filename: 'materials/podcast.jpg',
        audio_filename: 'audio/fr/podcast-intro.mp3'
      },
      {
        section: 'beautiful-places',
        title: 'Les Alpes françaises - French Alps - Французские Альпы',
        content: 'Les Alpes françaises offrent des paysages magnifiques avec leurs sommets enneigés et leurs vallées verdoyantes. C\'est un paradis pour les skieurs en hiver et les randonneurs en été.\n\nThe French Alps offer magnificent landscapes with their snowy peaks and green valleys. It is a paradise for skiers in winter and hikers in summer.\n\nФранцузские Альпы предлагают великолепные пейзажи со снежными вершинами и зелёными долинами. Это рай для лыжников зимой и туристов летом.',
        lang: 'fr',
        level: 'intermediate',
        image_filename: 'materials/alps.jpg'
      }
    ]).select()

    if (materialsError) {
      console.log('⚠️  Materials error:', materialsError.message)
    } else {
      console.log(`✅ Created ${materials?.length || 0} materials`)
    }

    // 4. Create test exercises
    if (materials && materials.length > 0) {
      console.log('\n✍️  Creating test exercises...')
      const { data: exercises, error: exercisesError } = await supabase.from('exercises').insert([
        {
          material_id: materials[0].id,
          type: 'fill_in_blank',
          title: 'Les animaux - Vocabulaire',
          level: 'beginner',
          lang: 'fr',
          data: {
            questions: [
              {
                id: 1,
                text: 'Le ____ miaule.',
                blanks: [
                  {
                    position: 1,
                    correctAnswers: ['chat'],
                    hint: 'Animal qui miaule'
                  }
                ],
                explanation: 'Un chat est un animal domestique qui miaule.'
              }
            ]
          },
          xp_reward: 15
        },
        {
          material_id: materials[1].id,
          type: 'fill_in_blank',
          title: 'Le présent - Conjugaison',
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
              }
            ]
          },
          xp_reward: 15
        }
      ]).select()

      if (exercisesError) {
        console.log('⚠️  Exercises error:', exercisesError.message)
      } else {
        console.log(`✅ Created ${exercises?.length || 0} exercises`)
      }
    }

    // 5. Create test course structure
    console.log('\n🎓 Creating test course...')

    // Create course level
    const { data: level, error: levelError } = await supabase.from('course_levels').insert({
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
    }).select().single()

    if (levelError) {
      console.log('⚠️  Course level error:', levelError.message)
    } else {
      console.log('✅ Course level created')

      // Create course
      const { data: course, error: courseError } = await supabase.from('courses').insert({
        level_id: level.id,
        slug: 'se-presenter',
        title_fr: 'Se présenter',
        title_ru: 'Представиться',
        title_en: 'Introducing yourself',
        description_fr: 'Apprenez à vous présenter en français',
        description_ru: 'Научитесь представляться по-французски',
        description_en: 'Learn to introduce yourself in French',
        lang: 'fr',
        target_language: 'fr',
        order_index: 1,
        estimated_hours: 2,
        is_published: true
      }).select().single()

      if (courseError) {
        console.log('⚠️  Course error:', courseError.message)
      } else {
        console.log('✅ Course created')

        // Create course lesson (lessons are part of course_lessons table)
        const { data: courseLesson, error: courseLessonError } = await supabase.from('course_lessons').insert({
          course_id: course.id,
          slug: 'les-salutations',
          title_fr: 'Les salutations',
          title_ru: 'Приветствия',
          title_en: 'Greetings',
          order_index: 1,
          estimated_minutes: 30,
          is_published: true,
          objectives_fr: ['Apprendre les salutations de base', 'Dire bonjour et au revoir'],
          objectives_ru: ['Выучить основные приветствия', 'Сказать привет и до свидания'],
          blocks: [
            {
              type: 'dialogue',
              content: {
                lines: [
                  {
                    speaker: 'Marie',
                    text: 'Bonjour !',
                    translation: 'Hello!'
                  },
                  {
                    speaker: 'Pierre',
                    text: 'Bonjour, ça va ?',
                    translation: 'Hello, how are you?'
                  },
                  {
                    speaker: 'Marie',
                    text: 'Ça va bien, merci !',
                    translation: 'I\'m fine, thank you!'
                  }
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
        }).select().single()

        if (courseLessonError) {
          console.log('⚠️  Course lesson error:', courseLessonError.message)
        } else {
          console.log('✅ Course lesson created')
        }
      }
    }

    console.log('\n✨ Database seeding completed successfully!\n')
    console.log('📝 Test credentials:')
    console.log('   Admin: admin@linguami.dev / admin123')
    console.log('   User:  user@linguami.dev / user123')
    console.log('\n🚀 You can now start developing!')

  } catch (error) {
    console.error('\n❌ Error during seeding:', error.message)
    console.error(error)
  }
}

seedDatabase()
