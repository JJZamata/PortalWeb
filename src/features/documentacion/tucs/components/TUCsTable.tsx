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
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { TUCData, Propietario } from '../types';

interface Props {
  tucs: TUCData[] | undefined | null;
  loading: boolean;
  onView: (tucNumber: string) => void;
  onEdit: (tucNumber: string) => void;
  onDelete: (tucNumber: string) => void;
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

export const TUCsTable = ({ tucs, loading, onView, onEdit, onDelete }: Props) => {
  // Validar que tucs es un array válido
  const validTucs = Array.isArray(tucs) ? tucs : [];

  if (loading && validTucs.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-600 dark:text-gray-400">Cargando TUCs...</div>
      </div>
    );
  }

  if (validTucs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-gray-600 dark:text-gray-400 text-center">
          <p className="mb-2">No se encontraron TUCs</p>
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
            <TableHead>TUC</TableHead>
            <TableHead>Vehículo</TableHead>
            <TableHead>Placa</TableHead>
            <TableHead>Vigencia</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Propietario</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
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

            return (
              <TableRow key={tucNumber} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <TableCell className="font-medium">{tucNumber}</TableCell>
                <TableCell className="text-sm">{vehicleInfo}</TableCell>
                <TableCell className="font-mono text-sm">{vehiclePlate}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="font-medium">{validityDate ? new Date(validityDate).toLocaleDateString('es-PE') : 'N/A'}</p>
                    <p className="text-xs text-gray-500">{diasRestantes} días</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(estado)}`}>{estado?.descripcion ?? 'Sin estado'}</Badge>
                </TableCell>
                <TableCell className="text-sm">{getPropietarioName(tuc.propietario)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(tucNumber)}
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(tucNumber)}
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(tucNumber)}
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
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
