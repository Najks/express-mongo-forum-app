const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requiresLogin } = require('../middleware/authMiddleware');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/User');


router.get('/login', (req, res) => {
    res.render('users/login', { layout: 'layouts/layout', title: 'Login' });
});
router.get('/register', (req, res) => {
    res.render('users/register', { layout: 'layouts/layout', title: 'Register' });
});
router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);

// Zaščitene poti
router.get('/logout', requiresLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.redirect('/');
    });
});

router.get('/profile', async (req, res) => {
    try {
        const userId = req.session.userId;
        const user = await User.findById(userId);
        const questionsCount = await Question.countDocuments({ authorId: userId });
        const answersCount = await Answer.countDocuments({ authorId: userId });
        const acceptedAnswersCount = await Question.countDocuments({ authorId: userId, 'answers.isAccepted': true });

        res.render('users/profile', {
            user,
            questionsCount,
            answersCount,
            acceptedAnswersCount,
            profileAge: calculateProfileAge(user.createdAt),
            layout: 'layouts/layout',
            title: 'Profile'
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send("Error loading profile.");
    }
});

function calculateProfileAge(createdAt) {
    const now = new Date();
    const duration = now - createdAt; //ms
    return Math.floor(duration / (1000 * 60 * 60 * 24)); // dan
}

module.exports = router;