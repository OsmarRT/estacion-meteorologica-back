const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Estacion Meteorologica API',
    version: '1.0.0',
    description: 'Documentacion de la API con autenticacion basica y health check.',
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
    '/datos-capturados/export/csv': {
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
  },
};

module.exports = swaggerSpec;