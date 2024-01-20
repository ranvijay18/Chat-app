const Chat = require('../models/chats');
const User = require('../models/user');
const Group = require('../models/group');
const {uploadToS3} = require('../service/s3Services')
const cron = require('node-cron');
const ArchivedChat = require('../models/ArchivedChat');
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

cron.schedule('* * * * *', async () => {

    const oldChats = await Chat.findAll({
      where: {
        createdAt: {
          [Sequelize.Op.lt]: Sequelize.literal('DATE_SUB(NOW(), INTERVAL 1 DAY)'),
        },
      },
    });

    oldChats.forEach(async(ele) => {
      await ArchivedChat.create({
        id: ele.id,
        messages: ele.messages,
        mesType: ele.mesType,
        userId: ele.userId,
        groupId: ele.groupId
      })
      await Chat.destroy({
        where: {
          id: ele.id
        },
      });
    })
      
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

  try{
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
}).catch(err => {
  console.log(err)
})
  }catch(err){
    console.log(err);
  }
 
}


