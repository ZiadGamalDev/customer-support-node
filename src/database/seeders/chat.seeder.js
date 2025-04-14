import { priorities, statuses } from "../enums/chat.enum.js";
import Chat from "../models/chat.model.js";

const chats = [
    {
        agentId: null,
        customerId: "67bef377acc3a71c30892e61",
        title: "Issue with product delivery",
        description: "The customer has reported an issue with the delivery of their product.",
        status: statuses.NEW,
        priority: priorities.MEDIUM,
        lastMessageId: null,
        agentUnreadCount: 0,
        customerUnreadCount: 0,
    },
];

const chatSeeder = async () => {
    try {
        await Chat.deleteMany({});
        await Chat.insertMany(chats);

        console.log('Chats seeded successfully');
    } catch (error) {
        console.error('Chats seeding error:', error);
    }
};

export default chatSeeder;
