const express = require('express');
const router = express.Router();

const chatController = require('../controller/chat');
const authentication = require('../middleware/auth');

router.get('/all-messages',authentication.authenticate, chatController.getChats);

router.post('/message', chatController.postChats);





module.exports = router;