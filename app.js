const express= require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');

const app = express();
app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true
}))

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');

const User = require('./models/user');
const Chat = require('./models/chats');


app.use(userRouter);
app.use(chatRouter);


User.hasMany(Chat);
Chat.belongsTo(User);



sequelize.sync()
.then(() => {
    app.listen(process.env.PORT || 4000);
})
.catch(err => {
    console.error(err);
})


