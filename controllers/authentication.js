const bcrypt = require('bcrypt');
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
    if (!req.body.password || req.body.password.length <= 6) return next(errors.INVALID_PASSWORD);
    if (await (AuthModel.findOne({
        akey: req.params.akey
    }))) {
        return next(errors.AKEY_ALREADY_REGISTERED);
    }
    const token = crypto.randomBytes(10).toString('hex');

    await AuthModel.create({
        akey: req.params.akey,
        test: 1,
        hash: await bcrypt.hash(req.body.password, 10),
        token
    });
    res.json({
        token
    });
});

const login = asyncHandler(async (req, res, next) => {

});

module.exports = {
    getUnusedAKey,
    register,
    login
};