const { nanoid } = require('nanoid');

const requireData = (req, res, next) => {
  try {
    const { nombre, password, email, anos_experiencia, especialidad } =
      req.body;
    // Validando que no hayan campos en blanco
    // La negación (!) de trim() devuelve true si el string se compone sólo de espacios
    if (
      !nombre?.trim() ||
      !password?.trim() ||
      !email?.trim() ||
      !anos_experiencia?.trim() ||
      !especialidad?.trim() ||
      !req.files?.foto
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
    const pathPhoto = `${nanoid()}.${foto.mimetype.split('/')[1]}`;
    req.pathPhoto = pathPhoto;
    next();
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
};

module.exports = {
  requireData,
};
