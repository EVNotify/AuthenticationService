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
                    return /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(v);
                },
                message: props => `${props.value} is invalid!`
            },
            {
                validator: (v) => {
                    if (v.length !== 6) return false
                },
                message: props => `${props.value} invalid length!`
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