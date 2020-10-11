const express = require('express');
const router = express.Router();

const authenticationController = require('../controllers/authentication');
const authorizationMiddleware = require('@evnotify/middlewares').authorizationHandler;

/**
 * @api {get} /authentication/akey Retrieves a new unused AKey
 * @apiName GetUnusedAKey
 * @apiGroup Authentication
 * 
 * @apiDescription All accounts are identified by an AKey.
 * This is similiar like a username. It identifies your account.
 * It is a random 6-digit combination of characters.
 * This requests will give you an unused AKey, that you can use for the registration process.
 * Note that this will just give you a currently unused combination - it's not yours in this process.
 * 
 * @apiSuccess {String|Number} an unused AKey
 * 
 * @apiSuccessExample A new unused AKey
 *  HTTP/1.1 200 OK
 *  {
 *      "akey": "123abc"
 *  }
 */
router.get('/akey', authenticationController.getUnusedAKey);
router.post('/:akey/', authenticationController.register);
router.post('/:akey/login', authorizationMiddleware, authenticationController.login);
router.post('/:akey/verify', authorizationMiddleware, authenticationController.verifyToken);

module.exports = router;
