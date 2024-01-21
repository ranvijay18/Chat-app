const express = require('express');
const router = express.Router();

const groupController = require('../controller/group');

const {auth} = require('../middleware/auth');

router.post('/create-group/:id',groupController.postGroup);

router.get('/show-groups',auth,groupController.getGroup);

router.get('/group-messages/:id',auth,groupController.getMessages);

router.get('/join-group/:id',auth, groupController.joinGroup);

router.post('/add-new-user', groupController.addNewMember);

router.get('/remove-user/:userId/:gId',auth, groupController.removeUser);

router.get('/add-admin/:userId/:gId', auth, groupController.addAdmin);

router.get('/remove-admin/:userId/:gId', auth, groupController.removeAdmin);

router.get('/isAdmin/:groupId/:userId', groupController.getIsAdmin);





module.exports = router;
