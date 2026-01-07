const sequelize = require('./database');
const User = require('./models/User');

async function promoteToAdmin() {
    try {
        await sequelize.sync();
        const user = await User.findOne({ where: { username: 'testuser2' } });
        if (user) {
            user.role = 'admin';
            await user.save();
            console.log('User testuser2 promoted to admin.');
        } else {
            console.log('User testuser2 not found.');
        }
    } catch (error) {
        console.error('Error promoting user:', error);
    } finally {
        await sequelize.close();
    }
}

promoteToAdmin();
