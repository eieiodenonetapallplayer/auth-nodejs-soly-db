const express = require('express');
const router = express.Router();

const register = require('./auth/register');
const login = require('./auth/login');
const logout = require('./auth/logout');

router.use('/', register, logout, login);

module.exports = router;