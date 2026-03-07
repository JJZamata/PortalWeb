export type AuditActionIconKey = 'warning' | 'success' | 'user' | 'document' | 'vehicle' | 'default';

export interface AuditActionRule {
  method: string;
  urlPrefix: string;
  title: string;
  iconKey: AuditActionIconKey;
  module: string;
}

// Catalogo centralizado y organizado por modulo/area funcional.
// Esto facilita agregar nuevas traducciones sin tocar la logica del traductor.
export const AUDIT_ACTION_RULES_BY_MODULE: Record<string, AuditActionRule[]> = {
  autenticacion: [
    { method: 'POST', urlPrefix: '/auth/signin', title: 'Inicio de sesion', iconKey: 'user', module: 'autenticacion' },
    { method: 'POST', urlPrefix: '/auth/login', title: 'Inicio de sesion', iconKey: 'user', module: 'autenticacion' },
    { method: 'POST', urlPrefix: '/auth/signout', title: 'Cierre de sesion', iconKey: 'user', module: 'autenticacion' },
    { method: 'POST', urlPrefix: '/auth/logout', title: 'Cierre de sesion', iconKey: 'user', module: 'autenticacion' },
    { method: 'POST', urlPrefix: '/auth/refresh', title: 'Renovacion de sesion', iconKey: 'default', module: 'autenticacion' },
    { method: 'POST', urlPrefix: '/auth/register', title: 'Usuario creado', iconKey: 'success', module: 'autenticacion' },
    { method: 'POST', urlPrefix: '/auth/forgot-password', title: 'Solicitud de recuperacion de contrasena', iconKey: 'default', module: 'autenticacion' },
    { method: 'POST', urlPrefix: '/auth/reset-password', title: 'Restablecimiento de contrasena', iconKey: 'default', module: 'autenticacion' },
    { method: 'POST', urlPrefix: '/auth/change-password', title: 'Cambio de contrasena', iconKey: 'default', module: 'autenticacion' },
    { method: 'GET', urlPrefix: '/auth/me', title: 'Consulta de sesion actual', iconKey: 'default', module: 'autenticacion' },
  ],
  auditoria: [
    { method: 'GET', urlPrefix: '/audit-logs/export', title: 'Exportacion de auditoria', iconKey: 'document', module: 'auditoria' },
    { method: 'GET', urlPrefix: '/audit-logs/stats', title: 'Consulta de estadisticas de auditoria', iconKey: 'default', module: 'auditoria' },
    { method: 'GET', urlPrefix: '/audit-logs', title: 'Consulta de auditoria del sistema', iconKey: 'default', module: 'auditoria' },
  ],
  actas: [
    { method: 'POST', urlPrefix: '/non-compliant-records', title: 'Infraccion creada', iconKey: 'warning', module: 'actas' },
    { method: 'POST', urlPrefix: '/compliant-records', title: 'Fiscalizacion completada', iconKey: 'success', module: 'actas' },
    { method: 'GET', urlPrefix: '/records/stats', title: 'Consulta de estadisticas de actas', iconKey: 'default', module: 'actas' },
    { method: 'GET', urlPrefix: '/records', title: 'Consulta de actas de fiscalizacion', iconKey: 'document', module: 'actas' },
  ],
  conductores: [
    { method: 'GET', urlPrefix: '/drivers/stats', title: 'Consulta de estadisticas de conductores', iconKey: 'user', module: 'conductores' },
    { method: 'GET', urlPrefix: '/drivers/list', title: 'Consulta de lista de conductores', iconKey: 'user', module: 'conductores' },
    { method: 'GET', urlPrefix: '/drivers', title: 'Consulta de conductor', iconKey: 'user', module: 'conductores' },
    { method: 'POST', urlPrefix: '/drivers', title: 'Conductor creado', iconKey: 'success', module: 'conductores' },
    { method: 'PUT', urlPrefix: '/drivers', title: 'Conductor actualizado', iconKey: 'user', module: 'conductores' },
    { method: 'DELETE', urlPrefix: '/drivers', title: 'Conductor eliminado', iconKey: 'warning', module: 'conductores' },
  ],
  propietarios: [
    { method: 'GET', urlPrefix: '/owners', title: 'Consulta de propietario', iconKey: 'user', module: 'propietarios' },
    { method: 'POST', urlPrefix: '/owners', title: 'Propietario creado', iconKey: 'success', module: 'propietarios' },
    { method: 'PUT', urlPrefix: '/owners', title: 'Propietario actualizado', iconKey: 'user', module: 'propietarios' },
    { method: 'DELETE', urlPrefix: '/owners', title: 'Propietario eliminado', iconKey: 'warning', module: 'propietarios' },
  ],
  licencias: [
    { method: 'GET', urlPrefix: '/licenses', title: 'Revision de documentos', iconKey: 'document', module: 'licencias' },
    { method: 'POST', urlPrefix: '/licenses', title: 'Licencia creada', iconKey: 'success', module: 'licencias' },
  ],
  vehiculos: [
    { method: 'GET', urlPrefix: '/vehicles/stats', title: 'Consulta de estadisticas de vehiculos', iconKey: 'vehicle', module: 'vehiculos' },
    { method: 'GET', urlPrefix: '/vehicles', title: 'Vehiculo inspeccionado', iconKey: 'vehicle', module: 'vehiculos' },
    { method: 'POST', urlPrefix: '/vehicles', title: 'Vehiculo creado', iconKey: 'success', module: 'vehiculos' },
    { method: 'PUT', urlPrefix: '/vehicles', title: 'Vehiculo actualizado', iconKey: 'vehicle', module: 'vehiculos' },
    { method: 'DELETE', urlPrefix: '/vehicles', title: 'Vehiculo eliminado', iconKey: 'warning', module: 'vehiculos' },
  ],
  empresas: [
    { method: 'GET', urlPrefix: '/companies/stats', title: 'Consulta de estadisticas de empresas', iconKey: 'default', module: 'empresas' },
    { method: 'GET', urlPrefix: '/companies', title: 'Consulta de empresa', iconKey: 'default', module: 'empresas' },
    { method: 'POST', urlPrefix: '/companies', title: 'Empresa creada', iconKey: 'success', module: 'empresas' },
    { method: 'PUT', urlPrefix: '/companies', title: 'Empresa actualizada', iconKey: 'default', module: 'empresas' },
    { method: 'DELETE', urlPrefix: '/companies', title: 'Empresa eliminada', iconKey: 'warning', module: 'empresas' },
  ],
  tucs: [
    { method: 'GET', urlPrefix: '/tucs/by-vehicle', title: 'Consulta de TUC por vehiculo', iconKey: 'document', module: 'tucs' },
    { method: 'GET', urlPrefix: '/tucs', title: 'Consulta de TUC', iconKey: 'document', module: 'tucs' },
    { method: 'POST', urlPrefix: '/tucs', title: 'Documento TUC creado', iconKey: 'success', module: 'tucs' },
    { method: 'PUT', urlPrefix: '/tucs', title: 'Documento TUC actualizado', iconKey: 'document', module: 'tucs' },
    { method: 'PATCH', urlPrefix: '/tucs', title: 'Documento TUC modificado', iconKey: 'document', module: 'tucs' },
    { method: 'DELETE', urlPrefix: '/tucs', title: 'Documento TUC eliminado', iconKey: 'warning', module: 'tucs' },
  ],
  infracciones: [
    { method: 'GET', urlPrefix: '/violations/stats', title: 'Consulta de estadisticas de infracciones', iconKey: 'warning', module: 'infracciones' },
    { method: 'GET', urlPrefix: '/violations', title: 'Consulta de infraccion', iconKey: 'warning', module: 'infracciones' },
    { method: 'POST', urlPrefix: '/violations', title: 'Infraccion creada', iconKey: 'warning', module: 'infracciones' },
    { method: 'PUT', urlPrefix: '/violations', title: 'Infraccion actualizada', iconKey: 'warning', module: 'infracciones' },
    { method: 'DELETE', urlPrefix: '/violations', title: 'Infraccion eliminada', iconKey: 'warning', module: 'infracciones' },
  ],
  documentacion: [
    { method: 'POST', urlPrefix: '/documents/insurance', title: 'Documento AFOCAT creado', iconKey: 'document', module: 'documentacion' },
    { method: 'PUT', urlPrefix: '/documents/insurance', title: 'Documento AFOCAT actualizado', iconKey: 'document', module: 'documentacion' },
    { method: 'DELETE', urlPrefix: '/documents/insurance', title: 'Documento AFOCAT eliminado', iconKey: 'warning', module: 'documentacion' },
    { method: 'POST', urlPrefix: '/insurance', title: 'Documento AFOCAT creado', iconKey: 'document', module: 'documentacion' },
    { method: 'PUT', urlPrefix: '/insurance', title: 'Documento AFOCAT actualizado', iconKey: 'document', module: 'documentacion' },
    { method: 'DELETE', urlPrefix: '/insurance', title: 'Documento AFOCAT eliminado', iconKey: 'warning', module: 'documentacion' },

    { method: 'POST', urlPrefix: '/documents/technical-review', title: 'Documento de revision tecnica creado', iconKey: 'document', module: 'documentacion' },
    { method: 'PUT', urlPrefix: '/documents/technical-review', title: 'Documento de revision tecnica actualizado', iconKey: 'document', module: 'documentacion' },
    { method: 'DELETE', urlPrefix: '/documents/technical-review', title: 'Documento de revision tecnica eliminado', iconKey: 'warning', module: 'documentacion' },
    { method: 'POST', urlPrefix: '/technical-reviews', title: 'Documento de revision tecnica creado', iconKey: 'document', module: 'documentacion' },
    { method: 'POST', urlPrefix: '/technicalreviews', title: 'Documento de revision tecnica creado', iconKey: 'document', module: 'documentacion' },
    { method: 'PUT', urlPrefix: '/technicalreviews', title: 'Documento de revision tecnica actualizado', iconKey: 'document', module: 'documentacion' },
    { method: 'DELETE', urlPrefix: '/technicalreviews', title: 'Documento de revision tecnica eliminado', iconKey: 'warning', module: 'documentacion' },

    { method: 'POST', urlPrefix: '/documents/delete', title: 'Documento eliminado', iconKey: 'warning', module: 'documentacion' },
    { method: 'POST', urlPrefix: '/documents', title: 'Documento creado', iconKey: 'success', module: 'documentacion' },
    { method: 'PUT', urlPrefix: '/documents', title: 'Documento actualizado', iconKey: 'document', module: 'documentacion' },
    { method: 'DELETE', urlPrefix: '/documents', title: 'Documento eliminado', iconKey: 'warning', module: 'documentacion' },
  ],
  usuarios: [
    { method: 'POST', urlPrefix: '/users', title: 'Usuario creado', iconKey: 'success', module: 'usuarios' },
    { method: 'PUT', urlPrefix: '/users', title: 'Usuario actualizado', iconKey: 'user', module: 'usuarios' },
    { method: 'GET', urlPrefix: '/users', title: 'Consulta de usuario', iconKey: 'user', module: 'usuarios' },
  ],
};

export const AUDIT_ACTION_RULES: AuditActionRule[] = Object.values(AUDIT_ACTION_RULES_BY_MODULE)
  .flat()
  .sort((a, b) => b.urlPrefix.length - a.urlPrefix.length);
