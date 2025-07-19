import { useState, useCallback, memo } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useFiscalizadoresQuery } from "./queries/useFiscalizadoresQuery";
import { useFiscalizadorDetailQuery } from "./queries/useFiscalizadorDetailQuery";
import FiscalizadoresTable from "./components/FiscalizadoresTable";
import { AddFiscalizadorDialog } from "./components/AddFiscalizadorDialog";
import FiscalizadorDetailDialog from "./components/FiscalizadorDetailDialog";
import { EditFiscalizadorDialog } from "./components/EditFiscalizadorDialog";
import { DeleteFiscalizadorDialog } from "./components/DeleteFiscalizadorDialog";
import PaginationControls from "./components/PaginationControls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw, XCircle, Plus } from "lucide-react";
import { Fiscalizador, PaginationData, SummaryData } from "./types";
import { addFiscalizador, updateFiscalizador, deleteFiscalizador } from "@/features/personal/fiscalizadores/services/fiscalizadoresService";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/lib/axios";
import axios from "axios"; // Importamos axios explícitamente

// Ajustamos las interfaces para que coincidan con la respuesta del servicio
interface FiscalizadoresResponse {
  fiscalizadores: Fiscalizador[];
  pagination: PaginationData;
  summary: SummaryData;
  success: boolean;
  message?: string;
}

interface FiscalizadorDetailResponse {
  data: Fiscalizador | null;
  success: boolean;
  message?: string;
}

const FiscalizadoresView = memo(() => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading, error, refetch } = useFiscalizadoresQuery(currentPage);
  const { data: detailData, isLoading: detailLoading, error: detailError, refetch: refetchDetail } =
    useFiscalizadorDetailQuery(selectedId);

  // Ajustamos la desestructuración para que coincida con la nueva estructura
  const fiscalizadores = data?.fiscalizadores || [];
  const pagination = data?.pagination || null;
  const summary = data?.summary || null;

  // Filtrar fiscalizadores basado en el término de búsqueda (solo para mostrar)
  const filteredFiscalizadores = fiscalizadores.filter(fiscalizador => {
    const searchLower = searchTerm.toLowerCase();
    return (
      fiscalizador.usuario.toLowerCase().includes(searchLower) ||
      fiscalizador.email.toLowerCase().includes(searchLower) ||
      fiscalizador.idUsuario.toString().includes(searchTerm) ||
      (fiscalizador.nombreCompleto && fiscalizador.nombreCompleto.toLowerCase().includes(searchLower)) ||
      (fiscalizador.dni && fiscalizador.dni.includes(searchTerm))
    );
  });

  const { toast } = useToast();

  const handleAddFiscalizador = useCallback(
    async (values: { username: string; email: string; password: string; confirmPassword: string }) => {
      if (values.password !== values.confirmPassword) {
        toast({
          title: "Error de validación",
          description: "Las contraseñas no coinciden",
          variant: "destructive",
        });
        return;
      }

      setSubmitting(true);
      try {
        const payload = { username: values.username, email: values.email, password: values.password, roles: ["fiscalizador"] };
        console.log('Enviando payload desde view:', payload); // Debug
        
        const response = await addFiscalizador(payload);
        console.log('Respuesta recibida en view:', response); // Debug
        
        if (response?.success) {
          setShowAddDialog(false);
          toast({ 
            title: "Fiscalizador agregado", 
            description: response.message || "El fiscalizador fue registrado correctamente.", 
            variant: "default" 
          });
          refetch();
        } else {
          throw new Error(response?.message || "Error al registrar fiscalizador");
        }
      } catch (error) {
        console.error('Error completo en handleAddFiscalizador:', error); // Debug
        toast({
          title: "Error al agregar fiscalizador",
          description: axios.isAxiosError(error) 
            ? error.response?.data?.message || `Error ${error.response?.status}: ${error.response?.statusText}` 
            : "Error desconocido",
          variant: "destructive",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [refetch, toast]
  );

  const handleSave = useCallback(
    async (values: { username: string; email: string; isActive: boolean }) => {
      if (!selectedId) return;
      setSubmitting(true);
      try {
        const response = await updateFiscalizador(selectedId, values);
        if (response?.success) {
          setShowEditDialog(false);
          toast({
            title: "Fiscalizador actualizado",
            description: response.message || "Los datos del fiscalizador fueron actualizados correctamente.",
            variant: "default",
          });
          refetch();
          refetchDetail();
        } else {
          throw new Error(response?.message || 'Error al actualizar fiscalizador');
        }
      } catch (error) {
        console.error("Error al guardar fiscalizador:", error);
        toast({
          title: "Error al guardar fiscalizador",
          description: axios.isAxiosError(error) ? error.response?.data?.message || "Error desconocido" : "Error desconocido",
          variant: "destructive",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [selectedId, refetch, refetchDetail, toast]
  );

  const handleView = useCallback((id: number) => {
    setSelectedId(id);
    setShowDetailDialog(true);
  }, []);

  const handleEdit = useCallback((id: number) => {
    setSelectedId(id);
    setShowEditDialog(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!selectedId) return;
    setSubmitting(true);
    try {
      const response = await deleteFiscalizador(selectedId);
      if (response?.success) {
        setShowDeleteDialog(false);
        toast({
          title: "Fiscalizador eliminado",
          description: response.message || "El fiscalizador fue eliminado correctamente.",
          variant: "default",
        });
        refetch();
      } else {
        throw new Error(response?.message || 'Error al eliminar fiscalizador');
      }
    } catch (error) {
      console.error("Error al eliminar fiscalizador:", error);
      toast({
        title: "Error al eliminar fiscalizador",
        description: axios.isAxiosError(error) ? error.response?.data?.message || "Error desconocido" : "Error desconocido",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }, [selectedId, refetch, toast]);

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <XCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => refetch()} variant="outline">
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
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#812020] to-[#a94442] bg-clip-text text-transparent mb-2 dark:from-[#fca5a5] dark:to-[#a94442]">
                Gestión de Fiscalizadores
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">Administra y supervisa el equipo de fiscalizadores del sistema</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-red-700">{isLoading ? "-" : summary?.total || 0}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-emerald-700">{isLoading ? "-" : summary?.activos || 0}</p>
                  <p className="text-sm text-gray-600">Activos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-gray-700">{isLoading ? "-" : summary?.inactivos || 0}</p>
                  <p className="text-sm text-gray-600">Inactivos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Card className="shadow-lg border-0 bg-background rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                  Fiscalizadores Registrados
                  {isLoading && <RefreshCw className="w-5 h-5 animate-spin text-[#812020]" />}
                </CardTitle>
                <CardDescription className="dark:text-gray-300">Listado completo de fiscalizadores en el sistema</CardDescription>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setShowAddDialog(true)} className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Fiscalizador
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por nombre de usuario, email o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-border rounded-xl focus:border-[#812020] focus:ring-[#812020] bg-background text-foreground dark:placeholder:text-gray-400"
              />
            </div>
            <FiscalizadoresTable fiscalizadores={filteredFiscalizadores} loading={isLoading} onView={handleView} onEdit={handleEdit} searchTerm={searchTerm} />
            {pagination && <PaginationControls pagination={pagination} onPageChange={setCurrentPage} searchTerm={searchTerm} />}
          </CardContent>
        </Card>
        <AddFiscalizadorDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAdd={handleAddFiscalizador} // Corregido a handleAddFiscalizador
          submitting={submitting}
        />
        <FiscalizadorDetailDialog
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
          fiscalizador={detailData || null}
          loading={detailLoading}
          error={detailError?.message || null}
        />
        <EditFiscalizadorDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          submitting={submitting}
          initialData={detailData ? {
            username: detailData.username,
            email: detailData.email,
            isActive: detailData.isActive
          } : undefined}
          onSave={handleSave}
        />
        <DeleteFiscalizadorDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete} submitting={submitting} />
      </div>
    </AdminLayout>
  );
});

FiscalizadoresView.displayName = "FiscalizadoresView";

export default FiscalizadoresView;