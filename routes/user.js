const express = require('express');
const router = express.Router();

const userController = require('../controller/user');

router.post('/user' , userController.postUser);

router.post("/login", userController.postLogin);

router.post('/password/forgetpassword', userController.postForgetPassword);

router.get('/password/resetpassword/:id', userController.getForget);

router.post('/password/newpassword', userController.postResetPassword);




module.exports = router;