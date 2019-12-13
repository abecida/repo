const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const fishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: false
    },
    students: [{
        student: {
            type: Object,
            ref: 'User',
            required: false
        }
    }]
});

module.exports = mongoose.model('University', fishSchema);