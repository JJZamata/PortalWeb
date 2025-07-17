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
import { AlertTriangle, ListTodo, Loader2, RotateCw, ServerCrash, Eye, Filter, XCircle, RefreshCw, ChevronLeft, ChevronRight, Search } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import axios from '@/lib/axios';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

const severities = [
  { value: "ALL", label: "Todas" },
  { value: "mild", label: "Leve" },
  { value: "serious", label: "Grave" },
  { value: "very_serious", label: "Muy Grave" },
];

const InfraccionesPage = () => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [paginationData, setPaginationData] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [stats, setStats] = useState({
    totalViolations: 0,
    verySerious: 0,
    serious: 0,
    minor: 0,
    driverTargeted: 0,
    companyTargeted: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchViolations = async (page: number, severity: string = "ALL", query: string = "") => {
    setLoading(true);
    setError(null);
    try {
      let url = "";
      if (query && query.length >= 2) {
        url = `/violations/search?query=${encodeURIComponent(query)}&page=${page}`;
      } else if (severity !== "ALL") {
        url = `/violations/filter/severity?severity=${severity}&page=${page}`;
      } else {
        url = `/violations/?page=${page}`;
      }
      const response = await axios.get(url);
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

  const fetchViolationDetail = async (id: number) => {
    setLoadingDetail(true);
    setErrorDetail(null);
    try {
      const response = await axios.get(`/violations/${id}`);
      setSelectedViolation(response.data.data);
    } catch (err) {
      setErrorDetail("No se pudo cargar el detalle de la infracción.");
      setSelectedViolation(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const response = await axios.get('/violations/admin/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      // Opcional: mostrar toast de error
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchViolations(currentPage, severityFilter, searchTerm);
    fetchStats();
    // eslint-disable-next-line
  }, [currentPage, severityFilter]);

  // Debounce para búsqueda
  useEffect(() => {
    if (searchTerm.length < 2) {
      setIsSearching(false);
      fetchViolations(1, severityFilter, "");
      return;
    }
    setSearchLoading(true);
    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      fetchViolations(1, severityFilter, searchTerm);
      setCurrentPage(1);
      setSearchLoading(false);
    }, 500);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line
  }, [searchTerm]);

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

  const clearFilters = () => {
    setSeverityFilter("ALL");
    setSearchTerm("");
    setIsSearching(false);
    setFilterLoading(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-white to-[#812020]/10 p-8 rounded-2xl shadow-lg border border-[#812020]/30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#812020] to-[#a94442] bg-clip-text text-transparent mb-2">
                Catálogo de Infracciones
              </h1>
              <p className="text-gray-700 text-lg">Administración y consulta de infracciones de tránsito</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#812020]">{loadingStats ? '...' : stats.totalViolations}</p>
                <p className="text-sm text-gray-600">Total Infracciones</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-700">{loadingStats ? '...' : stats.verySerious}</p>
                <p className="text-sm text-gray-600">Muy Graves</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-700">{loadingStats ? '...' : stats.serious}</p>
                <p className="text-sm text-gray-600">Graves</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">{loadingStats ? '...' : stats.minor}</p>
                <p className="text-sm text-gray-600">Leves</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controles */}
        <Card className="shadow-lg border-0 bg-background rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                  Infracciones Registradas
                  {loading && <RefreshCw className="w-5 h-5 animate-spin text-[#812020]" />}
                </CardTitle>
                <CardDescription>Catálogo completo de infracciones de tránsito</CardDescription>
              </div>
              {/* Controles de búsqueda y filtro, igual que Empresas */}
              <div className="flex flex-col lg:flex-row gap-4 w-full">
                {/* Buscador */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Buscar por código o descripción..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border border-border rounded-xl focus:border-[#812020] focus:ring-[#812020] pr-10 w-full bg-white"
                    disabled={searchLoading}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  {searchLoading && (
                    <RefreshCw className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#812020] w-5 h-5 animate-spin" />
                  )}
                  {searchTerm.length > 0 && searchTerm.length < 2 && (
                    <div className="absolute -bottom-6 left-0 text-xs text-amber-600">
                      Ingresa al menos 2 caracteres para buscar
                    </div>
                  )}
                </div>
                {/* Filtro por severidad */}
                <div className="flex gap-2 min-w-[200px] w-full lg:w-[220px]">
                  <select
                    value={severityFilter}
                    onChange={e => setSeverityFilter(e.target.value)}
                    className="h-12 w-full border border-border rounded-xl focus:border-[#812020] focus:ring-[#812020] px-4 text-gray-700 bg-white"
                    disabled={filterLoading}
                  >
                    {severities.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  {(isFiltering || (severityFilter && severityFilter !== "ALL") || searchTerm) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="h-12 px-3 border border-border text-gray-600 hover:bg-gray-50 rounded-xl"
                      disabled={filterLoading || loading}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Tabla */}
            <div className="rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-gradient-to-r from-[#812020]/10 to-[#a94442]/10 dark:from-[#2d0909] dark:to-[#3a1010]">
                  <TableRow>
                    <TableHead className="font-bold text-[#812020] dark:text-[#fca5a5]">Código</TableHead>
                    <TableHead className="font-bold text-[#812020] dark:text-[#fca5a5]">Descripción</TableHead>
                    <TableHead className="font-bold text-[#812020] dark:text-[#fca5a5]">Gravedad</TableHead>
                    <TableHead className="font-bold text-[#812020] dark:text-[#fca5a5]">Medida Adm.</TableHead>
                    <TableHead className="font-bold text-[#812020] dark:text-[#fca5a5]">Objetivo</TableHead>
                    <TableHead className="font-bold text-[#812020] dark:text-[#fca5a5] text-right">UIT %</TableHead>
                    <TableHead className="font-bold text-[#812020] dark:text-[#fca5a5] text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? renderSkeletons() : violations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <Filter className="w-8 h-8 mb-2" />
                          <p>No hay infracciones registradas o que coincidan con el filtro.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    violations.map((v) => (
                      <TableRow key={v.id} className="hover:bg-[#812020]/10 dark:hover:bg-[#2d0909]/40 transition-colors">
                        <TableCell className="font-mono font-bold text-[#812020] text-foreground dark:text-muted-foreground">{v.code}</TableCell>
                        <TableCell className="max-w-md text-foreground dark:text-muted-foreground">{v.description}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`border font-semibold rounded-full ${getSeverityBadge(v.severity)}`}>
                            {translateSeverity(v.severity)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground dark:text-muted-foreground">{v.administrativeMeasure}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`border font-semibold rounded-full ${getTargetBadge(v.target)}`}>
                            {translateTarget(v.target)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-[#812020] text-foreground dark:text-muted-foreground">{v.uitPercentage}</TableCell>
                        <TableCell className="text-center">
                          <Dialog onOpenChange={open => { if (open) fetchViolationDetail(v.id); }}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="hover:bg-[#812020]/10 rounded-lg">
                                <Eye className="w-4 h-4 text-[#812020]" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="shadow-xl border border-border rounded-xl max-w-lg">
                              <DialogHeader className="pb-4">
                                <DialogTitle className="text-2xl font-bold text-[#812020] flex items-center gap-2">
                                  <AlertTriangle className="w-6 h-6 text-[#812020]" />
                                  Detalle de Infracción
                                </DialogTitle>
                                <DialogDescription className="text-gray-700">
                                  Información detallada de la infracción seleccionada
                                </DialogDescription>
                              </DialogHeader>
                              {loadingDetail ? (
                                <div className="flex items-center justify-center py-8">
                                  <RefreshCw className="w-8 h-8 animate-spin text-[#812020]" />
                                  <span className="ml-2 text-gray-600">Cargando detalles...</span>
                                </div>
                              ) : errorDetail ? (
                                <div className="flex flex-col items-center justify-center py-8">
                                  <XCircle className="w-12 h-12 text-red-500 mb-4" />
                                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar detalles</h3>
                                  <p className="text-gray-600 mb-4 text-center">{errorDetail}</p>
                                </div>
                              ) : selectedViolation ? (
                                <div className="space-y-6">
                                  {/* Header principal */}
                                  <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-[#812020]/10 to-[#a94442]/10 rounded-xl">
                                    <div className="w-16 h-16 flex items-center justify-center bg-[#812020]/10 rounded-2xl shadow-lg">
                                      <AlertTriangle className="w-10 h-10 text-[#812020]" />
                                    </div>
                                    <div className="flex-1">
                                      <h2 className="text-xl font-bold text-[#812020] mb-1">{selectedViolation.code}</h2>
                                      <p className="text-gray-700 font-medium">{selectedViolation.description}</p>
                                    </div>
                                  </div>
                                  {/* Información detallada en grid */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Gravedad */}
                                    <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2 border border-gray-100">
                                      <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                                        <AlertTriangle className="w-4 h-4 text-[#812020]" /> Gravedad
                                      </span>
                                      <Badge variant="secondary" className={`border font-semibold rounded-full text-base ${getSeverityBadge(selectedViolation.severity)}`}>{translateSeverity(selectedViolation.severity)}</Badge>
                                    </div>
                                    {/* Medida Administrativa */}
                                    <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2 border border-gray-100">
                                      <span className="text-xs font-semibold text-gray-500">Medida Administrativa</span>
                                      <span className="text-base font-semibold text-gray-900">{selectedViolation.administrativeMeasure}</span>
                                    </div>
                                    {/* Objetivo */}
                                    <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2 border border-gray-100">
                                      <span className="text-xs font-semibold text-gray-500">Objetivo</span>
                                      <Badge variant="secondary" className={`border font-semibold rounded-full text-base ${getTargetBadge(selectedViolation.target)}`}>
                                        {translateTarget(selectedViolation.target)}
                                      </Badge>
                                    </div>
                                    {/* UIT % */}
                                    <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2 border border-gray-100">
                                      <span className="text-xs font-semibold text-gray-500">UIT %</span>
                                      <span className="text-base font-semibold text-gray-900">{selectedViolation.uitPercentage}</span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center py-8">
                                  <RefreshCw className="w-8 h-8 animate-spin text-[#812020]" />
                                  <span className="ml-2 text-gray-600">Cargando infracción...</span>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {paginationData && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    {currentPage === 1 ? (
                      <span
                        className="gap-1 pl-2.5 opacity-50 pointer-events-none select-none inline-flex items-center px-3 py-2 rounded-md border border-input bg-background text-sm font-medium text-muted-foreground"
                        aria-disabled="true"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                      </span>
                    ) : (
                      <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                    )}
                    {Array.from({ length: paginationData.totalPages }).map((_, index) => (
                      <PaginationItem key={index + 1}>
                        <PaginationLink onClick={() => handlePageChange(index + 1)} isActive={index + 1 === currentPage}>
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    {currentPage === paginationData.totalPages ? (
                      <span
                        className="gap-1 pr-2.5 opacity-50 pointer-events-none select-none inline-flex items-center px-3 py-2 rounded-md border border-input bg-background text-sm font-medium text-muted-foreground"
                        aria-disabled="true"
                      >
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    ) : (
                      <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default InfraccionesPage;

