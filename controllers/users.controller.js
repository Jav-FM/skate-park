const { getUserDB } = require('../database');
const { nanoid } = require('nanoid');
var bcrypt = require('bcryptjs');
const path = require('path');

const getUsers = async (req, res) => {
  const response = await getUserDB;
  if (!response.ok) {
    return res.status(500).json({ error: response.error });
  }
  return res.json({ data: response.data });
};

const createUser = async (req, res) => {
  try {
    // Validando que existan todos los campos
    if (
      !req.body?.nombre ||
      !req.body?.password ||
      !req.body?.email ||
      !req.body?.anos_experiencia ||
      !req.body?.especialidad ||
      !req.files?.foto
    ) {
      throw new Error('Todos los campos son obligatorios.');
    }

    const { nombre, password, email, anos_experiencia, especialidad } =
      req.body;
    // Validando que no hayan campos en blanco
    // La negación (!) de trim() devuelve true si el string se compone sólo de espacios
    if (
      !nombre.trim() ||
      !password.trim() ||
      !email.trim() ||
      !anos_experiencia.trim() ||
      !especialidad.trim()
    ) {
      throw new Error('Uno o más campos obligatorios viene en blanco.');
    }

    // Validando extensión y peso de foto
    const { foto } = req.files;
    const mimeTypes = ['image/jpeg', 'image/png'];
    if (!mimeTypes.includes(foto.mimetype)) {
      throw new Error('La foto debe ser .jpg, .jpeg o .png.');
    }
    if (foto.size > 5 * 1024 * 1024) {
      throw new Error('La foto no puede pesar más de 5MB.');
    }

    // Construir nombre de foto
    const pathFoto = `${nanoid()}.${foto.mimetype.split('/')[1]}`;

    //Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    //Guardamos la foto en el servidor (usamos path.join para juntar rutas)
    foto.mv(path.join(__dirname, '../public/avatars/', pathFoto), (err) => {
      if (err) throw new Error('No se puede guardar la imagen.');
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error: error.message,
    });
  }

  res.json(req.body);
};

module.exports = { getUsers, createUser };
