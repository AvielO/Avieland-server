import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import mongoose, { mongo } from "mongoose";

import usersAPI from "./api/user.js";

const mongoURL =
  "mongodb+srv://AvielO:1tdKQT3VeDTL7IvD@avieland.zr6f7iy.mongodb.net/?retryWrites=true&w=majority&appName=Avieland";
const port = process.env.APP_PORT;
const app = express();

mongoose.connect(mongoURL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/user", usersAPI);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
