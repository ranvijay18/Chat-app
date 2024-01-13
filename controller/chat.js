const Chat = require('../models/chats');



exports.postChats = (req,res,next) => {
    const messages = req.body.mes;

    Chat.create({
        messages: messages,
        userId: req.user.id
    })
    .then(message => {
        res.status(201).json({message: message})
    })
    .catch(err => {
        console.log(err);
    })
}