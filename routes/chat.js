const express = require('express');
const router = express.Router();

const chatController = require('../controller/chat');

const {auth} = require('../middleware/auth');



router.get('/new-message/:groupId/:size',auth, chatController.getNewMessage);

router.post('/add-message/:id/:groupId', chatController.postChats);





module.exports = router;