import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationData } from "../types";
import React from "react";

interface Props {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  searchTerm: string;
}

const PaginationControls = React.memo(({ pagination, onPageChange, searchTerm }: Props) => {
  const { currentPage, totalPages, totalItems, hasPrevPage, hasNextPage } = pagination;

  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t" role="navigation" aria-label="Paginación">
      <div className="text-sm text-gray-600" aria-live="polite">
        {searchTerm
          ? `Mostrando ${totalItems} (búsqueda: "${searchTerm}")`
          : `Mostrando Página ${currentPage} de ${totalPages}`}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          aria-label="Página siguiente"
        >
          Siguiente
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
});

PaginationControls.displayName = "PaginationControls";

export default PaginationControls;