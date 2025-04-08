<?php

session_start();
$date = new DateTime('now', new DateTimeZone('America/New_York'));


$dateLocale = $date->format('d/m/Y');
$_SESSION["time"] =$dateLocale;


?>

<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BSP Terminal</title>

        <link rel="stylesheet" href="./ressources/css/normalize.css">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet" />
        <link rel="stylesheet" href="./ressources/css/global.css?id=1">

        <script type="module" src="./ressources/js/terminal.js"></script>
    </head>
    <body>
        <div id="terminal-content">
            <div id="terminal-title">
                <p>Bash Space Program</p>
                <div id="horloge">
                    <?php 
                    echo $_SESSION["time"];
                    ?>
                </div>
                <p id="sound" class="material-icons">volume_mute</p>
                <audio id="audioContinu" loop preload="auto" src="./ressources/soundEffect/terminalBackgroundSound.mp3"></audio>
            </div>
            <div id="terminal-output"></div>

            <div id="terminal-input">
                <p id="terminal-input-prefix">BSP:&#92;&gt;</p>
                <p id="terminal-input-text"></p>
                <p id="terminal-cursor">&#9601;</p>
            </div>
        </div>
    </body>
</html>