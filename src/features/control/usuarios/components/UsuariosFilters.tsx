import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, X } from "lucide-react";
import { UsuariosQueryParams } from "../types";

interface Props {
  filters: Partial<UsuariosQueryParams>;
  onFiltersChange: (filters: Partial<UsuariosQueryParams>) => void;
  onClearFilters: () => void;
  loading: boolean;
}

const statusOptions = [
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
];

const roleOptions = [
  { value: "admin", label: "Administrador" },
  { value: "fiscalizador", label: "Fiscalizador" },
];

const sortOptions = [
  { value: "id", label: "ID" },
  { value: "username", label: "Usuario" },
  { value: "email", label: "Email" },
  { value: "isActive", label: "Estado" },
  { value: "lastLogin", label: "Último Acceso" },
  { value: "deviceConfigured", label: "Dispositivo Configurado" },
  { value: "createdAt", label: "Fecha de Creación" },
  { value: "updatedAt", label: "Última Actualización" },
];

export const UsuariosFilters = ({ filters, onFiltersChange, onClearFilters, loading }: Props) => {
  const hasActiveFilters = filters.status || filters.role || filters.deviceConfigured !== undefined;

  const handleFilterChange = (key: keyof UsuariosQueryParams, value: any) => {
    const newFilters = { ...filters };

    if (value === undefined || value === null) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }

    onFiltersChange(newFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.status) count++;
    if (filters.role) count++;
    if (filters.deviceConfigured !== undefined) count++;
    return count;
  };

  return (
    <Card className="shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <Label className="text-sm font-semibold text-gray-900 dark:text-white">
              Filtros
            </Label>
            {hasActiveFilters && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800">
                {getActiveFiltersCount()} activos
              </Badge>
            )}
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              disabled={loading}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 h-8 px-2"
            >
              <X className="w-4 h-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtro de Estado */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Estado
            </Label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => handleFilterChange("status", value === "all" ? undefined : value)}
              disabled={loading}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro de Rol */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Rol
            </Label>
            <Select
              value={filters.role || "all"}
              onValueChange={(value) => handleFilterChange("role", value === "all" ? undefined : value)}
              disabled={loading}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Todos los roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro de Dispositivo Configurado */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Dispositivo
            </Label>
            <div className="flex items-center space-x-2 h-9">
              <Checkbox
                id="deviceConfigured"
                checked={filters.deviceConfigured === true}
                onCheckedChange={(checked) =>
                  handleFilterChange("deviceConfigured", checked ? true : undefined)
                }
                disabled={loading}
              />
              <Label
                htmlFor="deviceConfigured"
                className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                Configurado
              </Label>
            </div>
          </div>

          {/* Filtro de Ordenamiento */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Ordenar por
            </Label>
            <div className="flex gap-1">
              <Select
                value={filters.sortBy || "id"}
                onValueChange={(value) => handleFilterChange("sortBy", value)}
                disabled={loading}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.sortOrder || "ASC"}
                onValueChange={(value) => handleFilterChange("sortOrder", value)}
                disabled={loading}
              >
                <SelectTrigger className="h-9 w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ASC">↑</SelectItem>
                  <SelectItem value="DESC">↓</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};