const { Pool } = require('pg');
const { databaseUrl } = require('./index');

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

const sslPool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

const plainPool = new Pool({
  connectionString: databaseUrl,
});

async function query(text, params) {
  try {
    return await sslPool.query(text, params);
  } catch (error) {
    if (String(error.message || '').includes('does not support SSL connections')) {
      return plainPool.query(text, params);
    }

    throw error;
  }
}

async function end() {
  await Promise.allSettled([sslPool.end(), plainPool.end()]);
}

module.exports = {
  query,
  end,
};