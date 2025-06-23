import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AlertTriangle, ListTodo, Loader2, RotateCw, ServerCrash } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import axios from '@/lib/axios';
import { Skeleton } from '@/components/ui/skeleton';

// Types based on API response
interface Violation {
  id: number;
  code: string;
  description: string;
  severity: 'serious' | 'very_serious' | 'mild';
  administrativeMeasure: string;
  target: 'driver-owner' | 'company';
  uitPercentage: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalViolations: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const InfraccionesPage = () => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [paginationData, setPaginationData] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchViolations = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/violations/?page=${page}`);
      const { data } = response.data;
      setViolations(data.violations);
      setPaginationData(data.pagination);
    } catch (err) {
      setError("No se pudieron cargar las infracciones. Por favor, intente de nuevo más tarde.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViolations(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (paginationData?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  const getSeverityBadge = (severity: Violation['severity']) => {
    switch (severity) {
      case 'mild':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'serious':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'very_serious':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTargetBadge = (target: Violation['target']) => {
    switch (target) {
      case 'driver-owner':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'company':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const translateSeverity = (severity: Violation['severity']) => {
    const map = { mild: 'Leve', serious: 'Grave', very_serious: 'Muy Grave' };
    return map[severity] || 'Desconocida';
  }

  const translateTarget = (target: Violation['target']) => {
    const map = { 'driver-owner': 'Conductor/Propietario', company: 'Empresa' };
    return map[target] || 'Desconocido';
  }

  const renderSkeletons = () => (
    Array.from({ length: paginationData?.limit || 6 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
        <TableCell><Skeleton className="h-4 w-full" /></TableCell>
        <TableCell><Skeleton className="h-8 w-24 rounded-full" /></TableCell>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell><Skeleton className="h-8 w-32 rounded-full" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      </TableRow>
    ))
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Catálogo de Infracciones
            </h1>
            <p className="text-gray-600 mt-1">
              Consulta el catálogo de infracciones de tránsito, sanciones y medidas administrativas.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2">
                <ListTodo className="w-6 h-6 text-red-600" />
                <div>
                    <p className="text-sm text-gray-500">Total de Infracciones</p>
                    {loading ? <Skeleton className="h-5 w-16 mt-1" /> : <p className="font-bold text-xl text-gray-900">{paginationData?.totalViolations || 0}</p>}
                </div>
            </div>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-gray-50/50 border-b px-6 py-4">
            <div>
              <CardTitle className="text-lg font-semibold">
                Lista de Infracciones
              </CardTitle>
              <CardDescription className="mt-1">
                Mostrando {violations.length} de {paginationData?.totalViolations} infracciones
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchViolations(currentPage)}
              disabled={loading}
              className="gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCw className="w-4 h-4" />}
              Recargar
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {error && (
              <div className="text-center py-12">
                <ServerCrash className="mx-auto h-12 w-12 text-red-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-800">Error al Cargar Datos</h3>
                <p className="mt-1 text-sm text-gray-500">{error}</p>
                <Button className="mt-4" onClick={() => fetchViolations(currentPage)}>
                  Reintentar
                </Button>
              </div>
            )}
            
            {!error && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="font-semibold">Código</TableHead>
                      <TableHead className="font-semibold">Descripción</TableHead>
                      <TableHead className="font-semibold">Gravedad</TableHead>
                      <TableHead className="font-semibold">Medida Adm.</TableHead>
                      <TableHead className="font-semibold">Objetivo</TableHead>
                      <TableHead className="font-semibold text-right">UIT %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? renderSkeletons() : violations.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell className="font-mono font-medium text-gray-700">{v.code}</TableCell>
                        <TableCell className="max-w-md">{v.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`border font-semibold ${getSeverityBadge(v.severity)}`}>
                            <AlertTriangle className="w-3 h-3 mr-1.5" />
                            {translateSeverity(v.severity)}
                          </Badge>
                        </TableCell>
                        <TableCell>{v.administrativeMeasure}</TableCell>
                        <TableCell>
                           <Badge variant="outline" className={`border font-semibold ${getTargetBadge(v.target)}`}>
                            {translateTarget(v.target)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-gray-800">{v.uitPercentage}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>

          {paginationData && paginationData.totalPages > 1 && !error && (
            <CardHeader className="flex flex-row items-center justify-between border-t bg-gray-50/50 px-6 py-3">
               <div className="text-sm text-muted-foreground">
                Página {paginationData.currentPage} de {paginationData.totalPages}
              </div>
              <Pagination className="m-0">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                      className={!paginationData.hasPrevPage ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                      className={!paginationData.hasNextPage ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardHeader>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default InfraccionesPage;
