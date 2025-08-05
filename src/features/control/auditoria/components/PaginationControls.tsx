import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationData } from "../types";

interface Props {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  searchTerm?: string;
  actionFilter?: string;
}

export const PaginationControls = ({ pagination, onPageChange, searchTerm, actionFilter }: Props) => {
  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Mostrando página {pagination.current_page} de {pagination.total_pages} 
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.current_page - 1)}
          disabled={!pagination.has_previous}
          className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.current_page + 1)}
          disabled={!pagination.has_next}
          className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <ChevronRight className="h-4 w-4 ml-1" />
          Siguiente
        </Button>
      </div>
    </div>
  );
};
