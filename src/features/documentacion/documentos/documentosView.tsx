import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useDocumentos } from './hooks/useDocumentos';
import { usePlacas } from './hooks/usePlacas';
import { useEmpresas } from './hooks/useEmpresas';
import { DocumentosTable } from './components/DocumentosTable';
import { AddDocumentoDialog } from './components/AddDocumentoDialog';
import { PaginationControls } from './components/PaginationControls';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, XCircle, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DocumentosView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('ALL');
  const { documentos, pagination, loading, error, page, handlePageChange } = useDocumentos(searchTerm, tipoFiltro);
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { fetchPlacas } = usePlacas();
  const { fetchEmpresas } = useEmpresas();

  const handleRefresh = () => {
    handlePageChange(1);
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">No se pudieron cargar los documentos</p>
          <Button onClick={handleRefresh} variant="outline">
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
        <div className="bg-gradient-to-br from-white to-cyan-50/30 dark:from-[#1a1a1a] dark:to-[#1a2340]/40 p-8 rounded-2xl shadow-lg border border-cyan-200/40 dark:border-cyan-900/40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-800 to-cyan-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-cyan-500 mb-2">
                Gestión de Documentos
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Administra la documentación vehicular, Revisión, AFOCAT y habilitaciones</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
                  {loading ? '-' : pagination.total_records}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Documentos</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-white dark:bg-gray-900 rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Documentos Registrados
                  {loading && <RefreshCw className="w-5 h-5 animate-spin text-cyan-600 dark:text-cyan-400" />}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                 Listado completo de todos los documentos registrados
                </CardDescription>
              </div>
              <div className="flex gap-3 items-center">
                <Button 
                  onClick={() => setShowAddDialog(true)}
                  className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0"
                >
                  <Plus className="w-4 h-4 mr-2" /> 
                  Nuevo Documento
                </Button>
                <AddDocumentoDialog
                  open={showAddDialog}
                  onOpenChange={(open) => {
                    setShowAddDialog(open);
                    if (!open) {
                      fetchPlacas();
                      fetchEmpresas();
                    }
                  }}
                  onSuccess={() => handlePageChange(1)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <Input
                  placeholder="Buscar por placa, número de documento o tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-gray-200 dark:border-gray-700 rounded-xl focus:border-cyan-500 focus:ring-cyan-500/20 bg-white dark:bg-gray-800 dark:text-white text-base"
                />
              </div>
              <div className="flex gap-2 min-w-[200px]">
                <Select
                  value={tipoFiltro}
                  onValueChange={setTipoFiltro}
                >
                  <SelectTrigger className="h-12 border-gray-200 dark:border-gray-700 rounded-xl focus:border-cyan-500 focus:ring-cyan-500/20 bg-white dark:bg-gray-800 dark:text-white">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    <SelectItem value="REVISION">Revisión</SelectItem>
                    <SelectItem value="AFOCAT">Afocat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DocumentosTable documentos={documentos} loading={loading} />
            {pagination && <PaginationControls pagination={pagination} onPageChange={handlePageChange} searchTerm={searchTerm} tipoFiltro={tipoFiltro} />}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default DocumentosView;