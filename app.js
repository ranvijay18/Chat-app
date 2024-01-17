const express= require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const path = require('path');

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
}))

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');
const groupRouter = require('./routes/group');

const User = require('./models/user');
const Chat = require('./models/chats');
const Group = require('./models/group');
const GroupMember = require('./models/groupMember')



app.use(userRouter);
app.use(chatRouter);
app.use(groupRouter);
app.use((req, res)=> {
    res.sendFile(path.join(__dirname, `views/${req.url}`))
})



User.hasMany(Chat);
Chat.belongsTo(User);

Group.hasMany(Chat);
Chat.belongsTo(Group);

User.belongsToMany(Group, { through: GroupMember });
Group.belongsToMany(User, { through: GroupMember });


sequelize.sync()
.then(() => {
    app.listen(process.env.PORT || 4000);
})
.catch(err => {
    console.error(err);
})





