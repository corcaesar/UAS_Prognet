const Accommodation = require('./models/Accommodation');
const sequelize = require('./database');

async function checkData() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const count = await Accommodation.count();
        console.log(`Total Accommodations: ${count}`);

        const items = await Accommodation.findAll();
        console.log(JSON.stringify(items, null, 2));

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

checkData();
