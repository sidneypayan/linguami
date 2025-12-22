# Guide: Ajouter l'audio aux mots français dans les leçons

## Vue d'ensemble

Les mots français dans les exemples des tableaux peuvent maintenant être écoutés! Chaque mot peut avoir une icône 🔊 qui permet de jouer sa prononciation.

## Comment ça fonctionne

### 1. Structure des données

Pour activer l'audio sur les mots, vous devez ajouter un objet `audioUrls` qui mappe les mots à leurs URLs audio.

**Deux options:**

#### Option A: audioUrls au niveau du bloc (recommandé)
Tous les rows du tableau utilisent le même mapping d'URLs.

```json
{
  "type": "conjugationTable",
  "title": "Les accents français",
  "audioUrls": {
    "café": "https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/cafe.mp3",
    "étudiant": "https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/etudiant.mp3",
    "mère": "https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/mere.mp3"
  },
  "rows": [
    {
      "pronoun": "Accent aigu",
      "form": "é",
      "translation": "café, étudiant"
    },
    {
      "pronoun": "Accent grave",
      "form": "è",
      "translation": "mère, père"
    }
  ]
}
```

#### Option B: audioUrls au niveau de chaque row
URLs spécifiques par ligne (utile si différents rows ont des mots différents).

```json
{
  "type": "conjugationTable",
  "rows": [
    {
      "pronoun": "Accent aigu",
      "form": "é",
      "translation": "café, étudiant",
      "audioUrls": {
        "café": "url1",
        "étudiant": "url2"
      }
    }
  ]
}
```

### 2. Format des URLs audio

Les fichiers audio doivent être hébergés sur le CDN Cloudflare R2:

**Structure recommandée:**
```
linguami/audios/fr/words/
├── cafe.mp3
├── etudiant.mp3
├── mere.mp3
├── pere.mp3
└── ...
```

**URL publique:**
```
https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/{mot}.mp3
```

### 3. Comportement visuel

Quand les audioUrls sont présents:
- Chaque mot a une icône 🔊 à côté
- L'icône change de couleur au survol (violet)
- L'icône pulse pendant la lecture
- Un seul audio peut jouer à la fois

Quand les audioUrls sont absents:
- Les mots s'affichent normalement sans icône
- Pas d'erreur, juste pas d'audio

## Ajouter l'audio à votre leçon

### Étape 1: Préparer les fichiers audio

1. Enregistrez ou générez l'audio pour chaque mot (ElevenLabs, etc.)
2. Nommez les fichiers de manière cohérente (ex: `cafe.mp3`, `mere.mp3`)
3. Uploadez-les dans votre bucket R2 à `linguami/audios/fr/words/`

### Étape 2: Mettre à jour la leçon

**Option 1: Via l'admin** (recommandé)
1. Allez sur `/admin/lessons`
2. Cliquez sur "Edit" pour votre leçon
3. Dans l'éditeur JSON, ajoutez le champ `audioUrls` à vos blocs
4. Cliquez sur "Save Changes"

**Option 2: Via un script**
Utilisez le script exemple fourni:

```bash
# Modifiez le script avec vos URLs
node scripts/add-word-audio-urls-example.js
```

### Étape 3: Tester

Allez sur votre leçon et vérifiez que:
- Les icônes 🔊 apparaissent à côté des mots
- Cliquer sur une icône joue l'audio
- L'audio se charge correctement (vérifiez la console en cas d'erreur)

## Exemple complet

Voici un bloc complet avec audio:

```json
{
  "type": "conjugationTable",
  "title": "Французские акценты",
  "audioUrls": {
    "café": "https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/cafe.mp3",
    "étudiant": "https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/etudiant.mp3",
    "mère": "https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/mere.mp3",
    "père": "https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/pere.mp3",
    "être": "https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/etre.mp3",
    "forêt": "https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/foret.mp3"
  },
  "rows": [
    {
      "pronoun": "Accent aigu",
      "form": "é",
      "translation": "café, étudiant"
    },
    {
      "pronoun": "Accent grave",
      "form": "è",
      "translation": "mère, père"
    },
    {
      "pronoun": "Accent circonflexe",
      "form": "ê",
      "translation": "être, forêt"
    }
  ]
}
```

## Notes importantes

1. **Sensibilité à la casse:** Les clés dans `audioUrls` doivent correspondre EXACTEMENT aux mots dans `translation`
   - ❌ `"Café"` vs `"café"` → ne matche pas
   - ✅ `"café"` vs `"café"` → matche

2. **Espaces:** Les mots sont automatiquement trimmés après le split par virgule
   - `"café, étudiant"` → `["café", "étudiant"]` ✅

3. **Mots absents:** Si un mot n'a pas d'URL audio, il s'affiche sans icône (pas d'erreur)

4. **Performance:** Les URLs audio ne sont chargées qu'au moment du clic

## Dépannage

**Les icônes n'apparaissent pas:**
- Vérifiez que le bloc a bien un champ `audioUrls`
- Vérifiez que les clés correspondent exactement aux mots

**L'audio ne joue pas:**
- Ouvrez la console (F12) pour voir les erreurs
- Vérifiez que l'URL est correcte et accessible
- Vérifiez le format du fichier (MP3 recommandé)

**L'audio joue en double:**
- Normal si vous cliquez rapidement, l'ancien audio s'arrête automatiquement
