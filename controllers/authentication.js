const axios = require('axios');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const asyncHandler = require('@evnotify/utils').asyncHandler;
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
    if (!req.body.password || req.body.password.length < 6) return next(errors.INVALID_PASSWORD);
    if (await (AuthModel.findOne({
            akey: req.params.akey
        }))) {
        return next(errors.AKEY_ALREADY_REGISTERED);
    }
    const token = crypto.randomBytes(10).toString('hex');

    await AuthModel.create({
        akey: req.params.akey,
        hash: await bcrypt.hash(req.body.password, 10),
        token
    });

    axios.post(process.env.AUTHORIZATION_SERVICE, {
        scopes: [req.params.akey]
    }).then((response) => {
        res.json({
            token,
            key: response.data.key
        });
    }).catch((err) => {
        console.error(err);
        try {
            next(err.response.data.error || 500);
        } catch (error) {
            console.error(error);
            next(500);
        }
    });
});

const login = asyncHandler(async (req, res, next) => {
    if (!req.body.password || req.body.password.length < 6) return next(errors.INVALID_PASSWORD);
    const authObj = await AuthModel.findOne({
        akey: req.params.akey
    });

    if (!authObj) return next(errors.AKEY_NOT_REGISTERED);
    if (!(await bcrypt.compare(req.body.password, authObj.hash))) return next(errors.UNAUTHORIZED);
    res.json({
        token: authObj.token
    });
});

const verifyToken = asyncHandler(async (req, res, next) => {
    if (!req.headers.authentication || !req.headers.authentication.length) return next(errors.MISSING_AUTHENTICATION);

    const authObj = await AuthModel.findOne({
        akey: req.params.akey
    });

    if (!authObj) return next(errors.AKEY_NOT_REGISTERED);
    if (authObj.token !== req.headers.authentication) return next(errors.INVALID_TOKEN);
    res.json({
        verified: true
    });
});

module.exports = {
    getUnusedAKey,
    register,
    login,
    verifyToken
};
