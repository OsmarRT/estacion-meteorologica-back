const supabase = require('../config/supabase');

const TABLE_NAME = 'datos_capturados';
const HISTORY_LIMIT = 50;
const PAGE_SIZE = 1000;
const ORDER_CANDIDATES = ['created_at', 'id'];

// ─── Helpers ────────────────────────────────────────────────────────────────

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

async function fetchAllRows() {
  const allRows = [];
  let from = 0;

  while (true) {
    const to = from + PAGE_SIZE - 1;
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .range(from, to);

    if (error) {
      throw error;
    }

    const rows = data || [];
    allRows.push(...rows);

    if (rows.length < PAGE_SIZE) {
      break;
    }

    from += PAGE_SIZE;
  }

  return allRows;
}

function escapeCsvValue(value) {
  if (value === null || value === undefined) {
    return '';
  }
  const normalizedValue =
    typeof value === 'object' ? JSON.stringify(value) : String(value);
  return `"${normalizedValue.replace(/"/g, '""')}"`;
}

function buildCsv(rows) {
  if (!rows.length) {
    return '';
  }

  const columns = [];
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!columns.includes(key)) {
        columns.push(key);
      }
    }
  }

  const header = columns.join(',');
  const lines = rows.map((row) =>
    columns.map((column) => escapeCsvValue(row[column])).join(',')
  );

  return [header, ...lines].join('\n');
}

// ─── Controllers ─────────────────────────────────────────────────────────────

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

async function exportDatosCapturadosCsv(req, res) {
  if (!supabase) {
    return res.status(503).json({
      message: 'Supabase no está configurado en este entorno',
    });
  }

  try {
    const rows = await fetchAllRows();
    const csv = buildCsv(rows);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="datos_capturados.csv"'
    );

    return res.status(200).send(csv);
  } catch (error) {
    console.error('Error al exportar datos capturados:', {
      code: error.code,
      message: error.message,
      details: error.details,
    });

    return res.status(500).json({
      message: 'No se pudo generar el CSV de datos capturados',
    });
  }
}

module.exports = {
  obtenerUltimoDato,
  obtenerHistorialDatos,
  exportDatosCapturadosCsv,
};