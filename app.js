const express= require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const userRouter = require('./route/user');


app.use(userRouter);


sequelize.sync()
.then(() => {
    app.listen(process.env.PORT || 6000);
})
.catch(err => {
    console.error(err);
})


