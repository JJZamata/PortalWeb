import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, RefreshCw, Search } from "lucide-react";

interface Conductor {
  dni: string;
  nombreCompleto: string;
  telefono: string;
  direccion: string;
}

interface Props {
  conductores: Conductor[];
  loading: boolean;
  onView: (dni: string) => void;
  onEdit: (conductor: any) => void; // Ajustar tipo según ConductorDetalladoNuevo
  onDelete: (dni: string) => void;
}

export const ConductoresTable = ({ conductores, loading, onView, onEdit, onDelete }: Props) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Cargando conductores...</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader className="bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-950 dark:to-green-900/50">
          <TableRow>
            <TableHead className="font-bold text-green-900 dark:text-green-200">DNI</TableHead>
            <TableHead className="font-bold text-green-900 dark:text-green-200">Nombre Completo</TableHead>
            <TableHead className="font-bold text-green-900 dark:text-green-200">Teléfono</TableHead>
            <TableHead className="font-bold text-green-900 dark:text-green-200">Dirección</TableHead>
            <TableHead className="font-bold text-green-900 dark:text-green-200 text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conductores.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <Search className="w-8 h-8 mb-2" />
                  <p>No hay conductores registrados en el sistema</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            conductores.map((conductor) => (
              <TableRow key={conductor.dni} className="hover:bg-green-50/50 dark:hover:bg-green-900/40 transition-colors">
                <TableCell className="font-mono font-semibold text-green-700 dark:text-green-200">{conductor.dni}</TableCell>
                <TableCell className="font-semibold text-foreground dark:text-green-200">{conductor.nombreCompleto}</TableCell>
                <TableCell className="text-gray-700 dark:text-green-200">{conductor.telefono}</TableCell>
                <TableCell className="text-gray-700 dark:text-green-200">{conductor.direccion}</TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-green-100 rounded-lg"
                      onClick={() => onView(conductor.dni)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-green-100 rounded-lg"
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
                      className="hover:bg-red-100 rounded-lg"
                      onClick={() => onDelete(conductor.dni)}
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