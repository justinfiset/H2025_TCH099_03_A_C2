@echo off
setlocal
php --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo PHP n'est pas installe.
    echo Veuillez l'installer depuis : https://windows.php.net/download/
    pause
    exit /b
)

echo PHP est installe. Lancement du serveur...
start "" http://localhost:9000
start cmd /k php -S localhost:9000

:: Attend que l'utilisateur ferme le navigateur
echo Appuyez sur n'importe quelle touche pour arreter le serveur apres avoir ferme le navigateur...
pause >nul

:: Arrête le server PHP
echo "Arret du serveur PHP..."
taskkill /IM php.exe /F >nul 2>&1

:: Vérifie si le processus du serveur PHP est toujours en cours d'exécution
tasklist | findstr /I "php.exe" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo "Le serveur PHP n'a pas pu être arrêté correctement."
) else (
    echo "Serveur PHP arrêté."
)
endlocal
exit