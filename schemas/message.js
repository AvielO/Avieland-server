import mongoose, { Schema } from "mongoose";

export const messageSchema = new Schema(
  {
    messageID: { type: String, required: true },
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export { Message };
