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
        unique: true,
        validate: [
            {
                validator: (v) => {
                    return /^([a-zA-Z0-9_-]){6}$/.test(v);
                },
                message: props => `${props.value} is invalid!`
            },
        ],
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