function requiresLogin(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/users/login');
    }
}

function validateQuestionId(req, res, next) {
    if (!req.params.questionId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send("Invalid question ID format.");
    }
    next();
}

module.exports = { requiresLogin, validateQuestionId };
