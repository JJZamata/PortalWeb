import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

interface ActasDiariasData {
  fecha: string;
  total: number;
}

interface ActasPorTipoData {
  dia: string;
  conformes: number;
  noConformes: number;
}

interface ActaRecord {
  id: number;
  createdAt: string;
  type?: string;
  recordType?: string;
  [key: string]: any;
}

interface PaginationMeta {
  hasNextPage?: boolean;
  nextPage?: number | null;
}

const toLocalDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toDisplayDate = (date: Date) => date.toLocaleDateString('es-ES', {
  day: '2-digit',
  month: '2-digit',
});

export const useActasDiarias = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['actas-diarias'],
    queryFn: async () => {
      try {
        const allRecords: ActaRecord[] = [];
        let currentPage = 1;
        let hasNextPage = true;

        while (hasNextPage) {
          const response = await axiosInstance.get(`/records?page=${currentPage}`);

          if (!response.data?.success) {
            throw new Error('Error en la respuesta del servidor');
          }

          const pageRecords: ActaRecord[] = response.data?.data?.data || [];
          allRecords.push(...pageRecords);

          const pagination: PaginationMeta = response.data?.data?.pagination || {};
          hasNextPage = !!pagination.hasNextPage;
          currentPage = pagination.nextPage ?? currentPage + 1;

          if (currentPage > 200) {
            hasNextPage = false;
          }
        }

        const last7DaysMeta: Array<{ key: string; label: string }> = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          last7DaysMeta.push({
            key: toLocalDateKey(date),
            label: toDisplayDate(date),
          });
        }

        const actasPorDia: ActasDiariasData[] = last7DaysMeta.map((day) => ({
          fecha: day.label,
          total: 0,
        }));

        const actasPorTipo: ActasPorTipoData[] = last7DaysMeta.map((day) => ({
          dia: day.label,
          conformes: 0,
          noConformes: 0,
        }));

        const indexByDay = new Map(last7DaysMeta.map((day, index) => [day.key, index]));

        allRecords.forEach((record) => {
          if (!record.createdAt) {
            return;
          }

          const created = new Date(record.createdAt);
          if (Number.isNaN(created.getTime())) {
            return;
          }

          const dayKey = toLocalDateKey(created);
          const dayIndex = indexByDay.get(dayKey);

          if (dayIndex === undefined) {
            return;
          }

          actasPorDia[dayIndex].total += 1;

          const rawType = String(record.type ?? record.recordType ?? '').toLowerCase();
          const normalizedType = rawType.replace(/[\s_-]/g, '');

          if (normalizedType === 'conforme') {
            actasPorTipo[dayIndex].conformes += 1;
          } else if (normalizedType === 'noconforme') {
            actasPorTipo[dayIndex].noConformes += 1;
          }
        });

        return {
          actasPorDia,
          actasPorTipo,
        };
      } catch (err: any) {
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  });

  return {
    actasPorDia: data?.actasPorDia || [],
    actasPorTipo: data?.actasPorTipo || [],
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : 'Error desconocido') : null,
    refetch
  };
};
