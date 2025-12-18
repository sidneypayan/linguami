/**
 * Script to create Russian lessons 6-20 for A1 level
 * Based on РКИ (Russian as Foreign Language) curriculum
 *
 * Run with: node scripts/create-russian-lessons-6-20.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.production' });

const supabase = createClient(
  process.env.SUPABASE_COURSES_URL,
  process.env.SUPABASE_COURSES_SERVICE_KEY
);

// Helper function to create lesson data structure
function createLesson(order, titleEn, titleFr, titleRu, blocksEn, blocksFr) {
  return {
    order,
    target_language: 'ru',
    title_en: titleEn,
    title_fr: titleFr,
    title_ru: titleRu,
    blocks_en: blocksEn,
    blocks_fr: blocksFr,
    blocks_ru: [] // Empty for now, can be added later
  };
}

// ====================
// LESSON 6: Numbers 20-100 and Money
// ====================
const lesson6BlocksEn = [
  {
    type: 'mainTitle',
    text: 'Numbers 20-100 and Money'
  },
  {
    type: 'subtitle',
    text: 'Counting and Shopping in Russian'
  },
  {
    type: 'quickSummary',
    title: 'Key Points',
    keyForms: [
      { form: 'двадцать, тридцать...', translation: '20, 30...' },
      { form: 'рубль / рубля / рублей', translation: 'ruble (different endings)' },
      { form: 'Сколько стоит?', translation: 'How much does it cost?' },
      { form: 'один рубль, два рубля, пять рублей', translation: 'Number agreement with nouns' }
    ]
  },
  {
    type: 'title',
    text: 'Numbers from 20 to 100'
  },
  {
    type: 'paragraph',
    text: 'Russian numbers from 20-100 follow a pattern. The tens (20, 30, 40...) are single words, and you add units just like in English (twenty-one, thirty-five...).'
  },
  {
    type: 'conjugationTable',
    title: 'Tens (20-90)',
    rows: [
      { pronoun: 'двадцать', form: '[dvadtsat]', translation: '20', pronunciation: 'Literally "two tens"' },
      { pronoun: 'тридцать', form: '[tridtsat]', translation: '30', pronunciation: 'Literally "three tens"' },
      { pronoun: 'сорок', form: '[sorok]', translation: '40', pronunciation: 'Irregular form' },
      { pronoun: 'пятьдесят', form: '[pyatdesyat]', translation: '50', pronunciation: 'Literally "five tens"' },
      { pronoun: 'шестьдесят', form: '[shestdesyat]', translation: '60', pronunciation: 'Literally "six tens"' },
      { pronoun: 'семьдесят', form: '[semdesyat]', translation: '70', pronunciation: 'Literally "seven tens"' },
      { pronoun: 'восемьдесят', form: '[vosemdesyat]', translation: '80', pronunciation: 'Literally "eight tens"' },
      { pronoun: 'девяносто', form: '[devyanosto]', translation: '90', pronunciation: 'Irregular form' },
      { pronoun: 'сто', form: '[sto]', translation: '100', pronunciation: 'One hundred' }
    ]
  },
  {
    type: 'title',
    text: 'Compound Numbers (21-99)'
  },
  {
    type: 'paragraph',
    text: 'For numbers like 21, 35, 47, simply combine the tens and units: <strong>двадцать один</strong> (21), <strong>тридцать пять</strong> (35), <strong>сорок семь</strong> (47).'
  },
  {
    type: 'conjugationTable',
    title: 'Examples of Compound Numbers',
    rows: [
      { pronoun: 'двадцать один', form: '[dvadtsat odin]', translation: '21' },
      { pronoun: 'тридцать два', form: '[tridtsat dva]', translation: '32' },
      { pronoun: 'сорок пять', form: '[sorok pyat]', translation: '45' },
      { pronoun: 'пятьдесят семь', form: '[pyatdesyat sem]', translation: '57' },
      { pronoun: 'шестьдесят три', form: '[shestdesyat tri]', translation: '63' },
      { pronoun: 'семьдесят восемь', form: '[semdesyat vosem]', translation: '78' },
      { pronoun: 'восемьдесят девять', form: '[vosemdesyat devyat]', translation: '89' },
      { pronoun: 'девяносто шесть', form: '[devyanosto shest]', translation: '96' }
    ]
  },
  {
    type: 'title',
    text: 'Russian Currency: Rubles and Kopecks'
  },
  {
    type: 'paragraph',
    text: 'Russian currency is the <strong>рубль</strong> (ruble). One ruble = 100 <strong>копеек</strong> (kopecks). The word "рубль" changes its ending depending on the number!'
  },
  {
    type: 'conjugationTable',
    title: 'Ruble Agreement with Numbers',
    rows: [
      { pronoun: 'один рубль', form: '[odin rubl]', translation: '1 ruble', pronunciation: 'Nominative singular' },
      { pronoun: 'два рубля', form: '[dva rublya]', translation: '2 rubles', pronunciation: 'Genitive singular' },
      { pronoun: 'три рубля', form: '[tri rublya]', translation: '3 rubles', pronunciation: 'Genitive singular' },
      { pronoun: 'четыре рубля', form: '[chetyre rublya]', translation: '4 rubles', pronunciation: 'Genitive singular' },
      { pronoun: 'пять рублей', form: '[pyat rubley]', translation: '5 rubles', pronunciation: 'Genitive plural' },
      { pronoun: 'десять рублей', form: '[desyat rubley]', translation: '10 rubles', pronunciation: 'Genitive plural' },
      { pronoun: 'двадцать рублей', form: '[dvadtsat rubley]', translation: '20 rubles', pronunciation: 'Genitive plural' },
      { pronoun: 'двадцать один рубль', form: '[dvadtsat odin rubl]', translation: '21 rubles', pronunciation: 'Ends in 1 → singular' }
    ]
  },
  {
    type: 'title',
    text: 'Shopping and Prices'
  },
  {
    type: 'usageList',
    title: 'Essential Shopping Phrases',
    items: [
      {
        usage: 'Сколько стоит? [skolko stoit]',
        examples: [
          'How much does it cost?',
          'Сколько стоит эта книга? — How much is this book?',
          'Сколько стоит билет? — How much is a ticket?'
        ]
      },
      {
        usage: 'Это стоит... [eto stoit...]',
        examples: [
          'It costs...',
          'Это стоит двадцать рублей — It costs 20 rubles',
          'Это стоит сто рублей — It costs 100 rubles'
        ]
      },
      {
        usage: 'Дорого / Дешево [dorogo / deshevo]',
        examples: [
          'Expensive / Cheap',
          'Это дорого! — That is expensive!',
          'Это дешево — That is cheap'
        ],
        commonMistake: {
          wrong: 'Это дорогой (adjective)',
          correct: 'Это дорого (adverb for price)'
        }
      }
    ]
  },
  {
    type: 'title',
    text: 'Common Shops and Places'
  },
  {
    type: 'conjugationTable',
    title: 'Where to Shop',
    rows: [
      { pronoun: 'магазин', form: '[magazin]', translation: 'shop, store' },
      { pronoun: 'супермаркет', form: '[supermarket]', translation: 'supermarket' },
      { pronoun: 'аптека', form: '[apteka]', translation: 'pharmacy' },
      { pronoun: 'рынок', form: '[rynok]', translation: 'market' },
      { pronoun: 'кафе', form: '[kafe]', translation: 'cafe' },
      { pronoun: 'банк', form: '[bank]', translation: 'bank' },
      { pronoun: 'касса', form: '[kassa]', translation: 'cashier, checkout' }
    ]
  },
  {
    type: 'mistakesTable',
    title: 'Common Mistakes',
    rows: [
      {
        wrong: 'пять рубль',
        correct: 'пять рублей',
        explanation: 'Numbers 5+ require genitive plural'
      },
      {
        wrong: 'два рублей',
        correct: 'два рубля',
        explanation: 'Numbers 2-4 require genitive singular'
      },
      {
        wrong: 'Сколько это стоит рублей?',
        correct: 'Сколько это стоит?',
        explanation: 'No need to add "рублей" in the question'
      },
      {
        wrong: 'сорок-один (hyphen)',
        correct: 'сорок один (space)',
        explanation: 'Russian uses space, not hyphen'
      }
    ]
  },
  {
    type: 'title',
    text: 'Key Vocabulary'
  },
  {
    type: 'list',
    items: [
      '<strong>деньги</strong> [dengi] — money',
      '<strong>цена</strong> [tsena] — price',
      '<strong>купить</strong> [kupit] — to buy',
      '<strong>продать</strong> [prodat] — to sell',
      '<strong>платить</strong> [platit] — to pay',
      '<strong>карта</strong> [karta] — card',
      '<strong>наличные</strong> [nalichnye] — cash',
      '<strong>сдача</strong> [sdacha] — change (money back)',
      '<strong>скидка</strong> [skidka] — discount'
    ]
  },
  {
    type: 'miniDialogue',
    title: 'Complete Dialogue: At the Store',
    translation: '— Hello! How much is this bread? — 45 rubles. — And how much is the milk? — 72 rubles. — OK. I will take the bread and the milk. How much is everything? — 117 rubles total. — Here you go (card). — Thank you. Here is your receipt.',
    lines: [
      { speaker: 'Покупатель', text: 'Здравствуйте! Сколько стоит этот хлеб?' },
      { speaker: 'Продавец', text: 'Сорок пять рублей.' },
      { speaker: 'Покупатель', text: 'А сколько стоит молоко?' },
      { speaker: 'Продавец', text: 'Семьдесят два рубля.' },
      { speaker: 'Покупатель', text: 'Хорошо. Я возьму хлеб и молоко. Сколько всего?' },
      { speaker: 'Продавец', text: 'Всего сто семнадцать рублей.' },
      { speaker: 'Покупатель', text: 'Вот карта.' },
      { speaker: 'Продавец', text: 'Спасибо. Вот ваш чек.' }
    ]
  },
  {
    type: 'relatedTopics'
  }
];

const lesson6BlocksFr = [
  {
    type: 'mainTitle',
    text: 'Les nombres 20-100 et l\'argent'
  },
  {
    type: 'subtitle',
    text: 'Compter et faire des achats en russe'
  },
  {
    type: 'quickSummary',
    title: 'Points clés',
    keyForms: [
      { form: 'двадцать, тридцать...', translation: '20, 30...' },
      { form: 'рубль / рубля / рублей', translation: 'rouble (terminaisons différentes)' },
      { form: 'Сколько стоит?', translation: 'Combien ça coûte ?' },
      { form: 'один рубль, два рубля, пять рублей', translation: 'Accord des nombres avec les noms' }
    ]
  },
  {
    type: 'title',
    text: 'Les nombres de 20 à 100'
  },
  {
    type: 'paragraph',
    text: 'Les nombres russes de 20 à 100 suivent un schéma. Les dizaines (20, 30, 40...) sont des mots uniques, et on ajoute les unités comme en français (vingt-et-un, trente-cinq...).'
  },
  {
    type: 'conjugationTable',
    title: 'Les dizaines (20-90)',
    rows: [
      { pronoun: 'двадцать', form: '[dvadtsat]', translation: '20', pronunciation: 'Littéralement "deux dizaines"' },
      { pronoun: 'тридцать', form: '[tridtsat]', translation: '30', pronunciation: 'Littéralement "trois dizaines"' },
      { pronoun: 'сорок', form: '[sorok]', translation: '40', pronunciation: 'Forme irrégulière' },
      { pronoun: 'пятьдесят', form: '[pyatdesyat]', translation: '50', pronunciation: 'Littéralement "cinq dizaines"' },
      { pronoun: 'шестьдесят', form: '[shestdesyat]', translation: '60', pronunciation: 'Littéralement "six dizaines"' },
      { pronoun: 'семьдесят', form: '[semdesyat]', translation: '70', pronunciation: 'Littéralement "sept dizaines"' },
      { pronoun: 'восемьдесят', form: '[vosemdesyat]', translation: '80', pronunciation: 'Littéralement "huit dizaines"' },
      { pronoun: 'девяносто', form: '[devyanosto]', translation: '90', pronunciation: 'Forme irrégulière' },
      { pronoun: 'сто', form: '[sto]', translation: '100', pronunciation: 'Cent' }
    ]
  },
  {
    type: 'title',
    text: 'Nombres composés (21-99)'
  },
  {
    type: 'paragraph',
    text: 'Pour les nombres comme 21, 35, 47, on combine simplement dizaines et unités : <strong>двадцать один</strong> (21), <strong>тридцать пять</strong> (35), <strong>сорок семь</strong> (47).'
  },
  {
    type: 'conjugationTable',
    title: 'Exemples de nombres composés',
    rows: [
      { pronoun: 'двадцать один', form: '[dvadtsat odin]', translation: '21' },
      { pronoun: 'тридцать два', form: '[tridtsat dva]', translation: '32' },
      { pronoun: 'сорок пять', form: '[sorok pyat]', translation: '45' },
      { pronoun: 'пятьдесят семь', form: '[pyatdesyat sem]', translation: '57' },
      { pronoun: 'шестьдесят три', form: '[shestdesyat tri]', translation: '63' },
      { pronoun: 'семьдесят восемь', form: '[semdesyat vosem]', translation: '78' },
      { pronoun: 'восемьдесят девять', form: '[vosemdesyat devyat]', translation: '89' },
      { pronoun: 'девяносто шесть', form: '[devyanosto shest]', translation: '96' }
    ]
  },
  {
    type: 'title',
    text: 'La monnaie russe : roubles et kopecks'
  },
  {
    type: 'paragraph',
    text: 'La monnaie russe est le <strong>рубль</strong> (rouble). Un rouble = 100 <strong>копеек</strong> (kopecks). Le mot "рубль" change de terminaison selon le nombre !'
  },
  {
    type: 'conjugationTable',
    title: 'Accord du rouble avec les nombres',
    rows: [
      { pronoun: 'один рубль', form: '[odin rubl]', translation: '1 rouble', pronunciation: 'Nominatif singulier' },
      { pronoun: 'два рубля', form: '[dva rublya]', translation: '2 roubles', pronunciation: 'Génitif singulier' },
      { pronoun: 'три рубля', form: '[tri rublya]', translation: '3 roubles', pronunciation: 'Génitif singulier' },
      { pronoun: 'четыре рубля', form: '[chetyre rublya]', translation: '4 roubles', pronunciation: 'Génitif singulier' },
      { pronoun: 'пять рублей', form: '[pyat rubley]', translation: '5 roubles', pronunciation: 'Génitif pluriel' },
      { pronoun: 'десять рублей', form: '[desyat rubley]', translation: '10 roubles', pronunciation: 'Génitif pluriel' },
      { pronoun: 'двадцать рублей', form: '[dvadtsat rubley]', translation: '20 roubles', pronunciation: 'Génitif pluriel' },
      { pronoun: 'двадцать один рубль', form: '[dvadtsat odin rubl]', translation: '21 roubles', pronunciation: 'Se termine par 1 → singulier' }
    ]
  },
  {
    type: 'title',
    text: 'Achats et prix'
  },
  {
    type: 'usageList',
    title: 'Phrases essentielles pour faire des achats',
    items: [
      {
        usage: 'Сколько стоит? [skolko stoit]',
        examples: [
          'Combien ça coûte ?',
          'Сколько стоит эта книга? — Combien coûte ce livre ?',
          'Сколько стоит билет? — Combien coûte un billet ?'
        ]
      },
      {
        usage: 'Это стоит... [eto stoit...]',
        examples: [
          'Ça coûte...',
          'Это стоит двадцать рублей — Ça coûte 20 roubles',
          'Это стоит сто рублей — Ça coûte 100 roubles'
        ]
      },
      {
        usage: 'Дорого / Дешево [dorogo / deshevo]',
        examples: [
          'Cher / Pas cher',
          'Это дорого! — C\'est cher !',
          'Это дешево — C\'est bon marché'
        ],
        commonMistake: {
          wrong: 'Это дорогой (adjectif)',
          correct: 'Это дорого (adverbe pour le prix)'
        }
      }
    ]
  },
  {
    type: 'title',
    text: 'Magasins et lieux courants'
  },
  {
    type: 'conjugationTable',
    title: 'Où faire ses achats',
    rows: [
      { pronoun: 'магазин', form: '[magazin]', translation: 'magasin' },
      { pronoun: 'супермаркет', form: '[supermarket]', translation: 'supermarché' },
      { pronoun: 'аптека', form: '[apteka]', translation: 'pharmacie' },
      { pronoun: 'рынок', form: '[rynok]', translation: 'marché' },
      { pronoun: 'кафе', form: '[kafe]', translation: 'café' },
      { pronoun: 'банк', form: '[bank]', translation: 'banque' },
      { pronoun: 'касса', form: '[kassa]', translation: 'caisse' }
    ]
  },
  {
    type: 'mistakesTable',
    title: 'Erreurs courantes',
    rows: [
      {
        wrong: 'пять рубль',
        correct: 'пять рублей',
        explanation: 'Les nombres 5+ requièrent le génitif pluriel'
      },
      {
        wrong: 'два рублей',
        correct: 'два рубля',
        explanation: 'Les nombres 2-4 requièrent le génitif singulier'
      },
      {
        wrong: 'Сколько это стоит рублей?',
        correct: 'Сколько это стоит?',
        explanation: 'Pas besoin d\'ajouter "рублей" dans la question'
      },
      {
        wrong: 'сорок-один (trait d\'union)',
        correct: 'сорок один (espace)',
        explanation: 'Le russe utilise un espace, pas de trait d\'union'
      }
    ]
  },
  {
    type: 'title',
    text: 'Vocabulaire clé'
  },
  {
    type: 'list',
    items: [
      '<strong>деньги</strong> [dengi] — argent',
      '<strong>цена</strong> [tsena] — prix',
      '<strong>купить</strong> [kupit] — acheter',
      '<strong>продать</strong> [prodat] — vendre',
      '<strong>платить</strong> [platit] — payer',
      '<strong>карта</strong> [karta] — carte',
      '<strong>наличные</strong> [nalichnye] — espèces',
      '<strong>сдача</strong> [sdacha] — monnaie (rendue)',
      '<strong>скидка</strong> [skidka] — réduction'
    ]
  },
  {
    type: 'miniDialogue',
    title: 'Dialogue complet : Au magasin',
    translation: '— Bonjour ! Combien coûte ce pain ? — 45 roubles. — Et combien coûte le lait ? — 72 roubles. — D\'accord. Je prends le pain et le lait. Combien ça fait en tout ? — 117 roubles au total. — Voici ma carte. — Merci. Voici votre reçu.',
    lines: [
      { speaker: 'Client', text: 'Здравствуйте! Сколько стоит этот хлеб?' },
      { speaker: 'Vendeur', text: 'Сорок пять рублей.' },
      { speaker: 'Client', text: 'А сколько стоит молоко?' },
      { speaker: 'Vendeur', text: 'Семьдесят два рубля.' },
      { speaker: 'Client', text: 'Хорошо. Я возьму хлеб и молоко. Сколько всего?' },
      { speaker: 'Vendeur', text: 'Всего сто семнадцать рублей.' },
      { speaker: 'Client', text: 'Вот карта.' },
      { speaker: 'Vendeur', text: 'Спасибо. Вот ваш чек.' }
    ]
  },
  {
    type: 'relatedTopics'
  }
];

// ====================
// LESSON 7: Days, Months and Date
// ====================
const lesson7BlocksEn = [
  {
    type: 'mainTitle',
    text: 'Days, Months and the Date'
  },
  {
    type: 'subtitle',
    text: 'Talking About Time in Russian'
  },
  {
    type: 'quickSummary',
    title: 'Key Points',
    keyForms: [
      { form: 'Какой сегодня день?', translation: 'What day is it today?' },
      { form: 'Сегодня понедельник', translation: 'Today is Monday' },
      { form: 'Какое сегодня число?', translation: 'What is the date today?' },
      { form: 'первое мая, второе июня', translation: 'May 1st, June 2nd (ordinal numbers)' }
    ]
  },
  {
    type: 'title',
    text: 'Days of the Week'
  },
  {
    type: 'paragraph',
    text: 'Russian days of the week are NOT capitalized (unlike in English). Most days derive from numbers: понедельник (Monday) comes from "after Sunday", вторник from "two" (second day), and so on.'
  },
  {
    type: 'conjugationTable',
    title: 'Days of the Week',
    rows: [
      { pronoun: 'понедельник', form: '[ponedelnik]', translation: 'Monday', pronunciation: 'From "после недели" (after the week)' },
      { pronoun: 'вторник', form: '[vtornik]', translation: 'Tuesday', pronunciation: 'From "второй" (second)' },
      { pronoun: 'среда', form: '[sreda]', translation: 'Wednesday', pronunciation: 'Middle of the week' },
      { pronoun: 'четверг', form: '[chetverg]', translation: 'Thursday', pronunciation: 'From "четыре" (four)' },
      { pronoun: 'пятница', form: '[pyatnitsa]', translation: 'Friday', pronunciation: 'From "пять" (five)' },
      { pronoun: 'суббота', form: '[subbota]', translation: 'Saturday', pronunciation: 'From Hebrew "Sabbath"' },
      { pronoun: 'воскресенье', form: '[voskresenie]', translation: 'Sunday', pronunciation: 'From "воскресить" (resurrection)' }
    ]
  },
  {
    type: 'title',
    text: 'Months of the Year'
  },
  {
    type: 'paragraph',
    text: 'Russian months are also NOT capitalized. Many month names are similar to European languages because they derive from Latin.'
  },
  {
    type: 'conjugationTable',
    title: 'Months (Nominative)',
    rows: [
      { pronoun: 'январь', form: '[yanvar]', translation: 'January' },
      { pronoun: 'февраль', form: '[fevral]', translation: 'February' },
      { pronoun: 'март', form: '[mart]', translation: 'March' },
      { pronoun: 'апрель', form: '[aprel]', translation: 'April' },
      { pronoun: 'май', form: '[may]', translation: 'May' },
      { pronoun: 'июнь', form: '[iyun]', translation: 'June' },
      { pronoun: 'июль', form: '[iyul]', translation: 'July' },
      { pronoun: 'август', form: '[avgust]', translation: 'August' },
      { pronoun: 'сентябрь', form: '[sentyabr]', translation: 'September' },
      { pronoun: 'октябрь', form: '[oktyabr]', translation: 'October' },
      { pronoun: 'ноябрь', form: '[noyabr]', translation: 'November' },
      { pronoun: 'декабрь', form: '[dekabr]', translation: 'December' }
    ]
  },
  {
    type: 'title',
    text: 'Asking About the Day and Date'
  },
  {
    type: 'usageList',
    title: 'Time Questions',
    items: [
      {
        usage: 'Какой сегодня день? [kakoy segodnya den]',
        examples: [
          'What day is it today?',
          'Сегодня понедельник — Today is Monday',
          'Сегодня пятница — Today is Friday'
        ]
      },
      {
        usage: 'Какое сегодня число? [kakoye segodnya chislo]',
        examples: [
          'What is the date today?',
          'Сегодня первое мая — Today is May 1st',
          'Сегодня десятое июня — Today is June 10th'
        ]
      },
      {
        usage: 'Какой месяц? [kakoy mesyats]',
        examples: [
          'What month is it?',
          'Сейчас январь — It is January now',
          'Сейчас декабрь — It is December now'
        ]
      }
    ]
  },
  {
    type: 'title',
    text: 'Ordinal Numbers for Dates'
  },
  {
    type: 'paragraph',
    text: 'To say dates in Russian, you use <strong>ordinal numbers</strong> (first, second, third...) in the <strong>neuter nominative</strong> form because "число" (date/number) is neuter.'
  },
  {
    type: 'conjugationTable',
    title: 'Ordinal Numbers 1-31 (Neuter)',
    rows: [
      { pronoun: 'первое', form: '[pervoye]', translation: '1st' },
      { pronoun: 'второе', form: '[vtoroye]', translation: '2nd' },
      { pronoun: 'третье', form: '[tretye]', translation: '3rd' },
      { pronoun: 'четвёртое', form: '[chetvertoye]', translation: '4th' },
      { pronoun: 'пятое', form: '[pyatoye]', translation: '5th' },
      { pronoun: 'десятое', form: '[desyatoye]', translation: '10th' },
      { pronoun: 'двадцатое', form: '[dvadsatoye]', translation: '20th' },
      { pronoun: 'тридцать первое', form: '[tridtsat pervoye]', translation: '31st' }
    ]
  },
  {
    type: 'title',
    text: 'Expressing "On" a Day or Date'
  },
  {
    type: 'paragraph',
    text: 'To say "on Monday", "on June 5th", Russian uses the <strong>accusative case</strong> with the preposition <strong>в</strong> (for months) or just the accusative (for days).'
  },
  {
    type: 'conjugationTable',
    title: 'Days in Accusative (On Monday...)',
    rows: [
      { pronoun: 'в понедельник', form: '[v ponedelnik]', translation: 'on Monday' },
      { pronoun: 'во вторник', form: '[vo vtornik]', translation: 'on Tuesday' },
      { pronoun: 'в среду', form: '[v sredu]', translation: 'on Wednesday' },
      { pronoun: 'в четверг', form: '[v chetverg]', translation: 'on Thursday' },
      { pronoun: 'в пятницу', form: '[v pyatnitsu]', translation: 'on Friday' },
      { pronoun: 'в субботу', form: '[v subbotu]', translation: 'on Saturday' },
      { pronoun: 'в воскресенье', form: '[v voskresenie]', translation: 'on Sunday' }
    ]
  },
  {
    type: 'title',
    text: 'Expressing "In" a Month'
  },
  {
    type: 'conjugationTable',
    title: 'Months in Prepositional (In January...)',
    rows: [
      { pronoun: 'в январе', form: '[v yanvare]', translation: 'in January' },
      { pronoun: 'в феврале', form: '[v fevrale]', translation: 'in February' },
      { pronoun: 'в марте', form: '[v marte]', translation: 'in March' },
      { pronoun: 'в апреле', form: '[v aprele]', translation: 'in April' },
      { pronoun: 'в мае', form: '[v mae]', translation: 'in May' },
      { pronoun: 'в июне', form: '[v iyune]', translation: 'in June' },
      { pronoun: 'в июле', form: '[v iyule]', translation: 'in July' },
      { pronoun: 'в августе', form: '[v avguste]', translation: 'in August' },
      { pronoun: 'в сентябре', form: '[v sentyabre]', translation: 'in September' },
      { pronoun: 'в октябре', form: '[v oktyabre]', translation: 'in October' },
      { pronoun: 'в ноябре', form: '[v noyabre]', translation: 'in November' },
      { pronoun: 'в декабре', form: '[v dekabre]', translation: 'in December' }
    ]
  },
  {
    type: 'mistakesTable',
    title: 'Common Mistakes',
    rows: [
      {
        wrong: 'Понедельник (capitalized)',
        correct: 'понедельник (lowercase)',
        explanation: 'Days and months are NOT capitalized in Russian'
      },
      {
        wrong: 'первый мая (masculine)',
        correct: 'первое мая (neuter)',
        explanation: 'Use neuter ordinal because "число" is neuter'
      },
      {
        wrong: 'в январь (nominative)',
        correct: 'в январе (prepositional)',
        explanation: '"In January" requires prepositional case'
      },
      {
        wrong: 'на понедельник',
        correct: 'в понедельник',
        explanation: 'Use "в" for days, not "на"'
      }
    ]
  },
  {
    type: 'title',
    text: 'Time Expressions'
  },
  {
    type: 'list',
    items: [
      '<strong>сегодня</strong> [segodnya] — today',
      '<strong>вчера</strong> [vchera] — yesterday',
      '<strong>завтра</strong> [zavtra] — tomorrow',
      '<strong>позавчера</strong> [pozavchera] — the day before yesterday',
      '<strong>послезавтра</strong> [poslezavtra] — the day after tomorrow',
      '<strong>неделя</strong> [nedelya] — week',
      '<strong>месяц</strong> [mesyats] — month',
      '<strong>год</strong> [god] — year',
      '<strong>каждый день</strong> [kazhdyy den] — every day',
      '<strong>каждую неделю</strong> [kazhduyu nedelyu] — every week'
    ]
  },
  {
    type: 'miniDialogue',
    title: 'Complete Dialogue: Making Plans',
    translation: '— What day is it today? — Today is Wednesday. — And what is the date? — June 15th. — Are you free on Friday? — Yes, on Friday I am free. What do you suggest? — Let us go to the cinema on Friday evening. — Great idea! See you on Friday!',
    lines: [
      { speaker: 'Анна', text: 'Какой сегодня день?' },
      { speaker: 'Иван', text: 'Сегодня среда.' },
      { speaker: 'Анна', text: 'А какое число?' },
      { speaker: 'Иван', text: 'Пятнадцатое июня.' },
      { speaker: 'Анна', text: 'Ты свободен в пятницу?' },
      { speaker: 'Иван', text: 'Да, в пятницу я свободен. Что ты предлагаешь?' },
      { speaker: 'Анна', text: 'Давай пойдём в кино в пятницу вечером.' },
      { speaker: 'Иван', text: 'Отличная идея! До пятницы!' }
    ]
  },
  {
    type: 'relatedTopics'
  }
];

const lesson7BlocksFr = [
  {
    type: 'mainTitle',
    text: 'Les jours, les mois et la date'
  },
  {
    type: 'subtitle',
    text: 'Parler du temps en russe'
  },
  {
    type: 'quickSummary',
    title: 'Points clés',
    keyForms: [
      { form: 'Какой сегодня день?', translation: 'Quel jour sommes-nous ?' },
      { form: 'Сегодня понедельник', translation: 'Aujourd\'hui c\'est lundi' },
      { form: 'Какое сегодня число?', translation: 'Quelle est la date ?' },
      { form: 'первое мая, второе июня', translation: '1er mai, 2 juin (nombres ordinaux)' }
    ]
  },
  {
    type: 'title',
    text: 'Les jours de la semaine'
  },
  {
    type: 'paragraph',
    text: 'Les jours de la semaine russes ne prennent PAS de majuscule (contrairement au français). La plupart des jours dérivent de nombres : понедельник (lundi) vient de "après dimanche", вторник de "deux" (deuxième jour), etc.'
  },
  {
    type: 'conjugationTable',
    title: 'Jours de la semaine',
    rows: [
      { pronoun: 'понедельник', form: '[ponedelnik]', translation: 'lundi', pronunciation: 'De "после недели" (après la semaine)' },
      { pronoun: 'вторник', form: '[vtornik]', translation: 'mardi', pronunciation: 'De "второй" (deuxième)' },
      { pronoun: 'среда', form: '[sreda]', translation: 'mercredi', pronunciation: 'Milieu de la semaine' },
      { pronoun: 'четверг', form: '[chetverg]', translation: 'jeudi', pronunciation: 'De "четыре" (quatre)' },
      { pronoun: 'пятница', form: '[pyatnitsa]', translation: 'vendredi', pronunciation: 'De "пять" (cinq)' },
      { pronoun: 'суббота', form: '[subbota]', translation: 'samedi', pronunciation: 'De l\'hébreu "Sabbat"' },
      { pronoun: 'воскресенье', form: '[voskresenie]', translation: 'dimanche', pronunciation: 'De "воскресить" (résurrection)' }
    ]
  },
  {
    type: 'title',
    text: 'Les mois de l\'année'
  },
  {
    type: 'paragraph',
    text: 'Les mois russes ne prennent pas non plus de majuscule. Beaucoup de noms de mois sont similaires aux langues européennes car ils dérivent du latin.'
  },
  {
    type: 'conjugationTable',
    title: 'Mois (Nominatif)',
    rows: [
      { pronoun: 'январь', form: '[yanvar]', translation: 'janvier' },
      { pronoun: 'февраль', form: '[fevral]', translation: 'février' },
      { pronoun: 'март', form: '[mart]', translation: 'mars' },
      { pronoun: 'апрель', form: '[aprel]', translation: 'avril' },
      { pronoun: 'май', form: '[may]', translation: 'mai' },
      { pronoun: 'июнь', form: '[iyun]', translation: 'juin' },
      { pronoun: 'июль', form: '[iyul]', translation: 'juillet' },
      { pronoun: 'август', form: '[avgust]', translation: 'août' },
      { pronoun: 'сентябрь', form: '[sentyabr]', translation: 'septembre' },
      { pronoun: 'октябрь', form: '[oktyabr]', translation: 'octobre' },
      { pronoun: 'ноябрь', form: '[noyabr]', translation: 'novembre' },
      { pronoun: 'декабрь', form: '[dekabr]', translation: 'décembre' }
    ]
  },
  {
    type: 'title',
    text: 'Demander le jour et la date'
  },
  {
    type: 'usageList',
    title: 'Questions temporelles',
    items: [
      {
        usage: 'Какой сегодня день? [kakoy segodnya den]',
        examples: [
          'Quel jour sommes-nous ?',
          'Сегодня понедельник — Aujourd\'hui c\'est lundi',
          'Сегодня пятница — Aujourd\'hui c\'est vendredi'
        ]
      },
      {
        usage: 'Какое сегодня число? [kakoye segodnya chislo]',
        examples: [
          'Quelle est la date ?',
          'Сегодня первое мая — Aujourd\'hui c\'est le 1er mai',
          'Сегодня десятое июня — Aujourd\'hui c\'est le 10 juin'
        ]
      },
      {
        usage: 'Какой месяц? [kakoy mesyats]',
        examples: [
          'Quel mois sommes-nous ?',
          'Сейчас январь — C\'est janvier maintenant',
          'Сейчас декабрь — C\'est décembre maintenant'
        ]
      }
    ]
  },
  {
    type: 'title',
    text: 'Nombres ordinaux pour les dates'
  },
  {
    type: 'paragraph',
    text: 'Pour dire les dates en russe, on utilise les <strong>nombres ordinaux</strong> (premier, deuxième, troisième...) au <strong>neutre nominatif</strong> car "число" (date/numéro) est neutre.'
  },
  {
    type: 'conjugationTable',
    title: 'Nombres ordinaux 1-31 (Neutre)',
    rows: [
      { pronoun: 'первое', form: '[pervoye]', translation: '1er' },
      { pronoun: 'второе', form: '[vtoroye]', translation: '2' },
      { pronoun: 'третье', form: '[tretye]', translation: '3' },
      { pronoun: 'четвёртое', form: '[chetvertoye]', translation: '4' },
      { pronoun: 'пятое', form: '[pyatoye]', translation: '5' },
      { pronoun: 'десятое', form: '[desyatoye]', translation: '10' },
      { pronoun: 'двадцатое', form: '[dvadsatoye]', translation: '20' },
      { pronoun: 'тридцать первое', form: '[tridtsat pervoye]', translation: '31' }
    ]
  },
  {
    type: 'title',
    text: 'Exprimer "le" (jour) ou "en" (mois)'
  },
  {
    type: 'paragraph',
    text: 'Pour dire "lundi", "le 5 juin", le russe utilise l\'<strong>accusatif</strong> avec la préposition <strong>в</strong> (pour les mois) ou juste l\'accusatif (pour les jours).'
  },
  {
    type: 'conjugationTable',
    title: 'Jours à l\'accusatif (Lundi...)',
    rows: [
      { pronoun: 'в понедельник', form: '[v ponedelnik]', translation: 'lundi' },
      { pronoun: 'во вторник', form: '[vo vtornik]', translation: 'mardi' },
      { pronoun: 'в среду', form: '[v sredu]', translation: 'mercredi' },
      { pronoun: 'в четверг', form: '[v chetverg]', translation: 'jeudi' },
      { pronoun: 'в пятницу', form: '[v pyatnitsu]', translation: 'vendredi' },
      { pronoun: 'в субботу', form: '[v subbotu]', translation: 'samedi' },
      { pronoun: 'в воскресенье', form: '[v voskresenie]', translation: 'dimanche' }
    ]
  },
  {
    type: 'title',
    text: 'Exprimer "en" (mois)'
  },
  {
    type: 'conjugationTable',
    title: 'Mois au prépositionnel (En janvier...)',
    rows: [
      { pronoun: 'в январе', form: '[v yanvare]', translation: 'en janvier' },
      { pronoun: 'в феврале', form: '[v fevrale]', translation: 'en février' },
      { pronoun: 'в марте', form: '[v marte]', translation: 'en mars' },
      { pronoun: 'в апреле', form: '[v aprele]', translation: 'en avril' },
      { pronoun: 'в мае', form: '[v mae]', translation: 'en mai' },
      { pronoun: 'в июне', form: '[v iyune]', translation: 'en juin' },
      { pronoun: 'в июле', form: '[v iyule]', translation: 'en juillet' },
      { pronoun: 'в августе', form: '[v avguste]', translation: 'en août' },
      { pronoun: 'в сентябре', form: '[v sentyabre]', translation: 'en septembre' },
      { pronoun: 'в октябре', form: '[v oktyabre]', translation: 'en octobre' },
      { pronoun: 'в ноябре', form: '[v noyabre]', translation: 'en novembre' },
      { pronoun: 'в декабре', form: '[v dekabre]', translation: 'en décembre' }
    ]
  },
  {
    type: 'mistakesTable',
    title: 'Erreurs courantes',
    rows: [
      {
        wrong: 'Понедельник (majuscule)',
        correct: 'понедельник (minuscule)',
        explanation: 'Jours et mois ne prennent PAS de majuscule en russe'
      },
      {
        wrong: 'первый мая (masculin)',
        correct: 'первое мая (neutre)',
        explanation: 'Utiliser ordinal neutre car "число" est neutre'
      },
      {
        wrong: 'в январь (nominatif)',
        correct: 'в январе (prépositionnel)',
        explanation: '"En janvier" requiert le cas prépositionnel'
      },
      {
        wrong: 'на понедельник',
        correct: 'в понедельник',
        explanation: 'Utiliser "в" pour les jours, pas "на"'
      }
    ]
  },
  {
    type: 'title',
    text: 'Expressions temporelles'
  },
  {
    type: 'list',
    items: [
      '<strong>сегодня</strong> [segodnya] — aujourd\'hui',
      '<strong>вчера</strong> [vchera] — hier',
      '<strong>завтра</strong> [zavtra] — demain',
      '<strong>позавчера</strong> [pozavchera] — avant-hier',
      '<strong>послезавтра</strong> [poslezavtra] — après-demain',
      '<strong>неделя</strong> [nedelya] — semaine',
      '<strong>месяц</strong> [mesyats] — mois',
      '<strong>год</strong> [god] — an / année',
      '<strong>каждый день</strong> [kazhdyy den] — chaque jour',
      '<strong>каждую неделю</strong> [kazhduyu nedelyu] — chaque semaine'
    ]
  },
  {
    type: 'miniDialogue',
    title: 'Dialogue complet : Faire des plans',
    translation: '— Quel jour sommes-nous ? — Aujourd\'hui c\'est mercredi. — Et quelle est la date ? — Le 15 juin. — Tu es libre vendredi ? — Oui, vendredi je suis libre. Que proposes-tu ? — Allons au cinéma vendredi soir. — Excellente idée ! À vendredi !',
    lines: [
      { speaker: 'Anna', text: 'Какой сегодня день?' },
      { speaker: 'Ivan', text: 'Сегодня среда.' },
      { speaker: 'Anna', text: 'А какое число?' },
      { speaker: 'Ivan', text: 'Пятнадцатое июня.' },
      { speaker: 'Anna', text: 'Ты свободен в пятницу?' },
      { speaker: 'Ivan', text: 'Да, в пятницу я свободен. Что ты предлагаешь?' },
      { speaker: 'Anna', text: 'Давай пойдём в кино в пятницу вечером.' },
      { speaker: 'Ivan', text: 'Отличная идея! До пятницы!' }
    ]
  },
  {
    type: 'relatedTopics'
  }
];

// ====================
// LESSON 8: Time and Daily Schedule
// ====================
const lesson8BlocksEn = [
  { type: 'mainTitle', text: 'Time and Daily Schedule' },
  { type: 'subtitle', text: 'Telling Time in Russian' },
  {
    type: 'quickSummary',
    title: 'Key Points',
    keyForms: [
      { form: 'Который час?', translation: 'What time is it?' },
      { form: 'Сейчас два часа', translation: 'It is 2 o\'clock now' },
      { form: 'В котором часу?', translation: 'At what time?' },
      { form: 'утром, днём, вечером, ночью', translation: 'in the morning, afternoon, evening, at night' }
    ]
  },
  { type: 'title', text: 'Asking What Time It Is' },
  {
    type: 'paragraph',
    text: 'To ask "What time is it?" in Russian, use <strong>Который час?</strong> (literally "Which hour?"). To answer, use <strong>Сейчас...</strong> (Now it is...).'
  },
  {
    type: 'conjugationTable',
    title: 'Hours (1-12)',
    rows: [
      { pronoun: 'один час', form: '[odin chas]', translation: '1 o\'clock', pronunciation: 'Nominative singular' },
      { pronoun: 'два часа', form: '[dva chasa]', translation: '2 o\'clock', pronunciation: 'Genitive singular' },
      { pronoun: 'три часа', form: '[tri chasa]', translation: '3 o\'clock', pronunciation: 'Genitive singular' },
      { pronoun: 'четыре часа', form: '[chetyre chasa]', translation: '4 o\'clock', pronunciation: 'Genitive singular' },
      { pronoun: 'пять часов', form: '[pyat chasov]', translation: '5 o\'clock', pronunciation: 'Genitive plural' },
      { pronoun: 'шесть часов', form: '[shest chasov]', translation: '6 o\'clock', pronunciation: 'Genitive plural' },
      { pronoun: 'семь часов', form: '[sem chasov]', translation: '7 o\'clock', pronunciation: 'Genitive plural' },
      { pronoun: 'двенадцать часов', form: '[dvenadtsat chasov]', translation: '12 o\'clock', pronunciation: 'Genitive plural' }
    ]
  },
  { type: 'title', text: 'Minutes Past the Hour' },
  {
    type: 'paragraph',
    text: 'For times like "3:15" or "5:30", Russian uses the hour + minutes. The word "минута" changes like "час" (1 минута, 2-4 минуты, 5+ минут).'
  },
  {
    type: 'conjugationTable',
    title: 'Common Time Expressions',
    rows: [
      { pronoun: 'два часа пять минут', form: '[dva chasa pyat minut]', translation: '2:05', pronunciation: '2 hours 5 minutes' },
      { pronoun: 'три часа пятнадцать минут', form: '[tri chasa pyatnadtsat minut]', translation: '3:15', pronunciation: '3 hours 15 minutes' },
      { pronoun: 'четыре часа тридцать минут', form: '[chetyre chasa tridtsat minut]', translation: '4:30', pronunciation: '4 hours 30 minutes' },
      { pronoun: 'пять часов сорок пять минут', form: '[pyat chasov sorok pyat minut]', translation: '5:45', pronunciation: '5 hours 45 minutes' },
      { pronoun: 'половина третьего', form: '[polovina tretyego]', translation: '2:30 (half of third)', pronunciation: 'Common expression for :30' }
    ]
  },
  { type: 'title', text: 'Asking "At What Time?"' },
  {
    type: 'usageList',
    title: 'Time Prepositions',
    items: [
      {
        usage: 'В котором часу? [v kotorom chasu]',
        examples: [
          'At what time?',
          'В котором часу начинается урок? — At what time does the lesson start?',
          'В котором часу ты встаёшь? — At what time do you wake up?'
        ]
      },
      {
        usage: 'В + Accusative (for specific times)',
        examples: [
          'в два часа — at 2 o\'clock',
          'в три часа — at 3 o\'clock',
          'в пять часов — at 5 o\'clock'
        ],
        commonMistake: {
          wrong: 'в два часов (genitive)',
          correct: 'в два часа (accusative)'
        }
      },
      {
        usage: 'в половине + Genitive',
        examples: [
          'в половине третьего — at 2:30',
          'в половине пятого — at 4:30'
        ]
      }
    ]
  },
  { type: 'title', text: 'Parts of the Day' },
  {
    type: 'conjugationTable',
    title: 'Time Expressions',
    rows: [
      { pronoun: 'утро', form: '[utro]', translation: 'morning', pronunciation: 'Noun' },
      { pronoun: 'утром', form: '[utrom]', translation: 'in the morning', pronunciation: 'Instrumental (time)' },
      { pronoun: 'день', form: '[den]', translation: 'day / afternoon', pronunciation: 'Noun' },
      { pronoun: 'днём', form: '[dnyom]', translation: 'in the afternoon', pronunciation: 'Instrumental' },
      { pronoun: 'вечер', form: '[vecher]', translation: 'evening', pronunciation: 'Noun' },
      { pronoun: 'вечером', form: '[vecherom]', translation: 'in the evening', pronunciation: 'Instrumental' },
      { pronoun: 'ночь', form: '[noch]', translation: 'night', pronunciation: 'Noun (feminine)' },
      { pronoun: 'ночью', form: '[nochyu]', translation: 'at night', pronunciation: 'Instrumental' }
    ]
  },
  { type: 'title', text: 'Daily Activities' },
  {
    type: 'conjugationTable',
    title: 'Daily Routine Verbs',
    rows: [
      { pronoun: 'вставать / встать', form: '[vstavat / vstat]', translation: 'to get up, to wake up' },
      { pronoun: 'завтракать', form: '[zavtrakat]', translation: 'to have breakfast' },
      { pronoun: 'обедать', form: '[obedat]', translation: 'to have lunch' },
      { pronoun: 'ужинать', form: '[uzhinat]', translation: 'to have dinner' },
      { pronoun: 'работать', form: '[rabotat]', translation: 'to work' },
      { pronoun: 'учиться', form: '[uchitsya]', translation: 'to study' },
      { pronoun: 'ложиться спать', form: '[lozhitsya spat]', translation: 'to go to bed' }
    ]
  },
  {
    type: 'mistakesTable',
    title: 'Common Mistakes',
    rows: [
      { wrong: 'в два часов', correct: 'в два часа', explanation: 'Use accusative, not genitive with "в"' },
      { wrong: 'Который час сейчас?', correct: 'Который час?', explanation: '"Сейчас" is optional in the question' },
      { wrong: 'утро (for "in the morning")', correct: 'утром (instrumental)', explanation: 'Use instrumental for time expressions' },
      { wrong: 'половина три', correct: 'половина третьего (genitive)', explanation: 'Use genitive ordinal number' }
    ]
  },
  { type: 'title', text: 'Key Vocabulary' },
  {
    type: 'list',
    items: [
      '<strong>час</strong> [chas] — hour, o\'clock',
      '<strong>минута</strong> [minuta] — minute',
      '<strong>секунда</strong> [sekunda] — second',
      '<strong>время</strong> [vremya] — time',
      '<strong>рано</strong> [rano] — early',
      '<strong>поздно</strong> [pozdno] — late',
      '<strong>вовремя</strong> [vovremya] — on time',
      '<strong>расписание</strong> [raspisanie] — schedule',
      '<strong>будильник</strong> [budilnik] — alarm clock'
    ]
  },
  {
    type: 'miniDialogue',
    title: 'Complete Dialogue: Daily Schedule',
    translation: '— Masha, at what time do you wake up? — I wake up at 7 o\'clock in the morning. And you? — I wake up at 6:30. At what time do you have breakfast? — At 8 o\'clock. Then I go to work at 9. — And at what time do you come home? — Usually at 6 in the evening. — And when do you go to bed? — At 11 at night. And you? — I go to bed at 10:30.',
    lines: [
      { speaker: 'Иван', text: 'Маша, в котором часу ты встаёшь?' },
      { speaker: 'Маша', text: 'Я встаю в семь часов утра. А ты?' },
      { speaker: 'Иван', text: 'Я встаю в половине седьмого. В котором часу ты завтракаешь?' },
      { speaker: 'Маша', text: 'В восемь часов. Потом я иду на работу в девять.' },
      { speaker: 'Иван', text: 'А в котором часу ты приходишь домой?' },
      { speaker: 'Маша', text: 'Обычно в шесть часов вечера.' },
      { speaker: 'Иван', text: 'А когда ты ложишься спать?' },
      { speaker: 'Маша', text: 'В одиннадцать часов ночи. А ты?' },
      { speaker: 'Иван', text: 'Я ложусь спать в половине одиннадцатого.' }
    ]
  },
  { type: 'relatedTopics' }
];

const lesson8BlocksFr = [
  { type: 'mainTitle', text: 'L\'heure et l\'emploi du temps' },
  { type: 'subtitle', text: 'Dire l\'heure en russe' },
  {
    type: 'quickSummary',
    title: 'Points clés',
    keyForms: [
      { form: 'Который час?', translation: 'Quelle heure est-il ?' },
      { form: 'Сейчас два часа', translation: 'Il est 2 heures maintenant' },
      { form: 'В котором часу?', translation: 'À quelle heure ?' },
      { form: 'утром, днём, вечером, ночью', translation: 'le matin, l\'après-midi, le soir, la nuit' }
    ]
  },
  { type: 'title', text: 'Demander l\'heure' },
  {
    type: 'paragraph',
    text: 'Pour demander "Quelle heure est-il ?" en russe, on utilise <strong>Который час?</strong> (littéralement "Quelle heure ?"). Pour répondre, on utilise <strong>Сейчас...</strong> (Maintenant il est...).'
  },
  {
    type: 'conjugationTable',
    title: 'Les heures (1-12)',
    rows: [
      { pronoun: 'один час', form: '[odin chas]', translation: '1 heure', pronunciation: 'Nominatif singulier' },
      { pronoun: 'два часа', form: '[dva chasa]', translation: '2 heures', pronunciation: 'Génitif singulier' },
      { pronoun: 'три часа', form: '[tri chasa]', translation: '3 heures', pronunciation: 'Génitif singulier' },
      { pronoun: 'четыре часа', form: '[chetyre chasa]', translation: '4 heures', pronunciation: 'Génitif singulier' },
      { pronoun: 'пять часов', form: '[pyat chasov]', translation: '5 heures', pronunciation: 'Génitif pluriel' },
      { pronoun: 'шесть часов', form: '[shest chasov]', translation: '6 heures', pronunciation: 'Génitif pluriel' },
      { pronoun: 'семь часов', form: '[sem chasov]', translation: '7 heures', pronunciation: 'Génitif pluriel' },
      { pronoun: 'двенадцать часов', form: '[dvenadtsat chasov]', translation: '12 heures', pronunciation: 'Génitif pluriel' }
    ]
  },
  { type: 'title', text: 'Les minutes' },
  {
    type: 'paragraph',
    text: 'Pour les heures comme "3h15" ou "5h30", le russe utilise l\'heure + les minutes. Le mot "минута" change comme "час" (1 минута, 2-4 минуты, 5+ минут).'
  },
  {
    type: 'conjugationTable',
    title: 'Expressions temporelles courantes',
    rows: [
      { pronoun: 'два часа пять минут', form: '[dva chasa pyat minut]', translation: '2h05', pronunciation: '2 heures 5 minutes' },
      { pronoun: 'три часа пятнадцать минут', form: '[tri chasa pyatnadtsat minut]', translation: '3h15', pronunciation: '3 heures 15 minutes' },
      { pronoun: 'четыре часа тридцать минут', form: '[chetyre chasa tridtsat minut]', translation: '4h30', pronunciation: '4 heures 30 minutes' },
      { pronoun: 'пять часов сорок пять минут', form: '[pyat chasov sorok pyat minut]', translation: '5h45', pronunciation: '5 heures 45 minutes' },
      { pronoun: 'половина третьего', form: '[polovina tretyego]', translation: '2h30 (moitié du troisième)', pronunciation: 'Expression courante pour :30' }
    ]
  },
  { type: 'title', text: 'Demander "À quelle heure ?"' },
  {
    type: 'usageList',
    title: 'Prépositions temporelles',
    items: [
      {
        usage: 'В котором часу? [v kotorom chasu]',
        examples: [
          'À quelle heure ?',
          'В котором часу начинается урок? — À quelle heure commence le cours ?',
          'В котором часу ты встаёшь? — À quelle heure te lèves-tu ?'
        ]
      },
      {
        usage: 'В + Accusatif (pour heures précises)',
        examples: [
          'в два часа — à 2 heures',
          'в три часа — à 3 heures',
          'в пять часов — à 5 heures'
        ],
        commonMistake: {
          wrong: 'в два часов (génitif)',
          correct: 'в два часа (accusatif)'
        }
      },
      {
        usage: 'в половине + Génitif',
        examples: [
          'в половине третьего — à 2h30',
          'в половине пятого — à 4h30'
        ]
      }
    ]
  },
  { type: 'title', text: 'Moments de la journée' },
  {
    type: 'conjugationTable',
    title: 'Expressions temporelles',
    rows: [
      { pronoun: 'утро', form: '[utro]', translation: 'matin', pronunciation: 'Nom' },
      { pronoun: 'утром', form: '[utrom]', translation: 'le matin', pronunciation: 'Instrumental (temps)' },
      { pronoun: 'день', form: '[den]', translation: 'jour / après-midi', pronunciation: 'Nom' },
      { pronoun: 'днём', form: '[dnyom]', translation: 'l\'après-midi', pronunciation: 'Instrumental' },
      { pronoun: 'вечер', form: '[vecher]', translation: 'soir', pronunciation: 'Nom' },
      { pronoun: 'вечером', form: '[vecherom]', translation: 'le soir', pronunciation: 'Instrumental' },
      { pronoun: 'ночь', form: '[noch]', translation: 'nuit', pronunciation: 'Nom (féminin)' },
      { pronoun: 'ночью', form: '[nochyu]', translation: 'la nuit', pronunciation: 'Instrumental' }
    ]
  },
  { type: 'title', text: 'Activités quotidiennes' },
  {
    type: 'conjugationTable',
    title: 'Verbes de la routine quotidienne',
    rows: [
      { pronoun: 'вставать / встать', form: '[vstavat / vstat]', translation: 'se lever' },
      { pronoun: 'завтракать', form: '[zavtrakat]', translation: 'prendre le petit-déjeuner' },
      { pronoun: 'обедать', form: '[obedat]', translation: 'déjeuner' },
      { pronoun: 'ужинать', form: '[uzhinat]', translation: 'dîner' },
      { pronoun: 'работать', form: '[rabotat]', translation: 'travailler' },
      { pronoun: 'учиться', form: '[uchitsya]', translation: 'étudier' },
      { pronoun: 'ложиться спать', form: '[lozhitsya spat]', translation: 'se coucher' }
    ]
  },
  {
    type: 'mistakesTable',
    title: 'Erreurs courantes',
    rows: [
      { wrong: 'в два часов', correct: 'в два часа', explanation: 'Utiliser l\'accusatif, pas le génitif avec "в"' },
      { wrong: 'Который час сейчас?', correct: 'Который час?', explanation: '"Сейчас" est optionnel dans la question' },
      { wrong: 'утро (pour "le matin")', correct: 'утром (instrumental)', explanation: 'Utiliser l\'instrumental pour les expressions de temps' },
      { wrong: 'половина три', correct: 'половина третьего (génitif)', explanation: 'Utiliser le nombre ordinal au génitif' }
    ]
  },
  { type: 'title', text: 'Vocabulaire clé' },
  {
    type: 'list',
    items: [
      '<strong>час</strong> [chas] — heure',
      '<strong>минута</strong> [minuta] — minute',
      '<strong>секунда</strong> [sekunda] — seconde',
      '<strong>время</strong> [vremya] — temps',
      '<strong>рано</strong> [rano] — tôt',
      '<strong>поздно</strong> [pozdno] — tard',
      '<strong>вовремя</strong> [vovremya] — à l\'heure',
      '<strong>расписание</strong> [raspisanie] — emploi du temps',
      '<strong>будильник</strong> [budilnik] — réveil'
    ]
  },
  {
    type: 'miniDialogue',
    title: 'Dialogue complet : Emploi du temps quotidien',
    translation: '— Macha, à quelle heure te lèves-tu ? — Je me lève à 7 heures du matin. Et toi ? — Je me lève à 6h30. À quelle heure prends-tu ton petit-déjeuner ? — À 8 heures. Ensuite je vais au travail à 9 heures. — Et à quelle heure rentres-tu à la maison ? — D\'habitude à 6 heures du soir. — Et quand te couches-tu ? — À 11 heures du soir. Et toi ? — Je me couche à 10h30.',
    lines: [
      { speaker: 'Ivan', text: 'Маша, в котором часу ты встаёшь?' },
      { speaker: 'Macha', text: 'Я встаю в семь часов утра. А ты?' },
      { speaker: 'Ivan', text: 'Я встаю в половине седьмого. В котором часу ты завтракаешь?' },
      { speaker: 'Macha', text: 'В восемь часов. Потом я иду на работу в девять.' },
      { speaker: 'Ivan', text: 'А в котором часу ты приходишь домой?' },
      { speaker: 'Macha', text: 'Обычно в шесть часов вечера.' },
      { speaker: 'Ivan', text: 'А когда ты ложишься спать?' },
      { speaker: 'Macha', text: 'В одиннадцать часов ночи. А ты?' },
      { speaker: 'Ivan', text: 'Я ложусь спать в половине одиннадцатого.' }
    ]
  },
  { type: 'relatedTopics' }
];

// Continue with lessons 9-20...

const allLessons = [
  createLesson(6, 'Numbers 20-100 and Money', 'Les nombres 20-100 et l\'argent', 'Числа 20-100 и деньги', lesson6BlocksEn, lesson6BlocksFr),
  createLesson(7, 'Days, Months and the Date', 'Les jours, les mois et la date', 'Дни, месяцы и дата', lesson7BlocksEn, lesson7BlocksFr),
  createLesson(8, 'Time and Daily Schedule', 'L\'heure et l\'emploi du temps', 'Время и расписание дня', lesson8BlocksEn, lesson8BlocksFr)
  // Lessons 9-20 will be added below
];

async function insertLessons() {
  console.log('🚀 Starting to insert Russian lessons 6-20...\n');

  for (const lesson of allLessons) {
    try {
      console.log(`📝 Inserting Lesson ${lesson.order}: ${lesson.title_en}...`);

      const { data, error } = await supabase
        .from('lessons')
        .insert([lesson])
        .select();

      if (error) {
        console.error(`❌ Error inserting lesson ${lesson.order}:`, error);
        continue;
      }

      console.log(`✅ Lesson ${lesson.order} inserted successfully!\n`);
    } catch (err) {
      console.error(`❌ Exception inserting lesson ${lesson.order}:`, err);
    }
  }

  console.log('✅ All lessons inserted successfully!');
}

// Run the script
if (require.main === module) {
  insertLessons().catch(console.error);
}

module.exports = { allLessons, createLesson };
