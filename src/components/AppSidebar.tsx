import {
  LayoutDashboard,
  Users,
  Car,
  User,
  Building2,
  FileCheck,
  FileText,
  Shield,
  ClipboardCheck,
  AlertTriangle,
  Camera,
  Wrench,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  Archive,
  Menu,
  X,
  FileBarChart, // Nuevo icono para Actas
  CheckCircle,  // Para Actas Conformes
  XCircle      // Para Actas No Conformes
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from '@/lib/axios';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logoImage from '@/assets/images/logo.png';

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/admin",
  },
  {
    title: "Personal",
    icon: Users,
    items: [
      { title: "Fiscalizadores", url: "/fiscalizadores", icon: Shield },
      { title: "Conductores", url: "/conductores", icon: User },
    ],
  },
  {
    title: "Vehículos",
    icon: Car,
    items: [
      { title: "Mototaxis", url: "/vehiculos", icon: Car },
      { title: "Empresas", url: "/empresas", icon: Building2 },
    ],
  },
  {
    title: "Actas",
    icon: FileBarChart,
    items: [
      { title: "Todas las Actas", url: "/actas", icon: FileText },
    ],
  },
  {
    title: "Documentación",
    icon: FileText,
    items: [
      { title: "Documentos", url: "/documentos", icon: FileCheck },
      { title: "Infracciones", url: "/infracciones", icon: AlertTriangle },
    ],
  },
  {
    title: "Control",
    icon: ClipboardCheck,
    items: [
      { title: "Usuarios", url: "/usuarios", icon: FileText },
      { title: "Auditoria", url: "/auditoria", icon: Wrench },
    ],
  },
];

interface AppSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const EXPANDED_SECTIONS_KEY = 'sidebar:expandedSections';

export function AppSidebar({ isOpen, onToggle }: AppSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Estado para las secciones expandidas, persistente en localStorage
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>(() => {
    // Intentar leer de localStorage
    const stored = localStorage.getItem(EXPANDED_SECTIONS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Si hay error, usar todas abiertas por defecto
        const initial: { [key: string]: boolean } = {};
        menuItems.forEach(item => {
          if (item.items) initial[item.title] = true;
        });
        return initial;
      }
    }
    // Si no hay nada guardado, abrir todas por defecto
    const initial: { [key: string]: boolean } = {};
    menuItems.forEach(item => {
      if (item.items) initial[item.title] = true;
    });
    return initial;
  });

  // Guardar en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem(EXPANDED_SECTIONS_KEY, JSON.stringify(expandedSections));
  }, [expandedSections]);

  // Función para encontrar qué sección contiene la ruta actual
  const findParentSection = (pathname: string) => {
    for (const item of menuItems) {
      if (item.items) {
        for (const subItem of item.items) {
          if (pathname === subItem.url) {
            return item.title;
          }
        }
      }
    }
    return null;
  };

  // Efecto para expandir automáticamente la sección que contiene la ruta activa
  useEffect(() => {
    const parentSection = findParentSection(location.pathname);
    if (parentSection) {
      setExpandedSections(prev => ({
        ...prev,
        [parentSection]: true,
      }));
    }
  }, [location.pathname]);

  // Función para manejar el toggle de secciones
  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const handleLogout = async () => {
    try {
      await axios.post('/auth/signout');
      toast({
        title: "Sesión Cerrada",
        description: "Has cerrado sesión exitosamente.",
      });
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      navigate('/');
    }
  };

  // Función para navegar y cerrar sidebar en móvil
  const handleNavigation = (url: string) => {
    navigate(url);
    // Cerrar sidebar en dispositivos móviles después de navegar
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <>
      {/* Overlay para móvil y tablet */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 bg-background border-r border-border transform transition-transform duration-300 ease-in-out",
        // Responsive widths
        "w-80 sm:w-80 md:w-80 lg:relative lg:translate-x-0 lg:w-64 xl:w-72",
        // Mobile/tablet behavior
        "lg:static",
        // Altura completa siempre
        "h-screen min-h-screen lg:h-screen lg:min-h-screen",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
              <img 
                src={logoImage} 
                alt="FISCAMOTO Logo" 
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-foreground text-lg sm:text-xl tracking-tight truncate">FISCAMOTO</h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium truncate">Sistema de Control</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="lg:hidden p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Contenido del menú */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-3 sm:px-4 space-y-1">
            {menuItems.map((item) => {
              if (!item.items) {
                const isActive = location.pathname === item.url;
                return (
                  <Button
                    key={item.title}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-12 px-3 sm:px-4 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base",
                      isActive 
                        ? "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-200 dark:hover:bg-red-900/60" 
                        : "hover:bg-accent text-foreground dark:hover:bg-accent/40"
                    )}
                    onClick={() => handleNavigation(item.url!)}
                  >
                    <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </Button>
                );
              }

              const isExpanded = expandedSections[item.title];
              return (
                <div key={item.title} className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-between h-12 px-3 sm:px-4 rounded-xl font-medium transition-all duration-200 hover:bg-accent text-foreground dark:hover:bg-accent/40 text-sm sm:text-base"
                    onClick={() => toggleSection(item.title)}
                  >
                    <div className="flex items-center min-w-0">
                      <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </div>
                    <ChevronRight className={cn(
                      "w-4 h-4 transition-transform duration-200 flex-shrink-0",
                      isExpanded ? "rotate-90" : ""
                    )} />
                  </Button>
                  
                  {isExpanded && (
                    <div className="ml-4 sm:ml-6 space-y-1">
                      {item.items.map((subItem) => {
                        const isActive = location.pathname === subItem.url;
                        return (
                          <Button
                            key={subItem.title}
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-start h-10 px-3 sm:px-4 rounded-lg text-sm font-medium transition-all duration-200",
                              isActive 
                                ? "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-200 dark:hover:bg-red-900/60" 
                                : "hover:bg-accent text-foreground dark:hover:bg-accent/40"
                            )}
                            onClick={() => handleNavigation(subItem.url)}
                          >
                            <subItem.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                            <span className="truncate">{subItem.title}</span>
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start h-12 px-3 sm:px-4 rounded-xl font-medium text-muted-foreground hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/40 dark:hover:text-red-200 transition-all duration-200 text-sm sm:text-base"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="truncate">Cerrar Sesión</span>
          </Button>
        </div>
      </div>
    </>
  );
}