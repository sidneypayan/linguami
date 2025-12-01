const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://capnpewksfdnllttnvzu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcG5wZXdrc2ZkbmxsdHRudnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU1MzUwMiwiZXhwIjoyMDc5MTI5NTAyfQ.iU3xNj5CO_RBtGCCNpXl5LeobwRf1VGxV17sOqKPtDY'
);

const blocks_it = [
  {
    "type": "dialogue",
    "lines": [
      {
        "text": "Buongiorno!",
        "vocab": [
          {
            "word": "Buongiorno",
            "translation": "Saluto formale (mattina/pomeriggio)"
          }
        ],
        "speaker": "Sofia",
        "audioUrl": null,
        "speakerGender": "female"
      },
      {
        "text": "Buongiorno! Come sta?",
        "vocab": [
          {
            "word": "Come sta?",
            "translation": "Domanda formale sullo stato di salute"
          }
        ],
        "speaker": "Tommaso",
        "audioUrl": null,
        "speakerGender": "male"
      },
      {
        "text": "Sto bene, grazie. E Lei?",
        "vocab": [
          {
            "word": "Sto bene",
            "translation": "Risposta positiva"
          },
          {
            "word": "grazie",
            "translation": "Espressione di gratitudine"
          }
        ],
        "speaker": "Sofia",
        "audioUrl": null,
        "speakerGender": "female"
      },
      {
        "text": "Molto bene, grazie! Mi chiamo Tommaso.",
        "vocab": [
          {
            "word": "Molto bene",
            "translation": "Risposta molto positiva"
          },
          {
            "word": "Mi chiamo",
            "translation": "Formula di presentazione"
          }
        ],
        "speaker": "Tommaso",
        "audioUrl": null,
        "speakerGender": "male"
      },
      {
        "text": "Piacere, Tommaso! Io sono Sofia.",
        "vocab": [
          {
            "word": "Piacere",
            "translation": "Espressione di cortesia"
          },
          {
            "word": "Io sono",
            "translation": "Modo informale di presentarsi"
          }
        ],
        "speaker": "Sofia",
        "audioUrl": null,
        "speakerGender": "female"
      },
      {
        "text": "Piacere mio, Sofia! Buona giornata!",
        "vocab": [
          {
            "word": "Piacere mio",
            "translation": "Risposta cortese"
          },
          {
            "word": "Buona giornata",
            "translation": "Augurio per la giornata"
          }
        ],
        "speaker": "Tommaso",
        "audioUrl": null,
        "speakerGender": "male"
      },
      {
        "text": "Grazie, anche a Lei! Arrivederci!",
        "vocab": [
          {
            "word": "anche a Lei",
            "translation": "Ricambiare l'augurio (formale)"
          },
          {
            "word": "Arrivederci",
            "translation": "Formula di commiato"
          }
        ],
        "speaker": "Sofia",
        "audioUrl": null,
        "speakerGender": "female"
      }
    ],
    "title": "Primo incontro al bar",
    "vocabulary": [
      {
        "word": "Buongiorno",
        "category": "expressions",
        "translation": "Saluto del giorno"
      },
      {
        "word": "Arrivederci",
        "category": "expressions",
        "translation": "Addio"
      },
      {
        "word": "Grazie",
        "category": "expressions",
        "translation": "Espressione di gratitudine"
      }
    ]
  },
  {
    "icon": "book",
    "type": "vocabulary",
    "title": "I saluti",
    "words": [
      {
        "word": "Buongiorno",
        "example": "Buongiorno, signora!",
        "translation": "Saluto formale (mattina/pomeriggio)",
        "pronunciation": "/bwon.ˈdʒor.no/",
        "exampleTranslation": "Saluto a una donna (formale)"
      },
      {
        "word": "Buonasera",
        "example": "Buonasera, signore!",
        "translation": "Saluto della sera (dopo le 18)",
        "pronunciation": "/bwo.na.ˈse.ra/",
        "exampleTranslation": "Saluto a un uomo (formale)"
      },
      {
        "word": "Ciao",
        "example": "Ciao! Come stai?",
        "translation": "Saluto informale (tra amici)",
        "pronunciation": "/ˈtʃao/",
        "exampleTranslation": "Saluto rilassato tra amici"
      },
      {
        "word": "Salve",
        "example": "Salve a tutti!",
        "translation": "Saluto neutro (né formale né informale)",
        "pronunciation": "/ˈsal.ve/",
        "exampleTranslation": "Saluto per qualsiasi situazione"
      }
    ],
    "category": "saluti"
  },
  {
    "icon": "book",
    "type": "grammar",
    "table": {
      "rows": [
        [
          "Salutare",
          "Buongiorno",
          "Ciao / Salve"
        ],
        [
          "Chiedere come sta",
          "Come sta?",
          "Come stai? / Come va?"
        ],
        [
          "Rispondere",
          "Sto bene, grazie",
          "Bene / Tutto bene"
        ],
        [
          "Congedarsi",
          "Arrivederci",
          "Ciao / A dopo / A presto"
        ]
      ],
      "title": "Formale vs Informale",
      "headers": [
        "Situazione",
        "Formale (Lei)",
        "Informale (tu)"
      ],
      "rowsAudio": []
    },
    "title": "Formale vs Informale",
    "examples": [
      {
        "note": "Usate 'Lei' con sconosciuti, superiori, persone anziane",
        "audioUrl": null,
        "sentence": "Come sta?",
        "translation": "Domanda formale"
      },
      {
        "note": "Usate 'tu' con amici, familiari, bambini",
        "audioUrl": null,
        "sentence": "Come stai?",
        "translation": "Domanda informale"
      },
      {
        "note": "Versione abbreviata, molto comune tra amici",
        "audioUrl": null,
        "sentence": "Come va?",
        "translation": "Domanda molto informale"
      }
    ],
    "explanation": "In italiano esistono due registri di lingua: formale (Lei) e informale (tu). La scelta dipende dalla relazione con l'interlocutore e dal contesto."
  },
  {
    "icon": "edit",
    "type": "exerciseInline",
    "title": "Formale o informale?",
    "xpReward": 10,
    "questions": [
      {
        "hint": "Contesto formale (professore)",
        "answer": "Buongiorno",
        "question": "Al Suo professore: ____. (Ciao/Buongiorno)",
        "acceptableAnswers": [
          "Buongiorno",
          "buongiorno"
        ]
      },
      {
        "hint": "Contesto informale (amico)",
        "answer": "Ciao",
        "question": "Al tuo amico/a: ____. (Ciao/Buongiorno)",
        "acceptableAnswers": [
          "Ciao",
          "ciao"
        ]
      },
      {
        "hint": "Forma di cortesia per uno sconosciuto",
        "answer": "sta",
        "question": "Come ____ ? (sta/stai) - a uno sconosciuto",
        "acceptableAnswers": [
          "sta"
        ]
      }
    ],
    "exerciseType": "fillInBlank"
  },
  {
    "icon": "globe",
    "type": "culture",
    "title": "I baci italiani",
    "content": "In Italia, è comune baciarsi sulle guance per salutarsi. Di solito si danno due baci, iniziando dalla guancia destra. Tra colleghi e in contesti formali, ci si stringe la mano. Gli italiani sono generalmente molto espressivi e calorosi nei saluti.",
    "keyPoints": [
      "I baci sono comuni tra amici e familiari",
      "Di solito si danno due baci (destra poi sinistra)",
      "In contesto professionale, si preferisce la stretta di mano",
      "Non si baciano gli sconosciuti",
      "Gli uomini tra di loro spesso si abbracciano o si danno una pacca sulla spalla"
    ],
    "comparison": {
      "fr": "Italia: baci tra persone vicine, stretta di mano in contesto formale",
      "other": "In altri paesi: la stretta di mano è più comune"
    }
  },
  {
    "icon": "book",
    "type": "vocabulary",
    "title": "Congedarsi",
    "words": [
      {
        "word": "Arrivederci",
        "example": "Arrivederci e a presto!",
        "translation": "Formula di commiato standard",
        "pronunciation": "/ar.ri.ve.ˈder.tʃi/",
        "exampleTranslation": "Commiato formale con augurio di rivedersi"
      },
      {
        "word": "A presto",
        "example": "A presto, spero!",
        "translation": "A presto (quando ci si rivedrà)",
        "pronunciation": "/a ˈprɛ.sto/",
        "exampleTranslation": "Espressione di speranza di rivedersi"
      },
      {
        "word": "A domani",
        "example": "A domani in ufficio!",
        "translation": "Quando ci si rivede il giorno dopo",
        "pronunciation": "/a do.ˈma.ni/",
        "exampleTranslation": "Quando ci si ritrova il giorno seguente"
      },
      {
        "word": "Buona giornata",
        "example": "Buona giornata a tutti!",
        "translation": "Augurio per la giornata",
        "pronunciation": "/ˈbwɔ.na dʒor.ˈna.ta/",
        "exampleTranslation": "Augurio collettivo"
      },
      {
        "word": "Buona serata",
        "example": "Buona serata!",
        "translation": "Augurio per la serata",
        "pronunciation": "/ˈbwɔ.na se.ˈra.ta/",
        "exampleTranslation": "Augurio serale"
      },
      {
        "word": "Buonanotte",
        "example": "Buonanotte, sogni d'oro!",
        "translation": "Prima di andare a dormire",
        "pronunciation": "/bwɔ.na.ˈnɔt.te/",
        "exampleTranslation": "Augurio prima di coricarsi"
      }
    ],
    "category": "farewells"
  },
  {
    "icon": "lightbulb",
    "type": "tip",
    "color": "info",
    "title": "Consiglio di pronuncia",
    "content": "Le doppie consonanti in italiano sono importanti! 'Penne' (pasta) si pronuncia diversamente da 'pene' (pena). In 'Arrivederci', la doppia 'r' si pronuncia chiaramente. Praticate raddoppiando il suono!"
  },
  {
    "icon": "book",
    "type": "grammar",
    "table": {
      "rows": [
        [
          "Io",
          "mi chiamo",
          "Mi chiamo Tommaso"
        ],
        [
          "Tu",
          "ti chiami",
          "Come ti chiami?"
        ],
        [
          "Lui/Lei",
          "si chiama",
          "Lei si chiama Sofia"
        ],
        [
          "Noi",
          "ci chiamiamo",
          "Ci chiamiamo Rossi"
        ],
        [
          "Voi",
          "vi chiamate",
          "Come vi chiamate?"
        ],
        [
          "Loro",
          "si chiamano",
          "Si chiamano Pietro e Maria"
        ]
      ],
      "title": "Il verbo CHIAMARSI al presente",
      "headers": [
        "Pronome",
        "Coniugazione",
        "Esempio"
      ],
      "rowsAudio": []
    },
    "title": "Presentarsi: Mi chiamo",
    "examples": [
      {
        "note": "Forma standard e cortese",
        "audioUrl": null,
        "sentence": "Mi chiamo Maria.",
        "translation": "Presentazione formale"
      },
      {
        "note": "Più rilassato, tra amici",
        "audioUrl": null,
        "sentence": "Io sono Pietro.",
        "translation": "Presentazione informale"
      },
      {
        "note": "Semplice e diretto",
        "audioUrl": null,
        "sentence": "Sono Sofia.",
        "translation": "Alternativa diretta"
      }
    ],
    "explanation": "Per presentarsi in italiano, si usa \"Mi chiamo\" seguito dal proprio nome. È un verbo riflessivo (chiamarsi). Un'alternativa informale è \"Io sono...\""
  },
  {
    "icon": "edit",
    "type": "exerciseInline",
    "title": "Completate le presentazioni",
    "xpReward": 10,
    "questions": [
      {
        "hint": "Prima persona singolare",
        "answer": "mi chiamo",
        "question": "Buongiorno! ____ Maria. (mi chiamo/ti chiami)",
        "acceptableAnswers": [
          "mi chiamo",
          "Mi chiamo"
        ]
      },
      {
        "hint": "Seconda persona singolare",
        "answer": "ti chiami",
        "question": "Come ____ ? (mi chiamo/ti chiami)",
        "acceptableAnswers": [
          "ti chiami"
        ]
      },
      {
        "hint": "Presentazione informale di sé stessi",
        "answer": "Io",
        "question": "____ sono Tommaso. (Io/Tu)",
        "acceptableAnswers": [
          "Io",
          "io"
        ]
      },
      {
        "hint": "Terza persona singolare",
        "answer": "si chiama",
        "question": "Lei ____ Sofia. (mi chiamo/si chiama)",
        "acceptableAnswers": [
          "si chiama"
        ]
      }
    ],
    "exerciseType": "fillInBlank"
  },
  {
    "type": "conversation",
    "title": "A una festa",
    "context": "Siete a una festa e incontrate qualcuno per la prima volta.",
    "dialogue": [
      {
        "text": "Buonasera!",
        "speaker": "Sconosciuto/a"
      },
      {
        "text": "...",
        "speaker": "Voi"
      },
      {
        "text": "Mi chiamo Chiara. E Lei?",
        "speaker": "Sconosciuto/a"
      },
      {
        "text": "...",
        "speaker": "Voi"
      },
      {
        "text": "Piacere! Conosce il padrone di casa?",
        "speaker": "Sconosciuto/a"
      },
      {
        "text": "...",
        "speaker": "Voi"
      }
    ],
    "questions": [
      {
        "answer": "Buonasera!",
        "question": "Come rispondere a \"Buonasera!\"?"
      },
      {
        "answer": "Mi chiamo [il vostro nome]. / Io sono [il vostro nome].",
        "question": "Come presentarvi dopo \"E Lei?\"?"
      },
      {
        "answer": "Sì, è un amico. / No, non proprio. / Sì, è un mio collega.",
        "question": "Come rispondere a \"Conosce il padrone di casa?\"?"
      }
    ]
  },
  {
    "icon": "lightbulb",
    "type": "tip",
    "color": "warning",
    "title": "Errori comuni da evitare",
    "content": "Attenzione ai falsi amici! Non confondete \"Buonasera\" (saluto della sera) con \"Buona serata\" (augurio andando via). Si dice \"Buonasera\" arrivando e \"Buona serata\" andando via. Allo stesso modo, \"Buongiorno\" si usa arrivando, \"Buona giornata\" andando via."
  },
  {
    "icon": "check",
    "type": "summary",
    "title": "Espressioni da ricordare",
    "keyPhrases": [
      {
        "it": "Buongiorno!",
        "context": "Saluto formale (giorno)"
      },
      {
        "it": "Buonasera!",
        "context": "Saluto formale (sera)"
      },
      {
        "it": "Ciao!",
        "context": "Saluto informale"
      },
      {
        "it": "Come sta?",
        "context": "Chiedere come sta (formale)"
      },
      {
        "it": "Come stai?",
        "context": "Chiedere come sta (informale)"
      },
      {
        "it": "Mi chiamo...",
        "context": "Presentarsi"
      },
      {
        "it": "Piacere!",
        "context": "Risposta a una presentazione"
      },
      {
        "it": "Arrivederci!",
        "context": "Congedarsi (formale)"
      },
      {
        "it": "A presto!",
        "context": "Congedarsi (amichevole)"
      },
      {
        "it": "Buona giornata / Buona serata!",
        "context": "Augurio andando via"
      }
    ]
  }
];

const objectives_it = [
  "Dire buongiorno e arrivederci",
  "Usare il registro formale e informale",
  "Presentarsi con 'Mi chiamo'",
  "Augurare una buona giornata/serata"
];

async function addItalianLesson() {
  console.log('Adding Italian translation to lesson...\n');

  const { data, error } = await supabase
    .from('course_lessons')
    .update({
      blocks_it: blocks_it,
      objectives_it: objectives_it
    })
    .eq('slug', 'saluer-prendre-conge')
    .select('id, slug');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('✓ Italian translation added successfully!');
  console.log('Updated lesson:', data);
}

addItalianLesson();
