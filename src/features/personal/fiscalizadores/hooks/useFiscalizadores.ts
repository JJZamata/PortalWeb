// src/features/gestion/fiscalizadores/hooks/useFiscalizadores.ts

import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fiscalizadoresService } from "@/features/personal/fiscalizadores/services/fiscalizadoresService";
import { useScrollPreservation } from "@/hooks/useScrollPreservation";

export const useFiscalizadores = (searchTerm: string, currentPage: number) => {
  const [page, setPage] = useState(currentPage);
  const lastPageChangeRef = useRef<number>(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["fiscalizadores", page, searchTerm],
    queryFn: () => fiscalizadoresService.getFiscalizadores(page),
    staleTime: 5 * 60 * 1000,
    enabled: !!page
  });

  const { preparePageChange } = useScrollPreservation({ isLoading });

  // ✅ ESTA ES LA RUTA CORRECTA DEL ARRAY
  const allUsers = data?.data?.data ?? [];

  // ✅ SOLO FILTRAR LOS FISCALIZADORES
  const fiscalizadores = allUsers.filter((u: any) =>
    u.rol?.toLowerCase() === "fiscalizador"
  );

  // ✅ FILTRO DE BÚSQUEDA
  const filteredFiscalizadores = fiscalizadores.filter((f: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      f.usuario?.toLowerCase().includes(searchLower) ||
      f.email?.toLowerCase().includes(searchLower) ||
      f.id?.toString().includes(searchTerm)
    );
  });

  function handlePageChange(newPage: number) {
    const now = Date.now();
    if (now - lastPageChangeRef.current < 500) return;

    lastPageChangeRef.current = now;
    preparePageChange();
    setPage(newPage);
  }

  return {
    fiscalizadores: filteredFiscalizadores,
    pagination: data?.data?.pagination ?? null,
    loading: isLoading,
    error: (error as Error)?.message ?? null,
    page,
    handlePageChange
  };
};
