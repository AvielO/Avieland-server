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
import Report from "../schemas/report.js";
import { v4 as generateID } from "uuid";

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
  const defender = await getUserByUsername(targetUsername);

  const attackerWeaponDict = convertDbMapToDict(attacker.weapons);
  const defenderWeaponDict = convertDbMapToDict(defender.weapons);

  const attackerPowerLevel = calculateAttackPowerLevel(attackerWeaponDict);
  const defenderPowerLevel = calculateDefensePowerLevel(defenderWeaponDict);

  //TODO: Step of bonus Calculate

  const attackerUserReport = {
    id: attacker.id,
    name: attacker.username,
    powerLevel: attackerPowerLevel,
    bonusPowerLevel: 0,
  };

  const defenderUserReport = {
    id: defender.id,
    name: defender.username,
    powerLevel: defenderPowerLevel,
    bonusPowerLevel: 0,
  };

  let report;
  const reportID = generateID();
  if (attackerPowerLevel > defenderPowerLevel) {
    //TODO: Calculate stolen resources
    report = new Report({
      id: reportID,
      attacker: attackerUserReport,
      defender: defenderUserReport,
      winner: "attacker",
      stolenCopper: 250,
      stolenSilver: 250,
      stolenGold: 250,
    });
    //TODO: Decrease Defender resources
    //TODO: Increase Attacker Resources
  } else {
    report = new Report({
      id: reportID,
      attacker: attackerUserReport,
      defender: defenderUserReport,
      winner: "defender",
    });
  }
  await report.save();

  return reportID;
};
