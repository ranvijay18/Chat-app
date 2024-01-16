const Group = require('../models/group');
const User = require('../models/user');
const Chat = require('../models/chats')



exports.getGroup = async (req,res) => {
    const user = await User.findByPk(req.user.id);
    const groups = await user.getGroups();
    res.status(201).json({groups: groups, user: req.user.id});
}


exports.postGroup = (req, res) => {
        const groupName = req.body.groupName;

        Group.create({
            groupName: groupName
        }).then( async (group) => {
               await group.addUsers(req.params.id);
            res.status(201).json({group: group,status: true, message: "Group is created successfully"});
        })
        .catch(err => {
            res.status(500).json({status: false, message: "Something gone wrong"});
        })
}

exports.getMessages = async (req, res) => {
    const groupId = req.params.id;
    const userId = req.user.id;
    try{
    const group = await Group.findByPk(groupId);
    const chats = await Chat.findAll({
        where:{groupId: group.id},
        include: [{
          model: User,
          attributes: ['username'],
          required: true
        }],
        attributes: ['messages'],
        order: [['createdAt', 'ASC']]
      });

    res.status(201).json({chat: chats, group: group, userId: userId});
    }
    catch(err){
        res.status(404).json("no data found");
    }
    
}

exports.joinGroup = async (req,res)=>{
    
   const group = await Group.findByPk(req.params.id);
    group.addUsers(req.user.id)
    .then(()=>{
        res.status(201).json({status: true})
    })
    .catch((err) => {
        res.status(500).json({status: false})
    })
}