import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from '@/lib/axios';
import axios from 'axios';
import logoImage from '@/assets/images/logo.png';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(
        '/auth/signin',
        { username, password }
      );

      if (response.data.success) {
        toast({
          title: "¡Inicio de sesión exitoso!",
          description: "Bienvenido al sistema.",
        });
        navigate('/admin');
      } else {
        throw new Error(response.data.message || "Respuesta inesperada del servidor.");
      }

    } catch (error) {
      let errorMessage = "Error al iniciar sesión";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createRainDrop = () => {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';

    const left = Math.random() * window.innerWidth;
    const size = Math.random() * 6 + 12;
    const duration = Math.random() * 4 + 8;
    const delay = Math.random() * 6;

    drop.style.left = `${left}px`;
    drop.style.width = `${size}px`;
    drop.style.height = `${size}px`;
    drop.style.animationDuration = `${duration}s`;
    drop.style.animationDelay = `${delay}s`;

    drop.addEventListener('animationend', () => {
      if (drop.parentNode) {
        drop.parentNode.removeChild(drop);
      }

      const newDrop = createRainDrop();
      const container = document.querySelector('.rain-container');
      if (container) {
        container.appendChild(newDrop);
      }
    });

    return drop;
  };

  const startRain = () => {
    const container = document.querySelector('.rain-container');
    if (!container) return;

    for (let i = 0; i < 10; i++) {
      const drop = createRainDrop();
      container.appendChild(drop);
    }

    const interval = setInterval(() => {
      const drop = createRainDrop();
      container.appendChild(drop);
    }, 2000);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    const rainCleanup = startRain();
    return () => {
      rainCleanup && rainCleanup();
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#8B1F1F] via-[#A52A2A] to-[#5E1515] flex relative overflow-hidden">
      {/* Contenedor de lluvia */}
      <div className="rain-container absolute inset-0 z-0 pointer-events-none"></div>

      {/* Panel izquierdo con logo */}
      <div className="w-1/2 p-12 flex items-center justify-center relative z-10">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 flex items-center justify-center">
            <img
              src={logoImage}
              alt="Fiscamoto Logo"
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
          <span className="text-5xl font-light text-white tracking-wider drop-shadow-lg">
            FISCAMOTO
          </span>
        </div>
      </div>

      {/* Línea divisoria vertical */}
      <div className="w-[1px] bg-white/40 h-[80%] self-center shadow-lg backdrop-blur-sm" />

      {/* Panel derecho con formulario */}
      <div className="w-1/2 p-12 flex flex-col justify-center items-center relative z-10">
        <div className="w-full max-w-md p-10 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-light text-white tracking-wide">Bienvenido</h1>
            <p className="text-white/60 mt-2 font-light">Por favor inicia sesión con tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="username" className="block text-sm font-medium text-white/80 uppercase tracking-wider">
                  Usuario
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-14 bg-white/20 backdrop-blur-sm rounded-xl border-0 border-b-2 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 focus:border-white focus:ring-0 transition-all duration-300 text-lg px-4"
                  placeholder="Ingresa tu usuario"
                  required
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="password" className="block text-sm font-medium text-white/80 uppercase tracking-wider">
                  Contraseña
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-white/20 backdrop-blur-sm rounded-xl border-0 border-b-2 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 focus:border-white focus:ring-0 transition-all duration-300 text-lg px-4"
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-[#A52A2A] hover:bg-[#8B1F1F] text-white text-lg font-light tracking-wider rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
