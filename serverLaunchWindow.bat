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

:: Wait for the user to close the browser
echo Appuyez sur n'importe quelle touche pour arrêter le serveur après avoir fermé le navigateur...
pause >nul

:: Stop PHP server
echo Stopping PHP server...
taskkill /IM php.exe /F >nul 2>&1

echo Done.
endlocal
exit