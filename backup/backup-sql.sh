#!/bin/bash

# Script de sauvegarde SQL complète de la base de données Supabase
# Utilise pg_dump pour créer une sauvegarde complète (structure + données)

# Se placer dans le dossier du script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Charger les variables d'environnement depuis .env.local
if [ -f "$PROJECT_DIR/.env.local" ]; then
    export $(grep -v '^#' "$PROJECT_DIR/.env.local" | grep '=' | xargs)
fi

# Configuration
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="$SCRIPT_DIR/sql"
BACKUP_FILE="linguami_backup_${TIMESTAMP}.sql"
LOG_FILE="$SCRIPT_DIR/logs/backup_${TIMESTAMP}.log"

# Créer les dossiers si nécessaire
mkdir -p "$BACKUP_DIR"
mkdir -p "$(dirname "$LOG_FILE")"

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Sauvegarde SQL de la base de données Linguami ===${NC}" | tee -a "$LOG_FILE"
echo "Date: $(date)" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Vérifier que les variables d'environnement sont définies
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}ERREUR: DATABASE_URL n'est pas définie${NC}" | tee -a "$LOG_FILE"
    echo "Veuillez définir DATABASE_URL dans votre fichier .env.local" | tee -a "$LOG_FILE"
    echo "" | tee -a "$LOG_FILE"
    echo "Pour obtenir votre DATABASE_URL:" | tee -a "$LOG_FILE"
    echo "1. Allez sur https://app.supabase.com" | tee -a "$LOG_FILE"
    echo "2. Sélectionnez votre projet" | tee -a "$LOG_FILE"
    echo "3. Settings > Database > Connection string > URI" | tee -a "$LOG_FILE"
    echo "" | tee -a "$LOG_FILE"
    echo "Format attendu: postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" | tee -a "$LOG_FILE"
    exit 1
fi

# Vérifier que pg_dump est installé
if ! command -v pg_dump &> /dev/null; then
    echo -e "${RED}ERREUR: pg_dump n'est pas installé${NC}" | tee -a "$LOG_FILE"
    echo "" | tee -a "$LOG_FILE"
    echo "Installation sur Windows (Git Bash/MINGW):" | tee -a "$LOG_FILE"
    echo "1. Téléchargez PostgreSQL depuis https://www.postgresql.org/download/windows/" | tee -a "$LOG_FILE"
    echo "2. Installez PostgreSQL (vous pouvez ne choisir que les outils clients)" | tee -a "$LOG_FILE"
    echo "3. Ajoutez C:\\Program Files\\PostgreSQL\\XX\\bin à votre PATH" | tee -a "$LOG_FILE"
    echo "" | tee -a "$LOG_FILE"
    echo "Installation sur Mac:" | tee -a "$LOG_FILE"
    echo "brew install postgresql" | tee -a "$LOG_FILE"
    echo "" | tee -a "$LOG_FILE"
    echo "Installation sur Linux:" | tee -a "$LOG_FILE"
    echo "sudo apt-get install postgresql-client" | tee -a "$LOG_FILE"
    exit 1
fi

echo -e "${YELLOW}Démarrage de la sauvegarde...${NC}" | tee -a "$LOG_FILE"
echo "Fichier de destination: $BACKUP_DIR/$BACKUP_FILE" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Créer la sauvegarde
pg_dump "$DATABASE_URL" \
    --no-owner \
    --no-acl \
    --clean \
    --if-exists \
    --file="$BACKUP_DIR/$BACKUP_FILE" 2>&1 | tee -a "$LOG_FILE"

# Vérifier le succès
if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
    echo "" | tee -a "$LOG_FILE"
    echo -e "${GREEN}✓ Sauvegarde réussie !${NC}" | tee -a "$LOG_FILE"
    echo "Fichier: $BACKUP_FILE" | tee -a "$LOG_FILE"
    echo "Taille: $BACKUP_SIZE" | tee -a "$LOG_FILE"
    echo "" | tee -a "$LOG_FILE"

    # Compresser la sauvegarde
    echo -e "${YELLOW}Compression de la sauvegarde...${NC}" | tee -a "$LOG_FILE"
    gzip "$BACKUP_DIR/$BACKUP_FILE" 2>&1 | tee -a "$LOG_FILE"

    if [ $? -eq 0 ]; then
        COMPRESSED_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE.gz" | cut -f1)
        echo -e "${GREEN}✓ Compression réussie !${NC}" | tee -a "$LOG_FILE"
        echo "Fichier compressé: $BACKUP_FILE.gz" | tee -a "$LOG_FILE"
        echo "Taille compressée: $COMPRESSED_SIZE" | tee -a "$LOG_FILE"
        echo "" | tee -a "$LOG_FILE"

        # Afficher les 5 dernières sauvegardes
        echo -e "${YELLOW}Dernières sauvegardes disponibles:${NC}" | tee -a "$LOG_FILE"
        ls -lht "$BACKUP_DIR"/*.sql.gz | head -5 | tee -a "$LOG_FILE"
        echo "" | tee -a "$LOG_FILE"

        # Suggestion de nettoyage
        BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/*.sql.gz 2>/dev/null | wc -l)
        if [ "$BACKUP_COUNT" -gt 7 ]; then
            echo -e "${YELLOW}⚠ Vous avez $BACKUP_COUNT sauvegardes.${NC}" | tee -a "$LOG_FILE"
            echo "Pensez à supprimer les anciennes sauvegardes pour économiser de l'espace." | tee -a "$LOG_FILE"
            echo "Pour garder seulement les 7 dernières:" | tee -a "$LOG_FILE"
            echo "  ls -t $BACKUP_DIR/*.sql.gz | tail -n +8 | xargs rm" | tee -a "$LOG_FILE"
            echo "" | tee -a "$LOG_FILE"
        fi
    else
        echo -e "${RED}✗ Erreur lors de la compression${NC}" | tee -a "$LOG_FILE"
        echo "La sauvegarde non compressée est disponible: $BACKUP_FILE" | tee -a "$LOG_FILE"
    fi
else
    echo "" | tee -a "$LOG_FILE"
    echo -e "${RED}✗ Erreur lors de la sauvegarde${NC}" | tee -a "$LOG_FILE"
    echo "Consultez le fichier de log pour plus de détails: $LOG_FILE" | tee -a "$LOG_FILE"
    exit 1
fi

echo -e "${GREEN}=== Sauvegarde terminée ===${NC}" | tee -a "$LOG_FILE"
echo "Log complet: $LOG_FILE" | tee -a "$LOG_FILE"
