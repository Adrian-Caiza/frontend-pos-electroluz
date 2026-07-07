# ⚡ Ferreconst — Sistema de Gestión Punto de Venta

> Frontend del sistema de gestión comercial e inventario para ferreterías, desarrollado como Trabajo de Integración Curricular en la Escuela Politécnica Nacional.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?style=flat-square&logo=vercel&logoColor=white)

---

## 📸 Vista previa

<img width="1903" height="1032" alt="image" src="https://github.com/user-attachments/assets/c1a7f4cd-37a3-42e4-8edd-04ba23fcda64" />

> `screenshots/login.png`

<img width="1887" height="1022" alt="image" src="https://github.com/user-attachments/assets/795b70dc-b9f0-4e24-ab38-4b047452583e" />

> `screenshots/dashboard.png`

<img width="1887" height="1027" alt="image" src="https://github.com/user-attachments/assets/6601847a-aa89-42d7-b319-820a9438ce56" />

> `screenshots/terminal-pos.png`

---

## 📋 Tabla de contenidos

- [Descripción](#-descripción)
- [Funcionalidades por rol](#-funcionalidades-por-rol)
- [Stack tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Primeros pasos](#-primeros-pasos)
- [Scripts disponibles](#-scripts-disponibles)
- [Variables de entorno](#-variables-de-entorno)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Rendimiento](#-rendimiento)
- [Despliegue](#-despliegue)
- [Autor](#-autor)

---

## 📌 Descripción

Ferreconst es una aplicación web de gestión comercial diseñada para ferreterías. Permite al personal registrar proformas en el mostrador, consultar y actualizar el inventario en tiempo real, y administrar el negocio desde un panel de control centralizado.

El sistema está construido bajo una **arquitectura multi-empresa (multi-tenant)**: un solo despliegue puede dar servicio a múltiples ferreterías, cada una con sus propios usuarios, catálogos y sucursales.

**Demo en producción:** [https://app.ferreconst.space](https://app.ferreconst.space)

---

## 👥 Funcionalidades por rol

El sistema maneja dos roles operativos dentro de cada ferretería:

### 🔑 Jefe — acceso total

| Módulo | Descripción |
|--------|-------------|
| **Dashboard** | KPIs de ventas, catálogo, clientes y alertas. Gráfico de tendencia de ventas. |
| **Sucursales** | Crear y gestionar locales físicos de la ferretería. |
| **Cajas** | Registrar y vincular estaciones de cobro a una sucursal. |
| **Usuarios** | Crear, editar y suspender el acceso del personal, asignando roles. |
| **Catálogos** | Categorías, marcas, medidas, proveedores y métodos de pago. |
| **Productos** | Catálogo completo con imagen, precio, stock mínimo/máximo y vínculos a marca/categoría. |
| **Inventario** | Control de existencias por producto y por sucursal. |
| **Clientes** | Directorio de compradores con datos fiscales y de contacto. |
| **Terminal POS** | Registro ágil de proformas, carrito de compras y cobro. |
| **Historial** | Auditoría completa de proformas con filtros y descarga de PDF. |
| **Alertas** | Notificaciones de stock bajo configuradas por umbral de producto. |

### 👤 Empleado — acceso operativo

Accede a todos los módulos **excepto** Dashboard, Sucursales, y creación de usuarios. Su vista principal al iniciar sesión es el **Terminal POS**.

---

## 🛠 Stack tecnológico

| Categoría | Tecnología | Propósito |
|-----------|------------|-----------|
| **UI** | React 18 | Construcción de componentes reutilizables |
| **Lenguaje** | TypeScript 5 | Tipado estático y seguridad en tiempo de desarrollo |
| **Build tool** | Vite 5 | Compilación y hot-reload ultrarrápido |
| **Estilos** | Tailwind CSS 3 + shadcn/Radix UI | Sistema de diseño responsivo |
| **Routing** | React Router DOM 6 | Navegación SPA con protección de rutas |
| **Estado global** | Zustand | Sesión del usuario y carrito del Terminal POS |
| **Peticiones HTTP** | Axios | Cliente HTTP con interceptores para JWT |
| **Caché de servidor** | TanStack Query | Sincronización y caché de datos del servidor |
| **Validación** | Zod + React Hook Form | Validación de formularios en tiempo real |
| **Diseño** | Figma | Prototipado y mockups de alta fidelidad |

---

## 🏛 Arquitectura

El proyecto implementa **Clean Architecture** adaptada al entorno de React. Cada módulo de negocio sigue la misma estructura de 4 capas:

```
src/modules/<nombre>/
├── domain/
│   ├── entities/          # Entidades del negocio (ej. Producto.ts)
│   └── repositories/      # Interfaces de repositorio (IProductoRepository.ts)
├── application/
│   └── use-cases/         # Casos de uso (ej. CreateProductoUseCase.ts)
├── infrastructure/
│   ├── repositories/      # Implementación de repositorios
│   └── services/          # Llamadas a la API REST (productoApi.ts)
└── presentation/
    ├── components/        # Componentes visuales
    ├── hooks/             # Custom hooks (useProductos.ts)
    ├── schemas/           # Esquemas de validación Zod
    └── table/             # Columnas de tablas interactivas
```

**Piezas transversales compartidas por todos los módulos:**

```
src/shared/
├── apiClient.ts           # Instancia de Axios con JWT interceptors
├── useAuthStore.ts        # Store de Zustand para sesión activa
└── components/            # DataTable, Modal base, AlertBell, etc.
```

<!-- SCREENSHOT: Coloca aquí el diagrama de arquitectura (Figura 2.2 de la tesis) -->
> `screenshots/arquitectura.png`

---

## 🚀 Primeros pasos

### Prerrequisitos

- **Node.js** v18 o superior
- **pnpm** v8 o superior (recomendado) — también funciona con npm o yarn

```bash
# Verificar versiones
node --version   # >= 18.0.0
pnpm --version   # >= 8.0.0
```

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Adrian-Caiza/frontend-pos-electroluz.git
cd frontend-pos-electroluz

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con la URL de tu API (ver sección Variables de entorno)

# 4. Iniciar el servidor de desarrollo
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## 📜 Scripts disponibles

```bash
pnpm dev          # Servidor de desarrollo con hot-reload
pnpm build        # Compilación optimizada para producción
pnpm preview      # Vista previa del build de producción
pnpm lint         # Análisis estático con ESLint
pnpm type-check   # Verificación de tipos con TypeScript
```

---

## 🔐 Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# URL base de la API REST del backend
VITE_API_URL=https://api.tu-backend.com

# (Opcional) Entorno de ejecución
VITE_APP_ENV=development
```

> **Importante:** nunca subas tu archivo `.env.local` al repositorio. Está incluido en `.gitignore` por defecto.

---

## 📁 Estructura del proyecto

```
frontend-pos-electroluz/
├── public/                    # Archivos estáticos
├── src/
│   ├── app/                   # Páginas enrutadas (Next.js-like convention)
│   │   ├── auth/login/
│   │   ├── dashboard/
│   │   ├── terminal/
│   │   ├── historial-ventas/
│   │   ├── productos/
│   │   ├── stock/
│   │   ├── clientes/
│   │   ├── usuarios/
│   │   ├── sucursales/
│   │   ├── caja/
│   │   ├── categorias/
│   │   ├── marcas/
│   │   ├── medidas/
│   │   ├── proveedores/
│   │   ├── metodos-pago/
│   │   └── alertas/
│   ├── modules/               # Lógica de negocio (Clean Architecture)
│   │   ├── auth/
│   │   ├── caja/
│   │   ├── categoria/
│   │   ├── cliente/
│   │   ├── marca/
│   │   ├── medida/
│   │   ├── metodo-pago/
│   │   ├── producto/
│   │   ├── proforma/
│   │   ├── proveedor/
│   │   ├── stock/
│   │   ├── sucursal/
│   │   └── usuario/
│   ├── shared/                # Componentes, hooks y utilidades transversales
│   │   ├── components/
│   │   └── hooks/
│   ├── App.tsx                # Árbol de rutas con AuthGuard y RoleGuard
│   └── main.tsx               # Punto de entrada
├── .env.example               # Plantilla de variables de entorno
├── components.json            # Configuración de shadcn/ui
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## ⚡ Rendimiento

Resultados de las auditorías de producción sobre `https://app.ferreconst.space`:

### Lighthouse (Google Chrome)

| Página | Performance | Accessibility | Best Practices | SEO |
|--------|:-----------:|:-------------:|:--------------:|:---:|
| Login | 98 | 95 | 100 | 82 |
| Dashboard | 98 | 100 | 100 | 83 |
| Terminal POS | 97 | 90 | 100 | 83 |

### WebPageTest — Página de Login

| Métrica | Valor | Interpretación |
|---------|-------|----------------|
| TTFB | 0.245s | Tiempo de respuesta del servidor |
| FCP / LCP | 0.879s | Primer y mayor contenido renderizado |
| CLS | 0 | Sin saltos visuales inesperados |
| Speed Index | 0.891s | Velocidad de completado visual |
| TBT | 0s | Sin bloqueos del hilo principal |
| Page Weight | 478 KB | Peso total de la página |

### GTmetrix

| Métrica | Valor |
|---------|-------|
| Grade | **A** |
| Performance | 92% |
| Structure | 100% |

<!-- SCREENSHOT: Coloca aquí la captura de Lighthouse o GTmetrix -->
> `screenshots/lighthouse.png`

---

## 🌐 Compatibilidad de navegadores

| Módulo / Funcionalidad | Chrome | Firefox | Edge | Brave | Opera |
|------------------------|:------:|:-------:|:----:|:-----:|:-----:|
| Autenticación y sesión | ✓ | ✓ | ✓ | ⚠ | ✓ |
| Módulos administrativos | ✓ | ✓ | ✓ | ✓ | ✓ |
| Catálogos base | ✓ | ✓ | ✓ | ✓ | ✓ |
| Terminal POS y proformas | ✓ | ✓ | ✓ | ✓ | ✓ |
| Auditoría y alertas | ✓ | ✓ | ✓ | ✓ | ✓ |
| Diseño responsivo | ✓ | ✓ | ✓ | ✓ | ✓ |

> **⚠ Brave:** el escudo de privacidad bloquea `localStorage` en modo privado, interrumpiendo la persistencia del token JWT. Se resuelve desactivando el escudo para el dominio del sistema.

---

## 🚢 Despliegue

El proyecto está configurado para desplegarse en **Vercel** de forma automática.

### Despliegue manual

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Iniciar sesión
vercel login

# 3. Desplegar
vercel --prod
```

### Variables de entorno en producción

Configura `VITE_API_URL` directamente en el panel de Vercel:
`Settings → Environment Variables → VITE_API_URL`

El archivo `vercel.json` incluido en el repositorio ya maneja el enrutamiento SPA (redirect de todas las rutas a `index.html`).

---

## 👨‍💻 Autor

**Adrian Fabricio Caiza Alomoto**

Trabajo de Integración Curricular — Escuela Politécnica Nacional

[![GitHub](https://img.shields.io/badge/GitHub-adriancaiza-181717?style=flat-square&logo=github)](https://github.com/<tu-usuario>)

---

<div align="center">
  <sub>Desarrollado con ❤️ para la Ferretería Electroluz K&B</sub>
</div>
