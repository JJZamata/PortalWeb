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
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700" role="navigation" aria-label="Paginación">
      <div className="text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
        {searchTerm
          ? `Encontrados ${totalItems} para "${searchTerm}" (página ${currentPage} de ${totalPages})`
          : `Mostrando página ${currentPage} de ${totalPages}`}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          aria-label="Página anterior"
          className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
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
          className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
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