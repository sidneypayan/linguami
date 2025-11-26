const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.production' });

// Use production credentials
const supabase = createClient(
  'https://psomseputtsdizmmqugy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzb21zZXB1dHRzZGl6bW1xdWd5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTk0NTkzOSwiZXhwIjoyMDU1NTIxOTM5fQ.4fCtRWcobxYPt2_egoqGyD9u82G_LdgIOfi8u28VvSs'
);

// =========================================
// LESSON: Bonjour ! - Saluer et prendre conge
// COURSE: Français (course_id: 9, target_language: fr, level: A1)
// =========================================

// This lesson teaches basic French greetings and farewells
// Target language: French (what students are learning)
// Content: dialogue text in FRENCH, translations in spoken language

// ===========================================
// BLOCKS FOR FRENCH SPEAKERS (blocks_fr)
// Note: This is for French speakers learning French - used mainly for reference
// Translations remain in French
// ===========================================
const blocks_fr = [
  // 1. DIALOGUE - Situation: First meeting at a cafe
  {
    type: "dialogue",
    title: "Premiere rencontre au cafe",
    lines: [
      {
        speaker: "Sophie",
        speakerGender: "female",
        text: "Bonjour !",
        audioUrl: null,
        vocab: [
          { word: "Bonjour", translation: "Salutation formelle (matin/apres-midi)" }
        ]
      },
      {
        speaker: "Thomas",
        speakerGender: "male",
        text: "Bonjour ! Comment allez-vous ?",
        audioUrl: null,
        vocab: [
          { word: "Comment allez-vous ?", translation: "Question formelle sur l'etat de sante" }
        ]
      },
      {
        speaker: "Sophie",
        speakerGender: "female",
        text: "Je vais bien, merci. Et vous ?",
        audioUrl: null,
        vocab: [
          { word: "Je vais bien", translation: "Reponse positive" },
          { word: "merci", translation: "Expression de gratitude" }
        ]
      },
      {
        speaker: "Thomas",
        speakerGender: "male",
        text: "Tres bien, merci ! Je m'appelle Thomas.",
        audioUrl: null,
        vocab: [
          { word: "Tres bien", translation: "Reponse tres positive" },
          { word: "Je m'appelle", translation: "Formule de presentation" }
        ]
      },
      {
        speaker: "Sophie",
        speakerGender: "female",
        text: "Enchantee, Thomas ! Moi, c'est Sophie.",
        audioUrl: null,
        vocab: [
          { word: "Enchantee", translation: "Expression de politesse (feminin)" },
          { word: "Moi, c'est", translation: "Facon informelle de se presenter" }
        ]
      },
      {
        speaker: "Thomas",
        speakerGender: "male",
        text: "Enchante, Sophie ! Bonne journee !",
        audioUrl: null,
        vocab: [
          { word: "Enchante", translation: "Expression de politesse (masculin)" },
          { word: "Bonne journee", translation: "Souhait de bonne journee" }
        ]
      },
      {
        speaker: "Sophie",
        speakerGender: "female",
        text: "Merci, a vous aussi ! Au revoir !",
        audioUrl: null,
        vocab: [
          { word: "a vous aussi", translation: "Retourner le souhait (formel)" },
          { word: "Au revoir", translation: "Formule d'adieu" }
        ]
      }
    ],
    vocabulary: [
      { word: "Bonjour", translation: "Salutation du jour", category: "greetings" },
      { word: "Au revoir", translation: "Adieu", category: "greetings" },
      { word: "Merci", translation: "Expression de gratitude", category: "politeness" }
    ]
  },

  // 2. VOCABULARY - Greetings
  {
    type: "vocabulary",
    title: "Les salutations",
    icon: "book",
    category: "salutations",
    words: [
      {
        word: "Bonjour",
        translation: "Salutation formelle (matin/apres-midi)",
        pronunciation: "/bɔ̃.ʒuʁ/",
        example: "Bonjour, madame !",
        exampleTranslation: "Bonjour a une femme (formel)"
      },
      {
        word: "Bonsoir",
        translation: "Salutation du soir (apres 18h)",
        pronunciation: "/bɔ̃.swaʁ/",
        example: "Bonsoir, monsieur !",
        exampleTranslation: "Bonsoir a un homme (formel)"
      },
      {
        word: "Salut",
        translation: "Salutation informelle (entre amis)",
        pronunciation: "/sa.ly/",
        example: "Salut ! Ca va ?",
        exampleTranslation: "Salutation decontractee entre amis"
      },
      {
        word: "Coucou",
        translation: "Salutation tres informelle (familier)",
        pronunciation: "/ku.ku/",
        example: "Coucou, c'est moi !",
        exampleTranslation: "Salutation affectueuse (famille, amis proches)"
      }
    ]
  },

  // 3. GRAMMAR - Formal vs informal greetings
  {
    type: "grammar",
    title: "Formel vs Informel",
    icon: "book",
    explanation: "En francais, il existe deux registres de langue : **formel** (vous) et **informel** (tu). Le choix depend de la relation avec l'interlocuteur et du contexte.",
    examples: [
      {
        sentence: "Comment allez-vous ?",
        translation: "Question formelle",
        note: "Utilisez 'vous' avec des inconnus, des superieurs, des personnes agees",
        audioUrl: null
      },
      {
        sentence: "Comment vas-tu ?",
        translation: "Question informelle",
        note: "Utilisez 'tu' avec des amis, la famille, les enfants",
        audioUrl: null
      },
      {
        sentence: "Ca va ?",
        translation: "Question tres informelle",
        note: "Version raccourcie, tres courante entre amis",
        audioUrl: null
      }
    ],
    table: {
      title: "Formel vs Informel",
      headers: ["Situation", "Formel (vous)", "Informel (tu)"],
      rows: [
        ["Saluer", "Bonjour", "Salut / Coucou"],
        ["Demander des nouvelles", "Comment allez-vous ?", "Ca va ? / Comment tu vas ?"],
        ["Repondre", "Je vais bien, merci", "Ca va / Ca va bien"],
        ["Prendre conge", "Au revoir", "Salut / A plus / Ciao"]
      ],
      rowsAudio: []
    }
  },

  // 4. EXERCISE - Choose formal or informal
  {
    type: "exerciseInline",
    title: "Formel ou informel ?",
    icon: "edit",
    exerciseType: "fillInBlank",
    xpReward: 10,
    questions: [
      {
        question: "A votre professeur : ____. (Salut/Bonjour)",
        answer: "Bonjour",
        acceptableAnswers: ["Bonjour", "bonjour"],
        hint: "Contexte formel (professeur)"
      },
      {
        question: "A votre ami(e) : ____. (Salut/Bonjour)",
        answer: "Salut",
        acceptableAnswers: ["Salut", "salut"],
        hint: "Contexte informel (ami)"
      },
      {
        question: "Comment ____ ? (allez-vous/vas-tu) - a un inconnu",
        answer: "allez-vous",
        acceptableAnswers: ["allez-vous", "allez vous"],
        hint: "Vouvoiement pour un inconnu"
      }
    ]
  },

  // 5. CULTURE - The French "bise"
  {
    type: "culture",
    title: "La bise francaise",
    icon: "globe",
    content: "En France, on se fait souvent la bise (un ou plusieurs bisous sur les joues) pour se saluer. Le nombre de bises varie selon les regions : 2 a Paris, 3 dans le Sud, parfois 4 ailleurs ! Entre collegues, on serre plutot la main.",
    keyPoints: [
      "La bise est courante entre amis et en famille",
      "Le nombre de bises varie selon les regions (1 a 4)",
      "En contexte professionnel, on prefere serrer la main",
      "On ne fait pas la bise aux inconnus",
      "Depuis le Covid, certains Francais ne font plus la bise"
    ],
    comparison: {
      fr: "France : bise entre proches, poignee de main en contexte formel",
      other: "Dans d'autres pays : serrer la main est plus courant"
    }
  },

  // 6. VOCABULARY - Farewells
  {
    type: "vocabulary",
    title: "Prendre conge",
    icon: "book",
    category: "farewells",
    words: [
      {
        word: "Au revoir",
        translation: "Formule d'adieu standard",
        pronunciation: "/o.ʁə.vwaʁ/",
        example: "Au revoir et a bientot !",
        exampleTranslation: "Adieu formel avec souhait de se revoir"
      },
      {
        word: "A bientot",
        translation: "A bientot (quand on va se revoir)",
        pronunciation: "/a.bjɛ̃.to/",
        example: "A bientot, j'espere !",
        exampleTranslation: "Expression d'espoir de se revoir"
      },
      {
        word: "A demain",
        translation: "Quand on se revoit le lendemain",
        pronunciation: "/a.də.mɛ̃/",
        example: "A demain au bureau !",
        exampleTranslation: "Quand on se retrouve le jour suivant"
      },
      {
        word: "Bonne journee",
        translation: "Souhait pour la journee",
        pronunciation: "/bɔn.ʒuʁ.ne/",
        example: "Bonne journee a tous !",
        exampleTranslation: "Souhait collectif"
      },
      {
        word: "Bonne soiree",
        translation: "Souhait pour la soiree",
        pronunciation: "/bɔn.swa.ʁe/",
        example: "Bonne soiree !",
        exampleTranslation: "Souhait le soir"
      },
      {
        word: "Bonne nuit",
        translation: "Avant d'aller dormir",
        pronunciation: "/bɔn.nɥi/",
        example: "Bonne nuit, fais de beaux reves !",
        exampleTranslation: "Souhait avant le coucher"
      }
    ]
  },

  // 7. TIP - Pronunciation
  {
    type: "tip",
    title: "Astuce de prononciation",
    icon: "lightbulb",
    color: "info",
    content: "Le 'r' francais est guttural (au fond de la gorge), pas roule comme en espagnol ou italien. Pour le pratiquer, essayez de faire un gargarisme leger ! Dans 'Bonjour', le 'r' final est a peine prononce."
  },

  // 8. GRAMMAR - "Je m'appelle" construction
  {
    type: "grammar",
    title: "Se presenter : Je m'appelle",
    icon: "book",
    explanation: "Pour se presenter en francais, on utilise **\"Je m'appelle\"** suivi de son prenom. C'est un verbe pronominal (s'appeler). Une alternative informelle est **\"Moi, c'est...\"**",
    examples: [
      {
        sentence: "Je m'appelle Marie.",
        translation: "Presentation formelle",
        note: "Forme standard et polie",
        audioUrl: null
      },
      {
        sentence: "Moi, c'est Pierre.",
        translation: "Presentation informelle",
        note: "Plus decontracte, entre amis",
        audioUrl: null
      },
      {
        sentence: "Je suis Sophie.",
        translation: "Alternative directe",
        note: "Simple et direct",
        audioUrl: null
      }
    ],
    table: {
      title: "Le verbe S'APPELER au present",
      headers: ["Pronom", "Conjugaison", "Exemple"],
      rows: [
        ["Je", "m'appelle", "Je m'appelle Thomas"],
        ["Tu", "t'appelles", "Comment tu t'appelles ?"],
        ["Il/Elle", "s'appelle", "Elle s'appelle Sophie"],
        ["Nous", "nous appelons", "Nous nous appelons les Dupont"],
        ["Vous", "vous appelez", "Comment vous appelez-vous ?"],
        ["Ils/Elles", "s'appellent", "Ils s'appellent Pierre et Marie"]
      ],
      rowsAudio: []
    }
  },

  // 9. EXERCISE - Complete presentations
  {
    type: "exerciseInline",
    title: "Completez les presentations",
    icon: "edit",
    exerciseType: "fillInBlank",
    xpReward: 10,
    questions: [
      {
        question: "Bonjour ! Je ____ Marie. (m'appelle/t'appelles)",
        answer: "m'appelle",
        acceptableAnswers: ["m'appelle", "m appelle"],
        hint: "Premiere personne du singulier"
      },
      {
        question: "Comment tu ____ ? (m'appelle/t'appelles)",
        answer: "t'appelles",
        acceptableAnswers: ["t'appelles", "t appelles"],
        hint: "Deuxieme personne du singulier"
      },
      {
        question: "____, c'est Thomas. (Moi/Toi)",
        answer: "Moi",
        acceptableAnswers: ["Moi", "moi"],
        hint: "Presentation informelle de soi-meme"
      },
      {
        question: "Elle ____ Sophie. (m'appelle/s'appelle)",
        answer: "s'appelle",
        acceptableAnswers: ["s'appelle", "s appelle"],
        hint: "Troisieme personne du singulier"
      }
    ]
  },

  // 10. CONVERSATION - Practice at a party
  {
    type: "conversation",
    title: "A une soiree",
    context: "Vous etes a une fete et vous rencontrez quelqu'un pour la premiere fois.",
    dialogue: [
      { speaker: "Vous", text: "Bonsoir !" },
      { speaker: "Inconnu(e)", text: "Bonsoir ! Je m'appelle Claire. Et vous ?" },
      { speaker: "Vous", text: "(Presentez-vous)" },
      { speaker: "Inconnu(e)", text: "Enchantee ! Vous connaissez l'hote ?" },
      { speaker: "Vous", text: "(Repondez)" }
    ],
    questions: [
      {
        question: "Quelle salutation est appropriee le soir ?",
        answer: "Bonsoir"
      },
      {
        question: "Comment l'inconnu(e) se presente ?",
        answer: "Je m'appelle Claire"
      }
    ]
  },

  // 11. TIP - Common mistakes
  {
    type: "tip",
    title: "Erreurs courantes a eviter",
    icon: "lightbulb",
    color: "warning",
    content: "**Attention aux faux amis !** Ne confondez pas \"Bonsoir\" (salutation du soir) avec \"Bonne soiree\" (souhait en partant). On dit \"Bonsoir\" en arrivant et \"Bonne soiree\" en partant. De meme, \"Bonjour\" s'utilise en arrivant, \"Bonne journee\" en partant."
  },

  // 12. SUMMARY - Key phrases
  {
    type: "summary",
    title: "Expressions a retenir",
    icon: "check",
    keyPhrases: [
      { fr: "Bonjour !", context: "Salutation formelle (jour)" },
      { fr: "Bonsoir !", context: "Salutation formelle (soir)" },
      { fr: "Salut !", context: "Salutation informelle" },
      { fr: "Comment allez-vous ?", context: "Demander des nouvelles (formel)" },
      { fr: "Ca va ?", context: "Demander des nouvelles (informel)" },
      { fr: "Je m'appelle...", context: "Se presenter" },
      { fr: "Enchante(e) !", context: "Reponse a une presentation" },
      { fr: "Au revoir !", context: "Prendre conge (formel)" },
      { fr: "A bientot !", context: "Prendre conge (amical)" },
      { fr: "Bonne journee / Bonne soiree !", context: "Souhait en partant" }
    ]
  }
];

// ===========================================
// BLOCKS FOR ENGLISH SPEAKERS (blocks_en)
// Translations and explanations in English
// ===========================================
const blocks_en = [
  // 1. DIALOGUE
  {
    type: "dialogue",
    title: "First meeting at a cafe",
    lines: [
      {
        speaker: "Sophie",
        speakerGender: "female",
        text: "Bonjour !",
        audioUrl: null,
        vocab: [
          { word: "Bonjour", translation: "Hello / Good morning (formal)" }
        ]
      },
      {
        speaker: "Thomas",
        speakerGender: "male",
        text: "Bonjour ! Comment allez-vous ?",
        audioUrl: null,
        vocab: [
          { word: "Comment allez-vous ?", translation: "How are you? (formal)" }
        ]
      },
      {
        speaker: "Sophie",
        speakerGender: "female",
        text: "Je vais bien, merci. Et vous ?",
        audioUrl: null,
        vocab: [
          { word: "Je vais bien", translation: "I'm fine / I'm doing well" },
          { word: "merci", translation: "thank you" },
          { word: "Et vous ?", translation: "And you? (formal)" }
        ]
      },
      {
        speaker: "Thomas",
        speakerGender: "male",
        text: "Tres bien, merci ! Je m'appelle Thomas.",
        audioUrl: null,
        vocab: [
          { word: "Tres bien", translation: "Very well" },
          { word: "Je m'appelle", translation: "My name is (lit: I call myself)" }
        ]
      },
      {
        speaker: "Sophie",
        speakerGender: "female",
        text: "Enchantee, Thomas ! Moi, c'est Sophie.",
        audioUrl: null,
        vocab: [
          { word: "Enchantee", translation: "Nice to meet you (said by a woman)" },
          { word: "Moi, c'est", translation: "I'm... (informal way to introduce oneself)" }
        ]
      },
      {
        speaker: "Thomas",
        speakerGender: "male",
        text: "Enchante, Sophie ! Bonne journee !",
        audioUrl: null,
        vocab: [
          { word: "Enchante", translation: "Nice to meet you (said by a man)" },
          { word: "Bonne journee", translation: "Have a nice day" }
        ]
      },
      {
        speaker: "Sophie",
        speakerGender: "female",
        text: "Merci, a vous aussi ! Au revoir !",
        audioUrl: null,
        vocab: [
          { word: "a vous aussi", translation: "to you too (formal)" },
          { word: "Au revoir", translation: "Goodbye" }
        ]
      }
    ],
    vocabulary: [
      { word: "Bonjour", translation: "Hello / Good day", category: "greetings" },
      { word: "Au revoir", translation: "Goodbye", category: "greetings" },
      { word: "Merci", translation: "Thank you", category: "politeness" }
    ]
  },

  // 2. VOCABULARY - Greetings
  {
    type: "vocabulary",
    title: "Greetings",
    icon: "book",
    category: "greetings",
    words: [
      {
        word: "Bonjour",
        translation: "Hello / Good morning (formal, used until evening)",
        pronunciation: "/bɔ̃.ʒuʁ/",
        example: "Bonjour, madame !",
        exampleTranslation: "Hello, ma'am! (formal)"
      },
      {
        word: "Bonsoir",
        translation: "Good evening (used after 6 PM)",
        pronunciation: "/bɔ̃.swaʁ/",
        example: "Bonsoir, monsieur !",
        exampleTranslation: "Good evening, sir! (formal)"
      },
      {
        word: "Salut",
        translation: "Hi / Hey (informal, between friends)",
        pronunciation: "/sa.ly/",
        example: "Salut ! Ca va ?",
        exampleTranslation: "Hey! How's it going?"
      },
      {
        word: "Coucou",
        translation: "Hey there (very informal, familiar)",
        pronunciation: "/ku.ku/",
        example: "Coucou, c'est moi !",
        exampleTranslation: "Hey, it's me! (family, close friends)"
      }
    ]
  },

  // 3. GRAMMAR - Formal vs informal
  {
    type: "grammar",
    title: "Formal vs Informal",
    icon: "book",
    explanation: "French has two registers: **formal** (using 'vous') and **informal** (using 'tu'). The choice depends on your relationship with the person and the context. Using 'vous' shows respect and politeness.",
    examples: [
      {
        sentence: "Comment allez-vous ?",
        translation: "How are you? (formal)",
        note: "Use 'vous' with strangers, superiors, elderly people",
        audioUrl: null
      },
      {
        sentence: "Comment vas-tu ?",
        translation: "How are you? (informal)",
        note: "Use 'tu' with friends, family, children",
        audioUrl: null
      },
      {
        sentence: "Ca va ?",
        translation: "How's it going? (very informal)",
        note: "Shortened version, very common among friends",
        audioUrl: null
      }
    ],
    table: {
      title: "Formal vs Informal",
      headers: ["Situation", "Formal (vous)", "Informal (tu)"],
      rows: [
        ["Greeting", "Bonjour", "Salut / Coucou"],
        ["How are you?", "Comment allez-vous ?", "Ca va ? / Comment tu vas ?"],
        ["Responding", "Je vais bien, merci", "Ca va / Ca va bien"],
        ["Saying goodbye", "Au revoir", "Salut / A plus / Ciao"]
      ],
      rowsAudio: []
    }
  },

  // 4. EXERCISE - Formal or informal
  {
    type: "exerciseInline",
    title: "Formal or informal?",
    icon: "edit",
    exerciseType: "fillInBlank",
    xpReward: 10,
    questions: [
      {
        question: "To your teacher: ____. (Salut/Bonjour)",
        answer: "Bonjour",
        acceptableAnswers: ["Bonjour", "bonjour"],
        hint: "Formal context (teacher)"
      },
      {
        question: "To your friend: ____. (Salut/Bonjour)",
        answer: "Salut",
        acceptableAnswers: ["Salut", "salut"],
        hint: "Informal context (friend)"
      },
      {
        question: "Comment ____ ? (allez-vous/vas-tu) - to a stranger",
        answer: "allez-vous",
        acceptableAnswers: ["allez-vous", "allez vous"],
        hint: "Formal 'you' for a stranger"
      }
    ]
  },

  // 5. CULTURE - The French "bise"
  {
    type: "culture",
    title: "The French 'bise' (cheek kiss)",
    icon: "globe",
    content: "In France, people often greet each other with 'la bise' (one or more kisses on the cheeks). The number varies by region: 2 in Paris, 3 in the South, sometimes 4 elsewhere! In professional settings, a handshake is more common.",
    keyPoints: [
      "La bise is common among friends and family",
      "The number of kisses varies by region (1 to 4)",
      "In professional settings, handshakes are preferred",
      "You don't do la bise with strangers",
      "Since Covid, some French people no longer do la bise"
    ],
    comparison: {
      fr: "France: cheek kisses between acquaintances, handshake in formal settings",
      other: "In other countries: handshakes are more common"
    }
  },

  // 6. VOCABULARY - Farewells
  {
    type: "vocabulary",
    title: "Saying goodbye",
    icon: "book",
    category: "farewells",
    words: [
      {
        word: "Au revoir",
        translation: "Goodbye (standard)",
        pronunciation: "/o.ʁə.vwaʁ/",
        example: "Au revoir et a bientot !",
        exampleTranslation: "Goodbye and see you soon!"
      },
      {
        word: "A bientot",
        translation: "See you soon",
        pronunciation: "/a.bjɛ̃.to/",
        example: "A bientot, j'espere !",
        exampleTranslation: "See you soon, I hope!"
      },
      {
        word: "A demain",
        translation: "See you tomorrow",
        pronunciation: "/a.də.mɛ̃/",
        example: "A demain au bureau !",
        exampleTranslation: "See you tomorrow at the office!"
      },
      {
        word: "Bonne journee",
        translation: "Have a nice day",
        pronunciation: "/bɔn.ʒuʁ.ne/",
        example: "Bonne journee a tous !",
        exampleTranslation: "Have a nice day, everyone!"
      },
      {
        word: "Bonne soiree",
        translation: "Have a nice evening",
        pronunciation: "/bɔn.swa.ʁe/",
        example: "Bonne soiree !",
        exampleTranslation: "Have a nice evening!"
      },
      {
        word: "Bonne nuit",
        translation: "Good night (before going to sleep)",
        pronunciation: "/bɔn.nɥi/",
        example: "Bonne nuit, fais de beaux reves !",
        exampleTranslation: "Good night, sweet dreams!"
      }
    ]
  },

  // 7. TIP - Pronunciation
  {
    type: "tip",
    title: "Pronunciation tip",
    icon: "lightbulb",
    color: "info",
    content: "The French 'r' is guttural (produced at the back of the throat), not rolled like in Spanish or Italian. To practice, try making a light gargling sound! In 'Bonjour', the final 'r' is barely pronounced."
  },

  // 8. GRAMMAR - "Je m'appelle"
  {
    type: "grammar",
    title: "Introducing yourself: Je m'appelle",
    icon: "book",
    explanation: "To introduce yourself in French, use **\"Je m'appelle\"** followed by your name. It's a reflexive verb (s'appeler, literally 'to call oneself'). An informal alternative is **\"Moi, c'est...\"** (I'm...)",
    examples: [
      {
        sentence: "Je m'appelle Marie.",
        translation: "My name is Marie.",
        note: "Standard and polite form",
        audioUrl: null
      },
      {
        sentence: "Moi, c'est Pierre.",
        translation: "I'm Pierre.",
        note: "More casual, between friends",
        audioUrl: null
      },
      {
        sentence: "Je suis Sophie.",
        translation: "I am Sophie.",
        note: "Simple and direct alternative",
        audioUrl: null
      }
    ],
    table: {
      title: "The verb S'APPELER (to be called)",
      headers: ["Pronoun", "Conjugation", "Example"],
      rows: [
        ["Je", "m'appelle", "Je m'appelle Thomas"],
        ["Tu", "t'appelles", "Comment tu t'appelles ?"],
        ["Il/Elle", "s'appelle", "Elle s'appelle Sophie"],
        ["Nous", "nous appelons", "Nous nous appelons les Dupont"],
        ["Vous", "vous appelez", "Comment vous appelez-vous ?"],
        ["Ils/Elles", "s'appellent", "Ils s'appellent Pierre et Marie"]
      ],
      rowsAudio: []
    }
  },

  // 9. EXERCISE - Complete introductions
  {
    type: "exerciseInline",
    title: "Complete the introductions",
    icon: "edit",
    exerciseType: "fillInBlank",
    xpReward: 10,
    questions: [
      {
        question: "Bonjour ! Je ____ Marie. (m'appelle/t'appelles)",
        answer: "m'appelle",
        acceptableAnswers: ["m'appelle", "m appelle"],
        hint: "First person singular"
      },
      {
        question: "Comment tu ____ ? (m'appelle/t'appelles)",
        answer: "t'appelles",
        acceptableAnswers: ["t'appelles", "t appelles"],
        hint: "Second person singular"
      },
      {
        question: "____, c'est Thomas. (Moi/Toi)",
        answer: "Moi",
        acceptableAnswers: ["Moi", "moi"],
        hint: "Informal self-introduction"
      },
      {
        question: "Elle ____ Sophie. (m'appelle/s'appelle)",
        answer: "s'appelle",
        acceptableAnswers: ["s'appelle", "s appelle"],
        hint: "Third person singular"
      }
    ]
  },

  // 10. CONVERSATION - At a party
  {
    type: "conversation",
    title: "At a party",
    context: "You're at a party and meet someone for the first time.",
    dialogue: [
      { speaker: "You", text: "Bonsoir !" },
      { speaker: "Stranger", text: "Bonsoir ! Je m'appelle Claire. Et vous ?" },
      { speaker: "You", text: "(Introduce yourself)" },
      { speaker: "Stranger", text: "Enchantee ! Vous connaissez l'hote ?" },
      { speaker: "You", text: "(Answer)" }
    ],
    questions: [
      {
        question: "What greeting is appropriate in the evening?",
        answer: "Bonsoir"
      },
      {
        question: "How does the stranger introduce themselves?",
        answer: "Je m'appelle Claire"
      }
    ]
  },

  // 11. TIP - Common mistakes
  {
    type: "tip",
    title: "Common mistakes to avoid",
    icon: "lightbulb",
    color: "warning",
    content: "**Watch out for false friends!** Don't confuse 'Bonsoir' (evening greeting when arriving) with 'Bonne soiree' (wish when leaving). Say 'Bonsoir' when arriving and 'Bonne soiree' when leaving. Similarly, 'Bonjour' is for arriving, 'Bonne journee' for leaving."
  },

  // 12. SUMMARY
  {
    type: "summary",
    title: "Key phrases to remember",
    icon: "check",
    keyPhrases: [
      { fr: "Bonjour !", en: "Hello! (formal, daytime)", context: "Formal greeting (day)" },
      { fr: "Bonsoir !", en: "Good evening!", context: "Formal greeting (evening)" },
      { fr: "Salut !", en: "Hi!", context: "Informal greeting" },
      { fr: "Comment allez-vous ?", en: "How are you? (formal)", context: "Asking how someone is (formal)" },
      { fr: "Ca va ?", en: "How's it going?", context: "Asking how someone is (informal)" },
      { fr: "Je m'appelle...", en: "My name is...", context: "Introducing yourself" },
      { fr: "Enchante(e) !", en: "Nice to meet you!", context: "Response to introduction" },
      { fr: "Au revoir !", en: "Goodbye!", context: "Saying goodbye (formal)" },
      { fr: "A bientot !", en: "See you soon!", context: "Saying goodbye (friendly)" },
      { fr: "Bonne journee / Bonne soiree !", en: "Have a nice day / evening!", context: "Wish when leaving" }
    ]
  }
];

// ===========================================
// BLOCKS FOR RUSSIAN SPEAKERS (blocks_ru)
// Translations and explanations in Russian
// ===========================================
const blocks_ru = [
  // 1. DIALOGUE
  {
    type: "dialogue",
    title: "Первая встреча в кафе",
    lines: [
      {
        speaker: "Sophie",
        speakerGender: "female",
        text: "Bonjour !",
        audioUrl: null,
        vocab: [
          { word: "Bonjour", translation: "Здравствуйте / Добрый день (формально)" }
        ]
      },
      {
        speaker: "Thomas",
        speakerGender: "male",
        text: "Bonjour ! Comment allez-vous ?",
        audioUrl: null,
        vocab: [
          { word: "Comment allez-vous ?", translation: "Как поживаете? (формально)" }
        ]
      },
      {
        speaker: "Sophie",
        speakerGender: "female",
        text: "Je vais bien, merci. Et vous ?",
        audioUrl: null,
        vocab: [
          { word: "Je vais bien", translation: "У меня всё хорошо" },
          { word: "merci", translation: "спасибо" },
          { word: "Et vous ?", translation: "А вы? (формально)" }
        ]
      },
      {
        speaker: "Thomas",
        speakerGender: "male",
        text: "Tres bien, merci ! Je m'appelle Thomas.",
        audioUrl: null,
        vocab: [
          { word: "Tres bien", translation: "Очень хорошо" },
          { word: "Je m'appelle", translation: "Меня зовут (досл.: я себя называю)" }
        ]
      },
      {
        speaker: "Sophie",
        speakerGender: "female",
        text: "Enchantee, Thomas ! Moi, c'est Sophie.",
        audioUrl: null,
        vocab: [
          { word: "Enchantee", translation: "Очень приятно (говорит женщина)" },
          { word: "Moi, c'est", translation: "Я... (неформальный способ представиться)" }
        ]
      },
      {
        speaker: "Thomas",
        speakerGender: "male",
        text: "Enchante, Sophie ! Bonne journee !",
        audioUrl: null,
        vocab: [
          { word: "Enchante", translation: "Очень приятно (говорит мужчина)" },
          { word: "Bonne journee", translation: "Хорошего дня" }
        ]
      },
      {
        speaker: "Sophie",
        speakerGender: "female",
        text: "Merci, a vous aussi ! Au revoir !",
        audioUrl: null,
        vocab: [
          { word: "a vous aussi", translation: "вам тоже (формально)" },
          { word: "Au revoir", translation: "До свидания" }
        ]
      }
    ],
    vocabulary: [
      { word: "Bonjour", translation: "Здравствуйте / Добрый день", category: "greetings" },
      { word: "Au revoir", translation: "До свидания", category: "greetings" },
      { word: "Merci", translation: "Спасибо", category: "politeness" }
    ]
  },

  // 2. VOCABULARY - Greetings
  {
    type: "vocabulary",
    title: "Приветствия",
    icon: "book",
    category: "greetings",
    words: [
      {
        word: "Bonjour",
        translation: "Здравствуйте / Добрый день (формально, до вечера)",
        pronunciation: "/bɔ̃.ʒuʁ/",
        example: "Bonjour, madame !",
        exampleTranslation: "Здравствуйте, мадам! (формально)"
      },
      {
        word: "Bonsoir",
        translation: "Добрый вечер (после 18:00)",
        pronunciation: "/bɔ̃.swaʁ/",
        example: "Bonsoir, monsieur !",
        exampleTranslation: "Добрый вечер, месье! (формально)"
      },
      {
        word: "Salut",
        translation: "Привет (неформально, между друзьями)",
        pronunciation: "/sa.ly/",
        example: "Salut ! Ca va ?",
        exampleTranslation: "Привет! Как дела?"
      },
      {
        word: "Coucou",
        translation: "Привет (очень неформально, близкие люди)",
        pronunciation: "/ku.ku/",
        example: "Coucou, c'est moi !",
        exampleTranslation: "Привет, это я! (семья, близкие друзья)"
      }
    ]
  },

  // 3. GRAMMAR - Formal vs informal
  {
    type: "grammar",
    title: "Формальное и неформальное общение",
    icon: "book",
    explanation: "Во французском языке есть два регистра: **формальный** (вы - vous) и **неформальный** (ты - tu). Выбор зависит от отношений с собеседником и контекста. Использование 'vous' выражает уважение и вежливость.",
    examples: [
      {
        sentence: "Comment allez-vous ?",
        translation: "Как поживаете? (формально)",
        note: "Используйте 'vous' с незнакомыми, начальством, пожилыми людьми",
        audioUrl: null
      },
      {
        sentence: "Comment vas-tu ?",
        translation: "Как дела? (неформально)",
        note: "Используйте 'tu' с друзьями, семьёй, детьми",
        audioUrl: null
      },
      {
        sentence: "Ca va ?",
        translation: "Как дела? (очень неформально)",
        note: "Сокращённая версия, очень распространена среди друзей",
        audioUrl: null
      }
    ],
    table: {
      title: "Формальное vs Неформальное",
      headers: ["Ситуация", "Формально (vous)", "Неформально (tu)"],
      rows: [
        ["Приветствие", "Bonjour", "Salut / Coucou"],
        ["Как дела?", "Comment allez-vous ?", "Ca va ? / Comment tu vas ?"],
        ["Ответ", "Je vais bien, merci", "Ca va / Ca va bien"],
        ["Прощание", "Au revoir", "Salut / A plus / Ciao"]
      ],
      rowsAudio: []
    }
  },

  // 4. EXERCISE - Formal or informal
  {
    type: "exerciseInline",
    title: "Формально или неформально?",
    icon: "edit",
    exerciseType: "fillInBlank",
    xpReward: 10,
    questions: [
      {
        question: "Преподавателю: ____. (Salut/Bonjour)",
        answer: "Bonjour",
        acceptableAnswers: ["Bonjour", "bonjour"],
        hint: "Формальный контекст (преподаватель)"
      },
      {
        question: "Другу: ____. (Salut/Bonjour)",
        answer: "Salut",
        acceptableAnswers: ["Salut", "salut"],
        hint: "Неформальный контекст (друг)"
      },
      {
        question: "Comment ____ ? (allez-vous/vas-tu) - незнакомцу",
        answer: "allez-vous",
        acceptableAnswers: ["allez-vous", "allez vous"],
        hint: "Формальное 'вы' для незнакомца"
      }
    ]
  },

  // 5. CULTURE - The French "bise"
  {
    type: "culture",
    title: "Французский поцелуй в щёку (la bise)",
    icon: "globe",
    content: "Во Франции люди часто приветствуют друг друга поцелуями в щёку (la bise). Количество поцелуев зависит от региона: 2 в Париже, 3 на юге, иногда 4 в других местах! В деловой обстановке более принято рукопожатие.",
    keyPoints: [
      "La bise распространена среди друзей и в семье",
      "Количество поцелуев зависит от региона (от 1 до 4)",
      "В деловой обстановке предпочтительнее рукопожатие",
      "С незнакомыми людьми la bise не делают",
      "После ковида некоторые французы перестали делать la bise"
    ],
    comparison: {
      fr: "Франция: поцелуи в щёку между знакомыми, рукопожатие в формальной обстановке",
      other: "В других странах: рукопожатие более распространено"
    }
  },

  // 6. VOCABULARY - Farewells
  {
    type: "vocabulary",
    title: "Прощание",
    icon: "book",
    category: "farewells",
    words: [
      {
        word: "Au revoir",
        translation: "До свидания (стандартно)",
        pronunciation: "/o.ʁə.vwaʁ/",
        example: "Au revoir et a bientot !",
        exampleTranslation: "До свидания и до скорой встречи!"
      },
      {
        word: "A bientot",
        translation: "До скорой встречи",
        pronunciation: "/a.bjɛ̃.to/",
        example: "A bientot, j'espere !",
        exampleTranslation: "Надеюсь, до скорой встречи!"
      },
      {
        word: "A demain",
        translation: "До завтра",
        pronunciation: "/a.də.mɛ̃/",
        example: "A demain au bureau !",
        exampleTranslation: "До завтра в офисе!"
      },
      {
        word: "Bonne journee",
        translation: "Хорошего дня",
        pronunciation: "/bɔn.ʒuʁ.ne/",
        example: "Bonne journee a tous !",
        exampleTranslation: "Хорошего дня всем!"
      },
      {
        word: "Bonne soiree",
        translation: "Хорошего вечера",
        pronunciation: "/bɔn.swa.ʁe/",
        example: "Bonne soiree !",
        exampleTranslation: "Хорошего вечера!"
      },
      {
        word: "Bonne nuit",
        translation: "Спокойной ночи (перед сном)",
        pronunciation: "/bɔn.nɥi/",
        example: "Bonne nuit, fais de beaux reves !",
        exampleTranslation: "Спокойной ночи, приятных снов!"
      }
    ]
  },

  // 7. TIP - Pronunciation
  {
    type: "tip",
    title: "Совет по произношению",
    icon: "lightbulb",
    color: "info",
    content: "Французское 'r' гортанное (произносится в глубине горла), а не раскатистое как в испанском или итальянском. Чтобы потренироваться, попробуйте слегка полоскать горло! В слове 'Bonjour' конечное 'r' почти не произносится."
  },

  // 8. GRAMMAR - "Je m'appelle"
  {
    type: "grammar",
    title: "Представление: Je m'appelle",
    icon: "book",
    explanation: "Чтобы представиться по-французски, используйте **\"Je m'appelle\"** + ваше имя. Это возвратный глагол (s'appeler, буквально 'называть себя'). Неформальная альтернатива - **\"Moi, c'est...\"** (Я - это...)",
    examples: [
      {
        sentence: "Je m'appelle Marie.",
        translation: "Меня зовут Мари.",
        note: "Стандартная и вежливая форма",
        audioUrl: null
      },
      {
        sentence: "Moi, c'est Pierre.",
        translation: "Я - Пьер.",
        note: "Более непринуждённо, между друзьями",
        audioUrl: null
      },
      {
        sentence: "Je suis Sophie.",
        translation: "Я - Софи.",
        note: "Простая и прямая альтернатива",
        audioUrl: null
      }
    ],
    table: {
      title: "Глагол S'APPELER (называться)",
      headers: ["Местоимение", "Спряжение", "Пример"],
      rows: [
        ["Je", "m'appelle", "Je m'appelle Thomas"],
        ["Tu", "t'appelles", "Comment tu t'appelles ?"],
        ["Il/Elle", "s'appelle", "Elle s'appelle Sophie"],
        ["Nous", "nous appelons", "Nous nous appelons les Dupont"],
        ["Vous", "vous appelez", "Comment vous appelez-vous ?"],
        ["Ils/Elles", "s'appellent", "Ils s'appellent Pierre et Marie"]
      ],
      rowsAudio: []
    }
  },

  // 9. EXERCISE - Complete introductions
  {
    type: "exerciseInline",
    title: "Завершите представления",
    icon: "edit",
    exerciseType: "fillInBlank",
    xpReward: 10,
    questions: [
      {
        question: "Bonjour ! Je ____ Marie. (m'appelle/t'appelles)",
        answer: "m'appelle",
        acceptableAnswers: ["m'appelle", "m appelle"],
        hint: "Первое лицо единственного числа"
      },
      {
        question: "Comment tu ____ ? (m'appelle/t'appelles)",
        answer: "t'appelles",
        acceptableAnswers: ["t'appelles", "t appelles"],
        hint: "Второе лицо единственного числа"
      },
      {
        question: "____, c'est Thomas. (Moi/Toi)",
        answer: "Moi",
        acceptableAnswers: ["Moi", "moi"],
        hint: "Неформальное представление себя"
      },
      {
        question: "Elle ____ Sophie. (m'appelle/s'appelle)",
        answer: "s'appelle",
        acceptableAnswers: ["s'appelle", "s appelle"],
        hint: "Третье лицо единственного числа"
      }
    ]
  },

  // 10. CONVERSATION - At a party
  {
    type: "conversation",
    title: "На вечеринке",
    context: "Вы на вечеринке и впервые встречаете кого-то.",
    dialogue: [
      { speaker: "Вы", text: "Bonsoir !" },
      { speaker: "Незнакомец/ка", text: "Bonsoir ! Je m'appelle Claire. Et vous ?" },
      { speaker: "Вы", text: "(Представьтесь)" },
      { speaker: "Незнакомец/ка", text: "Enchantee ! Vous connaissez l'hote ?" },
      { speaker: "Вы", text: "(Ответьте)" }
    ],
    questions: [
      {
        question: "Какое приветствие подходит вечером?",
        answer: "Bonsoir"
      },
      {
        question: "Как незнакомец/ка представляется?",
        answer: "Je m'appelle Claire"
      }
    ]
  },

  // 11. TIP - Common mistakes
  {
    type: "tip",
    title: "Распространённые ошибки",
    icon: "lightbulb",
    color: "warning",
    content: "**Внимание, не путайте!** 'Bonsoir' (приветствие вечером при встрече) и 'Bonne soiree' (пожелание при расставании). Говорите 'Bonsoir' при встрече и 'Bonne soiree' при расставании. Аналогично, 'Bonjour' - при встрече, 'Bonne journee' - при расставании."
  },

  // 12. SUMMARY
  {
    type: "summary",
    title: "Ключевые фразы",
    icon: "check",
    keyPhrases: [
      { fr: "Bonjour !", ru: "Здравствуйте! (день)", context: "Формальное приветствие (день)" },
      { fr: "Bonsoir !", ru: "Добрый вечер!", context: "Формальное приветствие (вечер)" },
      { fr: "Salut !", ru: "Привет!", context: "Неформальное приветствие" },
      { fr: "Comment allez-vous ?", ru: "Как поживаете? (формально)", context: "Вопрос о делах (формально)" },
      { fr: "Ca va ?", ru: "Как дела?", context: "Вопрос о делах (неформально)" },
      { fr: "Je m'appelle...", ru: "Меня зовут...", context: "Представление" },
      { fr: "Enchante(e) !", ru: "Очень приятно!", context: "Ответ на представление" },
      { fr: "Au revoir !", ru: "До свидания!", context: "Прощание (формально)" },
      { fr: "A bientot !", ru: "До скорой встречи!", context: "Прощание (дружеское)" },
      { fr: "Bonne journee / Bonne soiree !", ru: "Хорошего дня / вечера!", context: "Пожелание при расставании" }
    ]
  }
];

// ===========================================
// LESSON METADATA
// ===========================================
const lessonData = {
  course_id: 9, // French course (target_language: fr)
  slug: "bonjour-saluer-prendre-conge",
  title_fr: "Bonjour ! - Saluer et prendre conge",
  title_en: "Hello! - Greetings and farewells",
  title_ru: "Здравствуйте! - Приветствия и прощания",
  order_index: 1, // First lesson after "Se presenter" (order_index: 0) - actually this will be first
  estimated_minutes: 30,
  is_published: true,
  objectives_fr: [
    "Dire bonjour et au revoir",
    "Utiliser le registre formel et informel",
    "Se presenter avec 'Je m'appelle'",
    "Souhaiter une bonne journee/soiree"
  ],
  objectives_en: [
    "Say hello and goodbye",
    "Use formal and informal registers",
    "Introduce yourself with 'Je m'appelle'",
    "Wish someone a nice day/evening"
  ],
  objectives_ru: [
    "Здороваться и прощаться",
    "Использовать формальный и неформальный регистры",
    "Представляться с помощью 'Je m'appelle'",
    "Желать хорошего дня/вечера"
  ],
  blocks_fr,
  blocks_en,
  blocks_ru
};

// ===========================================
// INSERTION FUNCTION
// ===========================================
async function insertLesson() {
  console.log('=== INSERTING LESSON: Bonjour ! - Saluer et prendre conge ===\n');

  // Check if lesson already exists
  const { data: existing } = await supabase
    .from('course_lessons')
    .select('id, slug')
    .eq('slug', lessonData.slug)
    .single();

  if (existing) {
    console.log('Lesson already exists with ID:', existing.id);
    console.log('Do you want to update it? Run with --update flag');

    if (process.argv.includes('--update')) {
      console.log('\nUpdating existing lesson...');
      const { data, error } = await supabase
        .from('course_lessons')
        .update(lessonData)
        .eq('id', existing.id)
        .select();

      if (error) {
        console.error('Error updating lesson:', error);
        return;
      }
      console.log('Lesson updated successfully!');
      console.log('ID:', data[0].id);
    }
    return;
  }

  // Insert new lesson
  const { data, error } = await supabase
    .from('course_lessons')
    .insert([lessonData])
    .select();

  if (error) {
    console.error('Error inserting lesson:', error);
    return;
  }

  console.log('Lesson inserted successfully!');
  console.log('ID:', data[0].id);
  console.log('Slug:', data[0].slug);
  console.log('\nBlocks count:');
  console.log('- blocks_fr:', blocks_fr.length);
  console.log('- blocks_en:', blocks_en.length);
  console.log('- blocks_ru:', blocks_ru.length);

  // Verify structure consistency
  if (blocks_fr.length === blocks_en.length && blocks_en.length === blocks_ru.length) {
    console.log('\n✅ All block arrays have the same length');
  } else {
    console.log('\n⚠️ WARNING: Block arrays have different lengths!');
  }

  // List block types
  console.log('\nBlock types:');
  blocks_fr.forEach((block, i) => {
    console.log(`  ${i + 1}. ${block.type}: ${block.title || '(no title)'}`);
  });
}

// Run
insertLesson();
