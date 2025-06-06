
import { useQuery } from '@tanstack/react-query';

const REFETCH_INTERVAL = 30000; // 30 segundos

// Helper function para simular la API
const fetchData = async (endpoint: string) => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // En producción, esto sería una llamada real a la API
  // return fetch(`/api/${endpoint}`).then(res => res.json());
  
  // Por ahora retornamos datos mock basados en el endpoint
  return getMockData(endpoint);
};

const getMockData = (endpoint: string) => {
  const mockData: Record<string, any[]> = {
    vehiculos: [
      {
        placa_v: "VAW-454",
        id_tipo: 1,
        ruc_empresa: "20123456789",
        dni_propietario: "12345678",
        tipo_vehiculo: {
          nombre: "Mototaxi",
          marca: "Bajaj",
          modelo: "RE 205",
          anio_fabricacion: 2020,
          estado_vehiculo: "Activo"
        },
        empresa: {
          nombre: "Transportes La Joya SAC"
        },
        propietario: {
          nombres: "Juan Carlos",
          apellidos: "Pérez González"
        }
      },
      {
        placa_v: "ABC-123",
        id_tipo: 2,
        ruc_empresa: "20987654321",
        dni_propietario: "87654321",
        tipo_vehiculo: {
          nombre: "Auto",
          marca: "Toyota",
          modelo: "Yaris",
          anio_fabricacion: 2019,
          estado_vehiculo: "Activo"
        },
        empresa: {
          nombre: "Taxi Express SAC"
        },
        propietario: {
          nombres: "María Elena",
          apellidos: "Torres Mendez"
        }
      }
    ],
    
    citv: [
      {
        id_revisionT: "REV-001",
        nro_certificado: "CITV-2024-001234",
        placa_v: "VAW-454",
        clase_vehiculo: "motocar",
        categoria: "L5",
        fecha_emision: "2024-06-15",
        fecha_vencimiento: "2024-12-15",
        resultado_inspeccion: "Aprobado",
        firma_inspector: "INSPECTOR-001"
      },
      {
        id_revisionT: "REV-002",
        nro_certificado: "CITV-2024-001235",
        placa_v: "ABC-123",
        clase_vehiculo: "automóvil",
        categoria: "M1",
        fecha_emision: "2024-05-20",
        fecha_vencimiento: "2024-11-20",
        resultado_inspeccion: "Aprobado",
        firma_inspector: "INSPECTOR-002"
      }
    ],

    empresas: [
      {
        ruc_empresa: "20123456789",
        nombre: "Transportes La Joya SAC",
        direccion: "Av. Principal 123, La Joya",
        nro_resolucion: "RES-2024-001",
        fecha_emision: "2024-01-15",
        fecha_vencimiento: "2025-01-15",
        entidad_emisora: "Municipalidad Provincial de La Joya",
        firma_representante: "Juan Carlos Pérez"
      },
      {
        ruc_empresa: "20987654321",
        nombre: "Taxi Express SAC",
        direccion: "Jr. Comercio 456, Arequipa",
        nro_resolucion: "RES-2024-002",
        fecha_emision: "2024-02-10",
        fecha_vencimiento: "2025-02-10",
        entidad_emisora: "Municipalidad Provincial de Arequipa",
        firma_representante: "María Torres"
      }
    ],

    habilitaciones: [
      {
        ruc_empresa: "20123456789",
        nombre: "Transportes La Joya SAC",
        direccion: "Av. Principal 123, La Joya",
        nro_resolucion: "RES-2024-001",
        fecha_emision: "2024-01-15",
        fecha_vencimiento: "2025-01-15",
        entidad_emisora: "Municipalidad Provincial de La Joya",
        firma_representante: "Juan Carlos Pérez",
        estado: "Vigente"
      },
      {
        ruc_empresa: "20987654321",
        nombre: "Taxi Express SAC",
        direccion: "Jr. Comercio 456, Arequipa",
        nro_resolucion: "RES-2024-002",
        fecha_emision: "2024-02-10",
        fecha_vencimiento: "2025-02-10",
        entidad_emisora: "Municipalidad Provincial de Arequipa",
        firma_representante: "María Torres",
        estado: "Por Vencer"
      },
      {
        ruc_empresa: "20555666777",
        nombre: "Servicios de Transporte Rápido EIRL",
        direccion: "Av. Ejercito 789, Paucarpata",
        nro_resolucion: "RES-2023-045",
        fecha_emision: "2023-03-20",
        fecha_vencimiento: "2024-03-20",
        entidad_emisora: "Municipalidad Distrital de Paucarpata",
        firma_representante: "Carlos Mendoza",
        estado: "Vencido"
      }
    ],

    afocat: [
      {
        id_afocat: "AF-001",
        nombre_aseguradora: "Rimac Seguros",
        nro_poliza: "POL-789456123",
        placa_v: "VAW-454",
        clase_categoria: "A1",
        fecha_inicio: "2024-01-01",
        fecha_vencimiento: "2024-12-31",
        coberturas: "Muerte, Invalidez Permanente, Incapacidad Temporal, Gastos Médicos",
        firma_qr: "QR987654321",
        id_licencia: "LIC-001",
        dni_propietario: "12345678"
      },
      {
        id_afocat: "AF-002",
        nombre_aseguradora: "Pacifico Seguros",
        nro_poliza: "POL-456789123",
        placa_v: "ABC-123",
        clase_categoria: "A1",
        fecha_inicio: "2024-03-01",
        fecha_vencimiento: "2025-02-28",
        coberturas: "Muerte, Invalidez Permanente, Incapacidad Temporal, Gastos Médicos",
        firma_qr: "QR123456789",
        id_licencia: "LIC-002",
        dni_propietario: "87654321"
      }
    ],

    conductores: [
      {
        dni_conductor: "12345678",
        nombre_completo: "Juan Carlos Pérez González",
        telefono: "987654321",
        direccion: "Av. Principal 123, La Joya",
        foto: "foto1.jpg",
        estado: "Activo"
      },
      {
        dni_conductor: "87654321",
        nombre_completo: "María Elena Torres Mendez",
        telefono: "987654322",
        direccion: "Jr. Comercio 456, Arequipa",
        foto: "foto2.jpg",
        estado: "Activo"
      }
    ],

    controles_tecnicos: [
      {
        id_control: "CT-001",
        id_fotos: "FOTO-001",
        placa_v: "VAW-454",
        cinturon: true,
        limpieza: true,
        neumaticos: true,
        botiquin: true,
        extintor: false,
        luces: true
      },
      {
        id_control: "CT-002",
        id_fotos: "FOTO-002",
        placa_v: "ABC-123",
        cinturon: true,
        limpieza: true,
        neumaticos: true,
        botiquin: true,
        extintor: true,
        luces: true
      }
    ],

    documentos: [
      {
        id: "DOC-001",
        tipo: "CITV",
        numero: "CITV-2024-001234",
        placa_v: "VAW-454",
        entidad: "CITV Centro de Inspección",
        fecha_emision: "2024-06-15",
        fecha_vencimiento: "2024-12-15",
        estado: "Vigente",
        detalles: "Clase: motocar, Cat: L5"
      },
      {
        id: "DOC-002",
        tipo: "AFOCAT",
        numero: "POL-789456123",
        placa_v: "VAW-454",
        entidad: "Rimac Seguros",
        fecha_emision: "2024-01-01",
        fecha_vencimiento: "2024-12-31",
        estado: "Vigente",
        detalles: "Póliza: POL-789456123"
      }
    ],

    fiscalizadores: [
      {
        id_usuario: 1,
        username: "fiscalizador1",
        email: "fiscalizador1@sistema.com",
        isActive: true,
        lastLogin: "2024-12-28T10:30:00",
        lastLoginIp: "192.168.1.100",
        lastLoginDevice: "Mobile",
        deviceConfigured: true,
        role_id: 2
      },
      {
        id_usuario: 2,
        username: "fiscalizador2",
        email: "fiscalizador2@sistema.com",
        isActive: true,
        lastLogin: "2024-12-27T15:45:00",
        lastLoginIp: "192.168.1.101",
        lastLoginDevice: "Desktop",
        deviceConfigured: false,
        role_id: 2
      }
    ]
  };

  return mockData[endpoint] || [];
};

// Custom hooks para cada tipo de dato
export const useVehiculosData = () => {
  return useQuery({
    queryKey: ['vehiculos'],
    queryFn: () => fetchData('vehiculos'),
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useCitvData = () => {
  return useQuery({
    queryKey: ['citv'],
    queryFn: () => fetchData('citv'),
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useEmpresasData = () => {
  return useQuery({
    queryKey: ['empresas'],
    queryFn: () => fetchData('empresas'),
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useHabilitacionesData = () => {
  return useQuery({
    queryKey: ['habilitaciones'],
    queryFn: () => fetchData('habilitaciones'),
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useAfocatData = () => {
  return useQuery({
    queryKey: ['afocat'],
    queryFn: () => fetchData('afocat'),
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useConductoresData = () => {
  return useQuery({
    queryKey: ['conductores'],
    queryFn: () => fetchData('conductores'),
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useControlesTecnicosData = () => {
  return useQuery({
    queryKey: ['controles_tecnicos'],
    queryFn: () => fetchData('controles_tecnicos'),
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useDocumentosData = () => {
  return useQuery({
    queryKey: ['documentos'],
    queryFn: () => fetchData('documentos'),
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useFiscalizadoresData = () => {
  return useQuery({
    queryKey: ['fiscalizadores'],
    queryFn: () => fetchData('fiscalizadores'),
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

// Hook genérico para consultas específicas
export const useConsultaPlaca = (placa?: string) => {
  return useQuery({
    queryKey: ['consulta_placa', placa],
    queryFn: async () => {
      if (!placa) return null;
      
      // Simular búsqueda en múltiples tablas
      const vehiculos = await fetchData('vehiculos');
      const citv = await fetchData('citv');
      const afocat = await fetchData('afocat');
      
      const vehiculo = vehiculos.find((v: any) => v.placa_v === placa);
      const citvData = citv.find((c: any) => c.placa_v === placa);
      const afocatData = afocat.find((a: any) => a.placa_v === placa);
      
      return {
        vehiculo,
        citv: citvData,
        afocat: afocatData,
        encontrado: !!(vehiculo || citvData || afocatData)
      };
    },
    enabled: !!placa,
    refetchOnWindowFocus: true,
  });
};
