#!/bin/bash

# Vérifie si PHP est installé
if ! command -v php &> /dev/null; then
    echo "PHP n'est pas installé."
    echo "Installez-le avec : sudo apt install php (ou équivalent)"
    read -p "Appuyez sur Entrée pour quitter..."
    exit 1
fi

echo "PHP est installé. Lancement du serveur..."
# Ouvre l'URL dans le navigateur
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:9000 &> /dev/null
elif command -v open &> /dev/null; then
    open http://localhost:9000
else
    echo "Impossible d'ouvrir le navigateur automatiquement. Ouvrez http://localhost:9000 manuellement."
fi

# Lance le serveur PHP
php -S localhost:9000 &

# Attend que l'utilisateur ferme le navigateur
read -p "Appuyez n'importe quelle touche pour arreter le serveur apres avoir ferme le navigateur..."

# Arrête le serveur PHP
echo "Arrêt du serveur PHP..."
pkill -f "php -S localhost:9000" &> /dev/null
if [ $? -eq 0 ]; then
    echo "Serveur PHP arrêté."
else
    echo "Erreur lors de l'arrêt du serveur PHP."
fi

echo "Terminé."
exit 0
# Fin du script
# Ce script lance un serveur PHP sur localhost:9000 et ouvre l'URL dans le navigateur par défaut.
# Il attend que l'utilisateur ferme le navigateur avant d'arrêter le serveur.
# Assurez-vous que le script a les permissions d'exécution :
# chmod +x serverLaunchLinuxMac.sh
# Vous pouvez l'exécuter avec :
# ./serverLaunchLinuxMac.sh
# Note : Ce script est conçu pour les systèmes Linux et Mac. Pour Windows, utilisez serverLaunchWindows.bat.
