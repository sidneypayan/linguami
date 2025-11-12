# Guide de Test Local pour VK ID OneTap

Ce guide vous explique comment tester VK ID OneTap en local sans avoir à déployer en production à chaque modification.

## 🚀 À propos de OneTap

Linguami utilise la méthode **OneTap** de VK ID qui offre :
- ⚡ Authentification sans redirection (popup)
- 🎨 Widget natif VK ID adaptatif (thème clair/sombre)
- 📱 Expérience mobile optimisée
- 🔄 Événements LOGIN_SUCCESS pour gérer l'auth côté client

## 📋 Prérequis

1. ✅ Variables d'environnement configurées dans `.env.local` :
   ```bash
   NEXT_PUBLIC_VK_APP_ID=54311927
   VK_CLIENT_SECRET=WAZ5Br14vUNzn8L5yceO
   ```

2. ✅ Compte VK et accès à [VK ID Console](https://id.vk.com/)

## 🔧 Configuration VK ID Console pour localhost

### Étape 1 : Accéder à VK ID Console

1. Rendez-vous sur [VK ID Console](https://id.vk.com/)
2. Connectez-vous avec votre compte VK
3. Sélectionnez votre application (App ID: 54311927)

### Étape 2 : Ajouter localhost aux URLs autorisées

Dans les paramètres de votre application VK ID :

1. **Section "Redirect URIs" (URLs de redirection)** :
   - Ajoutez : `http://localhost:3000/auth/callback`
   - Ajoutez aussi : `http://127.0.0.1:3000/auth/callback` (équivalent de localhost)

2. **Section "Allowed Origins" (Origines autorisées)** (si disponible) :
   - Ajoutez : `http://localhost:3000`
   - Ajoutez : `http://127.0.0.1:3000`

3. **Sauvegardez** les modifications

⚠️ **Important** : VK ID accepte les URLs HTTP pour localhost (pas besoin de HTTPS en développement).

### Étape 3 : Vérifier les URLs autorisées

Assurez-vous que votre liste contient au minimum :

**URLs de redirection :**
- ✅ `https://www.linguami.com/auth/callback` (production)
- ✅ `http://localhost:3000/auth/callback` (développement)
- ✅ `http://127.0.0.1:3000/auth/callback` (alternative localhost)

## 🚀 Tester en local

### Étape 1 : Lancer le serveur de développement

```bash
npm run dev
```

Le serveur démarre normalement sur `http://localhost:3000`

### Étape 2 : Accéder à la page de login en russe

VK ID n'apparaît que pour l'interface russe. Accédez à :

```
http://localhost:3000/ru/login
```

Ou si vous êtes déjà sur une autre page :

```
http://localhost:3000/ru
```

Puis cliquez sur le bouton de connexion.

### Étape 3 : Ouvrir la console développeur

**Avant** de cliquer sur le bouton VK ID, ouvrez la console :

- **Chrome/Edge** : `F12` ou `Ctrl+Shift+J`
- **Firefox** : `F12` ou `Ctrl+Shift+K`

Gardez la console ouverte pour voir tous les logs détaillés.

### Étape 4 : Tester l'authentification OneTap

1. Vous devriez voir le **widget OneTap VK ID** s'afficher automatiquement

2. Observez les logs de chargement dans la console :
   ```
   📦 Loading VK ID SDK...
   🔗 Trying to load VK ID SDK from: https://unpkg.com/...
   ✅ VK ID SDK script loaded successfully from: ...
   🔧 Initializing VK ID SDK with:
     - App ID: 54311927
     - Redirect URL: http://localhost:3000/auth/callback
     - Origin: http://localhost:3000
   ✅ VK ID SDK initialized successfully
   🎨 Rendering VK ID OneTap widget...
   ✅ VK ID OneTap widget rendered successfully
   ```

3. Cliquez sur le **widget OneTap** (bouton bleu VK ID)

4. Une **popup** s'ouvre (pas de redirection) avec le choix du provider

5. Connectez-vous avec VK, OK ou Mail.ru dans la popup

6. La popup se ferme et vous voyez les logs d'authentification :
   ```
   ✅ VK ID OneTap LOGIN_SUCCESS event received
   Payload: { code: "...", device_id: "...", ... }
   🔐 Processing VK ID OneTap authentication...
   Code (first 10 chars): AbCdEfGhIj...
   Device ID (first 10 chars): 1234567890...
   🔄 Exchanging code for token...
   Exchange response status: 200
   ✅ Token received from VK ID
   👤 User info: John Doe john@example.com
   🔄 Validating with backend...
   Validation response status: 200
   ✅ Backend validation successful
   User ID: abc123
   🔑 Setting Supabase session...
   ✅ VK ID authentication complete
   ```

7. Vérifiez aussi les logs côté serveur (terminal où `npm run dev` tourne) :
   ```
   🔄 [VK Exchange] Received request
   Code (first 10 chars): AbCdEfGhIj...
   Device ID (first 10 chars): 1234567890...
   Redirect URI: http://localhost:3000/auth/callback
   🔧 [VK Exchange] Exchange parameters:
   App ID: 54311927
   Redirect URI: http://localhost:3000/auth/callback
   📡 [VK Exchange] VK API response status: 200
   ✅ [VK Exchange] Received token data
   🔍 [VK Exchange] Fetching user info...
   📡 [VK Exchange] User info response status: 200
   ✅ [VK Exchange] User info received:
   User ID: 12345
   Name: John Doe
   Email: john@example.com
   ```

8. Si tout fonctionne, vous serez connecté et redirigé vers la page d'accueil (pas de passage par `/auth/callback`!)

## 🐛 Diagnostic des erreurs

### Console navigateur vide ou pas de logs

**Problème** : Les logs améliorés ne s'affichent pas.

**Solution** :
1. Assurez-vous d'avoir rebuild l'app : `Ctrl+C` puis `npm run dev`
2. Videz le cache : `Ctrl+Shift+R` (hard reload)
3. Vérifiez que vous êtes bien sur `/ru/login`

### Erreur "VK ID SDK not loaded"

**Causes possibles** :
- Bloqueur de publicités/trackers (uBlock, AdBlock, etc.)
- Extension de confidentialité (Privacy Badger, Ghostery, etc.)
- VPN ou proxy qui bloque les CDN

**Solutions** :
1. Désactivez temporairement votre bloqueur de pub
2. Testez en navigation privée
3. Vérifiez dans l'onglet Network de DevTools que les scripts se chargent

### Erreur "Failed to exchange code for token"

**Vérifiez les logs serveur** (terminal) pour voir l'erreur exacte.

**Erreur : "invalid_grant"**
- L'URL de redirection ne correspond pas
- Vérifiez que `http://localhost:3000/auth/callback` est bien dans VK ID Console
- Vérifiez qu'il n'y a pas d'espace ou de caractère en trop

**Erreur : "invalid_client"**
- `NEXT_PUBLIC_VK_APP_ID` ou `VK_CLIENT_SECRET` incorrect
- Vérifiez `.env.local`
- Redémarrez le serveur après modification

**Erreur : "Server configuration error"**
- Variables d'environnement manquantes
- Vérifiez que `.env.local` contient bien :
  ```bash
  NEXT_PUBLIC_VK_APP_ID=54311927
  VK_CLIENT_SECRET=WAZ5Br14vUNzn8L5yceO
  ```

### Erreur "Abort fetching component for route: /login"

**Cause** : Erreur lors de la navigation vers /login après une erreur VK ID.

**Solution** : Cette erreur apparaît après une autre erreur. Concentrez-vous sur l'erreur VK ID qui la précède dans les logs.

### Le widget OneTap ne s'affiche pas

**Vérifications** :
1. ✅ Vous êtes sur `/ru/login` (pas `/fr/login` ou `/en/login`)
2. ✅ `NEXT_PUBLIC_VK_APP_ID` est défini dans `.env.local`
3. ✅ Le serveur a été redémarré après ajout de la variable
4. ✅ Console navigateur : vérifiez les logs
   - `✅ VK ID SDK initialized successfully` doit apparaître
   - `🎨 Rendering VK ID OneTap widget...` doit apparaître
   - `✅ VK ID OneTap widget rendered successfully` doit apparaître
5. ✅ Vérifiez que le conteneur existe : `document.getElementById('vkid-onetap-container')`

### Le widget OneTap s'affiche mais ne réagit pas

**Causes possibles** :
- Le widget est en cours de chargement (indicateur de loading)
- Erreur lors du rendu (vérifiez les logs)
- SDK non complètement initialisé

**Solutions** :
1. Attendez quelques secondes que le loading disparaisse
2. Rechargez la page avec `Ctrl+Shift+R` (hard reload)
3. Vérifiez les logs pour voir si une erreur s'est produite

## 📊 Logs détaillés disponibles

Avec les améliorations apportées, vous verrez maintenant :

### Navigateur (Console)

**Chargement du SDK :**
- `📦 Loading VK ID SDK...`
- `🔗 Trying to load VK ID SDK from: [URL]`
- `✅ VK ID SDK script loaded successfully from: [URL]`
- `🔧 Initializing VK ID SDK with: [config]`

**Rendu du widget OneTap :**
- `🎨 Rendering VK ID OneTap widget...`
- `✅ VK ID OneTap widget rendered successfully`

**Authentification (après clic sur le widget) :**
- `✅ VK ID OneTap LOGIN_SUCCESS event received`
- `Payload: { code: "...", device_id: "...", ... }`
- `🔐 Processing VK ID OneTap authentication...`
- `Code (first 10 chars): ...`
- `🔄 Exchanging code for token...`
- `✅ Token received from VK ID`
- `🔄 Validating with backend...`
- `✅ Backend validation successful`
- `🔑 Setting Supabase session...`
- `✅ VK ID authentication complete`

**Erreurs :**
- `❌ [Description de l'erreur]`
- `Error name: [nom]`
- `Error message: [message détaillé]`
- `Error stack: [stack trace]`

### Serveur (Terminal)

**API Exchange :**
- `🔄 [VK Exchange] Received request`
- `🔧 [VK Exchange] Exchange parameters:`
- `📡 [VK Exchange] VK API response status: [status]`
- `✅ [VK Exchange] Received token data`
- `🔍 [VK Exchange] Fetching user info...`
- `✅ [VK Exchange] User info received:`

**Erreurs :**
- `❌ [Description de l'erreur]`
- Détails complets de la réponse VK API en cas d'erreur

## 🔄 Workflow de développement

### Modifier le code

1. Modifiez les fichiers VK ID :
   - `components/auth/VkIdButton.jsx`
   - `pages/auth/callback.js`
   - `pages/api/auth/vkid/exchange-code.js`
   - `pages/api/auth/vkid/validate.js`

2. Next.js recompile automatiquement (Hot Module Replacement)

3. Rechargez la page : `F5` ou `Ctrl+R`

4. Testez à nouveau l'authentification

### Tester rapidement

Pour gagner du temps, restez connecté avec VK dans un autre onglet. Ainsi :
- La connexion VK ID sera plus rapide (déjà authentifié)
- Pas besoin de ressaisir vos identifiants à chaque test

### Déboguer une erreur

1. Reproduisez l'erreur en local
2. Vérifiez les logs navigateur (console)
3. Vérifiez les logs serveur (terminal)
4. Identifiez l'étape qui échoue :
   - Chargement SDK ?
   - Initialisation ?
   - Redirection vers VK ?
   - Exchange de code ?
   - Validation backend ?
   - Création de session Supabase ?
5. Corrigez et retestez

## ✅ Checklist de test local

Avant de pusher en production, vérifiez :

- [ ] Le widget OneTap VK ID s'affiche sur `/ru/login`
- [ ] Le SDK VK ID se charge sans erreur
- [ ] Le widget OneTap se rend sans erreur
- [ ] Le clic sur le widget ouvre une popup (pas de redirection)
- [ ] L'authentification VK/OK/Mail.ru fonctionne dans la popup
- [ ] La popup se ferme après authentification
- [ ] L'événement LOGIN_SUCCESS est reçu avec code et device_id
- [ ] L'échange de code réussit (logs serveur)
- [ ] La récupération des infos utilisateur réussit
- [ ] La validation backend réussit
- [ ] La session Supabase est créée
- [ ] Redirection vers la page d'accueil réussie (depuis `/ru/login`, pas via `/auth/callback`)
- [ ] L'utilisateur est bien connecté (navbar affiche le profil)
- [ ] Le widget s'adapte au thème (testez dark/light mode)

## 🚨 Problèmes courants

### "This site can't be reached"

VK ID essaie de rediriger vers localhost mais l'URL n'est pas autorisée.

**Solution** : Vérifiez que `http://localhost:3000/auth/callback` est bien ajouté dans VK ID Console.

### "Access denied"

L'utilisateur VK refuse l'autorisation.

**Solution** : Normale si vous annulez. Retestez en acceptant.

### Session non créée

Après connexion, vous êtes redirigé mais pas authentifié.

**Causes** :
- Erreur lors de `supabase.auth.setSession()`
- Tokens invalides

**Vérifiez** :
- Logs navigateur : erreur lors de `setSession` ?
- Console Supabase : RLS policies OK ?
- `.env.local` : `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` corrects ?

## 🎯 Avantages du test local avec OneTap

✅ **Pas besoin de déployer** pour chaque modification
✅ **Logs détaillés** dans la console et le terminal
✅ **Hot reload** : changements de code visibles immédiatement
✅ **Débogage facile** avec breakpoints et DevTools
✅ **Itération rapide** : fix → test → fix en quelques secondes
✅ **Économie de temps** et de ressources Vercel
✅ **Test instantané** : Pas de redirection, authentification immédiate dans la popup
✅ **UX identique à la prod** : Le widget OneTap se comporte exactement pareil

## 📚 Ressources

- [VK ID Console](https://id.vk.com/)
- [Documentation VK ID](https://id.vk.com/about/business/go/docs/ru/vkid/latest/vk-id/intro/plan)
- [Guide de configuration principal](./VKID_SETUP.md)

---

**Prêt à tester en local ?** 🚀

1. ✅ Ajoutez `http://localhost:3000/auth/callback` dans VK ID Console
2. ✅ Lancez `npm run dev`
3. ✅ Ouvrez `http://localhost:3000/ru/login`
4. ✅ Ouvrez la console DevTools (F12)
5. ✅ Cliquez sur le bouton VK ID et observez les logs !

**Bonne chance !** 🎉
