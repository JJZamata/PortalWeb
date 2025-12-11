# Módulo GPS Tracking

## Descripción

Módulo de seguimiento en tiempo real de fiscalizadores que muestra sus ubicaciones en un mapa interactivo utilizando Mapbox y Socket.IO.

## Requisitos

### 1. Configurar Mapbox Access Token

Agregar el token de Mapbox en el archivo `.env`:

```bash
VITE_MAPBOX_ACCESS_TOKEN=tu_token_aqui
```

Para obtener un token:
1. Crear una cuenta en [Mapbox](https://mapbox.com)
2. Crear un nuevo token en Account > Tokens
3. Copiar el token y agregarlo a las variables de entorno

## Arquitectura

### Componentes

- **MapView**: Componente principal del mapa con Mapbox
- **ConnectionStatus**: Indicador visual del estado de conexión con Socket.IO

### Hooks

- **useGPSTracking**: Hook principal para conexión con Socket.IO y manejo de datos en tiempo real
- **useGPSTrackingDemo**: Hook de demostración con datos simulados (útil para pruebas sin backend)

### Servicios

- **socketService**: Servicio encapsulado para comunicación con Socket.IO

### Tipos

- **UserLocation**: Estructura de datos de ubicación de usuario
- **Location**: Coordenadas y metadata de ubicación
- **LocationRealtimePayload**: Payload para actualizaciones en tiempo real

## Flujo de Datos

1. **Conexión**: El hook inicializa la conexión con Socket.IO al montar
2. **Datos Iniciales**: Emite `location:getAll` para obtener todas las ubicaciones
3. **Actualizaciones**: Escucha `location:realtime` para actualizar marcadores dinámicamente
4. **Renderizado**: Los cambios se reflejan en el mapa en tiempo real

## Eventos Socket.IO

### Emitidos por el Cliente
- `location:getAll` - Solicita todas las ubicaciones actuales

### Recibidos del Servidor
- `location:allLocations` - Array con todas las ubicaciones
- `location:realtime` - Ubicación individual actualizada
- `welcome` - Mensaje de bienvenida al conectar

## Características

- **Mapa Interactivo**: Navegación, zoom y controles de Mapbox
- **Marcadores Dinámicos**: Se actualizan en tiempo real
- **Indicadores de Estado**: Muestra si un fiscalizador está en línea o desconectado
- **Tooltips**: Información detallada al hacer hover en marcadores
- **Panel Lateral**: Lista de fiscalizadores activos y detalles del seleccionado
- **Auto-reconexión**: Manejo automático de desconexiones

## Uso

```tsx
import { useGPSTracking } from '@/features/gps-tracking/hooks/useGPSTracking';
import { MapView } from '@/features/gps-tracking/components/MapView';

const MyComponent = () => {
  const { locations, connectionStatus } = useGPSTracking();

  return (
    <MapView
      locations={locations}
      onMarkerClick={(location) => console.log(location)}
    />
  );
};
```

## Notas

- El módulo funciona en modo demo si no hay conexión con el backend
- Los marcadores verdes indican fiscalizadores en línea
- Los marcadores grises indican fiscalizadores desconectados
- La actualización automática de estado ocurre cada 30 segundos
- Los datos de ubicación se consideran desactualizados después de 2 minutos

## Desarrollo

Para probar sin backend:

```tsx
// Usar el hook de demo
import { useGPSTrackingDemo } from '@/features/gps-tracking/hooks/useGPSTrackingDemo';

const { locations } = useGPSTrackingDemo(); // Datos simulados
```