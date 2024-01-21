const Group = require('../models/group');
const User = require('../models/user');
const Chat = require('../models/chats');
const GroupMember = require('../models/groupMember');
const sequelize = require('../util/database');



exports.getGroup = async (req,res) => {
    const user = await User.findByPk(req.user.id);
    const groups = await user.getGroups();
    res.status(201).json({groups: groups, user: user});
}


exports.postGroup = async (req, res) => {
  try {
    await sequelize.transaction(async (t) => {
      const group = await Group.create({
        groupName: req.body.groupName,
      }, { transaction: t });

      await group.addUsers(req.params.id, { transaction: t });

      const gm = await GroupMember.findOne({
        where: { userId: req.params.id, groupId: group.id },
        transaction: t,
      });

      gm.isAdmin = true;
      await gm.save({ transaction: t });

      res.status(201).json({ group: group, status: true, message: "Group is created successfully" });
    });
  } catch (err) {
    console.error('Error creating group:', err);
    res.status(500).json({ status: false, message: "Something gone wrong" });
  }
};

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
        attributes: ['messages','mesType'],
        order: [['createdAt', 'ASC']]
      });

    res.status(201).json({chat: chats, group: group, userId: userId , username: req.user.username});
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


exports.addNewMember = async (req, res) => {
  try {
    await sequelize.transaction(async (t) => {
      const group = await Group.findByPk(req.body.gId, { transaction: t });
      const users = await group.getUsers({ transaction: t });

      if (users.some(user => user.id === req.body.userId)) {
        return res.status(201).json({ message: "This user already exists!", status: false });
      }

      await group.addUsers(req.body.userId, { transaction: t });

      res.status(201).json({ message: 'User added to the group successfully.', status: true });
    });
  } catch (err) {
    console.error('Error adding user to group:', err);
    res.status(500).json({ error: 'Failed to add user to group' });
  }
};

exports.removeUser = async (req, res) => {
  try {
    await sequelize.transaction(async (t) => {
      const group = await Group.findByPk(req.params.gId, { transaction: t });
      const users = await group.getUsers({ transaction: t });

      if (users.some(user => user.id === req.params.userId)) {
        return res.status(201).json('User is not a member of the group.');
      }

      await group.removeUsers([req.params.userId], { transaction: t });
      res.status(201).json('User removed from the group successfully.');
    });
  } catch (err) {
    console.error('Error removing user from group:', err);
    res.status(500).json({ error: 'Failed to remove user' });
  }
};



exports.addAdmin= async (req,res) => {
    const uId = req.params.userId;
    const gId = req.params.gId;

    await GroupMember.findAll({where: {
        userId: uId,
        groupId: gId
    }}).then((gM)=> {

        const newgM = gM[0];
              newgM.isAdmin = true;
              newgM.save();
        res.status(201).json("User is now admin of this group");
    }).catch(err => {
      res.status(500).json("Something Gone Wrong");
    })
}


exports.getIsAdmin = async (req,res) => {
    await GroupMember.findAll({
        where:{
            userId: req.params.userId,
            groupId: req.params.groupId,
        }
       
    }).then(gM => {
        if(gM[0].isAdmin){
            res.status(201).json({status:true});
        }else{
            res.status(201).json({status:false});
        }
     
    }).catch(err => {
        res.status(500).json({status:false});
    })
}


exports.removeAdmin = async (req, res) =>  {
  const uId = req.params.userId;
  const gId = req.params.gId;

 await GroupMember.findAll({where: {
      userId: uId,
      groupId: gId
  }}).then((gM)=> {

      const newgM = gM[0];
            newgM.isAdmin = false;
            newgM.save();
      res.status(201).json("User is remove as admin of this group");
  }).catch(err => {
    res.status(500).json("Something gone wrong");
  })
}