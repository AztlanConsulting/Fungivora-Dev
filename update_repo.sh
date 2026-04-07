#!/bin/bash
# update_repo.sh - Script de autodespliegue

# Detectar la rama actual
BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "- Bajando cambios de Git (origen $BRANCH)..."
git pull origin "$BRANCH"

echo "- Instalando dependencias nuevas..."
npm run install-all

echo "- Construyendo Frontend (Vite)..."
cd ./frontend
npm run build
cd ..

echo "- Reiniciando Backend en PM2..."
pm2 restart api-fungivora

echo "- ¡Listo!"
