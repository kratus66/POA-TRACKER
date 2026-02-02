# 🔧 GUÍA DE INTEGRACIÓN - SPRINT 6+7

## Cómo integrar evidencias en Reviews Page

### 1. Importar componentes

```typescript
// app/reviews/page.tsx

import { EvidenceUpload } from '@/components/EvidenceUpload';
import { EvidencesList } from '@/components/EvidencesList';
import { AuditHistory } from '@/components/AuditHistory';
```

### 2. En la sección de detalles de una actividad

```typescript
{selectedValidation && (
  <div className="mt-6 space-y-6">
    {/* Existing validation form ... */}

    {/* ===== NUEVO: Evidencias ===== */}
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold mb-4">📎 Evidencias</h3>
      
      {/* Componente de upload */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3">Subir nueva evidencia</h4>
        <EvidenceUpload
          reviewId={selectedReview.id}
          activityId={selectedValidation.activityId}
          onUploadSuccess={() => {
            // Refrescar lista de evidencias
            setShowEvidences(true);
          }}
          onError={(error) => alert(`Error: ${error}`)}
        />
      </div>

      {/* Listado de evidencias */}
      <div>
        <h4 className="text-sm font-medium mb-3">
          Archivos subidos
        </h4>
        <EvidencesList
          reviewId={selectedReview.id}
          activityId={selectedValidation.activityId}
          onDelete={() => {
            // Refrescar si es necesario
          }}
        />
      </div>
    </div>

    {/* ===== NUEVO: Auditoría ===== */}
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold mb-4">📋 Historial de cambios</h3>
      <AuditHistory
        entityType="AGREEMENT_ACTIVITY"
        entityId={selectedValidation.activityId}
        limit={20}
      />
    </div>
  </div>
)}
```

---

## Cómo integrar en Activity Tracking Page

### 1. Mostrar evidencias relacionadas

```typescript
// app/activity-tracking/page.tsx

{editingId === tracking.id && (
  <div className="mt-4 pt-4 border-t space-y-4">
    {/* Form existente */}
    
    {/* NUEVO: Mostrar evidencias de esta actividad */}
    <div className="bg-blue-50 p-4 rounded">
      <h4 className="font-medium mb-3">📎 Evidencias de apoyo</h4>
      <EvidencesList
        reviewId={/* obtener del tracking */}
        activityId={/* obtener del tracking */}
      />
    </div>
  </div>
)}
```

---

## Cómo manejar errores de edición

### Control de edición bloqueado

```typescript
// En el manejador de actualización

try {
  const response = await fetch(
    `/api/agreement-activities/${activityId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    }
  );

  if (response.status === 403) {
    // Revisión cerrada
    const error = await response.json();
    alert(error.message); // "No se puede editar. La revisión está en estado CLOSED..."
    setEditingId(null);
    return;
  }

  if (!response.ok) throw new Error('Error al actualizar');

  // Éxito
  const updated = await response.json();
  setFormData(updated);
  setEditingId(null);
  
} catch (error) {
  console.error('Error:', error);
  alert('Error al actualizar actividad');
}
```

---

## Configuración de S3 (Producción)

### En backend - main.ts

```typescript
import { MulterModule } from '@nestjs/platform-express';
import * as s3Storage from 'multer-s3';
import * as AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

app.use(
  MulterModule.register({
    storage: s3Storage({
      s3: s3,
      bucket: process.env.AWS_S3_BUCKET,
      acl: 'private',
      key: (req, file, cb) => {
        const folder = `evidences/${new Date().getFullYear()}`;
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, `${folder}/${fileName}`);
      },
    }),
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);
```

### .env para S3

```env
AWS_ACCESS_KEY=tu_access_key
AWS_SECRET_KEY=tu_secret_key
AWS_S3_BUCKET=tu-bucket-name
AWS_S3_REGION=us-east-1
```

---

## Permisos y Roles

### Quién puede subir evidencias
- ✅ ADMIN
- ✅ SUPERVISOR_POA
- ✅ COORDINATOR
- ❌ REVIEWER (solo lectura)

### Quién puede editar actividades
- ✅ ADMIN (siempre)
- ✅ SUPERVISOR_POA (si Review DRAFT/REOPENED)
- ✅ COORDINATOR (si Review DRAFT/REOPENED)
- ❌ Otros (nunca)

### Implementar guard

```typescript
// guards/can-edit-activity.guard.ts

import { Injectable, ForbiddenException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CanEditActivityGuard implements CanActivate {
  canActivate(context: ExecutionContext): Observable<boolean> | Promise<boolean> | boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.role === UserRole.ADMIN) {
      return true; // Admin siempre puede
    }

    const activityId = request.params.id;
    // Verificar si puede editar
    return this.activityService.canEditActivity(activityId);
  }
}
```

---

## Notificaciones (Opcional)

### Cuando se carga una evidencia

```typescript
// En evidences.service.ts afterSave

async logEvidenceUpload(evidence: Evidence, userId: string) {
  await this.auditsService.log({
    entityType: AuditEntityType.EVIDENCE,
    entityId: evidence.id,
    action: AuditAction.UPLOAD_EVIDENCE,
    userId,
    newData: evidence,
  });

  // Enviar notificación (si está configurado)
  // await this.notificationService.send({
  //   type: 'EVIDENCE_UPLOADED',
  //   to: evidence.review.agreement.userId,
  //   message: `Nueva evidencia: ${evidence.fileName}`,
  // });
}
```

---

## Testing Frontend

### Test componente EvidenceUpload

```typescript
// __tests__/components/EvidenceUpload.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { EvidenceUpload } from '@/components/EvidenceUpload';

describe('EvidenceUpload', () => {
  it('should render upload zone', () => {
    render(
      <EvidenceUpload
        reviewId="123"
        activityId="456"
      />
    );
    expect(screen.getByText(/haz clic para seleccionar/i)).toBeInTheDocument();
  });

  it('should accept file drop', () => {
    const { container } = render(
      <EvidenceUpload
        reviewId="123"
        activityId="456"
      />
    );
    const dropZone = container.querySelector('[class*="border-dashed"]');
    // Simulate drop
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [new File(['content'], 'test.pdf', { type: 'application/pdf' })],
      },
    });
  });
});
```

### Test componente AuditHistory

```typescript
it('should display audit entries', async () => {
  render(
    <AuditHistory
      entityType="AGREEMENT_ACTIVITY"
      entityId="123"
    />
  );
  
  await waitFor(() => {
    expect(screen.getByText(/UPDATE/i)).toBeInTheDocument();
  });
});
```

---

## Troubleshooting

### "No se puede editar. Revisión está CLOSED"
- ✅ Esto es correcto y esperado
- Solución: Reabrir la revisión desde el botón "Reabrir revisión"

### Archivo no sube
- Verificar tamaño < 50 MB
- Verificar permisos de carpeta `./uploads/evidences`
- Verificar token válido

### Evidencias no aparecen en lista
- Asegurar que reviewId y activityId son correctos
- Verificar en BD: `SELECT * FROM evidences WHERE review_id = '...'`

### Auditología no se registra
- Verificar que AuditsService está inyectado
- Verificar que Base de datos tiene tabla `audits`
- Revisar logs para errores de inserción

---

## Próximas Características

- [ ] Previsualización de PDFs
- [ ] Generación de reportes con evidencias
- [ ] Búsqueda fulltext
- [ ] Versionado de documentos
- [ ] Integración OCR
- [ ] Firma digital

