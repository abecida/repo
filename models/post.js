const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const fishSchema = new Schema({
    poster: {
        type: Object,
        ref:'User',
        required: true
    },
    short_description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId, ref:'Category', required:false
    },
    interest: {
        type: Schema.Types.ObjectId, ref:'Interest', required: false
    },
    groupId: {
        type: Schema.Types.ObjectId, ref:'Group', required:false
    },
    comments: [{
        content: {
            type: String,
            required: false
        },
        poster: {
            type: Object,
            ref: 'User',
            required: false
        },
        liked: [{
            type: Object,
            ref: 'User',
            required: false
        }]
    }],
    liked: [{
        student:{
            type: Object,
            ref: 'User',
            required: false
        }
    }],
    pages: [{
        content:{
            type: String,
            required: true
        }
    }],
    title: {
        type:String,
        required: true
    },
    additional_links: [{
        link:{
            type: String,
            required: false
        }
    }],
    images: [{
        image:{
            type: String,
            required: false
        }
    }]
});

module.exports = mongoose.model('Post', fishSchema);