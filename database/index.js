const { Pool } = require('pg');
const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/skatepark';

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({ connectionString });

const getUserDB = async () => {
  const client = await pool.connect();
  try {
    const response = await client.query('SELECT * FROM skaters');
    return {
      ok: true,
      data: response.rows,
    };
  } catch (error) {
    return {
      ok: false,
      error,
    };
  } finally {
    client.release();
  }
};

module.exports = { getUserDB };
