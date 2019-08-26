const mongoose = require('mongoose');

const options = {
    id: false,
    collection: 'auth',
    timestamps: true,
    toObject: {
        getters: true
    },
    versionKey: false
};

const AuthSchema = new mongoose.Schema({
    akey: {
        type: String,
        required: true,
        unique: true
    },
    hash: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
}, options);

module.exports = mongoose.model('Auth', AuthSchema);