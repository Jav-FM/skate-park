const express = require('express');
const expressFileUpload = require('express-fileupload');
const {
  getUsers,
  createUser,
  loginUser,
} = require('../controllers/users.controller');
const { requireAuth } = require('../middlewares/requireAuth');
const { requireData } = require('../middlewares/requireData');
const router = express.Router();

//Middleware aplicado a todas las routes
router.use(
  expressFileUpload({
    abortOnLimit: true,
    limits: { fileSize: 5 * 1024 * 1024 },
  })
);

router.post('/login', loginUser);
router.get('/users', requireAuth, getUsers);
router.post('/users', requireData, createUser);

// Pendientes:
// router.put('/users/:id', requireAuth, updateUser);
// router.delete('/users/:id', requireAuth, deleteUser);

module.exports = router;
