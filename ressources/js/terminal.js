
document.addEventListener("DOMContentLoaded", () => {
    logInfo("Bienvenue sur le panneau de contrôle de la Bash Space Program Agency.");
    logWarning("Entrez la commande 'HELP' pour plus d'information.");
    logError("CECI EST UN TEST D'ERREUR À ENLEVER APRÈS LE CHARGEMENT DE LA PAGE");
});

function log(text, color) {
    const terminal = document.getElementById("terminal-content");

    const newText = document.createElement("p");
    newText.style.color = color;
    newText.innerHTML = text;

    terminal.append(newText);
}

function logInfo(text)    { log(text, "greenyellow"); }
function logWarning(text) { log(text, "orange");      }
function logError(text)   { log(text, "orangered");   }