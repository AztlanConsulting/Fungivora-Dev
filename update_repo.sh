#!/bin/bash
# update_repo.sh

echo "- Bajando cambios de Git..."
git pull origin

echo "- Instalando dependencias nuevas..."
npm run install-all

echo "- Construyendo Frontend (Vite)..."
cd ./frontend
npm run build
cd ..

echo "- Reiniciando Backend en PM2..."
pm2 restart api-fungivora

echo "- ¡Listo!"
