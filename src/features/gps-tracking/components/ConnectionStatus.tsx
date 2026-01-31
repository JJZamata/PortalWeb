import { Badge } from '@/components/ui/badge';
import { SocketConnectionStatus } from '../types';

interface ConnectionStatusProps {
  status: SocketConnectionStatus;
}

export const ConnectionStatus = ({ status }: ConnectionStatusProps) => {
  const getStatusConfig = () => {
    if (status.connecting) {
      return {
        variant: 'secondary' as const,
        text: 'Conectando...',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      };
    }

    if (status.connected) {
      return {
        variant: 'default' as const,
        text: 'Conectado',
        className: 'bg-green-100 text-green-800 border-green-300',
      };
    }

    if (status.error) {
      return {
        variant: 'destructive' as const,
        text: `Error: ${status.error}`,
        className: 'bg-red-100 text-red-800 border-red-300',
      };
    }

    return {
      variant: 'secondary' as const,
      text: 'Desconectado',
      className: 'bg-gray-100 text-gray-800 border-gray-300',
    };
  };

  const config = getStatusConfig();

  return (
    <Badge
      variant={config.variant}
      className={`flex items-center gap-2 ${config.className}`}
    >
      <div className={`w-2 h-2 rounded-full ${
        status.connecting ? 'bg-yellow-500 animate-pulse' :
        status.connected ? 'bg-green-500' : 'bg-gray-500'
      }`} />
      {config.text}
    </Badge>
  );
};