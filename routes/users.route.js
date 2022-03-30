const express = require('express');
const expressFileUpload = require('express-fileupload');
const { getUsers, createUser } = require('../controllers/users.controller');
const router = express.Router();

//Middleware aplicado a todas las routes
router.use(
  expressFileUpload({
    abortOnLimit: true,
    limits: { fileSize: 5 * 1024 * 1024 },
  })
);

router.get('/users', getUsers);
router.post('/users', createUser);

module.exports = router;
