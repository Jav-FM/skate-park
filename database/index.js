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

const getUsersDB = async () => {
  const client = await pool.connect();
  try {
    const response = await client.query(
      'SELECT id, nombre, email, anos_experiencia, especialidad, estado, foto FROM skaters'
    );

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

const createUserDB = async ({
  nombre,
  email,
  anos_experiencia,
  especialidad,
  hashPassword,
  pathPhoto,
}) => {
  const client = await pool.connect();

  const query = {
    text: 'INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    values: [
      email,
      nombre,
      hashPassword,
      anos_experiencia,
      especialidad,
      pathPhoto,
      false,
    ],
  };
  try {
    const response = await client.query(query);
    const { id } = response.rows[0];
    return {
      ok: true,
      id,
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

const getUserDB = async (email) => {
  const client = await pool.connect();

  const query = {
    text: 'SELECT * FROM skaters WHERE email = $1',
    values: [email],
  };
  try {
    const response = await client.query(query);

    if (!response.rows[0]) {
      return {
        ok: false,
        error: 'No existe ese usuario en nuestra base de datos.',
      };
    }

    return {
      ok: true,
      data: response.rows[0],
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

const editUserStatusDB = async ({ id, status }) => {
  const client = await pool.connect();

  const query = {
    text: 'UPDATE skaters SET estado = $1 WHERE id = $2',
    values: [status, Number(id)],
  };
  try {
    await client.query(query);
    return {
      ok: true,
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

const getUserByIdDB = async (id) => {
  const client = await pool.connect();
  const query = {
    text: 'SELECT id, nombre, email, anos_experiencia, especialidad, estado, foto FROM skaters WHERE id = $1',
    values: [Number(id)],
  };
  try {
    const response = await client.query(query);

    return {
      ok: true,
      data: response.rows[0],
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

const editUserDB = async ({
  id,
  email,
  nombre,
  anos_experiencia,
  especialidad,
}) => {
  const client = await pool.connect();

  const query = {
    text: 'UPDATE skaters SET email = $2, nombre = $3, anos_experiencia = $4, especialidad = $5 WHERE id = $1',
    values: [Number(id), email, nombre, anos_experiencia, especialidad],
  };
  try {
    await client.query(query);
    return {
      ok: true,
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

const deleteUserDB = async (id) => {
  const client = await pool.connect();
  const query = {
    text: 'DELETE FROM skaters WHERE id = $1',
    values: [Number(id)],
  };
  try {
    await client.query(query);
    return {
      ok: true,
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

module.exports = {
  getUsersDB,
  createUserDB,
  getUserDB,
  editUserStatusDB,
  getUserByIdDB,
  editUserDB,
  deleteUserDB,
};
