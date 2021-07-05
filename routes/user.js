const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const passwords = require('../middleware/passwords')

router.post('/signup', passwords, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;