<?php
require("./../config.php");
try {

    if(isset($_SESSION["reponse"])){
        echo json_encode(["etat"=>true]);
        exit;
    }else{
        echo json_encode(["etat"=>false]);
        exit;
    }

}catch(Exception $e){
    http_response_code(404);
    echo json_encode(["erreur" => "Impossible de vérifier la variable"]);
}
?>