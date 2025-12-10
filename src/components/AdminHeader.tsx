import { useState, useEffect } from 'react';
import { Search, Bell, User, Settings, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import axiosInstance from '@/lib/axios';
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export function AdminHeader() {
  const getInitialTheme = () => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme());
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: userLoading } = useCurrentUser();

  // Obtener las iniciales del nombre de usuario
  const getInitials = () => {
    const name = user?.username || (user as any)?.name || '';
    if (name) return name.substring(0, 2).toUpperCase();
    if (user?.email) return user.email.substring(0, 2).toUpperCase();
    return 'U';
  };

  // Obtener el nombre del usuario
  const getDisplayName = () => {
    if (userLoading) return 'Cargando...';
    return user?.username || (user as any)?.name || 'Usuario';
  };

  // Obtener el rol del usuario
  const getUserRole = () => {
    if (userLoading) return 'Cargando...';
    if (user?.roles && user.roles.length > 0) {
      const first = user.roles[0] as any;
      return typeof first === 'string' ? first : first.name || 'Usuario';
    }
    return 'Usuario';
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/signout');
      toast({
        title: "Sesión Cerrada",
        description: "Has cerrado sesión exitosamente.",
      });
      navigate('/');
    } catch (error) {
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md shadow-sm">
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:block">
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-red-800 to-red-600 bg-clip-text text-transparent dark:from-red-400 dark:to-red-700">
              Panel de Control
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Sistema de Fiscalización</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Configuración */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg hidden sm:flex">
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 sm:w-56">
              <DropdownMenuLabel>Configuración</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 mr-2" /> Tema: Claro
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 mr-2" /> Tema: Oscuro
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Perfil de Usuario */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-2 sm:px-3">
                <Avatar className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-gray-200 dark:border-gray-700">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 font-semibold text-xs">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {getDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {userLoading ? 'Cargando...' : (user?.email || 'Sin email')}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 py-2 text-sm">
                <p className="font-medium text-gray-900 dark:text-gray-100">{getDisplayName()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 break-all">
                  {userLoading ? 'Cargando...' : (user?.email || 'Sin email')}
                </p>
                <Badge variant="secondary" className="mt-2 text-xs capitalize">
                  {getUserRole()}
                </Badge>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}