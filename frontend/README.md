# POA Tracker - Frontend

Frontend construido con Next.js 14, TypeScript y Tailwind CSS.

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Variables de Entorno

Copia `.env.example` a `.env.local` y configura las variables:

```bash
cp .env.example .env.local
```

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/              # App Router de Next.js
│   │   ├── page.tsx      # Página principal
│   │   ├── login/        # Página de login
│   │   ├── layout.tsx    # Layout raíz
│   │   └── globals.css   # Estilos globales
│   ├── components/       # Componentes reutilizables
│   │   ├── Layout.tsx    # Layout principal con Sidebar y Topbar
│   │   ├── Sidebar.tsx   # Barra lateral de navegación
│   │   └── Topbar.tsx    # Barra superior
│   └── lib/
│       └── api.ts        # Cliente API
├── public/               # Archivos estáticos
└── package.json
```

## 🎨 Características

- **Next.js 14** con App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilos
- **Responsive Design** con sidebar colapsable
- **Cliente API** configurado con axios

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## 🔗 Integración con Backend

El frontend se comunica con el backend a través de la variable de entorno `NEXT_PUBLIC_API_URL`:

```typescript
// .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 🎯 Páginas Disponibles

- `/` - Dashboard principal
- `/login` - Página de inicio de sesión
- `/poas` - Lista de POAs (próximo sprint)
- `/activities` - Actividades (próximo sprint)
- `/reports` - Reportes (próximo sprint)
- `/settings` - Configuración (próximo sprint)
