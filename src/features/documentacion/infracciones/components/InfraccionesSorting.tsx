import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { ViolationsListParams } from "../types";

interface Props {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  disabled?: boolean;
}

const sortOptions = [
  { value: 'code', label: 'Código' },
  { value: 'description', label: 'Descripción' },
  { value: 'severity', label: 'Gravedad' },
  { value: 'uitPercentage', label: 'Porcentaje UIT' },
  { value: 'target', label: 'Objetivo' },
  { value: 'createdAt', label: 'Fecha de Creación' },
  { value: 'updatedAt', label: 'Última Actualización' }
];

export const InfraccionesSorting = ({ sortBy, sortOrder, onSortChange, disabled = false }: Props) => {
  const handleSortByChange = (newSortBy: string) => {
    onSortChange(newSortBy, sortOrder);
  };

  const toggleSortOrder = () => {
    onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getSortIcon = () => {
    if (sortOrder === 'asc') {
      return <ArrowUp className="h-4 w-4" />;
    }
    return <ArrowDown className="h-4 w-4" />;
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        <ArrowUpDown className="h-4 w-4" />
        Ordenar por:
      </div>

      <div className="flex items-center gap-2 flex-1">
        <Select
          value={sortBy}
          onValueChange={handleSortByChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Seleccionar orden" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleSortOrder}
          disabled={disabled}
          className="px-3"
          title={`Orden ${sortOrder === 'asc' ? 'ascendente' : 'descendente'}`}
        >
          {getSortIcon()}
        </Button>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400">
        {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
      </div>
    </div>
  );
};