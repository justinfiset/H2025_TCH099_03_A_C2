let inputText = ""; // Le texte entré par l'utilisateur
let inputPrefix = ""; // Le préfixe de l'entrée de l'utilisateur (texte non modifiable par l'utilisateur avant le curseur)
let urlPrefix ='http://localhost:5000'
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
function sendCommand(input) {
    logInfo(inputPrefix + input);

    let words = input.split(' ');
    
    switch(words[0].toUpperCase()) {
        case "HELP":
            logInfo(`Voici la liste des commandes disponibles : <br>
                - HELP : Affiche la liste des commandes disponibles. <br>
                - CLEAR : Efface le contenu de la console.<br>
                - INSTRUCTION 'matricule' 'module' : Permet d'avoir les instructions.`);
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
        default:
            logError("Commande inconnue. Entrez 'HELP' pour plus d'information.");
            break;
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
    // TODO : À effacer avant de remettre au client, car la ligne suivante sert seulement pour le débogage.
    logError(`Pour débug voici l'erreur système :<br> ${e}`);
}
}
/**
 * Fonction qui traite l'affichage des instructions des modules considérés comme "classique".
 * 
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
 * 
 * @param {any} data 
 * @param {String} str
 */
function patplayResponse(data,str){


    str += "#Première partie des instructions : <br>";

    data.instructions1.forEach((instruction) => {
        
        //On prend chaque élément du module
        for(let key in instruction){
            if(instruction[key]!=instruction.id_){
                str+=`<br>[${key} :  { ${instruction[key]} }]  <br> `;
            }
        } 
        //Création du saut de la chaine
        str+='<br>';
    });

    str+="<br>#Deuxième partie des instructions : <br>"

    data.instructions2.forEach((instruction) => {
       
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