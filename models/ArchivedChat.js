const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ArchivedChat = sequelize.define('oldchat', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    messages: {
        type: Sequelize.TEXT,
    },
    mesType: {
        type: Sequelize.STRING,
    },
    userId:{
        type: Sequelize.STRING
    },
    groupId:{
        type: Sequelize.STRING
    }
})



module.exports = ArchivedChat;