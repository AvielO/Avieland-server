import {
  isUsernameExists,
  isPasswordsSimilar,
  isValidEmail,
} from "../utils/user.js";
import { formatUserData } from "../utils/general.js";
import { getAllUsers, createUserDB } from "../db/users.js";

export const getLeaderboardUsers = async () => {
  const users = await getAllUsers();
  const formatedUsers = formatUserData(users);
  return formatedUsers;
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

  await createUserDB(username, email, password, type);
};
