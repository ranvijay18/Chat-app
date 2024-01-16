const express = require('express');
const router = express.Router();

const groupController = require('../controller/group');

const {auth} = require('../middleware/auth');

router.post('/create-group/:id',groupController.postGroup);

router.get('/show-groups',auth,groupController.getGroup);

router.get('/group-messages/:id',auth,groupController.getMessages);

router.get('/join-group/:id',auth, groupController.joinGroup);




module.exports = router;
