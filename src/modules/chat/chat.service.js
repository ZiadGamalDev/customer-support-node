import { roles } from "../../database/enums/user.enum.js";
import Chat from "../../database/models/chat.model.js";

class ChatService {
  async all(userId) {
    return await Chat.find({
      $or: [{ agentId: userId }, { customerId: userId }],
    })
      .populate("agentId", "id name email image")
      .populate("lastMessage");
  }

  async findOrCreate(sender, receiver) {
    let chat = await Chat.findOne({
      customerId: sender,
      agentId: receiver,
    });

    if (!chat) {
      chat = await Chat.create({
        customerId: sender,
        agentId: receiver,
        title: `Ticket-${Date.now()}`,
        description: "New support ticket",
      });
    }

    return await chat.populate([
      { path: "agentId", select: "id name email image" },
      { path: "lastMessage" },
    ]);
  }

  async resetUnreadCount(userId, chatId) {
    return await Chat.findByIdAndUpdate(
      chatId,
      { $set: { [`unreadCount.${userId}`]: 0 } },
      { new: true }
    )
      .populate("agentId", "id name email image")
      .populate("lastMessage");
  }

  async findUserIdByType(chatId, userType) {
    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error("Chat not found");

    return userType === roles.AGENT ? chat.agentId : chat.customerId;
  }
}

export default new ChatService();
