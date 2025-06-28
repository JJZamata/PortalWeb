import React, { useState, useEffect } from 'react';
import { AppSidebar } from "@/components/AppSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Función para detectar el tamaño de pantalla y ajustar el sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Establecer estado inicial
    handleResize();

    // Escuchar cambios de tamaño
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <AppSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header con botón de toggle para móvil */}
        <div className="lg:hidden p-3 sm:p-4 border-b border-gray-200 bg-white shadow-sm z-30 sticky top-0">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="p-2"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex-1 text-center">
              <h1 className="text-lg font-bold bg-gradient-to-r from-red-800 to-red-600 bg-clip-text text-transparent">
                FISCAMOTO
              </h1>
            </div>
            <div className="w-10"></div> {/* Espaciador para centrar el título */}
          </div>
        </div>
        
        <AdminHeader />
        <main className="flex-1 overflow-auto w-full">
          <div className="w-full max-w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-2 sm:py-4 lg:py-6 space-y-4 lg:space-y-6 mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
