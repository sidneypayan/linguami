require('dotenv').config({ path: '.env.production' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Leçon 13: Les adjectifs qualificatifs
const lesson13Content = {
  blocks_fr: [
    {
      type: 'mainTitle',
      text: 'Les adjectifs qualificatifs'
    },
    {
      type: 'subtitle',
      text: 'Décrire et qualifier en français'
    },
    {
      type: 'quickSummary',
      title: 'Points clés',
      keyForms: [
        {
          form: 'Accord en genre',
          translation: 'petit → petite'
        },
        {
          form: 'Accord en nombre',
          translation: 'petit → petits'
        },
        {
          form: 'Position',
          translation: 'Avant ou après le nom'
        },
        {
          form: 'BAGS',
          translation: 'Beauty, Age, Goodness, Size (avant le nom)'
        }
      ]
    },
    {
      type: 'title',
      text: 'Accord des adjectifs'
    },
    {
      type: 'paragraph',
      text: 'En français, les adjectifs s\'accordent en genre (masculin/féminin) et en nombre (singulier/pluriel) avec le nom qu\'ils qualifient.'
    },
    {
      type: 'conjugationTable',
      title: 'Formation du féminin',
      rows: [
        {
          pronoun: 'Règle générale',
          form: 'Masculin + e',
          translation: 'petit → petite, grand → grande'
        },
        {
          pronoun: 'Déjà en -e',
          form: 'Pas de changement',
          translation: 'jeune → jeune, rouge → rouge'
        },
        {
          pronoun: '-er → -ère',
          form: 'Changement',
          translation: 'cher → chère, étranger → étrangère'
        },
        {
          pronoun: '-eux → -euse',
          form: 'Changement',
          translation: 'heureux → heureuse, sérieux → sérieuse'
        },
        {
          pronoun: '-if → -ive',
          form: 'Changement',
          translation: 'actif → active, sportif → sportive'
        },
        {
          pronoun: 'Doublement',
          form: '-el/-en/-on',
          translation: 'bon → bonne, ancien → ancienne',
          mnemonic: 'Double consonne + e'
        }
      ]
    },
    {
      type: 'conjugationTable',
      title: 'Formation du pluriel',
      rows: [
        {
          pronoun: 'Règle générale',
          form: '+ s',
          translation: 'petit → petits, grande → grandes'
        },
        {
          pronoun: 'Déjà en -s/-x',
          form: 'Pas de changement',
          translation: 'français → français, heureux → heureux'
        },
        {
          pronoun: '-eau → -eaux',
          form: 'Changement',
          translation: 'beau → beaux, nouveau → nouveaux'
        }
      ]
    },
    {
      type: 'title',
      text: 'Position des adjectifs'
    },
    {
      type: 'paragraph',
      text: 'La plupart des adjectifs se placent APRÈS le nom. Mais certains adjectifs courts et fréquents se placent AVANT le nom.'
    },
    {
      type: 'usageList',
      title: 'Adjectifs AVANT le nom (BAGS)',
      items: [
        {
          usage: 'B = Beauty (beauté)',
          examples: [
            'un beau tableau',
            'une jolie fille',
            'un joli jardin'
          ]
        },
        {
          usage: 'A = Age (âge)',
          examples: [
            'un jeune homme',
            'une vieille maison',
            'un nouveau livre'
          ]
        },
        {
          usage: 'G = Goodness (qualité)',
          examples: [
            'un bon restaurant',
            'une mauvaise idée',
            'un gentil chien'
          ]
        },
        {
          usage: 'S = Size (taille)',
          examples: [
            'un grand appartement',
            'une petite voiture',
            'un gros problème'
          ]
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Adjectifs APRÈS le nom (la majorité)',
      items: [
        {
          usage: 'Couleur',
          examples: [
            'une voiture rouge',
            'des yeux bleus',
            'un chat noir'
          ]
        },
        {
          usage: 'Nationalité',
          examples: [
            'un restaurant français',
            'une chanson italienne',
            'un film américain'
          ]
        },
        {
          usage: 'Forme',
          examples: [
            'une table ronde',
            'un objet carré',
            'une rue longue'
          ]
        }
      ]
    },
    {
      type: 'conjugationTable',
      title: 'Adjectifs irréguliers au masculin',
      rows: [
        {
          pronoun: 'beau',
          form: 'bel (devant voyelle)',
          translation: 'un bel homme, un beau garçon'
        },
        {
          pronoun: 'nouveau',
          form: 'nouvel (devant voyelle)',
          translation: 'un nouvel ami, un nouveau livre'
        },
        {
          pronoun: 'vieux',
          form: 'vieil (devant voyelle)',
          translation: 'un vieil homme, un vieux monsieur'
        }
      ]
    },
    {
      type: 'mistakesTable',
      title: 'Erreurs fréquentes',
      rows: [
        {
          wrong: 'une petite maison rouge',
          correct: 'une petite maison rouge',
          explanation: 'BAGS avant, couleur après'
        },
        {
          wrong: 'un homme beau',
          correct: 'un bel homme',
          explanation: 'BEAU se place avant + forme BEL devant voyelle'
        },
        {
          wrong: 'une fille intelligente et belle',
          correct: 'une belle fille intelligente',
          explanation: 'BAGS avant, autres après'
        }
      ]
    },
    {
      type: 'miniDialogue',
      title: 'Description d\'un appartement',
      lines: [
        {
          speaker: 'Agent',
          text: 'J\'ai un bel appartement à vous montrer.'
        },
        {
          speaker: 'Client',
          text: 'Il est grand ?'
        },
        {
          speaker: 'Agent',
          text: 'Oui, c\'est un grand appartement moderne avec une belle vue.'
        },
        {
          speaker: 'Client',
          text: 'Il y a combien de chambres ?'
        },
        {
          speaker: 'Agent',
          text: 'Trois grandes chambres lumineuses et une petite cuisine équipée.'
        },
        {
          speaker: 'Client',
          text: 'Et le quartier ?'
        },
        {
          speaker: 'Agent',
          text: 'C\'est un quartier calme avec de vieux arbres et de jolies rues.'
        }
      ],
      translation: 'Agent: I have a beautiful apartment to show you. | Client: Is it big? | Agent: Yes, it\'s a large modern apartment with a beautiful view. | Client: How many bedrooms? | Agent: Three large bright bedrooms and a small equipped kitchen. | Client: And the neighborhood? | Agent: It\'s a quiet neighborhood with old trees and pretty streets.'
    },
    {
      type: 'relatedTopics',
      links: [
        {
          title: 'Leçon 3: Le genre et le nombre',
          url: '/lessons?slug=le-genre-et-le-nombre-des-noms'
        }
      ]
    }
  ],

  blocks_en: [
    {
      type: 'mainTitle',
      text: 'Descriptive Adjectives'
    },
    {
      type: 'subtitle',
      text: 'Describing and Qualifying in French'
    },
    {
      type: 'quickSummary',
      title: 'Key Points',
      keyForms: [
        {
          form: 'Gender agreement',
          translation: 'petit → petite'
        },
        {
          form: 'Number agreement',
          translation: 'petit → petits'
        },
        {
          form: 'Position',
          translation: 'Before or after the noun'
        },
        {
          form: 'BAGS',
          translation: 'Beauty, Age, Goodness, Size (before noun)'
        }
      ]
    },
    {
      type: 'title',
      text: 'Adjective Agreement'
    },
    {
      type: 'paragraph',
      text: 'In French, adjectives agree in gender (masculine/feminine) and number (singular/plural) with the noun they modify.'
    },
    {
      type: 'conjugationTable',
      title: 'Feminine Formation',
      rows: [
        {
          pronoun: 'General rule',
          form: 'Masculine + e',
          translation: 'petit → petite, grand → grande'
        },
        {
          pronoun: 'Already ends in -e',
          form: 'No change',
          translation: 'jeune → jeune, rouge → rouge'
        },
        {
          pronoun: '-er → -ère',
          form: 'Change',
          translation: 'cher → chère, étranger → étrangère'
        },
        {
          pronoun: '-eux → -euse',
          form: 'Change',
          translation: 'heureux → heureuse, sérieux → sérieuse'
        },
        {
          pronoun: '-if → -ive',
          form: 'Change',
          translation: 'actif → active, sportif → sportive'
        },
        {
          pronoun: 'Doubling',
          form: '-el/-en/-on',
          translation: 'bon → bonne, ancien → ancienne',
          mnemonic: 'Double consonant + e'
        }
      ]
    },
    {
      type: 'conjugationTable',
      title: 'Plural Formation',
      rows: [
        {
          pronoun: 'General rule',
          form: '+ s',
          translation: 'petit → petits, grande → grandes'
        },
        {
          pronoun: 'Already ends in -s/-x',
          form: 'No change',
          translation: 'français → français, heureux → heureux'
        },
        {
          pronoun: '-eau → -eaux',
          form: 'Change',
          translation: 'beau → beaux, nouveau → nouveaux'
        }
      ]
    },
    {
      type: 'title',
      text: 'Position of Adjectives'
    },
    {
      type: 'paragraph',
      text: 'Most adjectives are placed AFTER the noun. But some short and frequent adjectives are placed BEFORE the noun.'
    },
    {
      type: 'usageList',
      title: 'Adjectives BEFORE the noun (BAGS)',
      items: [
        {
          usage: 'B = Beauty',
          examples: [
            'un beau tableau',
            'une jolie fille',
            'un joli jardin'
          ]
        },
        {
          usage: 'A = Age',
          examples: [
            'un jeune homme',
            'une vieille maison',
            'un nouveau livre'
          ]
        },
        {
          usage: 'G = Goodness',
          examples: [
            'un bon restaurant',
            'une mauvaise idée',
            'un gentil chien'
          ]
        },
        {
          usage: 'S = Size',
          examples: [
            'un grand appartement',
            'une petite voiture',
            'un gros problème'
          ]
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Adjectives AFTER the noun (majority)',
      items: [
        {
          usage: 'Color',
          examples: [
            'une voiture rouge',
            'des yeux bleus',
            'un chat noir'
          ]
        },
        {
          usage: 'Nationality',
          examples: [
            'un restaurant français',
            'une chanson italienne',
            'un film américain'
          ]
        },
        {
          usage: 'Shape',
          examples: [
            'une table ronde',
            'un objet carré',
            'une rue longue'
          ]
        }
      ]
    },
    {
      type: 'conjugationTable',
      title: 'Irregular masculine adjectives',
      rows: [
        {
          pronoun: 'beau',
          form: 'bel (before vowel)',
          translation: 'un bel homme, un beau garçon'
        },
        {
          pronoun: 'nouveau',
          form: 'nouvel (before vowel)',
          translation: 'un nouvel ami, un nouveau livre'
        },
        {
          pronoun: 'vieux',
          form: 'vieil (before vowel)',
          translation: 'un vieil homme, un vieux monsieur'
        }
      ]
    },
    {
      type: 'mistakesTable',
      title: 'Common Mistakes',
      rows: [
        {
          wrong: 'une rouge petite maison',
          correct: 'une petite maison rouge',
          explanation: 'BAGS before, color after'
        },
        {
          wrong: 'un homme beau',
          correct: 'un bel homme',
          explanation: 'BEAU goes before + form BEL before vowel'
        },
        {
          wrong: 'une fille intelligente et belle',
          correct: 'une belle fille intelligente',
          explanation: 'BAGS before, others after'
        }
      ]
    },
    {
      type: 'miniDialogue',
      title: 'Apartment Description',
      lines: [
        {
          speaker: 'Agent',
          text: 'J\'ai un bel appartement à vous montrer.'
        },
        {
          speaker: 'Client',
          text: 'Il est grand ?'
        },
        {
          speaker: 'Agent',
          text: 'Oui, c\'est un grand appartement moderne avec une belle vue.'
        },
        {
          speaker: 'Client',
          text: 'Il y a combien de chambres ?'
        },
        {
          speaker: 'Agent',
          text: 'Trois grandes chambres lumineuses et une petite cuisine équipée.'
        },
        {
          speaker: 'Client',
          text: 'Et le quartier ?'
        },
        {
          speaker: 'Agent',
          text: 'C\'est un quartier calme avec de vieux arbres et de jolies rues.'
        }
      ],
      translation: 'Agent: I have a beautiful apartment to show you. | Client: Is it big? | Agent: Yes, it\'s a large modern apartment with a beautiful view. | Client: How many bedrooms? | Agent: Three large bright bedrooms and a small equipped kitchen. | Client: And the neighborhood? | Agent: It\'s a quiet neighborhood with old trees and pretty streets.'
    },
    {
      type: 'relatedTopics',
      links: [
        {
          title: 'Lesson 3: Gender and Number',
          url: '/lessons?slug=le-genre-et-le-nombre-des-noms'
        }
      ]
    }
  ],

  blocks_ru: [
    {
      type: 'mainTitle',
      text: 'Качественные прилагательные'
    },
    {
      type: 'subtitle',
      text: 'Описание и характеристика по-французски'
    },
    {
      type: 'quickSummary',
      title: 'Ключевые моменты',
      keyForms: [
        {
          form: 'Согласование по роду',
          translation: 'petit → petite'
        },
        {
          form: 'Согласование по числу',
          translation: 'petit → petits'
        },
        {
          form: 'Позиция',
          translation: 'До или после существительного'
        },
        {
          form: 'BAGS',
          translation: 'Beauty, Age, Goodness, Size (до существительного)'
        }
      ]
    },
    {
      type: 'title',
      text: 'Согласование прилагательных'
    },
    {
      type: 'paragraph',
      text: 'Во французском языке прилагательные согласуются в роде (мужской/женский) и числе (единственное/множественное) с существительным, которое они определяют.'
    },
    {
      type: 'conjugationTable',
      title: 'Образование женского рода',
      rows: [
        {
          pronoun: 'Общее правило',
          form: 'Мужской род + e',
          translation: 'petit → petite, grand → grande'
        },
        {
          pronoun: 'Уже на -e',
          form: 'Без изменений',
          translation: 'jeune → jeune, rouge → rouge'
        },
        {
          pronoun: '-er → -ère',
          form: 'Изменение',
          translation: 'cher → chère, étranger → étrangère'
        },
        {
          pronoun: '-eux → -euse',
          form: 'Изменение',
          translation: 'heureux → heureuse, sérieux → sérieuse'
        },
        {
          pronoun: '-if → -ive',
          form: 'Изменение',
          translation: 'actif → active, sportif → sportive'
        },
        {
          pronoun: 'Удвоение',
          form: '-el/-en/-on',
          translation: 'bon → bonne, ancien → ancienne',
          mnemonic: 'Двойная согласная + e'
        }
      ]
    },
    {
      type: 'conjugationTable',
      title: 'Образование множественного числа',
      rows: [
        {
          pronoun: 'Общее правило',
          form: '+ s',
          translation: 'petit → petits, grande → grandes'
        },
        {
          pronoun: 'Уже на -s/-x',
          form: 'Без изменений',
          translation: 'français → français, heureux → heureux'
        },
        {
          pronoun: '-eau → -eaux',
          form: 'Изменение',
          translation: 'beau → beaux, nouveau → nouveaux'
        }
      ]
    },
    {
      type: 'title',
      text: 'Позиция прилагательных'
    },
    {
      type: 'paragraph',
      text: 'Большинство прилагательных ставятся ПОСЛЕ существительного. Но некоторые короткие и частотные прилагательные ставятся ДО существительного.'
    },
    {
      type: 'usageList',
      title: 'Прилагательные ДО существительного (BAGS)',
      items: [
        {
          usage: 'B = Beauty (красота)',
          examples: [
            'un beau tableau',
            'une jolie fille',
            'un joli jardin'
          ]
        },
        {
          usage: 'A = Age (возраст)',
          examples: [
            'un jeune homme',
            'une vieille maison',
            'un nouveau livre'
          ]
        },
        {
          usage: 'G = Goodness (качество)',
          examples: [
            'un bon restaurant',
            'une mauvaise idée',
            'un gentil chien'
          ]
        },
        {
          usage: 'S = Size (размер)',
          examples: [
            'un grand appartement',
            'une petite voiture',
            'un gros problème'
          ]
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Прилагательные ПОСЛЕ существительного (большинство)',
      items: [
        {
          usage: 'Цвет',
          examples: [
            'une voiture rouge',
            'des yeux bleus',
            'un chat noir'
          ]
        },
        {
          usage: 'Национальность',
          examples: [
            'un restaurant français',
            'une chanson italienne',
            'un film américain'
          ]
        },
        {
          usage: 'Форма',
          examples: [
            'une table ronde',
            'un objet carré',
            'une rue longue'
          ]
        }
      ]
    },
    {
      type: 'conjugationTable',
      title: 'Неправильные прилагательные мужского рода',
      rows: [
        {
          pronoun: 'beau',
          form: 'bel (перед гласной)',
          translation: 'un bel homme, un beau garçon'
        },
        {
          pronoun: 'nouveau',
          form: 'nouvel (перед гласной)',
          translation: 'un nouvel ami, un nouveau livre'
        },
        {
          pronoun: 'vieux',
          form: 'vieil (перед гласной)',
          translation: 'un vieil homme, un vieux monsieur'
        }
      ]
    },
    {
      type: 'mistakesTable',
      title: 'Типичные ошибки',
      rows: [
        {
          wrong: 'une rouge petite maison',
          correct: 'une petite maison rouge',
          explanation: 'BAGS до, цвет после'
        },
        {
          wrong: 'un homme beau',
          correct: 'un bel homme',
          explanation: 'BEAU ставится до + форма BEL перед гласной'
        },
        {
          wrong: 'une fille intelligente et belle',
          correct: 'une belle fille intelligente',
          explanation: 'BAGS до, другие после'
        }
      ]
    },
    {
      type: 'miniDialogue',
      title: 'Описание квартиры',
      lines: [
        {
          speaker: 'Агент',
          text: 'J\'ai un bel appartement à vous montrer.'
        },
        {
          speaker: 'Клиент',
          text: 'Il est grand ?'
        },
        {
          speaker: 'Агент',
          text: 'Oui, c\'est un grand appartement moderne avec une belle vue.'
        },
        {
          speaker: 'Клиент',
          text: 'Il y a combien de chambres ?'
        },
        {
          speaker: 'Агент',
          text: 'Trois grandes chambres lumineuses et une petite cuisine équipée.'
        },
        {
          speaker: 'Клиент',
          text: 'Et le quartier ?'
        },
        {
          speaker: 'Агент',
          text: 'C\'est un quartier calme avec de vieux arbres et de jolies rues.'
        }
      ],
      translation: 'Агент: У меня есть красивая квартира, которую я хочу вам показать. | Клиент: Она большая? | Агент: Да, это большая современная квартира с красивым видом. | Клиент: Сколько комнат? | Агент: Три большие светлые спальни и маленькая оборудованная кухня. | Клиент: А район? | Агент: Это тихий район со старыми деревьями и красивыми улицами.'
    },
    {
      type: 'relatedTopics',
      links: [
        {
          title: 'Урок 3: Род и число',
          url: '/lessons?slug=le-genre-et-le-nombre-des-noms'
        }
      ]
    }
  ]
};

// Leçon 14: Les prépositions de lieu
const lesson14Content = {
  blocks_fr: [
    {
      type: 'mainTitle',
      text: 'Les prépositions de lieu'
    },
    {
      type: 'subtitle',
      text: 'Localiser et situer en français'
    },
    {
      type: 'quickSummary',
      title: 'Points clés',
      keyForms: [
        {
          form: 'à / en / au',
          translation: 'Villes et pays'
        },
        {
          form: 'dans / sur / sous',
          translation: 'Position d\'objets'
        },
        {
          form: 'devant / derrière',
          translation: 'Position relative'
        },
        {
          form: 'chez',
          translation: 'Chez + personne'
        }
      ]
    },
    {
      type: 'title',
      text: 'Prépositions simples'
    },
    {
      type: 'conjugationTable',
      title: 'Prépositions de base',
      rows: [
        {
          pronoun: 'dans',
          form: 'dans la boîte',
          translation: 'in (inside)',
          pronunciation: 'À l\'intérieur'
        },
        {
          pronoun: 'sur',
          form: 'sur la table',
          translation: 'on (on top)',
          pronunciation: 'Sur la surface'
        },
        {
          pronoun: 'sous',
          form: 'sous le lit',
          translation: 'under',
          pronunciation: 'En dessous'
        },
        {
          pronoun: 'devant',
          form: 'devant la maison',
          translation: 'in front of',
          pronunciation: 'Face à'
        },
        {
          pronoun: 'derrière',
          form: 'derrière la porte',
          translation: 'behind'
        },
        {
          pronoun: 'entre',
          form: 'entre le lit et l\'armoire',
          translation: 'between'
        },
        {
          pronoun: 'à côté de',
          form: 'à côté de la fenêtre',
          translation: 'next to, beside'
        }
      ]
    },
    {
      type: 'title',
      text: 'Prépositions avec villes et pays'
    },
    {
      type: 'paragraph',
      text: 'Les règles sont différentes selon qu\'on parle d\'une ville ou d\'un pays, et selon le genre du pays.'
    },
    {
      type: 'usageList',
      title: 'Règles pour les villes',
      items: [
        {
          usage: 'À + ville',
          examples: [
            'J\'habite à Paris.',
            'Je vais à Londres.',
            'Elle travaille à Berlin.'
          ]
        },
        {
          usage: 'De + ville (provenance)',
          examples: [
            'Je viens de Paris.',
            'Il arrive de Tokyo.',
            'Nous rentrons de Lyon.'
          ]
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Règles pour les pays',
      items: [
        {
          usage: 'EN + pays féminin (terminant par -e)',
          examples: [
            'J\'habite en France. (la France)',
            'Je vais en Espagne. (l\'Espagne)',
            'Elle travaille en Italie. (l\'Italie)'
          ],
          commonMistake: {
            wrong: 'Je vais à la France',
            correct: 'Je vais en France'
          }
        },
        {
          usage: 'AU + pays masculin singulier',
          examples: [
            'Il habite au Japon. (le Japon)',
            'Je vais au Canada. (le Canada)',
            'Elle est au Brésil. (le Brésil)'
          ]
        },
        {
          usage: 'AUX + pays pluriel',
          examples: [
            'Ils habitent aux États-Unis. (les États-Unis)',
            'Je vais aux Pays-Bas. (les Pays-Bas)'
          ]
        },
        {
          usage: 'DE/DU/DES (provenance)',
          examples: [
            'Je viens de France.',
            'Il arrive du Canada.',
            'Nous rentrons des États-Unis.'
          ]
        }
      ]
    },
    {
      type: 'conjugationTable',
      title: 'Exceptions: pays masculins commençant par voyelle',
      rows: [
        {
          pronoun: 'en Iran',
          form: 'en Irak',
          translation: 'EN (pas AU) car commence par voyelle'
        },
        {
          pronoun: 'en Israël',
          form: 'en Afghanistan',
          translation: 'EN également'
        }
      ]
    },
    {
      type: 'title',
      text: 'CHEZ + personne'
    },
    {
      type: 'usageList',
      title: 'Utilisation de CHEZ',
      items: [
        {
          usage: 'Chez + personne (à la maison de)',
          examples: [
            'Je vais chez Marie. (to Marie\'s place)',
            'Tu es chez toi ? (at your place)',
            'Nous sommes chez mes parents. (at my parents\' place)'
          ]
        },
        {
          usage: 'Chez + profession',
          examples: [
            'Je vais chez le médecin. (to the doctor\'s)',
            'Elle est chez le coiffeur. (at the hairdresser\'s)',
            'Nous allons chez le dentiste.'
          ]
        }
      ]
    },
    {
      type: 'mistakesTable',
      title: 'Erreurs fréquentes',
      rows: [
        {
          wrong: 'Je vais à France',
          correct: 'Je vais en France',
          explanation: 'EN + pays féminin, pas À'
        },
        {
          wrong: 'J\'habite dans Paris',
          correct: 'J\'habite à Paris',
          explanation: 'À + ville, pas DANS'
        },
        {
          wrong: 'Je vais à la maison de Pierre',
          correct: 'Je vais chez Pierre',
          explanation: 'CHEZ + personne'
        },
        {
          wrong: 'en Canada',
          correct: 'au Canada',
          explanation: 'AU + pays masculin'
        }
      ]
    },
    {
      type: 'miniDialogue',
      title: 'Chercher les clés',
      lines: [
        {
          speaker: 'Thomas',
          text: 'Où sont mes clés ?'
        },
        {
          speaker: 'Marie',
          text: 'Elles sont sur la table.'
        },
        {
          speaker: 'Thomas',
          text: 'Non, elles ne sont pas sur la table.'
        },
        {
          speaker: 'Marie',
          text: 'Regarde dans ton sac, ou sous les papiers.'
        },
        {
          speaker: 'Thomas',
          text: 'Ah, elles sont dans ma veste ! Et toi, tu vas où ?'
        },
        {
          speaker: 'Marie',
          text: 'Je vais chez le médecin, puis à la pharmacie.'
        },
        {
          speaker: 'Thomas',
          text: 'D\'accord. Après, tu rentres à la maison ?'
        },
        {
          speaker: 'Marie',
          text: 'Non, je vais chez mes parents à Lyon.'
        }
      ],
      translation: 'Thomas: Where are my keys? | Marie: They\'re on the table. | Thomas: No, they\'re not on the table. | Marie: Look in your bag, or under the papers. | Thomas: Ah, they\'re in my jacket! And you, where are you going? | Marie: I\'m going to the doctor\'s, then to the pharmacy. | Thomas: Okay. After, you\'re coming home? | Marie: No, I\'m going to my parents\' place in Lyon.'
    },
    {
      type: 'relatedTopics',
      links: [
        {
          title: 'Leçon 2: Les articles',
          url: '/lessons?slug=les-articles'
        }
      ]
    }
  ],

  blocks_en: [
    {
      type: 'mainTitle',
      text: 'Prepositions of Place'
    },
    {
      type: 'subtitle',
      text: 'Locating and Positioning in French'
    },
    {
      type: 'quickSummary',
      title: 'Key Points',
      keyForms: [
        {
          form: 'à / en / au',
          translation: 'Cities and countries'
        },
        {
          form: 'dans / sur / sous',
          translation: 'Object position'
        },
        {
          form: 'devant / derrière',
          translation: 'Relative position'
        },
        {
          form: 'chez',
          translation: 'Chez + person'
        }
      ]
    },
    {
      type: 'title',
      text: 'Simple Prepositions'
    },
    {
      type: 'conjugationTable',
      title: 'Basic Prepositions',
      rows: [
        {
          pronoun: 'dans',
          form: 'dans la boîte',
          translation: 'in (inside)',
          pronunciation: 'Inside'
        },
        {
          pronoun: 'sur',
          form: 'sur la table',
          translation: 'on (on top)',
          pronunciation: 'On the surface'
        },
        {
          pronoun: 'sous',
          form: 'sous le lit',
          translation: 'under',
          pronunciation: 'Below'
        },
        {
          pronoun: 'devant',
          form: 'devant la maison',
          translation: 'in front of',
          pronunciation: 'Facing'
        },
        {
          pronoun: 'derrière',
          form: 'derrière la porte',
          translation: 'behind'
        },
        {
          pronoun: 'entre',
          form: 'entre le lit et l\'armoire',
          translation: 'between'
        },
        {
          pronoun: 'à côté de',
          form: 'à côté de la fenêtre',
          translation: 'next to, beside'
        }
      ]
    },
    {
      type: 'title',
      text: 'Prepositions with Cities and Countries'
    },
    {
      type: 'paragraph',
      text: 'The rules differ depending on whether you\'re talking about a city or country, and the gender of the country.'
    },
    {
      type: 'usageList',
      title: 'Rules for Cities',
      items: [
        {
          usage: 'À + city',
          examples: [
            'J\'habite à Paris.',
            'Je vais à Londres.',
            'Elle travaille à Berlin.'
          ]
        },
        {
          usage: 'De + city (origin)',
          examples: [
            'Je viens de Paris.',
            'Il arrive de Tokyo.',
            'Nous rentrons de Lyon.'
          ]
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Rules for Countries',
      items: [
        {
          usage: 'EN + feminine country (ending in -e)',
          examples: [
            'J\'habite en France. (la France)',
            'Je vais en Espagne. (l\'Espagne)',
            'Elle travaille en Italie. (l\'Italie)'
          ],
          commonMistake: {
            wrong: 'Je vais à la France',
            correct: 'Je vais en France'
          }
        },
        {
          usage: 'AU + masculine singular country',
          examples: [
            'Il habite au Japon. (le Japon)',
            'Je vais au Canada. (le Canada)',
            'Elle est au Brésil. (le Brésil)'
          ]
        },
        {
          usage: 'AUX + plural country',
          examples: [
            'Ils habitent aux États-Unis. (les États-Unis)',
            'Je vais aux Pays-Bas. (les Pays-Bas)'
          ]
        },
        {
          usage: 'DE/DU/DES (origin)',
          examples: [
            'Je viens de France.',
            'Il arrive du Canada.',
            'Nous rentrons des États-Unis.'
          ]
        }
      ]
    },
    {
      type: 'conjugationTable',
      title: 'Exceptions: masculine countries starting with vowel',
      rows: [
        {
          pronoun: 'en Iran',
          form: 'en Irak',
          translation: 'EN (not AU) because starts with vowel'
        },
        {
          pronoun: 'en Israël',
          form: 'en Afghanistan',
          translation: 'EN as well'
        }
      ]
    },
    {
      type: 'title',
      text: 'CHEZ + person'
    },
    {
      type: 'usageList',
      title: 'Using CHEZ',
      items: [
        {
          usage: 'Chez + person (at someone\'s place)',
          examples: [
            'Je vais chez Marie. (to Marie\'s place)',
            'Tu es chez toi ? (at your place)',
            'Nous sommes chez mes parents. (at my parents\' place)'
          ]
        },
        {
          usage: 'Chez + profession',
          examples: [
            'Je vais chez le médecin. (to the doctor\'s)',
            'Elle est chez le coiffeur. (at the hairdresser\'s)',
            'Nous allons chez le dentiste.'
          ]
        }
      ]
    },
    {
      type: 'mistakesTable',
      title: 'Common Mistakes',
      rows: [
        {
          wrong: 'Je vais à France',
          correct: 'Je vais en France',
          explanation: 'EN + feminine country, not À'
        },
        {
          wrong: 'J\'habite dans Paris',
          correct: 'J\'habite à Paris',
          explanation: 'À + city, not DANS'
        },
        {
          wrong: 'Je vais à la maison de Pierre',
          correct: 'Je vais chez Pierre',
          explanation: 'CHEZ + person'
        },
        {
          wrong: 'en Canada',
          correct: 'au Canada',
          explanation: 'AU + masculine country'
        }
      ]
    },
    {
      type: 'miniDialogue',
      title: 'Looking for Keys',
      lines: [
        {
          speaker: 'Thomas',
          text: 'Où sont mes clés ?'
        },
        {
          speaker: 'Marie',
          text: 'Elles sont sur la table.'
        },
        {
          speaker: 'Thomas',
          text: 'Non, elles ne sont pas sur la table.'
        },
        {
          speaker: 'Marie',
          text: 'Regarde dans ton sac, ou sous les papiers.'
        },
        {
          speaker: 'Thomas',
          text: 'Ah, elles sont dans ma veste ! Et toi, tu vas où ?'
        },
        {
          speaker: 'Marie',
          text: 'Je vais chez le médecin, puis à la pharmacie.'
        },
        {
          speaker: 'Thomas',
          text: 'D\'accord. Après, tu rentres à la maison ?'
        },
        {
          speaker: 'Marie',
          text: 'Non, je vais chez mes parents à Lyon.'
        }
      ],
      translation: 'Thomas: Where are my keys? | Marie: They\'re on the table. | Thomas: No, they\'re not on the table. | Marie: Look in your bag, or under the papers. | Thomas: Ah, they\'re in my jacket! And you, where are you going? | Marie: I\'m going to the doctor\'s, then to the pharmacy. | Thomas: Okay. After, you\'re coming home? | Marie: No, I\'m going to my parents\' place in Lyon.'
    },
    {
      type: 'relatedTopics',
      links: [
        {
          title: 'Lesson 2: Articles',
          url: '/lessons?slug=les-articles'
        }
      ]
    }
  ],

  blocks_ru: [
    {
      type: 'mainTitle',
      text: 'Предлоги места'
    },
    {
      type: 'subtitle',
      text: 'Локализация и определение местоположения по-французски'
    },
    {
      type: 'quickSummary',
      title: 'Ключевые моменты',
      keyForms: [
        {
          form: 'à / en / au',
          translation: 'Города и страны'
        },
        {
          form: 'dans / sur / sous',
          translation: 'Положение предметов'
        },
        {
          form: 'devant / derrière',
          translation: 'Относительное положение'
        },
        {
          form: 'chez',
          translation: 'Chez + человек'
        }
      ]
    },
    {
      type: 'title',
      text: 'Простые предлоги'
    },
    {
      type: 'conjugationTable',
      title: 'Базовые предлоги',
      rows: [
        {
          pronoun: 'dans',
          form: 'dans la boîte',
          translation: 'в (внутри)',
          pronunciation: 'Внутри'
        },
        {
          pronoun: 'sur',
          form: 'sur la table',
          translation: 'на (поверх)',
          pronunciation: 'На поверхности'
        },
        {
          pronoun: 'sous',
          form: 'sous le lit',
          translation: 'под',
          pronunciation: 'Снизу'
        },
        {
          pronoun: 'devant',
          form: 'devant la maison',
          translation: 'перед',
          pronunciation: 'Лицом к'
        },
        {
          pronoun: 'derrière',
          form: 'derrière la porte',
          translation: 'за, позади'
        },
        {
          pronoun: 'entre',
          form: 'entre le lit et l\'armoire',
          translation: 'между'
        },
        {
          pronoun: 'à côté de',
          form: 'à côté de la fenêtre',
          translation: 'рядом с'
        }
      ]
    },
    {
      type: 'title',
      text: 'Предлоги с городами и странами'
    },
    {
      type: 'paragraph',
      text: 'Правила различаются в зависимости от того, говорим мы о городе или стране, и от рода страны.'
    },
    {
      type: 'usageList',
      title: 'Правила для городов',
      items: [
        {
          usage: 'À + город',
          examples: [
            'J\'habite à Paris.',
            'Je vais à Londres.',
            'Elle travaille à Berlin.'
          ]
        },
        {
          usage: 'De + город (происхождение)',
          examples: [
            'Je viens de Paris.',
            'Il arrive de Tokyo.',
            'Nous rentrons de Lyon.'
          ]
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Правила для стран',
      items: [
        {
          usage: 'EN + страна женского рода (оканчивается на -e)',
          examples: [
            'J\'habite en France. (la France)',
            'Je vais en Espagne. (l\'Espagne)',
            'Elle travaille en Italie. (l\'Italie)'
          ],
          commonMistake: {
            wrong: 'Je vais à la France',
            correct: 'Je vais en France'
          }
        },
        {
          usage: 'AU + страна мужского рода единственного числа',
          examples: [
            'Il habite au Japon. (le Japon)',
            'Je vais au Canada. (le Canada)',
            'Elle est au Brésil. (le Brésil)'
          ]
        },
        {
          usage: 'AUX + страна множественного числа',
          examples: [
            'Ils habitent aux États-Unis. (les États-Unis)',
            'Je vais aux Pays-Bas. (les Pays-Bas)'
          ]
        },
        {
          usage: 'DE/DU/DES (происхождение)',
          examples: [
            'Je viens de France.',
            'Il arrive du Canada.',
            'Nous rentrons des États-Unis.'
          ]
        }
      ]
    },
    {
      type: 'conjugationTable',
      title: 'Исключения: страны мужского рода, начинающиеся с гласной',
      rows: [
        {
          pronoun: 'en Iran',
          form: 'en Irak',
          translation: 'EN (не AU) так как начинается с гласной'
        },
        {
          pronoun: 'en Israël',
          form: 'en Afghanistan',
          translation: 'EN также'
        }
      ]
    },
    {
      type: 'title',
      text: 'CHEZ + человек'
    },
    {
      type: 'usageList',
      title: 'Использование CHEZ',
      items: [
        {
          usage: 'Chez + человек (у кого-то дома)',
          examples: [
            'Je vais chez Marie. (к Мари)',
            'Tu es chez toi ? (ты дома?)',
            'Nous sommes chez mes parents. (мы у моих родителей)'
          ]
        },
        {
          usage: 'Chez + профессия',
          examples: [
            'Je vais chez le médecin. (к врачу)',
            'Elle est chez le coiffeur. (у парикмахера)',
            'Nous allons chez le dentiste. (к стоматологу)'
          ]
        }
      ]
    },
    {
      type: 'mistakesTable',
      title: 'Типичные ошибки',
      rows: [
        {
          wrong: 'Je vais à France',
          correct: 'Je vais en France',
          explanation: 'EN + страна женского рода, не À'
        },
        {
          wrong: 'J\'habite dans Paris',
          correct: 'J\'habite à Paris',
          explanation: 'À + город, не DANS'
        },
        {
          wrong: 'Je vais à la maison de Pierre',
          correct: 'Je vais chez Pierre',
          explanation: 'CHEZ + человек'
        },
        {
          wrong: 'en Canada',
          correct: 'au Canada',
          explanation: 'AU + страна мужского рода'
        }
      ]
    },
    {
      type: 'miniDialogue',
      title: 'Поиск ключей',
      lines: [
        {
          speaker: 'Тома',
          text: 'Où sont mes clés ?'
        },
        {
          speaker: 'Мари',
          text: 'Elles sont sur la table.'
        },
        {
          speaker: 'Тома',
          text: 'Non, elles ne sont pas sur la table.'
        },
        {
          speaker: 'Мари',
          text: 'Regarde dans ton sac, ou sous les papiers.'
        },
        {
          speaker: 'Тома',
          text: 'Ah, elles sont dans ma veste ! Et toi, tu vas où ?'
        },
        {
          speaker: 'Мари',
          text: 'Je vais chez le médecin, puis à la pharmacie.'
        },
        {
          speaker: 'Тома',
          text: 'D\'accord. Après, tu rentres à la maison ?'
        },
        {
          speaker: 'Мари',
          text: 'Non, je vais chez mes parents à Lyon.'
        }
      ],
      translation: 'Тома: Где мои ключи? | Мари: Они на столе. | Тома: Нет, их нет на столе. | Мари: Посмотри в сумке или под бумагами. | Тома: А, они в моей куртке! А ты куда идёшь? | Мари: Я иду к врачу, потом в аптеку. | Тома: Хорошо. Потом домой вернёшься? | Мари: Нет, я поеду к родителям в Лион.'
    },
    {
      type: 'relatedTopics',
      links: [
        {
          title: 'Урок 2: Артикли',
          url: '/lessons?slug=les-articles'
        }
      ]
    }
  ]
};

// Leçon 15: Les nombres et l'heure
const lesson15Content = {
  blocks_fr: [
    {
      type: 'mainTitle',
      text: 'Les nombres et l\'heure'
    },
    {
      type: 'subtitle',
      text: 'Compter et dire l\'heure en français'
    },
    {
      type: 'quickSummary',
      title: 'Points clés',
      keyForms: [
        {
          form: '0-100',
          translation: 'Nombres cardinaux'
        },
        {
          form: 'Il est... heures',
          translation: 'Dire l\'heure'
        },
        {
          form: 'et quart / et demie / moins le quart',
          translation: 'Fractions d\'heure'
        },
        {
          form: '12h / 24h',
          translation: 'Deux systèmes'
        }
      ]
    },
    {
      type: 'title',
      text: 'Les nombres de 0 à 100'
    },
    {
      type: 'conjugationTable',
      title: '0-20',
      rows: [
        { pronoun: '0', form: 'zéro', pronunciation: '[zeʁo]' },
        { pronoun: '1', form: 'un', pronunciation: '[œ̃]' },
        { pronoun: '2', form: 'deux', pronunciation: '[dø]' },
        { pronoun: '3', form: 'trois', pronunciation: '[tʁwa]' },
        { pronoun: '4', form: 'quatre', pronunciation: '[katʁ]' },
        { pronoun: '5', form: 'cinq', pronunciation: '[sɛ̃k]' },
        { pronoun: '6', form: 'six', pronunciation: '[sis]' },
        { pronoun: '7', form: 'sept', pronunciation: '[sɛt]' },
        { pronoun: '8', form: 'huit', pronunciation: '[ɥit]' },
        { pronoun: '9', form: 'neuf', pronunciation: '[nœf]' },
        { pronoun: '10', form: 'dix', pronunciation: '[dis]' }
      ]
    },
    {
      type: 'conjugationTable',
      title: '11-20',
      rows: [
        { pronoun: '11', form: 'onze', pronunciation: '[ɔ̃z]' },
        { pronoun: '12', form: 'douze', pronunciation: '[duz]' },
        { pronoun: '13', form: 'treize', pronunciation: '[tʁɛz]' },
        { pronoun: '14', form: 'quatorze', pronunciation: '[katɔʁz]' },
        { pronoun: '15', form: 'quinze', pronunciation: '[kɛ̃z]' },
        { pronoun: '16', form: 'seize', pronunciation: '[sɛz]' },
        { pronoun: '17', form: 'dix-sept', pronunciation: '[dis sɛt]' },
        { pronoun: '18', form: 'dix-huit', pronunciation: '[diz ɥit]' },
        { pronoun: '19', form: 'dix-neuf', pronunciation: '[diz nœf]' },
        { pronoun: '20', form: 'vingt', pronunciation: '[vɛ̃]' }
      ]
    },
    {
      type: 'usageList',
      title: 'Dizaines et construction',
      items: [
        {
          usage: '20-69: Addition simple',
          examples: [
            '21 = vingt et un',
            '32 = trente-deux',
            '45 = quarante-cinq',
            '58 = cinquante-huit'
          ]
        },
        {
          usage: '70-79: Soixante + 10-19',
          examples: [
            '70 = soixante-dix',
            '71 = soixante et onze',
            '75 = soixante-quinze',
            '79 = soixante-dix-neuf'
          ],
          commonMistake: {
            wrong: 'septante (Belgique/Suisse)',
            correct: 'soixante-dix (France)'
          }
        },
        {
          usage: '80-99: Quatre-vingts + 0-19',
          examples: [
            '80 = quatre-vingts',
            '81 = quatre-vingt-un (pas de -s)',
            '90 = quatre-vingt-dix',
            '99 = quatre-vingt-dix-neuf'
          ],
          commonMistake: {
            wrong: 'nonante (Belgique/Suisse)',
            correct: 'quatre-vingt-dix (France)'
          }
        },
        {
          usage: '100',
          examples: [
            '100 = cent'
          ]
        }
      ]
    },
    {
      type: 'title',
      text: 'Dire l\'heure'
    },
    {
      type: 'paragraph',
      text: 'En français, on utilise "Il est" + heure(s). Les Français utilisent souvent le système 24h pour les horaires officiels.'
    },
    {
      type: 'conjugationTable',
      title: 'Structure de base',
      rows: [
        {
          pronoun: '1:00',
          form: 'Il est une heure',
          translation: 'It\'s 1 o\'clock',
          mnemonic: 'UNE heure (singulier)'
        },
        {
          pronoun: '2:00',
          form: 'Il est deux heures',
          translation: 'It\'s 2 o\'clock',
          mnemonic: 'HEURES (pluriel à partir de 2)'
        },
        {
          pronoun: '12:00',
          form: 'Il est midi / minuit',
          translation: 'It\'s noon / midnight',
          mnemonic: 'Pas "douze heures"'
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Minutes et quarts d\'heure',
      items: [
        {
          usage: 'Minutes (0-30)',
          examples: [
            '2:05 = Il est deux heures cinq',
            '3:10 = Il est trois heures dix',
            '4:15 = Il est quatre heures et quart',
            '5:30 = Il est cinq heures et demie'
          ]
        },
        {
          usage: 'Minutes (31-59) - MOINS',
          examples: [
            '6:45 = Il est sept heures moins le quart',
            '7:50 = Il est huit heures moins dix',
            '8:55 = Il est neuf heures moins cinq'
          ],
          commonMistake: {
            wrong: 'Il est six heures quarante-cinq',
            correct: 'Il est sept heures moins le quart (plus naturel)'
          }
        }
      ]
    },
    {
      type: 'conjugationTable',
      title: 'Système 24 heures (horaires officiels)',
      rows: [
        {
          pronoun: '14:00',
          form: 'quatorze heures',
          translation: '2:00 PM'
        },
        {
          pronoun: '18:30',
          form: 'dix-huit heures trente',
          translation: '6:30 PM'
        },
        {
          pronoun: '21:45',
          form: 'vingt et une heures quarante-cinq',
          translation: '9:45 PM',
          mnemonic: 'Pas de "moins" en système 24h'
        },
        {
          pronoun: '23:50',
          form: 'vingt-trois heures cinquante',
          translation: '11:50 PM'
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Moments de la journée',
      items: [
        {
          usage: 'Demander l\'heure',
          examples: [
            'Quelle heure est-il ?',
            'Tu as l\'heure ?',
            'Il est quelle heure ?'
          ]
        },
        {
          usage: 'Préciser le moment',
          examples: [
            'du matin (8h00 = huit heures du matin)',
            'de l\'après-midi (14h00 = deux heures de l\'après-midi)',
            'du soir (20h00 = huit heures du soir)'
          ]
        },
        {
          usage: 'Dire "à + heure"',
          examples: [
            'Le train part à 15h30.',
            'Le cours commence à neuf heures.',
            'Je travaille de 9h à 17h.'
          ]
        }
      ]
    },
    {
      type: 'mistakesTable',
      title: 'Erreurs fréquentes',
      rows: [
        {
          wrong: 'Il est deux heure',
          correct: 'Il est deux heures',
          explanation: 'HEURES au pluriel à partir de 2'
        },
        {
          wrong: 'Il est trois heures et demi',
          correct: 'Il est trois heures et demie',
          explanation: 'DEMIE s\'accorde'
        },
        {
          wrong: 'Il est six heures quarante-cinq',
          correct: 'Il est sept heures moins le quart',
          explanation: 'Plus naturel en conversation'
        },
        {
          wrong: 'Il est douze heures (midi)',
          correct: 'Il est midi',
          explanation: 'Utilisez "midi" ou "minuit"'
        }
      ]
    },
    {
      type: 'miniDialogue',
      title: 'Prendre rendez-vous',
      lines: [
        {
          speaker: 'Secrétaire',
          text: 'Cabinet du Dr Martin, bonjour.'
        },
        {
          speaker: 'Client',
          text: 'Bonjour, je voudrais prendre rendez-vous.'
        },
        {
          speaker: 'Secrétaire',
          text: 'Quand êtes-vous disponible ?'
        },
        {
          speaker: 'Client',
          text: 'Mardi après-midi, si possible.'
        },
        {
          speaker: 'Secrétaire',
          text: 'J\'ai un créneau à quatorze heures trente ou seize heures.'
        },
        {
          speaker: 'Client',
          text: 'Seize heures, c\'est parfait. C\'est à quelle adresse ?'
        },
        {
          speaker: 'Secrétaire',
          text: '12 rue Victor Hugo. Arrivez cinq minutes avant.'
        }
      ],
      translation: 'Secretary: Dr Martin\'s office, hello. | Client: Hello, I\'d like to make an appointment. | Secretary: When are you available? | Client: Tuesday afternoon, if possible. | Secretary: I have a slot at 2:30 PM or 4:00 PM. | Client: 4:00 PM is perfect. What\'s the address? | Secretary: 12 Victor Hugo Street. Arrive five minutes early.'
    },
    {
      type: 'relatedTopics',
      links: [
        {
          title: 'Leçon 6: Verbes en -ER',
          url: '/lessons?slug=verbes-er-partie-1'
        }
      ]
    }
  ],

  blocks_en: [
    {
      type: 'mainTitle',
      text: 'Numbers and Time'
    },
    {
      type: 'subtitle',
      text: 'Counting and Telling Time in French'
    },
    {
      type: 'quickSummary',
      title: 'Key Points',
      keyForms: [
        {
          form: '0-100',
          translation: 'Cardinal numbers'
        },
        {
          form: 'Il est... heures',
          translation: 'Telling time'
        },
        {
          form: 'et quart / et demie / moins le quart',
          translation: 'Hour fractions'
        },
        {
          form: '12h / 24h',
          translation: 'Two systems'
        }
      ]
    },
    {
      type: 'title',
      text: 'Numbers 0-100'
    },
    {
      type: 'conjugationTable',
      title: '0-20',
      rows: [
        { pronoun: '0', form: 'zéro', pronunciation: '[zeʁo]' },
        { pronoun: '1', form: 'un', pronunciation: '[œ̃]' },
        { pronoun: '2', form: 'deux', pronunciation: '[dø]' },
        { pronoun: '3', form: 'trois', pronunciation: '[tʁwa]' },
        { pronoun: '4', form: 'quatre', pronunciation: '[katʁ]' },
        { pronoun: '5', form: 'cinq', pronunciation: '[sɛ̃k]' },
        { pronoun: '6', form: 'six', pronunciation: '[sis]' },
        { pronoun: '7', form: 'sept', pronunciation: '[sɛt]' },
        { pronoun: '8', form: 'huit', pronunciation: '[ɥit]' },
        { pronoun: '9', form: 'neuf', pronunciation: '[nœf]' },
        { pronoun: '10', form: 'dix', pronunciation: '[dis]' }
      ]
    },
    {
      type: 'conjugationTable',
      title: '11-20',
      rows: [
        { pronoun: '11', form: 'onze', pronunciation: '[ɔ̃z]' },
        { pronoun: '12', form: 'douze', pronunciation: '[duz]' },
        { pronoun: '13', form: 'treize', pronunciation: '[tʁɛz]' },
        { pronoun: '14', form: 'quatorze', pronunciation: '[katɔʁz]' },
        { pronoun: '15', form: 'quinze', pronunciation: '[kɛ̃z]' },
        { pronoun: '16', form: 'seize', pronunciation: '[sɛz]' },
        { pronoun: '17', form: 'dix-sept', pronunciation: '[dis sɛt]' },
        { pronoun: '18', form: 'dix-huit', pronunciation: '[diz ɥit]' },
        { pronoun: '19', form: 'dix-neuf', pronunciation: '[diz nœf]' },
        { pronoun: '20', form: 'vingt', pronunciation: '[vɛ̃]' }
      ]
    },
    {
      type: 'usageList',
      title: 'Tens and Construction',
      items: [
        {
          usage: '20-69: Simple addition',
          examples: [
            '21 = vingt et un',
            '32 = trente-deux',
            '45 = quarante-cinq',
            '58 = cinquante-huit'
          ]
        },
        {
          usage: '70-79: Sixty + 10-19',
          examples: [
            '70 = soixante-dix',
            '71 = soixante et onze',
            '75 = soixante-quinze',
            '79 = soixante-dix-neuf'
          ],
          commonMistake: {
            wrong: 'septante (Belgium/Switzerland)',
            correct: 'soixante-dix (France)'
          }
        },
        {
          usage: '80-99: Four-twenties + 0-19',
          examples: [
            '80 = quatre-vingts',
            '81 = quatre-vingt-un (no -s)',
            '90 = quatre-vingt-dix',
            '99 = quatre-vingt-dix-neuf'
          ],
          commonMistake: {
            wrong: 'nonante (Belgium/Switzerland)',
            correct: 'quatre-vingt-dix (France)'
          }
        },
        {
          usage: '100',
          examples: [
            '100 = cent'
          ]
        }
      ]
    },
    {
      type: 'title',
      text: 'Telling Time'
    },
    {
      type: 'paragraph',
      text: 'In French, use "Il est" + hour(s). French people often use the 24h system for official schedules.'
    },
    {
      type: 'conjugationTable',
      title: 'Basic Structure',
      rows: [
        {
          pronoun: '1:00',
          form: 'Il est une heure',
          translation: 'It\'s 1 o\'clock',
          mnemonic: 'UNE heure (singular)'
        },
        {
          pronoun: '2:00',
          form: 'Il est deux heures',
          translation: 'It\'s 2 o\'clock',
          mnemonic: 'HEURES (plural from 2)'
        },
        {
          pronoun: '12:00',
          form: 'Il est midi / minuit',
          translation: 'It\'s noon / midnight',
          mnemonic: 'Not "douze heures"'
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Minutes and Quarter Hours',
      items: [
        {
          usage: 'Minutes (0-30)',
          examples: [
            '2:05 = Il est deux heures cinq',
            '3:10 = Il est trois heures dix',
            '4:15 = Il est quatre heures et quart',
            '5:30 = Il est cinq heures et demie'
          ]
        },
        {
          usage: 'Minutes (31-59) - MOINS',
          examples: [
            '6:45 = Il est sept heures moins le quart',
            '7:50 = Il est huit heures moins dix',
            '8:55 = Il est neuf heures moins cinq'
          ],
          commonMistake: {
            wrong: 'Il est six heures quarante-cinq',
            correct: 'Il est sept heures moins le quart (more natural)'
          }
        }
      ]
    },
    {
      type: 'conjugationTable',
      title: '24-hour System (official schedules)',
      rows: [
        {
          pronoun: '14:00',
          form: 'quatorze heures',
          translation: '2:00 PM'
        },
        {
          pronoun: '18:30',
          form: 'dix-huit heures trente',
          translation: '6:30 PM'
        },
        {
          pronoun: '21:45',
          form: 'vingt et une heures quarante-cinq',
          translation: '9:45 PM',
          mnemonic: 'No "moins" in 24h system'
        },
        {
          pronoun: '23:50',
          form: 'vingt-trois heures cinquante',
          translation: '11:50 PM'
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Times of Day',
      items: [
        {
          usage: 'Asking the time',
          examples: [
            'Quelle heure est-il ?',
            'Tu as l\'heure ?',
            'Il est quelle heure ?'
          ]
        },
        {
          usage: 'Specifying the moment',
          examples: [
            'du matin (8h00 = huit heures du matin)',
            'de l\'après-midi (14h00 = deux heures de l\'après-midi)',
            'du soir (20h00 = huit heures du soir)'
          ]
        },
        {
          usage: 'Saying "at + time"',
          examples: [
            'Le train part à 15h30.',
            'Le cours commence à neuf heures.',
            'Je travaille de 9h à 17h.'
          ]
        }
      ]
    },
    {
      type: 'mistakesTable',
      title: 'Common Mistakes',
      rows: [
        {
          wrong: 'Il est deux heure',
          correct: 'Il est deux heures',
          explanation: 'HEURES plural from 2'
        },
        {
          wrong: 'Il est trois heures et demi',
          correct: 'Il est trois heures et demie',
          explanation: 'DEMIE agrees'
        },
        {
          wrong: 'Il est six heures quarante-cinq',
          correct: 'Il est sept heures moins le quart',
          explanation: 'More natural in conversation'
        },
        {
          wrong: 'Il est douze heures (noon)',
          correct: 'Il est midi',
          explanation: 'Use "midi" or "minuit"'
        }
      ]
    },
    {
      type: 'miniDialogue',
      title: 'Making an Appointment',
      lines: [
        {
          speaker: 'Secretary',
          text: 'Cabinet du Dr Martin, bonjour.'
        },
        {
          speaker: 'Client',
          text: 'Bonjour, je voudrais prendre rendez-vous.'
        },
        {
          speaker: 'Secretary',
          text: 'Quand êtes-vous disponible ?'
        },
        {
          speaker: 'Client',
          text: 'Mardi après-midi, si possible.'
        },
        {
          speaker: 'Secretary',
          text: 'J\'ai un créneau à quatorze heures trente ou seize heures.'
        },
        {
          speaker: 'Client',
          text: 'Seize heures, c\'est parfait. C\'est à quelle adresse ?'
        },
        {
          speaker: 'Secretary',
          text: '12 rue Victor Hugo. Arrivez cinq minutes avant.'
        }
      ],
      translation: 'Secretary: Dr Martin\'s office, hello. | Client: Hello, I\'d like to make an appointment. | Secretary: When are you available? | Client: Tuesday afternoon, if possible. | Secretary: I have a slot at 2:30 PM or 4:00 PM. | Client: 4:00 PM is perfect. What\'s the address? | Secretary: 12 Victor Hugo Street. Arrive five minutes early.'
    },
    {
      type: 'relatedTopics',
      links: [
        {
          title: 'Lesson 6: -ER Verbs',
          url: '/lessons?slug=verbes-er-partie-1'
        }
      ]
    }
  ],

  blocks_ru: [
    {
      type: 'mainTitle',
      text: 'Числа и время'
    },
    {
      type: 'subtitle',
      text: 'Счёт и определение времени по-французски'
    },
    {
      type: 'quickSummary',
      title: 'Ключевые моменты',
      keyForms: [
        {
          form: '0-100',
          translation: 'Количественные числительные'
        },
        {
          form: 'Il est... heures',
          translation: 'Говорить время'
        },
        {
          form: 'et quart / et demie / moins le quart',
          translation: 'Доли часа'
        },
        {
          form: '12h / 24h',
          translation: 'Две системы'
        }
      ]
    },
    {
      type: 'title',
      text: 'Числа от 0 до 100'
    },
    {
      type: 'conjugationTable',
      title: '0-20',
      rows: [
        { pronoun: '0', form: 'zéro', pronunciation: '[zeʁo]' },
        { pronoun: '1', form: 'un', pronunciation: '[œ̃]' },
        { pronoun: '2', form: 'deux', pronunciation: '[dø]' },
        { pronoun: '3', form: 'trois', pronunciation: '[tʁwa]' },
        { pronoun: '4', form: 'quatre', pronunciation: '[katʁ]' },
        { pronoun: '5', form: 'cinq', pronunciation: '[sɛ̃k]' },
        { pronoun: '6', form: 'six', pronunciation: '[sis]' },
        { pronoun: '7', form: 'sept', pronunciation: '[sɛt]' },
        { pronoun: '8', form: 'huit', pronunciation: '[ɥit]' },
        { pronoun: '9', form: 'neuf', pronunciation: '[nœf]' },
        { pronoun: '10', form: 'dix', pronunciation: '[dis]' }
      ]
    },
    {
      type: 'conjugationTable',
      title: '11-20',
      rows: [
        { pronoun: '11', form: 'onze', pronunciation: '[ɔ̃z]' },
        { pronoun: '12', form: 'douze', pronunciation: '[duz]' },
        { pronoun: '13', form: 'treize', pronunciation: '[tʁɛz]' },
        { pronoun: '14', form: 'quatorze', pronunciation: '[katɔʁz]' },
        { pronoun: '15', form: 'quinze', pronunciation: '[kɛ̃z]' },
        { pronoun: '16', form: 'seize', pronunciation: '[sɛz]' },
        { pronoun: '17', form: 'dix-sept', pronunciation: '[dis sɛt]' },
        { pronoun: '18', form: 'dix-huit', pronunciation: '[diz ɥit]' },
        { pronoun: '19', form: 'dix-neuf', pronunciation: '[diz nœf]' },
        { pronoun: '20', form: 'vingt', pronunciation: '[vɛ̃]' }
      ]
    },
    {
      type: 'usageList',
      title: 'Десятки и образование',
      items: [
        {
          usage: '20-69: Простое сложение',
          examples: [
            '21 = vingt et un',
            '32 = trente-deux',
            '45 = quarante-cinq',
            '58 = cinquante-huit'
          ]
        },
        {
          usage: '70-79: Шестьдесят + 10-19',
          examples: [
            '70 = soixante-dix',
            '71 = soixante et onze',
            '75 = soixante-quinze',
            '79 = soixante-dix-neuf'
          ],
          commonMistake: {
            wrong: 'septante (Бельгия/Швейцария)',
            correct: 'soixante-dix (Франция)'
          }
        },
        {
          usage: '80-99: Четыре-двадцать + 0-19',
          examples: [
            '80 = quatre-vingts',
            '81 = quatre-vingt-un (без -s)',
            '90 = quatre-vingt-dix',
            '99 = quatre-vingt-dix-neuf'
          ],
          commonMistake: {
            wrong: 'nonante (Бельгия/Швейцария)',
            correct: 'quatre-vingt-dix (Франция)'
          }
        },
        {
          usage: '100',
          examples: [
            '100 = cent'
          ]
        }
      ]
    },
    {
      type: 'title',
      text: 'Говорить время'
    },
    {
      type: 'paragraph',
      text: 'Во французском языке используется "Il est" + час(ы). Французы часто используют 24-часовую систему для официальных расписаний.'
    },
    {
      type: 'conjugationTable',
      title: 'Базовая структура',
      rows: [
        {
          pronoun: '1:00',
          form: 'Il est une heure',
          translation: '1 час',
          mnemonic: 'UNE heure (единственное число)'
        },
        {
          pronoun: '2:00',
          form: 'Il est deux heures',
          translation: '2 часа',
          mnemonic: 'HEURES (множественное число с 2)'
        },
        {
          pronoun: '12:00',
          form: 'Il est midi / minuit',
          translation: 'Полдень / полночь',
          mnemonic: 'Не "douze heures"'
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Минуты и четверти часа',
      items: [
        {
          usage: 'Минуты (0-30)',
          examples: [
            '2:05 = Il est deux heures cinq',
            '3:10 = Il est trois heures dix',
            '4:15 = Il est quatre heures et quart',
            '5:30 = Il est cinq heures et demie'
          ]
        },
        {
          usage: 'Минуты (31-59) - MOINS',
          examples: [
            '6:45 = Il est sept heures moins le quart',
            '7:50 = Il est huit heures moins dix',
            '8:55 = Il est neuf heures moins cinq'
          ],
          commonMistake: {
            wrong: 'Il est six heures quarante-cinq',
            correct: 'Il est sept heures moins le quart (более естественно)'
          }
        }
      ]
    },
    {
      type: 'conjugationTable',
      title: '24-часовая система (официальные расписания)',
      rows: [
        {
          pronoun: '14:00',
          form: 'quatorze heures',
          translation: '14:00'
        },
        {
          pronoun: '18:30',
          form: 'dix-huit heures trente',
          translation: '18:30'
        },
        {
          pronoun: '21:45',
          form: 'vingt et une heures quarante-cinq',
          translation: '21:45',
          mnemonic: 'Без "moins" в 24-часовой системе'
        },
        {
          pronoun: '23:50',
          form: 'vingt-trois heures cinquante',
          translation: '23:50'
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Время суток',
      items: [
        {
          usage: 'Спросить время',
          examples: [
            'Quelle heure est-il ?',
            'Tu as l\'heure ?',
            'Il est quelle heure ?'
          ]
        },
        {
          usage: 'Уточнить момент',
          examples: [
            'du matin (8h00 = huit heures du matin)',
            'de l\'après-midi (14h00 = deux heures de l\'après-midi)',
            'du soir (20h00 = huit heures du soir)'
          ]
        },
        {
          usage: 'Сказать "в + время"',
          examples: [
            'Le train part à 15h30.',
            'Le cours commence à neuf heures.',
            'Je travaille de 9h à 17h.'
          ]
        }
      ]
    },
    {
      type: 'mistakesTable',
      title: 'Типичные ошибки',
      rows: [
        {
          wrong: 'Il est deux heure',
          correct: 'Il est deux heures',
          explanation: 'HEURES во множественном числе с 2'
        },
        {
          wrong: 'Il est trois heures et demi',
          correct: 'Il est trois heures et demie',
          explanation: 'DEMIE согласуется'
        },
        {
          wrong: 'Il est six heures quarante-cinq',
          correct: 'Il est sept heures moins le quart',
          explanation: 'Более естественно в разговоре'
        },
        {
          wrong: 'Il est douze heures (полдень)',
          correct: 'Il est midi',
          explanation: 'Используйте "midi" или "minuit"'
        }
      ]
    },
    {
      type: 'miniDialogue',
      title: 'Записаться на приём',
      lines: [
        {
          speaker: 'Секретарь',
          text: 'Cabinet du Dr Martin, bonjour.'
        },
        {
          speaker: 'Клиент',
          text: 'Bonjour, je voudrais prendre rendez-vous.'
        },
        {
          speaker: 'Секретарь',
          text: 'Quand êtes-vous disponible ?'
        },
        {
          speaker: 'Клиент',
          text: 'Mardi après-midi, si possible.'
        },
        {
          speaker: 'Секретарь',
          text: 'J\'ai un créneau à quatorze heures trente ou seize heures.'
        },
        {
          speaker: 'Клиент',
          text: 'Seize heures, c\'est parfait. C\'est à quelle adresse ?'
        },
        {
          speaker: 'Секретарь',
          text: '12 rue Victor Hugo. Arrivez cinq minutes avant.'
        }
      ],
      translation: 'Секретарь: Кабинет доктора Мартена, здравствуйте. | Клиент: Здравствуйте, я хотел бы записаться на приём. | Секретарь: Когда вы свободны? | Клиент: Во вторник днём, если возможно. | Секретарь: У меня есть окно в 14:30 или в 16:00. | Клиент: 16:00 отлично. Какой адрес? | Секретарь: Улица Виктора Гюго, 12. Приходите на пять минут раньше.'
    },
    {
      type: 'relatedTopics',
      links: [
        {
          title: 'Урок 6: Глаголы на -ER',
          url: '/lessons?slug=verbes-er-partie-1'
        }
      ]
    }
  ]
};

async function updateLessons13to15() {
  console.log('🚀 Updating Lessons 13, 14, and 15...\n');

  try {
    // Update Lesson 13
    console.log('Updating Lesson 13: Les adjectifs qualificatifs...');
    const { error: error13 } = await supabase
      .from('lessons')
      .update({
        blocks_fr: lesson13Content.blocks_fr,
        blocks_en: lesson13Content.blocks_en,
        blocks_ru: lesson13Content.blocks_ru,
        keywords: ['adjectifs', 'adjectives', 'прилагательные', 'BAGS', 'accord', 'agreement', 'согласование'],
        estimated_read_time: 13
      })
      .eq('id', 13);

    if (error13) throw error13;
    console.log('✅ Lesson 13 updated!\n');

    // Update Lesson 14
    console.log('Updating Lesson 14: Les prépositions de lieu...');
    const { error: error14 } = await supabase
      .from('lessons')
      .update({
        blocks_fr: lesson14Content.blocks_fr,
        blocks_en: lesson14Content.blocks_en,
        blocks_ru: lesson14Content.blocks_ru,
        keywords: ['prépositions', 'prepositions', 'предлоги', 'lieu', 'place', 'место', 'à en au', 'dans sur sous'],
        estimated_read_time: 12
      })
      .eq('id', 14);

    if (error14) throw error14;
    console.log('✅ Lesson 14 updated!\n');

    // Update Lesson 15
    console.log('Updating Lesson 15: Les nombres et l\'heure...');
    const { error: error15 } = await supabase
      .from('lessons')
      .update({
        blocks_fr: lesson15Content.blocks_fr,
        blocks_en: lesson15Content.blocks_en,
        blocks_ru: lesson15Content.blocks_ru,
        keywords: ['nombres', 'numbers', 'числа', 'heure', 'time', 'время', '0-100', 'il est'],
        estimated_read_time: 14
      })
      .eq('id', 15);

    if (error15) throw error15;
    console.log('✅ Lesson 15 updated!\n');

    console.log('🎉 All lessons updated successfully!');

  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

updateLessons13to15()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('💥 Fatal error:', err);
    process.exit(1);
  });
