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
 * @apiSuccess {String|Number} akey an unused AKey
 * 
 * @apiSuccessExample A new unused AKey
 *  HTTP/1.1 200 OK
 *  {
 *      "akey": "123abc"
 *  }
 * 
 * @apiErrorExample {json} AKey generation
 *  HTTP/1.1 409 Conflict
 *  {
 *      "code": 409,
 *      "message": "An error occured trying to generate new AKey"
 *  }
 */
router.get('/akey', authenticationController.getUnusedAKey);
/**
 * @api {post} /authentication/:akey/ Creates a new account
 * @apiName Register
 * @apiGroup Authentication
 * 
 * @apiDescription This will create a new account for provided AKey.
 * The AKey acts like a username. Together with a password of your choice this is your account.
 * You'll retrieve a persistent token that is sensitive, and authenticates you against the API.
 * The token can be changed with a request with your password.
 * Note: Do not share the token with people or other 3rd parties you don't trust.
 * Never share your password.
 * Note: It automatically creates an API key for you. This will be used to authorize you for future requests.
 * 
 * @apiParam {String} password the password of your account (at least 6 characters)
 * 
 * @apiSuccess {String} key your personal API Key for your created account
 * @apiSuccess {String} token your personal persistent token to authenticate your account against the API (without your password)
 * 
 * @apiSuccessExample Your created account
 *  HTTP/1.1 200 OK
 *  {
 *      "key": "12345678abcdefgh",
 *      "token": "1234567890abcdefghij"
 *  }
 * 
 * @apiErrorExample {json} Invalid password
 *  HTTP/1.1 400 Bad request
 *  {
 *      "code": 400,
 *      "message": "Password invalid. It must be a string with at least 6 characters"
 *  }
 * @apiErrorExample {json} AKey already registered
 *  HTTP/1.1 409 Conflict
 *  {
 *      "code": 409,
 *      "message": "Provided AKey has already been registered"
 *  }
 */
router.post('/:akey', authenticationController.register);
/**
 * @api {post} /authentication/:akey/login Signs in to your account to retrieve token
 * @apiName Login
 * @apiGroup Authentication
 * 
 * @apiDescription This will log in to your account and retrieves your personal token.
 * This token is required to authenticate for all upcoming requests.
 * You'll need to pass this within header soon.
 * 
 * @apiHeader {String} authorization your API Key (as a Bearer token)
 * 
 * @apiParam {String} password the password of your account (at least 6 characters)

 * @apiSuccess {String} token your personal persistent token to authenticate your account against the API (without your password)
 * 
 * @apiSuccessExample Login succeeded
 *  HTTP/1.1 200 OK
 *  {
 *      "token": "1234567890abcdefghij"
 *  }
 * 
 * @apiErrorExample {json} Invalid password
 *  HTTP/1.1 400 Bad request
 *  {
 *      "code": 400,
 *      "message": "Password invalid. It must be a string with at least 6 characters"
 *  }
 * @apiErrorExample {json} AKey not registered
 *  HTTP/1.1 404 Not found
 *  {
 *      "code": 404,
 *      "message": "Provided AKey has not been registered"
 *  }
 * @apiErrorExample {json} Invalid credentials
 *  HTTP/1.1 401 Unauthorized
 *  {
 *      "code": 404,
 *      "message": "Invalid credentials"
 *  }
 */
router.post('/:akey/login', authorizationMiddleware, authenticationController.login);
/**
 * @api {post} /authentication/:akey/verify Checks the provided authentication
 * @apiName VerifyToken
 * @apiGroup Authentication
 * 
 * @apiDescription This will check if provided token belongs to specified AKey.
 * Note: This is intended to be used internally to verify correct authentication and should not be used from outside.
 * 
 * @apiHeader {String} authorization your API Key (as a Bearer token)
 * @apiHeader {String} authentication your token of the AKey (as a Bearer token)
 * 

 * @apiSuccess {Boolean} verified true, if authenticated
 * 
 * @apiSuccessExample Authentication succeeded
 *  HTTP/1.1 200 OK
 *  {
 *      "verified": true
 *  }
 * 
 * @apiErrorExample {json} Missing authentication
 *  HTTP/1.1 400 Bad request
 *  {
 *      "code": 400,
 *      "message": "Missing authentication header. Ensure that AKey token is provided within Authentication header"
 *  }
 * @apiErrorExample {json} AKey not registered
 *  HTTP/1.1 404 Not found
 *  {
 *      "code": 404,
 *      "message": "Provided AKey has not been registered"
 *  }
 * @apiErrorExample {json} Invalid token
 *  HTTP/1.1 401 Unauthorized
 *  {
 *      "code": 404,
 *      "message": "Invalid token"
 *  }
 */
router.post('/:akey/verify', authorizationMiddleware, authenticationController.verifyToken);

module.exports = router;
