import Chat from "../models/chat.model.js";

const chatSeeder = async () => {
    try {
        await Chat.deleteMany({});
        
        console.log('Chats seeded successfully');
    } catch (error) {
        console.error('Chats seeding error:', error);
    }
};

export default chatSeeder;
