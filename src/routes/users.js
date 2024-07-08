const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

router.get('/:id', authMiddleware, userController.getUserById);

module.exports = router;