const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Chat = sequelize.define('chat', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    messages: {
        type: Sequelize.TEXT,
    },
    mesType: {
        type: Sequelize.STRING,
    }
})



module.exports = Chat;