const {
  getUsersDB,
  createUserDB,
  getUserDB,
  editUserStatusDB,
  getUserByIdDB,
  editUserDB,
  deleteUserDB,
} = require('../database');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const path = require('path');

const getUsers = async (req, res) => {
  const response = await getUsersDB();
  if (!response.ok) {
    return res.status(500).json({ error: response.error });
  }
  return res.json({ data: response.data });
};

const createUser = async (req, res) => {
  try {
    const { nombre, password, email, anos_experiencia, especialidad } =
      req.body;
    const { foto } = req.files;
    //Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const pathPhoto = req.pathPhoto;

    //Guardamos la foto en el servidor (usamos path.join para juntar rutas)
    foto.mv(path.join(__dirname, '../public/avatars/', pathPhoto), (err) => {
      if (err) throw new Error('No se puede guardar la imagen.');
    });

    //Guardamos al usuario en la DB
    const response = await createUserDB({
      nombre,
      email,
      anos_experiencia,
      especialidad,
      hashPassword,
      pathPhoto,
    });

    if (!response.ok) {
      throw new Error(response.error);
    }

    const payload = { id: response.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return res.json({
      ok: true,
      token,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Validacion de campos del body
    if (!password?.trim() || !email?.trim()) {
      throw new Error('Uno o más campos obligatorios viene en blanco.');
    }

    //Revisar si email existe en DB
    const response = await getUserDB(email);

    if (!response.ok) {
      throw new Error(response.error);
    }

    // return res.json(response);
    //Comparar password con el hashpassword en DB

    const { data } = response;
    const comparePassword = await bcrypt.compare(password, data.password);

    if (!comparePassword) {
      throw new Error('Contraseña incorrecta');
    }

    //Se genera JWT

    const payload = { id: data.id, email: data.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.json({
      ok: true,
      token,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
};

const adminAccess = async (req, res) => {
  return res.json({
    ok: true,
  });
};

const editUserStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const response = await editUserStatusDB({
      id,
      status,
    });
    if (!response.ok) {
      throw new Error(response.error);
    }
    return res.json({
      ok: true,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  if (!req.headers?.authorization) {
    throw new Error('No autorizado');
  }

  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    throw new Error('Formato de token no valido (utilizar Bearer)');
  }

  let id = 0;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (!decoded.id) {
      throw new Error('Token invalido');
    }
    id = decoded.id;
  });

  const response = await getUserByIdDB(id);
  if (!response.ok) {
    return res.status(500).json({ error: response.error });
  }
  return res.json({ data: response.data });
};

const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, nombre, anos_experiencia, especialidad } = req.body;
    const response = await editUserDB({
      id,
      email,
      nombre,
      anos_experiencia,
      especialidad,
    });
    if (!response.ok) {
      throw new Error(response.error);
    }
    return res.json({
      ok: true,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await deleteUserDB(id);
    if (!response.ok) {
      throw new Error(response.error);
    }
    return res.json({
      ok: true,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  loginUser,
  adminAccess,
  editUserStatus,
  getUserById,
  editUser,
  deleteUser,
};
