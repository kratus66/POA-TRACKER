# 🔐 Sprint 1 - Autenticación y Registro Controlado

## ✅ Completado

### Backend (NestJS + TypeORM)

#### Entidades
- ✅ **User** con rol (ADMIN, SUPERVISOR, COORDINATOR, USER) y status (PENDING, ACTIVE, REJECTED)
- ✅ **AuditLog** para tracking de acciones de admin

#### Autenticación
- ✅ **JWT** con cookies httpOnly
- ✅ **bcrypt** para hash de contraseñas
- ✅ **Passport + @nestjs/jwt** configurado
- ✅ **CORS actualizado** para soportar múltiples puertos

#### Endpoints de Autenticación
```
POST   /auth/register      - Crear usuario (status=PENDING)
POST   /auth/login         - Login solo ACTIVE (JWT en cookie)
GET    /auth/me            - Datos del usuario actual (requiere auth)
POST   /auth/logout        - Cerrar sesión
```

#### Endpoints de Admin
```
GET    /admin/users/pending           - Usuarios pendientes
PATCH  /admin/users/:id/approve       - Aprobar usuario
PATCH  /admin/users/:id/reject        - Rechazar usuario
GET    /admin/users                   - Todos los usuarios
```

#### Guards & Decoradores
- ✅ **JwtAuthGuard** - Protege rutas autenticadas
- ✅ **RolesGuard** - Verifica roles del usuario
- ✅ **@Roles()** - Decorador para especificar roles requeridos
- ✅ **@CurrentUser()** - Decorador para obtener usuario actual

#### Auditoría
- ✅ Registro automático de approve/reject
- ✅ Timestamps y metadata

### Frontend (Next.js + Tailwind)

#### Autenticación
- ✅ **AuthContext** - Context global de autenticación
- ✅ **useAuth hook** - Acceso fácil al estado de auth
- ✅ **API client** con withCredentials=true para cookies

#### Páginas
- ✅ **/login** - Form de login real
- ✅ **/register** - Form de registro con validaciones
- ✅ **/admin** - Vista de usuarios pendientes (solo ADMIN)

#### Funcionalidades
- ✅ Protección de rutas autenticadas
- ✅ Estados: PENDING, ACTIVE, REJECTED con UI específica
- ✅ Logout con limpieza de cookies
- ✅ Mensaje de sesión en Sidebar
- ✅ Modal para rechazar con motivo

#### Layout Mejorado
- ✅ Sidebar actualizado con info del usuario
- ✅ Botón de logout
- ✅ Indicador de estado (PENDING/REJECTED)
- ✅ Rutas dinámicas según rol

## 📋 Flujo Completo

### 1. Registro de Usuario
```
Usuario → Completa formulario → POST /users/register
→ Usuario guardado con status=PENDING
→ Usuario ve mensaje "Pendiente de aprobación"
```

### 2. Aprobación por Admin
```
Admin → Va a /admin
→ Ve tabla de usuarios pendientes
→ Hace clic en "Aprobar"
→ Usuario pasa a status=ACTIVE
→ Se registra en AuditLog
```

### 3. Login del Usuario Aprobado
```
Usuario → Intenta login
→ POST /auth/login (email + password)
→ Verifica status=ACTIVE
→ Genera JWT → Guarda en cookie httpOnly
→ Redirige a /
→ Sesión activa confirmada
```

### 4. Rechazo de Solicitud
```
Admin → Hace clic en "Rechazar"
→ Modal solicita motivo
→ PATCH /admin/users/:id/reject
→ Usuario pasa a status=REJECTED
→ Verá mensaje en /login si intenta entrar
```

## 🔧 Dependencias Nuevas

### Backend
```json
{
  "@nestjs/jwt": "^11.0.1",
  "@nestjs/passport": "^10.0.3",
  "bcrypt": "^5.1.1",
  "cookie-parser": "^1.4.6",
  "passport": "^0.7.0",
  "passport-jwt": "^4.0.1"
}
```

### Frontend
- Axios (ya instalado) - con withCredentials
- Context API (nativo React)

## 📁 Estructura de Archivos

### Backend Nuevo
```
backend/src/
├── auth/
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── decorators/
│   │   ├── roles.decorator.ts
│   │   └── current-user.decorator.ts
│   └── dto/
│       └── index.ts
├── users/
│   ├── users.service.ts
│   ├── admin.controller.ts
│   ├── users.module.ts
│   ├── entities/
│   │   └── user.entity.ts
│   └── dto/
│       └── index.ts
├── audit/
│   ├── audit.module.ts
│   └── entities/
│       └── audit-log.entity.ts
└── app.module.ts (actualizado)
```

### Frontend Nuevo
```
frontend/src/
├── app/
│   ├── login/
│   │   └── page.tsx (actualizado)
│   ├── register/
│   │   └── page.tsx (nuevo)
│   ├── admin/
│   │   └── page.tsx (nuevo)
│   ├── layout.tsx (actualizado)
│   └── page.tsx (actualizado)
├── components/
│   ├── Layout.tsx (actualizado)
│   └── Sidebar.tsx (actualizado)
├── context/
│   └── AuthContext.tsx (nuevo)
└── lib/
    └── api.ts (actualizado)
```

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcrypt (10 rondas)
- ✅ JWT en cookies httpOnly (no accesible por JavaScript)
- ✅ Secure flag activado en producción
- ✅ SameSite=Lax para prevenir CSRF
- ✅ CORS configurado correctamente
- ✅ Validaciones en DTOs
- ✅ Guards de autenticación y roles

## 🧪 Demo Sprint 1

Para probar:

1. **Instalar dependencias:**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Iniciar servicios:**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run start:dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

3. **Flujo de prueba:**
   - Abre http://localhost:3002/register
   - Crea una cuenta (cualquier email/contraseña)
   - Verás mensaje "Pendiente de aprobación"
   - Abre otra pestaña con http://localhost:3002/login
   - Intenta login → Error "cuenta pendiente"
   - Abre http://localhost:4000/docs
   - Con admin ficticio (necesitas crear uno en BD):
     ```sql
     INSERT INTO users (id, firstName, lastName, email, password, role, status, "createdAt", "updatedAt")
     VALUES (
       gen_random_uuid(),
       'Admin',
       'Test',
       'admin@poa.com',
       '$2b$10$... (bcrypt hash)...',
       'ADMIN',
       'ACTIVE',
       NOW(),
       NOW()
     );
     ```
   - Usa Swagger para llamar a `/admin/users/pending`
   - Aprueba el usuario desde Swagger o ahora desde `/admin`
   - El usuario puede hacer login
   - Sesión activa en el dashboard

## ✨ Características Sprint 1

✅ Registro de usuarios con aprobación  
✅ Autenticación JWT con cookies httpOnly  
✅ Sistema de roles (ADMIN, SUPERVISOR, COORDINATOR, USER)  
✅ Estados de usuario (PENDING, ACTIVE, REJECTED)  
✅ Admin dashboard para gestión de solicitudes  
✅ Auditoría de aprobaciones/rechazos  
✅ Protección de rutas por autenticación  
✅ Protección de endpoints por rol  
✅ UI con feedback de estado  
✅ Manejo de errores y validaciones  

## 🎯 Próximos Sprints

Sprint 2 - POAs:
- Crear entidad POA con campos
- CRUD de POAs
- Filtrado por usuario/estado

Sprint 3 - Actividades:
- Vincular actividades a POAs
- Tracking de progreso
- Notificaciones

Sprint 4 - Reportes:
- Dashboards analíticos
- Exportación a PDF/Excel
- Gráficos de progreso
