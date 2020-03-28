const express = require('express');
const router = express.Router();

const authenticationController = require('../controllers/authentication');
const authorizationMiddleware = require('@evnotify/middlewares').authorizationHandler;


router.get('/akey', authorizationMiddleware, authenticationController.getUnusedAKey);

router.post('/:akey/', authorizationMiddleware, authenticationController.register);
router.post('/:akey/login', authorizationMiddleware, authenticationController.login);
router.post('/:akey/verify', authorizationMiddleware, authenticationController.verifyToken);

module.exports = router;