import User from "../schemas/user.js";
import {
  isUsernameExists,
  isPasswordsSimilar,
  isValidEmail,
} from "../utils/user.js";
import { sumWorkers } from "../utils/general.js";
import { v4 as generateID } from "uuid";

export const getUser = async (username) => {
  const user = await User.findOne({ username });
  return user;
};

//In the future, logic + DB need to be seperated
export const getUsers = async () => {
  const users = await User.find();

  const parsedUsers = users.map((user) => {
    const workersAmount = sumWorkers(user.workers);
    return {
      id: user.id,
      username: user.username,
      type: user.type,
      gold: user.resources.gold,
      workers: workersAmount,
      soliders: user.soliders,
      group: user.group,
    };
  });
  return parsedUsers;
};

export const createUser = async (
  username,
  email,
  password,
  passwordAgain,
  type
) => {
  if (await isUsernameExists(username)) return false;
  if (!isPasswordsSimilar(password, passwordAgain)) return false;
  if (!isValidEmail(email)) return false;
  if (!type) return false;

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
