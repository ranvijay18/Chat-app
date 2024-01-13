const express = require('express');
const router = express.Router();

const chatController = require('../controller/chat');
const authentication = require('../middleware/auth');

router.post('/message', chatController.postChats);





module.exports = router;