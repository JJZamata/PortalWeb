
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminPanel from "./pages/AdminPanel";
import FiscalizadoresPage from "./pages/FiscalizadoresPage";
import ActasPage from "./pages/ActasPage";
import VehiculosPage from "./pages/VehiculosPage";
import DocumentosPage from "./pages/DocumentosPage";
import ConductoresPage from "./pages/ConductoresPage";
import ActasConformesPage from "./pages/ActasConformesPage";
import ActasNoConformesPage from "./pages/ActasNoConformesPage";
import ConsultaPlacaPage from "./pages/ConsultaPlacaPage";
import EmpresasPage from "./pages/EmpresasPage";
import CitvPage from "./pages/CitvPage";
import TucPage from "./pages/TucPage";
import HabilitacionesPage from "./pages/HabilitacionesPage";
import AfocatPage from "./pages/AfocatPage";
import ControlesTecnicosPage from "./pages/ControlesTecnicosPage";
import InfraccionesPage from "./pages/InfraccionesPage";
import FotosPage from "./pages/FotosPage";
import NotFound from "./pages/NotFound";

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
            <Route path="/actas" element={<ActasPage />} />
            <Route path="/vehiculos" element={<VehiculosPage />} />
            <Route path="/documentos" element={<DocumentosPage />} />
            <Route path="/conductores" element={<ConductoresPage />} />
            <Route path="/actas-conformes" element={<ActasConformesPage />} />
            <Route path="/actas-no-conformes" element={<ActasNoConformesPage />} />
            <Route path="/consulta-placa" element={<ConsultaPlacaPage />} />
            <Route path="/empresas" element={<EmpresasPage />} />
            <Route path="/citv" element={<CitvPage />} />
            <Route path="/tuc" element={<TucPage />} />
            <Route path="/habilitaciones" element={<HabilitacionesPage />} />
            <Route path="/afocat" element={<AfocatPage />} />
            <Route path="/controles-tecnicos" element={<ControlesTecnicosPage />} />
            <Route path="/infracciones" element={<InfraccionesPage />} />
            <Route path="/fotos" element={<FotosPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
