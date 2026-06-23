const dotenv = require('dotenv');

dotenv.config({ override: true });

module.exports = {
  port: process.env.PORT || 3000,
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY || '',
  authTable: process.env.AUTH_TABLE || 'usuarrio',
  jwtSecret: process.env.JWT_SECRET || process.env.SUPABASE_SECRET_KEY || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
};