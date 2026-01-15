const Destination = require('./models/Destination');

async function debugGem8() {
    try {
        const gem = await Destination.findByPk(8);
        if (gem) {
            console.log(JSON.stringify(gem.toJSON(), null, 2));
        } else {
            console.log('Gem 8 not found');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

debugGem8();
