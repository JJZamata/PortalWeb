
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Login from '@/components/Login';

const Index = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Redirigir directamente al panel administrativo después del login
    navigate('/admin');
  };

  const handleAdminAccess = () => {
    navigate('/admin');
  };

  return (
    <div className="relative">
      <Login onLogin={handleLogin} />
      {/* Botón de acceso administrativo */}
      <div className="absolute top-4 right-4 z-50">
        <Button 
          variant="outline" 
          onClick={handleAdminAccess}
          className="bg-white/20 border-white/30 text-white hover:bg-white/30"
        >
          Panel Administrativo
        </Button>
      </div>
    </div>
  );
};

export default Index;
