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

export const getUniqueSenders = async (sender) => {
  const uniqueReceivers = await Message.aggregate([
    { $match: { $or: [{ sender }, { receiver: sender }] } }, // Filter by sender
    { $sort: { createdAt: -1 } }, // Sort by creation date descending
    {
      $group: {
        _id: "$receiver",
        messageID: { $first: "$messageID" },
        sender: { $first: "$sender" },
        receiver: { $first: "$receiver" },
        content: { $first: "$content" },
        isRead: { $first: "$isRead" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
      },
    },
    { $sort: { createdAt: -1 } }, // Optional: Sort again if you want the final results ordered
  ]);

  const uniqueNamesReceivers = uniqueReceivers.map(
    (uniqueSender) => uniqueSender.receiver
  );

  return uniqueNamesReceivers;
};
