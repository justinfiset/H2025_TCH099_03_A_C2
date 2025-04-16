<?php
require("./../config.php");
try {
    $body = json_decode(file_get_contents("php://input"), true);

    if (json_last_error() !== JSON_ERROR_NONE || !isset($body["reponse"])) {
        http_response_code(400); // Bad Request
        echo json_encode(["erreur" => "Données JSON invalides ou manquantes"]);
        exit;
    }

    if ($body["reponse"] == $_SESSION["reponse"]) {
        $_SESSION["reponse"] = null;
        echo json_encode(["reponse" => true]);
    } else {
        echo json_encode(["reponse" => false]);
    }

} catch (Exception $e) {
    http_response_code(404);
    echo json_encode(["erreur" => "Impossible de vérifier la variable"]);
}

?>