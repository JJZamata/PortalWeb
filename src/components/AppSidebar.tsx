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
  Archive
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from '@/lib/axios';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

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

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const { toast } = useToast();
  
  // Estado persistente para las secciones expandidas
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>(() => {
    // Inicializar con todas las secciones expandidas
    const initial = {};
    menuItems.forEach(item => {
      if (item.items) {
        initial[item.title] = true;
      }
    });
    return initial;
  });

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

  return (
    <Sidebar variant="inset" className="border-r border-gray-200/60 bg-white/95 backdrop-blur-sm">
      <SidebarHeader className="border-b border-gray-200/60 p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="w-7 h-7 text-white" />
          </div>
          {state === "expanded" && (
            <div>
              <h2 className="font-bold text-gray-900 text-xl tracking-tight">FISCAMOTO</h2>
              <p className="text-sm text-gray-600 font-medium">Sistema de Control</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => {
              if (!item.items) {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="h-12 px-4 rounded-xl font-medium transition-all duration-200 hover:bg-red-50 hover:text-red-700 data-[active=true]:bg-red-100 data-[active=true]:text-red-800 data-[active=true]:shadow-sm"
                    >
                      <button onClick={() => navigate(item.url!)}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }

              const isExpanded = expandedSections[item.title];
              return (
                <Collapsible 
                  key={item.title} 
                  open={isExpanded}
                  onOpenChange={() => toggleSection(item.title)}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="h-12 px-4 rounded-xl font-medium transition-all duration-200 hover:bg-gray-50 group-data-[state=open]/collapsible:bg-gray-50">
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                        <ChevronRight className={`ml-auto w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-4 mt-2 space-y-1">
                        {item.items.map((subItem) => {
                          const isActive = location.pathname === subItem.url;
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isActive}
                                className="h-10 px-4 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-red-50 hover:text-red-700 data-[active=true]:bg-red-100 data-[active=true]:text-red-800"
                              >
                                <button onClick={() => navigate(subItem.url)}>
                                  <subItem.icon className="w-4 h-4" />
                                  <span>{subItem.title}</span>
                                </button>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200/60 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="h-12 px-4 rounded-xl font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
