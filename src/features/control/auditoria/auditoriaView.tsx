import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useAuditoria } from './hooks/useAuditoria';
import { AuditoriaTable } from './components/AuditoriaTable';
import { AuditoriaDetailDialog } from './components/AuditoriaDetailDialog';
import { PaginationControls } from './components/PaginationControls';
import { AuditLog } from './types';
import { useToast } from '@/hooks/use-toast';
import { Shield, Search, Filter, Download, RefreshCw, XCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AuditoriaView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const { auditLogs, pagination, estadisticas, loading, error, page, handlePageChange, refetch } = useAuditoria(searchTerm, actionFilter);
  const { toast } = useToast();

  const clearFilters = () => {
    setSearchTerm('');
    setActionFilter('all');
    toast({
      title: "Filtros limpiados",
      description: "Mostrando todos los registros de auditoría",
      variant: "default",
    });
  };

  const handleViewLog = (log: AuditLog) => {
    setSelectedLog(log);
    setShowDetailDialog(true);
  };

  const handleExport = () => {
    toast({
      title: "Exportación iniciada",
      description: "Se está generando el archivo de exportación",
      variant: "default",
    });
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-12 h-12 text-indigo-500 dark:text-indigo-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <Button onClick={() => refetch()} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-900 dark:to-indigo-950/20 p-8 rounded-2xl shadow-lg border border-indigo-200/40 dark:border-indigo-800/30">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-800 to-indigo-600 dark:from-indigo-400 dark:to-indigo-300 bg-clip-text text-transparent mb-2">
                Auditoría del Sistema
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">Registro completo de todas las operaciones realizadas en el sistema</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-emerald-700 dark:text-emerald-400">
                  {loading ? '-' : estadisticas?.total_inserts || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Creaciones</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-amber-700 dark:text-amber-400">
                  {loading ? '-' : estadisticas?.total_updates || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Actualizaciones</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-red-700 dark:text-red-400">
                  {loading ? '-' : estadisticas?.total_deletes || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Eliminaciones</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-indigo-700 dark:text-indigo-400">{loading ? '-' : estadisticas?.total_registros || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total</p>
              </div>
              <Button variant="outline" onClick={handleExport} className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                <Download className="w-4 h-4" />
                Exportar
              </Button>
            </div>
          </div>
        </div>

        {/* Registros de Auditoría */}
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-900 rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Registro de Actividades
                  {loading && <RefreshCw className="w-5 h-5 animate-spin text-indigo-600 dark:text-indigo-400" />}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {pagination?.total_records || 0} registros de auditoría
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filtros */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <Input
                  placeholder="Buscar por tabla, usuario o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-gray-200 dark:border-gray-700 rounded-xl focus:border-indigo-500 focus:ring-indigo-500/20 pr-10 bg-white dark:bg-gray-800 dark:text-white"
                />
              </div>
              
              <div className="flex gap-2 min-w-[200px]">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger className="h-12 pl-10 border-gray-200 dark:border-gray-700 rounded-xl focus:border-indigo-500 focus:ring-indigo-500/20 bg-white dark:bg-gray-800 dark:text-white">
                      <SelectValue placeholder="Tipo de operación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las operaciones</SelectItem>
                      <SelectItem value="INSERT">Creaciones</SelectItem>
                      <SelectItem value="UPDATE">Actualizaciones</SelectItem>
                      <SelectItem value="DELETE">Eliminaciones</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {(actionFilter !== 'all' || searchTerm.length > 0) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="h-12 px-3 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl"
                    title="Limpiar filtros"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <AuditoriaTable
              auditLogs={auditLogs}
              loading={loading}
              onView={handleViewLog}
              searchTerm={searchTerm}
            />
            
            {pagination && (
              <PaginationControls 
                pagination={pagination} 
                onPageChange={handlePageChange}
                searchTerm={searchTerm}
                actionFilter={actionFilter}
              />
            )}
          </CardContent>
        </Card>

        <AuditoriaDetailDialog
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
          auditLog={selectedLog}
        />
      </div>
    </AdminLayout>
  );
};

export default AuditoriaView;
