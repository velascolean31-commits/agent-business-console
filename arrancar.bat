@echo off
title Consola de agentes
cd /d "%~dp0"
echo.
echo === 1/3 Descargando lo ultimo de GitHub ===
git pull
echo.
echo === 2/3 Instalando dependencias ===
call npm.cmd install --no-fund --no-audit
echo.
echo === 3/3 Arrancando la app. NO CIERRES ESTA VENTANA mientras la uses ===
echo Se abrira el navegador en unos segundos. Para parar la app: cierra esta ventana.
start "" cmd /c "timeout /t 12 >nul & start http://localhost:3000"
call npm.cmd run dev
pause
