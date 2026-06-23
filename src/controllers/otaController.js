const path = require('path');
const supabase = require('../config/supabase');

const TABLE_NAME = 'registro_ota';
const BUCKET_NAME = 'ota';

function isBinFile(file) {
  if (!file || !file.originalname) {
    return false;
  }

  return path.extname(file.originalname).toLowerCase() === '.bin';
}

function buildStoragePath(userId, originalName) {
  const normalizedName = path
    .basename(originalName)
    .replace(/[^a-zA-Z0-9._-]/g, '_');

  return `${userId}/${Date.now()}-${normalizedName}`;
}

async function subirBin(req, res) {
  if (!supabase) {
    return res.status(503).json({
      message: 'Supabase no está configurado en este entorno',
    });
  }

  if (!req.file) {
    return res.status(400).json({
      message: 'Debes enviar un archivo .BIN en el campo file',
    });
  }

  if (!isBinFile(req.file)) {
    return res.status(400).json({
      message: 'Solo se permiten archivos con extension .BIN',
    });
  }

  const userId = req.user && req.user.id;

  if (!userId) {
    return res.status(401).json({
      message: 'Usuario autenticado no encontrado en el token',
    });
  }

  const storagePath = buildStoragePath(userId, req.file.originalname);

  try {
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, req.file.buffer, {
        contentType: req.file.mimetype || 'application/octet-stream',
        upsert: false,
      });

    if (uploadError) {
      return res.status(500).json({
        message: 'No se pudo subir el archivo al bucket ota',
        details: uploadError.message,
      });
    }

    const { data: publicData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
    const fileUrl = publicData?.publicUrl || storagePath;

    const { data: registro, error: insertError } = await supabase
      .from(TABLE_NAME)
      .insert({
        id_usuario: userId,
        url: fileUrl,
        created_at: new Date().toISOString(),
      })
      .select('id, id_usuario, url, created_at')
      .single();

    if (insertError) {
      await supabase.storage.from(BUCKET_NAME).remove([storagePath]);

      return res.status(500).json({
        message: 'El archivo se subio, pero no se pudo registrar la OTA',
        details: insertError.message,
      });
    }

    return res.status(201).json({
      message: 'Archivo BIN cargado correctamente',
      file: {
        name: req.file.originalname,
        url: fileUrl,
        storagePath,
      },
      registro,
      user: req.user,
    });
  } catch (error) {
    console.error('Error al subir el archivo OTA:', {
      code: error.code,
      message: error.message,
    });

    return res.status(500).json({
      message: 'Error al procesar la subida OTA',
    });
  }
}

module.exports = {
  subirBin,
};