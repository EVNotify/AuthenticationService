const express = require('express');
const router = express.Router();

const authenticationController = require('../controllers/authentication');

router.get('/akey', authenticationController.getUnusedAKey);

router.post('/:akey/', authenticationController.register);
router.post('/:akey/login', authenticationController.login);
router.post('/:akey/verify', authenticationController.verifyToken);

module.exports = router;