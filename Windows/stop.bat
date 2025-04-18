#!/bin/bash
# Vérifier si localhost:9000 est ouvert et utilisé actuellement. 
# lsof = List Open Files = permet de regarder les fichiers ouverts par un processus.
# Fait la boucle à l'infini tout aussi longtemps que le port est utilisé.

while lsof -i :9000 > /dev/null; do
  sleep 1
done

# Arrêter les conteneurs
docker-compose down