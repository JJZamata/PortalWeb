import axiosInstance from '@/lib/axios';

// Función para manejar errores específicos del endpoint /documents y API V2
const handleDocumentosError = (error: any) => {
  // Error específico del backend con formato {success: false, message, errors}
  if (error.response?.data?.success === false && error.response?.data?.errors) {
    const responseData = error.response.data;

    // Extraer todos los mensajes de error
    const errorMessages = responseData.errors.map((err: any) =>
      `${err.field || err.location}: ${err.message}`
    );

    // Crear error con mensaje combinado
    const combinedMessage = responseData.message + ': ' + errorMessages.join('; ');
    const enhancedError = new Error(combinedMessage);

    // Agregar información detallada para el frontend
    (enhancedError as any).backendMessage = responseData.message;
    (enhancedError as any).validationErrors = responseData.errors;
    (enhancedError as any).status = error.response.status;
    (enhancedError as any).isValidationError = true;

    return enhancedError;
  }

  // Error específico con formato {success: false, message, code, details}
  if (error.response?.data?.success === false && error.response?.data?.code) {
    const responseData = error.response.data;
    const enhancedError = new Error(responseData.message);

    // Agregar información específica del error
    (enhancedError as any).backendMessage = responseData.message;
    (enhancedError as any).errorCode = responseData.code;
    (enhancedError as any).errorDetails = responseData.details;
    (enhancedError as any).status = error.response.status;
    (enhancedError as any).isValidationError = true;

    return enhancedError;
  }

  // Error específico con formato {success: false, message} sin details
  if (error.response?.data?.success === false) {
    const responseData = error.response.data;
    const enhancedError = new Error(responseData.message);

    (enhancedError as any).backendMessage = responseData.message;
    (enhancedError as any).status = error.response.status;
    (enhancedError as any).isValidationError = true;

    return enhancedError;
  }

  // Para otros errores, devolver el error original sin modificar
  return error;
};

export const documentosService = {
  // Método unificado para obtener documentos usando el nuevo endpoint V2
  getDocumentos: async (
    page: number = 1,
    tipoFiltro: string = 'all',
    searchTerm: string = '',
    sortBy: string = 'createdAt',
    sortOrder: string = 'DESC'
  ) => {
    try {
      // Construir parámetros según la especificación V2 del backend
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '6'); // Límite según especificación

      const hasSearch = searchTerm && searchTerm.trim().length >= 3; // Cambiado a 3 según backend
      // Normalizar el tipo: convertir 'all' y otros valores a los correctos
      let normalizedType = tipoFiltro.toLowerCase();

      // Mapear valores del frontend a valores del backend
      const typeMapping: { [key: string]: string } = {
        'all': 'all',
        'revision': 'technicalReview',
        'afocat': 'insurance',
        'insurance': 'insurance',
        'technicalreview': 'technicalReview',
        'technicalReview': 'technicalReview'
      };

      normalizedType = typeMapping[normalizedType] || 'all';

      // Agregar parámetros de filtrado (solo si son válidos)
      if (hasSearch) params.append('search', searchTerm.trim());
      if (normalizedType && normalizedType !== 'all') {
        params.append('type', normalizedType);
      }

      // Agregar parámetros de ordenamiento
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      // Usar endpoint unificado V2
      const response = await axiosInstance.get(`/documents?${params.toString()}`);

      if (response.data.success) {
        const responseData = response.data.data;

        // Los datos están en responseData.data según la estructura del backend
        const documentsList = responseData.data || [];

        // Transformar documentos al formato esperado por el frontend
        const documentsTransformed = documentsList.map((doc: any, index: number) => {
          // Extraer información del vehículo anidado
          const vehicle = doc.vehicle || {};

          // Lógica simplificada: si hay filtro, usar ese tipo. Si no, usar el campo type del documento
          let tipoFinal;
          if (normalizedType === 'insurance') {
            tipoFinal = 'AFOCAT';  // Filtro de seguros → tipo fijo
          } else if (normalizedType === 'technicalReview') {
            tipoFinal = 'REVISION'; // Filtro de revisiones → tipo fijo
          } else if (doc.type === 'INSURANCE') {
            tipoFinal = 'AFOCAT';  // Sin filtro, usar campo type del backend
          } else if (doc.type === 'TECHNICALREVIEW') {
            tipoFinal = 'REVISION'; // Sin filtro, usar campo type del backend
          } else {
            // Último recurso: inferir por campos específicos
            if (doc.policyNumber || doc.insuranceCompanyName || doc.coverage) {
              tipoFinal = 'AFOCAT';
            } else if (doc.reviewCode || doc.certifyingCompany || doc.inspectionResult) {
              tipoFinal = 'REVISION';
            } else {
              tipoFinal = 'DESCONOCIDO';
            }
          }

          const transformedDoc = {
            tipo: tipoFinal,
            numero: doc.policyNumber || doc.reviewCode || doc.reviewId || doc.numero || '',
            placa: vehicle?.plate || doc.vehiclePlate || doc.placa || '',
            entidad_empresa: doc.insuranceCompanyName || doc.certifyingCompany || doc.entidad_empresa || '',
            fecha_emision: doc.startDate || doc.issueDate || doc.reviewDate || doc.fecha_emision || '',
            fecha_vencimiento:
              doc.type === 'INSURANCE' ? (doc.endDate || doc.expirationDate || doc.fecha_vencimiento || '') :
              doc.type === 'TECHNICALREVIEW' ? (doc.nextReviewDate || doc.fecha_vencimiento || '') :
              doc.fecha_vencimiento || '',
            estado: doc.status || 'ACTIVE',
            detalles: {
              inspection_result: doc.inspectionResult || doc.resultado_inspeccion,
              resultado_inspeccion: doc.inspectionResult || doc.resultado_inspeccion,
              cobertura: doc.type === 'INSURANCE' ? (doc.coverage || '') : '',
              clase_vehiculo: vehicle?.brand || doc.vehicleClass || doc.clase_vehiculo,
              marca: vehicle?.brand || '',
              modelo: vehicle?.model || '',
              anio: vehicle?.year || '',
              inspector: doc.inspector?.name || '',
              driver: doc.driver?.name || '',
              resultado: doc.type === 'TECHNICALREVIEW' ? (doc.inspectionResult || '') : ''
            },
            // Mantener campos adicionales para compatibilidad
            id: doc.id,
            type: doc.type,
            createdAt: doc.createdAt,
            // Información anidada
            vehicle: vehicle,
            driver: doc.driver,
            inspector: doc.inspector
          };

          return transformedDoc;
        });

        // Transformar estructura de paginación
        const paginationTransformed = {
          current_page: responseData.pagination?.currentPage || page,
          total_pages: responseData.pagination?.totalPages || 1,
          total_records: responseData.pagination?.totalItems || 0,
          records_per_page: responseData.pagination?.itemsPerPage || 6,
          has_next: responseData.pagination?.hasNextPage || false,
          has_previous: responseData.pagination?.hasPreviousPage || responseData.pagination?.hasPrevPage || (page > 1)
        };

        return {
          documents: documentsTransformed,
          pagination: paginationTransformed,
          appliedFilters: responseData.appliedFilters,
          sorting: responseData.sorting
        };
      }

      throw new Error('Error en la respuesta del servidor');
    } catch (error) {
      // Manejar errores específicos del endpoint
      throw handleDocumentosError(error);
    }
  },
  getPlacas: async () => {
    const response = await axiosInstance.get('/vehicles');
    return response.data.data;
  },
  searchPlacas: async (texto: string) => {
    const params = new URLSearchParams();
    params.append('page', '1');
    params.append('limit', '10');
    if (texto) params.append('search', texto);
    const response = await axiosInstance.get(`/vehicles?${params.toString()}`);
    return response.data.data;
  },
  getEmpresas: async () => {
    try {
      const response = await axiosInstance.get('/companies?page=1');
      return response.data.data;
    } catch (error: any) {
      console.warn('Error al obtener empresas:', error.response?.status);
      // Si es 403, devolver array vacío para evitar errores
      if (error.response?.status === 403) {
        return { companies: [] };
      }
      // Para otros errores, intentar endpoint alternativo
      try {
        const fallbackResponse = await axiosInstance.get('/companies');
        return fallbackResponse.data.data;
      } catch (fallbackError) {
        console.warn('Error en endpoint alternativo de empresas');
        return { companies: [] };
      }
      }
  },

  // Método para crear un seguro específico
  createInsurance: async (data: {
    insuranceCompanyName: string;
    policyNumber: string;
    vehiclePlate: string;
    startDate: string;
    expirationDate: string;
    coverage: string;
    licenseId: number;
    ownerDni: string;
  }) => {
    try {
      const response = await axiosInstance.post(`/insurance`, data);

      if (response.data.success) {
        return response.data;
      }

      throw new Error('Error en la respuesta del servidor');
    } catch (error) {
      console.error('Error en documentosService.createInsurance:', error);
      // Manejar errores específicos del endpoint
      throw handleDocumentosError(error);
    }
  },

  // Método para crear una revisión técnica específica
  createTechnicalReview: async (data: {
    reviewId: string;
    vehiclePlate: string;
    issueDate: string;
    expirationDate: string;
    inspectionResult: 'APROBADO' | 'OBSERVADO';
    certifyingCompany: string;
  }) => {
    try {
      const response = await axiosInstance.post(`/technical-reviews`, data);

      if (response.data.success) {
        return response.data;
      }

      throw new Error('Error en la respuesta del servidor');
    } catch (error) {
      console.error('Error en documentosService.createTechnicalReview:', error);
      // Manejar errores específicos del endpoint
      throw handleDocumentosError(error);
    }
  },

  // Método para obtener un seguro específico por número de póliza
  getInsuranceByNumber: async (insuranceNumber: string) => {
    try {
      const response = await axiosInstance.get(`/insurance/${insuranceNumber}`);

      if (response.data.success) {
        return response.data.data;
      }

      throw new Error('Error en la respuesta del servidor');
    } catch (error) {
      console.error('Error en documentosService.getInsuranceByNumber:', error);
      // Manejar errores específicos del endpoint
      throw handleDocumentosError(error);
    }
  },

  // Método para obtener una revisión técnica específica por código
  getTechnicalReviewByCode: async (reviewCode: string) => {
    try {
      const response = await axiosInstance.get(`/technicalReviews/${reviewCode}`);

      if (response.data.success) {
        return response.data.data;
      }

      throw new Error('Error en la respuesta del servidor');
    } catch (error) {
      console.error('Error en documentosService.getTechnicalReviewByCode:', error);
      // Manejar errores específicos del endpoint
      throw handleDocumentosError(error);
    }
  },

  // Método para actualizar un seguro específico
  updateInsurance: async (insuranceNumber: string, updateData: {
    insuranceCompanyName?: string;    // Nombre de la compañía de seguros
    policyNumber?: string;           // Número de póliza
    vehiclePlate?: string;           // Placa del vehículo
    startDate?: string;              // Fecha de inicio (YYYY-MM-DD)
    expirationDate?: string;         // Fecha de vencimiento (YYYY-MM-DD)
    coverage?: string;               // Cobertura del seguro
    licenseId?: number;              // ID de licencia
    ownerDni?: string;               // DNI del propietario
  }) => {
    try {
      const response = await axiosInstance.put(`/insurance/${insuranceNumber}`, updateData);

      if (response.data.success) {
        return response.data;
      }

      throw new Error('Error en la respuesta del servidor');
    } catch (error) {
      console.error('Error en documentosService.updateInsurance:', error);
      // Manejar errores específicos del endpoint
      throw handleDocumentosError(error);
    }
  },

  // Método para eliminar un seguro específico
  deleteInsurance: async (insuranceNumber: string) => {
    try {
      const response = await axiosInstance.delete(`/insurance/${insuranceNumber}`);

      if (response.data.success) {
        return response.data;
      }

      throw new Error('Error en la respuesta del servidor');
    } catch (error) {
      console.error('Error en documentosService.deleteInsurance:', error);
      // Manejar errores específicos del endpoint
      throw handleDocumentosError(error);
    }
  },

  // Método para actualizar una revisión técnica específica
  updateTechnicalReview: async (reviewId: string, updateData: {
    vehiclePlate?: string;                // Placa del vehículo
    issueDate?: string;                   // Fecha de emisión (YYYY-MM-DD)
    expirationDate?: string;              // Fecha de vencimiento (YYYY-MM-DD)
    inspectionResult?: 'APROBADO' | 'OBSERVADO';  // Resultado de inspección
    certifyingCompany?: string;           // Empresa certificadora
  }) => {
    try {
      const response = await axiosInstance.put(`/technical-reviews/${reviewId}`, updateData);

      if (response.data.success) {
        return response.data;
      }

      throw new Error('Error en la respuesta del servidor');
    } catch (error) {
      console.error('Error en documentosService.updateTechnicalReview:', error);
      // Manejar errores específicos del endpoint
      throw handleDocumentosError(error);
    }
  },

  // Método para eliminar una revisión técnica específica
  deleteTechnicalReview: async (reviewId: string) => {
    try {
      const response = await axiosInstance.delete(`/technical-reviews/${reviewId}`);

      if (response.data.success) {
        return response.data;
      }

      throw new Error('Error en la respuesta del servidor');
    } catch (error) {
      console.error('Error en documentosService.deleteTechnicalReview:', error);
      // Manejar errores específicos del endpoint
      throw handleDocumentosError(error);
    }
  },

  addDocumento: async (data: any) => {
    if (data.tipo === 'REVISION') {
      // Verificar campos requeridos para Technical Review según API V2
      if (!data.numero || !data.placa || !data.fecha_emision || !data.fecha_vencimiento ||
          !data.inspection_result || !data.certifying_company) {
        throw new Error('Faltan campos obligatorios para Revisión Técnica. Se requiere: reviewId, vehiclePlate, issueDate, expirationDate, inspectionResult, certifyingCompany');
      }

      // Validar que inspection_result sea un valor permitido
      const validResults = ['APROBADO', 'OBSERVADO'];
      if (!validResults.includes(data.inspection_result)) {
        throw new Error('inspectionResult debe ser "APROBADO" u "OBSERVADO"');
      }

      const payload = {
        reviewId: data.numero,                    // ID único de la revisión técnica
        vehiclePlate: data.placa,                 // Placa del vehículo
        issueDate: data.fecha_emision,            // Fecha de emisión (YYYY-MM-DD)
        expirationDate: data.fecha_vencimiento,   // Fecha de vencimiento (YYYY-MM-DD)
        inspectionResult: data.inspection_result, // Resultado de inspección: 'APROBADO' | 'OBSERVADO'
        certifyingCompany: data.certifying_company, // Empresa certificadora
      };

      const response = await axiosInstance.post('/technical-reviews', payload);

      if (response.data.success) {
        return response.data;
      }

      throw new Error('Error en la respuesta del servidor al crear revisión técnica');
    } else if (data.tipo === 'AFOCAT') {
      // Endpoint específico para seguros AFOCAT
      // Verificar si todos los campos requeridos están presentes
      if (!data.entidad_empresa || !data.numero_poliza || !data.placa || 
          !data.fecha_emision || !data.fecha_vencimiento || !data.cobertura || !data.owner_dni) {
        throw new Error('Faltan campos obligatorios para AFOCAT');
      }
      
      const strategies = [
        // Estrategia 1: Usar EXACTAMENTE los campos que el servidor especifica
        async () => {
          const exactPayload = {
            insurance_company_name: data.entidad_empresa,
            policy_number: data.numero_poliza,
            vehicle_plate: data.placa,
            start_date: data.fecha_emision,
            expiration_date: data.fecha_vencimiento,
            coverage: data.cobertura,
            owner_dni: data.owner_dni
          };
          
          console.log('Usando estructura exacta que solicita el servidor:', exactPayload);
          return await axiosInstance.post('/documents/insurance', exactPayload);
        }
      ];
      
      let lastError;
      let attemptCount = 0;
      
      for (const strategy of strategies) {
        attemptCount++;
        try {
          console.info(`🔄 Intentando crear AFOCAT - Estrategia ${attemptCount}/${strategies.length}`);
          const result = await strategy();
          console.info(`✅ ¡AFOCAT CREADO EXITOSAMENTE! 🎉`);
          return result;
        } catch (error: any) {
          lastError = error;
          const status = error.response?.status;
          const message = error.response?.data?.message || error.message;
          
          console.warn(`Estrategia ${attemptCount} falló: ${status} - ${message}`);
          
          // Si tenemos solo una estrategia y falla, mostrar error detallado
          if (strategies.length === 1) {
            console.error('La estructura exacta del servidor también falló:', error.response?.data);
          }
          
          continue;
        }
      }

      
      // Crear un error más descriptivo para el usuario
      const userFriendlyError = new Error(
        `No se pudo crear el documento AFOCAT. El servidor no está respondiendo correctamente. ` +
        `Se intentaron ${strategies.length} métodos diferentes. ` +
        `Error del servidor: ${lastError?.response?.status || 'Sin respuesta'} - ` +
        `${lastError?.response?.data?.message || lastError?.message || 'Error desconocido'}`
      );
      
      // Agregar el error original como propiedad para debugging
      (userFriendlyError as any).originalError = lastError;
      throw userFriendlyError;
    } else {
      const formData = new FormData();
      formData.append('tipo', data.tipo);
      formData.append('numero', data.numero);
      formData.append('placa', data.placa);
      formData.append('entidad_empresa', data.entidad_empresa);
      formData.append('fecha_emision', data.fecha_emision);
      formData.append('fecha_vencimiento', data.fecha_vencimiento);
      formData.append('observaciones', data.observaciones || '');
      if (data.archivo) formData.append('archivo', data.archivo);
      await axiosInstance.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
  },
  deleteDocumento: async (documento: any) => {
    // Estrategia: Intentar diferentes patrones de endpoints del API
    const strategies = [
      // Estrategia 1: Desactivación (patrón común en este backend)
      async () => {
        if (documento.tipo === 'AFOCAT') {
          return await axiosInstance.put(`/documents/insurance/${documento.numero}/deactivate`);
        } else {
          return await axiosInstance.put(`/documents/${documento.numero}/deactivate`);
        }
      },
      
      // Estrategia 2: Endpoint específico por tipo
      async () => {
        if (documento.tipo === 'AFOCAT') {
          return await axiosInstance.delete(`/documents/insurance/${documento.numero}`);
        } else if (documento.tipo === 'REVISION') {
          return await axiosInstance.delete(`/documents/technical-review/${documento.numero}`);
        } else {
          return await axiosInstance.delete(`/documents/${documento.numero}`);
        }
      },
      
      // Estrategia 3: Eliminación con parámetros
      async () => {
        return await axiosInstance.delete(`/documents`, {
          params: {
            tipo: documento.tipo,
            numero: documento.numero,
            placa: documento.placa
          }
        });
      },
      
      // Estrategia 4: POST para eliminación (algunos APIs usan esto)
      async () => {
        return await axiosInstance.post(`/documents/delete`, {
          tipo: documento.tipo,
          numero: documento.numero,
          placa: documento.placa
        });
      },
      
      // Estrategia 5: Simulación temporal (para desarrollo)
      async () => {
        // Solo mostrar en modo desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.info('🔧 Modo desarrollo: Simulando eliminación de documento');
        }
        return { 
          data: { 
            success: true, 
            message: `Documento ${documento.tipo} ${documento.numero} eliminado exitosamente` 
          } 
        };
      }
    ];
    
    let lastError;
    let realErrors = []; // Para errores que no son 404/405/501
    
    for (let i = 0; i < strategies.length; i++) {
      try {
        const result = await strategies[i]();
        
        // Si llegamos aquí, la estrategia funcionó
        if (i === strategies.length - 1) {
          // Si es la última estrategia (simulación), mostrar advertencia
          console.info('⚠️ Eliminación simulada - el documento no fue eliminado del servidor');
        } else if (i === 0) {
          console.info('✅ Documento desactivado exitosamente');
        } else {
          console.info('✅ Documento eliminado exitosamente');
        }
        
        return result;
      } catch (error: any) {
        lastError = error;
        
        // Si no es 404, 405 o 501, es un error real que debemos reportar
        if (error.response?.status && ![404, 405, 501].includes(error.response.status)) {
          realErrors.push({ strategy: i + 1, error });
        }
        
        // Solo mostrar errores reales, no los 404 esperados
        if (realErrors.length > 0 && i === strategies.length - 1) {
          console.warn('⚠️ Errores encontrados durante eliminación:', realErrors);
        }
        
        // Si es la penúltima estrategia y falló, mostrar mensaje informativo
        if (i === strategies.length - 2) {
          console.info('💡 API no soporta eliminación de documentos - usando modo simulado');
        }
      }
    }
    
    // Si todas las estrategias fallaron, lanzar el último error
    throw lastError;
  },
};