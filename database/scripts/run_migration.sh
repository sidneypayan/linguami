#!/bin/bash

# Script pour exécuter la migration add_created_at_to_users_profile
# Ce script exécute la migration SQL via psql

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Se placer dans le dossier du script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Charger les variables d'environnement
if [ -f "$PROJECT_DIR/.env.local" ]; then
    export $(grep -v '^#' "$PROJECT_DIR/.env.local" | grep '=' | xargs)
fi

MIGRATION_FILE="$SCRIPT_DIR/migration_add_created_at_to_users_profile.sql"

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Migration: Ajout de created_at${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

# Vérifier que le fichier de migration existe
if [ ! -f "$MIGRATION_FILE" ]; then
    echo -e "${RED}Erreur: Fichier de migration introuvable${NC}"
    echo "Fichier attendu: $MIGRATION_FILE"
    exit 1
fi

echo -e "${BLUE}Fichier de migration: $MIGRATION_FILE${NC}"
echo ""

# Vérifier DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}Erreur: DATABASE_URL n'est pas définie${NC}"
    echo ""
    echo -e "${YELLOW}Option 1: Exécution manuelle via Supabase Dashboard${NC}"
    echo "1. Allez sur https://app.supabase.com"
    echo "2. Sélectionnez votre projet"
    echo "3. Cliquez sur 'SQL Editor'"
    echo "4. Cliquez sur 'New Query'"
    echo "5. Copiez-collez le contenu de:"
    echo "   $MIGRATION_FILE"
    echo "6. Cliquez sur 'Run'"
    echo ""
    echo -e "${YELLOW}Option 2: Définir DATABASE_URL${NC}"
    echo "Ajoutez DATABASE_URL dans .env.local:"
    echo "DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
    exit 1
fi

# Vérifier psql
if ! command -v psql &> /dev/null; then
    echo -e "${RED}Erreur: psql n'est pas installé${NC}"
    echo ""
    echo -e "${YELLOW}Exécution manuelle requise${NC}"
    echo "1. Allez sur https://app.supabase.com"
    echo "2. SQL Editor > New Query"
    echo "3. Copiez-collez le contenu de:"
    echo "   $MIGRATION_FILE"
    exit 1
fi

# Afficher un résumé
echo -e "${YELLOW}Cette migration va:${NC}"
echo "  1. Ajouter la colonne 'created_at' à users_profile"
echo "  2. Remplir created_at avec les données de auth.users"
echo "  3. Ajouter la colonne 'updated_at'"
echo "  4. Créer des triggers automatiques"
echo "  5. Ajouter des index pour la performance"
echo ""

# Demander confirmation
read -p "$(echo -e ${YELLOW}Voulez-vous exécuter cette migration ? [oui/non]: ${NC})" confirm

if [ "$confirm" != "oui" ] && [ "$confirm" != "o" ]; then
    echo -e "${YELLOW}Migration annulée${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}Exécution de la migration...${NC}"
echo ""

# Exécuter la migration
psql "$DATABASE_URL" -f "$MIGRATION_FILE"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Migration réussie !${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${BLUE}Vérification des résultats:${NC}"
    echo ""

    # Afficher quelques résultats
    psql "$DATABASE_URL" -c "
        SELECT
            name,
            created_at,
            updated_at
        FROM users_profile
        ORDER BY created_at
        LIMIT 5;
    "

    echo ""
    echo -e "${GREEN}✓ Colonnes created_at et updated_at ajoutées${NC}"
    echo -e "${GREEN}✓ Données synchronisées avec auth.users${NC}"
    echo -e "${GREEN}✓ Triggers automatiques créés${NC}"
else
    echo ""
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}Erreur lors de la migration${NC}"
    echo -e "${RED}========================================${NC}"
    echo ""
    echo -e "${YELLOW}Veuillez exécuter manuellement via:${NC}"
    echo "1. Supabase Dashboard > SQL Editor"
    echo "2. Ou vérifier les logs ci-dessus"
    exit 1
fi
