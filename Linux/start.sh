#!/bin/bash

# Rendre les scripts exécutables
chmod +x start.sh stop.sh

# Construire et démarrer les conteneurs
docker-compose build
docker-compose up -d

# Ouvrir le navigateur
xdg-open http://localhost:9000 || start http://localhost:9000 || open http://localhost:9000