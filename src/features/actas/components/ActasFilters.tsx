import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, RotateCcw } from "lucide-react";

interface Props {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  recordType: string;
  setRecordType: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  handleSearch: () => void;
  handleResetFilters: () => void;
}

export const ActasFilters = ({
  searchTerm,
  setSearchTerm,
  recordType,
  setRecordType,
  sortBy,
  setSortBy,
  handleSearch,
  handleResetFilters
}: Props) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
        <Input
          placeholder="Buscar por placa, inspector, ubicación..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 h-12 border-gray-200 dark:border-gray-700 rounded-xl focus:border-pink-500 focus:ring-pink-500/20 bg-white dark:bg-gray-800 dark:text-white text-base"
        />
      </div>
      <div className="flex gap-2 min-w-[200px]">
        <Select value={recordType} onValueChange={setRecordType}>
          <SelectTrigger className="h-12 border-gray-200 dark:border-gray-700 rounded-xl focus:border-pink-500 focus:ring-pink-500/20 bg-white dark:bg-gray-800 dark:text-white">
            <SelectValue placeholder="Tipo de acta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las actas</SelectItem>
            <SelectItem value="conforme">Conformes</SelectItem>
            <SelectItem value="noconforme">No Conformes</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 min-w-[200px]">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="h-12 border-gray-200 dark:border-gray-700 rounded-xl focus:border-pink-500 focus:ring-pink-500/20 bg-white dark:bg-gray-800 dark:text-white">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Fecha de creación</SelectItem>
            <SelectItem value="inspectionDateTime">Fecha de inspección</SelectItem>
            <SelectItem value="vehiclePlate">Placa</SelectItem>
            <SelectItem value="location">Ubicación</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
    </div>
  );
};