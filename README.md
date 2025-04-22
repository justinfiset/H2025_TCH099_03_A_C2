# BSP-Web-Terminal <sub>V1</sub>

![alt text](/ressources/image/image.png)

-   ## L'utilité en bref du terminal :

    **Bash Space Program** est un jeu de survie sous haute tension inspiré de _Keep Talking and Nobody Explodes_.  
    Vous incarnez un astronaute isolé à bord d’une station spatiale en perdition. Votre seul espoir ? Résoudre une série de pannes techniques dans un temps limité pour maintenir les systèmes vitaux en fonctionnement.

    Le gameplay repose sur la rapidité, la logique et la prise de décisions critiques dans un environnement hostile… et silencieux.

    Le terminal sert d'outil au jeu. Il permet au joueur de chercher des instructions,
    pour aider le joueur qui est sur l'application de bureau.

---

-   ## Contexte du projet :

    Ce projet a été réalisé dans le cadre du **projet intégrateur** du **programme CUT (Cheminement universitaire en technologie)** à l’**ÉTS (École de technologie supérieure)** de Montréal.

---

-   ## 🛠️ Technologies utilisées

    -   CSS (Stylisé)
    -   Javascipt (Dynamiste et la communication)
    -   Docker (Pour php)
    -   PHP (Serveur Interne)
    -   HTML (Interface)

---

-   ## Un peu de contexte :

    L'être qui se cache derrière un terminal de BSP, va devoir y rester jusqu'à temps que le capitaine réussisse sa mission. Cette mission est capitale pour l'humanité, car elle exige la plus haute des concentrations. Chaque seconde compte pour le capitaine, surtout qu'il a perdu son équipage assez rapidement à cause de problème technique. Cet être qui vit que pour la réussite de la mission est sans aucun doute un héro. Gloire à BSP. Gloire à l'avancement de l'humanité.

-   ## Équipe

    -   [Justin Fiset](https://github.com/justinfiset)
    -   [Aymerik Blais](https://github.com/Merisiel0)
    -   [Tristan Clouthier](https://github.com/triflash1)
    -   [Rémi Cloutier](https://github.com/RemiCloutier)
    -   [Aimé Melançon](https://github.com/AimeMelancon)

---

-   ## Installation

    1. Clonez les dépôts souhaités.
    2. Lancez l’API et le client web (instructions dans leurs propres README).
    3. Ouvrez le projet Unity avec l’éditeur ou utilisez le build précompilé dans _BSP.zip_.
    4. Appuyez sur Play pour tester en local.

    ### Guide d'installation du client web (avec Docker) après clonage du dépôt

    1. Installez Docker Desktop en suivant les instructions ici : [Docker](https://docs.docker.com/get-started/introduction/get-docker-desktop/).
    2. Ouvrez Docker et laissez-le en arrière-plan.
    3. Clonez ce dépôt sur votre machine locale et ouvrez le dossier contenant les fichiers.
    4. Selon votre système d'exploitation, accédez au répertoire :
        - [Windows](./Windows/)
        - [Linux/Mac](./Linux/)
    5. Exécutez le fichier `start` pour :
        - Construire et lancer les conteneurs Docker.
        - Ouvrir le client web automatiquement dans votre navigateur à l'adresse `http://localhost:9000`.
    6. Fermez la page du client web, puis exécutez le fichier `stop` pour arrêter les conteneurs Docker.

    **Remarque<sub>1</sub>** : Sous Linux/MacOS, rendez les scripts exécutables avec :

    ```bash
    chmod +x start stop
    ```

    **Remarque<sub>2</sub>** : Veuillez autoriser les pop-ups pour avoir l'expérience totale du client web.

    ### Guide d'installation du client web (avec PHP) après clonage du dépôt

    1. Insaller PHP en suivant les instructions ici : [PHP](https://www.php.net/downloads.php)
    2. Clonez ce dépôt sur votre machine locale et ouvrez le dossier contenant les fichiers.
    3. Selon votre système d'exploitation, exécuter le bon fichier :
        - [Windows](serverLaunchWindow.bat)
        - [Linux/Mac](serverLaunchLinuxMac.sh)
    4. Fermez la page du client web, puis appuyer dans l'invite de commande n'importe quel touche pour arrêter l'application web.

    **Remarque<sub>1</sub>** : Sous Linux/MacOS, rendez le script avec :

    ```bash
    chmod +x serverLaunchLinuxMac
    ```
    **Remarque<sub>2</sub>** : Veuillez autoriser les pop-ups pour avoir l'expérience totale du client web.
---

-   ## Structure du projet

    Le projet est composé de **trois parties** :

    ### 🎮 Jeu Unity (client principal)

    Développé avec Unity, ce client représente la station spatiale et son interface de survie. Le joueur y interagit avec divers modules et systèmes critiques.

    🔗 Dépôt GitHub : [Application Client - Bash Space Program](https://github.com/Merisiel0/H2025_TCH099_03_A_C1)

    ### 🌐 Client web (assistant à distance)

    Ce client permet à une personne externe d’aider l’astronaute en temps réel en accédant à la documentation pour résoudre les différents modules du vaisseau.

    🔗 Dépôt GitHub : Vous êtes déjà au bon endroit !

    ### 🧠 API

    Une API centralise les événements du jeu tels que les modules, leurs solutions respectives et les utilisateurs (notamment les administrateurs).

    🔗 Dépôt GitHub : [API - Bash Space Program](https://github.com/AimeMelancon/H2025_TCH099_03_A_API)

---

-   ## 📜 Licence

    Ce projet a été développé à des fins académiques dans le cadre de l’ÉTS. Toute réutilisation ou publication externe nécessite l’accord des auteurs.
