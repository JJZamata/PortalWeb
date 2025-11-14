import { useState, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useInfracciones } from './hooks/useInfracciones';
import { useInfraccionDetail } from './hooks/useInfraccionDetail';
import { InfraccionesFilters } from './components/InfraccionesFilters';
import { InfraccionesTable } from './components/InfraccionesTable';
import { InfraccionDetailDialog } from './components/InfraccionDetailDialog';
import { PaginationControls } from './components/PaginationControls';
import { RefreshCw, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const InfraccionesView = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const lastPageChangeRef = useRef<number>(0);
  const limit = 6;

  const { violations, loading, error, paginationData, stats, loadingStats, refreshViolations } = useInfracciones(currentPage, limit, severityFilter, searchTerm);
  const { selectedViolation, loadingDetail, errorDetail, fetchViolationDetail, setSelectedViolation } = useInfraccionDetail();

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (paginationData?.totalPages || 1)) {
      const now = Date.now();
      if (now - lastPageChangeRef.current < 500) return;
      lastPageChangeRef.current = now;
      setCurrentPage(newPage);
    }
  };

  const clearFilters = () => {
    setSeverityFilter('ALL');
    setSearchTerm('');
    setCurrentPage(1);
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-12 h-12 text-red-500 dark:text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <Button onClick={refreshViolations} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
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
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#74140B] to-red-600 dark:from-red-400 dark:to-red-300 bg-clip-text text-transparent mb-2">
                Catálogo de Infracciones
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">
                Administración y consulta de infracciones de tránsito
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {loadingStats ? '-' : stats.minor}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Leves</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-orange-700 dark:text-orange-400">
                    {loadingStats ? '-' : stats.serious}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Graves</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-red-700 dark:text-red-400">
                    {loadingStats ? '-' : stats.verySerious}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Muy Graves</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-[#74140B] dark:text-red-400">
                    {loadingStats ? '-' : stats.totalViolations}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total</p>
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
                  Infracciones Registradas
                  {loading && <RefreshCw className="w-5 h-5 animate-spin text-[#74140B] dark:text-red-400" />}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Catálogo completo de infracciones de tránsito
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <InfraccionesFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              severityFilter={severityFilter}
              setSeverityFilter={setSeverityFilter}
              clearFilters={clearFilters}
              loading={loading}
            />
            <InfraccionesTable 
              violations={violations} 
              loading={loading} 
              fetchViolationDetail={fetchViolationDetail} 
            />
            {paginationData && (
              <PaginationControls 
                pagination={paginationData} 
                onPageChange={handlePageChange} 
              />
            )}
          </CardContent>
        </Card>

        <InfraccionDetailDialog
          open={!!selectedViolation}
          onOpenChange={(open) => !open && setSelectedViolation(null)}
          selectedViolation={selectedViolation}
          loadingDetail={loadingDetail}
          errorDetail={errorDetail}
        />
      </div>
    </AdminLayout>
  );
};

export default InfraccionesView;