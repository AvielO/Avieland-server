import ValidationError from "./errorsTypes.js";

export const sumWorkers = (obj) => {
  let sum = 0;
  for (const key in obj) {
    if (typeof obj[key] === "number") {
      sum += obj[key];
    }
  }
  return sum;
};

export const formatUserData = (users) => {
  const formatedUserData = users.map((user, index) => {
    const workersAmount = sumWorkers(user.workers);
    return {
      index,
      id: user.id,
      username: user.username,
      type: user.type,
      gold: user.resources.gold,
      workers: workersAmount,
      soliders: user.soliders,
      group: user.group,
    };
  });
  return formatedUserData;
};

export const convertDbMapToDict = (DBMap) => {
  const convertedMap = Object.fromEntries(
    Array.from(DBMap.entries(), ([key, value]) => [key, value.toObject()])
  );
  return convertedMap;
};

export const calculateAttackPowerLevel = (weapons, solidersAmount) => {
  const attackPowerLevel =
    Object.values(weapons).reduce(
      (sum, item) => sum + item["quantity"] * item["attack"],
      0
    ) * solidersAmount;

  return attackPowerLevel;
};

export const calculateDefensePowerLevel = (weapons, solidersAmount) => {
  const defensePowerLevel =
    Object.values(weapons).reduce(
      (sum, item) => sum + item["quantity"] * item["defense"],
      0
    ) * solidersAmount;
  return defensePowerLevel;
};

export const calculateTimeUntilNextFiveMinute = () => {
  const now = new Date();
  const minutes = now.getMinutes();
  const nextFiveMinuteMark = Math.ceil((minutes + 1) / 5) * 5;
  const nextFiveMinute = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    nextFiveMinuteMark
  );
  const timeUntilNextFiveMinute = Math.round(
    Math.max(0, (nextFiveMinute - now) / 1000)
  ); // time in seconds

  return timeUntilNextFiveMinute;
};

export const usernameValidation = (username) => {
  const usernameLength = username.length;
  if (usernameLength < 3 || usernameLength > 16) {
    throw new ValidationError("שם המשתמש חייב להכיל בין 3 ל16 תווים", 404);
  }
};

export const passwordValidation = (password) => {
  const passwordLength = password.length;
  if (passwordLength < 6 || passwordLength > 24) {
    throw new ValidationError("הסיסמה חייבת להכין בין 6 ל24 תווים", 404);
  }
};
