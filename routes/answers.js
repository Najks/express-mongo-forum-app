const express = require('express');
const router = express.Router();
const answersController = require('../controllers/answersController');
const { requiresLogin } = require('../middleware/authMiddleware');

router.post('/:questionId/answers', requiresLogin, answersController.addAnswer);

router.post('/answers/:answerId/accept', requiresLogin, answersController.acceptAnswer);

router.post('/:answerId/delete', requiresLogin, answersController.deleteAnswer);

module.exports = router;