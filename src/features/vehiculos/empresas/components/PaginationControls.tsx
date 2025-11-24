import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationData } from "../types";

interface Props {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  searchTerm: string;
  statusFilter: string;
}

export const PaginationControls = ({ pagination, onPageChange, searchTerm, statusFilter }: Props) => {
  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {searchTerm && statusFilter && statusFilter !== "ALL" ? (
          `Encontradas ${pagination.totalCompanies} empresas para "${searchTerm}" y estado "${statusFilter}" (página ${pagination.currentPage} de ${pagination.totalPages})`
        ) : searchTerm ? (
          `Encontradas ${pagination.totalCompanies} empresas para "${searchTerm}" (página ${pagination.currentPage} de ${pagination.totalPages})`
        ) : statusFilter && statusFilter !== "ALL" ? (
          `Encontradas ${pagination.totalCompanies} empresas con estado "${statusFilter}" (página ${pagination.currentPage} de ${pagination.totalPages})`
        ) : (
          `Mostrando página ${pagination.currentPage} de ${pagination.totalPages}`
        )}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPreviousPage}
          className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Siguiente
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};