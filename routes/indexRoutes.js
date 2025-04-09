const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/authMiddleware');
const { chatController } = require('../controllers/chatController');

// Root route: Redirect to login if not authenticated
router.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/index');
    } else {
        res.redirect('/login');
    }
});

// Render the index page
router.get('/index', isAuthenticated, (req, res) => {
    res.render('index', {
        response: '',
        user: req.session.user || null,
    });
});

// Handle POST requests to the index page
router.post('/index', isAuthenticated, chatController);

module.exports = router;
