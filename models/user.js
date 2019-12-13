const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const fishSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: false
    },
    school_email: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required:true
    },
    verifyToken: String,
    resetToken: String,
    resetTokenExpiration: Date,
    school: {
        type: Object,
        ref: 'University',
        required: true
        /*
        school_id: {
            type: Schema.Types.ObjectId, 
            ref:'University', 
            required:true
        },
        name: {
            type: String,
            required: true
        }
        */
    },
    school_verified: {
        type: Boolean,
        required:true
    },
    join_date:{
        required: true,
        type: Date
    },
    signins: [{
        type:String,
        required: false
    }],
    groups: [{
        groupId : {
            type: Schema.Types.ObjectId, ref:'Group', required:false
        },
        name: {type:String, required:false}
    }],
    interests: [{
            interestId : {
                type: Schema.Types.ObjectId, ref:'Interest', required:false
            },
            name: {type:String, required:false}
        }],
    image: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    liked: [{
        postId : {
            type: Schema.Types.ObjectId, ref:'Post', required:false
        },
        name: {type:String, required:false}
    }],
    following: [{
        userId: {
            type: Schema.Types.ObjectId, ref:'User', required:false
        },
        userName: {type: String, required: false},
        userImage:{type:String, required:false}
    }],
    followers: [{
        userId: {
            type: Schema.Types.ObjectId, ref:'User', required:false
        },
        userName: {type: String, required: false},
        userImage:{type:String, required:false}
    }],
    locations: [{
        location:{
            type:String,
            required: false
        }
    }],
    major: {
        type: String,
        required: false
    },
    saved_posts: [{
        post:{
            type:Object,
            ref:'Post',
            required:false
        }
    }],
    looked: [{
        post:{
            type: Object,
            ref: 'Post',
            required: false
        }
    }],
    code_snippets : [{
        code:{
            type: Object,
            ref:'CodeSnippet',
            required: false
        }
    }],
    comments : [{
        comment:{
            type: Object,
            ref:'Comment',
            required: false
        }
    }],
    posts : [{
        post:{
            type: Object,
            ref: 'Post',
            required: false
        }
    }]
});

module.exports = mongoose.model('User', fishSchema);