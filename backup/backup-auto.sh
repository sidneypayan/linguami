#!/bin/bash

# Script de sauvegarde automatisée complète
# Combine sauvegarde SQL et export JSON
# Peut être planifié avec cron ou Task Scheduler

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="$SCRIPT_DIR/logs/auto_backup_${TIMESTAMP}.log"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Fonction de log
log() {
    echo -e "$1" | tee -a "$LOG_FILE"
}

log "${YELLOW}╔═══════════════════════════════════════════════════════╗${NC}"
log "${YELLOW}║   Sauvegarde Automatisée Linguami                     ║${NC}"
log "${YELLOW}╚═══════════════════════════════════════════════════════╝${NC}"
log "Date: $(date '+%Y-%m-%d %H:%M:%S')"
log "Dossier de travail: $PROJECT_DIR"
log ""

# Se placer dans le dossier du projet
cd "$PROJECT_DIR" || exit 1

# Charger les variables d'environnement
if [ -f ".env.local" ]; then
    log "${BLUE}Chargement des variables d'environnement...${NC}"
    export $(grep -v '^#' .env.local | xargs)
else
    log "${RED}ERREUR: Fichier .env.local introuvable${NC}"
    exit 1
fi

# Vérifier les dépendances
log "${BLUE}Vérification des dépendances...${NC}"

DEPENDENCIES_OK=true

if ! command -v pg_dump &> /dev/null; then
    log "${RED}✗ pg_dump non installé${NC}"
    DEPENDENCIES_OK=false
else
    log "${GREEN}✓ pg_dump installé${NC}"
fi

if ! command -v node &> /dev/null; then
    log "${RED}✗ Node.js non installé${NC}"
    DEPENDENCIES_OK=false
else
    log "${GREEN}✓ Node.js installé ($(node --version))${NC}"
fi

if [ "$DEPENDENCIES_OK" = false ]; then
    log "${RED}Dépendances manquantes. Sauvegarde annulée.${NC}"
    exit 1
fi

log ""

# =====================================
# 1. SAUVEGARDE SQL
# =====================================
log "${YELLOW}═══ 1/2 Sauvegarde SQL ═══${NC}"

if [ -n "$DATABASE_URL" ]; then
    SQL_BACKUP_FILE="$SCRIPT_DIR/sql/linguami_backup_${TIMESTAMP}.sql"

    log "${BLUE}Exécution de pg_dump...${NC}"
    pg_dump "$DATABASE_URL" \
        --no-owner \
        --no-acl \
        --clean \
        --if-exists \
        --file="$SQL_BACKUP_FILE" 2>&1 | tee -a "$LOG_FILE"

    if [ $? -eq 0 ]; then
        SQL_SIZE=$(du -h "$SQL_BACKUP_FILE" | cut -f1)
        log "${GREEN}✓ Sauvegarde SQL réussie ($SQL_SIZE)${NC}"

        # Compression
        log "${BLUE}Compression...${NC}"
        gzip "$SQL_BACKUP_FILE" 2>&1 | tee -a "$LOG_FILE"

        if [ $? -eq 0 ]; then
            COMPRESSED_SIZE=$(du -h "$SQL_BACKUP_FILE.gz" | cut -f1)
            log "${GREEN}✓ Compression réussie ($COMPRESSED_SIZE)${NC}"
        fi
    else
        log "${RED}✗ Échec de la sauvegarde SQL${NC}"
    fi
else
    log "${RED}✗ DATABASE_URL non définie, sauvegarde SQL ignorée${NC}"
fi

log ""

# =====================================
# 2. EXPORT JSON
# =====================================
log "${YELLOW}═══ 2/2 Export JSON ═══${NC}"

if [ -f "$SCRIPT_DIR/backup-json.js" ]; then
    log "${BLUE}Exécution du script d'export JSON...${NC}"
    node "$SCRIPT_DIR/backup-json.js" 2>&1 | tee -a "$LOG_FILE"

    if [ $? -eq 0 ]; then
        log "${GREEN}✓ Export JSON réussi${NC}"
    else
        log "${RED}✗ Échec de l'export JSON${NC}"
    fi
else
    log "${RED}✗ Script backup-json.js introuvable${NC}"
fi

log ""

# =====================================
# 3. NETTOYAGE DES ANCIENNES SAUVEGARDES
# =====================================
log "${YELLOW}═══ Nettoyage ═══${NC}"

# Garder seulement les 7 dernières sauvegardes SQL
SQL_COUNT=$(ls -1 "$SCRIPT_DIR/sql"/*.sql.gz 2>/dev/null | wc -l)
if [ "$SQL_COUNT" -gt 7 ]; then
    log "${BLUE}Suppression des anciennes sauvegardes SQL (gardant les 7 dernières)...${NC}"
    ls -t "$SCRIPT_DIR/sql"/*.sql.gz | tail -n +8 | xargs rm
    log "${GREEN}✓ Nettoyage effectué${NC}"
fi

# Garder seulement les 7 derniers exports JSON
EXPORT_COUNT=$(ls -1d "$SCRIPT_DIR/exports"/backup_* 2>/dev/null | wc -l)
if [ "$EXPORT_COUNT" -gt 7 ]; then
    log "${BLUE}Suppression des anciens exports JSON (gardant les 7 derniers)...${NC}"
    ls -td "$SCRIPT_DIR/exports"/backup_* | tail -n +8 | xargs rm -rf
    log "${GREEN}✓ Nettoyage effectué${NC}"
fi

# Garder seulement les 14 derniers logs
LOG_COUNT=$(ls -1 "$SCRIPT_DIR/logs"/*.log 2>/dev/null | wc -l)
if [ "$LOG_COUNT" -gt 14 ]; then
    log "${BLUE}Suppression des anciens logs (gardant les 14 derniers)...${NC}"
    ls -t "$SCRIPT_DIR/logs"/*.log | tail -n +15 | xargs rm
    log "${GREEN}✓ Nettoyage effectué${NC}"
fi

log ""

# =====================================
# 4. STATISTIQUES FINALES
# =====================================
log "${YELLOW}═══ Statistiques ═══${NC}"

TOTAL_SQL=$(ls -1 "$SCRIPT_DIR/sql"/*.sql.gz 2>/dev/null | wc -l)
TOTAL_JSON=$(ls -1d "$SCRIPT_DIR/exports"/backup_* 2>/dev/null | wc -l)
TOTAL_SIZE=$(du -sh "$SCRIPT_DIR" | cut -f1)

log "Sauvegardes SQL disponibles: $TOTAL_SQL"
log "Exports JSON disponibles: $TOTAL_JSON"
log "Taille totale des sauvegardes: $TOTAL_SIZE"
log ""

# Dernières sauvegardes
log "${BLUE}3 dernières sauvegardes SQL:${NC}"
ls -lht "$SCRIPT_DIR/sql"/*.sql.gz 2>/dev/null | head -3 | awk '{print "  " $9 " (" $5 ")"}'

log ""
log "${BLUE}3 derniers exports JSON:${NC}"
ls -dt "$SCRIPT_DIR/exports"/backup_* 2>/dev/null | head -3 | while read dir; do
    size=$(du -sh "$dir" | cut -f1)
    basename=$(basename "$dir")
    log "  $basename ($size)"
done

log ""
log "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
log "${GREEN}║   Sauvegarde Automatisée Terminée                     ║${NC}"
log "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"
log "Log complet: $LOG_FILE"
log ""

# Notification (optionnelle - décommentez si vous avez configuré des notifications)
# curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
#      -d "chat_id=$TELEGRAM_CHAT_ID" \
#      -d "text=✅ Sauvegarde Linguami terminée avec succès"

exit 0
