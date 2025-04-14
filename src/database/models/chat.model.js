import { Schema, model } from "mongoose";
import { priorities, statuses } from "../enums/chat.enum.js";

const chatSchema = new Schema(
  {
    agentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: () => `Ticket-${Date.now()}`,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      default: "No description provided",
    },
    status: {
      type: String,
      enum: Object.values(statuses),
      default: statuses.NEW,
      index: true,
    },
    priority: {
      type: String,
      enum: Object.values(priorities),
      default: "medium",
      index: true,
    },
    lastMessageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    agentUnreadCount: {
      type: Number,
      default: 0,
    },
    customerUnreadCount: {
      type: Number,
      default: 0,
    },

    previousAgents: [
      {
        agent: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        assignedAt: Date,
        unassignedAt: Date,
      },
    ],
    statusHistory: [
      {
        status: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        changedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    notes: [
      {
        content: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
        createdBy: {
          type: Schema.Types.ObjectId,
          ref: "Agent",
        },
      },
    ],
  },
  { timestamps: true }
);

const Chat = model("Chat", chatSchema);

export default Chat;
