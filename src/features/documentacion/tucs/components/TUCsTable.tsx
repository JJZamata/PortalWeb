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

interface Props {
  tucs: TUCData[] | undefined | null;
  loading: boolean;
  onView: (tucNumber: string) => void;
  onEdit: (tucNumber: string) => void;
  onDelete: (tuc: TUCData) => void;
  onRenew: (tuc: TUCData) => void;
}

const getStatusColor = (estado: TUCData['estado'] | undefined): string => {
  const colorMap: Record<string, string> = {
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };
  return colorMap[estado?.color] || colorMap.gray;
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
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando TUCs...</span>
      </div>
    );
  }

  if (validTucs.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 text-center">
          <Search className="w-8 h-8 mb-2" />
          <p>No se encontraron TUCs</p>
          <p className="text-sm text-gray-500">Crea una nueva TUC para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-800">
          <TableRow>
            <TableHead className="font-bold text-white">TUC</TableHead>
            <TableHead className="font-bold text-white">Vehículo</TableHead>
            <TableHead className="font-bold text-white">Placa</TableHead>
            <TableHead className="font-bold text-white">Vigencia</TableHead>
            <TableHead className="font-bold text-white">Estado</TableHead>
            <TableHead className="font-bold text-white">Propietario</TableHead>
            <TableHead className="text-right font-bold text-white">Acciones</TableHead>
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
            const diasRestantes = tuc.fechas?.diasRestantes ?? tuc.diasRestantes ?? 0;
            const estado = tuc.estado;
            const expired = isTucExpired(tuc);

            return (
              <TableRow key={tucNumber} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <TableCell className="font-mono text-white">{tucNumber}</TableCell>
                <TableCell className="text-sm text-gray-600 dark:text-gray-400 font-medium">{vehicleInfo}</TableCell>
                <TableCell className="font-mono font-semibold text-gray-900 dark:text-white">{vehiclePlate}</TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">{validityDate ? new Date(validityDate).toLocaleDateString('es-PE') : 'N/A'}</p>
                    <p className="text-xs text-gray-500">{diasRestantes} días</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(estado)}`}>{estado?.descripcion ?? 'Sin estado'}</Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-600 dark:text-gray-400 font-medium">{getPropietarioName(tuc.propietario)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      onClick={() => onView(tucNumber)}
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {!expired && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
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
                        className="hover:bg-cyan-100 dark:hover:bg-cyan-900/50 rounded-lg text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
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
                        className="hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
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
