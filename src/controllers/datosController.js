const supabase = require('../config/supabase');

const TABLE_NAME = 'datos_capturados';
const HISTORY_LIMIT = 50;
const ORDER_CANDIDATES = ['created_at', 'id'];

async function fetchRows(limit) {
  for (const orderColumn of ORDER_CANDIDATES) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order(orderColumn, { ascending: false })
      .limit(limit);

    if (!error) {
      return data || [];
    }

    if (error.code !== '42703') {
      throw error;
    }
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .limit(limit);

  if (error) {
    throw error;
  }

  return data || [];
}

async function obtenerUltimoDato(req, res) {
  if (!supabase) {
    return res.status(503).json({
      message: 'Supabase no está configurado en este entorno',
    });
  }

  try {
    const rows = await fetchRows(1);

    if (!rows.length) {
      return res.status(404).json({
        message: 'No hay datos capturados en la base de datos',
      });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el ultimo dato capturado:', {
      code: error.code,
      message: error.message,
      details: error.details,
    });

    return res.status(500).json({
      message: 'No se pudo obtener el ultimo dato capturado',
    });
  }
}

async function obtenerHistorialDatos(req, res) {
  if (!supabase) {
    return res.status(503).json({
      message: 'Supabase no está configurado en este entorno',
    });
  }

  try {
    const rows = await fetchRows(HISTORY_LIMIT);
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener historial de datos capturados:', {
      code: error.code,
      message: error.message,
      details: error.details,
    });

    return res.status(500).json({
      message: 'No se pudo obtener el historial de datos capturados',
    });
  }
}

module.exports = {
  obtenerUltimoDato,
  obtenerHistorialDatos,
};
