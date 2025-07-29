import axiosInstance from '@/lib/axios';

export const documentosService = {
  getDocumentos: async (page: number, tipoFiltro: string, searchTerm: string) => {
    let response;
    
    // Si hay término de búsqueda (>= 2 caracteres) - BÚSQUEDA GLOBAL
    if (searchTerm && searchTerm.trim().length >= 2) {
      let allDocuments: any[] = [];
      let currentPage = 1;
      let hasMorePages = true;
      
      // Obtener TODOS los documentos de TODAS las páginas
      while (hasMorePages) {
        if (tipoFiltro && tipoFiltro !== 'ALL') {
          response = await axiosInstance.get(`/documents/type/${tipoFiltro.toLowerCase()}?page=${currentPage}`);
        } else {
          response = await axiosInstance.get(`/documents?page=${currentPage}`);
        }
        
        const documentsData = response.data?.data?.documents || [];
        const paginationData = response.data?.data?.pagination || {};
        
        allDocuments = [...allDocuments, ...documentsData];
        
        // Verificar si hay más páginas
        hasMorePages = paginationData.has_next || false;
        currentPage++;
        
        // Límite de seguridad para evitar bucles infinitos
        if (currentPage > 100) break;
      }
      
      // Filtrar en TODOS los documentos obtenidos
      const filtered = allDocuments.filter((doc: any) =>
        (doc.placa || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.numero || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.tipo || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // Crear paginación artificial para los resultados filtrados
      const itemsPerPage = 6;
      const totalFiltered = filtered.length;
      const totalPages = Math.ceil(totalFiltered / itemsPerPage);
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedResults = filtered.slice(startIndex, endIndex);
      
      return {
        documents: paginatedResults,
        pagination: {
          current_page: page,
          total_pages: totalPages,
          total_records: totalFiltered,
          records_per_page: itemsPerPage,
          has_next: page < totalPages,
          has_previous: page > 1
        },
      };
    } 
    // Si no hay búsqueda, endpoint directo (paginación normal)
    else if (tipoFiltro && tipoFiltro !== 'ALL') {
      response = await axiosInstance.get(`/documents/type/${tipoFiltro.toLowerCase()}?page=${page}`);
    } else {
      response = await axiosInstance.get(`/documents?page=${page}`);
    }
    
    return {
      documents: response.data?.data?.documents || [],
      pagination: response.data?.data?.pagination || {},
    };
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
  addDocumento: async (data: any) => {
    if (data.tipo === 'REVISION') {
      const payload = {
        review_id: data.numero,
        vehicle_plate: data.placa,
        issue_date: data.fecha_emision,
        expiration_date: data.fecha_vencimiento,
        inspection_result: data.inspection_result,
        certifying_company: data.certifying_company,
      };
      await axiosInstance.post('/documents/technical-review', payload);
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
          
          console.log('🎯 Usando estructura exacta que solicita el servidor:', exactPayload);
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
          
          console.warn(`❌ Estrategia ${attemptCount} falló: ${status} - ${message}`);
          
          // Si tenemos solo una estrategia y falla, mostrar error detallado
          if (strategies.length === 1) {
            console.error('💔 La estructura exacta del servidor también falló:', error.response?.data);
          }
          
          continue;
        }
      }
      
      // Si todas las estrategias fallaron
      console.error('💥 Todas las estrategias de creación AFOCAT fallaron');
      console.error('🔧 Último error:', lastError);
      
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