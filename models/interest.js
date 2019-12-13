const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const fishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        _id:{
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: false
        },
        name: {
            type: String, required: false
        }
    },
    followers: [{
        student: {
            type: Object,
            ref: 'User',
            required: false
        }
    }]
});

module.exports = mongoose.model('Interest', fishSchema);