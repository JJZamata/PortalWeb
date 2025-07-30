import { useState } from 'react';
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

const ActasView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recordType, setRecordType] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;

  const { records, loading, error, pagination, summary, refreshRecords } = useActas(currentPage, limit, searchTerm, recordType, sortBy, sortOrder);
  const { recordDetailed, loadingDetail, errorDetail, fetchRecordDetail } = useActaDetail();
  const { toast } = useToast();
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    refreshRecords();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setRecordType('all');
    setSortBy('createdAt');
    setSortOrder('DESC');
    setCurrentPage(1);
    refreshRecords();
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => refreshRecords()} variant="outline">
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
        <div className="bg-gradient-to-br from-white to-red-50/30 dark:from-[#1a1a1a] dark:to-[#3b1c1c]/40 p-8 rounded-2xl shadow-lg border border-red-200/40 dark:border-[#812020]/40">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-800 to-amber-700 bg-clip-text text-transparent mb-2 dark:from-red-300 dark:to-amber-400">
                Gestión de Actas
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">
                Administra y supervisa todas las actas de inspección vehicular
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-red-700">
                    {loading ? '-' : summary?.totalRecords || 0}
                  </p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-emerald-700">
                    {loading ? '-' : summary?.totalCompliant || 0}
                  </p>
                  <p className="text-sm text-gray-600">Conformes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-amber-700">
                    {loading ? '-' : summary?.totalNonCompliant || 0}
                  </p>
                  <p className="text-sm text-gray-600">No Conformes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

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

        <Card className="shadow-lg border-0 bg-background rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                  Actas Registradas
                  {loading && <RefreshCw className="w-5 h-5 animate-spin text-[#812020] dark:text-[#fca5a5]" />}
                </CardTitle>
                <CardDescription className="dark:text-gray-300">Listado completo de actas de inspección</CardDescription>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-red-200 text-[#812020] dark:text-[#fca5a5] hover:bg-[#812020]/10 dark:hover:bg-[#2d0909]/40 rounded-xl">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ActasTable records={records} loading={loading} fetchRecordDetail={fetchRecordDetail} />
            {pagination && <PaginationControls pagination={pagination} onPageChange={handlePageChange} />}
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
};

export default ActasView;