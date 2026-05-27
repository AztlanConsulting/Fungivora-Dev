# Fungivora-Dev

[Descripción del proyecto pendiente]

---

## Primeros Pasos

Sigue estos pasos para configurar correctamente tu entorno de desarrollo.

### 1. Requisitos Previos
Asegúrate de tener instalados **Node.js** (se recomienda la versión LTS) y **MariaDB** en tu equipo.

### 2. Instalación
El proyecto utiliza `concurrently` para ejecutar el frontend y el backend al mismo tiempo. Ejecuta los siguientes comandos:

```bash
# Clonar el repositorio
git clone https://github.com/AztlanConsulting/Fungivora-Dev.git
cd Fungivora-Dev

# Instalar dependencias principales (incluyendo concurrently)
npm install

# Instalar todas las dependencias (Frontend y Backend)
# Hemos creado un script personalizado para esto:
npm run install-all
```


### 3. Ejecutar Proyecto
Una vez instalado, puedes iniciar ámbos servidores (Frontend & Backend) con un simple comando o juntos:

```bash
# Corre tanto backend como frontend:
npm run dev

# Corre solo front:
npm run frontend

# Corre solo back:
npm run backend
```

### 4. Accede a la App
Después de correr el server, puedes acceder desde:

Frontend (Vite): http://localhost:5173 (Puerto por defecto de Vite)

Backend (API): http://localhost:5000

Nota: Si el puerto 5173 está ocupado, consulta la terminal; Vite asignará automáticamente el siguiente puerto disponible (e.g., 5174).