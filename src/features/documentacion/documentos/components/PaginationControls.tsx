import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationData } from "../types";

interface Props {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  searchTerm: string;
  tipoFiltro: string;
}

export const PaginationControls = ({ pagination, onPageChange, searchTerm, tipoFiltro }: Props) => {
  const handleNextPage = () => {
    if (pagination.has_next) {
      onPageChange(pagination.current_page + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.has_previous) {
      onPageChange(pagination.current_page - 1);
    }
  };

  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Mostrando página {pagination.current_page} de {pagination.total_pages}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevPage}
          disabled={!pagination.has_previous}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={!pagination.has_next}
        >
          Siguiente
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};