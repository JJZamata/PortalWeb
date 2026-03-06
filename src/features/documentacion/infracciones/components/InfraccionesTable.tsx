import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, RefreshCw, Search } from "lucide-react";
import { Violation } from "../types";
import { tableStyles } from "@/lib/table-styles";

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
        <RefreshCw className={tableStyles.loadingSpinnerBlue} />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando infracciones...</span>
      </div>
    );
  }

  return (
    <div className={tableStyles.container}>
      <Table>
        <TableHeader className={tableStyles.header}>
          <TableRow>
            <TableHead className={tableStyles.headText}>Código</TableHead>
            <TableHead className={tableStyles.headText}>Descripción</TableHead>
            <TableHead className={tableStyles.headText}>Gravedad</TableHead>
            <TableHead className={tableStyles.headText}>Medida Adm.</TableHead>
            <TableHead className={tableStyles.headText}>Objetivo</TableHead>
            <TableHead className={`${tableStyles.headText} text-right`}>UIT %</TableHead>
            <TableHead className={`${tableStyles.headText} ${tableStyles.actionsHead}`}>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {violations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className={tableStyles.emptyCell}>
                <div className={tableStyles.emptyState}>
                  <Search className="w-8 h-8 mb-2" />
                  <p>No hay infracciones registradas o que coincidan con el filtro.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            violations.map((v) => (
              <TableRow key={v.identificacion.id} className={tableStyles.row}>
                <TableCell className={tableStyles.codeCell}>{v.identificacion.codigo}</TableCell>
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
                <TableCell className={tableStyles.actionsCell}>
                  <div className={tableStyles.actionsGroup}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={tableStyles.actionBlue}
                      onClick={() => fetchViolationDetail(v.identificacion.codigo)}
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={tableStyles.actionBlue}
                      onClick={() => onEditViolation(v)}
                      title="Editar infracción"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={tableStyles.actionRed}
                      onClick={() => onDeleteViolation(v)}
                      title="Eliminar infracción"
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