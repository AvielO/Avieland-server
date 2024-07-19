import { getUserByUsername } from "../db/users.js";
import ValidationError from "../utils/errorsTypes.js";

const COPPER_WORKER_COST = 100;
const SILVER_WORKER_COST = 100;
const GOLD_WORKER_COST = 100;

export const hireWorkers = async (
  username,
  copperWorkersQuantity,
  silverWorkersQuantity,
  goldWorkersQuantity
) => {
  if (
    isNaN(copperWorkersQuantity) ||
    isNaN(silverWorkersQuantity) ||
    isNaN(goldWorkersQuantity)
  ) {
    throw new ValidationError("כמות עובדים חייבת להכיל מספר שלם", 400);
  } else if (
    copperWorkersQuantity < 0 ||
    silverWorkersQuantity < 0 ||
    goldWorkersQuantity < 0
  ) {
    throw new ValidationError("כמות העובדים חייבת להכיל מספר הגדול מ0", 400);
  }
  const user = await getUserByUsername(username);
  if (!user) return;

  const copperCost = copperWorkersQuantity * COPPER_WORKER_COST;
  const silverCost = silverWorkersQuantity * SILVER_WORKER_COST;
  const goldCost = goldWorkersQuantity * GOLD_WORKER_COST;

  const { copper, silver, gold } = user.resources;

  const copperRemaining = copper - copperCost;
  const silverRemaining = silver - silverCost;
  const goldRemaining = gold - goldCost;

  if (copperRemaining >= 0 && silverRemaining >= 0 && goldRemaining >= 0) {
    user.resources.copper = copperRemaining;
    user.resources.silver = silverRemaining;
    user.resources.gold = goldRemaining;

    user.workers.copper += +copperWorkersQuantity;
    user.workers.silver += +silverWorkersQuantity;
    user.workers.gold += +goldWorkersQuantity;

    await user.save();

    const updatedWorkersQuantity = {
      ...user.workers,
      copper: user.workers.copper,
      silver: user.workers.silver,
      gold: user.workers.gold,
    };

    const updatedResources = {
      copper: user.resources.copper,
      silver: user.resources.silver,
      gold: user.resources.gold,
      diamond: user.resources.diamond,
    };

    return { updatedWorkersQuantity, updatedResources };
  } else {
    throw new ValidationError("אין לך מספיק משאבים", 403);
  }
};
