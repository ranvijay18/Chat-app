const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Forget = sequelize.define('ForgetPasswordRequest', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    isActive: {
        type: Sequelize.BOOLEAN,
    }
})

module.exports = Forget;
