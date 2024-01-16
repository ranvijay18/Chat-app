const Chat = require('../models/chats');
const User = require('../models/user');
const Group = require('../models/group');



exports.getNewMessage = async (req,res,next) => {
    try {
      const mesId = req.params.size;
      const groupId = req.params.groupId;
        const newMessage = await Chat.findAll({
          where: {
            [Sequelize.and]: [
              { groupId : groupId },
              { id: { [Op.gt]: mesId } } // Greater than 25
            ]
          },
          include: [{
            model: User,
            attributes: ['username'],
            required: true
          }],
          attributes: ['messages']
        });
     console.log(newMessage[0].user.username);
            res.status(201).json(newMessage[0]);
      } catch (error) {
        
        res.status(404).json({ error: "No new message" });
      }
}



exports.postChats = (req,res,next) => {
    const messages = req.body.mes;
  
    Chat.create({
        messages: messages,
       userId: req.params.id,
       groupId: req.params.groupId
    })
    .then(message => {
        res.status(201).json({message: message})
    })
    .catch(err => {
        console.log(err);
    })
}
