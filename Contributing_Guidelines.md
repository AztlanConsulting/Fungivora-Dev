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

1.  **Sync:** `git checkout develop` -> `git pull origin develop`.
2.  **New Branch:** `git checkout -b feature/task-name`.
3.  **Development:** Perform atomic commits (one logical change per commit).
4.  **Testing:** Verify that `npm run dev` works correctly from the root directory.
5.  **Push:** `git push origin feature/task-name`.
6.  **Pull Request (PR):** Open a PR on GitHub targeting the `develop` branch.

---

## 4. Golden Rules (Security & Code)

* **Environment Variables:** NEVER upload the content of your `.env` file.
* **Credentials:** MariaDB passwords must be personal and stay only in your local `.env`.
* **Review:** Every PR must be reviewed by at least one other team member.

---
---

# Estándar de Desarrollo: Fungivora-Dev (Español)

Este documento define los lineamientos para el desarrollo del proyecto, con el fin de mantener un código consistente, claro y fácil de colaborar.

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
**Formato:** `[TIPO] (área) descripción breve`
* **`[ADD]`**: Nueva funcionalidad/archivo.
* **`[FIX]`**: Corrección de bug.
* **`[UPDATE]`**: Mejora de algo existente.
* **`[ENV]`**: Ajustes de configuración/servidor.

## 3. Flujo de Trabajo
1. **Sincronizar:** `git pull origin develop`.
2. **Nueva Rama:** `git checkout -b feature/nombre-tarea`.
3. **Prueba:** Verificar `npm run dev` desde la raíz.
4. **Push & PR:** Subir rama y abrir PR hacia `develop`.

## 4. Reglas de Oro
* **Variables de Entorno:** NUNCA subas el contenido de tu `.env`.
* **Credenciales:** Passwords de MariaDB personales y locales.
* **Revisión:** Todo PR debe ser revisado por un compañero.