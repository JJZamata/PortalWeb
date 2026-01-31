import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { UserLocation } from '../types';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

interface MapViewHistoryProps {
  locations: UserLocation[];
  selectedLocation?: UserLocation | null;
  onLocationSelect?: (location: UserLocation) => void;
}

// Centro de Perú
const PERU_CENTER: [number, number] = [-71.5553, -16.4437]; // Centrado en Arequipa

// Función para calcular color basado en el timestamp
const getColorForTimestamp = (timestamp: string, minTime: number, maxTime: number): string => {
  const time = new Date(timestamp).getTime();
  const normalized = (time - minTime) / (maxTime - minTime);

  // Gradiente de azul (antiguo) -> amarillo -> naranja (reciente)
  if (normalized < 0.5) {
    // Azul a amarillo
    const ratio = normalized * 2;
    const r = Math.round(59 + (255 - 59) * ratio);
    const g = Math.round(130 + (255 - 130) * ratio);
    const b = Math.round(246 * (1 - ratio));
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Amarillo a naranja
    const ratio = (normalized - 0.5) * 2;
    const r = 255;
    const g = Math.round(255 * (1 - ratio * 0.4));
    const b = 0;
    return `rgb(${r}, ${g}, ${b})`;
  }
};

export const MapViewHistory = ({ locations, selectedLocation, onLocationSelect }: MapViewHistoryProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const routeSourceRef = useRef<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [show3D, setShow3D] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Inicializar mapa con el mismo estilo que el componente original
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: PERU_CENTER,
      zoom: 15,
      pitch: show3D ? 45 : 0,
      bearing: 0,
      antialias: true
    });

    // Controles de navegación
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Control de escala
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    // Control de 3D
    const toggle3DButton = document.createElement('button');
    toggle3DButton.className = 'mapboxgl-ctrl mapboxgl-ctrl-group mapboxgl-ctrl-3d';
    toggle3DButton.innerHTML = '3D';
    toggle3DButton.style.cssText = `
      padding: 8px;
      font-size: 12px;
      font-weight: bold;
      background: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin: 0 4px;
      transition: all 0.3s ease;
    `;
    toggle3DButton.onmouseover = () => {
      toggle3DButton.style.backgroundColor = '#f0f0f0';
    };
    toggle3DButton.onmouseout = () => {
      toggle3DButton.style.backgroundColor = 'white';
    };
    toggle3DButton.onclick = () => {
      setShow3D(!show3D);
      map.current?.easeTo({
        pitch: show3D ? 0 : 45,
        duration: 1000,
        essential: true
      });
    };
    map.current.addControl({
      onAdd: () => toggle3DButton,
      onRemove: () => {}
    }, 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Actualizar mapa cuando cambian las ubicaciones
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Limpiar marcadores existentes
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Eliminar capa y fuente de ruta anterior
    if (routeSourceRef.current) {
      ['route-line', 'route-arrows'].forEach(layerId => {
        if (map.current!.getLayer(layerId)) {
          map.current!.removeLayer(layerId);
        }
      });
      if (map.current!.getSource(routeSourceRef.current)) {
        map.current!.removeSource(routeSourceRef.current);
      }
    }

    if (locations.length === 0) return;

    // Calcular rango de timestamps para gradiente
    const timestamps = locations.map(loc => new Date(loc.lastUpdate).getTime());
    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);

    // Ordenar ubicaciones por timestamp
    const sortedLocations = [...locations].sort((a, b) =>
      new Date(a.lastUpdate).getTime() - new Date(b.lastUpdate).getTime()
    );

    // Crear marcadores
    sortedLocations.forEach((location, index) => {
      if (!location.location.latitude || !location.location.longitude) return;

      const color = getColorForTimestamp(location.lastUpdate, minTime, maxTime);
      const isSelected = selectedLocation?.userId === location.userId &&
                        selectedLocation?.lastUpdate === location.lastUpdate;

      // Crear elemento personalizado para el marcador
      const el = document.createElement('div');
      el.className = 'marker-wrapper-history';
      el.innerHTML = `
        <div class="relative">
          ${index === sortedLocations.length - 1 ? `
            <div class="absolute -inset-2 rounded-full opacity-30 animate-ping" style="background-color: ${color}"></div>
          ` : ''}
          <div class="relative w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-all duration-200 ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}"
               style="background-color: ${color}">
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-white text-xs font-bold">${index + 1}</span>
            </div>
          </div>
        </div>
      `;

      // Crear popup con información
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        className: 'custom-popup'
      }).setHTML(`
        <div class="p-3 min-w-[220px]">
          <div class="font-semibold text-gray-900 mb-2">${location.username || `Usuario ${location.userId}`}</div>
          <div class="text-sm text-gray-600 space-y-1">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded-full flex-shrink-0" style="background-color: ${color}"></div>
              <span class="font-medium">Punto #${index + 1} de ${sortedLocations.length}</span>
            </div>
            <div>
              <span class="font-medium">Fecha:</span> ${new Date(location.lastUpdate).toLocaleDateString('es-PE')}
            </div>
            <div>
              <span class="font-medium">Hora:</span> ${new Date(location.lastUpdate).toLocaleTimeString('es-PE')}
            </div>
            <div>
              <span class="font-medium">Coordenadas:</span>
              <span class="text-xs font-mono ml-1">
                ${location.location.latitude.toFixed(6)}, ${location.location.longitude.toFixed(6)}
              </span>
            </div>
            ${location.location.accuracy ? `
              <div>
                <span class="font-medium">Precisión:</span> ±${Math.round(location.location.accuracy)}m
              </div>
            ` : ''}
          </div>
        </div>
      `);

      // Crear marcador
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([location.location.longitude, location.location.latitude])
        .setPopup(popup)
        .addTo(map.current);

      // Manejar clic
      el.addEventListener('click', () => {
        onLocationSelect?.(location);
        if (isSelected) {
          popup.addTo(map.current!);
        }
      });

      // Mostrar popup al hover
      el.addEventListener('mouseenter', () => {
        popup.addTo(map.current!);
      });

      el.addEventListener('mouseleave', () => {
        popup.remove();
      });

      markersRef.current.push(marker);
    });

    // Dibujar línea de ruta si hay múltiples puntos
    if (sortedLocations.length > 1) {
      const routeId = `route-${Date.now()}`;
      routeSourceRef.current = routeId;

      const routeCoordinates = sortedLocations.map(loc => [
        loc.location.longitude,
        loc.location.latitude
      ]);

      // Agregar fuente de la ruta
      map.current.addSource(routeId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeCoordinates
          }
        }
      });

      // Agregar capa de la ruta con gradiente simulado
      map.current.addLayer({
        id: 'route-line',
        type: 'line',
        source: routeId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#FF6B35',
          'line-width': 4,
          'line-opacity': 0.7,
          'line-blur': 1
        }
      });

      // Agregar puntos intermedios para simular gradiente
      if (sortedLocations.length > 2) {
        const gradientPoints = sortedLocations.map((loc, idx) => ({
          type: 'Feature',
          properties: {
            color: getColorForTimestamp(loc.lastUpdate, minTime, maxTime),
            size: idx === 0 || idx === sortedLocations.length - 1 ? 8 : 4
          },
          geometry: {
            type: 'Point',
            coordinates: [loc.location.longitude, loc.location.latitude]
          }
        }));

        map.current.addSource('gradient-points', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: gradientPoints
          }
        });

        map.current.addLayer({
          id: 'gradient-points-layer',
          type: 'circle',
          source: 'gradient-points',
          paint: {
            'circle-radius': ['get', 'size'],
            'circle-color': ['get', 'color'],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        });
      }
    }

    // Ajustar vista para mostrar todos los puntos
    if (sortedLocations.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      sortedLocations.forEach(location => {
        if (location.location.latitude && location.location.longitude) {
          bounds.extend([location.location.longitude, location.location.latitude]);
        }
      });

      if (!bounds.isEmpty()) {
        // Si hay un solo marcador, centrar en él con zoom alto
        if (sortedLocations.length === 1) {
          map.current.flyTo({
            center: [sortedLocations[0].location.longitude, sortedLocations[0].location.latitude],
            zoom: 16,
            pitch: show3D ? 45 : 0,
            essential: true
          });
        } else {
          // Si hay múltiples marcadores, ajustar para mostrar todos
          map.current.fitBounds(bounds, {
            padding: 80,
            maxZoom: 16,
            pitch: show3D ? 45 : 0
          });
        }
      }
    } else {
      // Volver al centro si no hay ubicaciones
      map.current.flyTo({
        center: PERU_CENTER,
        zoom: 15,
        pitch: 0,
        essential: true
      });
    }
  }, [locations, mapLoaded, selectedLocation, onLocationSelect, show3D]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Leyenda de colores */}
      {locations.length > 1 && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
          <div className="text-sm font-semibold text-gray-900 mb-2">Línea de tiempo</div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: '#3B82F6' }}></div>
              <span>Inicio</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: '#FFC107' }}></div>
              <span>Medio</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: '#FF6B35' }}></div>
              <span>Fin</span>
            </div>
          </div>
        </div>
      )}

      {/* Contador de puntos */}
      {locations.length > 0 && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 border border-gray-200">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{locations.length}</span> puntos
          </div>
        </div>
      )}

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