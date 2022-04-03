const express = require('express');
const { requireAdminAuth } = require('../middlewares/requireAdminAuth');
const router = express.Router();

router.get('/', (req, res) => res.render('home'));
router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));
router.get('/admin', (req, res) => res.render('admin'));
router.get('/perfil', (req, res) => res.render('perfil'));

module.exports = router;
