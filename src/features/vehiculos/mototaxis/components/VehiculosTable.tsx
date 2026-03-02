import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, RefreshCw, Search } from "lucide-react";
import { Vehiculo } from "../types";

interface Props {
  vehiculos: Vehiculo[];
  loading: boolean;
  onView: (plate: string) => void;
  onEdit: (vehiculo: Vehiculo) => void;
  onDelete: (plate: string) => void;
}

export const VehiculosTable = ({ vehiculos, loading, onView, onEdit, onDelete }: Props) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">Cargando vehículos...</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
      <Table>
        <TableHeader className="bg-blue-50 dark:bg-gray-800">
          <TableRow>
            <TableHead className="font-bold text-blue-900 dark:text-white">Placa</TableHead>
            <TableHead className="font-bold text-blue-900 dark:text-white">Propietario</TableHead>
            <TableHead className="font-bold text-blue-900 dark:text-white">Empresa</TableHead>
            <TableHead className="font-bold text-blue-900 dark:text-white">Tipo</TableHead>
            <TableHead className="font-bold text-blue-900 dark:text-white">Estado</TableHead>
            <TableHead className="font-bold text-blue-900 dark:text-white text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehiculos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                  <Search className="w-8 h-8 mb-2" />
                  <p>No hay vehículos registrados en el sistema</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            vehiculos.map((vehiculo: any) => (
              <TableRow key={vehiculo.placa?.plateNumber || vehiculo.placa_v || Math.random()} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <TableCell className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                  {vehiculo.placa?.plateNumber || vehiculo.placa_v || '-'}
                </TableCell>
                <TableCell className="font-semibold text-gray-900 dark:text-white">
                  {vehiculo.propietario?.nombreCompleto || '-'}
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">
                  {vehiculo.empresa?.nombre || '-'}
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">
                  {vehiculo.tipo ? `${vehiculo.tipo.marca || ''} ${vehiculo.tipo.modelo || ''}`.trim() || '-' : '-'}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    vehiculo.estado === 'OPERATIVO' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' 
                      : vehiculo.estado === 'INACTIVO'
                      ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {vehiculo.estado || '-'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg text-gray-600 dark:text-gray-300"
                      onClick={() => onView(vehiculo.placa?.plateNumber || vehiculo.placa_v || '')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-yellow-50 dark:hover:bg-yellow-900/50 rounded-lg text-gray-600 dark:text-gray-300"
                      onClick={() => onEdit(vehiculo)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg"
                      onClick={() => onDelete(vehiculo.placa?.plateNumber || vehiculo.placa_v || '')}
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </Button>
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