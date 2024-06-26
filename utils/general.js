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

export const calculateAttackPowerLevel = (weapons) => {
  const attackPowerLevel = Object.values(weapons).reduce(
    (sum, item) => sum + item["quantity"] * item["attack"],
    0
  );
  return attackPowerLevel;
};

export const calculateDefensePowerLevel = (weapons) => {
  const defensePowerLevel = Object.values(weapons).reduce(
    (sum, item) => sum + item["quantity"] * item["defense"],
    0
  );
  return defensePowerLevel;
};
