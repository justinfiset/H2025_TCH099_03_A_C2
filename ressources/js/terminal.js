let inputText = ""; // Le texte entré par l'utilisateur
let inputPrefix = ""; // Le préfixe de l'entrée de l'utilisateur (texte non modifiable par l'utilisateur avant le curseur)
let urlPrefix = "http://localhost:5000"; //L'url dynamique
let urlInterne = "http://localhost:9000/internalServer"; //L'url dynamique interne
let intervalId = null;//Pour initialisé l'interval
let premiereFois =true;//Pour savoir si c'est la première fois que la page à été reload
let max= 120000; //Temps maximum avant d'avoir un malus
let min=  30000; //Temps minimum avant d'avoir un malus
/**
 * Évenement qui apelle la fonction d'initialisation du termianl lorsque le contenu de la page est chargé
 * On affiche aussi un message de bienvenue
 */
document.addEventListener("DOMContentLoaded", () => {
    initTerminal();

    logInfo(
        "<p style='margin-top:0.5em;'><b>Bienvenue sur le panneau de contrôle de la Bash Space Program Agency.</b></p>"
    );
    logWarning("Entrez la commande 'HELP' pour plus d'informations.");

    testApi();

    audioGestion();

    malusEtCo();
});
/**
 * Permet de gérer les malus
 */
async function malusEtCo() {
    try {
        let malus = await malusEnCours();

        if(premiereFois){
            malus=false;
            premiereFois=false;
        }

        if (!malus) {
            demarrerIntervalle(); // Démarrer l'intervalle si nécessaire
        } else {
            arreterIntervalle(); // Arrêter l'intervalle si nécessaire
        }
    } catch (e) {
        logError(`Erreur dans malusEtCo : ${e}`);
    }
}

// Fonctions de gestion de l'intervalle
function demarrerIntervalle() {
    if (!intervalId) {
        console.log("Démarrage de l'intervalle...");
        intervalId = setInterval(()=>{
            creerMalus();
        }, Math.floor(Math.random() * (max - min + 1)) + min);
    }
}

function arreterIntervalle() {
    if (intervalId) {
        console.log("Arrêt de l'intervalle...");
        clearInterval(intervalId);
        intervalId = null;
    }
}

/**
 * Cette fonction fonctionne en aléatoire pour fournir au joueur un malus au bout de maximum 2 minutes de jeu.
 */
async function creerMalus() {
    switch (Math.floor(Math.random() * 3)) {
        case 1:
            clearTerminal();
            logWarning("Test de connaissance !");
            arreterIntervalle();
            testDeConnaissance();
            break;
        case 2:
            clearTerminal();
            logWarning("Un captcha !");
            arreterIntervalle();
            await captcha();
            break;
        case 0:
            clearTerminal();
            logWarning("Une fenêtre pop-up !");
            popUp();
            break;
    }
}
/**
 * Permet de vérifier l'efficacité de l'individu en arithmétique. Un malus quoi.
 */
async function testDeConnaissance() {
    const a = Math.floor(Math.random() * 15) + 1;
    const b = Math.floor(Math.random() * 15) + 1;
    let reponse;

    switch (Math.floor(Math.random() * 2) + 1) {
        case 1:
            logWarning(
                `Résolver cette équation ${a}+${b}. Inscriver RESULT [votreRéponse]`
            );
            reponse = a + b;
            break;
        case 2:
            logWarning(
                `Résolver cette équation ${a}*${b}. Inscriver RESULT [votreRéponse]`
            );
            reponse = a * b;
            break;
        case 3:
            logWarning(
                `Résolver cette équation ${a}%${b}. Inscriver RESULT [votreRéponse]`
            );
            reponse = a % b;
        case 4:
            logWarning(
                `Résolver cette équation ${a}-${b}. Inscriver RESULT [votreRéponse]`
            );
            reponse = a - b;
            break;
    }
    await envoyerReponse(reponse);
}

/**
 * Permet de générer le captcha comme malus
 */
async function captcha() {
    let str = Math.random().toString(36).substring(2, 7);
    logWarning(`Veuillez maintenant inscrire la commande RESULT ${str}.`);

    await envoyerReponse(str);
}

/**
 * Permet de sélectionner un pop-up à afficher.
 */
function popUp() {
    switch (
        Math.floor(Math.random() * 10) + 1 // Génère un nombre entre 1 et 10
    ) {
        case 1:
            window.open("https://mars.nasa.gov/", "_blank");
            break;
        case 2:
            window.open("https://www.esa.int/", "_blank");
            break;
        case 3:
            window.open("https://hubblesite.org/", "_blank");
            break;
        case 4:
            window.open("https://www.spacex.com/", "_blank");
            break;
        case 5:
            window.open(
                "https://www.nationalgeographic.com/science/space/",
                "_blank"
            );
            break;
        case 6:
            window.open("https://astrobiology.nasa.gov/", "_blank");
            break;
        case 7:
            window.open("https://www.planetariummontreal.com/", "_blank");
            break;
        case 8:
            window.open("https://www.planetary.org/", "_blank");
            break;
        case 9:
            window.open("https://chandra.harvard.edu/", "_blank");
            break;
        case 10:
            window.open("https://www.cfa.harvard.edu/", "_blank");
            break;
    }
    window.reload();
}
/**
 * Permet d'envoyer dans le serveur interne la réponse d'un malus X.
 * @param {any} reponse La réponse du malus
 */
async function envoyerReponse(reponse) {
    let url = `${urlInterne}/reponse.php`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({ reponse: reponse }),
        });

        const data = await response.json();

        if (data["malus"] == null) {
            throw new Error("La variable est déjà instancié");
        }
    } catch (e) {
        logError(`Erreur d'envoie de la réponse`);
        //if (await verifCo(localStorage.getItem("token"))) {
        logError(`Pour débug voici l'erreur système :<br> ${e}`);
        // }
    }
}
/**
 * Permet de vérifier une réponse.
 * @param {any} reponse La réponse à vérifier
 * @returns Retourne false si la réponse ne correspond pas à celle sauvegarder et vrai si la réponse est pareil
 */
async function verifReponse(reponse) {
    let url = `${urlInterne}/verifie.php`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({ reponse: reponse }),
        });

        const data = await response.json();

        if (data["reponse"]) {
           
            return true;
        } else {
            return false;
        }
    } catch (e) {
        logError(`Pour débug voici l'erreur système :<br> ${e}`);
    }
}
/**
 * Méthode permettant de savoir s'il y a un malus en cours ou non.
 * @returns vrai si la variable est instancié et faux si la variable n'est pas instancié.
 */
async function malusEnCours() {
    let url = `${urlInterne}/malusEnCours.php`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const data = await response.json();

        if (data && data["etat"] !== undefined) {
            return data["etat"]; // Retourne directement true ou false
        } else {
            throw new Error("Structure de réponse inattendue");
        }
    } catch (e) {
        logError(`Pour débug voici l'erreur système :<br> ${e}`);
        return false;
    }
}

/**
 * Fonction d'initialisation du terminal
 * Cette fonction est appelée au chargement de la page
 */
function initTerminal() {
    inputPrefix = document.getElementById("terminal-input-prefix").textContent;
}
/**
 * Permet de tester si l'api est en ligne.
 */
async function testApi() {
    if (!(await verifAPI())) {
        logError(
            "ERREUR DE CONNEXION AU SERVEUR. VEUILLEZ REESSAYER PLUS TARD."
        );
    }
}
/**
 * Évenement qui écoute les touches du clavier pour permettre à l'utilisateur d'interagir avec le terminal
 * On gère les touches suivantes :
 * - Les lettres de l'alphabet et les chiffres
 * - La touche "Espace" pour ajouter un espace
 * - La touche "Backspace" pour supprimer le dernier caractère
 * - La touche "Enter" pour envoyer la commande
 */
document.addEventListener("keydown", (e) => {
    const key = e.key;
    const char = key[0];

    if (key.length === 1 && (isLetter(char) || isNumber(char))) {
        addToUserInput(char);
    } else if (e.code == "Space") {
        addToUserInput(" ");
    } else if (e.code == "Backspace") {
        if (inputText.length > 0) {
            inputText = inputText.substring(0, inputText.length - 1);
            updateUserInput();
        }
    } else if (e.code == "Enter") {
        sendCommand(inputText);
        inputText = "";
        updateUserInput();
    }
});

/**
 * Fonction qui traite la commande entrée par l'utilisateur
 * @param {string} input, la commande entrée par l'utilisateur
 */
async function sendCommand(input) {
    logInfo(inputPrefix + input);

    if (await verifAPI()) {
        let words = input.split(" ");
        let isConnect = await verifCo(localStorage.getItem("token"));
        let malus = await malusEnCours();
        if (!malus) {
            switch (words[0].toUpperCase()) {
                case "HELP":
                    if (!isConnect) {
                        logInfo(`Voici la liste des commandes disponibles : <br>
                    - HELP : Affiche la liste des commandes disponibles. <br>
                    - CLEAR : Efface le contenu de la console.<br>
                    - INSTRUCTION [matricule] [module] : Permet d'avoir les instructions pour résoudre un module donnée.<br>
                    - REBOOT : Permet de relancer le terminal à son état initial.<br>
                    - CONNECT  [pseudo] [mot de passe] : Permet à un administrateur de se connecter. `);
                        localStorage.clear();
                    } else {
                        logInfo(`Voici la liste des commandes disponibles : <br>
                    - HELP : Affiche la liste des commandes disponibles. <br>
                    - CLEAR : Efface le contenu de la console.<br>
                    - INSTRUCTION [matricule] [module] : Permet d'avoir les instructions pour résoudre un module donnée.<br>
                    - REBOOT : Permet de relancer le terminal à son état initial.<br>
                    - CONNECT  [pseudo] [mot de passe] : Permet à un administrateur de se connecter.<br>
                    - CREER [pseudo] [mot de passe] : Permet à un administrateur de créer un administrateur.<br>
                    - DECO : Permet à l'administrateur de se déconnecter. `);
                    }
                    break;
                case "CLEAR":
                    clearTerminal();
                    break;
                case "INSTRUCTION":
                    if (words.length == 3) {
                        getInstruction(words[1], words[2]);
                    } else {
                        logError(
                            "Entrée incomplète. Veuillez recommencer ou entrer la commande 'HELP'."
                        );
                    }
                    break;
                case "CONNECT":
                    if (words.length == 3) {
                        getConnect(words[1], words[2]);
                    } else {
                        logError(
                            "Entrée incomplète. Veuillez recommencer ou entrer la commande 'HELP'."
                        );
                    }
                    break;
                case "CREER":
                    if (isConnect === true) {
                        if (words.length == 3) {
                            creerAdmin(words[1], words[2]);
                        } else {
                            logError(
                                "Entrée incomplète. Veuillez recommencer ou entrer la commande 'HELP'."
                            );
                        }
                    } else {
                        logError(
                            "Commande inconnue. Entrez 'HELP' pour plus d'informations."
                        );
                    }
                    break;
                case "DECO":
                    if (isConnect) {
                        clearTerminal();
                        logInfo(`${localStorage.getItem(
                            "utilisateur"
                        )}, vous venez de vous déconnecter.<br>
                        Passez bonne journée :).`);
                        localStorage.clear();
                        demarrerIntervalle();
                    } else {
                        logError(
                            "Commande inconnue. Entrez 'HELP' pour plus d'informations."
                        );
                    }
                    break;
                case "BSP":
                    logInfo(`Bonjour,<br>
                 Bienvenue dans le programme international de Bash Space Program. <br>
                 Vous êtes actuellement sur le magnifique terminal de 14e génération.<br>
                 Afin d'assurer le bon déroulement  de la mission, nous vous prions<br>
                 de bien rester calme à toute les éventualités. Votre pays a besoin de <br>
                 vos capacité pour que cette mission soit un grand succès. L'objectif que <br>
                 vous avez est simple comme bonjour. Vous devez seulement communiquer<br>
                 avec notre capitaine à bord de notre vaisseau.`);
                    break;
                case "REBOOT":
                    location.reload();
                    break;
                default:
                    logError(
                        "Commande inconnue. Entrez 'HELP' pour plus d'informations."
                    );
                    break;
            }
        } else {
            if (words[0].toUpperCase() == "RESULT") {
                const result = await verifReponse(words[1]);
                if (result) {
                    location.reload();
                    logWarning(
                        "Vous pouvez dès maintenant retourner dans vos anciennes occupations."
                    );
                    
                } else {
                    logError("Vous n'avez pas réussi. Veuillez réessayer.");
                }
            }else{
                logError("Commande inconnue. Veuillez réessayer.");
            }
        }
    } else {
        location.reload();
    }
}

async function verifAPI() {
    try {
        let url = `${urlPrefix}/api/v1`;

        const response = await fetch(url);

        const data = await response.json();

        if (data["estConnecte"]) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}
/**
 * Permet de vérifier si un token valide est présent ou non
 * @param {String} token
 * @returns Retourne vrai si le token est valide
 * et retourne faux si le token est invalide ou il manque un token.
 *
 */
async function verifCo(token) {
    try {
        let url = `${urlPrefix}/api/v1/testDeConnexion`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                token: `${token}`,
            }),
        });

        const data = await response.json();

        if (data["test"]) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}

/**
 * Permet de créé un admin si et seulement si  un administrateur est déjà connecté.
 * @param {String} pseudo
 * @param {String} mdp
 */
async function creerAdmin(pseudo, mdp) {
    try {
        let url = `${urlPrefix}/api/v1/admin`;

        const response = await fetch(url, {
            method: `POST`,
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                pseudo: `${pseudo}`,
                mdp: `${mdp}`,
                token: `${localStorage.getItem("token")}`,
            }),
        });

        const data = await response.json();

        if (data["message"] === undefined) {
            throw new Error(
                "Échec de la création de compte. Modifier les identifiants et veuillez réessayer."
            );
        } else {
            logInfo("Le nouvel administrateur à bien été créé.");
        }
    } catch (e) {
        //Renvoie une erreur si le fetch n'a pas fonctionné
        logError(
            "ERREUR SYSTÈME!!!!!<br>Nous n'avons pas réussi à créer un compte administrateur.<br> Veuillez réessayer."
        );

        let isConnect = await verifCo(localStorage.getItem("token"));

        if (isConnect) {
            logError(`Pour débug voici l'erreur système :<br> ${e}`);
        }
    }
}

/**
 * Fonction qui permet à un administrateur de se connecter.
 * @param {String} pseudo, Le nom d'utilisateur de l'administrateur
 * @param {String} mdp , Le mot de passe de l'administrateur
 */
async function getConnect(pseudo, mdp) {
    try {
        //On prépare une url dynamique
        let url = `${urlPrefix}/api/v1/login`;
        //Permet de récupérer un user.
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                pseudo: `${pseudo}`,
                mdp: `${mdp}`,
            }),
        });

        const data = await response.json();

        //Permet de vérifier que c'est bel et bien un admin qui essai de se connecter.
        if (data["admin"] === undefined || data["admin"] === false) {
            throw new Error("Erreur de connexion, veuillez réessayer.");
        }

        //Permet de charger les variables super globales avec les paramètres utilisateur
        localStorage.setItem("token", data["token"]);
        localStorage.setItem("utilisateur", data["utilisateur"]);

        logInfo(`Bienvenue administrateur ${localStorage.getItem(
            "utilisateur"
        )}, <br>
             Utilisez la commande 'HELP' pour voir les commandes administratives que vous avez accès.
             <br>De plus, vous avez accès aux messages de débogage.`);
             arreterIntervalle();
    } catch (e) {
        //Renvoie une erreur si le fetch n'a pas fonctionné
        logError(
            "ERREUR SYSTÈME!!!!!<br>Nous n'avons pas réussi à vous connecter.<br> Veuillez réessayer."
        );

        let isConnect = await verifCo(localStorage.getItem("token"));

        if (isConnect) {
            logError(`Pour débug voici l'erreur système :<br> ${e}`);
        }
    }
}

/**
 * Fonction traite la commande de l'instruction entrée par l'utilisateur
 * @param {String} matricule, le matricule du module
 * @param {String} module, le nom du module
 */
async function getInstruction(matricule, module) {
    try {
        let url = `${urlPrefix}/api/v1/verify?matricule=${matricule}&module=${module}`;

        //Permet de récupérer la réponse de l'api
        const response = await fetch(url);

        //Permet de récupérer les données
        const data = await response.json();
        //Permet d'afficher les instructions du module

        //Lance une erreur si la description est indéfini.
        if (data["description"] === undefined) {
            throw new Error("Aucune description");
        }
        logInfo(data["description"] + "<br> Les instructions du module:");

        //Création de la chaine
        let str = "";

        if (module.toUpperCase() === "PATPLAY") {
            patplayResponse(data, str);
        } else {
            moduleClassique(data, str);
        }
    } catch (e) {
        //Renvoie une erreur si le fetch n'a pas fonctionné
        logError(
            "ERREUR SYSTÈME!!!!!<br>Nous n'avons pas pu récupérer les instructions demandées.<br> Veuillez réessayer."
        );

        let isConnect = await verifCo(localStorage.getItem("token"));

        if (isConnect) {
            logError(`Pour débug voici l'erreur système :<br> ${e}`);
        }
    }
}
/**
 * Fonction qui traite l'affichage des instructions des modules considérés comme "classique".
 * @param {any} data
 * @param {String} str
 */
function moduleClassique(data, str) {
    data.instructions.forEach((instruction) => {
        //On prend chaque élément du module
        for (let key in instruction) {
            if (instruction[key] != instruction.id_) {
                str += `<br>[${key} :  { ${instruction[key]} }]  <br> `;
            }
        }
        //Création du saut de la chaine
        str += "<br>";
    });

    //On affiche les instructions du modules
    logInfo(str);
}

/**
 * Fonction qui permet de traiter les cas qui possède deux tableau d'instruction à l'intérieur du tableau en général.
 * Cette fonction a été créé pour patplay principalement.
 * @param {any} data
 * @param {String} str
 */
function patplayResponse(data, str) {
    str += "#Première partie des instructions : <br>";

    data.instructions1.forEach((instruction) => {
        //On prend chaque élément du module
        for (let key in instruction) {
            // TODO : Trouver un moyen que le if fonctionne pour que l'id ne soit pas visible lors d'une demande.
            /*if(instruction[key]===instruction.carre||instruction[key]===instruction.cercle||
                instruction[key]===instruction.triangle||instruction[key]===instruction.couleur||
                instruction[key]===instruction.x){
              */
            str += `[${key} :  { ${instruction[key]} }]  `;
            //}
        }
        //Création du saut de la chaine
        str += "<br>";
    });

    str += "<br>#Deuxième partie des instructions : <br>";

    data.instructions2.forEach((instruction) => {
        //On prend chaque élément du module
        for (let key in instruction) {
            if (instruction[key] != instruction.id_) {
                str += `[${key} :  { ${instruction[key]} }] `;
            }
        }
        //Création du saut de la chaine
        str += "<br>";
    });
    //On affiche les instructions du modules
    logInfo(str);
}

/**
 * Fonction qui efface le contenu de la console
 */
function clearTerminal() {
    document.getElementById("terminal-output").innerHTML = "<p></p>";
}

/**
 * Fonction qui vérifie si un caractère est un chiffre
 * @param {string} char : une chaîne de caractère de longueur 1 (char) à vérifier
 * @returns
 */
function isNumber(char) {
    return !isNaN(parseInt(char));
}

/**
 * Fonction qui vérifie si un caractère est une lettre
 * @param {string} char : une chaîne de caractère de longueur 1 (char) à vérifier
 * @returns
 */
function isLetter(char) {
    return char.toUpperCase() != char.toLowerCase();
}

/**
 * Fonction qui ajoute un texte à l'entrée de l'utilisateur et qui met à jour l'affichage après l'ajout
 * @param {string} newText
 */
function addToUserInput(newText) {
    inputText += newText;
    updateUserInput();
}

/**
 * Fonction qui met à jour l'affichage de l'entrée de l'utilisateur (modificatin du texte)
 */
function updateUserInput() {
    const inputTextDisplay = document.getElementById("terminal-input-text");
    inputTextDisplay.innerHTML = inputText;
}

/**
 * Fonction qui permet d'afficher un texte dans la console avec une couleur spécifique
 * La fonction vient aussi scroller la fenêtre jusqu'au bas pour voir le nouveau texte qui a été ajouté
 * @param {string} text : le texte à afficher
 * @param {string} color : la couleur avec laquelle on veut afficher le texte
 */
function log(text, color) {
    const terminal = document.getElementById("terminal-output");

    const newText = document.createElement("p");
    newText.style.color = color;
    newText.innerHTML = text;

    terminal.append(newText);

    window.scrollTo(0, document.body.scrollHeight); // On vient scroll la fenêtre à la bonne place (au bas)
}

/**
 * Fonction qui permet d'afficher une information dans le terminal avec la couleur verte
 * @param {string} text : le texte à afficher dans le terminal
 */
function logInfo(text) {
    log(text, "#14FD88");
}

/**
 * Fonction qui permet d'afficher un avertissement dans le terminal avec la couleur orange
 * @param {string} text : le texte à afficher dans le terminal
 */
function logWarning(text) {
    log(text, "#F2A900");
}

/**
 * Fonction qui permet d'afficher une erreur dans le terminal avec la couleur rouge
 * @param {string} text : le texte à afficher dans le terminal
 */
function logError(text) {
    log(text, "#FF1744");
}

/**
 * Permet de gérer l'audio de l'application web
 */
function audioGestion() {
    document.getElementById("sound").addEventListener("click", () => {
        if (document.getElementById("sound").textContent === "volume_up") {
            document.getElementById("sound").textContent = "volume_mute";
            document.getElementById("audioContinu").pause();
        } else {
            document.getElementById("sound").textContent = "volume_up";
            document.getElementById("audioContinu").play();
        }
    });
}
