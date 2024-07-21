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

import { calculateTimeUntilNextFiveMinute } from "./utils/general.js";
import { getAllUsers, getUserByUsername } from "./db/users.js";
import User from "./schemas/user.js";

import cookieParser from "cookie-parser";
import { authMiddleware } from "./utils/authMiddleware.js";
import { authSocketMiddleware } from "./utils/authSocketMiddleware.js"; // Import the new socket auth middleware

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
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Replace with your frontend origin
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.use("/auth", authAPI);
app.use("/users", usersAPI);
app.use("/store", authMiddleware, storeAPI);
app.use("/reports", authMiddleware, reportAPI);
app.use("/workers", authMiddleware, workersAPI);
app.use("/soliders", authMiddleware, solidersAPI);
app.use("/bank", authMiddleware, bankAPI);
app.use("/chats", authMiddleware, chatAPI);

const usersInRoom = {};

const socketIDToUser = {};
const userToSocketID = {};

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("listen myself", async ({ username }) => {
    socket.join(username);

    userToSocketID[username] = socket.id;
    socketIDToUser[socket.id] = username;

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
    console.log(room, socket.id);
    console.log(usersInRoom[room]);
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
    const username = socketIDToUser[socket.id];

    delete socketIDToUser[socket.id];
    delete userToSocketID[username];

    Object.keys(usersInRoom).forEach((key) => {
      delete usersInRoom[key][socket.id];
    });
    console.log("user disconnected");
  });
});

let timeUntilNextFive = calculateTimeUntilNextFiveMinute();
setInterval(async () => {
  if (timeUntilNextFive > 0) {
    timeUntilNextFive--;
  } else {
    const users = await getAllUsers();
    const updatedUserState = users.map((user) => {
      const {
        copper: copperWorkers,
        silver: silverWorkers,
        gold: goldWorkers,
      } = user.workers;

      const cooperToAdd = +copperWorkers * 5;
      const silverToAdd = +silverWorkers * 5;
      const goldToAdd = +goldWorkers * 5;

      user.resources.copper += cooperToAdd;
      user.resources.silver += silverToAdd;
      user.resources.gold += goldToAdd;

      return {
        updateOne: {
          filter: { _id: user._id },
          update: { $set: user },
        },
      };
    });

    await User.bulkWrite(updatedUserState);

    Object.keys(userToSocketID).forEach(async (username) => {
      const user = await getUserByUsername(username);
      io.to(userToSocketID[username]).emit("update resources", {
        copper: user.resources.copper,
        silver: user.resources.silver,
        gold: user.resources.gold,
        diamond: user.resources.diamond,
      });
    });

    timeUntilNextFive = calculateTimeUntilNextFiveMinute();
  }
}, 1000);

server.listen(port || 17436, () => {
  console.log(`Listening on port ${port}`);
});
