import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationData } from "../types";

interface Props {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  searchTerm: string;
}

export const PaginationControls = ({ pagination, onPageChange, searchTerm }: Props) => {
  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t">
      <div className="text-sm text-gray-600">
        {searchTerm ? (
          `Encontrados ${pagination.totalItems} para "${searchTerm}" (página ${pagination.currentPage} de ${pagination.totalPages})`
        ) : (
          `Mostrando página ${pagination.currentPage} de ${pagination.totalPages}`
        )}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrevPage}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage}
        >
          Siguiente
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};