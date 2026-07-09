import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { conductoresService } from '@/features/personal/conductores/services/conductoresService';
import { propietariosService } from '@/features/vehiculos/propietarios/services/propietariosService';

type PersonSource = 'conductor' | 'propietario';

export interface PersonSuggestion {
  id: string;
  source: PersonSource;
  dni: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  photoUrl: string;
  address: string;
  score: number;
  label: string;
}

interface PersonAutocompleteParams {
  open: boolean;
  dni?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  photoUrl?: string;
  address?: string;
}

const normalize = (value?: string) => String(value ?? '').trim();

const buildSearchSeed = ({ dni, firstName, lastName, phoneNumber }: PersonAutocompleteParams) => {
  const normalizedDni = normalize(dni);
  if (normalizedDni.length >= 2) return normalizedDni;

  const normalizedPhone = normalize(phoneNumber);
  if (normalizedPhone.length >= 2) return normalizedPhone;

  const fullName = [normalize(firstName), normalize(lastName)].filter(Boolean).join(' ').trim();
  if (fullName.length >= 2) return fullName;

  return '';
};

const scoreCandidate = (candidate: { dni: string; fullName: string; phoneNumber: string }, seed: string) => {
  const normalizedSeed = seed.toLowerCase();
  const dni = normalize(candidate.dni).toLowerCase();
  const phoneNumber = normalize(candidate.phoneNumber).toLowerCase();
  const fullName = normalize(candidate.fullName).toLowerCase();

  if (!normalizedSeed) return 0;
  if (dni && dni === normalizedSeed) return 100;
  if (phoneNumber && phoneNumber === normalizedSeed) return 90;
  if (fullName === normalizedSeed) return 80;
  if (fullName.includes(normalizedSeed)) return 70;
  if (dni.includes(normalizedSeed) || phoneNumber.includes(normalizedSeed)) return 60;
  return 40;
};

const toConductorSuggestions = (items: any[] = [], seed: string): PersonSuggestion[] => {
  return items.map((item: any) => {
    const dni = normalize(item?.dni);
    const firstName = normalize(item?.firstName);
    const lastName = normalize(item?.lastName);
    const fullName = normalize(item?.nombreCompleto || item?.fullName || `${firstName} ${lastName}`);
    const phoneNumber = normalize(item?.phoneNumber || item?.telefono);
    const email = normalize(item?.email);
    const photoUrl = normalize(item?.photoUrl);
    const address = normalize(item?.address || item?.direccion);

    return {
      id: `conductor-${dni}`,
      source: 'conductor' as const,
      dni,
      fullName: fullName || 'Sin nombre',
      firstName,
      lastName,
      phoneNumber,
      email,
      photoUrl,
      address,
      score: scoreCandidate({ dni, fullName, phoneNumber }, seed),
      label: 'Conductor',
    };
  });
};

const toOwnerSuggestions = (items: any[] = [], seed: string): PersonSuggestion[] => {
  return items.map((item: any) => {
    const dni = normalize(item?.dni || item?.ownerDni);
    const firstName = normalize(item?.firstName);
    const lastName = normalize(item?.lastName);
    const fullName = normalize(item?.fullName || item?.nombreCompleto || `${firstName} ${lastName}`);
    const phoneNumber = normalize(item?.phoneNumber || item?.phone || item?.telefono);
    const email = normalize(item?.email);
    const photoUrl = normalize(item?.photoUrl);

    return {
      id: `propietario-${dni}`,
      source: 'propietario' as const,
      dni,
      fullName: fullName || 'Sin nombre',
      firstName,
      lastName,
      phoneNumber,
      email,
      photoUrl,
      address: '',
      score: scoreCandidate({ dni, fullName, phoneNumber }, seed),
      label: 'Propietario',
    };
  });
};

export const usePersonAutocomplete = ({
  open,
  dni,
  firstName,
  lastName,
  phoneNumber,
}: PersonAutocompleteParams) => {
  const searchSeed = useMemo(
    () => buildSearchSeed({ dni, firstName, lastName, phoneNumber }),
    [dni, firstName, lastName, phoneNumber]
  );

  const [debouncedSeed, setDebouncedSeed] = useState('');

  useEffect(() => {
    if (!open || !searchSeed) {
      setDebouncedSeed('');
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setDebouncedSeed(searchSeed);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [open, searchSeed]);

  const canSearch = open && debouncedSeed.length >= 2;

  const conductoresQuery = useQuery({
    queryKey: ['person-autocomplete-conductores', debouncedSeed],
    queryFn: () => conductoresService.getConductores(1, debouncedSeed),
    enabled: canSearch,
    staleTime: 60 * 1000,
  });

  const propietariosQuery = useQuery({
    queryKey: ['person-autocomplete-propietarios', debouncedSeed],
    queryFn: () => propietariosService.getPropietarios(1, debouncedSeed),
    enabled: canSearch,
    staleTime: 60 * 1000,
  });

  const suggestions = useMemo(() => {
    const conductorItems = Array.isArray(conductoresQuery.data?.conductores) ? conductoresQuery.data.conductores : [];
    const ownerItems = Array.isArray(propietariosQuery.data?.propietarios) ? propietariosQuery.data.propietarios : [];

    return [
      ...toConductorSuggestions(conductorItems, debouncedSeed),
      ...toOwnerSuggestions(ownerItems, debouncedSeed),
    ]
      .filter((item) => item.dni || item.fullName)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [conductoresQuery.data, propietariosQuery.data, debouncedSeed]);

  return {
    suggestions,
    isLoading: conductoresQuery.isFetching || propietariosQuery.isFetching,
    searchSeed: debouncedSeed,
    canSearch,
  };
};