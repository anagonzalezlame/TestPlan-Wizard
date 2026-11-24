import { TemplatePreset, TestPlanData, WizardStepMeta } from '../types/testPlan';

export const WIZARD_STEPS: WizardStepMeta[] = [
  {
    id: 'context',
    number: '01',
    label: 'Contexto e Identificación',
    shortLabel: 'Contexto',
    subtitle: 'Metadatos normativos, objetivos del plan, base de pruebas y referencias documentales.',
    isoClause: 'Cláusulas 1 y 2',
    ieeeClause: 'Secciones 1 a 3',
  },
  {
    id: 'scope',
    number: '02',
    label: 'Alcance e Ítems',
    shortLabel: 'Alcance',
    subtitle: 'Componentes bajo prueba, funcionalidades incluidas, exclusiones justificadas y restricciones.',
    isoClause: 'Cláusula 2',
    ieeeClause: 'Secciones 4, 6 y 7',
  },
  {
    id: 'strategy',
    number: '03',
    label: 'Estrategia y Criterios',
    shortLabel: 'Estrategia',
    subtitle: 'Niveles, tipos y técnicas de prueba junto a reglas formales de entrada, salida y suspensión.',
    isoClause: 'Cláusulas 4 y 5',
    ieeeClause: 'Secciones 8 a 10',
  },
  {
    id: 'resources',
    number: '04',
    label: 'Recursos y Cronograma',
    shortLabel: 'Recursos',
    subtitle: 'Entornos, datos de prueba, roles del equipo, capacitación, hitos y entregables de QA.',
    isoClause: 'Cláusulas 6 y 7',
    ieeeClause: 'Secciones 11 a 16',
  },
  {
    id: 'risks',
    number: '05',
    label: 'Matriz de Riesgos',
    shortLabel: 'Riesgos',
    subtitle: 'Evaluación interactiva Probabilidad × Impacto con planes de mitigación y contingencia.',
    isoClause: 'Cláusula 3',
    ieeeClause: 'Secciones 5 y 17',
  },
  {
    id: 'review',
    number: '06',
    label: 'Revisión y Exportación',
    shortLabel: 'Exportar',
    subtitle: 'Auditoría de completitud normativa, cambio de estándar y descarga en Markdown o PDF.',
    isoClause: 'Cláusula 8',
    ieeeClause: 'Sección 18',
  },
];

export const TEST_LEVEL_OPTIONS = [
  'Pruebas Unitarias',
  'Pruebas de Integración',
  'Pruebas de Sistema',
  'Pruebas de Aceptación (UAT)',
  'Pruebas de Humo (Smoke)',
];

export const TEST_TYPE_OPTIONS = [
  'Funcional',
  'Regresión',
  'Rendimiento y Carga',
  'Seguridad (OWASP)',
  'Usabilidad',
  'Accesibilidad (WCAG AA)',
  'Compatibilidad Cross-Browser',
  'Recuperación ante Fallos',
];

export const TEST_TECHNIQUE_OPTIONS = [
  'Partición de Equivalencia',
  'Análisis de Valores Límite',
  'Tablas de Decisión',
  'Transición de Estados',
  'Pruebas Basadas en Riesgos',
  'Pruebas Exploratorias',
  'Pruebas de Contrato (API)',
];

export const DELIVERABLE_OPTIONS = [
  'Plan Maestro de Pruebas (este documento)',
  'Especificación y Casos de Prueba',
  'Matriz de Trazabilidad de Requisitos (RTM)',
  'Scripts de Automatización y Colecciones API',
  'Registro de Defectos e Incidentes',
  'Informe de Estado Diario / Semanal',
  'Informe de Resumen y Cierre de Pruebas',
];

const ECOMMERCE_PLAN: TestPlanData = {
  standard: 'ISO_29119',
  documentId: 'TP-ECOM-2026-01',
  title: 'Plan de Pruebas — Checkout Multimoneda v3.4',
  projectName: 'NorteComercio Plataforma Web',
  version: '1.2',
  status: 'En revisión',
  author: 'Lucía Fernández (QA Lead)',
  approver: 'Martín Quiroga (Engineering Manager)',
  date: '2026-11-24',
  summary:
    'Este plan define la estrategia integral de aseguramiento de calidad para el lanzamiento del módulo de checkout multimoneda, integraciones con pasarelas de pago y cálculo tributario en tiempo real para Argentina, Chile y México.',
  objectives:
    'Validar la exactitud transaccional del flujo de pago sin pérdida de órdenes, verificar la resiliencia ante caídas de pasarelas externas y certificar tiempos de respuesta menores a 1.8 s bajo picos de 450 compras concurrentes.',
  testBasis:
    'Especificación funcional PRD-CHK-34, contratos OpenAPI v3.1 de pasarelas de pago, guía de diseño WCAG 2.1 AA y requisitos regulatorios fiscales por país.',
  references: [
    'PRD-CHK-34 — Especificación Funcional de Checkout Multimoneda',
    'ARC-PAY-12 — Diagrama de Secuencia de Integración de Pagos',
    'ISO/IEC/IEEE 29119-3 — Estándar de Documentación de Pruebas',
    'OWASP ASVS v4.0 — Controles de Seguridad en Transacciones Web',
  ],
  testItems: [
    {
      id: 'ti-1',
      name: 'Frontend Checkout SPA',
      version: 'v3.4.0-rc2',
      type: 'Aplicación Web React',
      reference: 'repo/checkout-web@rc2',
    },
    {
      id: 'ti-2',
      name: 'Servicio de Orquestación de Pagos',
      version: 'v2.9.1',
      type: 'Microservicio REST',
      reference: 'openapi/payments-v2.yaml',
    },
    {
      id: 'ti-3',
      name: 'Motor de Impuestos y Conversión FX',
      version: 'v1.6.0',
      type: 'Servicio Backend',
      reference: 'docs/fx-tax-rules.md',
    },
  ],
  inScopeFeatures: [
    {
      id: 'sf-1',
      name: 'Selección de moneda (ARS, CLP, MXN, USD) y recálculo en vivo',
      module: 'Carrito y Checkout',
      priority: 'Alta',
      testLevel: 'Sistema / E2E',
    },
    {
      id: 'sf-2',
      name: 'Pago con tarjeta (3DS 2.0), tokenización e idempotencia',
      module: 'Pasarela de Pagos',
      priority: 'Alta',
      testLevel: 'Integración / Sistema',
    },
    {
      id: 'sf-3',
      name: 'Aplicación de cupones combinables y límites por categoría',
      module: 'Promociones',
      priority: 'Media',
      testLevel: 'Sistema',
    },
    {
      id: 'sf-4',
      name: 'Generación de comprobante fiscal y envío de correo transaccional',
      module: 'Post-compra',
      priority: 'Alta',
      testLevel: 'Integración',
    },
  ],
  outOfScopeFeatures: [
    {
      id: 'osf-1',
      name: 'Panel administrativo de conciliación contable legacy',
      reason: 'Sin cambios en esta versión; cubierto por auditoría trimestral independiente.',
    },
    {
      id: 'osf-2',
      name: 'Pagos mediante criptomonedas o billeteras no listadas',
      reason: 'Pospuesto para la fase Q2 del roadmap de producto.',
    },
  ],
  constraints:
    'La ventana de congelamiento de código inicia 48 horas antes del evento comercial. Los entornos sandbox de tarjetas tienen un límite de 60 solicitudes por minuto.',
  testLevels: [
    'Pruebas Unitarias',
    'Pruebas de Integración',
    'Pruebas de Sistema',
    'Pruebas de Aceptación (UAT)',
  ],
  testTypes: [
    'Funcional',
    'Regresión',
    'Rendimiento y Carga',
    'Seguridad (OWASP)',
    'Accesibilidad (WCAG AA)',
  ],
  testTechniques: [
    'Partición de Equivalencia',
    'Análisis de Valores Límite',
    'Tablas de Decisión',
    'Pruebas Basadas en Riesgos',
    'Pruebas Exploratorias',
  ],
  approachSummary:
    'Se aplicará un enfoque piramidal basado en riesgos: validación automatizada de contratos y reglas fiscales en CI, suite E2E crítica en Playwright sobre Chromium/WebKit, pruebas de carga progresiva en k6 y sesiones exploratorias enfocadas en errores de red e idempotencia.',
  entryCriteria: [
    'Compilación estable desplegada en Staging con pruebas unitarias > 85% de cobertura.',
    'Contratos API congelados y credenciales sandbox activas para los tres países.',
    'Datos sintéticos de usuarios, direcciones y tarjetas de prueba aprovisionados.',
  ],
  exitCriteria: [
    '100% de los casos de prueba de prioridad Alta ejecutados sin bloqueos.',
    'Cero defectos abiertos de severidad Crítica o Bloqueante; máximo 3 de severidad Media con plan de corrección.',
    'Latencia P95 del endpoint de confirmación de orden <= 1.800 ms bajo 450 usuarios concurrentes.',
  ],
  suspensionCriteria: [
    'Indisponibilidad del entorno Staging o del simulador de pagos superior a 4 horas continuas.',
    'Fallo en las pruebas de humo que impida completar el flujo básico de checkout.',
    'Más del 25% de los casos críticos bloqueados por un mismo defecto estructural.',
  ],
  resumptionRequirements: [
    'Despliegue verificado del parche correctivo y ejecución satisfactoria de la suite Smoke (100% verde).',
    'Confirmación escrita del equipo de Infraestructura sobre estabilidad del entorno.',
  ],
  qualityMetrics:
    'Tasa de ejecución >= 98%, tasa de aprobación >= 95%, densidad de defectos en UAT < 0.4 por historia y tiempo medio de resolución (MTTR) de bloqueantes < 6 h.',
  environments: [
    {
      id: 'env-1',
      name: 'Staging QA (Clon Producción)',
      configuration: 'Kubernetes 3 nodos, PostgreSQL 16, Redis 7, Feature Flags habilitados',
      tools: 'Playwright, Postman/Newman, Datadog APM',
      availability: '24/7 con despliegue diario 09:00',
    },
    {
      id: 'env-2',
      name: 'Entorno de Performance',
      configuration: 'Instancia aislada con mock controlado de pasarela externa (latencia parametrizable)',
      tools: 'Grafana k6, Prometheus',
      availability: 'Ventana reservada días 6 a 8',
    },
  ],
  testDataRequirements:
    'Catálogo anonimizado de 1.500 SKU, matrices de impuestos por jurisdicción (AR/CL/MX), tarjetas de prueba (aprobada, fondos insuficientes, 3DS rechazado, timeout) y cupones vencidos/activos.',
  staffing: [
    {
      id: 'st-1',
      role: 'QA Lead',
      responsibilities: 'Gobierno del plan, gestión de riesgos, triage diario y firma de cierre.',
      quantity: 1,
      trainingNeeds: 'Ninguna',
    },
    {
      id: 'st-2',
      role: 'QA Automation Engineer',
      responsibilities: 'Suite E2E Playwright, pruebas de contrato API y ejecución de carga en k6.',
      quantity: 2,
      trainingNeeds: 'Taller breve de reglas fiscales MX/CL (2 h)',
    },
    {
      id: 'st-3',
      role: 'Product Owner / UAT',
      responsibilities: 'Validación de criterios de aceptación de negocio y flujos de facturación.',
      quantity: 1,
      trainingNeeds: 'Guía de reporte de incidentes en Jira',
    },
  ],
  schedule: [
    {
      id: 'sch-1',
      phase: 'Diseño de casos y preparación de datos',
      startDate: '2026-11-25',
      endDate: '2026-11-27',
      deliverable: 'Casos de prueba y RTM aprobados',
    },
    {
      id: 'sch-2',
      phase: 'Ejecución funcional, integración y regresión',
      startDate: '2026-11-28',
      endDate: '2026-12-03',
      deliverable: 'Reportes diarios y registro de defectos',
    },
    {
      id: 'sch-3',
      phase: 'Pruebas de carga, seguridad y UAT',
      startDate: '2026-12-04',
      endDate: '2026-12-06',
      deliverable: 'Informe de rendimiento y acta UAT',
    },
    {
      id: 'sch-4',
      phase: 'Cierre y decisión Go / No-Go',
      startDate: '2026-12-07',
      endDate: '2026-12-07',
      deliverable: 'Informe de Resumen de Pruebas firmado',
    },
  ],
  deliverables: [
    'Plan Maestro de Pruebas (este documento)',
    'Especificación y Casos de Prueba',
    'Matriz de Trazabilidad de Requisitos (RTM)',
    'Scripts de Automatización y Colecciones API',
    'Registro de Defectos e Incidentes',
    'Informe de Resumen y Cierre de Pruebas',
  ],
  remainingTasks:
    'Rotar llaves de sandbox 3DS 2.0 antes del ciclo de regresión y coordinar con Finanzas la validación de redondeos en CLP.',
  risks: [
    {
      id: 'rk-1',
      code: 'RSK-01',
      title: 'Doble cobro ante reintentos por timeout de pasarela externa',
      category: 'Producto',
      probability: 3,
      impact: 5,
      mitigation: 'Validar llaves de idempotencia en todos los endpoints POST de pago y simular timeouts controlados.',
      contingency: 'Activar conciliación automática nocturna y rollback inmediato mediante feature flag.',
    },
    {
      id: 'rk-2',
      code: 'RSK-02',
      title: 'Diferencias de redondeo en conversión multimoneda e IVA',
      category: 'Producto',
      probability: 4,
      impact: 4,
      mitigation: 'Ejecutar tabla de decisión con 40 combinaciones de montos decimales y validar contra planilla fiscal.',
      contingency: 'Bloquear moneda afectada mediante configuración remota sin frenar el resto de países.',
    },
    {
      id: 'rk-3',
      code: 'RSK-03',
      title: 'Inestabilidad del entorno sandbox del proveedor de tarjetas',
      category: 'Proyecto',
      probability: 4,
      impact: 3,
      mitigation: 'Desplegar stub WireMock con contratos grabados para desacoplar pruebas automatizadas diarias.',
      contingency: 'Reprogramar pruebas contra sandbox real en ventana nocturna de menor tráfico.',
    },
    {
      id: 'rk-4',
      code: 'RSK-04',
      title: 'Degradación de rendimiento en mobile de gama media durante checkout',
      category: 'Producto',
      probability: 2,
      impact: 3,
      mitigation: 'Auditar Core Web Vitals y ejecutar throttling 4G/CPU 4x en dispositivos reales Android/iOS.',
      contingency: 'Diferir carga de scripts de analítica no críticos tras confirmación de orden.',
    },
    {
      id: 'rk-5',
      code: 'RSK-05',
      title: 'Falta de disponibilidad del aprobador UAT en fecha de cierre',
      category: 'Proyecto',
      probability: 2,
      impact: 2,
      mitigation: 'Designar aprobador suplente desde el kick-off y agendar sesión de revisión con 5 días de anticipación.',
      contingency: 'Escalar aprobación ejecutiva a Dirección de Producto con el informe de QA adjunto.',
    },
  ],
};

const API_PLAN: TestPlanData = {
  standard: 'ISO_29119',
  documentId: 'TP-API-2026-08',
  title: 'Plan de Pruebas — API Gateway de Transferencias Instantáneas',
  projectName: 'Core Financiero OpenBanking v2',
  version: '1.0',
  status: 'Borrador',
  author: 'Diego Salgado (Arquitecto QA)',
  approver: 'Carolina Méndez (Head of Platform)',
  date: '2026-11-24',
  summary:
    'Plan de pruebas orientado a la verificación funcional, de contrato, seguridad OAuth 2.0/mTLS y alta concurrencia del API Gateway de transferencias inmediatas entre cuentas bancarias.',
  objectives:
    'Garantizar cumplimiento estricto de los esquemas OpenAPI 3.1, prevenir escalación de privilegios o inyección de payloads y certificar un throughput sostenido de 1.200 RPS con tasa de error < 0.05%.',
  testBasis:
    'Especificación OpenAPI 3.1, estándar OWASP API Security Top 10 (2023), SLA de disponibilidad 99.95% y normativa bancaria local.',
  references: [
    'SPEC-OB-202 — Contrato OpenAPI de Transferencias',
    'SEC-MTLS-09 — Política de Autenticación Mutua TLS y Scopes OAuth',
    'OWASP API Security Top 10 (2023)',
  ],
  testItems: [
    {
      id: 'api-ti-1',
      name: 'API Gateway Transferencias',
      version: 'v2.1.0',
      type: 'REST / JSON over mTLS',
      reference: 'specs/transfers-v2.yaml',
    },
    {
      id: 'api-ti-2',
      name: 'Servicio de Validación Antifraude',
      version: 'v1.4.2',
      type: 'gRPC Microservice',
      reference: 'proto/antifraud.proto',
    },
  ],
  inScopeFeatures: [
    {
      id: 'api-sf-1',
      name: 'Emisión de token OAuth 2.0 con rotación de certificados mTLS',
      module: 'Seguridad / Auth',
      priority: 'Alta',
      testLevel: 'Integración',
    },
    {
      id: 'api-sf-2',
      name: 'Creación y consulta idempotente de transferencias (POST/GET /transfers)',
      module: 'Core Transaccional',
      priority: 'Alta',
      testLevel: 'Sistema / Contrato',
    },
    {
      id: 'api-sf-3',
      name: 'Rate limiting por cliente API y respuestas RFC 7807 (Problem Details)',
      module: 'Resiliencia',
      priority: 'Media',
      testLevel: 'Sistema',
    },
  ],
  outOfScopeFeatures: [
    {
      id: 'api-osf-1',
      name: 'Portal web de desarrolladores y documentación interactiva',
      reason: 'Gestionado por el equipo de Developer Experience con su propio ciclo de QA.',
    },
  ],
  constraints:
    'Prohibido utilizar datos reales de clientes en ambientes no productivos. Las pruebas de estrés requieren notificación previa al SOC.',
  testLevels: [
    'Pruebas Unitarias',
    'Pruebas de Integración',
    'Pruebas de Sistema',
    'Pruebas de Humo (Smoke)',
  ],
  testTypes: [
    'Funcional',
    'Regresión',
    'Rendimiento y Carga',
    'Seguridad (OWASP)',
    'Recuperación ante Fallos',
  ],
  testTechniques: [
    'Pruebas de Contrato (API)',
    'Análisis de Valores Límite',
    'Partición de Equivalencia',
    'Pruebas Basadas en Riesgos',
  ],
  approachSummary:
    'Validación automatizada de esquemas y contratos en pipeline CI/CD, batería de pruebas negativas OWASP API (BOLA, BFLA, rate limit bypass) y escenarios de soak testing de 2 horas a 1.200 RPS.',
  entryCriteria: [
    'Spec OpenAPI aprobada por Arquitectura y publicada en el registro de contratos.',
    'Certificados mTLS de prueba emitidos y rotados en el entorno Pre-Producción.',
  ],
  exitCriteria: [
    '100% de endpoints conformes al esquema OpenAPI sin regresiones de contrato.',
    'Cero vulnerabilidades Críticas o Altas en escaneo OWASP ZAP y revisión manual.',
    'P99 <= 350 ms a 1.200 RPS sostenidos durante 2 horas sin fugas de memoria.',
  ],
  suspensionCriteria: [
    'Caída del clúster de base de datos o servicio de emisión de tokens.',
    'Exposición accidental de credenciales o fallo crítico de autorización entre cuentas (BOLA).',
  ],
  resumptionRequirements: [
    'Corrección desplegada con prueba de regresión de seguridad automatizada y aprobación de AppSec.',
  ],
  qualityMetrics:
    'Cobertura de contratos 100%, tasa de falsos positivos en antifraude < 0.2%, disponibilidad en pruebas de carga >= 99.95%.',
  environments: [
    {
      id: 'api-env-1',
      name: 'Pre-Producción Bancaria',
      configuration: 'Clúster aislado con balanceador mTLS, Kafka 3 brokers y PostgreSQL réplica',
      tools: 'Postman, RestAssured, k6, OWASP ZAP',
      availability: 'Lunes a Viernes 08:00–20:00',
    },
  ],
  testDataRequirements:
    '200 cuentas sintéticas con saldos variados, límites diarios configurados, certificados válidos/revocados/expirados y listas negras simuladas.',
  staffing: [
    {
      id: 'api-st-1',
      role: 'QA Automation API',
      responsibilities: 'Contratos, suites funcionales automatizadas y pruebas de carga.',
      quantity: 2,
      trainingNeeds: 'Configuración de clientes mTLS en k6',
    },
    {
      id: 'api-st-2',
      role: 'Ingeniero AppSec',
      responsibilities: 'Pruebas de penetración focalizadas en OWASP API Top 10.',
      quantity: 1,
      trainingNeeds: 'Ninguna',
    },
  ],
  schedule: [
    {
      id: 'api-sch-1',
      phase: 'Contratos y suite funcional automatizada',
      startDate: '2026-11-26',
      endDate: '2026-12-01',
      deliverable: 'Pipeline CI verde y matriz de endpoints',
    },
    {
      id: 'api-sch-2',
      phase: 'Seguridad OWASP y carga sostenida',
      startDate: '2026-12-02',
      endDate: '2026-12-05',
      deliverable: 'Informe de seguridad y métricas k6',
    },
  ],
  deliverables: [
    'Plan Maestro de Pruebas (este documento)',
    'Scripts de Automatización y Colecciones API',
    'Registro de Defectos e Incidentes',
    'Informe de Resumen y Cierre de Pruebas',
  ],
  remainingTasks:
    'Alinear ventana de pruebas de caos con el equipo SRE antes del soak test.',
  risks: [
    {
      id: 'api-rk-1',
      code: 'RSK-01',
      title: 'Acceso indebido a transferencias de terceros (BOLA / IDOR)',
      category: 'Producto',
      probability: 3,
      impact: 5,
      mitigation: 'Incluir matriz cruzada de tokens y cuentas en suite automatizada para cada endpoint.',
      contingency: 'Bloqueo inmediato de release hasta corrección verificada por AppSec.',
    },
    {
      id: 'api-rk-2',
      code: 'RSK-02',
      title: 'Saturación de conexiones DB bajo picos de concurrencia',
      category: 'Producto',
      probability: 3,
      impact: 4,
      mitigation: 'Ejecutar pruebas de pico (2.000 RPS) y monitorear pool de conexiones PgBouncer.',
      contingency: 'Ajustar límites de rate-limiting y degradación controlada por cola asíncrona.',
    },
    {
      id: 'api-rk-3',
      code: 'RSK-03',
      title: 'Retraso en emisión de certificados mTLS de prueba',
      category: 'Proyecto',
      probability: 4,
      impact: 3,
      mitigation: 'Solicitar certificados con 10 días de antelación y usar PKI interna para CI.',
      contingency: 'Ejecutar fase funcional inicial con gateway en modo TLS estándar en entorno aislado.',
    },
  ],
};

const MOBILE_PLAN: TestPlanData = {
  standard: 'IEEE_829',
  documentId: 'TP-MOB-2026-04',
  title: 'Plan de Pruebas — App Móvil de Entregas Offline-First',
  projectName: 'RutaExacta Mobile (iOS / Android)',
  version: '2.0',
  status: 'Borrador',
  author: 'Sofía Paredes (Mobile QA Lead)',
  approver: 'Esteban Romero (Mobile Director)',
  date: '2026-11-24',
  summary:
    'Planificación de pruebas bajo formato IEEE 829 para la aplicación móvil de repartidores con escaneo de códigos QR, firma digital en pantalla y sincronización diferida en zonas sin señal.',
  objectives:
    'Asegurar cero pérdida de comprobantes de entrega en modo offline, validar el consumo de batería por debajo del 12% por jornada de 8 horas y certificar compatibilidad en iOS 17–18 y Android 12–15.',
  testBasis:
    'Prototipos Figma v4, historias de usuario de sincronización offline y matriz de dispositivos soportados en flota.',
  references: [
    'UX-RUTA-40 — Flujos de Entrega y Firma Digital',
    'MOB-SYNC-03 — Protocolo de Resolución de Conflictos Offline',
    'IEEE 829-2008 — Estándar de Documentación de Pruebas de Software',
  ],
  testItems: [
    {
      id: 'mob-ti-1',
      name: 'App RutaExacta Android (.aab)',
      version: 'v2.0.0-beta3',
      type: 'Aplicación Android',
      reference: 'Firebase App Distribution #204',
    },
    {
      id: 'mob-ti-2',
      name: 'App RutaExacta iOS (.ipa)',
      version: 'v2.0.0-beta3',
      type: 'Aplicación iOS',
      reference: 'TestFlight Build 204',
    },
  ],
  inScopeFeatures: [
    {
      id: 'mob-sf-1',
      name: 'Escaneo rápido de paquetes con cámara en baja iluminación',
      module: 'Captura y Escaneo',
      priority: 'Alta',
      testLevel: 'Sistema (Dispositivo Real)',
    },
    {
      id: 'mob-sf-2',
      name: 'Registro completo de entregas offline y sincronización automática al reconectar',
      module: 'Sincronización',
      priority: 'Alta',
      testLevel: 'Integración / Sistema',
    },
    {
      id: 'mob-sf-3',
      name: 'Geolocalización en segundo plano y trazado de ruta',
      module: 'GPS y Mapas',
      priority: 'Media',
      testLevel: 'Sistema',
    },
  ],
  outOfScopeFeatures: [
    {
      id: 'mob-osf-1',
      name: 'Soporte para tablets y orientación horizontal',
      reason: 'La app está restringida a teléfonos en orientación vertical por política operativa.',
    },
  ],
  constraints:
    'Los repartidores usan predominantemente dispositivos Android de gama media (4 GB RAM) con conectividad intermitente 3G/4G.',
  testLevels: [
    'Pruebas de Integración',
    'Pruebas de Sistema',
    'Pruebas de Aceptación (UAT)',
    'Pruebas de Humo (Smoke)',
  ],
  testTypes: [
    'Funcional',
    'Regresión',
    'Usabilidad',
    'Compatibilidad Cross-Browser',
    'Recuperación ante Fallos',
  ],
  testTechniques: [
    'Transición de Estados',
    'Pruebas Exploratorias',
    'Pruebas Basadas en Riesgos',
    'Análisis de Valores Límite',
  ],
  approachSummary:
    'Combinación de pruebas en granja de dispositivos reales (Samsung A54, Moto G54, iPhone 13/15), simulación de interrupciones (llamadas, modo avión, app en background, batería < 10%) y pruebas de campo controladas.',
  entryCriteria: [
    'Builds firmados publicados en TestFlight y Firebase App Distribution.',
    'Backend de sincronización en versión compatible desplegado en QA.',
  ],
  exitCriteria: [
    'Crash-free sessions >= 99.5% durante las pruebas de campo y laboratorio.',
    '100% de las entregas creadas en modo avión sincronizadas sin duplicados ni pérdida de foto/firma.',
  ],
  suspensionCriteria: [
    'Cierre inesperado (crash) al abrir cámara o al cambiar de red Wi-Fi a celular.',
    'Corrupción de base de datos local SQLite tras actualización de versión.',
  ],
  resumptionRequirements: [
    'Nuevo build publicado en canales beta con prueba de migración de base local verificada.',
  ],
  qualityMetrics:
    'Crash-free rate >= 99.5%, consumo de batería <= 12% en 8 h, tiempo de arranque en frío < 2.2 s.',
  environments: [
    {
      id: 'mob-env-1',
      name: 'Laboratorio de Dispositivos Reales',
      configuration: '6 dispositivos físicos (4 Android 12–15, 2 iOS 17–18) con proxy Charles/Proxyman',
      tools: 'Appium, Maestro, Proxyman, Android Profiler',
      availability: 'Permanente durante el sprint',
    },
  ],
  testDataRequirements:
    'Hojas de ruta con 50 paquetes simulados, códigos QR dañados/duplicados y usuarios repartidores con distintos permisos GPS.',
  staffing: [
    {
      id: 'mob-st-1',
      role: 'Mobile QA Lead',
      responsibilities: 'Planificación, pruebas exploratorias de red/interrupciones y métricas de rendimiento móvil.',
      quantity: 1,
      trainingNeeds: 'Ninguna',
    },
    {
      id: 'mob-st-2',
      role: 'Analista QA Mobile',
      responsibilities: 'Ejecución de regresión en matriz de dispositivos y pruebas de campo.',
      quantity: 2,
      trainingNeeds: 'Uso de perfiles de red degradada en Proxyman',
    },
  ],
  schedule: [
    {
      id: 'mob-sch-1',
      phase: 'Regresión en matriz de dispositivos y pruebas offline',
      startDate: '2026-11-26',
      endDate: '2026-12-01',
      deliverable: 'Matriz de compatibilidad completada',
    },
    {
      id: 'mob-sch-2',
      phase: 'Piloto en campo con 10 repartidores (UAT)',
      startDate: '2026-12-02',
      endDate: '2026-12-04',
      deliverable: 'Informe de telemetría y acta de liberación a tiendas',
    },
  ],
  deliverables: [
    'Plan Maestro de Pruebas (este documento)',
    'Especificación y Casos de Prueba',
    'Registro de Defectos e Incidentes',
    'Informe de Resumen y Cierre de Pruebas',
  ],
  remainingTasks:
    'Validar tiempos de revisión de App Store Connect antes de congelar el build candidato.',
  risks: [
    {
      id: 'mob-rk-1',
      code: 'RSK-01',
      title: 'Pérdida de cola de sincronización al cerrar la app forzosamente',
      category: 'Producto',
      probability: 3,
      impact: 5,
      mitigation: 'Persistir cola transaccional en SQLite con escritura atómica antes de mostrar confirmación visual.',
      contingency: 'Habilitar exportación local de respaldo JSON desde menú de soporte técnico.',
    },
    {
      id: 'mob-rk-2',
      code: 'RSK-02',
      title: 'Rechazo en revisión de tiendas por permisos de ubicación en segundo plano',
      category: 'Proyecto',
      probability: 3,
      impact: 4,
      mitigation: 'Preparar video demostrativo y justificación conforme a políticas de Google Play y Apple.',
      contingency: 'Publicar distribución empresarial temporal mientras se resuelve la apelación.',
    },
    {
      id: 'mob-rk-3',
      code: 'RSK-03',
      title: 'Consumo excesivo de batería por polling frecuente de GPS',
      category: 'Producto',
      probability: 4,
      impact: 3,
      mitigation: 'Medir consumo en sesiones de 4 horas con Android Battery Historian e Instruments.',
      contingency: 'Reducir frecuencia de muestreo GPS cuando el vehículo está detenido.',
    },
  ],
};

const BLANK_PLAN: TestPlanData = {
  standard: 'ISO_29119',
  documentId: 'TP-2026-001',
  title: '',
  projectName: '',
  version: '1.0',
  status: 'Borrador',
  author: '',
  approver: '',
  date: new Date().toISOString().slice(0, 10),
  summary: '',
  objectives: '',
  testBasis: '',
  references: [],
  testItems: [],
  inScopeFeatures: [],
  outOfScopeFeatures: [],
  constraints: '',
  testLevels: ['Pruebas de Integración', 'Pruebas de Sistema'],
  testTypes: ['Funcional', 'Regresión'],
  testTechniques: ['Partición de Equivalencia', 'Pruebas Basadas en Riesgos'],
  approachSummary: '',
  entryCriteria: [],
  exitCriteria: [],
  suspensionCriteria: [],
  resumptionRequirements: [],
  qualityMetrics: '',
  environments: [],
  testDataRequirements: '',
  staffing: [],
  schedule: [],
  deliverables: ['Plan Maestro de Pruebas (este documento)', 'Informe de Resumen y Cierre de Pruebas'],
  remainingTasks: '',
  risks: [],
};

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: 'ecommerce',
    name: 'E-commerce Checkout',
    domain: 'Comercio Electrónico · ISO 29119-3',
    description:
      'Plan completo para checkout multimoneda, pasarelas de pago 3DS, impuestos y pruebas de carga.',
    highlights: '4 funcionalidades · 5 riesgos mapeados · 4 hitos',
    data: ECOMMERCE_PLAN,
  },
  {
    id: 'api',
    name: 'API REST Financiera',
    domain: 'Open Banking / Backend · ISO 29119-3',
    description:
      'Enfocado en contratos OpenAPI, seguridad OWASP API Top 10, mTLS y throughput sostenido.',
    highlights: '3 funcionalidades · 3 riesgos críticos · k6 / ZAP',
    data: API_PLAN,
  },
  {
    id: 'mobile',
    name: 'App Móvil Offline-First',
    domain: 'Logística iOS / Android · IEEE 829',
    description:
      'Cubre sincronización diferida, matriz de dispositivos reales, batería y piloto de campo UAT.',
    highlights: '3 funcionalidades · 3 riesgos · Formato IEEE 829',
    data: MOBILE_PLAN,
  },
  {
    id: 'blank',
    name: 'Plan en Blanco',
    domain: 'Inicio desde cero · Personalizable',
    description:
      'Estructura vacía con valores mínimos iniciales para redactar tu plan paso a paso sin datos de ejemplo.',
    highlights: 'Limpio · Listo para completar',
    data: BLANK_PLAN,
  },
];

export const DEFAULT_TEST_PLAN: TestPlanData = ECOMMERCE_PLAN;
