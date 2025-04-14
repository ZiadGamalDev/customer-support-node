import Notification from "../models/notification.model.js";

const notificationSeeder = async () => {
    try {
        await Notification.deleteMany({});
        
        console.log('Notifications seeded successfully');
    } catch (error) {
        console.error('Notifications seeding error:', error);
    }
};

export default notificationSeeder;
