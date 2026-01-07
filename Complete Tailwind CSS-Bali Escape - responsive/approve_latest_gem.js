const Destination = require('./models/Destination');

async function approveLatestGem() {
    try {
        const latestGem = await Destination.findOne({
            order: [['createdAt', 'DESC']]
        });

        if (latestGem) {
            latestGem.status = 'approved';
            await latestGem.save();
            console.log(`Approved gem: ${latestGem.title} (ID: ${latestGem.id})`);
        } else {
            console.log('No gems found.');
        }
    } catch (error) {
        console.error('Error approving gem:', error);
    }
}

approveLatestGem();
