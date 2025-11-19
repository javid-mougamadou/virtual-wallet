# Docker Setup pour Virtual Wallet

## Fichiers Docker disponibles

- `Dockerfile` - Configuration multi-stage pour développement et production
- `docker-compose.yml` - Configuration pour le développement local
- `.dockerignore` - Fichiers à exclure lors du build Docker
- `nginx.conf` - Configuration Nginx pour la production

## Utilisation

### Développement avec Docker Compose

Pour démarrer l'environnement de développement :

```bash
docker compose up -d
```

Pour accéder au conteneur et installer les dépendances :

```bash
docker compose exec web npm install
```

Pour démarrer le serveur de développement :

```bash
docker compose exec web npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Build de production

Pour construire l'image de production :

```bash
docker build --target production -t virtual-wallet:latest .
```

Pour lancer le conteneur de production :

```bash
docker run -p 80:80 virtual-wallet:latest
```

L'application sera accessible sur `http://localhost`

## Commandes utiles

- Arrêter les conteneurs : `docker compose down`
- Voir les logs : `docker compose logs -f web`
- Reconstruire les images : `docker compose build --no-cache`
