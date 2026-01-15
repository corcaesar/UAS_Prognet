const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user' // 'admin' or 'user'
    },
    points: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = User;
