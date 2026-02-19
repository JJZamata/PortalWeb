import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, RefreshCw, Search, Calendar, User, AlertTriangle, CheckCircle2, UserCircle2, FileText, Car, Sparkles } from "lucide-react";
import { AuditLog } from "../types";
import { AuditActionIconKey, translateAuditAction } from "../utils/auditActionTranslator";

interface Props {
  auditLogs: AuditLog[];
  loading: boolean;
  onView: (log: AuditLog) => void;
  searchTerm: string;
}

export const AuditoriaTable = ({ auditLogs, loading, onView, searchTerm }: Props) => {
  const getActionIcon = (iconKey: AuditActionIconKey) => {
    switch (iconKey) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'user':
        return <UserCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'document':
        return <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
      case 'vehicle':
        return <Car className="w-4 h-4 text-gray-600 dark:text-gray-300" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
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

  const getStatusBadge = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800';
    } else if (statusCode >= 300 && statusCode < 400) {
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800';
    } else if (statusCode >= 400 && statusCode < 500) {
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800';
    } else {
      return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800';
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const action = translateAuditAction(log.method, log.url);
    return (
      (log.method && log.method.toLowerCase().includes(searchLower)) ||
      (log.url && log.url.toLowerCase().includes(searchLower)) ||
      action.title.toLowerCase().includes(searchLower) ||
      (log.user?.username && log.user.username.toLowerCase().includes(searchLower)) ||
      (log.ip && log.ip.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">Cargando registros de auditoría...</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-indigo-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <TableRow>
              <TableHead className="font-bold text-indigo-900 dark:text-white py-4">Fecha/Hora</TableHead>
              <TableHead className="font-bold text-indigo-900 dark:text-white py-4">Método</TableHead>
              <TableHead className="font-bold text-indigo-900 dark:text-white py-4">Endpoint</TableHead>
              <TableHead className="font-bold text-indigo-900 dark:text-white py-4">Acción</TableHead>
              <TableHead className="font-bold text-indigo-900 dark:text-white py-4">Estado</TableHead>
              <TableHead className="font-bold text-indigo-900 dark:text-white py-4">Usuario</TableHead>
              <TableHead className="font-bold text-indigo-900 dark:text-white text-center py-4">Detalles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 py-8">
                    <Search className="w-8 h-8 mb-2 text-gray-400 dark:text-gray-500" />
                    <p className="text-gray-600 dark:text-gray-400">No hay registros de auditoría que coincidan con el filtro.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-indigo-50/50 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700">
                  {(() => {
                    const action = translateAuditAction(log.method, log.url);

                    return (
                      <>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-gray-300">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge 
                      variant="secondary" 
                      className={`${getMethodBadge(log.method)} font-semibold rounded-full border`}
                    >
                      {log.method}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono font-medium text-gray-900 dark:text-gray-300 py-4 max-w-xs truncate">{log.url}</TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2 min-w-[220px]">
                      {getActionIcon(action.iconKey)}
                      <span className="font-medium text-gray-900 dark:text-gray-200">{action.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge 
                      variant="secondary" 
                      className={`${getStatusBadge(log.statusCode)} font-semibold rounded-full border`}
                    >
                      {log.statusCode}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-gray-300">{log.user?.username || '-'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg text-gray-600 dark:text-gray-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                      onClick={() => onView(log)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                      </>
                    );
                  })()}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
