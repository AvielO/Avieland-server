import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import mongoose from "mongoose";
import { v4 as generateID } from "uuid";

import { createServer } from "http";
import { Server } from "socket.io";

import authAPI from "./api/auth.js";
import usersAPI from "./api/user.js";
import storeAPI from "./api/store.js";
import reportAPI from "./api/report.js";
import workersAPI from "./api/workers.js";
import solidersAPI from "./api/soliders.js";
import bankAPI from "./api/bank.js";
import chatAPI from "./api/chat.js";

import { createMessage, getChatByParticipants } from "./app/chatActions.js";
import Chat from "./schemas/message.js";

const mongoURL =
  "mongodb+srv://AvielO:1tdKQT3VeDTL7IvD@avieland.zr6f7iy.mongodb.net/?retryWrites=true&w=majority&appName=Avieland";
const port = process.env.APP_PORT;
const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

mongoose.connect(mongoURL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/auth", authAPI);
app.use("/users", usersAPI);
app.use("/store", storeAPI);
app.use("/reports", reportAPI);
app.use("/workers", workersAPI);
app.use("/soliders", solidersAPI);
app.use("/bank", bankAPI);
app.use("/chats", chatAPI);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("leave chat", (room) => {
    socket.leave(room);
    console.log(`User left room: ${room}`);
  });

  socket.on("message sent", async ({ room, message, user }) => {
    const now = new Date();
    const timeOffset = now.getTimezoneOffset() * 60000;
    const localTime = new Date(now.getTime() - timeOffset);

    const messageID = generateID();
    await createMessage(messageID, user, room, message);

    let chat = await getChatByParticipants([user, room]);

    if (chat) {
      chat.messages.push(messageID);
    } else {
      chat = new Chat({
        participants: [user, room],
        messages: [messageID],
      });
    }
    await chat.save();
    io.to(room).emit("message accepted", { user, message, date: localTime });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port || 3000, () => {
  console.log(`Listening on port ${port}`);
});
