# Configuration Google Analytics pour Virtual Wallet

## ✅ Configuration déjà en place

Le projet Virtual Wallet inclut déjà une configuration complète de Google Analytics avec les éléments suivants :

### Fichiers de configuration

1. **`src/utils/analytics.ts`** - Fonctions utilitaires pour Google Analytics
   - `initGA()` - Initialise Google Analytics (seulement en production)
   - `trackPageView()` - Suit les vues de page
   - `trackEvent()` - Suit les événements personnalisés
   - `isGAAvailable()` - Vérifie si GA est disponible

2. **`src/hooks/useAnalytics.ts`** - Hooks React pour utiliser Google Analytics
   - `useAnalytics()` - Hook pour suivre les événements
   - `usePageTracking()` - Hook pour suivre les vues de page

3. **`src/main.tsx`** - Initialisation de Google Analytics au démarrage de l'application

### Configuration dans l'application

- ✅ Initialisation automatique de Google Analytics dans `main.tsx`
- ✅ Tracking de page view pour la page d'accueil
- ✅ Tracking d'événements personnalisés pour :
  - Changement de thème (`theme_changed`)
  - Création de cagnotte (`cagnotte_created`)
  - Modification de cagnotte (`cagnotte_edited`)
  - Suppression de cagnotte (`cagnotte_deleted`)
  - Ajout d'entrée (`entry_added`)
  - Suppression d'entrée (`entry_deleted`)

### Dépendance

- ✅ `react-ga4` (version ^2.1.0) déjà installé dans `package.json`

## Configuration requise

Pour activer Google Analytics, vous devez :

1. **Créer un fichier `.env`** à la racine du projet avec :
   ```bash
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

2. **Remplacer `G-XXXXXXXXXX`** par votre ID de mesure Google Analytics (GA4). Vous pouvez le trouver dans votre compte [Google Analytics](https://analytics.google.com/) sous Admin → Data Streams.

## Fonctionnement

### Mode développement vs production

- **En développement** (`npm run dev`) : Google Analytics est **désactivé** pour ne pas polluer vos données avec du trafic de test
- **En production** (`npm run build`) : Google Analytics est **activé** automatiquement si `VITE_GA_MEASUREMENT_ID` est défini

### Debugging

Vous pouvez vérifier le fonctionnement de Google Analytics en ouvrant la console du navigateur. Vous verrez des messages avec le préfixe `[GA Debug]` qui indiquent :
- Si Google Analytics est initialisé
- Si les événements sont envoyés
- Les erreurs éventuelles

## Événements trackés

L'application track automatiquement les événements suivants :

| Événement | Paramètres | Description |
|-----------|------------|-------------|
| `theme_changed` | `theme` | Changement entre mode clair/sombre |
| `cagnotte_created` | `cagnotte_name`, `target_amount`, `total_cagnottes` | Création d'une nouvelle cagnotte |
| `cagnotte_edited` | `cagnotte_id`, `cagnotte_name` | Modification d'une cagnotte |
| `cagnotte_deleted` | `cagnotte_id`, `cagnotte_name` | Suppression d'une cagnotte |
| `entry_added` | `cagnotte_id`, `entry_type`, `amount`, `has_label` | Ajout d'une dépense ou recette |
| `entry_deleted` | `entry_id`, `cagnotte_id`, `entry_type` | Suppression d'une entrée |

## Notes importantes

- Google Analytics fonctionne uniquement en **production** pour éviter de polluer vos statistiques
- Le fichier `.env` doit être créé manuellement (il n'est pas dans le dépôt Git)
- Pour la production, la variable d'environnement doit être définie dans votre plateforme de déploiement (ex: GitHub Actions, Vercel, etc.)


