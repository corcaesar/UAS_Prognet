const sequelize = require('./database');
const Destination = require('./models/Destination');

async function approveGem() {
    try {
        await sequelize.authenticate();
        const gem = await Destination.findOne({ order: [['createdAt', 'DESC']] });
        if (gem) {
            gem.status = 'approved';
            await gem.save();
            console.log(`Approved gem: ${gem.title}`);
        } else {
            console.log('No gems found.');
        }
    } catch (error) {
        console.error('Error approving gem:', error);
    } finally {
        await sequelize.close();
    }
}

approveGem();
