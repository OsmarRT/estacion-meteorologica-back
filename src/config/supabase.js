const { createClient } = require('@supabase/supabase-js');
const { supabaseUrl, supabaseSecretKey } = require('./index');

// Cambio: si Supabase no está configurado, la API sigue levantando y las rutas
// que dependan de Supabase responderán con un estado controlado.
if (!supabaseUrl || !supabaseSecretKey) {
  module.exports = null;
  return;
}

const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

module.exports = supabase;