import { useCallback, useEffect, useRef } from 'react';

interface UseScrollPreservationOptions {
  enabled?: boolean;
  selector?: string; // Selector CSS del contenedor a preservar
  offset?: number; // Offset adicional
  isLoading?: boolean; // Estado de carga para saber cuándo restaurar
}

export const useScrollPreservation = (options: UseScrollPreservationOptions = {}) => {
  const { enabled = true, selector, offset = 0, isLoading = false } = options;
  const scrollPositionRef = useRef<number>(0);
  const preserveScrollRef = useRef<boolean>(false);
  const wasLoadingRef = useRef<boolean>(false);
  const restoreTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Función para guardar la posición actual del scroll
  const saveScrollPosition = useCallback(() => {
    if (!enabled) return;
    
    // Cancelar cualquier restauración pendiente
    if (restoreTimeoutRef.current) {
      clearTimeout(restoreTimeoutRef.current);
      restoreTimeoutRef.current = null;
    }
    
    if (selector) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        scrollPositionRef.current = element.scrollTop;
      }
    } else {
      scrollPositionRef.current = window.scrollY;
    }
    preserveScrollRef.current = true;
  }, [enabled, selector]);

  // Función para restaurar la posición del scroll
  const restoreScrollPosition = useCallback(() => {
    if (!enabled || !preserveScrollRef.current) return;
    
    // Cancelar cualquier timeout anterior
    if (restoreTimeoutRef.current) {
      clearTimeout(restoreTimeoutRef.current);
    }
    
    const targetPosition = scrollPositionRef.current + offset;
    
    // Usar un solo timeout para evitar múltiples restauraciones
    restoreTimeoutRef.current = setTimeout(() => {
      if (!preserveScrollRef.current) return;
      
      if (selector) {
        const element = document.querySelector(selector) as HTMLElement;
        if (element && element.scrollTop !== targetPosition) {
          element.scrollTo({
            top: targetPosition,
            behavior: 'instant' as ScrollBehavior
          });
        }
      } else {
        if (window.scrollY !== targetPosition) {
          window.scrollTo({
            top: targetPosition,
            behavior: 'instant' as ScrollBehavior
          });
        }
      }
      
      // Marcar como completado
      preserveScrollRef.current = false;
      restoreTimeoutRef.current = null;
    }, 100); // Un solo timeout más conservador
  }, [enabled, selector, offset]);

  // Función para usar antes de cambiar de página
  const preparePageChange = useCallback(() => {
    saveScrollPosition();
    wasLoadingRef.current = true;
  }, [saveScrollPosition]);

  // Efecto para restaurar después de que los datos se hayan cargado
  useEffect(() => {
    if (preserveScrollRef.current && wasLoadingRef.current && !isLoading) {
      // Los datos terminaron de cargar, restaurar scroll
      restoreScrollPosition();
      wasLoadingRef.current = false;
    }
  }, [isLoading, restoreScrollPosition]);

  // Efecto para restaurar inmediatamente si no hay loading
  useEffect(() => {
    if (preserveScrollRef.current && !wasLoadingRef.current) {
      restoreScrollPosition();
    }
  });

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (restoreTimeoutRef.current) {
        clearTimeout(restoreTimeoutRef.current);
      }
    };
  }, []);

  return {
    preparePageChange,
    saveScrollPosition,
    restoreScrollPosition,
  };
};
