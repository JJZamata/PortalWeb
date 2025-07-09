import { useState, useEffect } from 'react';
import { Search, Bell, User, Settings, Moon, Sun } from "lucide-react";
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

export function AdminHeader() {
  // Cambiar la inicialización para leer primero de localStorage
  const getInitialTheme = () => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    // Si no hay nada guardado, usar preferencia del sistema
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme());

  // Cambia la clase del body/html según el tema y guarda en localStorage
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/60 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:block">
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-red-800 to-red-600 bg-clip-text text-transparent">
              Panel de Control
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">Sistema de Fiscalización</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Buscador Global */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48 sm:w-64 lg:w-80 pl-10 bg-gray-50/80 border-gray-200/60 focus:bg-white transition-all duration-200 text-sm"
            />
          </div>

          {/* Buscador móvil */}
          <div className="sm:hidden">
            <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 rounded-lg">
              <Search className="w-5 h-5" />
            </Button>
          </div>

          {/* Notificaciones */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 sm:w-80">
              <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start p-3 sm:p-4">
                <span className="font-medium text-sm">Documentos por vencer</span>
                <span className="text-xs text-gray-500">15 CITV vencen en los próximos 30 días</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-3 sm:p-4">
                <span className="font-medium text-sm">Nueva infracción registrada</span>
                <span className="text-xs text-gray-500">Placa ABC-123 - Hace 2 horas</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-3 sm:p-4">
                <span className="font-medium text-sm">Control técnico pendiente</span>
                <span className="text-xs text-gray-500">5 vehículos requieren inspección</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Configuración */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-lg hidden sm:flex">
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
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-2 sm:px-3">
                <Avatar className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-gray-200">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-red-100 text-red-800 font-semibold text-xs">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">Administrador</p>
                  <p className="text-xs text-gray-500">admin@fiscamoto.pe</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 sm:w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
