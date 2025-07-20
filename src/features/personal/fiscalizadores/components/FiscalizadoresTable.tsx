import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Search, RefreshCw } from "lucide-react";
import { Fiscalizador } from "../types";
import React from "react";

interface Props {
  fiscalizadores: Fiscalizador[];
  loading: boolean;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  searchTerm: string;
}

const FiscalizadoresTable = React.memo(({ fiscalizadores, loading, onView, onEdit, searchTerm }: Props) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <RefreshCw className="w-8 h-8 animate-spin text-red-600 dark:text-red-400" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">Cargando fiscalizadores...</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
      <Table>
        <TableHeader className="bg-red-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <TableRow>
            <TableHead className="font-bold text-red-900 dark:text-white py-4">ID Usuario</TableHead>
            <TableHead className="font-bold text-red-900 dark:text-white py-4">Usuario</TableHead>
            <TableHead className="font-bold text-red-900 dark:text-white py-4">Email</TableHead>
            <TableHead className="font-bold text-red-900 dark:text-white py-4">Estado</TableHead>
            <TableHead className="font-bold text-red-900 dark:text-white py-4">Último Acceso</TableHead>
            <TableHead className="font-bold text-red-900 dark:text-white py-4">Dispositivo</TableHead>
            <TableHead className="font-bold text-red-900 dark:text-white text-center py-4">Acciones</TableHead>
          </TableRow>
        </TableHeader>
      <TableBody>
        {fiscalizadores.length === 0 && !loading ? (
          <TableRow>
            <TableCell colSpan={7} className="h-32 text-center border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 py-8">
                <Search className="w-8 h-8 mb-2 text-gray-400 dark:text-gray-500" />
                {searchTerm ? (
                  <p className="text-gray-600 dark:text-gray-400">No se encontraron fiscalizadores que coincidan con "{searchTerm}"</p>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No hay fiscalizadores registrados</p>
                )}
              </div>
            </TableCell>
          </TableRow>
        ) : (
          fiscalizadores.map((fiscalizador) => (
            <TableRow key={fiscalizador.idUsuario} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700">
              <TableCell className="font-mono font-semibold text-red-600 dark:text-red-400 py-4">{fiscalizador.idUsuario}</TableCell>
              <TableCell className="font-semibold text-gray-900 dark:text-white py-4">{fiscalizador.usuario}</TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300 py-4">{fiscalizador.email}</TableCell>
              <TableCell className="py-4">
                <Badge
                  variant="secondary"
                  className={`px-3 py-1 rounded-full font-semibold border ${
                    fiscalizador.isActive
                      ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800"
                      : "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                  }`}
                >
                  {fiscalizador.estado}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300 text-sm py-4">{fiscalizador.ultimoAcceso}</TableCell>
              <TableCell className="py-4">
                <Badge
                  variant="outline"
                  className={
                    fiscalizador.deviceConfigured 
                      ? "text-green-700 dark:text-green-300 border-green-300 dark:border-green-600" 
                      : "text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-600"
                  }
                >
                  {fiscalizador.dispositivo}
                </Badge>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg text-gray-600 dark:text-gray-400 hover:text-red-700 dark:hover:text-red-300"
                    onClick={() => onView(fiscalizador.idUsuario)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-300"
                    onClick={() => onEdit(fiscalizador.idUsuario)}
                  >
                    <Edit className="w-4 h-4" />
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
});

FiscalizadoresTable.displayName = "FiscalizadoresTable";

export default FiscalizadoresTable;