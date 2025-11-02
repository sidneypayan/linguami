# Système de Limites pour Utilisateurs Invités

## 📋 Vue d'ensemble

Les utilisateurs non connectés ont maintenant **deux limites distinctes** :
- ✅ **20 traductions maximum** (consultations de définitions)
- ✅ **20 mots maximum** dans le dictionnaire (sauvegarde)

---

## 🎯 Fonctionnalités

### Limite de Traductions (20 max)

| Action | Description |
|--------|-------------|
| **Consulter une traduction** | Chaque clic sur un mot compte comme 1 traduction |
| **Compteur** | Affiché en haut de la popup : "X/20 traductions" |
| **Blocage** | Au 21ème clic, message d'erreur + invitation à créer un compte |
| **Reset automatique** | Le compteur se réinitialise après 24 heures |
| **Stockage** | localStorage (côté client) |

### Limite de Dictionnaire (20 max)

| Action | Description |
|--------|-------------|
| **Sauvegarder un mot** | Cliquer sur une définition pour l'ajouter au dictionnaire |
| **Compteur** | Affiché dans la popup : "X/20 mots sauvegardés" |
| **Blocage** | Au 21ème mot, impossible d'ajouter + message d'invitation |
| **Révisions** | Les flashcards fonctionnent normalement (illimité) |
| **Stockage** | localStorage (côté client) |

---

## 🔄 Indépendance des Limites

Les deux limites sont **complètement indépendantes** :

### Scénario 1 : Traductions épuisées, dictionnaire vide
- ❌ Impossible de traduire de nouveaux mots
- ✅ Peut toujours réviser les mots existants (si il y en a)
- ⏰ Reset des traductions dans 24h

### Scénario 2 : Dictionnaire plein, traductions restantes
- ✅ Peut toujours consulter des traductions
- ❌ Ne peut plus ajouter de mots au dictionnaire
- 🗑️ Peut supprimer des mots pour libérer de la place

### Scénario 3 : Les deux limites atteintes
- ❌ Ne peut plus traduire ni ajouter de mots
- ✅ Peut réviser avec flashcards
- 📝 Invitation forte à créer un compte

---

## 📁 Architecture Technique

### Fichiers modifiés/créés

1. **`utils/guestTranslations.js`** ✨ NOUVEAU
   - Gestion du compteur de traductions
   - Fonctions : `incrementGuestTranslations()`, `isGuestTranslationLimitReached()`, etc.
   - Reset automatique après 24h

2. **`utils/guestDictionary.js`** ✅ EXISTANT
   - Gestion du dictionnaire invité (inchangé)
   - Limite : 20 mots max

3. **`features/words/wordsSlice.js`** 🔄 MODIFIÉ
   - Import des fonctions de `guestTranslations.js`
   - `translateWord` vérifie la limite AVANT l'appel API
   - Incrémente le compteur APRÈS une traduction réussie

4. **`components/material/Words.jsx`** 🔄 MODIFIÉ
   - Passe `isAuthenticated` au `translateWord`

5. **`components/material/Translation.jsx`** 🔄 MODIFIÉ
   - Affiche les deux compteurs (traductions + mots)
   - Message d'erreur spécifique si limite de traductions atteinte
   - Message d'erreur spécifique si limite de dictionnaire atteinte

---

## 🧪 Comment Tester

### Test 1 : Limite de traductions (20 max)

1. **Déconnectez-vous** (ou mode navigation privée)
2. **Allez sur un matériel** (ex: `/materials/[id]`)
3. **Cliquez sur 20 mots différents** pour les traduire
4. **Vérifiez** : le compteur s'incrémente (1/20, 2/20, ..., 20/20)
5. **Cliquez sur un 21ème mot**
6. **Résultat attendu** :
   - ❌ Pas de traduction affichée
   - 🚫 Message : "Limite de traductions atteinte !"
   - 📝 Bouton "Créer un compte"
   - ⏰ "Votre compteur sera réinitialisé dans 24h"

### Test 2 : Limite de dictionnaire (20 max)

1. **Cliquez sur un mot** pour voir sa traduction
2. **Cliquez sur une définition** pour l'ajouter au dictionnaire
3. **Répétez 20 fois**
4. **Essayez d'ajouter un 21ème mot**
5. **Résultat attendu** :
   - ❌ Le mot n'est pas ajouté
   - 🚫 Message : "Limite de 20 mots atteinte !"
   - 📝 Bouton "Créer un compte"

### Test 3 : Indépendance des limites

**Partie A : Épuiser les traductions d'abord**
1. Faites 20 traductions (sans sauvegarder)
2. Essayez de traduire un 21ème mot → Bloqué
3. **Vérifiez** : le compteur de mots est à 0/20
4. Vous pouvez toujours consulter le dictionnaire (vide)

**Partie B : Remplir le dictionnaire ensuite**
1. Attendez 24h (ou réinitialisez : `localStorage.removeItem('guest_translation_count')`)
2. Faites 5 traductions et sauvegardez les 5
3. Faites 15 traductions supplémentaires (total : 20)
4. Essayez une 21ème traduction → Bloqué
5. **Mais** : Vous avez seulement 5 mots dans le dictionnaire
6. **Vérifiez** : Vous pouvez toujours réviser ces 5 mots avec flashcards

### Test 4 : Reset automatique (24h)

Pour tester sans attendre 24h :

```javascript
// Dans la console du navigateur (F12)

// Voir la date de reset
localStorage.getItem('guest_translation_reset_at')

// Forcer un reset immédiat (pour test)
localStorage.removeItem('guest_translation_count')
localStorage.removeItem('guest_translation_reset_at')

// Vérifier
console.log('Traductions restantes:', 20 - parseInt(localStorage.getItem('guest_translation_count') || 0))
```

### Test 5 : Utilisateurs connectés (illimité)

1. **Connectez-vous** avec un compte
2. **Traduisez 30+ mots**
3. **Sauvegardez 30+ mots**
4. **Résultat** :
   - ✅ Aucune limite
   - ✅ Pas de compteur affiché
   - ✅ Pas de message de blocage

---

## 🔍 Vérification localStorage

```javascript
// Console navigateur (F12)

// Voir le compteur de traductions
localStorage.getItem('guest_translation_count')
// → "15" (par exemple)

// Voir la date de reset
localStorage.getItem('guest_translation_reset_at')
// → "2025-01-03T14:30:00.000Z"

// Voir les mots sauvegardés
JSON.parse(localStorage.getItem('guest_dictionary_words'))
// → Array de 5 mots (par exemple)

// Reset manuel (pour retester)
localStorage.removeItem('guest_translation_count')
localStorage.removeItem('guest_translation_reset_at')
localStorage.removeItem('guest_dictionary_words')
```

---

## 💡 Logique du Système

### Flux de Traduction

```
1. Utilisateur clique sur un mot
   ↓
2. handleClick() dans Words.jsx
   ↓
3. dispatch(translateWord({ ..., isAuthenticated }))
   ↓
4. wordsSlice.js : translateWord thunk
   ↓
5. SI invité :
   - checkAndResetGuestTranslations() → reset si 24h écoulées
   - isGuestTranslationLimitReached() → vérifier limite
   - SI limite atteinte → rejectWithValue (erreur)
   - SINON → appel API Yandex
   - SI succès → incrementGuestTranslations()
   ↓
6. Translation.jsx affiche le résultat ou l'erreur
```

### Flux d'Ajout au Dictionnaire

```
1. Utilisateur clique sur une définition
   ↓
2. addWord() dans Translation.jsx
   ↓
3. SI invité :
   - addGuestWord(wordData) → vérifie limite dans la fonction
   - SI limite atteinte → toast error + return
   - SINON → ajout dans localStorage
   ↓
4. Toast de succès + mise à jour compteur
```

---

## 🛡️ Sécurité

### Peut-on contourner les limites ?

**Oui, techniquement** (localStorage est côté client) :

```javascript
// Un utilisateur peut effacer localStorage
localStorage.removeItem('guest_translation_count')
localStorage.removeItem('guest_dictionary_words')
```

**Mais ce n'est pas grave car :**
1. L'utilisateur perd toutes ses données (mots, progression)
2. Il doit recommencer à zéro
3. L'objectif est d'**encourager l'inscription**, pas de bloquer totalement
4. Les utilisateurs motivés à contourner sont rares

### Améliorations futures (optionnel)

- **Tracking par IP côté serveur** (voir `TRANSLATION_LIMITS_GUIDE.md`)
- **Captcha** après plusieurs resets suspects
- **Rate limiting** (ex: max 5 traductions/minute)

---

## 📊 Messages Clés

### Dans Translation.jsx (invités)

**Compteurs (si pas de limite atteinte) :**
```
📚 5/20 mots sauvegardés • 15 restants
🔤 12/20 traductions • 8 restantes
```

**Limite de traductions atteinte :**
```
Titre : Limite de traductions atteinte !
Message : Vous avez utilisé vos 20 traductions gratuites.
          Créez un compte pour traduire un nombre illimité de mots !
Note : Votre compteur sera réinitialisé dans 24h
```

**Limite de dictionnaire atteinte :**
```
Titre : Limite de 20 mots atteinte !
Message : Vous avez atteint la limite de 20 mots gratuits.
          Créez un compte pour sauvegarder un nombre illimité de mots
          et accéder à toutes les fonctionnalités.
Note : Vous pourrez réviser vos X mots après inscription
```

---

## ✅ Checklist de Test Complet

- [ ] 20 traductions → compteur s'incrémente
- [ ] 21ème traduction → bloquée + message
- [ ] 20 mots sauvegardés → compteur s'incrémente
- [ ] 21ème mot → bloqué + message
- [ ] Traductions épuisées mais dictionnaire vide → peut réviser (rien à réviser)
- [ ] Dictionnaire plein mais traductions restantes → peut traduire sans sauvegarder
- [ ] Reset 24h fonctionne (ou reset manuel)
- [ ] Utilisateur connecté → aucune limite
- [ ] Compteurs visibles et corrects dans la popup
- [ ] Messages d'erreur adaptés selon le type de limite

---

## 🔮 Statistiques Utiles (Futur)

Pour comprendre le comportement des utilisateurs :

- Nombre moyen de traductions avant inscription
- Nombre moyen de mots sauvegardés avant inscription
- Taux de conversion (invités atteignant une limite → inscrits)
- Temps moyen avant première inscription
- % d'invités qui atteignent les deux limites

---

**Créé le :** 2025-01-02
**Version :** 1.0
**Auteur :** Claude Code
**Statut :** ✅ Prêt pour tests
