const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Account = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: ''
    },
    profilePicture: {
        type: String,
        default: ''
    },
    followers: {
        type: Number,
        default: 0
    },
    following: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Account', Account);
