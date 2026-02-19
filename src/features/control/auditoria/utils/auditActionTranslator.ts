export type AuditActionIconKey = 'warning' | 'success' | 'user' | 'document' | 'vehicle' | 'default';

export interface HumanAuditAction {
  title: string;
  iconKey: AuditActionIconKey;
}

interface ActionRule {
  method: string;
  urlPrefix: string;
  title: string;
  iconKey: AuditActionIconKey;
}

const actionRules: ActionRule[] = [
  {
    method: 'GET',
    urlPrefix: '/audit-logs/export',
    title: 'Exportación de auditoría',
    iconKey: 'document',
  },
  {
    method: 'GET',
    urlPrefix: '/audit-logs/stats',
    title: 'Consulta de estadísticas de auditoría',
    iconKey: 'default',
  },
  {
    method: 'GET',
    urlPrefix: '/audit-logs',
    title: 'Consulta de auditoría del sistema',
    iconKey: 'default',
  },
  {
    method: 'POST',
    urlPrefix: '/non-compliant-records',
    title: 'Infracción registrada',
    iconKey: 'warning',
  },
  {
    method: 'POST',
    urlPrefix: '/compliant-records',
    title: 'Fiscalización completada',
    iconKey: 'success',
  },
  {
    method: 'GET',
    urlPrefix: '/records/stats',
    title: 'Consulta de estadísticas de actas',
    iconKey: 'default',
  },
  {
    method: 'GET',
    urlPrefix: '/records',
    title: 'Consulta de actas de fiscalización',
    iconKey: 'document',
  },
  {
    method: 'GET',
    urlPrefix: '/drivers/stats',
    title: 'Consulta de estadísticas de conductores',
    iconKey: 'user',
  },
  {
    method: 'GET',
    urlPrefix: '/drivers/list',
    title: 'Consulta de lista de conductores',
    iconKey: 'user',
  },
  {
    method: 'GET',
    urlPrefix: '/drivers',
    title: 'Consulta de conductor',
    iconKey: 'user',
  },
  {
    method: 'POST',
    urlPrefix: '/drivers',
    title: 'Conductor registrado',
    iconKey: 'success',
  },
  {
    method: 'PUT',
    urlPrefix: '/drivers',
    title: 'Conductor actualizado',
    iconKey: 'user',
  },
  {
    method: 'DELETE',
    urlPrefix: '/drivers',
    title: 'Conductor eliminado',
    iconKey: 'warning',
  },
  {
    method: 'GET',
    urlPrefix: '/owners',
    title: 'Consulta de propietario',
    iconKey: 'user',
  },
  {
    method: 'POST',
    urlPrefix: '/owners',
    title: 'Propietario registrado',
    iconKey: 'success',
  },
  {
    method: 'PUT',
    urlPrefix: '/owners',
    title: 'Propietario actualizado',
    iconKey: 'user',
  },
  {
    method: 'DELETE',
    urlPrefix: '/owners',
    title: 'Propietario eliminado',
    iconKey: 'warning',
  },
  {
    method: 'GET',
    urlPrefix: '/licenses',
    title: 'Revisión de documentos',
    iconKey: 'document',
  },
  {
    method: 'POST',
    urlPrefix: '/licenses',
    title: 'Licencia registrada',
    iconKey: 'success',
  },
  {
    method: 'GET',
    urlPrefix: '/vehicles/stats',
    title: 'Consulta de estadísticas de vehículos',
    iconKey: 'vehicle',
  },
  {
    method: 'GET',
    urlPrefix: '/vehicles',
    title: 'Vehículo inspeccionado',
    iconKey: 'vehicle',
  },
  {
    method: 'POST',
    urlPrefix: '/vehicles',
    title: 'Vehículo registrado',
    iconKey: 'success',
  },
  {
    method: 'PUT',
    urlPrefix: '/vehicles',
    title: 'Vehículo actualizado',
    iconKey: 'vehicle',
  },
  {
    method: 'DELETE',
    urlPrefix: '/vehicles',
    title: 'Vehículo eliminado',
    iconKey: 'warning',
  },
  {
    method: 'GET',
    urlPrefix: '/companies/stats',
    title: 'Consulta de estadísticas de empresas',
    iconKey: 'default',
  },
  {
    method: 'GET',
    urlPrefix: '/companies',
    title: 'Consulta de empresa',
    iconKey: 'default',
  },
  {
    method: 'POST',
    urlPrefix: '/companies',
    title: 'Empresa registrada',
    iconKey: 'success',
  },
  {
    method: 'PUT',
    urlPrefix: '/companies',
    title: 'Empresa actualizada',
    iconKey: 'default',
  },
  {
    method: 'DELETE',
    urlPrefix: '/companies',
    title: 'Empresa eliminada',
    iconKey: 'warning',
  },
  {
    method: 'GET',
    urlPrefix: '/tucs/by-vehicle',
    title: 'Consulta de TUC por vehículo',
    iconKey: 'document',
  },
  {
    method: 'GET',
    urlPrefix: '/tucs',
    title: 'Consulta de TUC',
    iconKey: 'document',
  },
  {
    method: 'POST',
    urlPrefix: '/tucs',
    title: 'TUC registrado',
    iconKey: 'success',
  },
  {
    method: 'PUT',
    urlPrefix: '/tucs',
    title: 'TUC actualizado',
    iconKey: 'document',
  },
  {
    method: 'PATCH',
    urlPrefix: '/tucs',
    title: 'TUC modificado',
    iconKey: 'document',
  },
  {
    method: 'DELETE',
    urlPrefix: '/tucs',
    title: 'TUC eliminado',
    iconKey: 'warning',
  },
  {
    method: 'GET',
    urlPrefix: '/violations/stats',
    title: 'Consulta de estadísticas de infracciones',
    iconKey: 'warning',
  },
  {
    method: 'GET',
    urlPrefix: '/violations',
    title: 'Consulta de infracción',
    iconKey: 'warning',
  },
  {
    method: 'POST',
    urlPrefix: '/violations',
    title: 'Infracción registrada',
    iconKey: 'warning',
  },
  {
    method: 'PUT',
    urlPrefix: '/violations',
    title: 'Infracción actualizada',
    iconKey: 'warning',
  },
  {
    method: 'DELETE',
    urlPrefix: '/violations',
    title: 'Infracción eliminada',
    iconKey: 'warning',
  },
  {
    method: 'POST',
    urlPrefix: '/documents/insurance',
    title: 'SOAT registrado',
    iconKey: 'document',
  },
  {
    method: 'PUT',
    urlPrefix: '/documents/insurance',
    title: 'SOAT desactivado',
    iconKey: 'warning',
  },
  {
    method: 'DELETE',
    urlPrefix: '/documents/insurance',
    title: 'SOAT eliminado',
    iconKey: 'warning',
  },
  {
    method: 'DELETE',
    urlPrefix: '/documents/technical-review',
    title: 'Revisión técnica eliminada',
    iconKey: 'warning',
  },
  {
    method: 'POST',
    urlPrefix: '/documents/delete',
    title: 'Documento eliminado',
    iconKey: 'warning',
  },
  {
    method: 'GET',
    urlPrefix: '/documents',
    title: 'Consulta de documento',
    iconKey: 'document',
  },
  {
    method: 'POST',
    urlPrefix: '/documents',
    title: 'Documento registrado',
    iconKey: 'success',
  },
  {
    method: 'PUT',
    urlPrefix: '/documents',
    title: 'Documento actualizado',
    iconKey: 'document',
  },
  {
    method: 'DELETE',
    urlPrefix: '/documents',
    title: 'Documento eliminado',
    iconKey: 'warning',
  },
  {
    method: 'POST',
    urlPrefix: '/insurance',
    title: 'SOAT registrado',
    iconKey: 'document',
  },
  {
    method: 'GET',
    urlPrefix: '/insurance',
    title: 'Consulta de SOAT',
    iconKey: 'document',
  },
  {
    method: 'PUT',
    urlPrefix: '/insurance',
    title: 'SOAT actualizado',
    iconKey: 'document',
  },
  {
    method: 'DELETE',
    urlPrefix: '/insurance',
    title: 'SOAT eliminado',
    iconKey: 'warning',
  },
  {
    method: 'POST',
    urlPrefix: '/technical-reviews',
    title: 'Revisión técnica registrada',
    iconKey: 'document',
  },
  {
    method: 'POST',
    urlPrefix: '/technicalreviews',
    title: 'Revisión técnica registrada',
    iconKey: 'document',
  },
  {
    method: 'GET',
    urlPrefix: '/technicalreviews',
    title: 'Consulta de revisión técnica',
    iconKey: 'document',
  },
  {
    method: 'PUT',
    urlPrefix: '/technicalreviews',
    title: 'Revisión técnica actualizada',
    iconKey: 'document',
  },
  {
    method: 'DELETE',
    urlPrefix: '/technicalreviews',
    title: 'Revisión técnica eliminada',
    iconKey: 'warning',
  },
  {
    method: 'POST',
    urlPrefix: '/users',
    title: 'Usuario registrado',
    iconKey: 'success',
  },
  {
    method: 'PUT',
    urlPrefix: '/users',
    title: 'Usuario actualizado',
    iconKey: 'user',
  },
  {
    method: 'GET',
    urlPrefix: '/users',
    title: 'Consulta de usuario',
    iconKey: 'user',
  },
];

const normalizeUrl = (url?: string): string => {
  if (!url) return '';
  const withoutQuery = url.split('?')[0].toLowerCase();
  return withoutQuery.startsWith('/api') ? withoutQuery.slice(4) || '/' : withoutQuery;
};

const normalizeMethod = (method?: string): string => (method || '').toUpperCase();

const getResourceName = (normalizedUrl: string): string => {
  const segment = normalizedUrl.split('/').filter(Boolean)[0];

  switch (segment) {
    case 'drivers':
      return 'conductor';
    case 'vehicles':
      return 'vehículo';
    case 'licenses':
      return 'documento';
    case 'users':
      return 'usuario';
    case 'owners':
      return 'propietario';
    case 'companies':
      return 'empresa';
    case 'tucs':
      return 'tuc';
    case 'violations':
      return 'infracción';
    case 'documents':
      return 'documento';
    case 'insurance':
      return 'soat';
    case 'technicalreviews':
    case 'technical-reviews':
      return 'revisión técnica';
    case 'records':
      return 'acta';
    case 'audit-logs':
      return 'auditoría';
    case 'non-compliant-records':
      return 'infracción';
    case 'compliant-records':
      return 'fiscalización';
    default:
      return 'registro';
  }
};

const getFallbackTitle = (method: string, normalizedUrl: string): HumanAuditAction => {
  const resource = getResourceName(normalizedUrl);

  switch (method) {
    case 'GET':
      return { title: `Consulta de ${resource}`, iconKey: 'default' };
    case 'POST':
      return { title: `${resource.charAt(0).toUpperCase() + resource.slice(1)} registrado`, iconKey: 'default' };
    case 'PUT':
      return { title: `${resource.charAt(0).toUpperCase() + resource.slice(1)} actualizado`, iconKey: 'default' };
    case 'PATCH':
      return { title: `${resource.charAt(0).toUpperCase() + resource.slice(1)} modificado`, iconKey: 'default' };
    case 'DELETE':
      return { title: `${resource.charAt(0).toUpperCase() + resource.slice(1)} eliminado`, iconKey: 'warning' };
    default:
      return { title: 'Operación del sistema', iconKey: 'default' };
  }
};

export const translateAuditAction = (method?: string, url?: string): HumanAuditAction => {
  const normalizedMethod = normalizeMethod(method);
  const normalizedUrl = normalizeUrl(url);

  const matchedRule = actionRules.find(
    (rule) => rule.method === normalizedMethod && normalizedUrl.startsWith(rule.urlPrefix)
  );

  if (matchedRule) {
    return {
      title: matchedRule.title,
      iconKey: matchedRule.iconKey,
    };
  }

  return getFallbackTitle(normalizedMethod, normalizedUrl);
};
