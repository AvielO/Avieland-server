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

import { createMessage } from "./app/chatActions.js";
import Message from "./schemas/message.js";
import { UnorderedBulkOperation } from "mongodb";

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

const usersInRoom = {};

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("listen myself", async ({ username }) => {
    socket.join(username);
    if (!usersInRoom[username]) {
      usersInRoom[username] = {};
    }
    if (username !== undefined) usersInRoom[username][socket.id] = username;
  });

  socket.on("join chat", async ({ room, username }) => {
    socket.join(room);
    if (!usersInRoom[room] && room !== undefined) {
      usersInRoom[room] = {};
    }
    if (room !== undefined) usersInRoom[room][socket.id] = username;

    const messages = await Message.find({
      $or: [
        { sender: username, receiver: room },
        { sender: room, receiver: username },
      ],
    }).sort({ updatedAt: 1 });
    io.to(socket.id).emit("previous messages", { messages });
  });

  socket.on("leave chat", (room) => {
    socket.leave(room);
    if (usersInRoom[room]) {
      delete usersInRoom[room][socket.id]; // Remove user from tracking
    }
  });

  socket.on("message sent", async ({ room, message, user }) => {
    const now = new Date();
    const timeOffset = now.getTimezoneOffset() * 60000;
    const localTime = new Date(now.getTime() - timeOffset);

    const messageID = generateID();
    await createMessage(messageID, user, room, message);

    const innerKey = Object.keys(usersInRoom[room]).find(
      (innerKey) => usersInRoom[room][innerKey] === room
    );
    if (innerKey) {
      io.to(innerKey).emit("message accepted", {
        sender: user,
        content: message,
        createdAt: localTime,
      });
    }

    io.to(socket.id).emit("message accepted", {
      sender: user,
      content: message,
      createdAt: localTime,
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port || 3000, () => {
  console.log(`Listening on port ${port}`);
});
