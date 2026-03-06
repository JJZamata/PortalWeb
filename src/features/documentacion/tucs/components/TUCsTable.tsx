import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, RotateCcw, RefreshCw, Search } from 'lucide-react';
import { TUCData, Propietario } from '../types';
import { tableStyles } from '@/lib/table-styles';

interface Props {
  tucs: TUCData[] | undefined | null;
  loading: boolean;
  onView: (tucNumber: string) => void;
  onEdit: (tucNumber: string) => void;
  onDelete: (tuc: TUCData) => void;
  onRenew: (tuc: TUCData) => void;
}

const getStatusColor = (estado: TUCData['estado'] | undefined): string => {
  const estadoLower = String(estado?.descripcion || estado?.codigo || '').toLowerCase();

  if (estadoLower.includes('vigente') || estadoLower.includes('active') || estadoLower.includes('activo')) {
    return 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  }

  if (estadoLower.includes('por vencer') || estadoLower.includes('por_vencer') || estadoLower.includes('expiring')) {
    return 'bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
  }

  if (estadoLower.includes('vencido') || estadoLower.includes('expired')) {
    return 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
  }

  return 'bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800';
};

// Función auxiliar para obtener el nombre del propietario
const getPropietarioName = (propietario: Propietario | string | undefined): string => {
  if (!propietario) return 'N/A';
  if (typeof propietario === 'string') return propietario;
  return propietario.nombreCompleto || propietario.nombre || 'N/A';
};

export const TUCsTable = ({ tucs, loading, onView, onEdit, onDelete, onRenew }: Props) => {
  const parseDateSafe = (dateValue?: string) => {
    const raw = String(dateValue || '').trim();
    if (!raw) return null;

    const dateOnlyFromIso = raw.includes('T') ? raw.split('T')[0] : raw;
    const yyyymmdd = dateOnlyFromIso.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (yyyymmdd) {
      const [, yyyy, mm, dd] = yyyymmdd;
      const localDate = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      return Number.isNaN(localDate.getTime()) ? null : localDate;
    }

    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const isTucExpired = (tuc: TUCData) => {
    const estadoText = String(tuc.estado?.codigo || tuc.estado?.descripcion || '').toLowerCase();
    if (estadoText.includes('vencido') || estadoText.includes('expired')) return true;

    const dias = tuc.fechas?.diasRestantes ?? tuc.diasRestantes;
    if (typeof dias === 'number') return dias <= 0;

    const validityDate = parseDateSafe(tuc.fechas?.vigencia ?? tuc.validityDate);
    if (!validityDate) return false;

    const endOfValidity = new Date(validityDate);
    endOfValidity.setHours(23, 59, 59, 999);
    return new Date() > endOfValidity;
  };

  // Validar que tucs es un array válido
  const validTucs = Array.isArray(tucs) ? tucs : [];

  if (loading && validTucs.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <RefreshCw className={tableStyles.loadingSpinnerBlue} />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando TUCs...</span>
      </div>
    );
  }

  if (validTucs.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center">
        <div className={`${tableStyles.emptyState} text-center`}>
          <Search className="w-8 h-8 mb-2" />
          <p>No se encontraron TUCs</p>
          <p className="text-sm text-gray-500">Crea una nueva TUC para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div className={tableStyles.container}>
      <Table>
        <TableHeader className={tableStyles.header}>
          <TableRow>
            <TableHead className={tableStyles.headText}>TUC</TableHead>
            <TableHead className={tableStyles.headText}>Vehículo</TableHead>
            <TableHead className={tableStyles.headText}>Placa</TableHead>
            <TableHead className={tableStyles.headText}>Vencimiento</TableHead>
            <TableHead className={tableStyles.headText}>Estado</TableHead>
            <TableHead className={tableStyles.headText}>Propietario</TableHead>
            <TableHead className={`${tableStyles.headText} ${tableStyles.actionsHead}`}>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {validTucs.map((tuc) => {
            // Compatibilidad: API puede devolver estructura anidada o plana
            const tucNumber = tuc.tuc?.tucNumber ?? tuc.tucNumber;
            if (!tucNumber) return null;

            const vehicleInfo = tuc.vehiculo?.vehicleInfo ?? tuc.vehicleInfo ?? 'N/A';
            const vehiclePlate = tuc.tuc?.vehiclePlate ?? tuc.vehiclePlate ?? 'N/A';
            const validityDate = tuc.fechas?.vigencia ?? tuc.validityDate;
            const expirationDate = validityDate ? String(validityDate).split('T')[0] : 'N/A';
            const estado = tuc.estado;
            const expired = isTucExpired(tuc);

            return (
              <TableRow key={tucNumber} className={tableStyles.row}>
                <TableCell className={tableStyles.codeCell}>{tucNumber}</TableCell>
                <TableCell className={tableStyles.textCell}>{vehicleInfo}</TableCell>
                <TableCell className={tableStyles.plateCell}>{vehiclePlate}</TableCell>
                <TableCell>
                  <div className={tableStyles.textCell}>
                    <p className="font-medium">{expirationDate}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`${getStatusColor(estado)} border px-3 py-1 rounded-full font-semibold`}>
                    {String(estado?.descripcion ?? 'sin estado').toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell className={tableStyles.textCell}>{getPropietarioName(tuc.propietario)}</TableCell>
                <TableCell className={tableStyles.actionsCell}>
                  <div className={tableStyles.actionsGroup}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={tableStyles.actionBlue}
                      onClick={() => onView(tucNumber)}
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {!expired && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={tableStyles.actionBlue}
                        onClick={() => onEdit(tucNumber)}
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    {expired && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={tableStyles.actionCyan}
                        onClick={() => onRenew(tuc)}
                        title="Renovar"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    )}
                    {!expired && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={tableStyles.actionRed}
                        onClick={() => onDelete(tuc)}
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
