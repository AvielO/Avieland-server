import User from "../schemas/user.js";
import {
  isUsernameExists,
  isPasswordsSimilar,
  isValidEmail,
} from "../utils/user.js";
import { v4 as generateID } from "uuid";

export const getUser = async (username) => {
  const user = await User.findOne({ username });
  return user;
};

export const isUserCredentialsCorrect = async (username, password) => {
  const user = await User.findOne({ username, password });
  return user ? true : false;
};

export const createUser = async (username, email, password, passwordAgain) => {
  if (await isUsernameExists(username)) return false;
  if (!isPasswordsSimilar(password, passwordAgain)) return false;
  if (!isValidEmail(email)) return false;

  const userSchema = new User({
    id: generateID(),
    username,
    email,
    password,
    resources: {
      copper: 0,
      silver: 0,
      gold: 0,
      diamond: 0,
    },
  });
  await userSchema.save();
};
