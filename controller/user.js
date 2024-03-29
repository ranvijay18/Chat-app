const User = require('../models/user');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const Sib = require('sib-api-v3-sdk');
const Forget = require('../models/forget');
const Group = require('../models/group');
const Sequelize = require('sequelize');
require("dotenv").config();

let testUserId;


async function isExists(emailSearch) {
    const data = await User.findAll({ where: { email: emailSearch } })

    if (data.length > 0) {
        testUserId = data[0].id;
        return data[0];
    } else {
        return false;
    }
}

function generateAccessToken(id, username) {
    return jwt.sign({ userId: id , username: username}, process.env.JWT_SECRET_KEY)
}

exports.postUser = async (req, res, next) => {

    const username = req.body.username;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;

    const check = await isExists(email);
    console.log(check);

    if (check === false) {

        bcrypt.hash(password, 10, async function (err, hash) {
            await User.create({
                username: username,
                email: email,
                phone:phone,
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
                res.status(201).json({ status: true, token: generateAccessToken(check.id, check.username) });
            } else {
                res.status(201).json({ status: false });
            }
        });
    }

}


exports.postForgetPassword = async (req, res, next) => {
    const email = req.body.email;

    const user = await isExists(email);
    testUserId = user.id;

    if (user === false) {
        res.status(201).json({ status: false, message: "User not exixts!!!" })
    } else {

        const forget = await Forget.create({
            id: uuidv4(),
            email: email,
            isActive: true,
            userId: user.id
        })
        const link = "http://13.201.137.165:4000/password/resetpassword/" + forget.id

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
        res.redirect('http://13.201.137.165:4000/views/reset/reset.html');
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

exports.getUser = (req, res) => {
    User.findAll({where: {email: req.params.email}})
    .then(user => {
        res.status(201).json(user[0]);
    })
    .catch(err=> {
        console.log(err);
    })
}

exports.getMember= async (req,res) => {

   const notAdmin = await Group.findByPk(req.params.gId, {
    include: [
        {
            model: User,
            through: {
                where: { isAdmin: false }
            }
        }
    ]
    })

    const admins = await Group.findByPk(req.params.gId, {
        include: [
            {
                model: User,
                through: {
                    where: { isAdmin: true }
                },
            }
        ]
        })

        res.status(201).json({nA : notAdmin, admins: admins});
}
