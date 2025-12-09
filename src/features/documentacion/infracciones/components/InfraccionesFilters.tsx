import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, XCircle, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface Props {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  severityFilter: string;
  setSeverityFilter: (value: string) => void;
  clearFilters: () => void;
  loading: boolean;
}

const severities = [
  { value: "ALL", label: "Todas" },
  { value: "minor", label: "Leve" },
  { value: "serious", label: "Grave" },
  { value: "very_serious", label: "Muy Grave" },
];

export const InfraccionesFilters = ({
  searchTerm,
  setSearchTerm,
  severityFilter,
  setSeverityFilter,
  clearFilters,
  loading
}: Props) => {
  // Estado local para la búsqueda inmediata (sin debounce)
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const { debounce } = useDebounce({ delay: 300 });

  // Función para manejar el cambio en el input con debounce
  const handleSearchChange = (value: string) => {
    setLocalSearchTerm(value);

    // Aplicar debounce para actualizar la búsqueda real
    debounce(() => {
      setSearchTerm(value);
    });
  };

  // Sincronizar con cambios externos (ej: cuando se limpian los filtros)
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-10">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
        <Input
          placeholder="Buscar por código o descripción..."
          value={localSearchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-12 h-12 border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#812020] focus:ring-[#812020]/20 bg-white dark:bg-gray-800 dark:text-white text-base"
          disabled={loading}
        />
        {localSearchTerm.length > 0 && localSearchTerm.length < 2 && (
          <div className="absolute -bottom-6 left-0 text-xs text-amber-600 dark:text-amber-400">
            Ingresa al menos 2 caracteres para buscar
          </div>
        )}
        {localSearchTerm.length >= 2 && (
          <div className="absolute -bottom-6 left-0 text-xs text-gray-500 dark:text-gray-400">
            Buscando: "{localSearchTerm}" (esperando para buscar...)
          </div>
        )}
      </div>
      
      <div className="flex gap-2 min-w-[250px]">
        <div className="relative flex-1">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="h-12 pl-10 border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#812020] focus:ring-[#812020]/20 bg-white dark:bg-gray-800 dark:text-white">
              <SelectValue placeholder="Filtrar por gravedad" />
            </SelectTrigger>
            <SelectContent>
              {severities.map(s => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {(severityFilter !== 'ALL' || localSearchTerm.length > 0) && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="h-12 px-3 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl"
            title="Limpiar filtros"
            disabled={loading}
          >
            <XCircle className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};