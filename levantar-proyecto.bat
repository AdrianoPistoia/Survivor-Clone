@echo off
REM Survivor-Clone: Levantar servidor y frontend

REM Instalar dependencias si es necesario
if not exist node_modules (
    echo Instalando dependencias...
    npm install
)

REM Iniciar el backend (Express)
start "Backend" cmd /k "npm run start"

REM Iniciar el frontend (Vite)
start "Frontend" cmd /k "npm run dev"

echo Proyecto Survivor-Clone levantado.
pause
