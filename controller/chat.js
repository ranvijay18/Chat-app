const Chat = require('../models/chats');
const User = require('../models/user');


let userId;
let username;

exports.getChats = async (req, res,next) => {
  userId = req.user.id;
  username = req.user.username;
    const chats = await Chat.findAll({
        include: [{
          model: User,
          required: true
        }],
        attributes: ['messages']
      }).then(message => {
        res.status(201).json(message);
      })
}



exports.postChats = (req,res,next) => {
    const messages = req.body.mes;

    Chat.create({
        messages: messages,
        userId: userId
    })
    .then(message => {
        res.status(201).json({message: message , username: username})
    })
    .catch(err => {
        console.log(err);
    })
}
