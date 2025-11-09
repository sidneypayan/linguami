require('dotenv').config({path:'.env.local'})
const{createClient}=require('@supabase/supabase-js')
const s=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY)

const exercises = [
  {
    material_id: 112, type: 'mcq', title: 'Понимание текста', lang: 'ru', level: 'intermediate', xp_reward: 15,
    data: { questions: [
      { id: 1, question: {fr:"Quel type de territoire est la République de l'Altaï ?",en:"What type of territory is the Altai Republic?",ru:"Какой тип территории представляет собой Республика Алтай?"}, options: [{key:"A",text:{fr:"Un territoire plat",en:"A flat territory",ru:"Плоская территория"}},{key:"B",text:{fr:"Un territoire montagneux",en:"A mountainous territory",ru:"Гористая территория"}},{key:"C",text:{fr:"Un territoire côtier",en:"A coastal territory",ru:"Прибрежная территория"}}], correctAnswer:"B", explanation:{fr:"La République de l'Altaï est une région montagneuse.",en:"The Altai Republic is a mountainous region.",ru:"Республика Алтай - это горная территория."}},
      { id: 2, question: {fr:"Comment est l'été dans l'Altaï ?",en:"How is summer in the Altai?",ru:"Какое лето на Алтае?"}, options: [{key:"A",text:{fr:"Court et chaud",en:"Short and hot",ru:"Короткое и жаркое"}},{key:"B",text:{fr:"Long et frais",en:"Long and cool",ru:"Длинное и прохладное"}},{key:"C",text:{fr:"Doux et pluvieux",en:"Mild and rainy",ru:"Мягкое и дождливое"}}], correctAnswer:"A", explanation:{fr:"L'été dans l'Altaï est court mais très chaud.",en:"Summer in the Altai is short but very hot.",ru:"Лето на Алтае короткое, но очень жаркое."}},
      { id: 3, question: {fr:"Qu'est-ce qui rend l'Altaï célèbre ?",en:"What makes the Altai famous?",ru:"Чем знаменит Алтай?"}, options: [{key:"A",text:{fr:"Ses villes",en:"Its cities",ru:"Своими городами"}},{key:"B",text:{fr:"Sa nature et ses montagnes",en:"Its nature and mountains",ru:"Своей природой и горами"}},{key:"C",text:{fr:"Ses plages",en:"Its beaches",ru:"Своими пляжами"}}], correctAnswer:"B", explanation:{fr:"L'Altaï est célèbre pour sa nature exceptionnelle.",en:"The Altai is famous for its exceptional nature.",ru:"Алтай знаменит своей исключительной природой."}}
    ]}
  },
  {
    material_id: 112, type: 'fitb', title: 'Понимание на слух', lang: 'ru', level: 'intermediate', xp_reward: 15,
    data: { sentences: [{id:1,text:"Это ___ территория.",answer:"гористая"},{id:2,text:"Лето здесь очень короткое и ___.",answer:"жаркое"},{id:3,text:"Природа этого края ___.",answer:"завораживает"}]}
  },
  {
    material_id: 112, type: 'drag_drop', title: 'Упражнение на лексику', lang: 'ru', level: 'intermediate', xp_reward: 15,
    data: { pairs: [{id:1,ru:"республика",fr:"république",en:"republic"},{id:2,ru:"хребет",fr:"chaîne de montagnes",en:"mountain range"},{id:3,ru:"долина",fr:"vallée",en:"valley"},{id:4,ru:"лето",fr:"été",en:"summer"},{id:5,ru:"природа",fr:"nature",en:"nature"},{id:6,ru:"пещера",fr:"grotte",en:"cave"}]}
  },
  {
    material_id: 114, type: 'mcq', title: 'Понимание текста', lang: 'ru', level: 'intermediate', xp_reward: 15,
    data: { questions: [
      { id: 1, question: {fr:"Où se trouve le lac Baïkal ?",en:"Where is Lake Baikal located?",ru:"Где находится озеро Байкал?"}, options: [{key:"A",text:{fr:"Dans le nord de la Russie",en:"In northern Russia",ru:"На севере России"}},{key:"B",text:{fr:"En Sibérie orientale",en:"In Eastern Siberia",ru:"В Восточной Сибири"}},{key:"C",text:{fr:"Dans l'Oural",en:"In the Urals",ru:"На Урале"}}], correctAnswer:"B", explanation:{fr:"Le lac Baïkal est situé en Sibérie orientale.",en:"Lake Baikal is located in Eastern Siberia.",ru:"Озеро Байкал находится в Восточной Сибири."}},
      { id: 2, question: {fr:"Quelle est la particularité du Baïkal ?",en:"What is special about Baikal?",ru:"В чем особенность Байкала?"}, options: [{key:"A",text:{fr:"C'est le lac le plus profond avec de l'eau douce",en:"It's the deepest freshwater lake",ru:"Это самое глубокое озеро с пресной водой"}},{key:"B",text:{fr:"C'est le lac le plus grand",en:"It's the largest lake",ru:"Это самое большое озеро"}},{key:"C",text:{fr:"C'est le lac le plus salé",en:"It's the saltiest lake",ru:"Это самое соленое озеро"}}], correctAnswer:"A", explanation:{fr:"Le Baïkal est le lac le plus profond du monde.",en:"Baikal is the world's deepest freshwater lake.",ru:"Байкал - самое глубокое пресноводное озеро в мире."}},
      { id: 3, question: {fr:"Comment les habitants locaux appellent-ils le Baïkal ?",en:"What do local residents call Baikal?",ru:"Как местные жители называют Байкал?"}, options: [{key:"A",text:{fr:"L'océan",en:"The ocean",ru:"Океаном"}},{key:"B",text:{fr:"La mer",en:"The sea",ru:"Морем"}},{key:"C",text:{fr:"Le fleuve",en:"The river",ru:"Рекой"}}], correctAnswer:"B", explanation:{fr:"Les habitants locaux appellent le Baïkal 'la mer'.",en:"Local residents call Baikal 'the sea'.",ru:"Местные жители называют Байкал 'морем'."}}
    ]}
  },
  {
    material_id: 114, type: 'fitb', title: 'Понимание на слух', lang: 'ru', level: 'intermediate', xp_reward: 15,
    data: { sentences: [{id:1,text:"Байкал – самое ___ озеро на планете.",answer:"глубокое"},{id:2,text:"Местные жители традиционно называют Байкал ___.",answer:"морем"},{id:3,text:"Волны на озере достигают 4-5 ___ в высоту.",answer:"метров"}]}
  },
  {
    material_id: 114, type: 'drag_drop', title: 'Упражнение на лексику', lang: 'ru', level: 'intermediate', xp_reward: 15,
    data: { pairs: [{id:1,ru:"озеро",fr:"lac",en:"lake"},{id:2,ru:"глубокий",fr:"profond",en:"deep"},{id:3,ru:"пресная вода",fr:"eau douce",en:"fresh water"},{id:4,ru:"флора",fr:"flore",en:"flora"},{id:5,ru:"фауна",fr:"faune",en:"fauna"},{id:6,ru:"шторм",fr:"tempête",en:"storm"}]}
  },
  {
    material_id: 115, type: 'mcq', title: 'Понимание текста', lang: 'ru', level: 'intermediate', xp_reward: 15,
    data: { questions: [
      { id: 1, question: {fr:"Où se trouve la Vallée des Geysers ?",en:"Where is the Valley of Geysers located?",ru:"Где находится Долина Гейзеров?"}, options: [{key:"A",text:{fr:"Au Kamtchatka",en:"In Kamchatka",ru:"На Камчатке"}},{key:"B",text:{fr:"En Sibérie",en:"In Siberia",ru:"В Сибири"}},{key:"C",text:{fr:"Dans l'Altaï",en:"In the Altai",ru:"На Алтае"}}], correctAnswer:"A", explanation:{fr:"La Vallée des Geysers se trouve au Kamtchatka.",en:"The Valley of Geysers is located in Kamchatka.",ru:"Долина Гейзеров находится на Камчатке."}},
      { id: 2, question: {fr:"Quand la Vallée des Geysers a-t-elle été découverte ?",en:"When was the Valley of Geysers discovered?",ru:"Когда была открыта Долина Гейзеров?"}, options: [{key:"A",text:{fr:"En 1931",en:"In 1931",ru:"В 1931 году"}},{key:"B",text:{fr:"En 1941",en:"In 1941",ru:"В 1941 году"}},{key:"C",text:{fr:"En 1951",en:"In 1951",ru:"В 1951 году"}}], correctAnswer:"B", explanation:{fr:"La Vallée des Geysers a été découverte en 1941.",en:"The Valley of Geysers was discovered in 1941.",ru:"Долина Гейзеров была открыта в 1941 году."}},
      { id: 3, question: {fr:"Comment s'appelle le geyser le plus grand ?",en:"What is the name of the largest geyser?",ru:"Как называется самый большой гейзер?"}, options: [{key:"A",text:{fr:"Le Grand",en:"The Great",ru:"Большой"}},{key:"B",text:{fr:"Le Géant",en:"The Giant",ru:"Великан"}},{key:"C",text:{fr:"Le Puissant",en:"The Powerful",ru:"Мощный"}}], correctAnswer:"B", explanation:{fr:"Le geyser le plus grand s'appelle 'Великан' (le Géant).",en:"The largest geyser is called 'Великан' (the Giant).",ru:"Самый большой гейзер называется 'Великан'."}}
    ]}
  },
  {
    material_id: 115, type: 'fitb', title: 'Понимание на слух', lang: 'ru', level: 'intermediate', xp_reward: 15,
    data: { sentences: [{id:1,text:"Долина Гейзеров была открыта в ___ году.",answer:"1941"},{id:2,text:"Это единственное гейзерное поле в ___.",answer:"Евразии"},{id:3,text:"Фонтан самого большого гейзера достигает в высоту ___ метров.",answer:"30"}]}
  },
  {
    material_id: 115, type: 'drag_drop', title: 'Упражнение на лексику', lang: 'ru', level: 'intermediate', xp_reward: 15,
    data: { pairs: [{id:1,ru:"долина",fr:"vallée",en:"valley"},{id:2,ru:"гейзер",fr:"geyser",en:"geyser"},{id:3,ru:"источник",fr:"source",en:"spring"},{id:4,ru:"водопад",fr:"cascade",en:"waterfall"},{id:5,ru:"кипящий",fr:"bouillant",en:"boiling"},{id:6,ru:"фонтан",fr:"fontaine",en:"fountain"}]}
  }
];

(async()=>{
  console.log('🚀 Insertion de 9 exercices pour beautiful-places...\n')
  for(const ex of exercises){
    const {error}=await s.from('exercises').insert(ex)
    if(error) console.error(`❌ ${ex.material_id} ${ex.type}: ${error.message}`)
    else console.log(`✅ Material ${ex.material_id} - ${ex.type}`)
  }
  console.log('\n✅ Terminé!')
})()
