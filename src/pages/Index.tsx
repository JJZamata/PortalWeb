import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Login from '@/components/Login';

const Index = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Redirigir directamente al panel administrativo después del login
    navigate('/admin');
  };

  return (
    <div className="relative">
      <Login onLogin={handleLogin} />
    </div>
  );
};

export default Index;
