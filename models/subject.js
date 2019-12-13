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
            type: String,
            required: false
        }
    },
    majors: [{
        student:{
            type: Object,
            ref: 'User',
            required: false,
            unique: true
        }
    }]
});

module.exports = mongoose.model('Subject', fishSchema);