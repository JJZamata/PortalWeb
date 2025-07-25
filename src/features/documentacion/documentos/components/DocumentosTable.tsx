import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Search } from "lucide-react";
import { Documento } from "../types";

interface Props {
  documentos: Documento[];
  loading: boolean;
}

export const DocumentosTable = ({ documentos, loading }: Props) => {
  const getBadgeVariant = (estado: string) => {
    const estadoLower = estado.toLowerCase();
    switch (estadoLower) {
      case 'vigente': return 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'por vencer': return 'bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'vencido': return 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
      default: return 'bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <RefreshCw className="w-8 h-8 animate-spin text-cyan-600 dark:text-cyan-400" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando documentos...</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <Table>
        <TableHeader className="bg-gradient-to-r from-cyan-50 to-cyan-100/50 dark:from-gray-800 dark:to-gray-800">
          <TableRow>
            <TableHead className="font-bold text-cyan-900 dark:text-gray-300">Tipo</TableHead>
            <TableHead className="font-bold text-cyan-900 dark:text-gray-300">Número</TableHead>
            <TableHead className="font-bold text-cyan-900 dark:text-gray-300">Placa</TableHead>
            <TableHead className="font-bold text-cyan-900 dark:text-gray-300">Entidad/Empresa</TableHead>
            <TableHead className="font-bold text-cyan-900 dark:text-gray-300">Fecha Emisión</TableHead>
            <TableHead className="font-bold text-cyan-900 dark:text-gray-300">Vencimiento</TableHead>
            <TableHead className="font-bold text-cyan-900 dark:text-gray-300">Estado</TableHead>
            <TableHead className="font-bold text-cyan-900 dark:text-gray-300">Detalles</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documentos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                  <Search className="w-8 h-8 mb-2" />
                  <p>No hay documentos disponibles</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            documentos.map((documento, index) => (
              <TableRow 
                key={index} 
                className="hover:bg-cyan-50/50 dark:hover:bg-cyan-900/40 transition-colors"
              >
                <TableCell className="font-semibold text-gray-900 dark:text-white">{documento.tipo}</TableCell>
                <TableCell className="font-mono text-gray-600 dark:text-gray-400">{documento.numero}</TableCell>
                <TableCell className="font-mono font-semibold text-gray-900 dark:text-white">{documento.placa}</TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400 font-medium">{documento.entidad_empresa}</TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">{documento.fecha_emision}</TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">{documento.fecha_vencimiento}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`${getBadgeVariant(documento.estado)} border px-3 py-1 rounded-full font-semibold`}>
                    {documento.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400 text-sm">
                  {documento.detalles ? (
                    documento.tipo === 'REVISION'
                      ? `Resultado: ${documento.detalles.inspection_result}`
                      : documento.tipo === 'AFOCAT'
                        ? `Cobertura: ${documento.detalles.cobertura}`
                        : 'Sin detalles'
                  ) : 'Sin detalles'}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};