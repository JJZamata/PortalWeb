import React from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminPanel from "./pages/AdminPanel";
import FiscalizadoresPage from "./pages/personal/FiscalizadoresPage";
import VehiculosPage from "./pages/vehiculos/VehiculosPage";
import DocumentosPage from "./pages/documentacion/DocumentosPage";
import ConductoresPage from "./pages/personal/ConductoresPage";
import EmpresasPage from "./pages/vehiculos/EmpresasPage";
import NotFound from "./pages/NotFound";
import UsuariosPage from "./pages/control/UsuariosPage";
import AuditoriaPage from "./pages/control/AuditoriaPage";
import InfraccionesPage from "./pages/documentacion/InfraccionesPage";

// Importaciones de vistas no utilizadas (accesibles por URL directa)
import ActasPage from "./pages/unused/ActasPage";
import ActasConformesPage from "./pages/unused/ActasConformesPage";
import ActasNoConformesPage from "./pages/unused/ActasNoConformesPage";
import ConsultaPlacaPage from "./pages/unused/ConsultaPlacaPage";
import CitvPage from "./pages/unused/CitvPage";
import TucPage from "./pages/unused/TucPage";
import HabilitacionesPage from "./pages/unused/HabilitacionesPage";
import AfocatPage from "./pages/unused/AfocatPage";
import ControlesTecnicosPage from "./pages/unused/ControlesTecnicosPage";
import FotosPage from "./pages/unused/FotosPage";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/fiscalizadores" element={<FiscalizadoresPage />} />
            <Route path="/vehiculos" element={<VehiculosPage />} />
            <Route path="/documentos" element={<DocumentosPage />} />
            <Route path="/conductores" element={<ConductoresPage />} />
            <Route path="/empresas" element={<EmpresasPage />} />
            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/auditoria" element={<AuditoriaPage />} />
            <Route path="/infracciones" element={<InfraccionesPage />} />
            
            {/* Rutas para vistas no utilizadas (accesibles por URL directa) */}
            <Route path="/actas" element={<ActasPage />} />
            <Route path="/actas-conformes" element={<ActasConformesPage />} />
            <Route path="/actas-no-conformes" element={<ActasNoConformesPage />} />
            <Route path="/consulta-placa" element={<ConsultaPlacaPage />} />
            <Route path="/citv" element={<CitvPage />} />
            <Route path="/tuc" element={<TucPage />} />
            <Route path="/habilitaciones" element={<HabilitacionesPage />} />
            <Route path="/afocat" element={<AfocatPage />} />
            <Route path="/controles-tecnicos" element={<ControlesTecnicosPage />} />
            <Route path="/fotos" element={<FotosPage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
