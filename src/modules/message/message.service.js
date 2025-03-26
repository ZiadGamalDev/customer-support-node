import Message from "../../database/models/message.model.js";
import Chat from "../../database/models/chat.model.js";
import { statuses } from "../../database/enums/message.enum.js";

class MessageService {
  async all(chatId) {
    return await Message.find({ chatId })
      .sort({ createdAt: 1 });
  }

  async create({ chatId, senderId, content }) {
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) throw new Error("Chat not found");

      // Determine receiver based on sender
      const receiverId =
        senderId === chat.agentId.toString() ? chat.customerId : chat.agentId;

      // Create message
      const message = await Message.create({
        chatId,
        senderId,
        receiverId,
        content,
        status: statuses.SENT,
      });

      // Update chat's last message and unread count
      await Chat.findByIdAndUpdate(chatId, {
        lastMessage: message._id,
        [`unreadCount.${receiverId}`]:
          (chat.unreadCount.get(receiverId) || 0) + 1,
      });

      return await message.populate([
        { path: "senderId", select: "name email image" },
        { path: "receiverId", select: "name email image" },
      ]);
    } catch (error) {
      throw new Error(`Failed to create message: ${error.message}`);
    }
  }

  async updateStatus(messageId, status) {
    const message = await Message.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    )
      .populate("senderId", "name email image")
      .populate("receiverId", "name email image");

    return message;
  }
}

export default new MessageService();
