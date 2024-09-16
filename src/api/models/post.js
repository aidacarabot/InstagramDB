const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PostSchema = new Schema({
    caption: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    }
});

module.exports = mongoose.model('Post', PostSchema);
