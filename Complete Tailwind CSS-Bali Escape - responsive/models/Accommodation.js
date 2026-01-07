const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Accommodation = sequelize.define('Accommodation', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Villa, Guesthouse, Resort, Homestay'
    },
    area: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Ubud, Canggu, Uluwatu, Seminyak, etc'
    },
    priceRange: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '$, $$, $$$'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    rating: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: false,
        defaultValue: 4.5
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
    bookingUrl: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Accommodation;
