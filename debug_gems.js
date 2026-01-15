const sequelize = require('./database');
const Destination = require('./models/Destination');

async function listGems() {
    try {
        await sequelize.authenticate();
        const gems = await Destination.findAll();
        console.log('All gems:', JSON.stringify(gems.map(g => ({ id: g.id, title: g.title, status: g.status })), null, 2));
    } catch (error) {
        console.error('Error listing gems:', error);
    } finally {
        await sequelize.close();
    }
}

listGems();
