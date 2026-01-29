# Sprint 1 Ajuste: Selección de Rol Funcional

## Resumen
Se implementó la funcionalidad de selección de rol funcional durante el registro de usuarios. Los usuarios ahora **deben seleccionar su rol** al registrarse en lugar de recibir un rol por defecto.

## Cambios Realizados

### Backend

#### 1. **user.entity.ts** - Actualización de Enum
- **Cambio**: Renombré `UserRole.SUPERVISOR` → `UserRole.SUPERVISOR_POA`
- **Razón**: Mejor claridad y alineación con los roles funcionales del sistema
- **Roles disponibles**:
  - `ADMIN` - Administrador del sistema
  - `SUPERVISOR_POA` - Supervisor de Planes Operativos
  - `COORDINATOR` - Coordinador
  - `USER` - Usuario estándar (rol por defecto, no seleccionable)

#### 2. **auth.dto/index.ts** - DTO de Registro
- **Cambio anterior**: RegisterDto tenía `role: UserRole` con validación `@IsEnum(UserRole)`
- **Estado actual**: ✓ Ya implementado en cambios previos

#### 3. **auth.service.ts** - Servicio de Autenticación
- **Cambio anterior**: `register()` ahora usa `registerDto.role` en lugar de rol por defecto
- **Estado actual**: ✓ Ya implementado en cambios previos

#### 4. **admin.controller.ts** - Controlador de Administración
- **Cambio**: Actualicé `@Roles(UserRole.ADMIN, UserRole.SUPERVISOR)` → `@Roles(UserRole.ADMIN, UserRole.SUPERVISOR_POA)`
- **Ubicación**: Línea 78 en el endpoint `GET /admin/users`

### Frontend

#### 1. **register/page.tsx** - Página de Registro
- **Cambios**:
  - Agregué constante `ROLES` con tres opciones:
    - ADMIN - "Administrador" (Gestiona usuarios y aprobaciones)
    - SUPERVISOR_POA - "Supervisor POA" (Supervisa planes operativos)
    - COORDINATOR - "Coordinador" (Coordina actividades y tareas)
  - Agregué estado `role: 'COORDINATOR'` (rol por defecto en el formulario)
  - Implementé selector de rol con **radio buttons** para mejor UX
  - Cada opción muestra el nombre, descripción y permite seleccionar
  - El rol se envía en la petición de registro
  - El mensaje de éxito muestra el rol seleccionado

#### 2. **AuthContext.tsx** - Contexto de Autenticación
- **Cambios**:
  - Actualicé firma de `register()` para incluir parámetro `role: string`
  - El método ahora envía el rol al backend: `{ ..., role }`
  - Actualicé interfaz `AuthContextType`

## Flujo de Uso Actualizado

### Registro con Selección de Rol

1. **Usuario abre página de registro** (`/register`)
2. **Completa formulario**:
   - Nombre
   - Apellido
   - Email
   - **Selecciona rol funcional** (ADMIN, SUPERVISOR_POA, COORDINATOR)
   - Contraseña
   - Confirma contraseña
3. **Envía registro**:
   - Frontend valida datos locales
   - Envía POST a `/auth/register` con rol incluido
   - Backend valida con `@IsEnum(UserRole)`
   - Usuario se crea con estado `PENDING` y rol seleccionado
4. **Mensaje de éxito**:
   - Muestra "Tu rol: [Nombre del rol seleccionado]"
   - Avisa que está pendiente de aprobación
   - Redirige a login después de 2 segundos

### Aprobación por Admin

1. **Admin accede a `/admin`**
2. **Ve usuarios pendientes** con sus roles asignados
3. **Aprueba o rechaza** usuarios
4. **Al aprobar**:
   - Estado cambia a `ACTIVE`
   - Usuario puede hacer login
   - Su rol se mantiene
   - Es visible en el Sidebar y AuthContext

## Validación de Cambios

### Backend
- ✓ RegisterDto valida `@IsEnum(UserRole)`
- ✓ AuthService respeta el rol enviado
- ✓ AdminController usa rol actualizado
- ✓ No hay referencias a `UserRole.SUPERVISOR`

### Frontend
- ✓ Registro muestra selector de roles
- ✓ AuthContext envía rol al backend
- ✓ Mensaje de éxito muestra rol seleccionado
- ✓ Flujo completo: registro → aprobación → login → rol visible

## Testing Recomendado

1. **Prueba de Registro**:
   - Registrarse con cada rol (ADMIN, SUPERVISOR_POA, COORDINATOR)
   - Verificar que el rol se guarda correctamente

2. **Prueba de Admin Dashboard**:
   - Admin aprueba usuarios con diferentes roles
   - Verificar que los roles se muestran en la lista

3. **Prueba de Login**:
   - Hacer login con usuario aprobado
   - Verificar que `/auth/me` devuelve el rol correcto
   - Verificar que Sidebar muestra el rol correcto

4. **Prueba de Control de Acceso**:
   - ADMIN puede ver `/admin` ✓
   - SUPERVISOR_POA puede ver `/admin` ✓
   - COORDINATOR no debería poder acceder a `/admin` (si hay restricción)

## Notas

- El rol `USER` se mantiene como respaldo, pero no es seleccionable por usuarios
- La selección de rol es obligatoria (no hay valor vacío)
- El rol se asigna en el momento del registro, no se puede cambiar después sin admin
- Los roles se usan luego para permisos a nivel de programa

## Archivos Modificados

- ✓ `backend/src/users/entities/user.entity.ts`
- ✓ `backend/src/users/admin.controller.ts`
- ✓ `frontend/src/app/register/page.tsx`
- ✓ `frontend/src/context/AuthContext.tsx`

**Estado**: 🟢 Implementación completa del selector de rol funcional
