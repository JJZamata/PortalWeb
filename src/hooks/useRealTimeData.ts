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
    usuarios: [
      {
        id_usuario: 1,
        username: "admin",
        email: "admin@sistema.com",
        password: "hashed_password",
        deviceInfo: { browser: "Chrome", os: "Windows" },
        isActive: true,
        lastLogin: "2024-12-28T10:30:00",
        lastLoginIp: "192.168.1.100",
        lastLoginDevice: "Desktop",
        deviceConfigured: true,
        role_id: 1
      },
      {
        id_usuario: 2,
        username: "fiscalizador1",
        email: "fiscalizador1@sistema.com",
        password: "hashed_password",
        deviceInfo: { browser: "Safari", os: "iOS" },
        isActive: true,
        lastLogin: "2024-12-28T08:15:00",
        lastLoginIp: "192.168.1.101",
        lastLoginDevice: "Mobile",
        deviceConfigured: true,
        role_id: 2
      },
      {
        id_usuario: 3,
        username: "webadmin1",
        email: "webadmin1@sistema.com",
        password: "hashed_password",
        deviceInfo: { browser: "Firefox", os: "Linux" },
        isActive: true,
        lastLogin: "2024-12-27T16:45:00",
        lastLoginIp: "192.168.1.102",
        lastLoginDevice: "Desktop",
        deviceConfigured: false,
        role_id: 3
      }
    ],

    roles: [
      {
        role_id: 1,
        name: "admin",
        description: "Administrador del sistema con acceso completo",
        requiresDeviceInfo: false
      },
      {
        role_id: 2,
        name: "fiscalizador",
        description: "Fiscalizador de campo con dispositivo móvil",
        requiresDeviceInfo: true
      },
      {
        role_id: 3,
        name: "web_admin",
        description: "Administrador web con acceso limitado",
        requiresDeviceInfo: false
      },
      {
        role_id: 4,
        name: "web_operator",
        description: "Operador web con permisos básicos",
        requiresDeviceInfo: false
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
        firma_representante: "Juan Carlos Pérez",
        created_by: 1,
        created_at: "2024-01-15T09:00:00",
        updated_by: 1,
        updated_at: "2024-01-15T09:00:00",
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
        created_by: 1,
        created_at: "2024-02-10T10:30:00",
        updated_by: 1,
        updated_at: "2024-02-10T10:30:00",
        estado: "Vigente"
      }
    ],

    propietario: [
      {
        dni_propietario: "12345678",
        nombres: "Juan Carlos",
        apellidos: "Pérez González",
        telefono: "987654321",
        email: "juan.perez@email.com",
        fecha_nacimiento: "1985-03-15",
        estado_civil: "Casado",
        created_by: 1,
        created_at: "2024-01-10T08:00:00",
        updated_by: 1,
        updated_at: "2024-01-10T08:00:00"
      },
      {
        dni_propietario: "87654321",
        nombres: "María Elena",
        apellidos: "Torres Mendez",
        telefono: "987654322",
        email: "maria.torres@email.com",
        fecha_nacimiento: "1990-07-22",
        estado_civil: "Soltera",
        created_by: 1,
        created_at: "2024-02-05T09:15:00",
        updated_by: 1,
        updated_at: "2024-02-05T09:15:00"
      }
    ],

    tipo_vehiculo: [
      {
        id_tipo: 1,
        nombre: "mototaxi",
        descripcion: "Vehículo de tres ruedas para transporte público",
        marca: "Bajaj",
        modelo: "RE 205",
        anio_fabricacion: 2020,
        estado_vehiculo: "Activo",
        created_by: 1,
        created_at: "2024-01-01T00:00:00",
        updated_by: 1,
        updated_at: "2024-01-01T00:00:00"
      },
      {
        id_tipo: 2,
        nombre: "auto",
        descripcion: "Automóvil para transporte de pasajeros",
        marca: "Toyota",
        modelo: "Yaris",
        anio_fabricacion: 2019,
        estado_vehiculo: "Activo",
        created_by: 1,
        created_at: "2024-01-01T00:00:00",
        updated_by: 1,
        updated_at: "2024-01-01T00:00:00"
      }
    ],

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

    revisionT: [
      {
        id_revisionT: "REV-001",
        nro_certificado: "CITV-2024-001234",
        placa_v: "VAW-454",
        clase_vehiculo: "motocar",
        categoria: "L5",
        fecha_emision: "2024-06-15",
        fecha_vencimiento: "2024-12-15",
        resultado_inspeccion: "Aprobado",
        firma_inspector: "INSPECTOR-001",
        created_by: 1,
        created_at: "2024-06-15T14:00:00",
        updated_by: 1,
        updated_at: "2024-06-15T14:00:00"
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
        firma_inspector: "INSPECTOR-002",
        created_by: 1,
        created_at: "2024-05-20T15:30:00",
        updated_by: 1,
        updated_at: "2024-05-20T15:30:00"
      }
    ],

    conductores: [
      {
        dni_conductor: "12345678",
        nombre_completo: "Juan Carlos Pérez González",
        telefono: "987654321",
        direccion: "Av. Principal 123, La Joya",
        foto: "foto1.jpg",
        created_by: 1,
        created_at: "2024-01-10T08:00:00",
        updated_by: 1,
        updated_at: "2024-01-10T08:00:00"
      },
      {
        dni_conductor: "87654321",
        nombre_completo: "María Elena Torres Mendez",
        telefono: "987654322",
        direccion: "Jr. Comercio 456, Arequipa",
        foto: "foto2.jpg",
        created_by: 1,
        created_at: "2024-02-05T09:15:00",
        updated_by: 1,
        updated_at: "2024-02-05T09:15:00"
      }
    ],

    licencias_conducir: [
      {
        id_licencia: "LIC-001",
        dni_conductor: "12345678",
        nro_licencia: "L123456789",
        categoria: "A-IIa",
        fecha_emision: "2023-01-15",
        fecha_vencimiento: "2028-01-15",
        entidad_emisora: "MTC",
        restricciones: "Ninguna",
        created_by: 1,
        created_at: "2023-01-15T10:00:00",
        updated_by: 1,
        updated_at: "2023-01-15T10:00:00"
      },
      {
        id_licencia: "LIC-002",
        dni_conductor: "87654321",
        nro_licencia: "L987654321",
        categoria: "B-I",
        fecha_emision: "2023-03-20",
        fecha_vencimiento: "2028-03-20",
        entidad_emisora: "MTC",
        restricciones: "Lentes",
        created_by: 1,
        created_at: "2023-03-20T11:30:00",
        updated_by: 1,
        updated_at: "2023-03-20T11:30:00"
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
        dni_propietario: "12345678",
        created_by: 1,
        created_at: "2024-01-01T08:00:00",
        updated_by: 1,
        updated_at: "2024-01-01T08:00:00"
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
        dni_propietario: "87654321",
        created_by: 1,
        created_at: "2024-03-01T09:00:00",
        updated_by: 1,
        updated_at: "2024-03-01T09:00:00"
      }
    ],

    fotos: [
      {
        id_fotos: "FOTO-001",
        id_usuario: "1",
        coordenadas: "-16.4090474,-71.537451",
        url: "https://example.com/foto1.jpg",
        fecha: "2024-12-28T10:30:00"
      },
      {
        id_fotos: "FOTO-002",
        id_usuario: "2",
        coordenadas: "-16.3988022,-71.5350048",
        url: "https://example.com/foto2.jpg",
        fecha: "2024-12-28T11:45:00"
      }
    ],

    acta_control: [
      {
        id_control: "CT-001",
        id_fotos: "FOTO-001",
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
        cinturon: true,
        limpieza: true,
        neumaticos: true,
        botiquin: true,
        extintor: true,
        luces: true
      }
    ],

    actasConforme: [
      {
        id_actasConforme: "AC-001",
        id_control: "CT-002",
        placa_v: "ABC-123",
        fecha_hora: "2024-12-28T11:45:00",
        ubicacion: "Av. Ejercito con Paucarpata",
        tipo_acta: "conforme",
        observaciones: "Vehículo en buen estado, cumple con todos los requisitos"
      }
    ],

    actas_noconforme: [
      {
        id_acta_no: "ANC-001",
        ruc_empresa: "20123456789",
        fecha_hora: "2024-12-28T10:30:00",
        lugar_infraccion: "Av. Principal, La Joya",
        id_licencia: "LIC-001",
        placa_v: "VAW-454",
        id_control: "CT-001",
        descripcion_infraccion: "Falta de extintor",
        calificacion_infraccion: "Leve",
        medida_administrativa: "Multa",
        sancion: "S/ 200.00",
        observacion: "Conductor debe presentar extintor en 48 horas"
      }
    ],

    audit_logs: [
      {
        id_log: 1,
        table_name: "vehiculos",
        operation: "INSERT",
        record_id: "VAW-454",
        old_values: null,
        new_values: { placa_v: "VAW-454", id_tipo: 1, ruc_empresa: "20123456789" },
        user_id: 1,
        timestamp: "2024-01-20T10:00:00",
        ip_address: "192.168.1.100"
      },
      {
        id_log: 2,
        table_name: "empresas",
        operation: "UPDATE",
        record_id: "20123456789",
        old_values: { nombre: "Transportes La Joya" },
        new_values: { nombre: "Transportes La Joya SAC" },
        user_id: 1,
        timestamp: "2024-02-15T14:30:00",
        ip_address: "192.168.1.100"
      }
    ]
  };

  return mockData[endpoint] || [];
};

// Custom hooks para cada tipo de dato
export const useUsuariosData = () => {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: () => fetchData('usuarios'),
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useRolesData = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => fetchData('roles'),
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useVehiculosData = () => {
  return useQuery({
    queryKey: ['vehiculos'],
    queryFn: () => fetchData('vehiculos'),
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useTipoVehiculoData = () => {
  return useQuery({
    queryKey: ['tipo_vehiculo'],
    queryFn: () => fetchData('tipo_vehiculo'),
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useRevisionTData = () => {
  return useQuery({
    queryKey: ['revisionT'],
    queryFn: () => fetchData('revisionT'),
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

// Hook específico para CITV (alias de useRevisionTData)
export const useCitvData = () => {
  return useRevisionTData();
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

// Hook específico para habilitaciones (alias de useEmpresasData)
export const useHabilitacionesData = () => {
  return useEmpresasData();
};

export const usePropietarioData = () => {
  return useQuery({
    queryKey: ['propietario'],
    queryFn: () => fetchData('propietario'),
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

export const useLicenciasConducirData = () => {
  return useQuery({
    queryKey: ['licencias_conducir'],
    queryFn: () => fetchData('licencias_conducir'),
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useFotosData = () => {
  return useQuery({
    queryKey: ['fotos'],
    queryFn: () => fetchData('fotos'),
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useActaControlData = () => {
  return useQuery({
    queryKey: ['acta_control'],
    queryFn: () => fetchData('acta_control'),
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useActasConformeData = () => {
  return useQuery({
    queryKey: ['actasConforme'],
    queryFn: () => fetchData('actasConforme'),
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useActasNoConformeData = () => {
  return useQuery({
    queryKey: ['actas_noconforme'],
    queryFn: () => fetchData('actas_noconforme'),
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useAuditLogsData = () => {
  return useQuery({
    queryKey: ['audit_logs'],
    queryFn: () => fetchData('audit_logs'),
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

// Mantener compatibilidad con hooks existentes
export const useFiscalizadoresData = () => {
  return useUsuariosData();
};

export const useControlesTecnicosData = () => {
  return useActaControlData();
};

export const useDocumentosData = () => {
  return useQuery({
    queryKey: ['documentos'],
    queryFn: async () => {
      const revisionT = await fetchData('revisionT');
      const afocat = await fetchData('afocat');
      
      const documentos = [
        ...revisionT.map((item: any) => ({
          id: item.id_revisionT,
          tipo: "CITV",
          numero: item.nro_certificado,
          placa_v: item.placa_v,
          entidad: "CITV Centro de Inspección",
          fecha_emision: item.fecha_emision,
          fecha_vencimiento: item.fecha_vencimiento,
          estado: new Date(item.fecha_vencimiento) > new Date() ? "Vigente" : "Vencido",
          detalles: `Clase: ${item.clase_vehiculo}, Cat: ${item.categoria}`
        })),
        ...afocat.map((item: any) => ({
          id: item.id_afocat,
          tipo: "AFOCAT",
          numero: item.nro_poliza,
          placa_v: item.placa_v,
          entidad: item.nombre_aseguradora,
          fecha_emision: item.fecha_inicio,
          fecha_vencimiento: item.fecha_vencimiento,
          estado: new Date(item.fecha_vencimiento) > new Date() ? "Vigente" : "Vencido",
          detalles: `Póliza: ${item.nro_poliza}`
        }))
      ];
      
      return documentos;
    },
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
      const revisionT = await fetchData('revisionT');
      const afocat = await fetchData('afocat');
      
      const vehiculo = vehiculos.find((v: any) => v.placa_v === placa);
      const citvData = revisionT.find((c: any) => c.placa_v === placa);
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
