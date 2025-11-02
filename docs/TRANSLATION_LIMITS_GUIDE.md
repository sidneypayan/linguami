# Guide : Système de Limite de Traductions Sécurisé

## 📋 Vue d'ensemble

Ce système empêche les utilisateurs non authentifiés de contourner la limite de traductions gratuites en utilisant **le tracking côté serveur par adresse IP**.

### Caractéristiques
- ✅ **20 traductions gratuites** par utilisateur invité
- ✅ **Tracking par IP** (impossible à contourner via la console)
- ✅ **Reset automatique** après 24 heures
- ✅ **Aucune limite** pour les utilisateurs connectés
- ✅ **Sécurisé** : toute la logique est côté serveur

---

## 🚀 Installation

### 1. Créer la table Supabase

Exécutez le script SQL dans le dashboard Supabase :

```bash
# Le fichier de migration se trouve dans :
supabase/migrations/create_guest_translation_limits.sql
```

**Ou via l'éditeur SQL Supabase :**

1. Allez dans votre projet Supabase
2. Cliquez sur "SQL Editor"
3. Copiez-collez le contenu de `create_guest_translation_limits.sql`
4. Exécutez la requête

### 2. Ajouter la variable d'environnement

Dans votre fichier `.env.local`, ajoutez :

```env
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici
```

> **Note:** La service role key se trouve dans Supabase → Settings → API → service_role key

### 3. Démarrer l'application

```bash
npm run dev
```

---

## 🧪 Comment Tester

### Test 1 : Vérifier le compteur (mode invité)

1. **Ouvrez l'application sans vous connecter**
2. **Allez sur un matériel** et cliquez sur des mots
3. **Observez le badge** qui affiche : "X traductions restantes sur 20"
4. **Chaque clic** décrémente le compteur

### Test 2 : Tenter de contourner via localStorage (ÉCHEC)

Ouvrez la console navigateur (F12) et essayez :

```javascript
// ❌ Cela ne marchera PLUS
localStorage.removeItem('guest_translation_count')
localStorage.setItem('guest_translation_count', '0')

// Le compteur est maintenant côté serveur, donc ces commandes n'ont aucun effet
```

### Test 3 : Atteindre la limite

**Option A : Cliquer 20 fois** (lent)

**Option B : Utiliser l'API directement** (pour dev/test)

```bash
# Simuler 20 traductions
for i in {1..20}; do
  curl -X POST http://localhost:3000/api/translations/translate \
    -H "Content-Type: application/json" \
    -d '{
      "word": "test",
      "sentence": "test sentence",
      "userLearningLanguage": "ru",
      "locale": "fr",
      "isAuthenticated": false
    }'
done
```

**Résultat attendu :**
- Après 20 traductions : message "Limite atteinte"
- Popup rouge avec bouton "Créer un compte"

### Test 4 : Vérifier le reset automatique (24h)

Pour tester le reset sans attendre 24h, modifiez temporairement la table :

```sql
-- Dans Supabase SQL Editor
UPDATE guest_translation_limits
SET reset_at = NOW() - INTERVAL '1 second'
WHERE ip_address = 'votre_ip';

-- Puis faites une nouvelle traduction
-- Le compteur devrait être reseté à 1
```

### Test 5 : Utilisateur connecté (aucune limite)

1. **Connectez-vous** avec un compte
2. **Cliquez sur des mots**
3. **Vérifiez** : pas de compteur affiché, pas de limite

---

## 🔍 Vérifier les Données

### Via Supabase Dashboard

1. Allez dans **Table Editor**
2. Sélectionnez `guest_translation_limits`
3. Vous verrez :
   - `ip_address` : L'IP de l'utilisateur
   - `translation_count` : Nombre de traductions effectuées
   - `reset_at` : Date de reset du compteur

### Via SQL

```sql
-- Voir toutes les entrées
SELECT * FROM guest_translation_limits;

-- Voir seulement les IPs proches de la limite
SELECT ip_address, translation_count, reset_at
FROM guest_translation_limits
WHERE translation_count >= 18
ORDER BY translation_count DESC;

-- Compter combien d'IPs ont atteint la limite
SELECT COUNT(*)
FROM guest_translation_limits
WHERE translation_count >= 20;
```

---

## 🛠️ Maintenance

### Nettoyer les anciennes entrées

Le script de migration inclut une fonction de nettoyage. Pour l'exécuter :

```sql
SELECT cleanup_old_translation_limits();
```

Ou configurez un **cron job** dans Supabase pour l'exécuter automatiquement chaque semaine.

### Reset manuel d'une IP

```sql
-- Reset une IP spécifique
DELETE FROM guest_translation_limits
WHERE ip_address = '123.456.789.012';

-- Ou reset le compteur sans supprimer
UPDATE guest_translation_limits
SET translation_count = 0,
    reset_at = NOW() + INTERVAL '24 hours'
WHERE ip_address = '123.456.789.012';
```

---

## 🔒 Sécurité

### Pourquoi c'est sécurisé ?

1. **Tracking par IP côté serveur**
   - L'IP est extraite de la requête HTTP
   - Impossible à falsifier depuis le navigateur
   - Gère les proxies/load balancers (x-forwarded-for, cf-connecting-ip)

2. **Validation en amont**
   - L'API vérifie la limite AVANT de faire l'appel à Yandex
   - Retourne une erreur 429 si limite atteinte

3. **Pas de confiance côté client**
   - localStorage est conservé uniquement pour l'UX (affichage)
   - La vraie validation se fait côté serveur

### Limitations connues

- **VPN/IP partagée** : Les utilisateurs derrière la même IP partagent la limite
- **Solution** : Encourager la création de compte pour une expérience illimitée

---

## 📊 Monitoring

### Créer des alertes

Dans Supabase, vous pouvez créer des webhooks pour être alerté quand :
- Beaucoup d'IPs atteignent la limite (abuse potentiel)
- Une IP fait trop de requêtes trop rapidement

### Metrics utiles

```sql
-- Nombre d'utilisateurs invités par tranche de traductions
SELECT
  CASE
    WHEN translation_count BETWEEN 0 AND 5 THEN '0-5'
    WHEN translation_count BETWEEN 6 AND 10 THEN '6-10'
    WHEN translation_count BETWEEN 11 AND 15 THEN '11-15'
    WHEN translation_count BETWEEN 16 AND 19 THEN '16-19'
    WHEN translation_count >= 20 THEN '20+'
  END as range,
  COUNT(*) as count
FROM guest_translation_limits
GROUP BY range
ORDER BY range;
```

---

## ❓ FAQ

**Q: Que se passe-t-il si je change d'IP ?**
R: Vous obtenez 20 nouvelles traductions (nouveau compteur)

**Q: Puis-je augmenter la limite de 20 traductions ?**
R: Oui, modifiez `MAX_GUEST_TRANSLATIONS` dans `/api/translations/translate.js`

**Q: Combien de temps les données sont conservées ?**
R: La fonction de nettoyage supprime les entrées de plus de 30 jours

**Q: Ça marche avec Cloudflare/Vercel ?**
R: Oui, l'API détecte automatiquement l'IP via les headers `cf-connecting-ip` et `x-forwarded-for`

---

## 🎯 Prochaines Améliorations

- [ ] Rate limiting plus agressif (ex: max 5 traductions/minute)
- [ ] Système de captcha après plusieurs tentatives
- [ ] Analytics des traductions les plus demandées
- [ ] Cache des traductions populaires

---

**Créé le :** 2025-01-XX
**Version :** 1.0
**Auteur :** Claude Code
