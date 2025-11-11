# Configuration de VK ID (Authentification unifiée VK + OK + Mail.ru)

Ce guide explique comment configurer VK ID pour Linguami. VK ID est le système d'authentification unifié qui permet aux utilisateurs de se connecter avec **VKontakte**, **Odnoklassniki (OK)**, ou **Mail.ru** via un seul bouton.

## 🎯 Pourquoi VK ID ?

VK ID est la solution d'authentification moderne de VK qui remplace l'ancien OAuth 2.0. Avantages :

- ✅ **3 plateformes en 1** : VK (~100M), OK (~40M), Mail.ru (service email russe majeur)
- ✅ **SDK JavaScript officiel** : Intégration simplifiée et maintenue
- ✅ **UX moderne** : Widget élégant avec choix du provider
- ✅ **Meilleure couverture** : Touche plus d'utilisateurs russes qu'un seul provider

## 📋 Prérequis

- Un compte VK (VKontakte)
- Accès à [VK ID Console](https://id.vk.com/)

## 🔧 Configuration VK ID

### 1. Créer une application VK ID

1. Rendez-vous sur [VK ID Console](https://id.vk.com/about/business/go)
2. Cliquez sur **"Créer une application"** (Create App)
3. Remplissez les informations :
   - **Nom de l'application** : Linguami
   - **Type** : Site Web (Website)
   - **URL du site** : `https://www.linguami.com`

### 2. Configurer les paramètres

1. Dans les paramètres de votre application VK ID :
   - **Domaine autorisé** : `linguami.com`
   - **URL de redirection** : `https://www.linguami.com/auth/callback`

2. Pour le développement local, ajoutez aussi :
   - **Domaine local** : `localhost:3000`
   - **URL locale** : `http://localhost:3000/auth/callback`

### 3. Récupérer l'App ID

Dans le dashboard VK ID, notez votre **App ID** (identifiant de l'application).

## 🔑 Configuration des variables d'environnement

Ajoutez la variable suivante dans votre fichier `.env.local` et dans Vercel :

```bash
# VK ID Configuration
NEXT_PUBLIC_VK_APP_ID=votre_app_id
```

⚠️ **Important** : La variable doit commencer par `NEXT_PUBLIC_` car elle est utilisée côté client.

## 🎨 Ajouter le logo VK ID (optionnel)

Le composant VK ID utilise le SDK officiel qui affiche automatiquement le logo et l'interface VK. Si vous souhaitez un fallback personnalisé :

1. Téléchargez le logo VK depuis [VK Brand Assets](https://vk.com/brand)
2. Uploadez-le dans votre bucket R2 : `images/ui/vk.webp` (24x24 pixels, format WebP)

## 🔄 Architecture de l'authentification

### Flux d'authentification VK ID

```
1. User visite /ru/login (interface russe)
   ↓
2. VK ID SDK se charge et affiche le bouton
   ↓
3. User clique sur le bouton VK ID
   ↓
4. Widget VK ID s'ouvre (choix: VK, OK, ou Mail.ru)
   ↓
5. User choisit son provider et s'authentifie
   ↓
6. VK ID SDK retourne un token + user info
   ↓
7. Envoi des données à /api/auth/vkid/validate
   ↓
8. Backend valide le token avec l'API VK ID
   ↓
9. Création/connexion de l'utilisateur dans Supabase
   ↓
10. Génération de session Supabase
   ↓
11. Redirection vers la page d'accueil
```

### Composants créés

**Frontend :**
- `components/auth/VkIdButton.jsx` - Bouton VK ID avec SDK intégré
- `components/auth/OAuthButtons.jsx` - Intègre VK ID conditionnellement

**Backend :**
- `pages/api/auth/vkid/validate.js` - Valide le token et crée/connecte l'utilisateur

### Affichage conditionnel

Le bouton VK ID **n'apparaît que pour l'interface russe** (`router.locale === 'ru'`).

**Raison** : VK, OK et Mail.ru sont principalement utilisés en Russie et dans les pays de la CEI. Afficher ce bouton aux utilisateurs français/anglais surchargerait l'interface inutilement.

## 📊 Données récupérées de VK ID

Le SDK VK ID fournit :

- ✅ `user_id` - Identifiant unique de l'utilisateur
- ✅ `first_name` - Prénom
- ✅ `last_name` - Nom de famille
- ✅ `avatar` - Photo de profil (URL complète)
- ✅ `email` - Email (si l'utilisateur donne la permission)
- ✅ `provider` - Provider utilisé (`vk`, `ok`, ou `mail`)

### Gestion de l'email

Certains utilisateurs peuvent refuser de partager leur email. Dans ce cas :
- Email fictif généré : `{provider}_{user_id}@vkid-oauth.linguami.com`
- Exemple : `vk_12345@vkid-oauth.linguami.com`

### Gestion des utilisateurs existants

L'API route `/api/auth/vkid/validate` gère plusieurs cas :

1. **Utilisateur avec même provider ID** → Connexion automatique + mise à jour métadonnées
2. **Utilisateur avec même email** → Connexion + ajout provider ID
3. **Nouvel utilisateur** → Création compte + profil complet

### Stockage des métadonnées

Pour chaque utilisateur VK ID, on stocke dans `user_metadata` :

```javascript
{
  vk_id: "12345",              // Si provider = VK
  ok_id: "67890",              // Si provider = OK
  mail_id: "54321",            // Si provider = Mail.ru
  vkid_provider: "vk",         // Provider utilisé
  vkid_provider_id: "vk_12345", // ID complet avec prefix
  full_name: "Ivan Ivanov",
  avatar_url: "https://...",
  provider: "vkid_vk"          // Provider unifié
}
```

## 🧪 Tester l'authentification

### En local (développement)

1. Ajoutez `NEXT_PUBLIC_VK_APP_ID` dans `.env.local`
2. Lancez le serveur : `npm run dev`
3. Accédez à : `http://localhost:3000/ru/login` (interface russe requise)
4. Le bouton VK ID devrait apparaître en haut des options OAuth
5. Cliquez et testez avec un compte VK, OK ou Mail.ru

### En production

1. Ajoutez `NEXT_PUBLIC_VK_APP_ID` dans les variables d'environnement Vercel
2. Déployez votre application
3. Testez sur `https://www.linguami.com/ru/login`

## 🔐 Sécurité

### Validation du token

Le token VK ID est validé côté serveur via l'API officielle VK :
- Endpoint : `https://id.vk.com/oauth2/user_info`
- Vérification : User ID retourné correspond à celui fourni

### Protection des données

- ✅ Token échangé côté serveur uniquement
- ✅ Session Supabase générée de manière sécurisée
- ✅ Mot de passe aléatoire généré pour les comptes OAuth (non utilisé)
- ✅ Métadonnées chiffrées par Supabase

### GDPR & Suppression des données

Conforme GDPR. Lors de la suppression du compte :
- Via Settings → Supprimer mon compte
- Via révocation Facebook

**Données supprimées** :
- Métadonnées VK ID (`vk_id`, `ok_id`, `mail_id`, etc.)
- Profil utilisateur complet
- Toutes données d'apprentissage

Pour plus de détails, voir la politique de confidentialité.

## 🐛 Débogage

### Le bouton VK ID n'apparaît pas

**Vérifications** :
1. ✅ Interface en russe : `/ru/login` ou `/ru/signup`
2. ✅ `NEXT_PUBLIC_VK_APP_ID` configuré dans `.env.local`
3. ✅ Serveur redémarré après ajout de la variable
4. ✅ Ouvrir la console navigateur : erreurs SDK ?

### Le SDK VK ID ne se charge pas

**Causes possibles** :
- Bloqueur de publicités/trackers activé
- CORS bloquant le script CDN
- App ID invalide ou application VK ID désactivée

**Solution** :
1. Vérifier que le script se charge : DevTools → Network → `vkid.js`
2. Vérifier la console : erreurs d'initialisation du SDK
3. Vérifier l'App ID dans VK ID Console

### Erreur "Invalid token"

**Causes** :
- Token expiré (validité courte)
- App ID incorrect
- User ID ne correspond pas

**Solution** :
1. Vérifier les logs serveur dans `/api/auth/vkid/validate`
2. Confirmer que l'App ID est correct
3. Tester à nouveau la connexion

### Erreur "Failed to create user"

**Causes** :
- Erreur Supabase (vérifier RLS policies)
- `SUPABASE_SERVICE_ROLE_KEY` manquant ou incorrect
- Problème de connexion base de données

**Solution** :
1. Vérifier les logs Supabase
2. Confirmer que le service role key est configuré
3. Vérifier que les RLS policies permettent la création

## 🎨 Personnalisation du bouton

Le composant `VkIdButton.jsx` utilise le SDK officiel qui gère automatiquement :
- Design du bouton (adapté au thème dark/light)
- Logo VK ID
- Langue (russe par défaut)
- Widget de sélection du provider

Pour personnaliser :

```javascript
// Dans VkIdButton.jsx, méthode initVkId()

oneTap.render({
  container: buttonRef.current,
  scheme: isDark
    ? window.VKIDSDK.Scheme.DARK
    : window.VKIDSDK.Scheme.LIGHT,
  lang: window.VKIDSDK.Languages.RUS, // RUS, ENG, etc.
  styles: {
    width: '100%',
    height: 48,            // Hauteur du bouton
    borderRadius: 12,      // Coins arrondis
  },
})
```

## 📚 Ressources officielles

- [VK ID Documentation](https://id.vk.com/about/business/go)
- [VK ID SDK Documentation](https://id.vk.com/business/go/docs/ru/vkid/latest/vk-id/intro/plan)
- [VK ID Console](https://id.vk.com/)
- [VK Brand Assets](https://vk.com/brand)
- [API VK ID User Info](https://id.vk.com/oauth2/user_info)

## 📝 Différences avec OAuth classique VK

| Aspect | OAuth classique VK | VK ID (nouveau) |
|--------|-------------------|-----------------|
| **Providers** | VK uniquement | VK + OK + Mail.ru |
| **SDK** | Manuel (OAuth 2.0) | SDK JavaScript officiel |
| **Configuration** | Client ID + Secret | App ID uniquement (côté client) |
| **UX** | Redirection complète | Widget moderne |
| **Maintenance** | Plus complexe | Simplifié par SDK |
| **Recommandé** | ❌ Ancien système | ✅ Solution actuelle |

## ✅ Checklist de configuration

- [ ] Compte VK créé
- [ ] Application VK ID créée sur [id.vk.com](https://id.vk.com/)
- [ ] Domaine `linguami.com` ajouté aux domaines autorisés
- [ ] URL de redirection configurée
- [ ] App ID récupéré
- [ ] `NEXT_PUBLIC_VK_APP_ID` ajouté à `.env.local`
- [ ] Serveur redémarré
- [ ] Testé en local avec interface russe (`/ru/login`)
- [ ] `NEXT_PUBLIC_VK_APP_ID` ajouté à Vercel
- [ ] Testé en production

## 🎉 Fonctionnalités

Une fois configuré, VK ID permet :

- ✅ Connexion avec VKontakte (~100M utilisateurs)
- ✅ Connexion avec Odnoklassniki (~40M utilisateurs)
- ✅ Connexion avec Mail.ru (email russe populaire)
- ✅ Création automatique de compte si nouvelle connexion
- ✅ Connexion automatique si compte existant
- ✅ Synchronisation des métadonnées (nom, avatar, email)
- ✅ Session Supabase complète et sécurisée
- ✅ Conforme GDPR

**Résultat** : Couverture maximale des utilisateurs russes avec une seule intégration ! 🚀
