import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import mongoose from "mongoose";

import authAPI from "./api/auth.js";
import usersAPI from "./api/user.js";
import storeAPI from "./api/store.js";
import reportAPI from "./api/report.js";
import workersAPI from "./api/workers.js";

const mongoURL =
  "mongodb+srv://AvielO:1tdKQT3VeDTL7IvD@avieland.zr6f7iy.mongodb.net/?retryWrites=true&w=majority&appName=Avieland";
const port = process.env.APP_PORT;
const app = express();

mongoose.connect(mongoURL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/auth", authAPI);
app.use("/users", usersAPI);
app.use("/store", storeAPI);
app.use("/reports", reportAPI);
app.use("/workers", workersAPI);

app.listen(port || 3000, () => {
  console.log(`Listening on port ${port}`);
});
