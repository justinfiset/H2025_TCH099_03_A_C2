<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

define('APP_ROOT', dirname(__DIR__)); // Chemin absolu vers le répertoire principal de l'application
define('DEBUG_MODE', true);           // Mode de débogage (true/false)

define('BASE_URL', 'http://localhost/internalServer'); //URL de base 
?>