import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Car, Calendar } from "lucide-react";
import { Eye, Edit, Trash2, RefreshCw, Search } from "lucide-react";
import { Empresa } from "../types";

interface Props {
  empresas: Empresa[];
  loading: boolean;
  onView: (ruc: string) => void;
  onEdit: (empresa: Empresa) => void;
  onDelete: (ruc: string) => void;
}

export const EmpresasTable = ({ empresas, loading, onView, onEdit, onDelete }: Props) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-600 dark:text-purple-400" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando empresas...</span>
      </div>
    );
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'ACTIVO': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700';
      case 'SUSPENDIDO': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700';
      case 'BAJA PROV.': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-700/30 dark:text-gray-400 dark:border-gray-600';
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <Table>
        <TableHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30 border-b border-purple-200 dark:border-purple-800/30">
          <TableRow>
            <TableHead className="font-bold text-purple-900 dark:text-purple-200">RUC</TableHead>
            <TableHead className="font-bold text-purple-900 dark:text-purple-200">Empresa</TableHead>
            <TableHead className="font-bold text-purple-900 dark:text-purple-200">Resolución</TableHead>
            <TableHead className="font-bold text-purple-900 dark:text-purple-200">Vencimiento</TableHead>
            <TableHead className="font-bold text-purple-900 dark:text-purple-200">Estado</TableHead>
            <TableHead className="font-bold text-purple-900 dark:text-purple-200">Vehículos</TableHead>
            <TableHead className="font-bold text-purple-900 dark:text-purple-200 text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {empresas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                  <Search className="w-8 h-8 mb-2" />
                  <p>No hay empresas registradas en el sistema</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            empresas.map((empresa) => (
              <TableRow key={empresa.ruc} className="hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-colors border-b border-gray-200 dark:border-gray-700">
                <TableCell className="font-mono font-bold text-purple-800 dark:text-purple-300">{empresa.ruc}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{empresa.nombre}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />{empresa.direccion}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{empresa.nro_resolucion}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{empresa.entidad_emisora}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{empresa.fecha_vencimiento}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`${getEstadoBadge(empresa.estado)} font-semibold rounded-full border`}>
                    {empresa.estado}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-center">
                    <span className="font-bold text-lg text-purple-700 dark:text-purple-300">{empresa.vehiculos_asociados}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">vehículos</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button variant="ghost" size="sm" className="hover:bg-purple-100 dark:hover:bg-purple-950/30 rounded-lg text-gray-600 dark:text-gray-400" onClick={() => onView(empresa.ruc)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-purple-100 dark:hover:bg-purple-950/30 rounded-lg text-gray-600 dark:text-gray-400" onClick={() => onEdit(empresa)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-red-100 dark:hover:bg-red-950/30 rounded-lg" onClick={() => onDelete(empresa.ruc)}>
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