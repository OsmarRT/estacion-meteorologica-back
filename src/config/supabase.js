const { createClient } = require('@supabase/supabase-js');
const { supabaseUrl, supabaseSecretKey } = require('./index');

if (!supabaseUrl) {
  throw new Error('SUPABASE_URL is required');
}

if (!supabaseSecretKey) {
  throw new Error('SUPABASE_SECRET_KEY is required');
}

const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

module.exports = supabase;