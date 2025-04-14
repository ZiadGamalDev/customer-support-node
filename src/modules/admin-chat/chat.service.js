import { statuses } from "../../database/enums/chat.enum.js";
import Chat from "../../database/models/chat.model.js";
import { _reassignChatToAgent } from "../../services/helpers.js";
import updateStatus from "../../services/status.js";
import MessageService from "../message/message.service.js";

class ChatService {
  async all() {
    return await Chat.find({});
  }

  async findById(chatId) {
    return await Chat.findById(chatId).populate('lastMessageId', 'content senderId receiverId createdAt');
  }

  async update(chatId, { title, description, agentId, status }) {
    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error("Chat not found");

    if (agentId) await _reassignChatToAgent(chat, agentId);
    if (status) await updateStatus.chat(chat, status);
    if (title) chat.title = title;
    if (description) chat.description = description;

    return await chat.save();
  }

  async delete(chatId) {
    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error("Chat not found");

    await updateStatus.chat(chat, statuses.RESOLVED);
    await MessageService.deleteByChatId(chat._id);
    await chat.deleteOne();
  }
}

export default new ChatService();
