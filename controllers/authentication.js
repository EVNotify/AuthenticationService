const crypto = require('crypto');
const asyncHandler = require('../utils/asyncHandler');
const AuthModel = require('../models/Auth');
const errors = require('../errors.json');

const getUnusedAKey = asyncHandler(async (_req, res, next) => {
    const akey = crypto.randomBytes(3).toString('hex');

    if (!(await (AuthModel.findOne({
        akey
    })))) {
        return res.json({
            akey
        });
    }
    next(errors.AKEY_GENERATION);
});

const register = asyncHandler(async (req, res, next) => {

});

const login = asyncHandler(async (req, res, next) => {

});

module.exports = {
    getUnusedAKey,
    register,
    login
};