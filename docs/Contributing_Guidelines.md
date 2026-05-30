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

## 3. Coding & Structure Standards

### 3.1 File Naming Convention
We follow a hybrid language rule: **Spanish** for business logic and **English** for technical descriptors.

| File Type | Format | Example |
| :--- | :--- | :--- |
| **React Components** | `PascalCase` | `BibliotecaGenetica.jsx` |
| **Hooks** | `camelCase` (prefix `use`) | `useEspeciesList.js` |
| **Services / API** | `kebab-case` + `.service` | `lotes-operaciones.service.js` |
| **Types / Models** | `kebab-case` + `.types` | `usuario-datos.types.js` |
| **Assets (Images/Fonts)** | `kebab-case` | `fondo-fungivora-plano.png` |
| **Tests** | `OriginalName.test.js/jsx` | `InoculoCard.test.jsx` |

> **Prohibited:** Do not use `snake_case` (underscores) for filenames.

### 3.2 Folder Responsibilities
* **`src/features/`**: Modular logic. Contains components, hooks, and services that belong **only** to that specific functionality.
* **`src/pages/`**: Route-level components. They should only organize features; keep complex logic out of here.
* **`src/shared/`**: Global reusable assets.
    * `ui/`: Atomic components (buttons, inputs, cards).
    * `layout/`: Structural components (Navbar, Sidebar).
    * `utils/`: Helper functions (date formatters, validators).

---

## 4. Workflow

### 4.1 Basic Workflow
1.  **Sync:** `git checkout develop` -> `git pull origin develop`.
2.  **New Branch:** `git checkout -b feature/task-name`.
3.  **Development:** Perform atomic commits (one logical change per commit).
4.  **Testing:** Verify that `npm run dev` works correctly from the root directory.
5.  **Push:** `git push origin feature/task-name`.
6.  **Pull Request (PR):** Open a PR on GitHub targeting the `develop` branch.

### 4.2 Handling Merge Conflicts
1.  Switch to your target branch: `git checkout develop` and `git pull origin develop`.
2.  Go back to your feature branch: `git checkout feature/your-task`.
3.  Merge develop into your branch: `git merge develop`.
4.  If conflicts arise, VS Code will highlight them. Choose the correct changes and save.
5.  Finalize the merge: `git add .` and `git commit -m "[FIX] resolve merge conflicts with develop"`.

---

## 5. Golden Rules (Security & Code)

* **Environment Variables:** NEVER upload the content of your `.env` file.
* **Credentials:** MariaDB passwords must be personal and stay only in your local `.env`.
* **Review:** Every PR must be reviewed by at least one other team member.

---
# 6. Versioning Standards / Estándares de Versionado

## Versioning Convention

The project will follow the versioning format:

`MAJOR.MINOR.PATCH`

### Examples

* `v1.0.0`
* `v1.1.0`
* `v1.1.1`

### Meaning

* **MAJOR**: Major or structural changes.
* **MINOR**: New improvements or sections added without breaking the overall structure.
* **PATCH**: Small fixes, formatting adjustments, or minor bug corrections.

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
* **`[DELETE]`**: Eliminación de código o archivos.
* **`[ENV]`**: Ajustes de configuración/servidor.
* **`[DOC]`**: Cambios en la documentación.

## 3. Estándares de Codificación y Estructura

### 3.1 Convención de Nombres de Archivos
Seguimos la regla de idioma híbrido: **Español** para lógica de negocio e **Inglés** para descriptores técnicos.

| Tipo de Archivo | Formato | Ejemplo |
| :--- | :--- | :--- |
| **Componentes React** | `PascalCase` | `BibliotecaGenetica.jsx` |
| **Hooks** | `camelCase` (prefijo `use`) | `useEspeciesList.js` |
| **Servicios / API** | `kebab-case` + `.service` | `lotes-operaciones.service.js` |
| **Tipos / Modelos** | `kebab-case` + `.types` | `usuario-datos.types.js` |
| **Assets (Imágenes)** | `kebab-case` | `fondo-fungivora-plano.png` |
| **Tests** | `NombreOriginal.test.js` | `InoculoCard.test.jsx` |

> **Prohibido:** No utilizar `snake_case` (guiones bajos) para nombres de archivos.

### 3.2 Responsabilidad de Carpetas
* **`src/features/`**: Lógica modular. Contiene componentes, hooks y servicios que pertenecen **solo** a esa funcionalidad específica.
* **`src/pages/`**: Componentes de ruta. Deben orquestar las features; evita meter lógica compleja aquí.
* **`src/shared/`**: Recursos globales reutilizables.
    * `ui/`: Componentes atómicos (botones, inputs).
    * `layout/`: Componentes de estructura (Navbar, Sidebar).
    * `utils/`: Funciones de ayuda (formateadores, validadores).

## 4. Flujo de Trabajo

### 4.1 Flujo básico
1. **Sincronizar:** `git checkout develop` -> `git pull origin develop`.
2. **Nueva Rama:** `git checkout -b feature/nombre-tarea`.
3. **Visibilidad Temprana:** En cuanto crees tu rama local, súbela al repositorio `git push -u origin feature/tu-tarea`.
4. **Desarrollo:** Realiza commits atómicos (un cambio lógico por commit).
5. **Prueba:** Verificar `npm run dev` desde la raíz.
6. **Push:** `git push origin feature/task-name`.
7. **Pull Request (PR):** Abre un PR en GitHub hacia la rama `develop`.

### 4.2 Resolución de Conflictos
1. Ve a la rama base: `git checkout develop` y haz `git pull origin develop`.
2. Regresa a tu rama: `git checkout feature/tu-tarea`.
3. Integra los cambios: `git merge develop`.
4. Si hay conflictos, elige los cambios correctos en VS Code y guarda.
5. Finaliza: `git add .` y `git commit -m "[FIX] resolve merge conflicts with develop"`.

## 5. Reglas de Oro
* **Variables de Entorno:** NUNCA subas el contenido de tu `.env`.
* **Credenciales:** Passwords de MariaDB personales y locales.
* **Revisión:** Todo PR debe ser revisado por un compañero.

---

## 6. Convención de Versionado

Para los proyectos, la convención de versionado será:

`MAJOR.MINOR.PATCH`

### Ejemplos

* `v1.0.0`
* `v1.1.0`
* `v1.1.1`

### Significado

* **MAJOR**: Cambios mayores o estructurales.
* **MINOR**: Incorporación de mejoras o secciones nuevas sin romper la estructura general.
* **PATCH**: Correcciones pequeñas, ajustes de forma o errores menores.

