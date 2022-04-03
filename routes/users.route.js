const express = require('express');
const expressFileUpload = require('express-fileupload');
const {
  getUsers,
  createUser,
  loginUser,
  adminAccess,
  editUserStatus,
  getUserById,
  editUser,
  deleteUser,
} = require('../controllers/users.controller');
const { requireAdminAuth } = require('../middlewares/requireAdminAuth');
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
router.post('/adminaccess', requireAdminAuth, adminAccess);
router.put('/users/status', editUserStatus);
router.get('/user', getUserById);
router.put('/user/:id', editUser);
router.delete('/user/:id', deleteUser);

module.exports = router;
