const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.get('/session', sessionController.getSessionPage);

module.exports = router;
