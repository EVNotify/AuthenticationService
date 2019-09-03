const axios = require('axios');

const errors = require('../errors.json');

const asyncHandler = require('../utils/asyncHandler');

module.exports = asyncHandler(async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.length) return next(errors.UNAUTHORIZED);
    axios.post(process.env.AUTHORIZATION_SERVICE, {}, {
        headers: {
            'Authorization': req.headers.authorization
        }
    }).then(() => {
        next();
    }).catch((err) => {
        next(err);
    });
});