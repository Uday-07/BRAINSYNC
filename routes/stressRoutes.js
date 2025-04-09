const express = require('express');
const stressController = require('../controllers/stressController');
const isAuthenticated = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/questionnaire', isAuthenticated, stressController.getQuestionnaire);
router.post('/questionnaire', isAuthenticated, stressController.submitQuestionnaire);

router.get('/mcq', isAuthenticated, stressController.getMCQs);
router.post('/mcq', isAuthenticated, stressController.submitMCQs);

router.get('/result', isAuthenticated, stressController.getStressResult);

router.get('/solutions', isAuthenticated, stressController.getSolutions);

router.get('/feedback', isAuthenticated, stressController.getFeedback);
router.post('/feedback', isAuthenticated, stressController.submitFeedback);

module.exports = router;
