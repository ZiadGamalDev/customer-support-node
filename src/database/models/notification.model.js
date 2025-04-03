// notification.model.js in database/models directory

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["message", "system", "chat_assignment", "status_change"],
    },

    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    read: {
      type: Boolean,
      default: false,
    },

    reference: {
     
      model: {
        type: String,
        enum: ["Message", "Chat", "User"],
        required: true,
      },
    
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    },

    
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
