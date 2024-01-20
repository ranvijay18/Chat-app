const Chat = require('../models/chats');
const User = require('../models/user');
const Group = require('../models/group');
const {uploadToS3} = require('../service/s3Services')
const cron = require('node-cron');

cron.schedule('0 0 * * *', async () => {
  try {
    await sequelize.sync();
  
    const oldChats = await Chat.findAll({
      where: {
        createdAt: {
          [Sequelize.Op.lt]: Sequelize.literal('DATE_SUB(NOW(), INTERVAL 1 DAY)'),
        },
      },
    });
  
    await ArchivedChat.bulkCreate(oldChats);
    await Chat.destroy({
      where: {
        id: {
          [Sequelize.Op.in]: oldChats.map((chat) => chat.id),
        },
      },
    });
  
    console.log('Chats archived and deleted successfully.');
  } catch (error) {
    console.error('Error archiving and deleting chats:', error);
  }
});



exports.getNewMessage = async (req,res,next) => {
    try {
      const mesId = req.params.size;
      const groupId = req.params.groupId;
        const newMessage = await Chat.findAll({
          where: {
            [Sequelize.and]: [
              { groupId : groupId },
              { id: { [Op.gt]: mesId } } 
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
       groupId: req.params.groupId,
       mesType: "text"
    })
    .then(message => {
        res.status(201).json({message: message , user: user[0]})
    })
    .catch(err => {
        console.log(err);
    })
}


exports.postFile = async (req,res) => {
  const fileName =new Date() + req.file.originalname
  const mimeType = req.file.mimetype
  const fileData = req.file.buffer
  // const data = await uploadToS3(fileData , fileName);
  // console.log(data);
  const user = await User.findAll({where: {id: req.params.userId}})
  await Chat.create({
    // messages: data.Location,
    messages:"hello",
   userId: req.params.userId,
   groupId: req.params.groupId,
   mesType: mimeType
})
.then(message => {
    res.status(201).json({message: message , user: user[0]})
})
 
}


