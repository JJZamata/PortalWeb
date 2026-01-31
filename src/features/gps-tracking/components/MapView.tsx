import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { UserLocation } from '../types';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

interface MapViewProps {
  locations: UserLocation[];
  onMarkerClick?: (location: UserLocation) => void;
}

const PERU_CENTER: [number, number] = [-71.5553, -16.4437]; // Centrado en Arequipa donde están los dispositivos

export const MapView = ({ locations, onMarkerClick }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false); // Para saber si el usuario interactuó
  const initialLoadRef = useRef(true); // Para controlar el ajuste inicial

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Inicializar mapa
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: PERU_CENTER,
      zoom: 15, // Zoom más alto para ver mejor los marcadores
    });

    // Controles de navegación
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Control de escala
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    map.current.on('load', () => {
      setMapLoaded(true);

      // Detectar cuando el usuario interactúa con el mapa
      const handleUserInteraction = () => {
        if (!userHasInteracted) {
          setUserHasInteracted(true);
        }
      };

      // Eventos que indican interacción del usuario
      map.current?.on('dragstart', handleUserInteraction);
      map.current?.on('zoomstart', handleUserInteraction);
      map.current?.on('pitchstart', handleUserInteraction);
      map.current?.on('rotatestart', handleUserInteraction);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Actualizar marcadores cuando cambian las ubicaciones
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Limpiar marcadores existentes
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Crear marcadores para cada ubicación
    locations.forEach(location => {
      if (!location.location.latitude || !location.location.longitude) return;

      // Crear elemento personalizado para el marcador
      const el = document.createElement('div');
      el.className = 'marker-wrapper';
      el.innerHTML = `
        <div class="relative">
          <div class="absolute -inset-2 bg-blue-500 rounded-full opacity-30 ${location.online ? 'animate-ping' : ''}"></div>
          <div class="relative w-6 h-6 ${location.online ? 'bg-green-500' : 'bg-gray-500'} rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform"></div>
        </div>
      `;

      // Crear popup con información
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        className: 'custom-popup'
      }).setHTML(`
        <div class="p-3 min-w-[200px]">
          <div class="font-semibold text-gray-900 mb-1">${location.username || `Usuario ${location.userId}`}</div>
          <div class="text-sm text-gray-600 space-y-1">
            <div class="flex items-center gap-1">
              <span class="w-2 h-2 ${location.online ? 'bg-green-500' : 'bg-gray-400'} rounded-full"></span>
              <span>${location.online ? 'En línea' : 'Desconectado'}</span>
            </div>
            <div>Última actualización:</div>
            <div class="text-xs">${new Date(location.lastUpdate).toLocaleString('es-PE')}</div>
            ${location.location.accuracy ? `
              <div class="text-xs">Precisión: ±${Math.round(location.location.accuracy)}m</div>
            ` : ''}
          </div>
        </div>
      `);

      // Crear marcador
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([location.location.longitude, location.location.latitude])
        .setPopup(popup)
        .addTo(map.current);

      // Mostrar popup al hacer hover
      el.addEventListener('mouseenter', () => {
        popup.addTo(map.current!);
      });

      el.addEventListener('mouseleave', () => {
        popup.remove();
      });

      // Manejar clic en marcador
      el.addEventListener('click', () => {
        onMarkerClick?.(location);
      });

      markersRef.current.push(marker);
    });

    // Ajustar vista SOLO en las siguientes condiciones:
    // 1. Es la primera carga (initialLoadRef.current === true)
    // 2. El usuario NO ha interactuado aún
    if (locations.length > 0 && (initialLoadRef.current || !userHasInteracted)) {
      const bounds = new mapboxgl.LngLatBounds();
      locations.forEach(location => {
        if (location.location.latitude && location.location.longitude) {
          bounds.extend([location.location.longitude, location.location.latitude]);
        }
      });

      if (!bounds.isEmpty()) {
        // Si hay un solo marcador, centrar en él con zoom alto
        if (locations.length === 1) {
          map.current.flyTo({
            center: [locations[0].location.longitude, locations[0].location.latitude],
            zoom: 16,
            essential: true
          });
        } else {
          // Si hay múltiples marcadores, ajustar para mostrar todos
          map.current.fitBounds(bounds, {
            padding: 100,
            maxZoom: 16,
          });
        }
      }

      // Después de la primera carga, marcar que ya no es inicial
      if (initialLoadRef.current) {
        initialLoadRef.current = false;
      }
    } else if (locations.length === 0 && (initialLoadRef.current || !userHasInteracted)) {
      // Volver al centro solo si no hay ubicaciones y no hay interacción del usuario
      map.current.flyTo({
        center: PERU_CENTER,
        zoom: 15,
        essential: true
      });
    }
  }, [locations, mapLoaded, onMarkerClick]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      {!mapboxgl.accessToken && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center p-6">
            <p className="text-red-600 font-semibold mb-2">
              Error: Mapbox Access Token no configurado
            </p>
            <p className="text-sm text-gray-600">
              Agrega tu token de Mapbox en el archivo .env como:
            </p>
            <code className="block mt-2 p-2 bg-gray-200 rounded text-xs">
              VITE_MAPBOX_ACCESS_TOKEN=tu_token_aqui
            </code>
          </div>
        </div>
      )}
    </div>
  );
};