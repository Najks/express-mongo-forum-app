const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.registerUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            passwordHash: hashedPassword
        });
        await newUser.save();
        res.redirect('/users/login');
    } catch (error) {
        res.status(500).send("Error registering new user.");
    }
};

exports.loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user && await bcrypt.compare(req.body.password, user.passwordHash)) {
            req.session.userId = user._id; // id v sejo
            res.redirect('/users/profile');
        } else {
            res.status(401).render('users/login', {
                message: 'Login failed. Username or password is incorrect.',
                layout: 'layouts/layout'
            });
        }
    } catch (error) {
        res.status(500).send("Error logging in.");
    }
};

exports.createUser = async (req, res) => {
    try {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            passwordHash: req.body.passwordHash
        });
        await newUser.save();
        res.status(201).send("User successfully created");
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getUserByUsername = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ username: req.params.username }, req.body, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findOneAndDelete({ username: req.params.username });
        res.send("User successfully deleted");
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getUserProfile = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/users/login');
    }
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            req.session.destroy(() => {  //unicenje seje
                res.status(404).render('error', {
                    message: 'User not found, session ended.',
                    error: {}
                });
            });
        } else {
            res.render('users/profile', { user, layout: 'layouts/layout' });
        }
    } catch (err) {
        res.status(500).send('Error on the server.');
    }
};

