import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

interface ActasDiariasData {
  fecha: string;
  total: number;
}

interface ActaRecord {
  id: number;
  createdAt: string;
  [key: string]: any;
}

export const useActasDiarias = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['actas-diarias'],
    queryFn: async () => {
      try {
        // Obtener registros sin parámetros opcionales que causen problemas
        const response = await axiosInstance.get('/records');
        
        if (!response.data.success) {
          throw new Error('Error en la respuesta del servidor');
        }

        // Obtener los registros del response
        const records: ActaRecord[] = response.data.data.data || [];

        // Generar últimos 7 días
        const last7Days: ActasDiariasData[] = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          
          const dateStr = date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
          });
          
          last7Days.push({
            fecha: dateStr,
            total: 0
          });
        }

        // Agrupar registros por fecha de creación
        records.forEach((record) => {
          if (record.createdAt) {
            const recordDate = new Date(record.createdAt);
            const recordDateStr = recordDate.toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
            });
            
            // Buscar el día que coincida por string
            const dayIndex = last7Days.findIndex((day) => day.fecha === recordDateStr);
            
            if (dayIndex !== -1) {
              last7Days[dayIndex].total++;
            }
          }
        });
        
        return last7Days;
      } catch (err: any) {
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  });

  return {
    actasPorDia: data || [],
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : 'Error desconocido') : null,
    refetch
  };
};
