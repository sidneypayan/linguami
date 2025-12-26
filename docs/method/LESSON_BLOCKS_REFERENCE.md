# Structure des Blocks pour la Méthode Linguami

Ce document décrit la structure JSON des `blocks` utilisés dans les leçons (`course_lessons.blocks`).

Inspiré de la méthode Harrap's, chaque leçon est composée d'une séquence de blocks de différents types.

---

## 📚 Documentation connexe

- **[LESSON_CREATION_GUIDE.md](./LESSON_CREATION_GUIDE.md)** - Guide méthodologique complet pour créer des lessons
- **[LESSON_TEMPLATE.json](./LESSON_TEMPLATE.json)** - Exemple complet d'une leçon avec tous les blocks
- **[AUDIO_GENERATION.md](./AUDIO_GENERATION.md)** - Génération audio pour les dialogues

---

## Types de Blocks disponibles

### 1. `dialogue` - Dialogue d'introduction

Dialogue authentique avec vocabulaire ligne par ligne et récapitulatif.

```json
{
  "type": "dialogue",
  "title": "À l'aéroport",
  "lines": [
    {
      "speaker": "Agent de douane",
      "speakerGender": "male",
      "text": "Bonjour ! Votre passeport, s'il vous plaît.",
      "audioUrl": "/audio/courses/debutant/lecon-1/line-1.mp3",
      "vocab": [
        {
          "word": "Bonjour",
          "translation": "Salutation formelle (matin/après-midi)"
        },
        {
          "word": "s'il vous plaît",
          "translation": "Expression de politesse (formel)"
        }
      ]
    },
    {
      "speaker": "Touriste",
      "speakerGender": "female",
      "text": "Voici mon passeport.",
      "audioUrl": "/audio/courses/debutant/lecon-1/line-2.mp3",
      "vocab": [
        {
          "word": "Voici",
          "translation": "Présentatif (voilà, c'est ici)"
        }
      ]
    }
  ],
  "vocabulary": [
    {
      "word": "passeport",
      "translation": "паспорт",
      "category": "noms",
      "note": "Masculin : le passeport"
    },
    {
      "word": "Bonjour",
      "translation": "Здравствуйте",
      "category": "expressions"
    }
  ]
}
```

**Champs :**
- `lines[].vocab` : Vocabulaire inline expliqué dans chaque ligne (optionnel)
- `vocabulary[]` : Récapitulatif du vocabulaire du dialogue avec `category` et `note` (optionnel)

---

### 2. `grammar` - Point de grammaire

Explication grammaticale avec exemples et tableaux (optionnellement avec audio).

```json
{
  "type": "grammar",
  "title": "Le présent de l'indicatif",
  "icon": "book",
  "explanation": "Le présent de l'indicatif exprime une action qui se passe maintenant...",
  "examples": [
    {
      "sentence": "Je parle français",
      "translation": "Я говорю по-французски",
      "highlight": "parle",
      "note": "Verbe en -er, 1ère personne",
      "audioUrl": "/audio/grammar/je-parle-francais.mp3"
    }
  ],
  "table": {
    "title": "Conjugaison du verbe PARLER",
    "headers": ["Pronom", "Forme", "Traduction"],
    "rows": [
      ["je", "parle", "я говорю"],
      ["tu", "parles", "ты говоришь"],
      ["il/elle", "parle", "он/она говорит"],
      ["nous", "parlons", "мы говорим"],
      ["vous", "parlez", "вы говорите"],
      ["ils/elles", "parlent", "они говорят"]
    ],
    "rowsAudio": [
      "/audio/conjugation/parler/je-parle.mp3",
      "/audio/conjugation/parler/tu-parles.mp3",
      "/audio/conjugation/parler/il-parle.mp3",
      "/audio/conjugation/parler/nous-parlons.mp3",
      "/audio/conjugation/parler/vous-parlez.mp3",
      "/audio/conjugation/parler/ils-parlent.mp3"
    ]
  }
}
```

**Champs :**
- `examples[].audioUrl` : Audio de l'exemple (optionnel)
- `table.rowsAudio` : Audio pour chaque ligne du tableau (optionnel)

---

### 3. `culture` - Point socioculturel

Information culturelle avec contexte.

```json
{
  "type": "culture",
  "title": "Le vouvoiement en France",
  "icon": "globe",
  "content": "En France, on utilise 'vous' pour s'adresser poliment à quelqu'un qu'on ne connaît pas bien...",
  "keyPoints": [
    "Toujours vouvoyer dans un contexte professionnel",
    "Les jeunes se tutoient plus facilement",
    "Attendre l'invitation pour tutoyer"
  ],
  "images": [
    "/images/culture/vouvoiement.jpg"
  ],
  "comparison": {
    "fr": "Vouvoiement très courant",
    "ru": "Вы aussi utilisé formellement"
  }
}
```

---

### 4. `exerciseInline` - Exercice intégré

Petit exercice rapide intégré dans le flux de la leçon.

```json
{
  "type": "exerciseInline",
  "exerciseType": "fillInBlank",
  "title": "Complétez les phrases",
  "icon": "edit",
  "questions": [
    {
      "question": "Bonjour, je ____ français. (parler)",
      "answer": "parle",
      "acceptableAnswers": ["parle"],
      "hint": "Première personne du singulier"
    }
  ],
  "xpReward": 5
}
```

---

### 5. `exerciseLink` - Lien vers exercices externes

Lien vers des exercices complets (MCQ, FITB, Drag-drop) déjà dans la base.

```json
{
  "type": "exerciseLink",
  "exerciseIds": [12, 13, 14],
  "description": "Testez vos connaissances avec ces exercices !"
}
```

---

### 6. `vocabulary` - Liste de vocabulaire

Liste thématique de mots à apprendre.

```json
{
  "type": "vocabulary",
  "title": "Vocabulaire de l'aéroport",
  "icon": "book",
  "category": "voyage",
  "words": [
    {
      "word": "passeport",
      "translation": "паспорт",
      "example": "Votre passeport, s'il vous plaît",
      "exampleTranslation": "Ваш паспорт, пожалуйста",
      "note": "Masculin : le passeport"
    },
    {
      "word": "Enchanté(e)",
      "translation": "Рад(а) познакомиться",
      "example": "Enchanté, Sophie !",
      "exampleTranslation": "Рад познакомиться, София!",
      "note": "Enchanté (homme) / Enchantée (femme)"
    }
  ]
}
```

**Champs :**
- `note` : Note grammaticale ou contextuelle (optionnel)
- `category` : Catégorie du vocabulaire (optionnel)

---

### 7. `audio` - Exercice d'écoute

Compréhension orale avec questions.

```json
{
  "type": "audio",
  "title": "Écoutez et répondez",
  "audioUrl": "/audio/courses/debutant/lecon-1/conversation.mp3",
  "transcript": "Bonjour, je voudrais un billet pour Paris...",
  "questions": [
    {
      "question": "Où veut aller la personne ?",
      "type": "mcq",
      "options": ["Paris", "Lyon", "Marseille"],
      "correctAnswer": "Paris"
    }
  ]
}
```

---

### 8. `pronunciation` - Exercice de prononciation

Focus sur des sons spécifiques.

```json
{
  "type": "pronunciation",
  "title": "Les sons nasaux : AN, ON, IN",
  "sounds": [
    {
      "sound": "an",
      "phonetic": "[ɑ̃]",
      "examples": [
        {
          "word": "français",
          "audioUrl": "/audio/pronunciation/francais.mp3",
          "translation": "французский"
        }
      ]
    }
  ],
  "practice": {
    "instruction": "Répétez après moi",
    "words": ["Jean", "France", "manger"]
  }
}
```

---

### 9. `conversation` - Mini-dialogue de compréhension

Dialogue court pour tester la compréhension (avec audio optionnel).

```json
{
  "type": "conversation",
  "title": "Au restaurant",
  "context": "Deux personnes commandent au restaurant",
  "dialogue": [
    {
      "speaker": "Serveur",
      "text": "Bonjour, que désirez-vous ?",
      "audioUrl": "/audio/conversation/serveur-1.mp3"
    },
    {
      "speaker": "Client",
      "text": "Une pizza margherita, s'il vous plaît.",
      "audioUrl": "/audio/conversation/client-1.mp3"
    }
  ],
  "questions": [
    {
      "question": "Que commande le client ?",
      "answer": "Une pizza margherita"
    }
  ]
}
```

**Champs :**
- `dialogue[].audioUrl` : Audio pour chaque ligne (optionnel)

---

### 10. `tip` - Astuce / Conseil

Conseil pratique ou astuce d'apprentissage.

```json
{
  "type": "tip",
  "title": "Astuce",
  "icon": "lightbulb",
  "content": "Pour mémoriser le genre des noms, associez-les toujours avec leur article : **LE** passeport (masculin), **LA** valise (féminin).",
  "color": "info"
}
```

---

### 11. `review` - Section de révision

Rappel de notions vues précédemment.

```json
{
  "type": "review",
  "title": "À revoir",
  "icon": "refresh",
  "content": "Rappelez-vous la conjugaison de ÊTRE et AVOIR au présent...",
  "relatedLessonIds": [1, 2]
}
```

---

### 12. `transition` - Pont vers niveau suivant

Prépare à la leçon ou niveau suivant.

```json
{
  "type": "transition",
  "title": "Vers le niveau 2",
  "content": "Vous êtes maintenant prêt à aborder des conversations plus complexes...",
  "nextCourseId": 12,
  "nextLessonId": 45
}
```

---

### 13. `summary` - Récapitulatif

Résumé des points clés de la leçon sous forme de liste simple.

```json
{
  "type": "summary",
  "title": "Expressions à retenir",
  "icon": "check",
  "content": "Voici les expressions essentielles vues dans cette leçon :",
  "items": [
    "Bonjour - Salutation standard du jour",
    "Bonsoir - Salutation du soir (après 18h)",
    "Au revoir - Formule d'adieu formelle",
    "Comment allez-vous ? - Question formelle sur l'état",
    "Je m'appelle... - Formule de présentation",
    "Enchanté(e) - Réponse polie lors d'une présentation"
  ]
}
```

**Champs :**
- `content` : Introduction du récapitulatif (optionnel)
- `items` : Liste simple de phrases clés avec leur explication

---

## Ordre recommandé des blocks (inspiré Harrap's)

Pour éviter la monotonie, alterner les types :

```javascript
[
  { type: "dialogue" },           // 1. Dialogue d'introduction
  { type: "vocabulary" },         // 2. Vocabulaire extrait
  { type: "exerciseInline" },     // 3. Exercice rapide
  { type: "grammar" },            // 4. Point grammatical
  { type: "exerciseInline" },     // 5. Pratique immédiate
  { type: "culture" },            // 6. Note culturelle
  { type: "exerciseInline" },     // 7. Autre exercice
  { type: "audio" },              // 8. Compréhension orale
  { type: "pronunciation" },      // 9. Prononciation
  { type: "conversation" },       // 10. Mini-dialogue
  { type: "summary" },            // 11. Récapitulatif
  { type: "exerciseLink" }        // 12. Exercices complets
]
```

---

## Validation JSON Schema

Chaque block doit contenir au minimum :

```typescript
{
  type: string (required),      // Type du block
  title?: string,               // Titre optionnel
  icon?: string,                // Icône Material-UI optionnelle
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error'
}
```

---

## Exemple de leçon complète

Voir fichier: `/examples/lesson-template.json`

---

## Notes d'implémentation

- Les `audioUrl` doivent pointer vers R2/Supabase Storage
- Les traductions peuvent être en russe ou français selon la langue cible
- Les exercices inline sont légers (< 5 questions)
- Les exercices complexes utilisent `exerciseLink` vers la table `exercises`
- Chaque block peut avoir un `xpReward` optionnel (défaut: 0)
