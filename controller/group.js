const Group = require('../models/group');
const User = require('../models/user');
const Chat = require('../models/chats');
const GroupMember = require('../models/groupMember');



exports.getGroup = async (req,res) => {
    const user = await User.findByPk(req.user.id);
    const groups = await user.getGroups();
    res.status(201).json({groups: groups, user: user});
}


exports.postGroup = (req, res) => {
        const groupName = req.body.groupName;

        Group.create({
            groupName: groupName
        }).then( async (group) => {
               await group.addUsers(req.params.id);

               const gm = await GroupMember.findAll({
                where: {
                    userId : req.params.id,
                    groupId: group.id
                }
               })
            
              const gM = gm[0];
              gM.isAdmin = true;
              gM.save();
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

exports.addNewMember = async(req, res) => {
    // Check if the user is already in the group
    Group.findByPk(req.body.gId)
      .then(group =>group.getUsers())
      .then(users =>{
        if (users.some(user => user.id === req.body.userId)) {
          res.status(201).json("This user already exists!");
        } else {
          // Add the user to the group
          Group.findByPk(req.body.gId)
            .then((group) => {
                group.addUsers(req.body.userId)
                res.status(201).json('User added to the group successfully.');
            })
            .catch(error => {
              console.error('Error adding user to group:', error);
            });
        }
      })
      .catch(error => {
        console.error('Error finding group:', error);
      });
    
}


exports.removeUser = (req, res) => {

Group.findByPk(req.params.gId)
  .then(group =>group.getUsers())
  .then( users =>{
    console.log(users.some(user => user.id === req.params.userId))
    if (users.some(user => user.id === req.params.userId)) {
      res.status(201).json('User is not a member of the group.');
    } else {
      Group.findByPk(req.params.gId)
      .then(group => {
        group.removeUsers([req.params.userId])
        .then(() => {
            res.status(201).json('User removed from the group successfully.');
          })
          .catch(error => {
            console.error('Error removing user from group:', error);
          });
    })
      
        
    }
  })
  .catch(error => {
    console.error('Error finding group:', error);
  });
}


exports.addAdmin= (req,res) => {
    const uId = req.params.userId;
    const gId = req.params.gId;

    GroupMember.findAll({where: {
        userId: uId,
        groupId: gId
    }}).then((gM)=> {

        const newgM = gM[0];
              newgM.isAdmin = true;
              newgM.save();
        res.status(201).json("User is now admin of this group");
    })
}


exports.getIsAdmin = (req,res) => {
    GroupMember.findAll({
        where:{
            userId: req.params.userId,
            groupId: req.params.groupId,
        }
       
    }).then(gM => {
        console.log(">>>>>>>",gM[0].isAdmin)
        if(gM[0].isAdmin){
            res.status(201).json({status:true});
        }else{
            res.status(201).json({status:false});
        }
     
    }).catch(err => {
        res.status(500).json({status:false});
    })
}