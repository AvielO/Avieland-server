import { getUserByUsername } from "../db/users.js";

const SOLIDER_COST = 100;

export const hireSoliders = async (username, solidersQuantity) => {
  if (isNaN(solidersQuantity)) {
    throw new Error("Not a number");
  } else if (solidersQuantity <= 0) {
    throw new Error("Please provide number above 0");
  }
  const user = await getUserByUsername(username);
  if (!user) return;

  const { gold } = user.resources;
  const soliderCost = solidersQuantity * SOLIDER_COST;

  const goldRemaining = gold - soliderCost;

  if (goldRemaining >= 0) {
    user.resources.gold = goldRemaining;
    user.soliders += +solidersQuantity;

    await user.save();

    const updatedSolidersQuantity = user.soliders;
    const updatedResources = {
      copper: user.resources.copper,
      silver: user.resources.silver,
      gold: user.resources.gold,
      diamond: user.resources.diamond,
    };

    return { updatedSolidersQuantity, updatedResources };
  } else {
    throw new Error("Have no enough resources");
  }
};
