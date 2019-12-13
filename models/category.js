const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const fishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    subjects: [{
        _id:{
            type: Schema.Types.ObjectId,
            ref: 'Subject',
            required: false
        },
        name: {
            type: String,
            required: false
        }
    }],
    groups: [{
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'Group',
            required: false
        },
        name: {
            type: String,
            required: false
        }
    }],
    interests: [{
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'Interest',
            required: false
        },
        name: {
            type: String,
            required: false
        }
    }],
    followers: [{
        student: {
            type: Object,
            ref: 'User',
            required: false
        }
    }]
});

module.exports = mongoose.model('Category', fishSchema);