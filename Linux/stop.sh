#!/bin/bash
# Vérifier si localhost:9000 est ouvert
while lsof -i :9000 > /dev/null; do
  sleep 1
done

# Arrêter les conteneurs
docker-compose down