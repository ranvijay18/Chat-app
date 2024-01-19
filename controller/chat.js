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



exports.postChats = async (req,res,next) => {
    const messages = req.body.mes;
    const user = await User.findAll({where: {id: req.params.id}})
  
    Chat.create({
        messages: messages,
       userId: req.params.id,
       groupId: req.params.groupId
    })
    .then(message => {
        res.status(201).json({message: message , user: user[0]})
    })
    .catch(err => {
        console.log(err);
    })
}
