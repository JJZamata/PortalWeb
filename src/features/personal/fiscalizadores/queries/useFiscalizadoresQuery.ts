import { useQuery } from "@tanstack/react-query";
import { fiscalizadoresService } from "../services/fiscalizadoresService";
import { FiscalizadoresApiResponse } from "../types";

export const useFiscalizadoresQuery = (page: number) => {
  return useQuery<FiscalizadoresApiResponse>({
    queryKey: ["fiscalizadores", page],
    queryFn: () => fiscalizadoresService.getFiscalizadores(page),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5
  });
};
