const express = require('express');
const router = express.Router();
const multer = require('multer');
const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });

const chatController = require('../controller/chat');

const {auth} = require('../middleware/auth');



// router.get('/new-message/:groupId/:size',auth, chatController.getNewMessage);

router.post('/add-message/:id/:groupId', chatController.postChats);

router.post('/message/upload/:groupId/:userId', upload.single('file'), chatController.postFile);





module.exports = router;