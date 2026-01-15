const sequelize = require('./database');

async function addColumn() {
    try {
        await sequelize.query('ALTER TABLE Destinations ADD COLUMN rejectionReason TEXT;');
        console.log('Column added successfully');
    } catch (error) {
        console.error('Error adding column (might already exist):', error.message);
    }
}

addColumn();
