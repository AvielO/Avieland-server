import {
  isUsernameExists,
  isPasswordsSimilar,
  isValidEmail,
} from "../utils/user.js";
import {
  formatUserData,
  convertDbMapToDict,
  calculateAttackPowerLevel,
  calculateDefensePowerLevel,
} from "../utils/general.js";
import { getAllUsers, createUserDB, getUserByUsername } from "../db/users.js";

export const getLeaderboardUsers = async () => {
  const users = await getAllUsers();
  const formatedUsers = formatUserData(users);
  return formatedUsers;
};

export const getUserInfo = async (username) => {
  const user = await getUserByUsername(username);
  const formatedUsers = formatUserData([user]);
  return formatedUsers[0];
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

export const attackUser = async (attackerUsername, targetUsername) => {
  const attacker = await getUserByUsername(attackerUsername);
  const target = await getUserByUsername(targetUsername);

  const attackerWeaponDict = convertDbMapToDict(attacker.weapons);
  const targetWeaponDict = convertDbMapToDict(target.weapons);

  const attackerPowerLevel = calculateAttackPowerLevel(attackerWeaponDict);
  const targetPowerLevel = calculateDefensePowerLevel(targetWeaponDict);

  //Step of bonus Calculate

  

  return "123";
};
