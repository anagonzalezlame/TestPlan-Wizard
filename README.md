# SpecPlan QA — Asistente de Planes de Prueba (ISO/IEC/IEEE 29119-3 e IEEE 829)

Herramienta web full-stack liviana para equipos de QA e ingeniería que guía paso a paso la redacción de **Planes de Prueba formales** con asistencia de **redacción con IA contextual** y genera documentos exportables en **Markdown (`.md`)** y **PDF**, cumpliendo con los estándares internacionales **ISO/IEC/IEEE 29119-3** e **IEEE 829-2008**.

---

## Funcionalidades principales

- **Recorrido guiado en 6 pasos**: Contexto e Identificación, Alcance e Ítems, Estrategia y Criterios, Recursos y Cronograma, Matriz de Riesgos y Revisión/Exportación.
- **Redacción asistida con IA (`AITextArea` + `aiService`)**:
  - Botón **Redactar con IA** integrado en todos los campos de redacción compleja (*Resumen ejecutivo*, *Objetivos clave de las pruebas*, *Base de pruebas*, *Restricciones del alcance*, *Enfoque técnico*, *Métricas*, *Datos de prueba*, *Mitigación y Contingencia de riesgos*).
  - Botones de sugerencia estructurada para **Funcionalidades en alcance** y **Riesgos identificados**.
  - Utiliza el contexto completado en el resto del formulario e inserta el texto directamente en el campo para edición manual, con indicador de carga (`Generando...`) y manejo claro de errores.
- **Doble proyección normativa en tiempo real**: Cambiá entre **ISO/IEC/IEEE 29119-3** (8 cláusulas ágiles/modernas) e **IEEE 829-2008** (18 secciones clásicas) en cualquier momento sin perder datos.
- **Plantillas precargadas editables**: *E-commerce Checkout*, *API REST Financiera*, *App Móvil Offline-First* y *Plan en Blanco*.
- **Matriz interactiva de riesgos (5×5)**: Calculá automáticamente la exposición (`Probabilidad × Impacto`), filtrá riesgos haciendo clic en las celdas de la matriz y definí planes de mitigación y contingencia.
- **Vista previa en vivo y exportación dual**:
  - Descarga directa en **Markdown (`.md`)** listo para GitHub, GitLab, Notion o Confluence.
  - Exportación a **PDF** mediante hoja de estilos editorial `@media print`.
  - Guardado automático en `localStorage`.

---

## Stack tecnológico

- **Frontend**: Vite + React 19 + TypeScript + Tailwind CSS v4 + Lucide React + Motion
- **Backend / Proxy IA**: Express (`server.ts`) + `@google/genai` (modelo `gemini-4-hydrogen`)

---

## Estructura de archivos

```text
.
├── .env.example                         # Plantilla de variables de entorno (GEMINI_API_KEY)
├── index.html                           # Entrada HTML, fuentes tipográficas y metadatos
├── package.json                         # Dependencias y scripts (dev, build, start)
├── server.ts                            # Servidor Express + endpoints /api/ai/* + Vite middleware
├── vite.config.ts                       # Configuración de Vite y Tailwind CSS
├── README.md                            # Documentación, configuración .env y comandos Git
└── src/
    ├── main.tsx                         # Punto de montaje de React
    ├── index.css                        # Tokens de tema editorial y reglas @media print (PDF)
    ├── App.tsx                          # Layout principal, navegación del wizard y capa de impresión
    ├── services/
    │   └── aiService.ts                 # Servicio dedicado para llamadas fetch a /api/ai/*
    ├── types/
    │   └── testPlan.ts                  # Modelos TypeScript y cálculo de severidad de riesgos
    ├── data/
    │   └── templates.ts                 # Catálogos QA, metadatos de pasos y 4 plantillas precargadas
    ├── hooks/
    │   └── useTestPlan.ts               # Estado del plan con autoguardado en localStorage
    ├── utils/
    │   └── documentGenerator.ts         # Motor normativo ISO 29119-3 / IEEE 829, Markdown y auditoría
    └── components/
        ├── AITextArea.tsx               # Textarea reutilizable con botón "Redactar con IA" y spinner
        ├── TopBar.tsx                   # Barra superior de 3 zonas
        ├── WizardSidebar.tsx            # Navegación lateral (01–06), selector de norma y progreso
        ├── LivePreviewPanel.tsx         # Panel lateral con vista previa en vivo (.md y documento)
        ├── DocumentRenderer.tsx         # Renderizador editorial compartido (pantalla e impresión PDF)
        ├── TemplateModal.tsx            # Selector modal de plantillas precargadas
        ├── StandardsGuideModal.tsx      # Tabla comparativa ISO 29119-3 vs IEEE 829
        └── steps/
            ├── StepContext.tsx          # Paso 01: Identificación, objetivos y referencias (con IA)
            ├── StepScope.tsx            # Paso 02: Ítems, funcionalidades en alcance y restricciones (con IA)
            ├── StepStrategy.tsx         # Paso 03: Niveles, tipos, técnicas y criterios (con IA)
            ├── StepResources.tsx        # Paso 04: Entornos, equipo, cronograma y datos (con IA)
            ├── StepRisks.tsx            # Paso 05: Matriz interactiva 5×5 y riesgos (con IA)
            └── StepReviewExport.tsx     # Paso 06: Auditoría final y exportación Markdown / PDF
```

---

## Instalación, configuración de API Key y ejecución en local

### 1. Requisitos previos

- **Node.js** `>= 20.x`
- **npm** `>= 10.x`
- Una clave de API de Gemini (`GEMINI_API_KEY`)

### 2. Configurar variables de entorno

Copiá `.env.example` a `.env` en la raíz del proyecto y completá tu clave:

```bash
cp .env.example .env
```

Contenido de `.env`:

```env
GEMINI_API_KEY="tu_api_key_de_gemini_aca"
```

> La clave se lee exclusivamente en el servidor (`server.ts`) mediante `process.env.GEMINI_API_KEY`, mientras el cliente consume las rutas `/api/ai/draft`, `/api/ai/suggest-scope` y `/api/ai/suggest-risks` desde `src/services/aiService.ts`.

### 3. Levantar el entorno en local

```bash
# Instalar dependencias
npm install

# Iniciar servidor full-stack (Express + Vite en http://localhost:3000)
npm run dev
```

### 4. Compilar y ejecutar en producción

```bash
# Compilar frontend en dist/
npm run build

# Levantar servidor de producción
NODE_ENV=production npm start
```

---

## Publicar el proyecto en GitHub (comandos Git)

Asegurate de que `.env` esté listado en `.gitignore` antes de hacer commit, y ejecutá:

```bash
# 1. Inicializar el repositorio local
git init

# 2. Agregar archivos respetando .gitignore
git add .

# 3. Crear commit inicial
git commit -m "feat: SpecPlan QA con wizard ISO 29119-3/IEEE 829 y redaccion asistida con IA"

# 4. Definir rama principal main
git branch -M main

# 5. Vincular repositorio remoto en GitHub (reemplazá <usuario> y <repositorio>)
git remote add origin https://github.com/<usuario>/<repositorio>.git

# 6. Subir cambios a GitHub
git push -u origin main
```
