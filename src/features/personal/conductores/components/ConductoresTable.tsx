import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, RefreshCw, Search } from "lucide-react";
import { ConductorDetalladoNuevo } from "../types";

interface Props {
  conductores: ConductorDetalladoNuevo[];
  loading: boolean;
  onView: (dni: string) => void;
  onEdit: (conductor: any) => void; // Ajustar tipo según ConductorDetalladoNuevo
  onDelete: (dni: string) => void;
}

export const ConductoresTable = ({ conductores, loading, onView, onEdit, onDelete }: Props) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <RefreshCw className="w-8 h-8 animate-spin text-green-600 dark:text-green-400" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">Cargando conductores...</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
      <Table>
        <TableHeader className="bg-green-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <TableRow>
            <TableHead className="font-bold text-green-900 dark:text-white py-4">DNI</TableHead>
            <TableHead className="font-bold text-green-900 dark:text-white py-4">Nombre Completo</TableHead>
            <TableHead className="font-bold text-green-900 dark:text-white py-4">Teléfono</TableHead>
            <TableHead className="font-bold text-green-900 dark:text-white py-4">Dirección</TableHead>
            <TableHead className="font-bold text-green-900 dark:text-white text-center py-4">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conductores.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 py-8">
                  <Search className="w-8 h-8 mb-2 text-gray-400 dark:text-gray-500" />
                  <p className="text-gray-600 dark:text-gray-400">No hay conductores registrados en el sistema</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            conductores.map((conductor) => (
              <TableRow key={conductor.dni} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700">
                <TableCell className="font-mono font-semibold text-green-600 dark:text-green-400 py-4">{conductor.dni}</TableCell>
                <TableCell className="font-semibold text-gray-900 dark:text-white py-4">{conductor.nombreCompleto}</TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300 py-4">{conductor.phoneNumber || 'No registrado'}</TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300 py-4">{conductor.address || 'No registrada'}</TableCell>
                <TableCell className="py-4">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-300"
                      onClick={() => onView(conductor.dni)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-300"
                      onClick={() =>
                        onEdit({
                          dni: conductor.dni,
                          nombreCompleto: conductor.nombreCompleto,
                          firstName: conductor.firstName || '',
                          lastName: conductor.lastName || '',
                          phoneNumber: conductor.phoneNumber || '',
                          address: conductor.address || '',
                          photoUrl: conductor.photoUrl || '',
                          fechaRegistro: '',
                          ultimaActualizacion: '',
                        })
                      }
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      onClick={() => onDelete(conductor.dni)}
                    >
                      <Trash2 className="w-4 h-4" />
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