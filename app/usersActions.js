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
import { getReportsByUsername } from "../db/reports.js";
import {
  resourceTranslationMap,
  workersResourcesMap,
} from "../utils/mapping.js";

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

  const attackerPowerLevel = calculateAttackPowerLevel(
    attackerWeaponDict,
    attacker.soliders
  );
  const defenderPowerLevel = calculateDefensePowerLevel(
    defenderWeaponDict,
    defender.soliders
  );

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

export const getUserReports = async (username) => {
  const user = await getUserByUsername(username);
  if (!user) return;

  const reports = await getReportsByUsername(username);
  return reports;
};

export const getUserWithExtraInfo = async (username) => {
  const userWithExtraDetails = {};
  const user = await getUserByUsername(username);
  if (!user) return;
  const { resources, weapons, soliders, bank, workers } = user.toObject();

  //Workers
  const formattedResources = Object.keys(workers)
    .map((key) => {
      if (workersResourcesMap[key]) {
        return {
          name: workersResourcesMap[key],
          value: workers[key],
        };
      }
    })
    .filter((item) => item !== undefined);

  //PlayerPowerDistribution
  const weaponDict = convertDbMapToDict(weapons);
  const attackPowerLevel = calculateAttackPowerLevel(weaponDict, soliders);
  const defensePowerLevel = calculateDefensePowerLevel(weaponDict, soliders);
  const userPowerLevel = [
    {
      name: "כוח התקפי",
      value: attackPowerLevel,
    },
    {
      name: "כוח הגנתי",
      value: defensePowerLevel,
    },
  ];

  //reports amount
  const formattedReports = {};
  const formattedWinLose = {};
  const reports = await getUserReports(username);

  reports.forEach((report) => {
    const date = new Date(report.time);
    const day = date.getDate();
    const month = date.getMonth() + 1;

    const dayString = day < 10 ? `0${day}` : `${day}`;
    const monthString = month < 10 ? `0${month}` : `${month}`;
    const dayMonth = `${dayString}.${monthString}`;

    if (!formattedReports[dayMonth]) {
      formattedReports[dayMonth] = { name: dayMonth, attacker: 0, defender: 0 };
      formattedWinLose[dayMonth] = { name: dayMonth, wins: 0, loses: 0 };
    }

    if (report.attacker.name === username) {
      formattedReports[dayMonth].attacker += 1;
      if (report.winner === "attacker") {
        formattedWinLose[dayMonth].wins += 1;
      } else if (report.winner === "defender") {
        formattedWinLose[dayMonth].loses += 1;
      }
    }

    if (report.defender.name === username) {
      formattedReports[dayMonth].defender += 1;
      if (report.winner === "defender") {
        formattedWinLose[dayMonth].wins += 1;
      } else if(report.winner === "attacker") {
        formattedWinLose[dayMonth].loses += 1;
      }
    }
  });

  const arrayFormattedReports = Object.values(formattedReports).reverse();
  const arrayFormattedWinLose = Object.values(formattedWinLose).reverse();

  const weaponsDict = convertDbMapToDict(weapons);
  const arrayFormattedWeapons = Object.keys(weaponsDict).map((key) => ({
    name: weaponsDict[key].name,
    value: weaponsDict[key].quantity,
  }));

  const arrayFormattedBank = Object.keys(bank)
    .map((key) => {
      if (resourceTranslationMap[key]) {
        return {
          name: resourceTranslationMap[key],
          value: bank[key],
        };
      }
    })
    .filter((item) => item !== undefined);

  return {
    workersDistribution: formattedResources,
    playerPowerDistribution: userPowerLevel,
    reportsTypeDistribution: arrayFormattedReports,
    reportsWinLoseDistribution: arrayFormattedWinLose,
    weaponsDistribution: arrayFormattedWeapons,
    bankDistribution: arrayFormattedBank,
  };
};
