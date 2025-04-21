<?php
require("./../config.php");
try {
    $body = json_decode(file_get_contents("php://input"), true);

    if (json_last_error() !== JSON_ERROR_NONE || !isset($body["reponse"])) {
        http_response_code(400); // Bad Request
        echo json_encode(["erreur" => "Données JSON invalides ou manquantes"]);
        exit;
    }

    $_SESSION["reponse"] = $body["reponse"];

    echo json_encode(["malus" => true]);
} catch (Exception $e) {
    http_response_code(404);
    echo json_encode(["erreur" => "Impossible de remplir la variable"]);
}
?>