# Template de Leçon : "Se présenter" (Niveau A1)

Ce document décrit la structure complète de la leçon "Se présenter en français" qui peut être réutilisée pour créer des leçons similaires dans d'autres langues cibles.

## Vue d'ensemble

**Type de leçon :** Introduction / Premiers pas
**Niveau CECR :** A1 (Débutant)
**Objectifs pédagogiques :**
- Se présenter (nom, âge, nationalité, profession)
- Utiliser les verbes de base (être, avoir, s'appeler)
- Comprendre et utiliser les pronoms personnels
- Saluer et prendre congé

**Durée estimée :** 30-45 minutes
**XP récompense :** 10 XP par exercice complété

---

## Structure des blocs (ordre recommandé)

### 1. Bloc Dialogue Principal (type: `dialogue`)

**Objectif :** Contextualiser le vocabulaire et les structures dans une situation réelle

**Caractéristiques :**
- 12-15 lignes de dialogue
- 2 personnages (1 homme, 1 femme)
- Alternance des voix
- Vocabulaire clé inline avec traductions
- Audio pour chaque ligne (voix masculine/féminine)
- Vitesse de lecture ralentie pour débutants

**Structure JSON :**
```json
{
  "type": "dialogue",
  "title": "Première rencontre",
  "lines": [
    {
      "speaker": "Anna",
      "speakerGender": "female",
      "text": "Bonjour ! Je m'appelle Anna.",
      "audioUrl": "https://cdn.../dialogue-0-line-0.mp3",
      "vocab": [
        {
          "word": "Bonjour",
          "translation": "Hello / Здравствуйте"
        },
        {
          "word": "Je m'appelle",
          "translation": "My name is / Меня зовут"
        }
      ]
    }
  ],
  "vocabulary": [
    {
      "word": "venir de + city",
      "translation": "to be from (+ city)",
      "example": "Je viens de Paris",
      "category": "verbs"
    }
  ]
}
```

**Points à adapter selon la langue :**
- Noms des personnages (choisir des prénoms typiques de la langue cible)
- Villes mentionnées (capitales/villes importantes)
- Structures grammaticales spécifiques
- Formalité (tu/vous, ты/вы, etc.)

---

### 2. Bloc Grammaire 1 : Verbe réflexif (type: `grammar`)

**Objectif :** Enseigner le verbe pour se présenter (s'appeler, называться, etc.)

**Structure JSON :**
```json
{
  "type": "grammar",
  "icon": "book",
  "title": "Le verbe S'APPELER - Se présenter",
  "explanation": "Pour dire son nom en français, on utilise le verbe réflexif **s'appeler**...",
  "table": {
    "title": "Conjugaison de S'APPELER au présent",
    "headers": ["Pronom", "S'APPELER", "Traduction"],
    "rows": [
      ["Je", "je m'appelle", "My name is"],
      ["Tu", "tu t'appelles", "Your name is"],
      // ... 6 personnes
    ],
    "rowsAudio": [
      [
        "https://cdn.../table-0-row-0-col-0.mp3",
        "https://cdn.../table-0-row-0-col-1.mp3"
      ]
      // Audio pour chaque cellule française
    ]
  },
  "examples": [
    {
      "sentence": "Je m'appelle Anna",
      "translation": "My name is Anna",
      "highlight": "m'appelle",
      "note": "Verbe réflexif à la 1ère personne",
      "audioUrl": "https://cdn.../grammar-block-0-example-0.mp3"
    }
  ]
}
```

**Points à adapter :**
- Certaines langues n'ont pas de verbe réflexif pour se présenter (ex: anglais "My name is")
- Ordre des pronoms peut varier
- Nombre de formes (langues slaves ont plus de cas)

---

### 3. Bloc Grammaire 2 : Verbe AVOIR/TO HAVE (type: `grammar`)

**Objectif :** Exprimer l'âge et la possession

**Structure identique au bloc 1**, avec :
- Tableau de conjugaison de AVOIR/ИМЕТЬ/TO HAVE
- Exemples pour l'âge : "J'ai 25 ans" / "Мне 25 лет" / "I am 25 years old"
- Audio pour chaque ligne du tableau
- 3-4 exemples avec audio

**Point important :**
- Français/Anglais : "J'ai X ans" / "I am X years old"
- Russe : "Мне X лет" (datif)
- Adapter la structure grammaticale

---

### 4. Exercice 1 : Fill-in-the-blank (type: `exerciseInline`)

**Objectif :** Pratiquer les présentations

```json
{
  "type": "exerciseInline",
  "exerciseType": "fillInBlank",
  "icon": "edit",
  "title": "Complétez les présentations",
  "xpReward": 10,
  "questions": [
    {
      "question": "Bonjour ! Je ____ Marie. (m'appelle/t'appelles)",
      "answer": "m'appelle",
      "acceptableAnswers": ["m'appelle"],
      "hint": "1ère personne du singulier"
    }
  ]
}
```

**Points à adapter :**
- Questions basées sur la grammaire de la langue cible
- 4-6 questions par exercice
- Tolérance orthographique si nécessaire

---

### 5. Bloc Vocabulaire : Salutations (type: `vocabulary`)

**Objectif :** Enseigner les expressions de politesse

```json
{
  "type": "vocabulary",
  "icon": "book",
  "title": "Salutations et expressions polies",
  "category": "greetings",
  "words": [
    {
      "word": "Bonjour",
      "translation": "Hello (formal, all day)",
      "example": "Bonjour ! Comment allez-vous ?",
      "exampleTranslation": "Hello! How are you?"
    }
  ]
}
```

**Points à adapter :**
- Registres de langue (formel/informel)
- Moments de la journée (certaines langues ont des salutations spécifiques)
- Expressions culturellement spécifiques

---

### 6. Bloc Culture (type: `culture`)

**Objectif :** Contexte culturel de la langue cible

```json
{
  "type": "culture",
  "icon": "globe",
  "title": "Les salutations en France",
  "content": "En France, les salutations varient selon le contexte...",
  "keyPoints": [
    "Toujours dire Bonjour en entrant dans un magasin",
    "La bise (2-4 bises selon la région) entre amis",
    "Bonjour s'utilise toute la journée (pas seulement le matin)"
  ],
  "comparison": {
    "fr": "En France, on fait la bise entre amis",
    "international": "Dans d'autres pays, on se serre la main"
  },
  "images": []
}
```

**Points à adapter :**
- Spécificités culturelles de la langue cible
- Comparaisons avec la culture de l'apprenant
- Peut inclure des images/photos

---

### 7. Bloc Grammaire 3 : Pronoms personnels (type: `grammar`)

**Structure identique** avec tableau de tous les pronoms :
- Je/Tu/Il/Elle/Nous/Vous/Ils/Elles
- Я/Ты/Он/Она/Мы/Вы/Они
- I/You/He/She/We/You/They

**Point important :** Audio uniquement pour les pronoms, pas besoin de conjugaison

---

### 8. Exercice 2 : Âge (type: `exerciseInline`)

Questions sur l'expression de l'âge :
- "Quel âge ____ ? (as-tu/es-tu)"
- "J'____ 22 ans. (ai/suis)"

---

### 9. Bloc Tip (type: `tip`)

**Objectif :** Conseil de prononciation ou d'usage

```json
{
  "type": "tip",
  "icon": "lightbulb",
  "color": "info",
  "title": "Conseil de prononciation",
  "content": "Le son nasal 'on' dans **Bonjour** est difficile ! Conseil : dire 'o' mais laisser l'air passer par le nez."
}
```

---

### 10. Bloc Vocabulaire : Nationalités (type: `vocabulary`)

Liste des nationalités courantes avec genre :
- français/française
- anglais/anglaise
- russe (invariable)

**Point important :** Adapter selon les règles de genre de la langue

---

### 11. Exercice 3 : Nationalités (type: `exerciseInline`)

Pratiquer l'accord en genre des nationalités

---

### 12. Conversation Courte (type: `conversation`)

**Objectif :** Mini-dialogue pratique avec questions de compréhension

```json
{
  "type": "conversation",
  "title": "Mini-dialogue : À l'aéroport",
  "context": "Un douanier vérifie les passeports",
  "dialogue": [
    {
      "speaker": "Douanier",
      "text": "Bonjour. Votre passeport, s'il vous plaît.",
      "audioUrl": "https://cdn.../conv-line-0.mp3"
    }
  ],
  "questions": [
    {
      "question": "Quelle est la nationalité du touriste ?",
      "answer": "Russian"
    }
  ]
}
```

**Points à adapter :**
- Contexte culturellement pertinent
- Niveau de formalité approprié

---

### 13. Bloc Résumé (type: `summary`)

**Objectif :** Récapitulatif des phrases clés

```json
{
  "type": "summary",
  "icon": "check",
  "title": "Points clés à retenir",
  "keyPhrases": [
    {
      "fr": "Bonjour !",
      "en": "Hello!",
      "context": "Salutation formelle"
    },
    {
      "fr": "Je m'appelle...",
      "en": "My name is...",
      "context": "Se présenter"
    }
  ]
}
```

---

## Principes de création audio

### Dialogues
- **Voix féminine :** Personnages féminins
- **Voix masculine :** Personnages masculins
- **Vitesse :** Normale (peut être ralentie avec le contrôle utilisateur)

### Grammaire
- **Exemples :** Voix masculine, **ralentie** (stability: 0.75)
- **Tableaux :** Audio pour chaque cellule en langue cible

### Conversations
- **Vitesse :** Ralentie pour débutants
- **Contexte :** Audio sur chaque ligne

---

## Checklist pour créer une nouvelle leçon

### Contenu
- [ ] Définir les 3-5 objectifs d'apprentissage
- [ ] Créer un dialogue contextuel (12-15 lignes)
- [ ] Identifier 2-3 points de grammaire principaux
- [ ] Préparer 3-4 exercices pratiques
- [ ] Lister le vocabulaire essentiel (30-40 mots)
- [ ] Ajouter 1-2 points culturels
- [ ] Créer un résumé des phrases clés

### Traductions
- [ ] Traduire tous les blocks pour les 3 langues d'interface (FR/RU/EN)
- [ ] Adapter les exemples selon la grammaire de chaque langue
- [ ] Vérifier la cohérence des traductions

### Audio
- [ ] Générer audio pour chaque ligne de dialogue
- [ ] Générer audio pour chaque exemple de grammaire
- [ ] Générer audio pour les tableaux de conjugaison
- [ ] Générer audio pour les conversations
- [ ] Tester la vitesse de lecture

### Base de données
- [ ] Insérer les 3 versions (blocks_fr, blocks_ru, blocks_en)
- [ ] Vérifier les URLs d'audio (pas de double extension)
- [ ] Tester sur l'interface

---

## Adaptation selon la langue cible

### Pour apprendre le RUSSE
**Changements nécessaires :**
- Dialogue : Noms russes (Anna, Dmitri)
- Grammaire 1 : "Меня зовут" (construction avec accusatif)
- Grammaire 2 : "Мне X лет" (datif + génitif)
- Ajouter : Cas grammaticaux (nominatif, accusatif, génitif)
- Culture : Formalité en russe (вы vs ты)

### Pour apprendre l'ANGLAIS
**Changements nécessaires :**
- Pas de verbe réflexif : "My name is..."
- Âge : "I am X years old" (pas "I have")
- Simplifier les conjugaisons (moins de formes)
- Culture : Handshake, personal space

### Pour apprendre l'ESPAGNOL
**Changements nécessaires :**
- "Me llamo..." (verbe réflexif comme le français)
- "Tengo X años" (comme le français)
- Genre des adjectifs de nationalité
- Culture : Bises en Espagne vs Amérique Latine

---

## Scripts de génération audio

### Commandes disponibles
```bash
# Générer audio pour les dialogues
node scripts/generate-lesson-audio.js

# Générer audio pour les exemples de grammaire
node scripts/generate-grammar-audio.js

# Générer audio pour les tableaux
node scripts/generate-table-audio.js
```

### Configuration des voix
- Masculine FR : `5jCmrHdxbpU36l1wb3Ke`
- Féminine FR : [ID à définir]
- Ralenti : `slower: true` (stability: 0.75)

---

## Exemple complet de structure JSON

Voir le fichier : `supabase/seed/lesson_template_se_presenter.sql` pour un exemple complet d'insertion.

---

## Notes importantes

1. **Ordre des blocs :** Toujours contextualiser avant d'expliquer (dialogue → grammaire → exercice)
2. **Audio obligatoire :** Dialogues, exemples de grammaire, tableaux de conjugaison
3. **Exercices :** Minimum 3 exercices par leçon, 10 XP chacun
4. **Multilingue :** Toujours créer les 3 versions (blocks_fr, blocks_ru, blocks_en)
5. **Progression :** Chaque leçon doit être complétable en 30-45 minutes

---

## Versions futures

### Améliorations possibles
- [ ] Exercices de type "drag-and-drop"
- [ ] Exercices de type "multiple choice"
- [ ] Mini-jeux interactifs
- [ ] Vidéos culturelles
- [ ] Reconnaissance vocale pour la prononciation

---

**Dernière mise à jour :** 2025-01-11
**Auteur :** Template basé sur la leçon "se-presenter-fr"
