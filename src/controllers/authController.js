const supabase = require('../config/supabase');
const { authTable } = require('../config');

const tableNamePattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

if (!tableNamePattern.test(authTable)) {
  throw new Error('AUTH_TABLE must be a valid SQL identifier');
}

async function login(req, res) {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({
      message: 'correo y contrasena son requeridos',
    });
  }

  try {
    const { data, error } = await supabase
      .from(authTable)
      .select('id, correo, created_at')
      .eq('correo', correo.trim())
      .eq('contrasena', contrasena)
      .maybeSingle();

    if (error) {
      console.error('Error al iniciar sesion:', {
        code: error.code,
        message: error.message,
      });

      if (error.code === '42P01') {
        return res.status(500).json({
          message: `La tabla ${authTable} no existe en la base de datos`,
        });
      }

      return res.status(503).json({
        message: 'No se pudo consultar Supabase',
      });
    }

    if (!data) {
      return res.status(401).json({
        message: 'Correo o contrasena invalidos',
      });
    }

    return res.json({
      message: 'Inicio de sesion correcto',
      user: data,
    });
  } catch (error) {
    console.error('Error al iniciar sesion:', {
      code: error.code,
      message: error.message,
    });

    return res.status(500).json({
      message: 'Error al iniciar sesion',
    });
  }
}

module.exports = {
  login,
};