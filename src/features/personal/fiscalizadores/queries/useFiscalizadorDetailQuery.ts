import { useQuery } from "@tanstack/react-query";
import { fiscalizadoresService } from "../services/fiscalizadoresService";
import type { FiscalizadorDetailResponse } from "../types";

export const useFiscalizadorDetailQuery = (id: number | null) => {
  return useQuery<FiscalizadorDetailResponse>({
    queryKey: ["fiscalizador", id],
    enabled: !!id,
    queryFn: () => fiscalizadoresService.getFiscalizadorDetail(id as number)
  });
};
