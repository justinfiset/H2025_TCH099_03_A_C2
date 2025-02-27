let inputText = "";
let inputPrefix = "";

document.addEventListener("DOMContentLoaded", () => {
    initTerminal();

    logInfo("Bienvenue sur le panneau de contrôle de la Bash Space Program Agency.");
    logWarning("Entrez la commande 'HELP' pour plus d'information.");
    logError("CECI EST UN TEST D'ERREUR À ENLEVER APRÈS LE CHARGEMENT DE LA PAGE");
});

function initTerminal() {
    inputPrefix = document.getElementById("terminal-input-prefix").textContent;
}

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

function sendCommand(input) {
    logInfo(inputPrefix + input);
}

function isNumber(char) {
    return !isNaN(parseInt(char));
}

function isLetter(char) {
    return char.toUpperCase() != char.toLowerCase();
}

function addToUserInput(newText) {
    inputText += newText;
    updateUserInput();
}

function updateUserInput() {
    const inputTextDisplay = document.getElementById("terminal-input-text");
    inputTextDisplay.innerHTML = inputText;
}

function log(text, color) {
    const terminal = document.getElementById("terminal-output");

    const newText = document.createElement("p");
    newText.style.color = color;
    newText.innerHTML = text;

    terminal.append(newText);

    window.scrollTo(0, document.body.scrollHeight); // On vient scroll la fenêtre à la bonne place (au bas)
}

function logInfo(text)    { log(text, "#33FF00"); }
function logWarning(text) { log(text, "#FFB000");      }
function logError(text)   { log(text, "#FB2E01");   }