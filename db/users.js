import User from "../schemas/user.js";
import { v4 as generateID } from "uuid";

export const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

export const getUserByUsername = async (username) => {
  const user = await User.findOne({ username });
  return user;
};

export const createUserDB = async (username, email, password, type) => {
  const userSchema = new User({
    id: generateID(),
    username,
    email,
    password,
    type,
    resources: {
      copper: 0,
      silver: 0,
      gold: 0,
      diamond: 0,
    },
    workers: {
      copper: 5,
      silver: 5,
      gold: 10,
      diamond: 0,
    },
    soliders: 35,
    group: "",
  });
  await userSchema.save();
};
