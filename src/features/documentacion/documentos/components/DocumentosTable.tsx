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
import { RefreshCw, Search, Trash2, Eye, Edit, RotateCcw } from "lucide-react";
import { Documento } from "../types";
import { tableStyles } from '@/lib/table-styles';

interface Props {
  documentos: Documento[];
  loading: boolean;
  onDelete: (documento: Documento) => void;
  onViewInsuranceDetail?: (policyNumber: string) => void;
  onViewTechnicalReviewDetail?: (reviewCode: string) => void;
  onEditInsurance?: (policyNumber: string) => void;
  onEditTechnicalReview?: (reviewId: string) => void;
  onRenewInsurance?: (documento: Documento) => void;
  onRenewTechnicalReview?: (documento: Documento) => void;
}

export const DocumentosTable = ({ documentos, loading, onDelete, onViewInsuranceDetail, onViewTechnicalReviewDetail, onEditInsurance, onEditTechnicalReview, onRenewInsurance, onRenewTechnicalReview }: Props) => {
  const parseDateSafe = (dateValue: string) => {
    const raw = String(dateValue || '').trim();
    if (!raw) return null;

    const dateOnlyFromIso = raw.includes('T') ? raw.split('T')[0] : raw;

    const yyyymmddFromIso = dateOnlyFromIso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (yyyymmddFromIso) {
      const [, yyyy, mm, dd] = yyyymmddFromIso;
      const localDate = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      return Number.isNaN(localDate.getTime()) ? null : localDate;
    }

    const yyyymmdd = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (yyyymmdd) {
      const [, yyyy, mm, dd] = yyyymmdd;
      const localDate = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      return Number.isNaN(localDate.getTime()) ? null : localDate;
    }

    const isoParsed = new Date(raw);
    if (!Number.isNaN(isoParsed.getTime())) return isoParsed;

    const ddmmyyyy = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (ddmmyyyy) {
      const [, dd, mm, yyyy] = ddmmyyyy;
      const parsed = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    return null;
  };

  const isDocumentExpired = (documento: Documento) => {
    const estadoLower = String(documento?.estado || '').toLowerCase();
    const byStatus = estadoLower.includes('vencido') || estadoLower.includes('expired');

    const expirationDate = parseDateSafe(documento?.fecha_vencimiento || '');
    if (!expirationDate) return byStatus;

    const today = new Date();
    const endOfExpiration = new Date(expirationDate);
    endOfExpiration.setHours(23, 59, 59, 999);

    return byStatus || today > endOfExpiration;
  };

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
        <RefreshCw className={tableStyles.loadingSpinnerCyan} />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando documentos...</span>
      </div>
    );
  }

  return (
    <div className={tableStyles.container}>
      <Table>
        <TableHeader className={tableStyles.header}>
          <TableRow>
            <TableHead className={tableStyles.headText}>Número</TableHead>
            <TableHead className={tableStyles.headText}>Placa</TableHead>
            <TableHead className={tableStyles.headText}>Entidad/Empresa</TableHead>
            <TableHead className={tableStyles.headText}>Fecha Emisión</TableHead>
            <TableHead className={tableStyles.headText}>Vencimiento</TableHead>
            <TableHead className={tableStyles.headText}>Estado</TableHead>
            <TableHead className={`${tableStyles.headText} ${tableStyles.actionsHead}`}>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documentos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className={tableStyles.emptyCell}>
                <div className={tableStyles.emptyState}>
                  <Search className="w-8 h-8 mb-2" />
                  <p>No hay documentos disponibles</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            documentos.map((documento, index) => (
              (() => {
                const isAfocatExpired = documento.tipo === 'AFOCAT' && isDocumentExpired(documento);
                const isTechnicalReviewExpired = documento.tipo === 'REVISION' && isDocumentExpired(documento);
                const shouldHideDeleteAction = isAfocatExpired || isTechnicalReviewExpired;

                return (
              <TableRow 
                key={index} 
                className={tableStyles.row}
              >
                <TableCell className={tableStyles.codeCell}>{documento.numero}</TableCell>
                <TableCell className={tableStyles.plateCell}>{documento.placa}</TableCell>
                <TableCell className={tableStyles.textCell}>{documento.entidad_empresa}</TableCell>
                <TableCell className={tableStyles.mutedCell}>{documento.fecha_emision}</TableCell>
                <TableCell className={tableStyles.mutedCell}>{documento.fecha_vencimiento}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`${getBadgeVariant(documento.estado)} border px-3 py-1 rounded-full font-semibold`}>
                    {documento.estado}
                  </Badge>
                </TableCell>
                <TableCell className={tableStyles.actionsCell}>
                  <div className={tableStyles.actionsGroup}>
                    {/* Botón de ver detalles solo para seguros AFOCAT */}
                    {documento.tipo === 'AFOCAT' && onViewInsuranceDetail && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={tableStyles.actionBlue}
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
                        className={tableStyles.actionBlue}
                        onClick={() => onViewTechnicalReviewDetail(documento.numero)}
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    {/* Botón de editar seguros AFOCAT */}
                    {documento.tipo === 'AFOCAT' && onEditInsurance && !isAfocatExpired && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={tableStyles.actionBlue}
                        onClick={() => onEditInsurance(documento.numero)}
                        title="Editar seguro"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    {documento.tipo === 'AFOCAT' && onRenewInsurance && isAfocatExpired && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={tableStyles.actionCyan}
                        onClick={() => onRenewInsurance(documento)}
                        title="Renovar seguro"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    )}
                    {/* Botón de editar revisiones REVISION */}
                    {documento.tipo === 'REVISION' && onEditTechnicalReview && !isTechnicalReviewExpired && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={tableStyles.actionBlue}
                        onClick={() => onEditTechnicalReview(documento.numero)}
                        title="Editar revisión técnica"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    {documento.tipo === 'REVISION' && onRenewTechnicalReview && isTechnicalReviewExpired && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={tableStyles.actionCyan}
                        onClick={() => onRenewTechnicalReview(documento)}
                        title="Renovar revisión técnica"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    )}
                    {!shouldHideDeleteAction && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={tableStyles.actionRed}
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
                    )}
                  </div>
                </TableCell>
              </TableRow>
                );
              })()
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};