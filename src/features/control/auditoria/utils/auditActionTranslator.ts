import { AUDIT_ACTION_RULES, AuditActionIconKey } from '../constants/auditActionCatalog';

export type { AuditActionIconKey };

export interface HumanAuditAction {
  title: string;
  iconKey: AuditActionIconKey;
}

interface AuditActionContext {
  operation?: string;
  table_name?: string;
}

const normalizeUrl = (url?: string): string => {
  if (!url) return '';
  const withoutQuery = url.split('?')[0].toLowerCase();
  const withoutApiPrefix = withoutQuery.startsWith('/api') ? withoutQuery.slice(4) || '/' : withoutQuery;
  // Remove API version prefix (e.g. /v1, /v2) so rules remain stable across versions.
  return withoutApiPrefix.replace(/^\/v\d+(?=\/|$)/, '') || '/';
};

const normalizeMethod = (method?: string): string => (method || '').toUpperCase();

const getResourceName = (normalizedUrl: string): string => {
  const segments = normalizedUrl.split('/').filter(Boolean);
  const segment = segments[0];
  const subsegment = segments[1];

  switch (segment) {
    case 'drivers':
      return 'conductor';
    case 'vehicles':
      return 'vehiculo';
    case 'licenses':
      return 'licencia';
    case 'users':
      return 'usuario';
    case 'owners':
      return 'propietario';
    case 'companies':
      return 'empresa';
    case 'tucs':
      return 'documento TUC';
    case 'violations':
      return 'infraccion';
    case 'documents':
      if (subsegment === 'insurance') return 'documento AFOCAT';
      if (subsegment === 'technical-review') return 'documento de revision tecnica';
      return 'documento';
    case 'insurance':
      return 'documento AFOCAT';
    case 'technicalreviews':
    case 'technical-reviews':
      return 'documento de revision tecnica';
    case 'records':
      return 'acta';
    case 'audit-logs':
      return 'auditoria';
    case 'auth':
      return 'sesion';
    case 'non-compliant-records':
      return 'infraccion';
    case 'compliant-records':
      return 'fiscalizacion';
    default:
      // If we don't know the exact area, still provide a useful generic label.
      return segment ? `registro de ${segment.replace(/-/g, ' ')}` : 'registro';
  }
};

const getAuthActionByOperation = (operation?: string): HumanAuditAction | null => {
  const normalizedOp = String(operation || '').toUpperCase();
  if (!normalizedOp) return null;

  if (normalizedOp.includes('LOGIN') || normalizedOp.includes('SIGNIN')) {
    return { title: 'Inicio de sesion', iconKey: 'user' };
  }
  if (normalizedOp.includes('LOGOUT') || normalizedOp.includes('SIGNOUT')) {
    return { title: 'Cierre de sesion', iconKey: 'user' };
  }
  if (normalizedOp.includes('REFRESH')) {
    return { title: 'Renovacion de sesion', iconKey: 'default' };
  }
  if (normalizedOp.includes('REGISTER')) {
    return { title: 'Usuario creado', iconKey: 'success' };
  }
  if (normalizedOp.includes('RESET_PASSWORD') || normalizedOp.includes('RESETPASSWORD')) {
    return { title: 'Restablecimiento de contrasena', iconKey: 'default' };
  }
  if (normalizedOp.includes('CHANGE_PASSWORD') || normalizedOp.includes('CHANGEPASSWORD')) {
    return { title: 'Cambio de contrasena', iconKey: 'default' };
  }

  return null;
};

const getFallbackTitle = (method: string, normalizedUrl: string, context?: AuditActionContext): HumanAuditAction => {
  const segments = normalizedUrl.split('/').filter(Boolean);
  const segment = segments[0] || '';
  const authOpAction = segment === 'auth' ? getAuthActionByOperation(context?.operation) : null;
  if (authOpAction) {
    return authOpAction;
  }

  const resource = getResourceName(normalizedUrl);
  const tableResource = context?.table_name ? `registro de ${String(context.table_name).replace(/_/g, ' ')}` : null;

  switch (method) {
    case 'GET':
      return { title: `Consulta de ${resource}`, iconKey: 'default' };
    case 'POST':
      return { title: `${tableResource || resource} creado`, iconKey: 'default' };
    case 'PUT':
      return { title: `${tableResource || resource} actualizado`, iconKey: 'default' };
    case 'PATCH':
      return { title: `${tableResource || resource} modificado`, iconKey: 'default' };
    case 'DELETE':
      return { title: `${tableResource || resource} eliminado`, iconKey: 'warning' };
    default:
      return { title: 'Operacion del sistema', iconKey: 'default' };
  }
};

export const translateAuditAction = (method?: string, url?: string, context?: AuditActionContext): HumanAuditAction => {
  const normalizedMethod = normalizeMethod(method);
  const normalizedUrl = normalizeUrl(url);

  const matchedRule = AUDIT_ACTION_RULES.find(
    (rule) => rule.method === normalizedMethod && normalizedUrl.startsWith(rule.urlPrefix)
  );

  if (matchedRule) {
    return {
      title: matchedRule.title,
      iconKey: matchedRule.iconKey,
    };
  }

  return getFallbackTitle(normalizedMethod, normalizedUrl, context);
};
