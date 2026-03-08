import {
  LayoutDashboard,
  Users,
  Car,
  User,
  Building2,
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
  XCircle,      // Para Actas No Conformes
  MapPin        // Icono para GPS Tracking
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from '@/lib/axios';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logoImage from '@/assets/images/logo.png';

const SIDEBAR_WIDTH_KEY = 'sidebar:desktopWidth';
const SIDEBAR_DEFAULT_WIDTH = 288; // Matches xl:w-72 from current layout
const SIDEBAR_MAX_WIDTH = 288;
const SIDEBAR_MIN_WIDTH = 84;
const SIDEBAR_COLLAPSE_THRESHOLD = 150;

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/admin",
  },
  {
    title: "GPS Tracking",
    icon: MapPin,
    items: [
      { title: "En vivo", url: "/gps-tracking", icon: MapPin },
      { title: "Historial", url: "/gps-tracking/history", icon: Archive }
    ],
  },
  {
    title: "Personal",
    icon: Users,
    items: [
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
      { title: "AFOCAT", url: "/afocat", icon: Shield },
      { title: "Revisión Técnica", url: "/revision", icon: ClipboardCheck },
      { title: "TUCs", url: "/tucs", icon: FileText },
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
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  const [desktopWidth, setDesktopWidth] = useState<number>(() => {
    const stored = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    const parsed = stored ? Number(stored) : SIDEBAR_DEFAULT_WIDTH;

    if (Number.isNaN(parsed)) return SIDEBAR_DEFAULT_WIDTH;
    return Math.max(SIDEBAR_MIN_WIDTH, Math.min(SIDEBAR_MAX_WIDTH, parsed));
  });
  const [isResizing, setIsResizing] = useState(false);
  
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

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, String(desktopWidth));
  }, [desktopWidth]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (event: MouseEvent) => {
      const nextWidth = Math.max(SIDEBAR_MIN_WIDTH, Math.min(SIDEBAR_MAX_WIDTH, event.clientX));
      setDesktopWidth(nextWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isResizing]);

  const isIconOnly = isDesktop && desktopWidth <= SIDEBAR_COLLAPSE_THRESHOLD;

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
    if (isIconOnly) return;

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
        // Fixed on mobile/tablet, sticky on desktop so it never scrolls away
        "fixed left-0 top-0 z-50 bg-background border-r border-border transform transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:left-0",
        // Width behavior: fixed on mobile, dynamic on desktop
        "w-80 sm:w-80 md:w-80 lg:w-auto",
        // Altura completa siempre con flex para estructura
        "h-screen min-h-screen lg:h-screen lg:min-h-screen flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
      style={isDesktop ? { width: `${desktopWidth}px` } : undefined}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
              <img 
                src={logoImage} 
                alt="FISCAMOTO Logo" 
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
            </div>
            <div className={cn("min-w-0", isIconOnly && "hidden")}>
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
          <nav className={cn("space-y-1", isIconOnly ? "px-2" : "px-3 sm:px-4")}>
            {menuItems.map((item) => {
              if (!item.items) {
                const isActive = location.pathname === item.url;
                return (
                  <Button
                    key={item.title}
                    variant="ghost"
                    className={cn(
                      "w-full h-12 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base",
                      isIconOnly ? "justify-center px-0" : "justify-start px-3 sm:px-4",
                      isActive 
                        ? "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-200 dark:hover:bg-red-900/60" 
                        : "hover:bg-accent text-foreground dark:hover:bg-accent/40"
                    )}
                    onClick={() => handleNavigation(item.url!)}
                    title={item.title}
                  >
                    <item.icon className={cn("w-5 h-5 flex-shrink-0", !isIconOnly && "mr-3")} />
                    {!isIconOnly && <span className="truncate">{item.title}</span>}
                  </Button>
                );
              }

              const isExpanded = expandedSections[item.title];

              if (isIconOnly) {
                const firstSubItem = item.items[0];
                const hasActiveChild = item.items.some((subItem) => subItem.url === location.pathname);

                return (
                  <Button
                    key={item.title}
                    variant="ghost"
                    className={cn(
                      "w-full h-12 justify-center px-0 rounded-xl font-medium transition-all duration-200",
                      hasActiveChild
                        ? "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-200 dark:hover:bg-red-900/60"
                        : "hover:bg-accent text-foreground dark:hover:bg-accent/40"
                    )}
                    onClick={() => firstSubItem && handleNavigation(firstSubItem.url)}
                    title={item.title}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                  </Button>
                );
              }

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
        <div className="p-3 sm:p-4 border-t border-border flex-shrink-0">
          <Button
            variant="ghost"
            className="w-full justify-start h-12 px-3 sm:px-4 rounded-xl font-medium text-muted-foreground hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/40 dark:hover:text-red-200 transition-all duration-200 text-sm sm:text-base"
            onClick={handleLogout}
            title="Cerrar Sesión"
          >
            <LogOut className={cn("w-5 h-5 flex-shrink-0", !isIconOnly && "mr-3")} />
            {!isIconOnly && <span className="truncate">Cerrar Sesión</span>}
          </Button>
        </div>

        {/* Desktop resize handle */}
        <div
          className="hidden lg:block absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-red-300/60 dark:hover:bg-red-700/60"
          onMouseDown={() => setIsResizing(true)}
          title="Arrastra para ajustar el ancho"
        />
      </div>
    </>
  );
}