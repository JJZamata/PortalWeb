import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RefreshCw, Search, Trash2, Eye, Edit } from "lucide-react";
import { Documento } from "../types";

interface Props {
  documentos: Documento[];
  loading: boolean;
  onDelete: (documento: Documento) => void;
  onViewInsuranceDetail?: (policyNumber: string) => void;
  onViewTechnicalReviewDetail?: (reviewCode: string) => void;
  onEditInsurance?: (policyNumber: string) => void;
  onEditTechnicalReview?: (reviewId: string) => void;
}

export const DocumentosTable = ({ documentos, loading, onDelete, onViewInsuranceDetail, onViewTechnicalReviewDetail, onEditInsurance, onEditTechnicalReview }: Props) => {
  const getBadgeVariant = (estado: string) => {
    const estadoLower = estado.toLowerCase();
    switch (estadoLower) {
      case 'vigente': return 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'por vencer': return 'bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'vencido': return 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
      default: return 'bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <RefreshCw className="w-8 h-8 animate-spin text-cyan-600 dark:text-cyan-400" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando documentos...</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <Table>
        <TableHeader className="bg-gradient-to-r from-cyan-50 to-cyan-100/50 dark:from-gray-800 dark:to-gray-800">
          <TableRow>
            <TableHead className="font-bold text-cyan-900 dark:text-gray-300">Tipo</TableHead>
            <TableHead className="font-bold text-cyan-900 dark:text-gray-300">Número</TableHead>
            <TableHead className="font-bold text-cyan-900 dark:text-gray-300">Placa</TableHead>
            <TableHead className="font-bold text-cyan-900 dark:text-gray-300">Entidad/Empresa</TableHead>
            <TableHead className="font-bold text-cyan-900 dark:text-gray-300">Fecha Emisión</TableHead>
            <TableHead className="font-bold text-cyan-900 dark:text-gray-300">Vencimiento</TableHead>
            <TableHead className="font-bold text-cyan-900 dark:text-gray-300">Estado</TableHead>
            <TableHead className="font-bold text-cyan-900 dark:text-gray-300">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documentos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                  <Search className="w-8 h-8 mb-2" />
                  <p>No hay documentos disponibles</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            documentos.map((documento, index) => (
              <TableRow 
                key={index} 
                className="hover:bg-cyan-50/50 dark:hover:bg-cyan-900/40 transition-colors"
              >
                <TableCell className="font-semibold text-gray-900 dark:text-white">{documento.tipo}</TableCell>
                <TableCell className="font-mono text-gray-600 dark:text-gray-400">{documento.numero}</TableCell>
                <TableCell className="font-mono font-semibold text-gray-900 dark:text-white">{documento.placa}</TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400 font-medium">{documento.entidad_empresa}</TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">{documento.fecha_emision}</TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">{documento.fecha_vencimiento}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`${getBadgeVariant(documento.estado)} border px-3 py-1 rounded-full font-semibold`}>
                    {documento.estado}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-1">
                    {/* Botón de editar seguros AFOCAT */}
                    {documento.tipo === 'AFOCAT' && onEditInsurance && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        onClick={() => onEditInsurance(documento.numero)}
                        title="Editar seguro"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    {/* Botón de editar revisiones REVISION */}
                    {documento.tipo === 'REVISION' && onEditTechnicalReview && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                        onClick={() => onEditTechnicalReview(documento.numero)}
                        title="Editar revisión técnica"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    {/* Botón de ver detalles solo para seguros AFOCAT */}
                    {documento.tipo === 'AFOCAT' && onViewInsuranceDetail && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        onClick={() => onViewInsuranceDetail(documento.numero)}
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    {/* Botón de ver detalles solo para revisiones REVISION */}
                    {documento.tipo === 'REVISION' && onViewTechnicalReviewDetail && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                        onClick={() => onViewTechnicalReviewDetail(documento.numero)}
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                          title="Eliminar documento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción eliminará permanentemente el documento <strong>{documento.tipo}</strong> número <strong>{documento.numero}</strong> de la placa <strong>{documento.placa}</strong>.
                            <br />
                            <span className="text-red-600 dark:text-red-400 font-medium">Esta acción no se puede deshacer.</span>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(documento)}
                            className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};