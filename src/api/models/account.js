const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AccountSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
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

module.exports = mongoose.model('Account', AccountSchema);
