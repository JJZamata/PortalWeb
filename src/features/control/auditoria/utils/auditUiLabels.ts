export const getActionTypeLabel = (method: string): string => {
  switch ((method || '').toUpperCase()) {
    case 'POST':
      return 'Creacion';
    case 'PUT':
      return 'Actualizacion';
    case 'PATCH':
      return 'Modificacion';
    case 'DELETE':
      return 'Eliminacion';
    default:
      return 'Otro cambio';
  }
};

export const getActionTypeBadgeClass = (method: string): string => {
  switch ((method || '').toUpperCase()) {
    case 'GET':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800';
    case 'POST':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800';
    case 'PUT':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800';
    case 'DELETE':
      return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800';
    case 'PATCH':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700';
  }
};

export const getStatusBadgeClass = (statusCode: number): string => {
  if (statusCode >= 200 && statusCode < 300) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800';
  }
  if (statusCode >= 300 && statusCode < 400) {
    return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800';
  }
  if (statusCode >= 400 && statusCode < 500) {
    return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800';
  }
  return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800';
};

export const getStatusLabel = (statusCode: number): string => {
  if (statusCode >= 200 && statusCode < 300) {
    return 'Completado';
  }
  if (statusCode >= 300 && statusCode < 400) {
    return 'Redirigido';
  }
  if (statusCode >= 400 && statusCode < 500) {
    return 'Requiere revision';
  }
  return 'Error';
};
