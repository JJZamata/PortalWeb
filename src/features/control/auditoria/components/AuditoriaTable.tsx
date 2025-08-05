import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, RefreshCw, Search, Calendar, User, Database } from "lucide-react";
import { AuditLog } from "../types";

interface Props {
  auditLogs: AuditLog[];
  loading: boolean;
  onView: (log: AuditLog) => void;
  searchTerm: string;
}

export const AuditoriaTable = ({ auditLogs, loading, onView, searchTerm }: Props) => {
  const getOperationBadge = (operation: string) => {
    switch (operation) {
      case 'INSERT':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800';
      case 'UPDATE':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800';
      case 'DELETE':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700';
    }
  };

  const getTableBadge = (tableName: string) => {
    const colors = {
      'vehiculos': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800',
      'conductores': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800',
      'usuarios': 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-800',
      'acta_control': 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/50 dark:text-cyan-300 dark:border-cyan-800',
      'empresas': 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-800'
    };
    return colors[tableName as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700';
  };

  const filteredLogs = auditLogs.filter(log => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      log.table_name.toLowerCase().includes(searchLower) ||
      log.username.toLowerCase().includes(searchLower) ||
      log.record_id.toLowerCase().includes(searchLower) ||
      log.operation.toLowerCase().includes(searchLower)
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
              <TableHead className="font-bold text-indigo-900 dark:text-white py-4">Tabla</TableHead>
              <TableHead className="font-bold text-indigo-900 dark:text-white py-4">Operación</TableHead>
              <TableHead className="font-bold text-indigo-900 dark:text-white py-4">Registro</TableHead>
              <TableHead className="font-bold text-indigo-900 dark:text-white py-4">Usuario</TableHead>
              <TableHead className="font-bold text-indigo-900 dark:text-white py-4">IP</TableHead>
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
                      className={`${getTableBadge(log.table_name)} font-semibold rounded-full border`}
                    >
                      <Database className="w-3 h-3 mr-1" />
                      {log.table_name}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge 
                      variant="secondary" 
                      className={`${getOperationBadge(log.operation)} font-semibold rounded-full border`}
                    >
                      {log.operation}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono font-medium text-gray-900 dark:text-gray-300 py-4">{log.record_id}</TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-gray-300">{log.username}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-gray-700 dark:text-gray-300 py-4">{log.ip_address}</TableCell>
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
