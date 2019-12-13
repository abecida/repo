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
            ref:'Category',
            required: false
        },
        name: {
            type: String,
            required: false
        }
    },
    parent: {
        _id:{
            type: Schema.Types.ObjectId, ref:'Group', required:false
        },
        name: {
            type: String, required: false
        }
    },
    members: [{
        student:{
            type: Object,
            ref: 'User',
            required: false
        }
    }]
});

module.exports = mongoose.model('Group', fishSchema);