import Message from "../models/message.model.js";

const messageSeeder = async () => {
    try {
        await Message.deleteMany({});
        
        console.log('Messages seeded successfully');
    } catch (error) {
        console.error('Messages seeding error:', error);
    }
};

export default messageSeeder;
