const express = require('express');
const router = express.Router();

const chatController = require('../models/chats');
const authentication = require('../middleware/auth');

router.post('/message', authentication.authenticate,chatController.postChats);




module.exports = router;