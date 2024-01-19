const express= require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const path = require('path');
const app = express();
app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
}));

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



// io.on('connection', socket => {
//     socket.on('new-user', name => {
//       users[socket.id] = name
//       socket.broadcast.emit('user-connected', name)
//     })
//     socket.on('send-chat-message', message => {
//       socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
//     })
//     socket.on('disconnect', () => {
//       socket.broadcast.emit('user-disconnected', users[socket.id])
//       delete users[socket.id]
//     })
//   })



User.hasMany(Chat);
Chat.belongsTo(User);

Group.hasMany(Chat);
Chat.belongsTo(Group);

User.belongsToMany(Group, { through: GroupMember });
Group.belongsToMany(User, { through: GroupMember });


sequelize.sync()
.then(() => {
  server= app.listen(4000)
  const users = {}

    const io = require('socket.io')(server);
    io.on('connection', socket => {
      socket.on('username', user=> {
        users[socket.id] = user
        
        socket.broadcast.emit('user-connected', user)
      })

      socket.on('join-room', room => {
        socket.join(room);
        socket.broadcast.emit('join-mes',{ user: users[socket.id], room: room});
      })
      socket.on('new-message', (message,room) => {
        console.log(message);
        socket.broadcast.emit('chat-message', { message: message, user: users[socket.id] ,room: room})
      })

      socket.on("upload" , (mes,room) => {
      socket.broadcast.emit("chat-file", {message:mes, user:users[socket.id],room: room})
      })
    })
    // app.listen(process.env.PORT || 4000);
})
.catch(err => {
    console.error(err);
})





