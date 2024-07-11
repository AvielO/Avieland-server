import Chat, { Message } from "../schemas/message.js";

export const createMessage = async (messageID, sender, receiver, content) => {
  const message = new Message({
    messageID,
    sender,
    receiver,
    content,
  });
  await message.save();
};

export const getChatByParticipants = async (participants) => {
  const chat = await Chat.findOne({
    participants: { $all: participants },
  }).populate("messages");
  return chat;
};
