import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from '@/lib/axios';
import axios from 'axios';
import logoImage from '@/assets/images/logo.png';
import lajoyaImage from '@/assets/images/LAJOYA.jpg';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Verificar si ya hay un token válido al montar el componente
  useEffect(() => {
    const checkExistingToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verificar si el token sigue siendo válido
          await axiosInstance.get('/auth/verify');
          // Si llega aquí, el token es válido
          navigate('/admin');
        } catch (error) {
          // Token inválido, limpiarlo
          localStorage.removeItem('token');
        }
      }
    };

    checkExistingToken();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(
        '/auth/signin',
        { username, password }
      );

      if (response.data.success) {
        // El endpoint devuelve los datos en response.data.data
        const userData = response.data.data;

        // Guardar el token en localStorage si viene (aunque el servidor usa cookies)
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        } else {
          // Si no viene token, limpiar cualquier token previo para evitar Bearer inválido
          localStorage.removeItem('token');
        }
        
        // Guardar el ID del usuario en localStorage
        if (userData?.id) {
          localStorage.setItem('userId', userData.id.toString());
        }

        // Guardar el username del usuario en localStorage
        if (userData?.username) {
          localStorage.setItem('username', userData.username);
        }

        // Guardar el email del usuario en localStorage
        if (userData?.email) {
          localStorage.setItem('userEmail', userData.email);
        }

        // Guardar los roles del usuario
        if (userData?.roles && Array.isArray(userData.roles)) {
          localStorage.setItem('userRoles', JSON.stringify(userData.roles));
        }
        
        toast({
          title: "¡Inicio de sesión exitoso!",
          description: `Bienvenido ${userData?.username || 'al sistema'}.`,
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

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#8B1F1F] via-[#A52A2A] to-[#5E1515] flex relative overflow-hidden">
      {/* Fondo de la imagen LAJOYA */}
      <img
        src={lajoyaImage}
        alt="Fondo La Joya"
        className="absolute inset-0 w-full h-full object-cover opacity-30 z-0 pointer-events-none select-none"
        draggable="false"
      />
      {/* Contenedor de lluvia */}
      <div className="rain-container absolute inset-0 z-10 pointer-events-none"></div>

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
