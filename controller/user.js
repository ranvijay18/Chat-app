const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

let testUserId;


async function isExists(emailSearch){
   const data = await User.findAll({where: {email : emailSearch}})

   if(data.length > 0){
    return data[0];
   }else{
    return false;
   }
}

function generateAccessToken(id, premium){
    return jwt.sign({userId : id, ispremium: premium} , process.env.JWT_SECRET_KEY)
}

exports.postUser = async (req,res,next) => {
   
    const username = req.body.username;
const email = req.body.email;
const phone = req.body.phone;
const password = req.body.password;

const check = await isExists(email);
console.log(check);

if(check === false){

bcrypt.hash(password, 10, async function(err, hash) {
   await User.create({
        username : username,
        email: email,
        phone: phone,
        password: hash,
        ispremium: false,
        totalExpenses: 0
    })
    
})
res.status(201).json( "Account is successfully created!!!");
}else{
res.status(201).json("Email already exists!!!");
}
}