const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questionsController');
const answersController = require('../controllers/answersController');
const { requiresLogin, validateQuestionId } = require('../middleware/authMiddleware'); // Predpostavka, da imate middleware za avtentikacijo

// Seznam vseh vprašanj
router.get('/', questionsController.getAllQuestions);

// Stran za ustvarjanje novega vprašanja (dostopna samo prijavljenim uporabnikom)
router.get('/new', requiresLogin, (req, res) => {
    res.render('questions/create', {
        layout: 'layouts/layout',
        title: 'Create New Question'
    });
});

router.get('/detail/:questionId', requiresLogin, validateQuestionId, questionsController.getQuestionDetail, (req, res) => {
    res.render('questions/detail', {
        layout: 'layouts/layout',
        title: 'Question details'
    });
});

router.post('/', requiresLogin, questionsController.createQuestion);

router.get('/edit/:questionId', requiresLogin, questionsController.renderEditPage);

router.post('/edit/:questionId', requiresLogin, questionsController.updateQuestion);

router.get('/manage', requiresLogin, questionsController.renderManagePage);
// routes/questions.js

router.post('/delete/:questionId', requiresLogin, questionsController.deleteQuestion);

router.post('/:questionId/answers', requiresLogin, answersController.addAnswer);

// POST zahteva za sprejem pravilnega odgovora
router.post('/answers/:answerId/accept', requiresLogin, answersController.acceptAnswer);

// POST zahteva za brisanje odgovora (dostopna samo prijavljenim uporabnikom)
router.post('/answers/:answerId/delete', requiresLogin, answersController.deleteAnswer);

module.exports = router;
