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
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Cargando vehículos...</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50">
          <TableRow>
            <TableHead className="font-bold text-blue-900">Placa</TableHead>
            <TableHead className="font-bold text-blue-900">Propietario</TableHead>
            <TableHead className="font-bold text-blue-900">Empresa</TableHead>
            <TableHead className="font-bold text-blue-900">Tipo</TableHead>
            <TableHead className="font-bold text-blue-900">Estado</TableHead>
            <TableHead className="font-bold text-blue-900 text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehiculos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <Search className="w-8 h-8 mb-2" />
                  <p>No hay vehículos registrados en el sistema</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            vehiculos.map((vehiculo: any) => (
              <TableRow key={vehiculo.placa?.plateNumber || vehiculo.placa_v || Math.random()} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/40 transition-colors">
                <TableCell className="font-mono font-semibold text-blue-700">
                  {vehiculo.placa?.plateNumber || vehiculo.placa_v || '-'}
                </TableCell>
                <TableCell className="font-semibold text-foreground">
                  {vehiculo.propietario?.nombreCompleto || '-'}
                </TableCell>
                <TableCell className="text-gray-700">
                  {vehiculo.empresa?.nombre || '-'}
                </TableCell>
                <TableCell>
                  {vehiculo.tipo ? `${vehiculo.tipo.marca || ''} ${vehiculo.tipo.modelo || ''}`.trim() || '-' : '-'}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    vehiculo.estado === 'OPERATIVO' 
                      ? 'bg-green-100 text-green-800' 
                      : vehiculo.estado === 'INACTIVO'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {vehiculo.estado || '-'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-blue-100 rounded-lg"
                      onClick={() => onView(vehiculo.placa?.plateNumber || vehiculo.placa_v || '')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-yellow-100 rounded-lg"
                      onClick={() => onEdit(vehiculo)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-red-100 rounded-lg"
                      onClick={() => onDelete(vehiculo.placa?.plateNumber || vehiculo.placa_v || '')}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
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