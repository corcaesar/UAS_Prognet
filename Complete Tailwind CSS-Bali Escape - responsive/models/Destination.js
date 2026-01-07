const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Destination = sequelize.define('Destination', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending' // 'pending', 'approved', 'rejected'
    },
    submitterName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    area: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    longDescription: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    hours: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tips: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    mapUrl: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Destination;
