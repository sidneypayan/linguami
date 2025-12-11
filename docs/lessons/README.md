# Documentation des Leçons - Linguami

## 📁 Structure des fichiers

```
docs/lessons/
├── README.md                    # Ce fichier
├── PLAN_LESSONS_FR_A1.md       # Plan détaillé des 15 leçons françaises A1
└── PLAN_LESSONS_RU_A1.md       # Plan détaillé des 15 leçons russes A1

data/lessons/
├── fr/
│   └── A1/
│       ├── alphabet-sons-et-accents.json         ✅ Leçon 1
│       ├── les-articles.json                      ✅ Leçon 2
│       ├── le-genre-et-le-nombre-des-noms.json   ✅ Leçon 3
│       ├── les-pronoms-sujets-et-etre.json       ✅ Leçon 4
│       ├── avoir-au-present.json                  ✅ Leçon 5
│       ├── verbes-er-partie-1.json                ✅ Leçon 6
│       ├── verbes-er-partie-2.json                ✅ Leçon 7
│       ├── aller-et-venir.json                    ✅ Leçon 8
│       ├── faire-et-prendre.json                  🔴 À créer
│       ├── saluer-et-se-presenter.json            🔴 À créer
│       ├── la-negation-simple.json                🔴 À créer
│       ├── poser-des-questions-fermees.json       🔴 À créer
│       ├── les-adjectifs-qualificatifs.json       🔴 À créer
│       ├── les-prepositions-de-lieu.json          🔴 À créer
│       └── les-nombres-et-lheure.json             🔴 À créer
└── ru/
    └── A1/
        └── (15 leçons à créer - voir PLAN_LESSONS_RU_A1.md)
```

---

## 🎓 Philosophie Pédagogique

### Principes de base

1. **Progression spiralaire** : Réviser et approfondir les concepts
2. **Approche communicative** : Privilégier la communication réelle
3. **Contextualisation** : Toujours présenter en situation
4. **Multimodalité** : Texte + Audio + Exercices + Culture
5. **Multilinguisme** : Adapter explications à la langue native

### Niveaux CECRL

| Niveau | Objectif | Nombre de leçons |
|--------|----------|------------------|
| **A1** | Débutant complet → Survie basique | 15 leçons |
| **A2** | Autonomie dans situations familières | 15 leçons |
| **B1** | Conversation courante, textes standards | 15 leçons |
| **B2** | Discussion nuancée, textes complexes | 15 leçons |

---

## 📝 Structure d'une Leçon

### Métadonnées

```json
{
  "id": 123,
  "slug": "kebab-case-slug",
  "title_fr": "Titre français",
  "title_en": "English title",
  "title_ru": "Русский заголовок",
  "level": "A1",
  "order": 1,
  "target_language": "fr",
  "estimatedReadTime": "12 min",
  "keywords": ["mot-clé", "grammaire", "conjugaison"],
  "relatedMethodLessons": []
}
```

### Types de Blocs

#### 1. **dialogue** - Conversation réaliste
```json
{
  "type": "dialogue",
  "title": "Au café",
  "content": [
    { "speaker": "Marie", "text": "Bonjour !", "audioUrl": null },
    { "speaker": "Pierre", "text": "Salut Marie !", "audioUrl": null }
  ]
}
```

#### 2. **vocabulary** - Liste de vocabulaire
```json
{
  "type": "vocabulary",
  "title": "Verbes courants",
  "items": [
    {
      "word": "parler",
      "translation": "говорить",
      "pronunciation": "parlé",
      "audioUrl": null
    }
  ]
}
```

#### 3. **grammar** - Explications grammaticales
```json
{
  "type": "grammar",
  "title": "Le présent",
  "content": "Les verbes en -ER se conjuguent...",
  "examples": [
    { "text": "Je parle", "translation": "Я говорю" }
  ],
  "table": {
    "headers": ["Pronom", "Conjugaison"],
    "rows": [
      ["je", "parle"],
      ["tu", "parles"]
    ]
  }
}
```

#### 4. **exerciseInline** - Exercice fill-in-blank
```json
{
  "type": "exerciseInline",
  "title": "Complétez",
  "instructions": "Conjuguez le verbe entre parenthèses",
  "sentence": "Je ___ (parler) français.",
  "correctAnswer": "parle",
  "hint": "Verbe du 1er groupe",
  "xpReward": 10
}
```

#### 5. **culture** - Point culturel
```json
{
  "type": "culture",
  "title": "Le vouvoiement",
  "content": "En France, on utilise 'vous' pour...",
  "imageUrl": null
}
```

#### 6. **tip** - Astuce mnémotechnique
```json
{
  "type": "tip",
  "content": "Pour retenir les verbes BAGS (Beauty, Age, Goodness, Size)..."
}
```

#### 7. **conversation** - Pratique dialoguée
```json
{
  "type": "conversation",
  "title": "À vous de parler",
  "scenario": "Vous rencontrez quelqu'un à l'université",
  "prompts": [
    "Saluez la personne",
    "Demandez son nom",
    "Dites au revoir"
  ]
}
```

---

## 🔧 Workflow de Création

### Phase 1 : Contenu Texte (NO AUDIO)

**Étapes :**
1. Lire le plan de la leçon (`PLAN_LESSONS_FR_A1.md` ou `PLAN_LESSONS_RU_A1.md`)
2. Créer le fichier JSON dans `data/lessons/[lang]/A1/[slug].json`
3. Remplir toutes les métadonnées
4. Créer les blocs (`blocks_fr`, `blocks_en`, `blocks_ru`)
5. **Laisser `audioUrl: null` partout**
6. Valider la structure JSON
7. **ATTENDRE VALIDATION UTILISATEUR**

**❌ NE PAS :**
- Générer l'audio immédiatement
- Commiter sans validation
- Sauter des blocs de langue (toujours faire fr/en/ru)

### Phase 2 : Audio (APRÈS validation)

**Étapes :**
1. Générer audio des dialogues avec `scripts/generate-dialogue-audio-improved.js`
2. Générer audio du vocabulaire avec `scripts/generate-lesson-audio.js`
3. Mettre à jour les champs `audioUrl` dans le JSON
4. Tester la lecture audio
5. Valider qualité avec utilisateur
6. Commiter

**Commandes :**
```bash
# Générer audio d'un dialogue
node scripts/generate-dialogue-audio-improved.js

# Générer audio du vocabulaire
node scripts/generate-lesson-audio.js
```

---

## 🌍 Gestion Multilinguisme

### Trois concepts distincts

1. **target_language** (langue enseignée)
   - Valeur : `"fr"` ou `"ru"`
   - Définit la langue que l'utilisateur apprend
   - Utilisé pour filtrer les leçons

2. **spoken_language** (langue native de l'apprenant)
   - Valeur : `"fr"`, `"ru"`, ou `"en"`
   - Détermine quelle version du contenu afficher
   - Sélectionne `blocks_fr`, `blocks_en`, ou `blocks_ru`

3. **interface_language** (langue de l'UI)
   - Valeur : `"fr"`, `"ru"`, ou `"en"`
   - Langue des boutons, menus, messages

### Exemple

Un utilisateur **russe** apprenant le **français** avec interface en **anglais** :
- `target_language`: `"fr"` → Leçons françaises
- `spoken_language`: `"ru"` → Explications en russe (`blocks_ru`)
- `interface_language`: `"en"` → Boutons en anglais

**Important :** Toujours créer les 3 versions (`blocks_fr`, `blocks_en`, `blocks_ru`) !

---

## 📊 Progression Actuelle

### Français A1
✅ **8/15 complétées** (53%)
- Bloc 1 : Bases (4/4) ✅
- Bloc 2 : Verbes (4/5) ✅
- Bloc 3 : Communication (0/3) 🔴
- Bloc 4 : Description (0/3) 🔴

### Russe A1
🔴 **0/15 complétées** (0%)
- Tout à créer

---

## 🔗 Liens Utiles

### Documentation interne
- [PLAN_LESSONS_FR_A1.md](./PLAN_LESSONS_FR_A1.md) - Plan détaillé leçons françaises
- [PLAN_LESSONS_RU_A1.md](./PLAN_LESSONS_RU_A1.md) - Plan détaillé leçons russes
- [LESSON_CREATION_GUIDE.md](../guides/LESSON_CREATION_GUIDE.md) - Guide complet de création
- [DIALOGUE_AUDIO_GENERATION.md](../guides/DIALOGUE_AUDIO_GENERATION.md) - Génération audio

### Base de données
- Table : `lessons` (métadonnées uniquement)
- Contenu : Fichiers JSON dans `data/lessons/`

### Scripts utiles
```bash
# Lister les leçons
ls data/lessons/fr/A1/

# Valider JSON
node -e "console.log(JSON.parse(require('fs').readFileSync('data/lessons/fr/A1/alphabet-sons-et-accents.json')))"

# Compter les leçons
find data/lessons/fr/A1 -name "*.json" | wc -l
```

---

## ✅ Checklist Création d'une Leçon

### Avant de commencer
- [ ] Lire le plan de la leçon spécifique
- [ ] Vérifier les leçons précédentes (prérequis)
- [ ] Identifier vocabulaire et grammaire à couvrir

### Pendant la création
- [ ] Créer fichier JSON avec métadonnées complètes
- [ ] Ajouter tous les types de blocs pertinents
- [ ] Créer `blocks_fr`, `blocks_en`, ET `blocks_ru`
- [ ] Laisser `audioUrl: null` (Phase 1)
- [ ] Valider structure JSON
- [ ] Relire et corriger

### Après création
- [ ] Tester affichage dans l'application
- [ ] Demander validation utilisateur
- [ ] (Phase 2) Générer audio
- [ ] (Phase 2) Mettre à jour audioUrl
- [ ] Commiter

---

## 🆘 Résolution de Problèmes

### Leçon ne s'affiche pas
1. Vérifier que le fichier existe : `ls data/lessons/fr/A1/[slug].json`
2. Valider JSON : `node -e "require('./data/lessons/fr/A1/[slug].json')"`
3. Vérifier les logs serveur : `[LessonLoader] ✅ Loaded standalone lesson`

### Audio ne se charge pas
1. Phase 1 → Normal (`audioUrl: null`)
2. Phase 2 → Vérifier URL R2 dans fichier JSON
3. Tester URL directement dans navigateur

### Blocs mal affichés
1. Vérifier type de bloc (liste ci-dessus)
2. Vérifier structure du contenu
3. Consulter leçons existantes comme référence

---

**Date de création** : 2024-12-11
**Dernière mise à jour** : 2024-12-11
