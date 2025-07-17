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
        <RefreshCw className="w-8 h-8 animate-spin text-[#812020]" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="bg-gradient-to-r from-[#812020]/10 to-[#a94442]/10 dark:from-[#2d0909] dark:to-[#3a1010]">
        <TableRow>
          <TableHead className="font-bold text-[#812020] dark:text-[#fca5a5]">ID Usuario</TableHead>
          <TableHead className="font-bold text-[#812020] dark:text-[#fca5a5]">Usuario</TableHead>
          <TableHead className="font-bold text-[#812020] dark:text-[#fca5a5]">Email</TableHead>
          <TableHead className="font-bold text-[#812020] dark:text-[#fca5a5]">Estado</TableHead>
          <TableHead className="font-bold text-[#812020] dark:text-[#fca5a5]">Último Acceso</TableHead>
          <TableHead className="font-bold text-[#812020] dark:text-[#fca5a5]">Dispositivo</TableHead>
          <TableHead className="font-bold text-[#812020] dark:text-[#fca5a5] text-center">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fiscalizadores.length === 0 && !loading ? (
          <TableRow>
            <TableCell colSpan={7} className="h-32 text-center">
              <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                <Search className="w-8 h-8 mb-2" />
                {searchTerm ? (
                  <p>No se encontraron fiscalizadores que coincidan con "{searchTerm}"</p>
                ) : (
                  <p>No hay fiscalizadores registrados</p>
                )}
              </div>
            </TableCell>
          </TableRow>
        ) : (
          fiscalizadores.map((fiscalizador) => (
            <TableRow key={fiscalizador.idUsuario} className="hover:bg-[#812020]/10 dark:hover:bg-[#2d0909]/40 transition-colors">
              <TableCell className="font-mono font-semibold text-[#812020] text-foreground dark:text-muted-foreground">{fiscalizador.idUsuario}</TableCell>
              <TableCell className="font-semibold text-foreground dark:text-muted-foreground">{fiscalizador.usuario}</TableCell>
              <TableCell className="text-foreground dark:text-muted-foreground">{fiscalizador.email}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={`px-3 py-1 rounded-full font-semibold border ${
                    fiscalizador.isActive
                      ? "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-200 dark:border-emerald-800"
                      : "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                  }`}
                >
                  {fiscalizador.estado}
                </Badge>
              </TableCell>
              <TableCell className="text-foreground dark:text-muted-foreground text-sm">{fiscalizador.ultimoAcceso}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={fiscalizador.deviceConfigured ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}
                >
                  {fiscalizador.dispositivo}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-[#812020]/10 dark:hover:bg-[#2d0909]/40 rounded-lg"
                    onClick={() => onView(fiscalizador.idUsuario)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-[#812020]/10 dark:hover:bg-[#2d0909]/40 rounded-lg"
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
  );
});

FiscalizadoresTable.displayName = "FiscalizadoresTable";

export default FiscalizadoresTable;