import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, RefreshCw, Search, Trash2, Key, Smartphone } from "lucide-react";
import { Usuario } from "../types";

interface Props {
  usuarios: Usuario[];
  loading: boolean;
  onView: (id: number) => void;
  onEdit: (usuario: Usuario) => void;
  onChangePassword: (usuario: Usuario) => void;
  onResetDevice: (usuario: Usuario) => void;
  onDelete: (usuario: Usuario) => void;
  searchTerm: string;
}

export const UsuariosTable = ({ usuarios, loading, onView, onEdit, onChangePassword, onResetDevice, onDelete, searchTerm }: Props) => {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800';
      case 'web_admin':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800';
      case 'fiscalizador':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800';
      case 'web_operator':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700';
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      'admin': 'Administrador',
      'web_admin': 'Admin Web',
      'fiscalizador': 'Fiscalizador',
      'web_operator': 'Operador Web'
    };
    return roleNames[role as keyof typeof roleNames] || 'Sin Rol';
  };

  const renderRoles = (rolesString: string) => {
    if (!rolesString) return <span className="text-gray-500">Sin roles</span>;

    const roles = rolesString.split(',').map(role => role.trim()).filter(role => role);

    if (roles.length === 0) return <span className="text-gray-500">Sin roles</span>;

    if (roles.length === 1) {
      const role = roles[0];
      return (
        <Badge variant="secondary" className={`border font-semibold rounded-full px-3 py-1 ${getRoleBadge(role)}`}>
          {getRoleDisplayName(role)}
        </Badge>
      );
    }

    return (
      <div className="flex flex-wrap gap-1">
        {roles.map((role, index) => (
          <Badge
            key={index}
            variant="secondary"
            className={`border font-semibold rounded-full px-2 py-1 text-xs ${getRoleBadge(role)}`}
          >
            {getRoleDisplayName(role)}
          </Badge>
        ))}
      </div>
    );
  };

  const getStatusBadge = (estado: string) => {
    return estado === 'Activo'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800'
      : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800';
  };

  const filteredUsuarios = usuarios.filter(usuario => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      usuario.usuario?.toLowerCase().includes(searchLower) ||
      usuario.email?.toLowerCase().includes(searchLower) ||
      usuario.id?.toString().includes(searchTerm)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-600 dark:text-purple-400" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">Cargando usuarios...</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
      <Table>
        <TableHeader className="bg-purple-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <TableRow>
            <TableHead className="font-bold text-purple-900 dark:text-white py-4">ID</TableHead>
            <TableHead className="font-bold text-purple-900 dark:text-white py-4">Usuario</TableHead>
            <TableHead className="font-bold text-purple-900 dark:text-white py-4">Email</TableHead>
            <TableHead className="font-bold text-purple-900 dark:text-white py-4">Rol</TableHead>
            <TableHead className="font-bold text-purple-900 dark:text-white py-4">Estado</TableHead>
            <TableHead className="font-bold text-purple-900 dark:text-white py-4">Último Acceso</TableHead>
            <TableHead className="font-bold text-purple-900 dark:text-white py-4">Dispositivo</TableHead>
            <TableHead className="font-bold text-purple-900 dark:text-white text-center py-4">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsuarios.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 py-8">
                  <Search className="w-8 h-8 mb-2 text-gray-400 dark:text-gray-500" />
                  <p className="text-gray-600 dark:text-gray-400">No hay usuarios registrados o que coincidan con el filtro.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredUsuarios.map((usuario) => (
              <TableRow key={usuario.id} className="hover:bg-purple-50/50 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700">
                <TableCell className="font-mono font-bold text-purple-800 dark:text-purple-400 py-4">{usuario.id}</TableCell>
                <TableCell className="font-semibold text-gray-900 dark:text-gray-300 py-4">{usuario.usuario}</TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300 py-4">{usuario.email}</TableCell>
                <TableCell className="py-4">
                  {renderRoles(usuario.rol)}
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant="secondary" className={`border font-semibold rounded-full px-3 py-1 ${getStatusBadge(usuario.estado)}`}>
                    {usuario.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300 py-4">{usuario.ultimo_acceso}</TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300 py-4">{usuario.dispositivo}</TableCell>
                <TableCell className="text-center py-4">
                  <div className="flex justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg text-gray-600 dark:text-gray-400 hover:text-purple-700 dark:hover:text-purple-300 p-2"
                      onClick={() => onView(usuario.id)}
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-300 p-2"
                      onClick={() => onEdit(usuario)}
                      title="Editar usuario"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-orange-100 dark:hover:bg-orange-900/50 rounded-lg text-gray-600 dark:text-gray-400 hover:text-orange-700 dark:hover:text-orange-300 p-2"
                      onClick={() => onChangePassword(usuario)}
                      title="Cambiar contraseña"
                    >
                      <Key className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-cyan-100 dark:hover:bg-cyan-900/50 rounded-lg text-gray-600 dark:text-gray-400 hover:text-cyan-700 dark:hover:text-cyan-300 p-2"
                      onClick={() => onResetDevice(usuario)}
                      title="Resetear dispositivo"
                    >
                      <Smartphone className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg text-gray-600 dark:text-gray-400 hover:text-red-700 dark:hover:text-red-300 p-2"
                      onClick={() => onDelete(usuario)}
                      title="Eliminar usuario"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
