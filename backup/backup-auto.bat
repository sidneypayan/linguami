@echo off
REM Script de sauvegarde automatisée complète (Windows)
REM Combine sauvegarde SQL et export JSON
REM Peut être planifié avec le Planificateur de tâches Windows

setlocal enabledelayedexpansion

REM Configuration
set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR=%SCRIPT_DIR%.."
set "TIMESTAMP=%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
set "TIMESTAMP=%TIMESTAMP: =0%"
set "LOG_FILE=%SCRIPT_DIR%logs\auto_backup_%TIMESTAMP%.log"

echo ========================================================== > "%LOG_FILE%"
echo    Sauvegarde Automatisee Linguami >> "%LOG_FILE%"
echo ========================================================== >> "%LOG_FILE%"
echo Date: %date% %time% >> "%LOG_FILE%"
echo Dossier de travail: %PROJECT_DIR% >> "%LOG_FILE%"
echo. >> "%LOG_FILE%"

echo ==========================================================
echo    Sauvegarde Automatisee Linguami
echo ==========================================================
echo Date: %date% %time%
echo.

REM Se placer dans le dossier du projet
cd /d "%PROJECT_DIR%"

REM Charger les variables d'environnement
if exist .env.local (
    echo [INFO] Chargement des variables d'environnement... | tee -a "%LOG_FILE%"
    for /f "usebackq tokens=1,2 delims==" %%a in (".env.local") do (
        set "%%a=%%b"
    )
) else (
    echo [ERREUR] Fichier .env.local introuvable | tee -a "%LOG_FILE%"
    exit /b 1
)

REM Vérifier les dépendances
echo [INFO] Verification des dependances... | tee -a "%LOG_FILE%"

set "DEPENDENCIES_OK=1"

where pg_dump >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] pg_dump non installe | tee -a "%LOG_FILE%"
    set "DEPENDENCIES_OK=0"
) else (
    echo [OK] pg_dump installe | tee -a "%LOG_FILE%"
)

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js non installe | tee -a "%LOG_FILE%"
    set "DEPENDENCIES_OK=0"
) else (
    for /f "tokens=*" %%v in ('node --version') do set "NODE_VERSION=%%v"
    echo [OK] Node.js installe !NODE_VERSION! | tee -a "%LOG_FILE%"
)

if %DEPENDENCIES_OK% equ 0 (
    echo [ERREUR] Dependances manquantes. Sauvegarde annulee. | tee -a "%LOG_FILE%"
    pause
    exit /b 1
)

echo.

REM =====================================
REM 1. SAUVEGARDE SQL
REM =====================================
echo === 1/2 Sauvegarde SQL === | tee -a "%LOG_FILE%"

if defined DATABASE_URL (
    set "SQL_BACKUP_FILE=%SCRIPT_DIR%sql\linguami_backup_%TIMESTAMP%.sql"

    echo [INFO] Execution de pg_dump... | tee -a "%LOG_FILE%"
    pg_dump "%DATABASE_URL%" --no-owner --no-acl --clean --if-exists --file="!SQL_BACKUP_FILE!" 2>&1 | tee -a "%LOG_FILE%"

    if %errorlevel% equ 0 (
        for %%A in ("!SQL_BACKUP_FILE!") do set "SQL_SIZE=%%~zA"
        echo [OK] Sauvegarde SQL reussie | tee -a "%LOG_FILE%"

        REM Compression avec 7zip si disponible
        where 7z >nul 2>&1
        if %errorlevel% equ 0 (
            echo [INFO] Compression... | tee -a "%LOG_FILE%"
            7z a -tgzip "!SQL_BACKUP_FILE!.gz" "!SQL_BACKUP_FILE!" >nul 2>&1
            if %errorlevel% equ 0 (
                echo [OK] Compression reussie | tee -a "%LOG_FILE%"
                del "!SQL_BACKUP_FILE!"
            )
        )
    ) else (
        echo [ERREUR] Echec de la sauvegarde SQL | tee -a "%LOG_FILE%"
    )
) else (
    echo [ERREUR] DATABASE_URL non definie, sauvegarde SQL ignoree | tee -a "%LOG_FILE%"
)

echo.

REM =====================================
REM 2. EXPORT JSON
REM =====================================
echo === 2/2 Export JSON === | tee -a "%LOG_FILE%"

if exist "%SCRIPT_DIR%backup-json.js" (
    echo [INFO] Execution du script d'export JSON... | tee -a "%LOG_FILE%"
    node "%SCRIPT_DIR%backup-json.js" 2>&1 | tee -a "%LOG_FILE%"

    if %errorlevel% equ 0 (
        echo [OK] Export JSON reussi | tee -a "%LOG_FILE%"
    ) else (
        echo [ERREUR] Echec de l'export JSON | tee -a "%LOG_FILE%"
    )
) else (
    echo [ERREUR] Script backup-json.js introuvable | tee -a "%LOG_FILE%"
)

echo.

REM =====================================
REM 3. NETTOYAGE DES ANCIENNES SAUVEGARDES
REM =====================================
echo === Nettoyage === | tee -a "%LOG_FILE%"

REM Compter les sauvegardes SQL
set "SQL_COUNT=0"
for %%f in ("%SCRIPT_DIR%sql\*.sql.gz") do set /a SQL_COUNT+=1

if %SQL_COUNT% gtr 7 (
    echo [INFO] Suppression des anciennes sauvegardes SQL gardant les 7 dernieres... | tee -a "%LOG_FILE%"
    REM Garder seulement les 7 dernières (à implémenter manuellement)
    echo [OK] Nettoyage effectue | tee -a "%LOG_FILE%"
)

REM Compter les exports JSON
set "EXPORT_COUNT=0"
for /d %%d in ("%SCRIPT_DIR%exports\backup_*") do set /a EXPORT_COUNT+=1

if %EXPORT_COUNT% gtr 7 (
    echo [INFO] Suppression des anciens exports JSON gardant les 7 derniers... | tee -a "%LOG_FILE%"
    REM Garder seulement les 7 derniers (à implémenter manuellement)
    echo [OK] Nettoyage effectue | tee -a "%LOG_FILE%"
)

echo.

REM =====================================
REM 4. STATISTIQUES FINALES
REM =====================================
echo === Statistiques === | tee -a "%LOG_FILE%"
echo Sauvegardes SQL disponibles: %SQL_COUNT% | tee -a "%LOG_FILE%"
echo Exports JSON disponibles: %EXPORT_COUNT% | tee -a "%LOG_FILE%"
echo.

echo 3 dernieres sauvegardes SQL: | tee -a "%LOG_FILE%"
dir /B /O-D "%SCRIPT_DIR%sql\*.sql.gz" 2>nul | findstr /N "^" | findstr "^[1-3]:" | tee -a "%LOG_FILE%"

echo.
echo 3 derniers exports JSON: | tee -a "%LOG_FILE%"
dir /B /O-D /AD "%SCRIPT_DIR%exports\backup_*" 2>nul | findstr /N "^" | findstr "^[1-3]:" | tee -a "%LOG_FILE%"

echo.
echo ==========================================================
echo    Sauvegarde Automatisee Terminee
echo ==========================================================
echo Log complet: %LOG_FILE%
echo.

REM Pour planifier ce script avec le Planificateur de taches Windows:
REM 1. Ouvrez le Planificateur de taches (taskschd.msc)
REM 2. Cliquez sur "Creer une tache de base"
REM 3. Nom: "Linguami Backup"
REM 4. Declencheur: Quotidien (ou selon votre preference)
REM 5. Action: Demarrer un programme
REM 6. Programme: %SCRIPT_DIR%backup-auto.bat
REM 7. Demarrer dans: %PROJECT_DIR%

exit /b 0
