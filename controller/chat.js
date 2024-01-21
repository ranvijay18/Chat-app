const Chat = require('../models/chats');
const User = require('../models/user');
const Group = require('../models/group');
const {uploadToS3} = require('../service/s3Services')
const cron = require('node-cron');
const ArchivedChat = require('../models/ArchivedChat');
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

cron.schedule('0 0 * * *', async () => {
  try {
    await sequelize.transaction(async (t) => {
      const oldChats = await Chat.findAll({
        where: {
          createdAt: {
            [Sequelize.Op.lt]: Sequelize.literal('DATE_SUB(NOW(), INTERVAL 1 DAY)'),
          },
        },
        transaction: t, 
      });

      await Promise.all(
        oldChats.map(async (ele) => {
          await ArchivedChat.create({
            id: ele.id,
            messages: ele.messages,
            mesType: ele.mesType,
            userId: ele.userId,
            groupId: ele.groupId,
          }, { transaction: t }); 
          await Chat.destroy({
            where: { id: ele.id },
            transaction: t, 
          });
        })
      );
    });
  } catch (error) {
    console.error('Error archiving chats:', error);
  }
});



// exports.getNewMessage = async (req,res,next) => {
//     try {
//       const mesId = req.params.size;
//       const groupId = req.params.groupId;
//         const newMessage = await Chat.findAll({
//           where: {
//             [Sequelize.and]: [
//               { groupId : groupId },
//               { id: { [Op.gt]: mesId } } 
//             ]
//           },
//           include: [{
//             model: User,
//             attributes: ['username'],
//             required: true
//           }],
//           attributes: ['messages']
//         });
//             res.status(201).json(newMessage[0]);
//       } catch (error) {
        
//         res.status(404).json({ error: "No new message" });
//       }
// }



exports.postChats = async (req, res, next) => {
  try {
    await sequelize.transaction(async (t) => {
      const messages = req.body.mes;
      const user = await User.findAll({ where: { id: req.params.id } });

      const chat = await Chat.create({
        messages: messages,
        userId: req.params.id,
        groupId: req.params.groupId,
        mesType: "text",
      }, { transaction: t });

      res.status(201).json({ message: chat, user: user[0] });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create chat' });
  }
};


exports.postFile = async (req, res) => {
  try {
    await sequelize.transaction(async (t) => {
      const fileName = new Date() + req.file.originalname;
      const mimeType = req.file.mimetype;
      const fileData = req.file.buffer;
      
      const data = await uploadToS3(fileData, fileName, t); 

      const user = await User.findAll({ where: { id: req.params.userId } }, { transaction: t });

      const chat = await Chat.create({
        messages: data.Location, 
        userId: req.params.userId,
        groupId: req.params.groupId,
        mesType: mimeType,
      }, { transaction: t });

      res.status(201).json({ message: chat, user: user[0] });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload file and create chat' });
  }
};

