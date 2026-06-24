const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Estacion Meteorologica API',
    version: '1.0.0',
    description: 'Documentacion de la API con autenticacion JWT, health check y subida OTA.',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  servers: [
    {
      url: '/api',
    },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Verificar estado de la API',
        responses: {
          200: {
            description: 'API operativa',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/datos/ultimo': {
      get: {
        summary: 'Obtener el ultimo dato capturado',
        tags: ['Datos capturados'],
        responses: {
          200: {
            description: 'Ultimo registro obtenido correctamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  additionalProperties: true,
                },
              },
            },
          },
          404: {
            description: 'No hay datos capturados',
          },
          503: {
            description: 'Supabase no está configurado',
          },
        },
      },
    },
    '/datos/historial': {
      get: {
        summary: 'Obtener los ultimos 50 registros capturados',
        tags: ['Datos capturados'],
        responses: {
          200: {
            description: 'Historial obtenido correctamente',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: true,
                  },
                },
              },
            },
          },
          503: {
            description: 'Supabase no está configurado',
          },
          500: {
            description: 'Error al obtener el historial',
          },
        },
      },
    },
    '/datos/export/csv': {
      get: {
        summary: 'Exportar todos los datos capturados a CSV',
        tags: ['Datos capturados'],
        responses: {
          200: {
            description: 'Archivo CSV generado correctamente',
            content: {
              'text/csv': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
          503: {
            description: 'Supabase no está configurado',
          },
          500: {
            description: 'Error al generar el CSV',
          },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Iniciar sesion',
        tags: ['Autenticacion'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['correo', 'contrasena'],
                properties: {
                  correo: {
                    type: 'string',
                    example: 'usuario@correo.com',
                  },
                  contrasena: {
                    type: 'string',
                    example: '123456',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Sesion iniciada correctamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    token: { type: 'string' },
                    tokenType: { type: 'string', example: 'Bearer' },
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer' },
                        correo: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Faltan datos requeridos',
          },
          401: {
            description: 'Credenciales invalidas',
          },
          500: {
            description: 'Error interno del servidor',
          },
        },
      },
    },
    '/auth/me': {
      get: {
        summary: 'Leer usuario autenticado',
        tags: ['Autenticacion'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Usuario autenticado leido correctamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    user: {
                      type: 'object',
                      additionalProperties: true,
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Token invalido o faltante',
          },
        },
      },
    },
    '/ota/upload': {
      post: {
        summary: 'Subir archivo BIN a Supabase Storage y registrar OTA',
        tags: ['OTA'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['file'],
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Archivo .BIN a subir',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Archivo subido y registrado correctamente',
          },
          400: {
            description: 'Archivo invalido o faltante',
          },
          401: {
            description: 'Token invalido o faltante',
          },
          503: {
            description: 'Supabase no está configurado',
          },
        },
      },
    },
  },
};

module.exports = swaggerSpec;