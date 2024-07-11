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

const chatSchema = new Schema(
  {
    participants: [{ type: String, required: true }],
    messages: [{ type: String, required: true }],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
const Chat = mongoose.model("Chat", chatSchema);

export { Message };
export default Chat;
