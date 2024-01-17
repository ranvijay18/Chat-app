const express = require('express');
const router = express.Router();

const userController = require('../controller/user');

const {auth} = require('../middleware/auth');

router.post('/user' , userController.postUser);

router.post("/login", userController.postLogin);

router.post('/password/forgetpassword', userController.postForgetPassword);

router.get('/password/resetpassword/:id', userController.getForget);

router.post('/password/newpassword', userController.postResetPassword);

router.get('/get-user/:email',auth,userController.getUser);


router.get('/get-member/:gId', auth, userController.getMember);




module.exports = router;