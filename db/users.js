import User from "../schemas/user.js";
import { v4 as generateID } from "uuid";

export const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

export const getUsersByPage = async (page, limit = 10) => {
  const skip = (page - 1) * limit;
  const users = await User.find().skip(skip).limit(limit);
  return users;
};

export const getPagesAmount = async () => {
  const usersInPage = 10;
  const totalUsers = await User.countDocuments();
  const totalPages = Math.ceil(totalUsers / usersInPage);
  return totalPages;
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
    weapons: {},
    bank: {
      copper: 0,
      silver: 0,
      gold: 0,
      diamond: 0,
    },
    soliders: 35,
    group: "",
  });
  await userSchema.save();
};
