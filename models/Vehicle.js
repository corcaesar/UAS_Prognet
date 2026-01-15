const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Vehicle = sequelize.define('Vehicle', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    area: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Ubud, Canggu, Uluwatu, Seminyak, etc'
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Scooter, Car, Scooter & Car'
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'e.g., 50,000 IDR/day or From 60,000 IDR/day'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    contact: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Phone number'
    },
    whatsapp: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'WhatsApp link'
    },
    features: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('features');
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            this.setDataValue('features', JSON.stringify(value));
        }
    },
    rating: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: false,
        defaultValue: 4.5
    }
}, {
    timestamps: true
});

module.exports = Vehicle;
