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

const STEAL_PERCENTAGE = 0.15;

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

  const attackerBonus =
    attacker.type === "attacker"
      ? attackerPowerLevel * 0.15
      : attacker.type === "attdefer"
      ? attackerPowerLevel * 0.075
      : 0;
  const defenderBonus =
    defender.type === "defender"
      ? defenderPowerLevel * 0.15
      : defender.type === "attdefer"
      ? defenderPowerLevel * 0.075
      : 0;

  const attackerUserReport = {
    id: attacker.id,
    name: attacker.username,
    powerLevel: attackerPowerLevel,
    bonusPowerLevel: attackerBonus,
  };

  const defenderUserReport = {
    id: defender.id,
    name: defender.username,
    powerLevel: defenderPowerLevel,
    bonusPowerLevel: defenderBonus,
  };

  let report;
  const reportID = generateID();
  if (attackerPowerLevel > defenderPowerLevel) {
    const stolenCopper = Math.round(
      defender.resources.copper * STEAL_PERCENTAGE
    );
    const stolenSilver = Math.round(
      defender.resources.silver * STEAL_PERCENTAGE
    );
    const stolenGold = Math.round(defender.resources.gold * STEAL_PERCENTAGE);
    report = new Report({
      id: reportID,
      attacker: attackerUserReport,
      defender: defenderUserReport,
      winner: "attacker",
      stolenCopper,
      stolenSilver,
      stolenGold,
    });

    attacker.resources = {
      ...attacker.resources,
      copper: attacker.resources.copper + stolenCopper,
      silver: attacker.resources.silver + stolenSilver,
      gold: attacker.resources.gold + stolenGold,
    };

    defender.resources = {
      ...defender.resources,
      copper: defender.resources.copper - stolenCopper,
      silver: defender.resources.silver - stolenSilver,
      gold: defender.resources.gold - stolenGold,
    };

    await attacker.save();
    await defender.save();
  } else {
    report = new Report({
      id: reportID,
      attacker: attackerUserReport,
      defender: defenderUserReport,
      winner: "defender",
    });
  }

  await report.save();

  return [reportID, attacker.resources];
};
