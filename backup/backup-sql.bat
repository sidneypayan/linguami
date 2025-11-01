@echo off
REM Script de sauvegarde SQL complète de la base de données Supabase
REM Version Windows (CMD/PowerShell)

setlocal enabledelayedexpansion

REM Configuration
set "TIMESTAMP=%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
set "TIMESTAMP=%TIMESTAMP: =0%"
set "BACKUP_DIR=backup\sql"
set "BACKUP_FILE=linguami_backup_%TIMESTAMP%.sql"
set "LOG_FILE=backup\logs\backup_%TIMESTAMP%.log"

echo === Sauvegarde SQL de la base de donnees Linguami ===
echo Date: %date% %time%
echo.

REM Charger les variables d'environnement depuis .env.local
if exist .env.local (
    echo Chargement des variables d'environnement...
    for /f "usebackq tokens=1,2 delims==" %%a in (".env.local") do (
        set "%%a=%%b"
    )
)

REM Vérifier que DATABASE_URL est définie
if "%DATABASE_URL%"=="" (
    echo ERREUR: DATABASE_URL n'est pas definie
    echo.
    echo Veuillez definir DATABASE_URL dans votre fichier .env.local
    echo.
    echo Pour obtenir votre DATABASE_URL:
    echo 1. Allez sur https://app.supabase.com
    echo 2. Selectionnez votre projet
    echo 3. Settings ^> Database ^> Connection string ^> URI
    echo.
    echo Format attendu: postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
    pause
    exit /b 1
)

REM Vérifier que pg_dump est installé
where pg_dump >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: pg_dump n'est pas installe
    echo.
    echo Installation:
    echo 1. Telechargez PostgreSQL depuis https://www.postgresql.org/download/windows/
    echo 2. Installez PostgreSQL vous pouvez ne choisir que les outils clients
    echo 3. Ajoutez C:\Program Files\PostgreSQL\XX\bin a votre PATH
    pause
    exit /b 1
)

echo Demarrage de la sauvegarde...
echo Fichier de destination: %BACKUP_DIR%\%BACKUP_FILE%
echo.

REM Créer la sauvegarde
pg_dump "%DATABASE_URL%" --no-owner --no-acl --clean --if-exists --file="%BACKUP_DIR%\%BACKUP_FILE%" 2>&1

if %errorlevel% equ 0 (
    echo.
    echo [OK] Sauvegarde reussie !
    echo Fichier: %BACKUP_FILE%

    REM Compresser avec 7zip si disponible
    where 7z >nul 2>&1
    if %errorlevel% equ 0 (
        echo.
        echo Compression de la sauvegarde...
        7z a -tgzip "%BACKUP_DIR%\%BACKUP_FILE%.gz" "%BACKUP_DIR%\%BACKUP_FILE%" >nul
        if %errorlevel% equ 0 (
            echo [OK] Compression reussie !
            echo Fichier compresse: %BACKUP_FILE%.gz
            del "%BACKUP_DIR%\%BACKUP_FILE%"
        )
    ) else (
        echo.
        echo Info: 7zip n'est pas installe - sauvegarde non compressée
        echo Pour installer 7zip: https://www.7-zip.org/
    )

    echo.
    echo Dernieres sauvegardes disponibles:
    dir /B /O-D "%BACKUP_DIR%\*.sql*" 2>nul | findstr /N "^" | findstr "^[1-5]:"
    echo.
) else (
    echo.
    echo [ERREUR] Erreur lors de la sauvegarde
    pause
    exit /b 1
)

echo === Sauvegarde terminee ===
echo.
pause
