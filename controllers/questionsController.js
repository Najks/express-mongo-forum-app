const Question = require('../models/Question');
const Answer = require('../models/Answer');

// Helper funkcija za poenostavljeno obdelavo napak
const handleErrors = (res, err, status = 500, message = 'An error occurred') => {
  console.error(err);
  res.status(status).json({ message: message, error: err });
};

exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find({}); // Pridobivanje vseh vprašanj iz baze
        res.render('questions/index', { 
            layout: 'layouts/layout', 
            title: 'Seznam vprašanj', 
            questions: questions 
        });
    } catch (error) {
        res.status(500).send('Napaka na strežniku');
    }
};

exports.getQuestionDetail = async (req, res) => {
    try {
        const question = await Question.findById(req.params.questionId).populate('authorId');
        const answers = await Answer.find({ questionId: req.params.questionId }).populate('authorId');

        if (!question) {
            res.status(404).send('Question not found');
            return;
        }

        res.render('questions/detail', {
            layout: 'layouts/layout', 
            title: 'Detail of Question',
            question: question,
            answers: answers,
            session: req.session
        });
    } catch (error) {
        console.error('Error fetching question details:', error);
        res.status(500).send('Server error');
    }
};



exports.createQuestion = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).render('users/login', { 
            message: 'Please log in to post a question',
            layout: 'layouts/layout' 
        });
    }
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).render('questions/new', { 
                message: 'Title and description are required',
                layout: 'layouts/layout' 
            });
        }
        const question = new Question({
            title,
            description,
            authorId: req.session.userId,
            createdAt: new Date(),
            updatedAt: new Date(),
            viewsCount: 0
        });
        await question.save();
        res.redirect('/questions');
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).send('Server error');
    }
};

exports.renderEditPage = async (req, res) => {
    try {
        const questionId = req.params.questionId;
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).send('Question not found.');
        }
        res.render('questions/edit', {
            layout: 'layouts/layout', 
            question
        });
    } catch (error) {
        console.error('Error rendering edit page:', error);
        res.status(500).send('Server error');
    }
};

exports.updateQuestion = async (req, res) => {
    try {
        const questionId = req.params.questionId;

        const { title, description } = req.body;

        const updatedQuestion = await Question.findByIdAndUpdate(questionId, { title, description }, { new: true });

        res.redirect(`/questions/detail/${updatedQuestion._id}`);
    } catch (error) {
        console.error('Napaka pri posodabljanju vprašanja:', error);
        res.status(500).send('Napaka na strežniku');
    }
};


exports.deleteQuestion = async (req, res) => {
    try {
        const questionId = req.params.questionId;
        const deletedQuestion = await Question.findByIdAndDelete(questionId);
        if (!deletedQuestion) {
            console.error('Napaka pri brisanju vprašanja: Vprašanje z ID-jem', questionId, 'ni bilo najdeno.');
            return res.status(404).send('Vprašanje ni bilo najdeno.');
        }
        console.log('Vprašanje z ID-jem', questionId, 'je bilo uspešno izbrisano.');
        res.redirect('/questions/manage');
    } catch (error) {
        console.error('Napaka pri brisanju vprašanja:', error);
        res.status(500).send('Napaka na strežniku.');
    }
};


exports.renderManagePage = async (req, res) => {
    try {
        const userQuestions = await Question.find({ authorId: req.session.userId });
        res.render('questions/manage', {
            layout: 'layouts/layout', 
            questions: userQuestions
        });
    } catch (error) {
        console.error('Napaka pri pridobivanju vprašanj:', error);
        res.status(500).send('Napaka na strežniku.');
    }
};

exports.getRecentQuestions = async (req, res) => {
    try {
        const recentQuestions = await Question.find().sort({ createdAt: -1 }).limit(3);
        return recentQuestions; 
    } catch (error) {
        throw new Error('Napaka pri pridobivanju nedavnih vprašanj:', error);
    }
};