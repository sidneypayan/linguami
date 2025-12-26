# Guide de Création de Leçons - Linguami

Ce document définit les règles et bonnes pratiques pour créer des leçons dans le système de méthode Linguami.

## Table des matières

1. [Système de langues](#système-de-langues)
2. [Structure des blocs](#structure-des-blocs)
3. [Règles de traduction par type de bloc](#règles-de-traduction-par-type-de-bloc)
4. [Exemples complets](#exemples-complets)
5. [Erreurs courantes à éviter](#erreurs-courantes-à-éviter)
6. [Checklist avant insertion](#checklist-avant-insertion)

---

## 📋 Références techniques

**Avant de créer une leçon, consultez ces deux fichiers de référence :**

### 1. Template JSON complet
👉 **[LESSON_TEMPLATE.json](./LESSON_TEMPLATE.json)**

Exemple complet d'une leçon avec tous les types de blocs :
- Structure complète d'une leçon (metadata + blocks)
- Tous les types de blocs disponibles
- Champs obligatoires et optionnels
- Notes sur l'adaptation par langue cible
- Guidelines pour la génération audio

### 2. Catalogue des blocks
👉 **[LESSON_BLOCKS_REFERENCE.md](./LESSON_BLOCKS_REFERENCE.md)**

Référence technique détaillée de chaque type de bloc :
- 13 types de blocs avec schémas JSON
- Explication de chaque champ
- Exemples prêts à copier-coller
- Ordre recommandé des blocks

**Utilisez ces références** lors de la création pour garantir la cohérence structurelle.

---

## Système de langues

Le système utilise **trois concepts de langue distincts** :

### 1. Interface Language (UI Language)
- **Clé** : `lang`, `router.locale`
- **Valeurs** : `fr`, `en`, `ru`
- **Usage** : Langue de l'interface utilisateur (boutons, menus, navigation)
- **Stockage** : Route URL (`/fr/method/...`, `/en/method/...`)

### 2. Learning Language (Target Language)
- **Clé** : `learning_language`, `target_language`
- **Valeurs** : `fr`, `en`, `ru`
- **Usage** : Langue que l'utilisateur apprend
- **Stockage** :
  - Utilisateur connecté : `users_profile.learning_language`
  - Non connecté : `localStorage.learning_language`
- **Défaut** : `ru` pour interfaces fr/en, `fr` pour interface ru

### 3. Spoken Language (Native Language)
- **Clé** : `spoken_language`
- **Valeurs** : `fr`, `en`, `ru`
- **Usage** : Langue maternelle pour les explications et traductions
- **Correspondance** : Généralement égal à l'interface language
- **Impact** : Détermine quel bloc de contenu afficher (`blocks_fr`, `blocks_en`, `blocks_ru`)

### Principe fondamental

```
Interface FR + Learning RU → Affiche blocks_fr (explications en français du russe)
Interface EN + Learning RU → Affiche blocks_en (explications en anglais du russe)
Interface RU + Learning FR → Affiche blocks_ru (explications en russe du français)
```

**Les cours sont filtrés par `target_language` (learning_language), pas par `lang` !**

---

## Structure des blocs

Chaque leçon contient **trois versions du contenu** dans la table `course_lessons` :

```javascript
{
  id: 1,
  slug: "se-presenter",
  blocks_fr: [...],  // Pour utilisateurs francophones
  blocks_en: [...],  // Pour utilisateurs anglophones
  blocks_ru: [...]   // Pour utilisateurs russophones
}
```

### Principe de cohérence

Les trois versions (`blocks_fr`, `blocks_en`, `blocks_ru`) doivent :
- ✅ Contenir les **mêmes types de blocs** dans le **même ordre**
- ✅ Avoir la **même structure** (même nombre d'exemples, lignes de dialogue, etc.)
- ✅ Différer uniquement dans les **traductions/explications**

---

## Règles de traduction par type de bloc

### DialogueBlock

**Principe** : La langue apprise est dans `text`, la traduction/aide dans `translation` ou `vocab`

```javascript
{
  type: "dialogue",
  title: "Диалог",  // En langue apprise (russe ici)
  lines: [
    {
      speaker: "Андрей",  // En langue apprise
      speakerGender: "male",  // ⚠️ IMPORTANT : Alterner male/female
      text: "Привет! Меня зовут Андрей.",  // TOUJOURS en langue apprise
      audioUrl: null,  // ⚠️ TOUJOURS null en Phase 1 (avant validation)

      // Option 1: Traduction simple
      translation: "Bonjour ! Je m'appelle André.",  // En langue parlée (fr/en/ru)

      // Option 2: Aide vocabulaire détaillée (préférée)
      vocab: [
        {
          word: "Привет",
          translation: "Bonjour"  // En langue parlée
        },
        {
          word: "Меня зовут",
          translation: "Je m'appelle"  // En langue parlée
        }
      ]
    },
    {
      speaker: "Мария",  // Personnage différent
      speakerGender: "female",  // ⚠️ Voix alternée (ici féminine après masculine)
      text: "Привет, Андрей! Меня зовут Мария.",
      audioUrl: null,  // ⚠️ Pas d'audio en Phase 1
      vocab: [
        {
          word: "Меня зовут",
          translation: "Je m'appelle"
        }
      ]
    }
    // ⚠️ Continuer l'alternance : si ligne suivante → Андрей (male) → Мария (female) → etc.
  ],

  // ⚠️ NOUVEAU : Vocabulaire récapitulatif du dialogue (optionnel mais recommandé)
  vocabulary: [
    {
      word: "Привет",  // Mot/expression en langue apprise
      translation: "Bonjour",  // Traduction en langue parlée
      category: "expressions",  // Catégorie : expressions/verbes/noms/etc.
      note: "Salutation informelle"  // Note optionnelle pour précisions
    },
    {
      word: "Меня зовут",
      translation: "Je m'appelle",
      category: "expressions",
      note: "Construction pour se présenter"  // Optionnel
    }
  ]
}
```

**Règles strictes** :
- ✅ `speaker`, `text` : TOUJOURS en langue apprise (russe, français, etc.)
- ✅ `translation`, `vocab[].translation` : TOUJOURS en langue parlée (fr/en/ru selon blocks_XX)
- ✅ **Alternance obligatoire** : Les lignes doivent alterner entre personas ET entre `speakerGender` (male/female/male/female...)
  - Rend le dialogue plus naturel et facile à suivre
  - Facilite la distinction auditive quand les audios seront générés
- ✅ **Phase 1 (création)** : `audioUrl: null` ou omis complètement
- ✅ **Phase 2 (après validation)** : `audioUrl` pointant vers fichiers R2
- ✅ **Vocabulaire récapitulatif** (optionnel) : Utilisez le champ `vocabulary` au niveau du bloc pour lister les mots/expressions clés
  - `category` : expressions/verbes/noms/adjectifs/etc.
  - `note` : Précisions optionnelles (usage, contexte, niveau de formalité)
- ❌ Ne JAMAIS mélanger les langues dans `text`
- ❌ Ne JAMAIS avoir deux lignes consécutives avec le même `speakerGender`

---

### GrammarBlock

**Principe** : Explications en langue parlée, exemples en langue apprise

```javascript
{
  type: "grammar",
  title: "Construction 'Меня зовут' - Se présenter",  // Bilingue acceptable

  explanation: "Pour dire son nom en russe, on utilise la construction **\"Меня зовут\"** (littéralement \"on m'appelle\"). C'est la manière standard de se présenter en russe.",
  // ☝️ TOUJOURS en langue parlée (français pour blocks_fr)

  examples: [
    {
      sentence: "Меня зовут Анна.",  // En langue apprise
      translation: "Je m'appelle Anna.",  // En langue parlée
      note: "Présentation formelle ou informelle",  // En langue parlée
      audioUrl: "https://.../ru/grammar-example-1.mp3"
    }
  ],

  table: {
    title: "La construction 'Меня зовут'",  // Bilingue acceptable
    headers: ["Russe", "Français", "Usage"],  // En langue parlée
    rows: [
      ["Меня зовут", "Je m'appelle", "1ère personne"],  // Col 1: langue apprise, Col 2-3: langue parlée
      ["Тебя зовут", "Tu t'appelles (informel)", "2ème personne informelle"]
    ],
    rowsAudio: [
      ["https://.../ru/table-row-1.mp3", null, null],  // Audio pour colonne langue apprise uniquement
      ["https://.../ru/table-row-2.mp3", null, null]
    ]
  }
}
```

**Règles strictes** :
- ✅ `explanation` : TOUJOURS en langue parlée (français dans blocks_fr, anglais dans blocks_en, etc.)
- ✅ `examples[].sentence` : En langue apprise
- ✅ `examples[].translation`, `examples[].note` : En langue parlée
- ✅ `table.headers` : En langue parlée (ou bilingue si pertinent)
- ✅ `table.rows` : **Phrases complètes** en langue apprise, traductions complètes en langue parlée
- ❌ Ne PAS utiliser de fragments incomplets (ex: "зовут" seul au lieu de "Меня зовут")

**Erreur courante** :
```javascript
// ❌ MAUVAIS - Explication en russe dans blocks_fr
explanation: "Для того чтобы представиться..."

// ✅ BON - Explication en français dans blocks_fr
explanation: "Pour se présenter en russe, on utilise..."
```

---

### ConversationBlock

**Principe** : Similaire au DialogueBlock mais avec questions interactives

```javascript
{
  type: "conversation",
  title: "Pratique de conversation",
  context: "Vous rencontrez quelqu'un pour la première fois",  // En langue parlée

  dialogue: [
    {
      speaker: "Maria",
      text: "Здравствуйте!",  // En langue apprise
      audioUrl: "https://.../ru/conv-1.mp3"
    }
  ],

  questions: [
    {
      question: "Comment Maria se présente-t-elle ?",  // En langue parlée
      answer: "Elle dit 'Меня зовут Мария'"  // Bilingue pour la pédagogie
    }
  ]
}
```

**Règles strictes** :
- ✅ `context` : En langue parlée
- ✅ `dialogue[].text` : En langue apprise
- ✅ `questions[].question`, `questions[].answer` : En langue parlée (ou bilingue si pédagogique)

---

### ExerciseInlineBlock (Fill-in-the-blank)

**Principe** : Questions et indices en langue parlée, réponses en langue apprise

```javascript
{
  type: "exercise_inline",
  title: "Complétez les phrases",
  xpReward: 15,

  questions: [
    {
      question: "Comment dit-on 'Je m'appelle' en russe ?",  // En langue parlée
      acceptableAnswers: ["Меня зовут", "меня зовут"],  // En langue apprise
      answer: "Меня зовут",  // Réponse affichée (langue apprise)
      hint: "Construction avec 'зовут'"  // En langue parlée
    }
  ]
}
```

**Règles strictes** :
- ✅ `question`, `hint` : En langue parlée
- ✅ `acceptableAnswers`, `answer` : En langue apprise
- ✅ Accepter les variations de casse dans `acceptableAnswers`

---

### VocabularyBlock

```javascript
{
  type: "vocabulary",
  title: "Vocabulaire clé",
  category: "Salutations",  // En langue parlée

  words: [
    {
      word: "Привет",  // En langue apprise
      translation: "Salut",  // En langue parlée
      category: "expressions",  // Catégorie : expressions/verbes/noms/etc.
      pronunciation: "[pri-viet]",  // Transcription phonétique (optionnel)
      example: "Привет, как дела?",  // En langue apprise (optionnel)
      exampleTranslation: "Salut, comment ça va ?",  // En langue parlée (optionnel)
      note: "Salutation informelle"  // Note optionnelle pour précisions
    }
  ]
}
```

**Règles strictes** :
- ✅ `word`, `example` : En langue apprise
- ✅ `translation`, `exampleTranslation`, `category`, `note` : En langue parlée
- ✅ Champs optionnels : `pronunciation`, `example`, `exampleTranslation`, `note`
- ✅ Champs requis : `word`, `translation`, `category`

---

### CultureBlock

```javascript
{
  type: "culture",
  title: "Note culturelle",
  icon: "🇷🇺",
  content: "En Russie, on se serre la main lors des présentations formelles..."  // En langue parlée
}
```

**Règles strictes** :
- ✅ Tout le contenu en langue parlée

---

### TipBlock

```javascript
{
  type: "tip",
  title: "Astuce",
  content: "Pour retenir 'Меня зовут', pensez à la construction littérale..."  // En langue parlée
}
```

**Règles strictes** :
- ✅ Tout le contenu en langue parlée

---

### SummaryBlock

**Principe** : Récapitulatif des points clés de la leçon

```javascript
{
  type: "summary",
  title: "Expressions à retenir",  // En langue parlée
  content: "Voici les expressions essentielles vues dans cette leçon :",  // En langue parlée (optionnel)
  items: [
    "Bonjour - Salutation standard du jour",
    "Bonsoir - Salutation du soir (après 18h)",
    "Au revoir - Formule d'adieu formelle",
    "À bientôt - Formule d'adieu quand on va se revoir",
    "Enchanté(e) - Réponse polie lors d'une présentation"
  ]
  // ☝️ Liste de points clés TOUJOURS en langue parlée
}
```

**Règles strictes** :
- ✅ `title`, `content`, `items` : TOUJOURS en langue parlée
- ✅ Utilisez pour résumer les points importants à retenir
- ✅ Placez typiquement à la fin de la leçon

---

## Exemples complets

### Exemple 1 : DialogueBlock complet (blocks_fr)

```javascript
{
  type: "dialogue",
  title: "À l'aéroport",
  audioUrl: "https://.../ru/dialogue-airport-full.mp3",  // Audio complet (optionnel)

  lines: [
    {
      speaker: "Сотрудник",
      speakerGender: "male",
      text: "Здравствуйте! Ваши документы, пожалуйста.",
      audioUrl: "https://.../ru/dialogue-airport-1.mp3",
      vocab: [
        { word: "Здравствуйте", translation: "Bonjour (formel)" },
        { word: "документы", translation: "documents" },
        { word: "пожалуйста", translation: "s'il vous plaît" }
      ]
    },
    {
      speaker: "Турист",
      speakerGender: "male",
      text: "Вот мой паспорт.",
      audioUrl: "https://.../ru/dialogue-airport-2.mp3",
      vocab: [
        { word: "Вот", translation: "Voici" },
        { word: "мой паспорт", translation: "mon passeport" }
      ]
    }
  ],

  vocabulary: [
    {
      word: "аэропорт",
      translation: "aéroport",
      category: "verbs",
      example: "Я в аэропорту."
    }
  ]
}
```

### Exemple 2 : GrammarBlock complet (blocks_en)

```javascript
{
  type: "grammar",
  title: "Russian Personal Pronouns",

  explanation: "Russian personal pronouns are essential for basic communication. Unlike English, Russian has both formal and informal forms of 'you' (**ты** for informal, **вы** for formal).",

  examples: [
    {
      sentence: "Я студент.",
      translation: "I am a student.",
      note: "Subject pronoun 'I'",
      audioUrl: "https://.../ru/pronoun-ex-1.mp3"
    },
    {
      sentence: "Ты русский?",
      translation: "Are you Russian? (informal)",
      note: "Informal 'you' used with friends, family",
      audioUrl: "https://.../ru/pronoun-ex-2.mp3"
    }
  ],

  table: {
    title: "Russian personal pronouns",
    headers: ["Russian", "English", "Usage"],
    rows: [
      ["я", "I", "1st person singular"],
      ["ты", "you", "2nd person singular (informal)"],
      ["вы", "you", "2nd person singular (formal) / plural"],
      ["он", "he", "3rd person masculine"],
      ["она", "she", "3rd person feminine"],
      ["мы", "we", "1st person plural"],
      ["они", "they", "3rd person plural"]
    ],
    rowsAudio: [
      ["https://.../ru/pronoun-ya.mp3", null, null],
      ["https://.../ru/pronoun-ty.mp3", null, null],
      ["https://.../ru/pronoun-vy.mp3", null, null],
      ["https://.../ru/pronoun-on.mp3", null, null],
      ["https://.../ru/pronoun-ona.mp3", null, null],
      ["https://.../ru/pronoun-my.mp3", null, null],
      ["https://.../ru/pronoun-oni.mp3", null, null]
    ]
  }
}
```

### Exemple 3 : ExerciseInlineBlock complet (blocks_ru)

```javascript
{
  type: "exercise_inline",
  title: "Дополните предложения",
  xpReward: 15,

  questions: [
    {
      question: "Как по-французски 'Меня зовут'?",
      acceptableAnswers: ["Je m'appelle", "je m'appelle", "Je m'appelle"],
      answer: "Je m'appelle",
      hint: "Конструкция с глаголом s'appeler"
    },
    {
      question: "Переведите: 'Bonjour'",
      acceptableAnswers: ["Здравствуйте", "здравствуйте", "Привет", "привет"],
      answer: "Здравствуйте",
      hint: "Формальное приветствие"
    }
  ]
}
```

---

## Erreurs courantes à éviter

### ❌ Erreur 1 : Explications grammaticales dans la mauvaise langue

```javascript
// ❌ MAUVAIS - blocks_fr avec explications en russe
{
  type: "grammar",
  explanation: "Для того чтобы представиться по-русски..."
}

// ✅ BON - blocks_fr avec explications en français
{
  type: "grammar",
  explanation: "Pour se présenter en russe, on utilise..."
}
```

### ❌ Erreur 2 : Headers de tableaux non traduits

```javascript
// ❌ MAUVAIS - blocks_en avec headers en russe
{
  table: {
    headers: ["Русский", "Английский", "Использование"]
  }
}

// ✅ BON - blocks_en avec headers en anglais
{
  table: {
    headers: ["Russian", "English", "Usage"]
  }
}
```

### ❌ Erreur 3 : Phrases incomplètes dans les tableaux

```javascript
// ❌ MAUVAIS - Fragment au lieu de phrase complète
{
  table: {
    rows: [
      ["зовут", "call", "Verb"]  // Fragment isolé, pas de contexte
    ]
  }
}

// ✅ BON - Phrase complète avec contexte
{
  table: {
    rows: [
      ["Меня зовут", "Je m'appelle", "1ère personne"]  // Phrase complète
    ]
  }
}
```

### ❌ Erreur 4 : Mélanger spoken_language et learning_language

```javascript
// ❌ MAUVAIS - Dialogue en français alors que learning_language = ru
{
  type: "dialogue",
  lines: [
    {
      speaker: "Marie",
      text: "Bonjour, je m'appelle Marie"  // Devrait être en russe
    }
  ]
}

// ✅ BON
{
  type: "dialogue",
  lines: [
    {
      speaker: "Мария",
      text: "Привет, меня зовут Мария",
      translation: "Bonjour, je m'appelle Marie"
    }
  ]
}
```

### ❌ Erreur 5 : Oublier les variations de casse dans acceptableAnswers

```javascript
// ❌ MAUVAIS - Refuse "меня зовут" (minuscule)
{
  acceptableAnswers: ["Меня зовут"]
}

// ✅ BON - Accepte toutes les variations
{
  acceptableAnswers: ["Меня зовут", "меня зовут"]
}
```

### ❌ Erreur 6 : Incohérence entre blocks_fr, blocks_en, blocks_ru

```javascript
// ❌ MAUVAIS - Nombre différent d'exemples
// blocks_fr
{
  examples: [{ sentence: "...", translation: "..." }]  // 1 exemple
}

// blocks_en
{
  examples: [
    { sentence: "...", translation: "..." },
    { sentence: "...", translation: "..." }  // 2 exemples ❌
  ]
}

// ✅ BON - Même nombre d'exemples partout
// blocks_fr et blocks_en doivent avoir le même nombre d'exemples
```

### ❌ Erreur 7 : Générer les audios avant validation du texte

```javascript
// ❌ MAUVAIS - Créer la leçon avec les audios directement
{
  type: "dialogue",
  lines: [
    {
      text: "Привет!",
      audioUrl: "https://.../dialogue-1.mp3"  // ❌ Audio généré trop tôt
    }
  ]
}
// Puis l'utilisateur trouve une erreur dans le texte → il faut régénérer l'audio

// ✅ BON - Créer d'abord SANS audio
{
  type: "dialogue",
  lines: [
    {
      text: "Привет!",
      audioUrl: null  // ✅ Pas d'audio en Phase 1
    }
  ]
}
// Attendre validation utilisateur → PUIS générer les audios
```

### ❌ Erreur 8 : Ne pas alterner les voix dans les dialogues

```javascript
// ❌ MAUVAIS - Deux lignes consécutives avec la même voix
{
  type: "dialogue",
  lines: [
    {
      speaker: "Андрей",
      speakerGender: "male",
      text: "Привет!"
    },
    {
      speaker: "Борис",
      speakerGender: "male",  // ❌ Deux hommes à la suite
      text: "Здравствуй!"
    }
  ]
}

// ✅ BON - Alternance male/female
{
  type: "dialogue",
  lines: [
    {
      speaker: "Андрей",
      speakerGender: "male",
      text: "Привет!"
    },
    {
      speaker: "Мария",
      speakerGender: "female",  // ✅ Alternance
      text: "Здравствуй!"
    }
  ]
}
```

---

## Checklist avant insertion

Avant d'insérer une leçon dans la base de données, vérifier :

### Cohérence multilingue
- [ ] `blocks_fr`, `blocks_en`, `blocks_ru` ont le **même nombre de blocs**
- [ ] Les blocs sont dans le **même ordre**
- [ ] Chaque bloc a la **même structure** (même nombre d'exemples, lignes, questions, etc.)

### DialogueBlock
- [ ] `text` est en **langue apprise**
- [ ] `translation` ou `vocab[].translation` est en **langue parlée**
- [ ] `speaker` est en **langue apprise**
- [ ] **⚠️ Alternance male/female** : `speakerGender` alterne entre "male" et "female" ligne par ligne
- [ ] **⚠️ Phase 1** : Tous les `audioUrl` sont `null` ou omis (avant validation utilisateur)
- [ ] **Phase 2** : `audioUrl` pointe vers des fichiers de la **langue apprise** (après validation)

### GrammarBlock
- [ ] `explanation` est en **langue parlée**
- [ ] `examples[].sentence` est en **langue apprise**
- [ ] `examples[].translation` et `examples[].note` sont en **langue parlée**
- [ ] `table.headers` est en **langue parlée**
- [ ] `table.rows` contient des **phrases complètes**, pas des fragments
- [ ] Première colonne (langue apprise) avec audio, autres colonnes (traductions) sans audio

### ExerciseInlineBlock
- [ ] `question` et `hint` sont en **langue parlée**
- [ ] `acceptableAnswers` contient des variations de casse
- [ ] `answer` est en **langue apprise**
- [ ] `xpReward` est défini (10-20 XP selon difficulté)

### ConversationBlock
- [ ] `context` est en **langue parlée**
- [ ] `dialogue[].text` est en **langue apprise**
- [ ] `questions[].question` et `questions[].answer` sont en **langue parlée**

### VocabularyBlock
- [ ] `word` et `example` sont en **langue apprise**
- [ ] `translation` et `exampleTranslation` sont en **langue parlée**
- [ ] `category` est en **langue parlée**

### Audio
- [ ] Tous les `audioUrl` sont valides et accessibles
- [ ] Format des URLs : `https://.../audio/{lang}/{type}-{identifier}.mp3`
- [ ] Audio généré avec ElevenLabs pour la langue apprise

### Général
- [ ] `xpReward` total de la leçon est cohérent (suggestion : 50-100 XP)
- [ ] Aucune chaîne hardcodée en français/anglais/russe dans les composants React
- [ ] Toutes les traductions UI utilisent `t('methode_...')` de next-translate

---

## Workflow de création d'une nouvelle leçon

### ⚠️ RÈGLE FONDAMENTALE : Création en deux phases

**Phase 1 : Contenu textuel uniquement (SANS audio)**
- Créer TOUTE la leçon avec le texte complet
- NE PAS ajouter d'`audioUrl` à ce stade
- Laisser tous les champs audio vides (`audioUrl: null` ou omis)
- Soumettre pour validation utilisateur

**Phase 2 : Génération audio (APRÈS validation)**
- L'utilisateur valide le contenu textuel
- SEULEMENT APRÈS validation → générer les audios via ElevenLabs
- Mettre à jour la leçon avec les `audioUrl`

**Pourquoi cette règle ?**
- Évite de générer des audios qui devront être refaits si le texte change
- Économise les crédits API ElevenLabs
- Permet des corrections rapides du texte avant production audio

---

### 1. Planification
1. Définir la **langue apprise** (`target_language` du cours)
2. Définir les **objectifs pédagogiques** (multilingual: `objectives_fr`, `objectives_en`, `objectives_ru`)
3. Lister les **blocs nécessaires** (dialogue, grammaire, exercices, etc.)

### 2. Création du contenu principal (blocks_fr) - SANS AUDIO
1. Créer tous les blocs en respectant les règles de traduction
2. Vérifier que `text`/`sentence` = langue apprise, `translation`/`explanation` = français
3. **⚠️ NE PAS générer les audios** - laisser tous les `audioUrl` vides
4. **Pour les dialogues** : Alterner les personas et les voix (masculin/féminin)
   - Exemple : Speaker 1 (homme) → Speaker 2 (femme) → Speaker 1 (homme) → etc.

### 3. Adaptation pour blocks_en - SANS AUDIO
1. **Copier** la structure de `blocks_fr`
2. **Traduire** uniquement :
   - `explanation` en anglais
   - `translation` en anglais
   - `table.headers` en anglais
   - `questions`, `hints`, `answers` en anglais
3. **NE PAS modifier** : `text`, `sentence`, `speaker`, `audioUrl` (restent en langue apprise)
4. **⚠️ Tous les `audioUrl` restent vides** (même que blocks_fr)

### 4. Adaptation pour blocks_ru - SANS AUDIO
1. **Copier** la structure de `blocks_fr`
2. **Traduire** uniquement les mêmes éléments qu'à l'étape 3, mais en russe
3. **NE PAS modifier** le contenu en langue apprise
4. **⚠️ Tous les `audioUrl` restent vides** (même que blocks_fr)

### 5. Vérification finale du contenu textuel
1. Passer la **checklist** ci-dessous
2. Vérifier dans la DB que les 3 versions ont le même nombre de blocs
3. Tester dans l'interface avec les 3 langues parlées
4. **⚠️ Confirmer qu'AUCUN audioUrl n'est présent**

### 6. Insertion en base de données (version textuelle)
```sql
INSERT INTO course_lessons (
  course_id,
  slug,
  order_index,
  duration_minutes,
  xp_reward,
  objectives_fr,
  objectives_en,
  objectives_ru,
  blocks_fr,
  blocks_en,
  blocks_ru
) VALUES (
  1,
  'lesson-slug',
  1,
  30,
  80,
  '["Objectif 1", "Objectif 2"]'::jsonb,
  '["Objective 1", "Objective 2"]'::jsonb,
  '["Цель 1", "Цель 2"]'::jsonb,
  '[{...blocks_fr...}]'::jsonb,  -- SANS audioUrl
  '[{...blocks_en...}]'::jsonb,  -- SANS audioUrl
  '[{...blocks_ru...}]'::jsonb   -- SANS audioUrl
);
```

### 7. PAUSE - Attendre validation utilisateur ⏸️

**À CE STADE :**
- ✅ La leçon est en base de données avec tout le contenu textuel
- ✅ L'utilisateur peut la consulter dans l'interface
- ⏸️ **ATTENDRE** que l'utilisateur valide le contenu
- ⏸️ **NE PAS** générer les audios

**L'utilisateur va :**
- Lire toute la leçon dans les 3 langues parlées
- Vérifier les traductions, explications, exemples
- Signaler les corrections nécessaires
- **Donner le feu vert** pour la génération audio

### 8. Génération audio (APRÈS validation) - PHASE 2

**Seulement après que l'utilisateur ait dit "OK pour les audios" :**

1. **Générer tous les audios avec ElevenLabs**
   - Dialogues : alterner voix masculine/féminine selon `speakerGender`
   - Exemples grammaticaux : voix unique (masculine ou féminine selon contexte)
   - Tableaux : une voix pour les phrases en langue apprise

2. **Upload vers R2** avec naming convention :
   ```
   audio/{lang}/{type}-{lesson-slug}-{identifier}.mp3
   ```

3. **Mettre à jour la leçon** avec les URLs audio :
   ```sql
   UPDATE course_lessons
   SET blocks_fr = '[{...avec audioUrl...}]'::jsonb,
       blocks_en = '[{...avec audioUrl...}]'::jsonb,
       blocks_ru = '[{...avec audioUrl...}]'::jsonb
   WHERE slug = 'lesson-slug';
   ```

4. **Vérifier** que tous les audios fonctionnent dans l'interface

---

## Génération audio avec ElevenLabs

**⚠️ PHASE 2 UNIQUEMENT** - Ne générer les audios qu'APRÈS validation du contenu textuel par l'utilisateur.

### Configuration des voix

Utiliser des voix natives pour la langue apprise :

**Pour le russe :**
- Voix masculine : `pNInz6obpgDQGcFmaJgB` (Adam - anglophone mais supporte le russe)
- Voix féminine : `EXAVITQu4vr4xnSDxMaL` (Bella - anglophone mais supporte le russe)

**Pour le français :**
- Voix masculine : Voice ID à définir
- Voix féminine : Voice ID à définir

### Naming convention des fichiers audio

```
{lang}/{type}-{lesson-slug}-{identifier}.mp3

Exemples :
ru/dialogue-se-presenter-line-1.mp3
ru/grammar-se-presenter-example-1.mp3
ru/table-se-presenter-row-1.mp3
fr/dialogue-premiers-mots-line-3.mp3
```

### Script de génération

Voir `/scripts/generate-lesson-audio.js` pour générer automatiquement tous les audios d'une leçon.

---

## Outils disponibles

### Scripts utiles
- `scripts/generate-lesson-audio.js` - Génère tous les audios d'une leçon
- `scripts/check-lesson-structure.js` - Vérifie la cohérence d'une leçon
- `scripts/verify-lesson-translations.js` - Vérifie que les traductions sont dans les bonnes langues

### Commandes SQL utiles

**Vérifier la cohérence des blocs :**
```sql
SELECT
  slug,
  jsonb_array_length(blocks_fr) as count_fr,
  jsonb_array_length(blocks_en) as count_en,
  jsonb_array_length(blocks_ru) as count_ru
FROM course_lessons
WHERE jsonb_array_length(blocks_fr) != jsonb_array_length(blocks_en)
   OR jsonb_array_length(blocks_en) != jsonb_array_length(blocks_ru);
```

**Lister tous les blocs d'une leçon :**
```sql
SELECT
  jsonb_array_elements(blocks_fr)->>'type' as block_type,
  jsonb_array_elements(blocks_fr)->>'title' as title
FROM course_lessons
WHERE slug = 'se-presenter';
```

---

## Ressources

- [Documentation CLAUDE.md](../CLAUDE.md) - Architecture générale du projet
- [Structure des blocs](./COURSE_BLOCKS_STRUCTURE.md) - Schémas détaillés de tous les types de blocs
- [Template de leçon](./lesson_template_example.json) - Exemple complet d'une leçon
- [API ElevenLabs](https://docs.elevenlabs.io/) - Documentation pour la génération audio

---

**Dernière mise à jour** : 2025-01-11
**Version** : 1.0
