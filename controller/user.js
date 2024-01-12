const User = require('../models/user');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const Sib = require('sib-api-v3-sdk');
const Forget = require('../models/forget');
require("dotenv").config();

let testUserId;


async function isExists(emailSearch) {
    const data = await User.findAll({ where: { email: emailSearch } })

    if (data.length > 0) {
        return data[0];
    } else {
        return false;
    }
}

function generateAccessToken(id) {
    return jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY)
}

exports.postUser = async (req, res, next) => {

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const check = await isExists(email);
    console.log(check);

    if (check === false) {

        bcrypt.hash(password, 10, async function (err, hash) {
            await User.create({
                username: username,
                email: email,
                password: hash,
                ispremium: false,
                totalExpenses: 0
            })

        })
        res.status(201).json("Account is successfully created!!!");
    } else {
        res.status(201).json("Email already exists!!!");
    }
}

exports.postLogin = async (req, res, next) => {
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;

    const check = await isExists(email);

    if (check === false) {
        res.status(201).json("Account not found!!!");
    } else {

        bcrypt.compare(password, check.password, function (err, result) {
            if (result == true) {
                res.status(201).json({ status: true, token: generateAccessToken(check.id) });
            } else {
                res.status(201).json({ status: false });
            }
        });
    }

}


exports.postForgetPassword = async (req, res, next) => {
    const email = req.body.email;

    const user = await isExists(email);

    if (user === false) {
        res.status(201).json({ status: false, message: "User not exixts!!!" })
    } else {

        const forget = await Forget.create({
            id: uuidv4(),
            email: email,
            isActive: true,
            userId: user.id
        })
        const link = "http://localhost:4000/password/resetpassword/" + forget.id

        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];

        apiKey.apiKey = process.env.EMAIL_API_KEY;

        const transEmailApi = new Sib.TransactionalEmailsApi()

        const sender = {
            email: "ranvi1800@gmail.com",
            name: "Ranvijay"
        }

        const receivers = [{
            email: email
        }]

        transEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Forget Password Request',
            textContent: 'Click on the link to reset password {{params.link}}',
            params: { link: link }

        }).then(() => {
            res.status(201).json({ status: true });
        }).catch(err => {
            console.log(err);
            res.status(201).json({ status: false });
        })
    }
}


exports.getForget = async (req, res, next) => {
    const uuid = req.params.id
    const user = await Forget.findAll({ where: { id: uuid } })

    const userForget = user[0];
    const isActive = userForget.isActive;

    testUserId = userForget.userId;

    if (isActive == true) {
        userForget.isActive = false;
        await userForget.save({ fields: ['isActive'] });
        res.redirect('http://127.0.0.1:5500/views/reset/reset.html');
    }
}

exports.postResetPassword = async (req, res, next) => {
    const password = req.body.password;

    const users = await User.findAll({ where: { id: testUserId } })
    const user = users[0]

    bcrypt.hash(password, 10, async function (err, hash) {

        user.password = hash;
        await user.save({ fields: ['password'] });
    })

    res.status(201).json("true");
}