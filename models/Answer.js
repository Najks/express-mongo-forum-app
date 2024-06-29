const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    questionId: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isAccepted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Answer', answerSchema);