# Development Standard: Fungivora-Dev

This document defines the development guidelines for the project to ensure consistent, clear, and maintainable code, facilitating collaboration among all team members.

---

## 1. Repository Standards

### 1.1 Main Branches
* **`main`**: Production branch. Contains stable code. It only receives merges from `develop`. **Protected.**
* **`develop`**: Integration branch. This is where progress is consolidated before moving to production. **Protected.**

### 1.2 Working Branches
Always created from `develop`:
* **`feature/`**: New functionalities (e.g., `feature/login-screen`).
* **`bugfix/`**: Bug fixes during development (e.g., `bugfix/fix-api-connection`).
* **`hotfix/`**: Urgent critical fixes coming from `main`.
* **`docs/`**: Exclusive documentation changes.

### 1.3 Naming Convention
* Use lowercase and separate words with hyphens: `branch-type/short-description`.
* Example: `feature/mariadb-setup`, `bugfix/cors-error`.

---

## 2. Commit Standards

We will use tags in brackets followed by a description.

**Format:** `[TYPE] (area) brief description`

### Commit Types
* **`[ADD]`**: New functionality, file, or component.
* **`[FIX]`**: Bug fix.
* **`[UPDATE]`**: Improvement or update of something existing (not a bug).
* **`[DELETE]`**: Removal of code or files.
* **`[ENV]`**: Adjustments to `.env.example` files or server configuration.
* **`[DOC]`**: Documentation changes.

---

## 3. Workflow

### 3.1 Basic Workflow
1.  **Sync:** `git checkout develop` -> `git pull origin develop`.
2.  **New Branch:** `git checkout -b feature/task-name`.
3.  **Development:** Perform atomic commits (one logical change per commit).
4.  **Testing:** Verify that `npm run dev` works correctly from the root directory.
5.  **Push:** `git push origin feature/task-name`.
6.  **Pull Request (PR):** Open a PR on GitHub targeting the `develop` branch.

### 3.2 Advanced Workflow Steps
* **Early Visibility:** Once you create your local branch, push it to the remote repository immediately (`git push -u origin feature/your-task`), even if you haven't written any code yet. This lets the team know someone is already working on that feature.
* **Handling Merge Conflicts:**
    1.  Switch to your target branch: `git checkout develop` and `git pull origin develop`.
    2.  Go back to your feature branch: `git checkout feature/your-task`.
    3.  Merge develop into your branch: `git merge develop`.
    4.  If conflicts arise, VS Code will highlight them. Choose the correct changes, save the files.
    5.  Finalize the merge: `git add .` and `git commit -m "[FIX] resolve merge conflicts with develop"`.

---

## 4. Golden Rules (Security & Code)

* **Environment Variables:** NEVER upload the content of your `.env` file.
* **Credentials:** MariaDB passwords must be personal and stay only in your local `.env`.
* **Review:** Every PR must be reviewed by at least one other team member.

---
---

# Estándar de Desarrollo: Fungivora-Dev (Español)

Este documento define los lineamientos para el desarrollo del proyecto, con el fin de mantener un código consistente, claro y fácil de colaborar.

Esta traducción está destinada como un apoyo de lectura para los miembros del equipo. El acuerdo es trabajar commits, ramas y PRs en inglés.

## 1. Estándares del Repositorio

### 1.1 Ramas Principales
* **`main`**: Producción. Código estable. **Protegida.**
* **`develop`**: Integración. Avances consolidados. **Protegida.**

### 1.2 Ramas de Trabajo (Desde `develop`)
* **`feature/`**: Nuevas funcionalidades.
* **`bugfix/`**: Corrección de errores en desarrollo.
* **`hotfix/`**: Correcciones críticas desde `main`.
* **`docs/`**: Cambios de documentación.

### 1.3 Convención de Nombres
* Usar minúsculas y guiones (sin acentos ni ñ): `tipo-de-rama/descripcion-corta`.

## 2. Estándares de Commits
Usaremos etiquetas entre corchetes seguidas de una descripción breve.

**Formato:** `[TIPO] (área) descripción breve`
* **`[ADD]`**: Nueva funcionalidad/archivo.
* **`[FIX]`**: Corrección de bug.
* **`[UPDATE]`**: Mejora de algo existente.
* **`[DELETE]`**: Eliminación de código o archivos.
* **`[ENV]`**: Ajustes de configuración/servidor.
* **`[DOC]`**: Cambios en la documentación.

## 3. Flujo de Trabajo
### 3.1 Flujo básico

1. **Sincronizar:** `git checkout develop` -> `git pull origin develop`.
2. **Nueva Rama:** `git checkout -b feature/nombre-tarea`.
3. **Visibilidad Temprana:** En cuanto crees tu rama local, súbela al repositorio `git push -u origin feature/tu-tarea`.
4.  **Desarrollo:** Realiza commits atómicos (un cambio lógico por commit).
5. **Prueba:** Verificar `npm run dev` desde la raíz.
6. **Push:** `git push origin feature/task-name`.
7. **Pull Request (PR):** Abre un PR en GitHub hacia la rama `develop`.

### 3.2 Resolución de Conflictos (Merge conflicts)
1.  Ve a la rama base: `git checkout develop` y haz `git pull origin develop`.
2.  Regresa a tu rama: `git checkout feature/tu-tarea`.
3.  Integra los cambios: `git merge develop`.
4.  Si hay conflictos, VS Code los marcará. Elige los cambios correctos y guarda los archivos.
5.  Finaliza el merge: `git add .` y `git commit -m "[FIX] resolve merge conflicts with develop"`.

## 4. Reglas de Oro
* **Variables de Entorno:** NUNCA subas el contenido de tu `.env`.
* **Credenciales:** Passwords de MariaDB personales y locales.
* **Revisión:** Todo PR debe ser revisado por un compañero.