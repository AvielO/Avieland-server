import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";

import usersAPI from "./api/user.js";

const port = process.env.APP_PORT;
const app = express();

//Connect to monoose(or another DB)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/user", usersAPI);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
