const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const limiter = require('../config/limiter.config');

router.post('/login', limiter, authController.login);
router.post('/register', limiter, authController.register);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

module.exports = router;
