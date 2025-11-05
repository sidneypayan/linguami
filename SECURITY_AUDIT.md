# 🔒 Audit de Sécurité - Linguami

*Généré le 05/11/2025*

## 📊 Vue d'ensemble des tables

### Tables identifiées dans le code :

**Tables utilisateurs (nécessitent RLS strict) :**
- `users_profile` ✅ Sécurisée (vue `public_users_profile`)
- `user_xp_profile`
- `user_materials`
- `user_words`
- `user_lessons`
- `user_goals`
- `email_verification_tokens` ✅ Sécurisée

**Tables de contenu (lecture publique) :**
- `materials`
- `books`
- `h5p`
- `lessons`

**Tables de tracking (lecture privée) :**
- `weekly_xp_tracking`
- `monthly_xp_tracking`
- `xp_transactions`
- `xp_rewards_config`

**Tables système :**
- `guest_translation_tracking` (géré côté serveur avec service_role)

**Vues SQL sécurisées :**
- `public_users_profile` ✅ Sans colonnes sensibles
- `leaderboard_view` ✅ Pour classements

---

## 🚨 Points de sécurité critiques à vérifier

### 1. ✅ APIs avec authentification

**Toutes les APIs critiques vérifient l'authentification :**

```javascript
// ✅ Bon exemple dans /api/goals, /api/xp/add, /api/leaderboard
const { data: { user }, error: authError } = await supabase.auth.getUser()
if (!user || authError) {
    return res.status(401).json({ error: 'Unauthorized' })
}
```

**APIs authentifiées :**
- `/api/goals` ✅
- `/api/xp/add` ✅
- `/api/leaderboard` ✅
- `/api/statistics` ✅
- `/api/admin/*` (à vérifier - devrait checker le rôle admin)

---

### 2. ⚠️ Clé API Yandex exposée dans le code

**Fichier :** `pages/api/translations/translate.js:209`

```javascript
const url =
    `https://dictionary.yandex.net/api/v1/dicservice.json/lookup` +
    `?key=dict.1.1.20180305T123901Z.013e5aa10ad8d371.11feed250196fcfb1631d44fbf20d837c8c1e072` +
    ...
```

⚠️ **Problème :** La clé API Yandex est hardcodée dans le code source

**Risque :**
- Si le repo est public ou fuité, la clé peut être utilisée par d'autres
- Dépassement de quota possible

**Solution recommandée :**
```javascript
// Dans .env.local
YANDEX_DICT_API_KEY=dict.1.1...

// Dans le code
const url =
    `https://dictionary.yandex.net/api/v1/dicservice.json/lookup` +
    `?key=${process.env.YANDEX_DICT_API_KEY}` +
    ...
```

---

### 3. ⚠️ RLS à vérifier sur les tables user_*

**Tables sans RLS vérifiées :**
- `user_materials` - Les utilisateurs peuvent-ils voir les matériaux des autres ?
- `user_words` - Les utilisateurs peuvent-ils voir les mots des autres ?
- `user_lessons` - Les utilisateurs peuvent-ils voir les leçons des autres ?
- `user_goals` - Les utilisateurs peuvent-ils voir les objectifs des autres ?
- `user_xp_profile` - Les utilisateurs peuvent-ils voir les XP des autres ?

**Politiques RLS recommandées pour toutes les tables user_* :**

```sql
-- Exemple pour user_words (à adapter pour chaque table)
ALTER TABLE public.user_words ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir uniquement leurs propres données
CREATE POLICY "Users can view own data"
    ON public.user_words
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Les utilisateurs peuvent insérer uniquement leurs propres données
CREATE POLICY "Users can insert own data"
    ON public.user_words
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent modifier uniquement leurs propres données
CREATE POLICY "Users can update own data"
    ON public.user_words
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer uniquement leurs propres données
CREATE POLICY "Users can delete own data"
    ON public.user_words
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Service role a accès complet
CREATE POLICY "Service role has full access"
    ON public.user_words
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
```

---

### 4. ⚠️ Tables de contenu public (materials, books, h5p, lessons)

**À vérifier :**
- Ces tables doivent être lisibles par tous (authentifiés + anonymes)
- Seuls les admins devraient pouvoir les modifier

**Politiques RLS recommandées :**

```sql
-- Exemple pour materials
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire
CREATE POLICY "Anyone can view materials"
    ON public.materials
    FOR SELECT
    TO public
    USING (true);

-- Seuls les admins peuvent modifier
CREATE POLICY "Only admins can modify materials"
    ON public.materials
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users_profile
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Service role a accès complet
CREATE POLICY "Service role has full access"
    ON public.materials
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
```

---

### 5. ⚠️ user_xp_profile - Attention au leaderboard

**État actuel :**
- L'API `/api/leaderboard` utilise `leaderboard_view` ✅
- Mais elle query aussi directement `user_xp_profile` pour les rangs

**Ligne 166-196 dans leaderboard/index.js :**
```javascript
const { data: userProfile } = await supabase
    .from('user_xp_profile')
    .select('total_xp, daily_streak, total_gold, current_level')
    .eq('user_id', user.id)
    .single()

// Puis calcul des rangs avec .gt() sur user_xp_profile
```

**Question :** Les utilisateurs peuvent-ils accéder à tous les profils XP ou seulement le leur ?

**RLS recommandé pour user_xp_profile :**
```sql
-- Variante 1 : Accès public en lecture (pour leaderboard côté client)
CREATE POLICY "Anyone can view XP profiles"
    ON public.user_xp_profile
    FOR SELECT
    TO public
    USING (true);

-- OU Variante 2 : Accès privé (uniquement via API backend)
CREATE POLICY "Users can view own XP profile"
    ON public.user_xp_profile
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
```

**⚠️ IMPORTANT :** Si vous choisissez la variante 2, l'API `/api/leaderboard` devra utiliser `service_role` pour calculer les rangs.

---

### 6. ⚠️ APIs Admin - Vérifier le rôle

**Fichiers concernés :**
- `pages/api/admin/update-video.js`
- `pages/api/admin/check-videos.js`
- `pages/admin/*.js`

**À vérifier :**
```javascript
// Ligne 44 dans update-video.js
const { data: userData } = await supabase
    .from('users_profile')
    .select('role')
    .eq('id', user.id)
    .single()

// Vérifier le rôle admin
if (userData?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden - Admin only' })
}
```

✅ **Bon signe :** Les APIs admin vérifient déjà le rôle !

Mais à vérifier : **Toutes** les APIs admin font-elles cette vérification ?

---

### 7. ✅ guest_translation_tracking - Bien géré

**Sécurité :**
- RLS désactivée (table gérée uniquement côté serveur)
- API utilise `service_role` pour bypasser RLS
- Double vérification : cookie + IP

✅ **Correct** - Aucune action nécessaire

---

### 8. ⚠️ xp_rewards_config et xp_transactions

**Tables sensibles :**
- `xp_rewards_config` - Configuration des récompenses XP/Gold
- `xp_transactions` - Historique des gains XP/Gold

**RLS recommandé :**

```sql
-- xp_rewards_config : Lecture publique, modification admin uniquement
ALTER TABLE public.xp_rewards_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view XP config"
    ON public.xp_rewards_config
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Only admins can modify XP config"
    ON public.xp_rewards_config
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users_profile
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- xp_transactions : Lecture privée (uniquement ses propres transactions)
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
    ON public.xp_transactions
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users cannot modify transactions"
    ON public.xp_transactions
    FOR INSERT
    TO authenticated
    WITH CHECK (false); -- Aucun utilisateur ne peut insérer directement

CREATE POLICY "Service role has full access"
    ON public.xp_transactions
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
```

⚠️ **Note :** L'API `/api/xp/add` utilise `anon_key`, ce qui signifie qu'elle peut insérer dans `xp_transactions` via le role `authenticated`. C'est OK si les RLS permettent l'INSERT pour l'utilisateur connecté.

---

## 📋 Checklist de sécurité

### Priorité HAUTE 🔴

- [x] **Déplacer la clé API Yandex dans .env.local** ✅
- [x] **Vérifier les RLS sur user_materials** ✅ Sécurisé
- [x] **Vérifier les RLS sur user_words** ✅ Sécurisé
- [x] **Vérifier les RLS sur user_lessons** ✅ Sécurisé
- [x] **Vérifier les RLS sur user_goals** ✅ Sécurisé
- [x] **Vérifier les RLS sur user_xp_profile** ✅ Sécurisé

### Priorité MOYENNE 🟡

- [x] **Vérifier les RLS sur materials (lecture publique)** ✅ OK
- [x] **Vérifier les RLS sur books (lecture publique)** ✅ OK
- [x] **Vérifier les RLS sur h5p (lecture publique)** ✅ OK
- [x] **Vérifier les RLS sur lessons (lecture publique)** ✅ OK
- [x] **Vérifier les RLS sur xp_rewards_config** ✅ OK
- [x] **Vérifier les RLS sur xp_transactions** ✅ Sécurisé

### Priorité BASSE 🟢

- [ ] **Vérifier les RLS sur weekly_xp_tracking**
- [ ] **Vérifier les RLS sur monthly_xp_tracking**
- [ ] **Audit complet des APIs admin (vérification du rôle)**
- [ ] **Ajouter rate limiting sur les APIs publiques**
- [ ] **Audit des Edge Functions Supabase**

---

## 🛡️ Recommandations générales

### 1. Principe du moindre privilège
- Les utilisateurs ne doivent voir que **leurs propres données**
- Les données publiques doivent être **en lecture seule**
- Les modifications doivent être **restreintes aux admins**

### 2. Toujours utiliser RLS
- **Toutes** les tables doivent avoir RLS activé
- Ne jamais se fier uniquement à la logique côté application
- RLS = dernière ligne de défense

### 3. Variables d'environnement
- **Aucune** clé API dans le code source
- Utiliser `.env.local` (git ignored)
- Vérifier `.gitignore` contient bien `.env.local`

### 4. Rate limiting
- Implémenter un rate limiting sur les APIs publiques
- Protéger contre les abus (brute force, spam, etc.)

### 5. Logs et monitoring
- Garder les `console.error` en production
- Monitorer les tentatives d'accès non autorisé
- Alertes sur les comportements suspects

---

## 🔍 Comment tester la sécurité RLS

### Test 1 : Accès aux données d'un autre utilisateur

```javascript
// Dans la console du navigateur (en tant qu'utilisateur connecté)
const { data, error } = await supabase
    .from('user_words')
    .select('*')
    .neq('user_id', 'VOTRE_USER_ID') // Essayer d'accéder aux données d'un autre
    .limit(1)

console.log('🔍 Test RLS:', data)
// ✅ Attendu : data = [] (vide) ou error
// ❌ Problème : data contient des données d'autres users
```

### Test 2 : Modification de données d'un autre utilisateur

```javascript
// Essayer de modifier les données d'un autre utilisateur
const { error } = await supabase
    .from('user_goals')
    .update({ target_xp: 999999 })
    .eq('user_id', 'AUTRE_USER_ID')

console.log('🔍 Test modification:', error)
// ✅ Attendu : error (permission denied)
// ❌ Problème : pas d'erreur (modification réussie)
```

### Test 3 : Accès anonyme aux données sensibles

```javascript
// Se déconnecter, puis dans la console
const { data, error } = await supabase
    .from('users_profile')
    .select('email, email_verified')
    .limit(10)

console.log('🔍 Test anonyme:', data)
// ✅ Attendu : error ou data = []
// ❌ Problème : data contient des emails
```

---

## 📊 État actuel de la sécurité

**Tests effectués le 05/11/2025** ✅

| Table | RLS Activé | Politiques | État |
|-------|-----------|-----------|------|
| users_profile | ✅ | Restrictif | ✅ Sécurisé |
| email_verification_tokens | ✅ | Restrictif | ✅ Sécurisé |
| public_users_profile (vue) | N/A | Vue SQL | ✅ Sécurisé |
| leaderboard_view (vue) | N/A | Vue SQL | ✅ Sécurisé |
| **user_xp_profile** | ✅ | **Restrictif** | **✅ Sécurisé** |
| **user_materials** | ✅ | **Restrictif** | **✅ Sécurisé** |
| **user_words** | ✅ | **Restrictif** | **✅ Sécurisé** |
| **user_lessons** | ✅ | **Restrictif** | **✅ Sécurisé** |
| **user_goals** | ✅ | **Restrictif** | **✅ Sécurisé** |
| **materials** | ✅ | **Public (lecture)** | **✅ Accessible publiquement** |
| **books** | ✅ | **Public (lecture)** | **✅ Accessible publiquement** |
| h5p | ✅ | Public (lecture) | ✅ OK (table vide/inexistante) |
| **lessons** | ✅ | **Public (lecture)** | **✅ Accessible publiquement** |
| **xp_rewards_config** | ✅ | **Public (lecture)** | **✅ Accessible publiquement** |
| **xp_transactions** | ✅ | **Restrictif** | **✅ Sécurisé** |
| guest_translation_tracking | ❌ | Service role | ✅ OK |

### 🎉 Résultat : Sécurité EXCELLENTE

**Toutes les tables testées sont correctement protégées :**
- ✅ Les utilisateurs ne peuvent PAS accéder aux données des autres utilisateurs
- ✅ Les tables de contenu sont lisibles publiquement (comportement attendu)
- ✅ Les transactions XP sont privées (chaque utilisateur voit uniquement les siennes)

---

## 🎯 Prochaines étapes recommandées

**✅ Actions prioritaires complétées :**
1. ✅ **Clé Yandex sécurisée** : Déplacée dans .env.local
2. ✅ **RLS vérifiées** : Toutes les tables testées et sécurisées

**🟢 Actions optionnelles (amélioration continue) :**
1. **Ajouter la clé Yandex à ton .env.local** : N'oublie pas d'ajouter `YANDEX_DICT_API_KEY=ta_clé` dans ton fichier local
2. **Tester en production** : S'assurer que tout fonctionne après les changements
3. **Monitorer** : Activer les logs Supabase pour détecter les tentatives d'accès non autorisé
4. **Rate limiting** : Ajouter un rate limiting sur les APIs publiques (anti-abus)
5. **Audit des APIs admin** : Vérifier que toutes les routes `/api/admin/*` vérifient le rôle admin

---

*Fin de l'audit de sécurité*
