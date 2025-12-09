import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  Smartphone,
  RefreshCw,
  TrendingUp,
  Activity
} from "lucide-react";

interface Props {
  stats: any;
  loading: boolean;
  error: string | null;
  groupBy: string;
  onGroupByChange: (value: 'all' | 'role' | 'device') => void;
  onRefresh: () => void;
}

const groupByOptions = [
  { value: 'all', label: 'Todas las estadísticas' },
  { value: 'role', label: 'Por rol' },
  { value: 'device', label: 'Por dispositivo' },
];

export const UsuarioStats = ({ stats, loading, error, groupBy, onGroupByChange, onRefresh }: Props) => {
  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      'admin': 'Administradores',
      'fiscalizador': 'Fiscalizadores'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  if (error) {
    return (
      <Card className="shadow-lg border-0 bg-white dark:bg-gray-900 rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center h-64">
          <Activity className="w-12 h-12 text-red-500 dark:text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error al cargar estadísticas</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">{error}</p>
          <Button onClick={onRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading || !stats) {
    return (
      <Card className="shadow-lg border-0 bg-white dark:bg-gray-900 rounded-2xl">
        <CardContent className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-purple-600 dark:text-purple-400" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando estadísticas...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white dark:bg-gray-900 rounded-2xl">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Estadísticas de Usuarios
            {loading && <RefreshCw className="w-5 h-5 animate-spin text-purple-600 dark:text-purple-400" />}
          </CardTitle>
          <div className="flex gap-2">
            <Select value={groupBy} onValueChange={onGroupByChange} disabled={loading}>
              <SelectTrigger className="w-48 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {groupByOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total de Usuarios */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-950/30 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Usuarios</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-200 mt-1">
                  {stats.totalUsers}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          {/* Usuarios Activos */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-950/30 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Usuarios Activos</p>
                <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-200 mt-1">
                  {stats.activeUsers}
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                  {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% del total
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>

          {/* Usuarios Inactivos */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-950/30 p-6 rounded-xl border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Usuarios Inactivos</p>
                <p className="text-3xl font-bold text-red-900 dark:text-red-200 mt-1">
                  {stats.inactiveUsers}
                </p>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                  {((stats.inactiveUsers / stats.totalUsers) * 100).toFixed(1)}% del total
                </p>
              </div>
              <UserX className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* Tasa de Actividad */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-950/30 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Tasa de Actividad</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-200 mt-1">
                  {((stats.activeUsers / stats.totalUsers) * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                  Usuarios activos
                </p>
              </div>
              <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Estadísticas Adicionales */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Estadísticas por Rol */}
          {stats.byRole && (
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Distribución por Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.byRole).map(([role, count]) => (
                    <div key={role} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={`${
                            role === 'admin'
                              ? 'border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-700 dark:bg-purple-950/30 dark:text-purple-400'
                              : 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                          }`}
                        >
                          {getRoleDisplayName(role)}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">{count}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {((count / stats.totalUsers) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Estadísticas de Dispositivos */}
          {stats.deviceConfiguration && (
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Configuración de Dispositivos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <span className="font-medium text-gray-900 dark:text-white">Configurados</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-700 dark:text-emerald-400">{stats.deviceConfiguration.configured}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {((stats.deviceConfiguration.configured / stats.totalUsers) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span className="font-medium text-gray-900 dark:text-white">No Configurados</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-700 dark:text-red-400">{stats.deviceConfiguration.notConfigured}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {((stats.deviceConfiguration.notConfigured / stats.totalUsers) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
};