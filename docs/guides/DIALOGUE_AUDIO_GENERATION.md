# Guide de Génération Audio pour les Dialogues

Ce guide documente le processus de génération audio pour les dialogues en utilisant l'API ElevenLabs Text-to-Dialogue.

## 📋 Table des matières

- [Voice IDs ElevenLabs](#voice-ids-elevenlabs)
- [Règles d'Attribution des Voix](#règles-dattribution-des-voix)
- [Format de Dialogue](#format-de-dialogue)
- [Structure R2](#structure-r2)
- [Processus de Génération](#processus-de-génération)
- [Scripts Disponibles](#scripts-disponibles)

---

## 🎙️ Voice IDs ElevenLabs

### Voix Françaises

#### Voix Masculines

| Nom | Voice ID | Description | Usage |
|-----|----------|-------------|-------|
| **Sébas** | `5jCmrHdxbpU36l1wb3Ke` | Jeune homme, ton naturel | Clients, passagers, patients, personnages jeunes |
| **Professional Male** | `qNc8cbRJLnPqGTjuVcKa` | Homme mature, ton professionnel | Serveurs, employés, vendeurs, docteurs, professeurs |

#### Voix Féminines

| Nom | Voice ID | Description | Usage |
|-----|----------|-------------|-------|
| **Marie** | `sANWqF1bCMzR6eyZbCGw` | Femme, ton clair et naturel | Tous les personnages féminins |

### Mapping des Personnages

```javascript
const FRENCH_VOICES = {
  // Prénoms masculins
  'PIERRE': '5jCmrHdxbpU36l1wb3Ke',     // Sébas
  'THOMAS': '5jCmrHdxbpU36l1wb3Ke',     // Sébas
  'MARC': 'qNc8cbRJLnPqGTjuVcKa',       // Professional male
  'NICOLAS': '5jCmrHdxbpU36l1wb3Ke',    // Sébas
  'JULIEN': 'qNc8cbRJLnPqGTjuVcKa',     // Professional male
  'ALEXANDRE': '5jCmrHdxbpU36l1wb3Ke',  // Sébas
  'MAXIME': 'qNc8cbRJLnPqGTjuVcKa',     // Professional male
  'ANTOINE': '5jCmrHdxbpU36l1wb3Ke',    // Sébas

  // Prénoms féminins
  'MARIE': 'sANWqF1bCMzR6eyZbCGw',      // Marie
  'JULIE': 'sANWqF1bCMzR6eyZbCGw',      // Marie
  'CLAIRE': 'sANWqF1bCMzR6eyZbCGw',     // Marie
  'SOPHIE': 'sANWqF1bCMzR6eyZbCGw',     // Marie
  'EMMA': 'sANWqF1bCMzR6eyZbCGw',       // Marie
  'LAURA': 'sANWqF1bCMzR6eyZbCGw',      // Marie
  'CHARLOTTE': 'sANWqF1bCMzR6eyZbCGw',  // Marie
  'LUCIE': 'sANWqF1bCMzR6eyZbCGw',      // Marie

  // Rôles professionnels (masculins)
  'CLIENT': '5jCmrHdxbpU36l1wb3Ke',     // Sébas (jeune)
  'EMPLOYÉ': 'qNc8cbRJLnPqGTjuVcKa',    // Professional
  'CAISSIER': 'qNc8cbRJLnPqGTjuVcKa',   // Professional
  'VENDEUR': 'qNc8cbRJLnPqGTjuVcKa',    // Professional
  'SERVEUR': 'qNc8cbRJLnPqGTjuVcKa',    // Professional
  'PASSAGER': '5jCmrHdxbpU36l1wb3Ke',   // Sébas (jeune)
  'PHARMACIEN': 'qNc8cbRJLnPqGTjuVcKa', // Professional
  'LIBRAIRE': 'qNc8cbRJLnPqGTjuVcKa',   // Professional
  'PROFESSEUR': 'qNc8cbRJLnPqGTjuVcKa', // Professional
  'DOCTEUR': 'qNc8cbRJLnPqGTjuVcKa',    // Professional
  'PATIENT': '5jCmrHdxbpU36l1wb3Ke',    // Sébas (jeune)

  // Rôles professionnels (féminins)
  'FLEURISTE': 'sANWqF1bCMzR6eyZbCGw',  // Marie
  'ÉLÈVE': 'sANWqF1bCMzR6eyZbCGw',      // Marie

  // Rôles familiaux/spéciaux
  'GRAND-MÈRE': 'sANWqF1bCMzR6eyZbCGw', // Marie
  'ENFANT': 'sANWqF1bCMzR6eyZbCGw',     // Marie (voix claire)
}
```

---

## 📝 Règles d'Attribution des Voix

### Principe de Base

**1 personnage = 1 voix unique** dans un même dialogue pour éviter la confusion.

### Stratégie d'Attribution

#### Dialogues avec 2 personnages
- **Dialogue client/professionnel** : Sébas + Professional Male
  - Exemple : CLIENT (Sébas) + SERVEUR (Professional Male)
- **Dialogue mixte** : Marie + Sébas ou Professional Male
  - Exemple : SOPHIE (Marie) + MARC (Professional Male)

#### Dialogues avec 3+ personnages
- Alterner les voix pour distinguer chaque personnage
- Éviter d'utiliser la même voix pour 2 personnages qui se parlent directement

### Exemples de Bonnes Attributions

**Restaurant (material 676)** :
- SERVEUR → Professional Male (`qNc8cbRJLnPqGTjuVcKa`)
- SOPHIE → Marie (`sANWqF1bCMzR6eyZbCGw`)
- MARC → Professional Male (`qNc8cbRJLnPqGTjuVcKa`)

✅ **Bon** : Serveur et Marc ont la même voix car ils ne dialoguent pas directement.

**À éviter** :
- CLIENT + SERVEUR avec la même voix ❌
- Deux personnages en conversation avec la même voix ❌

---

## 📄 Format de Dialogue

### Format dans la Base de Données

Le contenu du dialogue dans `materials.content` doit suivre ce format :

```
[PERSONNAGE 1] Première réplique du dialogue.
[PERSONNAGE 2] Réponse du deuxième personnage.
[PERSONNAGE 1] Suite de la conversation...
```

### Règles de Formatage

1. **Nom du personnage** : MAJUSCULES, entre crochets `[PERSONNAGE]`
2. **Espaces** : Un espace après `]` avant le texte
3. **Ponctuation** : Toujours terminer par un point, point d'interrogation ou point d'exclamation
4. **Accents** : Conserver les accents français (É, È, Ê, etc.)
5. **Ligne vide** : Pas de lignes vides entre les répliques

### Exemple Complet

```
[SERVEUR] Bonsoir ! Bienvenue au restaurant. Vous avez réservé ?
[SOPHIE] Oui, bonsoir ! J'ai réservé une table pour deux personnes au nom de Dubois.
[SERVEUR] Parfait, Madame Dubois. Suivez-moi, votre table est prête.
[MARC] Merci beaucoup. Qu'est-ce que vous me conseillez ?
[SERVEUR] Notre spécialité du jour est le bœuf bourguignon, c'est excellent !
```

---

## 📁 Structure R2

### Convention de Nommage

**IMPORTANT** : Toujours utiliser `audios` (avec un 's') pour la cohérence du projet.

### Chemins R2

```
audios/
├── fr/
│   ├── materials/           # ← DIALOGUES FINAUX
│   │   ├── au-restaurant.mp3
│   │   ├── a-laeroport.mp3
│   │   └── ...
│   ├── dialogues/           # [OBSOLÈTE] Ne plus utiliser
│   │   └── material_XXX/
│   └── exercises/
│       └── material_XXX/
├── ru/
│   └── materials/
└── en/
    └── materials/
```

### URL Publique

```javascript
const audioUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/audios/fr/materials/${filename}.mp3`

// Exemple : https://linguami-cdn.etreailleurs.workers.dev/audios/fr/materials/au-restaurant.mp3
```

### Règles de Stockage

1. **Emplacement** : `audios/{lang}/materials/` pour tous les dialogues
2. **Format** : MP3 (44100 Hz, 128 kbps)
3. **Nom de fichier** : slug du titre (minuscules, sans accents, tirets)
4. **Content-Type** : `audio/mpeg`

---

## ⚙️ Processus de Génération

### Étape 1 : Préparer le Dialogue

1. Créer le contenu dans `materials` table
2. Vérifier le format `[PERSONNAGE] texte`
3. Identifier les personnages uniques
4. Assigner les voice IDs selon les règles

### Étape 2 : Générer l'Audio

```bash
node scripts/generate-single-dialogue-audio.js <material_id>
```

**Ce que fait le script :**
1. Récupère le dialogue depuis la DB
2. Parse les lignes `[PERSONNAGE] texte`
3. Assigne les voice IDs selon `FRENCH_VOICES`
4. Appelle l'API ElevenLabs Text-to-Dialogue v3
5. Upload vers R2 : `audios/fr/materials/{slug}.mp3`
6. Met à jour `materials.audio_filename` avec `{slug}.mp3`

### Étape 3 : Vérifier le Résultat

```bash
# Écouter l'audio
# URL : https://linguami-cdn.etreailleurs.workers.dev/audios/fr/materials/{slug}.mp3

# Vérifier la DB
node scripts/check-material-676-voices.js  # (remplacer 676 par l'ID)
```

---

## 🛠️ Scripts Disponibles

### Génération Audio

| Script | Usage | Description |
|--------|-------|-------------|
| `generate-single-dialogue-audio.js` | `node scripts/generate-single-dialogue-audio.js <material_id>` | Génère l'audio complet d'un dialogue |
| `check-material-676-voices.js` | `node scripts/check-material-676-voices.js` | Vérifie les voix utilisées pour un dialogue |

### Gestion des Fichiers

| Script | Usage | Description |
|--------|-------|-------------|
| `move-au-restaurant-audio.js` | `node scripts/move-au-restaurant-audio.js` | Déplace un audio vers `materials/` |
| `cleanup-old-dialogue-audio.js` | `node scripts/cleanup-old-dialogue-audio.js` | Nettoie les anciens fichiers audio |

---

## 🔧 Configuration API ElevenLabs

### Paramètres de l'API Text-to-Dialogue

```javascript
{
  inputs: [
    {
      text: "Texte de la réplique",
      voice_id: "5jCmrHdxbpU36l1wb3Ke"
    }
  ],
  model_id: 'eleven_v3',
  output_format: 'mp3_44100_128',
  language_code: 'fr'
}
```

### Headers Requis

```javascript
{
  'Accept': 'audio/mpeg',
  'xi-api-key': process.env.ELEVENLABS_API_KEY,
  'Content-Type': 'application/json'
}
```

---

## ✅ Checklist de Génération

Avant de générer l'audio d'un nouveau dialogue :

- [ ] Le contenu suit le format `[PERSONNAGE] texte`
- [ ] Les personnages sont en MAJUSCULES
- [ ] Les accents sont présents (É, È, etc.)
- [ ] Chaque réplique se termine par une ponctuation
- [ ] Les voice IDs sont assignés selon `FRENCH_VOICES`
- [ ] Pas de doublons de voix pour personnages qui dialoguent directement
- [ ] Le material est dans la DB avec `lang='fr'` et `section='dialogues'`

Après génération :

- [ ] L'audio est uploadé sur R2 dans `audios/fr/materials/`
- [ ] Le nom de fichier est un slug valide (minuscules, sans accents)
- [ ] `materials.audio_filename` est mis à jour
- [ ] L'URL publique fonctionne
- [ ] La qualité audio est vérifiée (écoute)

---

## 🚨 Problèmes Courants

### Problème : Personnage non reconnu

**Cause** : Le nom du personnage n'est pas dans `FRENCH_VOICES`

**Solution** :
1. Ajouter le personnage dans `FRENCH_VOICES`
2. Choisir une voix appropriée (Sébas, Professional Male, ou Marie)
3. Mettre à jour `scripts/generate-single-dialogue-audio.js`

### Problème : Audio uploadé au mauvais endroit

**Cause** : Utilisation de `audio/` au lieu de `audios/`

**Solution** :
```bash
node scripts/move-au-restaurant-audio.js  # Adapter selon le fichier
```

### Problème : Même voix pour 2 personnages

**Cause** : Attribution incorrecte dans `FRENCH_VOICES`

**Solution** :
1. Modifier le mapping dans le script
2. Régénérer l'audio

### Problème : Intonation robotique en fin de dialogue

**Symptôme** : Les premières répliques sont naturelles, mais les dernières (surtout pour les voix féminines) deviennent robotiques.

**Cause** : Absence de `voice_settings` dans l'API call. Sans paramètres de stabilité, l'API peut produire des variations de qualité.

**Solution** :

Utiliser le script amélioré avec voice settings :

```bash
node scripts/generate-dialogue-audio-improved.js <material_id>
```

Ce script ajoute automatiquement :
```javascript
voice_settings: {
  stability: 0.65,           // Équilibre naturel/cohérence
  similarity_boost: 0.8,     // Cohérence vocale
  style: 0.3,                // Expressivité modérée
  use_speaker_boost: true    // Clarté améliorée
}
```

**Paramètres ajustables** :
- **stability** (0-1) : Plus élevé = plus cohérent mais moins naturel
  - 0.5-0.6 : Très naturel, léger risque de variation
  - **0.65 : Recommandé** - bon équilibre
  - 0.75-0.85 : Très stable, légèrement robotique

- **similarity_boost** (0-1) : Maintient la cohérence de la voix
  - **0.8 : Recommandé** pour les dialogues

- **style** (0-1) : Exagération de l'intonation
  - **0.3 : Recommandé** - expressif sans exagération
  - 0.5+ : Peut devenir théâtral

---

## 📚 Références

- **ElevenLabs API Docs** : https://elevenlabs.io/docs
- **Text-to-Dialogue API** : https://elevenlabs.io/docs/api-reference/text-to-dialogue
- **Voice Library** : https://elevenlabs.io/voice-library

---

**Dernière mise à jour** : 2025-11-22
