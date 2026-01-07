const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Guide = sequelize.define('Guide', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Culture, Food, Travel Tips, Planning, Sustainable Travel'
    },
    excerpt: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Full HTML content'
    },
    readTime: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '5 min read'
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Guide;
