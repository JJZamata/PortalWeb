import { useState, useCallback, memo } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useActas } from './hooks/useActas';
import { useActaDetail } from './hooks/useActaDetail';
import { ActasFilters } from './components/ActasFilters';
import { ActasTable } from './components/ActasTable';
import { ActaDetailDialog } from './components/ActaDetailDialog';
import { PaginationControls } from './components/PaginationControls';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const ActasView = memo(() => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recordType, setRecordType] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;

  const { records, loading, error, pagination, summary, refreshRecords, handlePageChange: hookHandlePageChange } = useActas(currentPage, limit, searchTerm, recordType, sortBy, sortOrder);
  const { recordDetailed, loadingDetail, errorDetail, fetchRecordDetail } = useActaDetail();
  const { toast } = useToast();
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Memoizar handlers para evitar re-renders
  const handlePageChange = useCallback((newPage: number) => {
    hookHandlePageChange(newPage);
    setCurrentPage(newPage);
  }, [hookHandlePageChange]);

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    refreshRecords();
  }, [refreshRecords]);

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setRecordType('all');
    setSortBy('createdAt');
    setSortOrder('DESC');
    setCurrentPage(1);
    refreshRecords();
  }, [refreshRecords]);

  const handleFetchRecordDetail = useCallback((id: number, type: 'conforme' | 'noconforme') => {
    fetchRecordDetail(id, type);
    setShowDetailDialog(true);
  }, [fetchRecordDetail]);

  // Filtrar records basado en el término de búsqueda (solo para mostrar)
  const filteredRecords = records.filter(record => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      record.vehiclePlate.toLowerCase().includes(searchLower) ||
      record.location.toLowerCase().includes(searchLower) ||
      record.observations.toLowerCase().includes(searchLower) ||
      record.inspector.username.toLowerCase().includes(searchLower) ||
      record.id.toString().includes(searchTerm)
    );
  });

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => refreshRecords()} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
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
        <div className="bg-gradient-to-br from-white to-red-50/30 dark:from-gray-900 dark:to-red-950/20 p-8 rounded-2xl shadow-lg border border-red-200/40 dark:border-red-800/30">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-800 to-amber-700 dark:from-red-300 dark:to-amber-400 bg-clip-text text-transparent mb-2">
                Gestión de Actas
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">
                Administra y supervisa todas las actas de inspección vehicular
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-6">
                
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-emerald-700 dark:text-emerald-400">
                    {loading ? '-' : summary?.totalCompliant || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Conformes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-amber-700 dark:text-amber-400">
                    {loading ? '-' : summary?.totalNonCompliant || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">No Conformes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-red-700 dark:text-red-400">
                    {loading ? '-' : summary?.totalRecords || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Actas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-white dark:bg-gray-900 rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Actas Registradas
                  {loading && <RefreshCw className="w-5 h-5 animate-spin text-[#812020] dark:text-[#fca5a5]" />}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Listado completo de actas de inspección vehicular
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ActasFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              recordType={recordType}
              setRecordType={setRecordType}
              sortBy={sortBy}
              setSortBy={setSortBy}
              handleSearch={handleSearch}
              handleResetFilters={handleResetFilters}
            />
            <ActasTable 
              records={filteredRecords} 
              loading={loading} 
              fetchRecordDetail={handleFetchRecordDetail} 
              searchTerm={searchTerm}
            />
            {pagination && (
              <PaginationControls 
                pagination={pagination} 
                onPageChange={handlePageChange}
                searchTerm={searchTerm} 
              />
            )}
          </CardContent>
        </Card>

        <ActaDetailDialog
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
          recordDetailed={recordDetailed}
          loadingDetail={loadingDetail}
          errorDetail={errorDetail}
          fetchRecordDetail={fetchRecordDetail}
        />
      </div>
    </AdminLayout>
  );
});

ActasView.displayName = "ActasView";

export default ActasView;