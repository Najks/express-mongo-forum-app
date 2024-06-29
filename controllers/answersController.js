const Question = require('../models/Question');
const Answer = require('../models/Answer');

exports.addAnswer = async (req, res) => { //prijava
    if (!req.session.userId) {
        return res.status(401).render('users/login', { 
            layout: 'layouts/layout', 
            title: 'Login Required', 
            message: 'Please log in to add an answer.'
        });
    }

    try {
        const { content } = req.body;
        const { questionId } = req.params;
//prazen block
        if (!content) {
            return res.status(400).render('questions/detail', { 
                layout: 'layouts/layout', 
                title: 'Error', 
                message: 'Content is required.',
                questionId: questionId 
            });
        }
//podatki iz req v objekt
        const answer = new Answer({
            content,
            questionId,
            authorId: req.session.userId
        });
//baza
        await answer.save();
        res.redirect(`/questions/detail/${questionId}`);
    } catch (error) {
        console.error('Error posting answer:', error);
        res.status(500).render('error', {
            layout: 'layouts/layout', 
            title: 'Server Error', 
            message: 'Error posting answer'
        });
    }
};

exports.acceptAnswer = async (req, res) => {
    try {
        const { answerId } = req.params;
        const answer = await Answer.findById(answerId).populate('questionId');
        const question = answer.questionId;

        if (req.session.userId !== question.authorId.toString()) {
            return res.status(403).render('error', {
                layout: 'layouts/layout',
                title: 'Unauthorized',
                message: 'You are not authorized to accept this answer.'
            });
        }

        answer.isAccepted = true;
        await answer.save();
        res.redirect(`/questions/detail/${question._id}`);
    } catch (error) {
        console.error('Error accepting answer:', error);
        res.status(500).render('error', {
            layout: 'layouts/layout',
            title: 'Server Error',
            message: 'Error accepting answer'
        });
    }
};

exports.deleteAnswer = async (req, res) => {
    try {
        const answerId = req.params.answerId;
        const deletedAnswer = await Answer.findByIdAndDelete(answerId);
        if (!deletedAnswer) {
            return res.status(404).send('Answer not found.');
        }
        const questionId = deletedAnswer.questionId;
        res.redirect(`/questions/detail/${questionId}`);
    } catch (error) {
        console.error('Error deleting answer:', error);
        res.status(500).send('Server error');
    }
};