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
