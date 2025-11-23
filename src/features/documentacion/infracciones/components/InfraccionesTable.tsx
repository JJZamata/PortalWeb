import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, RefreshCw, Search } from "lucide-react";
import { Violation } from "../types";

interface Props {
  violations: Violation[];
  loading: boolean;
  fetchViolationDetail: (code: string) => void;
  onEditViolation: (violation: Violation) => void;
  onDeleteViolation: (violation: Violation) => void;
}

export const InfraccionesTable = ({ violations, loading, fetchViolationDetail, onEditViolation, onDeleteViolation }: Props) => {
  const getSeverityBadge = (severity: Violation['clasificacion']['gravedad']) => {
    switch (severity) {
      case 'minor':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700';
      case 'serious':
        return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700';
      case 'very_serious':
        return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700/30 dark:text-gray-400 dark:border-gray-600';
    }
  };

  const getTargetBadge = (target: Violation['clasificacion']['objetivo']) => {
    switch (target) {
      case 'driver-owner':
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700';
      case 'company':
        return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700/30 dark:text-gray-400 dark:border-gray-600';
    }
  };

  const translateSeverity = (severity: Violation['clasificacion']['gravedad']) => {
    const map = { minor: 'Leve', serious: 'Grave', very_serious: 'Muy Grave' };
    return map[severity] || 'Desconocida';
  };

  const translateTarget = (target: Violation['clasificacion']['objetivo']) => {
    const map = { 'driver-owner': 'Conductor/Propietario', company: 'Empresa' };
    return map[target] || 'Desconocido';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <RefreshCw className="w-8 h-8 animate-spin text-[#812020] dark:text-[#fca5a5]" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando infracciones...</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
      <Table>
        <TableHeader className="bg-red-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <TableRow>
            <TableHead className="font-bold text-[#74140B] dark:text-white py-4">Código</TableHead>
            <TableHead className="font-bold text-[#74140B] dark:text-white py-4">Descripción</TableHead>
            <TableHead className="font-bold text-[#74140B] dark:text-white py-4">Gravedad</TableHead>
            <TableHead className="font-bold text-[#74140B] dark:text-white py-4">Medida Adm.</TableHead>
            <TableHead className="font-bold text-[#74140B] dark:text-white py-4">Objetivo</TableHead>
            <TableHead className="font-bold text-[#74140B] dark:text-white text-right py-4">UIT %</TableHead>
            <TableHead className="font-bold text-[#74140B] dark:text-white text-center py-4">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {violations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                  <Search className="w-8 h-8 mb-2" />
                  <p>No hay infracciones registradas o que coincidan con el filtro.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            violations.map((v) => (
              <TableRow key={v.identificacion.id} className="hover:bg-[#812020]/10 dark:hover:bg-[#2d0909]/40 transition-colors">
                <TableCell className="font-mono font-bold text-[#812020] dark:text-[#fca5a5]">{v.identificacion.codigo}</TableCell>
                <TableCell className="max-w-md text-gray-900 dark:text-gray-100">
                  <div className="max-w-md">
                    <p className="text-sm">{v.descripcion.resumen}</p>
                    {v.descripcion.resumen !== v.descripcion.texto && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{v.descripcion.texto}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`border font-semibold rounded-full ${getSeverityBadge(v.clasificacion.gravedad)}`}>
                    {translateSeverity(v.clasificacion.gravedad)}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-900 dark:text-gray-100">{v.sancion.medidaAdministrativa}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`border font-semibold rounded-full ${getTargetBadge(v.clasificacion.objetivo)}`}>
                    {translateTarget(v.clasificacion.objetivo)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold text-[#812020] dark:text-[#fca5a5]">{v.sancion.porcentajeUIT}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg"
                      onClick={() => fetchViolationDetail(v.identificacion.codigo)}
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg"
                      onClick={() => onEditViolation(v)}
                      title="Editar infracción"
                    >
                      <Edit className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                      onClick={() => onDeleteViolation(v)}
                      title="Eliminar infracción"
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