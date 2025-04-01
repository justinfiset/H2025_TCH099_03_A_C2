let inputText = ""; // Le texte entré par l'utilisateur
let inputPrefix = ""; // Le préfixe de l'entrée de l'utilisateur (texte non modifiable par l'utilisateur avant le curseur)
let urlPrefix ='http://localhost:5000' //L'url dynamique

/**
 * Évenement qui apelle la fonction d'initialisation du termianl lorsque le contenu de la page est chargé
 * On affiche aussi un message de bienvenue
 */
document.addEventListener("DOMContentLoaded", () => {
    initTerminal();

    logInfo("<b>Bienvenue sur le panneau de contrôle de la Bash Space Program Agency.</b>");
    logWarning("Entrez la commande 'HELP' pour plus d'information.");
    logError("CECI EST UN TEST D'ERREUR À ENLEVER APRÈS LE CHARGEMENT DE LA PAGE");
});

/**
 * Fonction d'initialisation du terminal
 * Cette fonction est appelée au chargement de la page
 */
function initTerminal() {
    inputPrefix = document.getElementById("terminal-input-prefix").textContent;
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

    if(key.length === 1 && (isLetter(char) || isNumber(char))) {
        addToUserInput(char);
    } else if(e.code == "Space") {
        addToUserInput(" ");
    } else if(e.code == "Backspace") {
        if(inputText.length > 0) {
            inputText = inputText.substring(0, inputText.length - 1);
            updateUserInput();
        }
    } else if(e.code == "Enter") {
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

    let words = input.split(' ');
    let isConnect = await verifCo(localStorage.getItem("token"));

    switch(words[0].toUpperCase()) {
        case "HELP":
            
            
            if(!isConnect){
                logInfo(`Voici la liste des commandes disponibles : <br>
                    - HELP : Affiche la liste des commandes disponibles. <br>
                    - CLEAR : Efface le contenu de la console.<br>
                    - INSTRUCTION [matricule] [module] : Permet d'avoir les instructions pour résoudre un module donnée.<br>
                    - CONNECT  [pseudo] [mot de passe] : Permet à un administrateur de se connecter. `);
                    localStorage.clear();
            }else{
                logInfo(`Voici la liste des commandes disponibles : <br>
                    - HELP : Affiche la liste des commandes disponibles. <br>
                    - CLEAR : Efface le contenu de la console.<br>
                    - INSTRUCTION [matricule] [module] : Permet d'avoir les instructions pour résoudre un module donnée.<br>
                    - CONNECT  [pseudo] [mot de passe] : Permet à un administrateur de se connecter.<br>
                    - CREE [pseudo] [mot de passe] : Permet à un administrateur de créer un administrateur.<br>
                    - DECO : Permet à l'administrateur de se déconnecter. `);
                    
            }
            break;
        case "CLEAR":
            clearTerminal();
            break;
        case "INSTRUCTION" :
                
                if(words.length ==3){
                    getInstruction(words[1],words[2]);
                    
                }else{
                    logError("Entrée incomplète. Veuillez recommencer ou entrer la commande 'HELP'.");
                }
                break;

        case "CONNECT":
               
            if(words.length == 3){
                getConnect(words[1],words[2]);
                
            }else{
                logError("Entrée incomplète. Veuillez recommencer ou entrer la commande 'HELP'.");
            }

                break;
        case "CREE":

            
            if(isConnect===true){
                if(words.length == 3){
                    creeAdmin(words[1],words[2]);
                    
                }else{
                    logError("Entrée incomplète. Veuillez recommencer ou entrer la commande 'HELP'.");
                }
            }else{
                logError("Commande inconnue. Entrez 'HELP' pour plus d'information.");
            }
            break;
            
        case "DECO":

            if(isConnect){
                clearTerminal();
                logInfo(`${localStorage.getItem("utilisateur")}, vous venez de vous déconnectez.<br>
                        Passer bonne journée :).`);
                localStorage.clear();
            }else{
                logError("Commande inconnue. Entrez 'HELP' pour plus d'information.");
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
        default:
            logError("Commande inconnue. Entrez 'HELP' pour plus d'information.");
            break;
    }
}
/**
 * Permet de vérifier si un token valide est présent ou non
 * @param {String} token 
 * @returns Retourne vrai si le token est valide 
 * et retourne faux si le token est invalide ou il manque un token.
 * 
 */
async function verifCo(token){
    try{

    let url = `${urlPrefix}/api/v1/testDeConnexion`


    const response= await fetch(url,
        {method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
              },
         body:JSON.stringify({
            token: `${token}`
        }),
        }
    );

       
    const data = await response.json();


    if(data["test"]){
        return true;
    }else{
        return false;
    }
    }catch(e){
        return false;
    }
}

/**
 * Permet de créé un admin si et seulement si  un administrateur est déjà connecté.
 * @param {String} pseudo 
 * @param {String} mdp 
 */
async function creeAdmin(pseudo,mdp){
    try{

         let url = `${urlPrefix}/api/v1/admin`;

         const response = await fetch(url,{
            method:`POST`,
            headers: {
                "Content-Type": "application/json;charset=utf-8",
              },
            body:JSON.stringify({
                pseudo: `${pseudo}`,
                mdp: `${mdp}`,
                token: `${localStorage.getItem("token")}`
            })
         })

         const data = await response.json();

         if(data["message"]===undefined){
            throw new Error("Échec de la création de compte. Modifier les identifiants et veuillez réessayer.");
         }else{
            logInfo("Le nouvel administrateur à bien été créé.");
         }

    }catch(e){
         //Renvoie une erreur si le fetch n'a pas fonctionné
    logError("ERREUR SYSTÈME!!!!!<br>Nous n'avons pas réussi à créer un compte administrateur.<br> Veuillez réessayer.");

    let isConnect = await verifCo(localStorage.getItem("token"));

    if(isConnect){
        logError(`Pour débug voici l'erreur système :<br> ${e}`);
    }
    }
}

/**
 * Fonction qui permet à un administrateur de se connecter.
 * @param {String} pseudo, Le nom d'utilisateur de l'administrateur
 * @param {String} mdp , Le mot de passe de l'administrateur
 */
async function getConnect(pseudo,mdp) {
    
    try{
        //On prépare une url dynamique
        let url = `${urlPrefix}/api/v1/login`;
        //Permet de récupérer un user.
        const response = await fetch(url,
            {method: 'POST',
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                  },
             body:JSON.stringify({
                pseudo: `${pseudo}`,
                mdp: `${mdp}`
            }),
            });

        const data = await response.json();

        //Permet de vérifier que c'est bel et bien un admin qui essai de se connecter.
        if(data["admin"]===undefined||data['admin']===false){
            throw new Error("Erreur de connexion, veuillez réessayer.");
        }

        
        //Permet de charger les variables super globales avec les paramètres utilisateur
        localStorage.setItem("token",data["token"]);
        localStorage.setItem("utilisateur",data["utilisateur"]);

        logInfo(`Bienvenue administrateur ${localStorage.getItem("utilisateur")}, <br>
             Utilisez la commande 'HELP' pour voir les commandes administratives que vous avez accès.
             <br>De plus, vous avez accès aux messages de débogage.`);



    }catch(e){

        //Renvoie une erreur si le fetch n'a pas fonctionné
    logError("ERREUR SYSTÈME!!!!!<br>Nous n'avons pas réussi à vous connecter.<br> Veuillez réessayer.");

    let isConnect = await verifCo(localStorage.getItem("token"));

    if(isConnect){
        logError(`Pour débug voici l'erreur système :<br> ${e}`);
    }

    }
    

}


/**
 * Fonction traite la commande de l'instruction entrée par l'utilisateur
 * @param {String} matricule, le matricule du module
 * @param {String} module, le nom du module
 */
async function getInstruction(matricule,module){
try{
    let url = `${urlPrefix}/api/v1/verify?matricule=${matricule}&module=${module}`;


    //Permet de récupérer la réponse de l'api
    const response = await fetch(url);
    
    //Permet de récupérer les données
    const data = await response.json();
    //Permet d'afficher les instructions du module

    //Lance une erreur si la description est indéfini.
    if(data["description"]===undefined){
        throw new Error("Aucune description");
    }
    logInfo(data["description"]+"<br> Les instructions du module:");


    //Création de la chaine 
    let str =""; 

    if(module==="PatPlay"){
        patplayResponse(data,str);
    }else{
        moduleClassique(data,str);
    }
}catch(e){
    //Renvoie une erreur si le fetch n'a pas fonctionné
    logError("ERREUR SYSTÈME!!!!!<br>Nous n'avons pas pu récupérer les instructions demandées.<br> Veuillez réessayer.");

    let isConnect = await verifCo(localStorage.getItem("token"));

    if(isConnect){
        logError(`Pour débug voici l'erreur système :<br> ${e}`);
    }
}
}
/**
 * Fonction qui traite l'affichage des instructions des modules considérés comme "classique".
 * @param {any} data 
 * @param {String} str
 */
function moduleClassique(data,str){
   
    
    
    data.instructions.forEach((instruction) => {
        
        //On prend chaque élément du module
        for(let key in instruction){
            if(instruction[key]!=instruction.id_){
                str+=`<br>[${key} :  { ${instruction[key]} }]  <br> `;
            }
        } 
        //Création du saut de la chaine
        str+='<br>';
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
function patplayResponse(data,str){


    str += "#Première partie des instructions : <br>";

    data.instructions1.forEach((instruction) => {
        
        //On prend chaque élément du module
        for(let key in instruction){

            // TODO : Trouver un moyen que le if fonctionne pour que l'id ne soit pas visible lors d'une demande.
            /*if(instruction[key]===instruction.carre||instruction[key]===instruction.cercle||
                instruction[key]===instruction.triangle||instruction[key]===instruction.couleur||
                instruction[key]===instruction.x){
              */      
                str+=`[${key} :  { ${instruction[key]} }]  `;
            //}
        } 
        //Création du saut de la chaine
        str+='<br>';
    });

    str+="<br>#Deuxième partie des instructions : <br>"

    data.instructions2.forEach((instruction) => {
       
        //On prend chaque élément du module
        for(let key in instruction){
            if(instruction[key]!=instruction.id_){
                str+=`[${key} :  { ${instruction[key]} }] `;
            }
        } 
        //Création du saut de la chaine
        str+='<br>';
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
function logInfo(text)    { log(text, "#14FD88"); }

/**
 * Fonction qui permet d'afficher un avertissement dans le terminal avec la couleur orange
 * @param {string} text : le texte à afficher dans le terminal
 */
function logWarning(text) { log(text, "#F2A900"); }

/**
 * Fonction qui permet d'afficher une erreur dans le terminal avec la couleur rouge
 * @param {string} text : le texte à afficher dans le terminal
 */
function logError(text)   { log(text, "#FF1744"); }